import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { formatPrice } from '../utils/format';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();

  function handleClear() {
    if (window.confirm('¿Seguro que quieres vaciar el carrito?')) {
      clearCart();
    }
  }

  if (items.length === 0) {
    return (
      <section>
        <h1>Carrito</h1>
        <p className="mensaje">Tu carrito está vacío.</p>
        <p className="mensaje">
          <Link className="btn" to="/">Ir al catálogo</Link>
        </p>
      </section>
    );
  }

  return (
    <section>
      <h1>Carrito</h1>

      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ product, quantity }) => (
              <tr key={product.id}>
                <td>
                  <Link to={`/producto/${product.id}`}>{product.name}</Link>
                </td>
                <td>{formatPrice(product.price)}</td>
                <td>
                  <div className="cantidad">
                    <button
                      className="btn-mini"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span>{quantity}</span>
                    <button
                      className="btn-mini"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{formatPrice(product.price * quantity)}</td>
                <td>
                  <button className="btn-mini btn-peligro" onClick={() => removeItem(product.id)}>
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="resumen">
        <p className="resumen-total">Total: {formatPrice(totalPrice)}</p>
        <p className="resumen-nota">
          Este total es solo informativo. Cuando exista el Backend, el servidor volverá a
          calcularlo con los precios reales.
        </p>
        <div className="resumen-botones">
          <button className="btn btn-gris" onClick={handleClear}>
            Vaciar carrito
          </button>
          <button className="btn" onClick={() => navigate('/checkout')}>
            Continuar con la compra
          </button>
        </div>
      </div>
    </section>
  );
}