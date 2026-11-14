import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { getCategories, getProducts } from '../services/productService';
import type { Category, Product } from '../types';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch(() => setError('No se pudo cargar el catálogo. Intenta de nuevo.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="mensaje">Cargando productos...</p>;
  if (error) return <p className="mensaje mensaje-error">{error}</p>;

  return (
    <section>
      <h1>Catálogo</h1>
      <div className="grid">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            categoryName={categories.find((c) => c.id === p.categoryId)?.name}
          />
        ))}
      </div>
    </section>
  );
}

