import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/useCart';
import { createOrder } from '../services/orderService';
import { formatPrice } from '../utils/format';

interface FormValues {
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPhone: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const campos: { name: keyof FormValues; label: string; placeholder: string }[] = [
  { name: 'shippingName', label: 'Nombre de quien recibe', placeholder: 'Nombre y apellido' },
  { name: 'shippingAddress', label: 'Dirección', placeholder: 'Calle 10 # 5-20' },
  { name: 'shippingCity', label: 'Ciudad', placeholder: 'Popayán' },
  { name: 'shippingPhone', label: 'Teléfono', placeholder: '3001234567' },
];

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.shippingName.trim().length < 3) {
    errors.shippingName = 'Escribe el nombre completo (mínimo 3 letras).';
  }
  if (values.shippingAddress.trim().length < 5) {
    errors.shippingAddress = 'Escribe una dirección válida (mínimo 5 caracteres).';
  }
  if (!values.shippingCity.trim()) {
    errors.shippingCity = 'Escribe la ciudad.';
  }
  if (!/^\d{7,10}$/.test(values.shippingPhone.trim())) {
    errors.shippingPhone = 'El teléfono debe tener entre 7 y 10 números, sin espacios.';
  }
  return errors;
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [values, setValues] = useState<FormValues>({
    shippingName: user?.name ?? '',
    shippingAddress: '',
    shippingCity: '',
    shippingPhone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function handleChange(name: keyof FormValues, value: string) {
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: undefined });
    setSubmitError('');
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSending(true);
    createOrder(user.id, items, values)
      .then((order) => {
        clearCart();
        navigate('/pedidos', { state: { newOrderId: order.id } });
      })
      .catch((err: Error) => setSubmitError(err.message))
      .finally(() => setSending(false));
  }

  if (items.length === 0) {
    return (
      <section>
        <h1>Datos de entrega</h1>
        <p className="mensaje">No hay productos en el carrito.</p>
        <p className="mensaje">
          <Link className="btn" to="/">Ir al catálogo</Link>
        </p>
      </section>
    );
  }

  return (
    <section>
      <h1>Datos de entrega</h1>

      <div className="checkout">
        <form className="formulario" onSubmit={handleSubmit} noValidate>
          {campos.map((c) => (
            <label key={c.name}>
              {c.label}
              <input
                type="text"
                className={errors[c.name] ? 'invalido' : ''}
                placeholder={c.placeholder}
                value={values[c.name]}
                onChange={(e) => handleChange(c.name, e.target.value)}
              />
              {errors[c.name] && <span className="campo-error">{errors[c.name]}</span>}
            </label>
          ))}

          {submitError && <p className="alerta alerta-error">{submitError}</p>}

          <button className="btn" type="submit" disabled={sending}>
            {sending ? 'Enviando pedido...' : 'Confirmar pedido'}
          </button>
          <Link to="/carrito">← Volver al carrito</Link>
        </form>

        <aside className="resumen-pedido">
          <h2>Resumen del pedido</h2>
          <ul>
            {items.map(({ product, quantity }) => (
              <li key={product.id}>
                <span>
                  {quantity} × {product.name}
                </span>
                <span>{formatPrice(product.price * quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="resumen-total">Total: {formatPrice(totalPrice)}</p>
        </aside>
      </div>
    </section>
  );
}

