import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { getCategories, getProducts } from '../services/productService';
import type { Category, Product } from '../types';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtros
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch(() => setError('No se pudo cargar el catálogo. Intenta de nuevo.'))
      .finally(() => setLoading(false));
  }, []);

  function clearFilters() {
    setSearch('');
    setCategoryId('');
    setMinPrice('');
    setMaxPrice('');
    setOnlyAvailable(false);
  }

  if (loading) return <p className="mensaje">Cargando productos...</p>;
  if (error) return <p className="mensaje mensaje-error">{error}</p>;

  const invalidRange =
    minPrice !== '' && maxPrice !== '' && Number(minPrice) > Number(maxPrice);

  const filtered = invalidRange
    ? []
    : products.filter((p) => {
        const text = search.trim().toLowerCase();
        if (text && !p.name.toLowerCase().includes(text)) return false;
        if (categoryId && p.categoryId !== Number(categoryId)) return false;
        if (minPrice !== '' && p.price < Number(minPrice)) return false;
        if (maxPrice !== '' && p.price > Number(maxPrice)) return false;
        if (onlyAvailable && p.stock === 0) return false;
        return true;
      });

  return (
    <section>
      <h1>Catálogo</h1>

      <div className="filtros">
        <input
          type="search"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          placeholder="Precio mínimo"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          min="0"
          placeholder="Precio máximo"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <label className="filtro-check">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
          />
          Solo disponibles
        </label>
        <button className="btn btn-gris" onClick={clearFilters}>
          Limpiar filtros
        </button>
      </div>

      {invalidRange && (
        <p className="mensaje mensaje-error">
          El precio mínimo no puede ser mayor que el máximo.
        </p>
      )}

      {!invalidRange && filtered.length === 0 && (
        <p className="mensaje">No se encontraron productos con esos filtros.</p>
      )}

      <p className="resultados">{filtered.length} producto(s)</p>

      <div className="grid">
        {filtered.map((p) => (
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