import { useEffect, useState, type ReactNode } from 'react';
import { CartContext } from './CartContext';
import type { CartItem, Product } from '../types';

const STORAGE_KEY = 'tienda-carrito';

// Lee el carrito guardado en el navegador (si existe)
function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  // Cada vez que el carrito cambia, lo guardamos en el navegador
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product: Product, quantity: number): string | null {
    if (quantity < 1) return 'La cantidad debe ser al menos 1.';

    const existing = items.find((i) => i.product.id === product.id);
    const newQuantity = (existing?.quantity ?? 0) + quantity;

    if (newQuantity > product.stock) {
      return `Solo hay ${product.stock} unidad(es) disponibles de este producto.`;
    }

    if (existing) {
      setItems(
        items.map((i) =>
          i.product.id === product.id ? { ...i, quantity: newQuantity } : i,
        ),
      );
    } else {
      setItems([...items, { product, quantity }]);
    }
    return null;
  }

  function updateQuantity(productId: number, quantity: number) {
    setItems(
      items.map((i) =>
        i.product.id === productId
          ? { ...i, quantity: Math.min(Math.max(quantity, 1), i.product.stock) }
          : i,
      ),
    );
  }

  function removeItem(productId: number) {
    setItems(items.filter((i) => i.product.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.product.price, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}