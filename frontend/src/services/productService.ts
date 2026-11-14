import { products } from '../data/products';
import { categories } from '../data/categories';
import type { Category, Product } from '../types';

// Espera medio segundo antes de responder, como lo haría una API real.
// Así podemos mostrar el mensaje "Cargando...".
function simulateDelay<T>(data: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), 500));
}

export function getProducts(): Promise<Product[]> {
  return simulateDelay(products);
}

export function getCategories(): Promise<Category[]> {
  return simulateDelay(categories);
}

export function getProductById(id: number): Promise<Product | undefined> {
  return simulateDelay(products.find((p) => p.id === id));
}