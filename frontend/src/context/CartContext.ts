import { createContext } from 'react';
import type { CartItem, Product } from '../types';

export interface CartContextValue {
  items: CartItem[];
  // Devuelve un mensaje de error si no se pudo agregar, o null si salió bien
  addItem: (product: Product, quantity: number) => string | null;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);