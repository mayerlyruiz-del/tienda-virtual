import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCategories, getProductById } from '../services/productService';
import { useCart } from '../context/useCart';
import { formatPrice } from '../utils/format';
import type { Category, Product } from '../types';

interface Feedback {
  type: 'ok' | 'error';
  text: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | undefined>();
  const [category, setCategory] = useState<Category | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    Promise.all([getProductById(Number(id)), getCategories()])
      .then(([p, cats]) => {
        setProduct(p);
        setCategory(cats.find((c) => c.id === p?.categoryId));
      })
      .catch(() => setError('No se pudo cargar el producto. Intenta de nuevo.'))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAdd() {
    if (!product) return;
    const problem = addItem(product, quantity);
    if (problem) {
      setFeedback({ type: 'error', text: problem });
    } else {
      setFeedback({ type: 'ok', text: `Se agregaron ${quantity} unidad(es) al carrito.` });
    }
  }

  if (loading) return <p className="mensaje">Cargando producto...</p>;
  if (error) return <p className="mensaje mensaje-error">{error}</p>;

  if (!product) {
    return (
      <section>
        <p className="mensaje mensaje-error">Este producto no existe.</p>
        <p className="mensaje">
          <Link className="btn" to="/">Volver al catálogo</Link>
        </p>
      </section>
    );
  }

  const agotado = product.stock === 0;

  return (
    <section>
      <Link className="enlace-volver" to="/">← Volver al catálogo</Link>

      <div className="detalle">
        <img src={product.imageUrl} alt={product.name} />

        <div className="detalle-info">
          {category && <span className="card-category">{category.name}</span>}
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p className="card-price">{formatPrice(product.price)}</p>

          {agotado ? (
            <span className="badge badge-rojo">Agotado</span>
          ) : (
            <p>Unidades disponibles: {product.stock}</p>
          )}

          {!agotado && (
            <div className="detalle-compra">
              <label>
                Cantidad
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(Number(e.target.value));
                    setFeedback(null);
                  }}
                />
              </label>
              <button className="btn" onClick={handleAdd}>
                Agregar al carrito
              </button>
            </div>
          )}

          {feedback && (
            <p className={feedback.type === 'ok' ? 'alerta alerta-ok' : 'alerta alerta-error'}>
              {feedback.text}
              {feedback.type === 'ok' && (
                <> <Link to="/carrito">Ver carrito</Link></>
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}