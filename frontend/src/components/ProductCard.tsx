import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { formatPrice } from '../utils/format';

interface Props {
  product: Product;
  categoryName?: string;
}

export default function ProductCard({ product, categoryName }: Props) {
  const agotado = product.stock === 0;
  const pocas = product.stock > 0 && product.stock <= 5;

  return (
    <article className="card">
      <img src={product.imageUrl} alt={product.name} />
      <div className="card-body">
        {categoryName && <span className="card-category">{categoryName}</span>}
        <h3>{product.name}</h3>
        <p className="card-price">{formatPrice(product.price)}</p>
        {agotado && <span className="badge badge-rojo">Agotado</span>}
        {pocas && <span className="badge badge-amarillo">Quedan {product.stock}</span>}
        {!agotado && !pocas && <span className="badge badge-verde">Disponible</span>}
        <Link className="btn" to={`/producto/${product.id}`}>
          Ver detalle
        </Link>
      </div>
    </article>
  );
}