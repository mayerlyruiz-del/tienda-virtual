import { useEffect, useState, type FormEvent } from 'react';
import {
  createProduct,
  deleteProduct,
  getCategories,
  getProducts,
  updateProduct,
  type ProductInput,
} from '../services/productService';
import { formatPrice } from '../utils/format';
import type { Category, Product } from '../types';

interface FormValues {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  imageUrl: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const vacio: FormValues = {
  name: '',
  description: '',
  price: '',
  stock: '',
  categoryId: '',
  imageUrl: '',
};

function validate(v: FormValues): FormErrors {
  const e: FormErrors = {};
  if (v.name.trim().length < 3) e.name = 'El nombre debe tener al menos 3 caracteres.';
  if (v.description.trim().length < 10) {
    e.description = 'La descripción debe tener al menos 10 caracteres.';
  }
  if (v.price === '' || Number(v.price) <= 0) e.price = 'El precio debe ser mayor que 0.';
  if (v.stock === '' || !Number.isInteger(Number(v.stock)) || Number(v.stock) < 0) {
    e.stock = 'El stock debe ser un número entero de 0 en adelante.';
  }
  if (!v.categoryId) e.categoryId = 'Elige una categoría.';
  return e;
}

interface Message {
  type: 'ok' | 'error';
  text: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // null = formulario cerrado, 'new' = creando, número = editando ese producto
  const [editing, setEditing] = useState<number | 'new' | null>(null);
  const [values, setValues] = useState<FormValues>(vacio);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch(() => setError('No se pudieron cargar los productos. Intenta de nuevo.'))
      .finally(() => setLoading(false));
  }, []);

  function startNew() {
    setEditing('new');
    setValues(vacio);
    setErrors({});
    setMessage(null);
  }

  function startEdit(p: Product) {
    setEditing(p.id);
    setValues({
      name: p.name,
      description: p.description,
      price: String(p.price),
      stock: String(p.stock),
      categoryId: String(p.categoryId),
      imageUrl: p.imageUrl,
    });
    setErrors({});
    setMessage(null);
  }

  function cancel() {
    setEditing(null);
    setErrors({});
  }

  function handleChange(name: keyof FormValues, value: string) {
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (editing === null) return;

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const name = values.name.trim();
    const input: ProductInput = {
      name,
      description: values.description.trim(),
      price: Number(values.price),
      stock: Number(values.stock),
      categoryId: Number(values.categoryId),
      imageUrl:
        values.imageUrl.trim() ||
        `https://placehold.co/400x300?text=${encodeURIComponent(name)}`,
    };

    setSaving(true);
    const action = editing === 'new' ? createProduct(input) : updateProduct(editing, input);
    action
      .then((saved) => {
        setProducts((prev) =>
          editing === 'new'
            ? [...prev, saved]
            : prev.map((p) => (p.id === saved.id ? saved : p)),
        );
        setMessage({
          type: 'ok',
          text:
            editing === 'new'
              ? `Producto "${saved.name}" creado.`
              : `Producto "${saved.name}" actualizado.`,
        });
        setEditing(null);
      })
      .catch((err: Error) => setMessage({ type: 'error', text: err.message }))
      .finally(() => setSaving(false));
  }

  function handleDelete(p: Product) {
    if (!window.confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return;

    deleteProduct(p.id)
      .then(() => {
        setProducts((prev) => prev.filter((x) => x.id !== p.id));
        setMessage({ type: 'ok', text: `Producto "${p.name}" eliminado.` });
      })
      .catch((err: Error) => setMessage({ type: 'error', text: err.message }));
  }

  if (loading) return <p className="mensaje">Cargando productos...</p>;
  if (error) return <p className="mensaje mensaje-error">{error}</p>;

  return (
    <section>
      <div className="barra-titulo">
        <h1>Administración de productos</h1>
        {editing === null && (
          <button className="btn" onClick={startNew}>
            + Nuevo producto
          </button>
        )}
      </div>

      {message && (
        <p className={message.type === 'ok' ? 'alerta alerta-ok' : 'alerta alerta-error'}>
          {message.text}
        </p>
      )}

      {editing !== null && (
        <form className="formulario formulario-ancho" onSubmit={handleSubmit} noValidate>
          <h2>{editing === 'new' ? 'Nuevo producto' : 'Editar producto'}</h2>

          <label>
            Nombre
            <input
              type="text"
              className={errors.name ? 'invalido' : ''}
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            {errors.name && <span className="campo-error">{errors.name}</span>}
          </label>

          <label>
            Descripción
            <textarea
              rows={3}
              className={errors.description ? 'invalido' : ''}
              value={values.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
            {errors.description && <span className="campo-error">{errors.description}</span>}
          </label>

          <label>
            Precio (COP)
            <input
              type="number"
              min="0"
              className={errors.price ? 'invalido' : ''}
              value={values.price}
              onChange={(e) => handleChange('price', e.target.value)}
            />
            {errors.price && <span className="campo-error">{errors.price}</span>}
          </label>

          <label>
            Stock (unidades)
            <input
              type="number"
              min="0"
              className={errors.stock ? 'invalido' : ''}
              value={values.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
            />
            {errors.stock && <span className="campo-error">{errors.stock}</span>}
          </label>

          <label>
            Categoría
            <select
              className={errors.categoryId ? 'invalido' : ''}
              value={values.categoryId}
              onChange={(e) => handleChange('categoryId', e.target.value)}
            >
              <option value="">Elige una categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <span className="campo-error">{errors.categoryId}</span>}
          </label>

          <label>
            Dirección de la imagen (opcional)
            <input
              type="text"
              placeholder="https://..."
              value={values.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
            />
          </label>

          <div className="resumen-botones">
            <button className="btn" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button className="btn btn-gris" type="button" onClick={cancel}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{categories.find((c) => c.id === p.categoryId)?.name}</td>
                <td>{formatPrice(p.price)}</td>
                <td>
                  {p.stock === 0 ? <span className="badge badge-rojo">Agotado</span> : p.stock}
                </td>
                <td>
                  <div className="resumen-botones">
                    <button className="btn-mini" onClick={() => startEdit(p)}>
                      Editar
                    </button>
                    <button className="btn-mini btn-peligro" onClick={() => handleDelete(p)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}