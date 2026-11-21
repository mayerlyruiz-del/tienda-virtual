import { products as initialProducts } from '../data/products';
import { categories } from '../data/categories';
import type { Category, Product } from '../types';

const STORAGE_KEY = 'tienda-productos';

// Los datos que se envían al crear o editar un producto (sin el id)
export type ProductInput = Omit<Product, 'id'>;

function delay<T>(data: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), 500));
}

// Lectura directa, sin demora. También la usa el servicio de pedidos.
export function readProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Product[]) : initialProducts;
  } catch {
    return initialProducts;
  }
}

function saveProducts(list: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Reglas que debe cumplir un producto. Devuelve un mensaje si algo está mal.
function checkInput(input: ProductInput, list: Product[], ignoreId?: number): string | null {
  if (input.name.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
  if (!Number.isFinite(input.price) || input.price <= 0) return 'El precio debe ser mayor que 0.';
  if (!Number.isInteger(input.stock) || input.stock < 0) {
    return 'El stock debe ser un número entero de 0 en adelante.';
  }
  if (!categories.some((c) => c.id === input.categoryId)) return 'La categoría no existe.';

  const repeated = list.some(
    (p) => p.id !== ignoreId && p.name.trim().toLowerCase() === input.name.trim().toLowerCase(),
  );
  if (repeated) return 'Ya existe un producto con ese nombre.';

  return null;
}

export function getProducts(): Promise<Product[]> {
  return delay(readProducts());
}

export function getCategories(): Promise<Category[]> {
  return delay(categories);
}

export function getProductById(id: number): Promise<Product | undefined> {
  return delay(readProducts().find((p) => p.id === id));
}

export function createProduct(input: ProductInput): Promise<Product> {
  const list = readProducts();
  const problem = checkInput(input, list);
  if (problem) return Promise.reject(new Error(problem));

  const product: Product = { id: Math.max(0, ...list.map((p) => p.id)) + 1, ...input };
  saveProducts([...list, product]);
  return delay(product);
}

export function updateProduct(id: number, input: ProductInput): Promise<Product> {
  const list = readProducts();
  const index = list.findIndex((p) => p.id === id);
  if (index === -1) return Promise.reject(new Error('El producto no existe.'));

  const problem = checkInput(input, list, id);
  if (problem) return Promise.reject(new Error(problem));

  const updated: Product = { id, ...input };
  list[index] = updated;
  saveProducts(list);
  return delay(updated);
}

export function deleteProduct(id: number): Promise<void> {
  const list = readProducts();
  if (!list.some((p) => p.id === id)) {
    return Promise.reject(new Error('El producto no existe.'));
  }
  saveProducts(list.filter((p) => p.id !== id));
  return delay(undefined);
}