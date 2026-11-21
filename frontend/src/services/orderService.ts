import { orders as initialOrders } from '../data/orders';
import { readProducts } from './productService';
import type { CartItem, Order, OrderItem, OrderStatus } from '../types';

const STORAGE_KEY = 'tienda-pedidos';

// Estados a los que se puede pasar desde cada estado
export const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  pendiente: ['enviado', 'cancelado'],
  enviado: ['entregado', 'cancelado'],
  entregado: [],
  cancelado: [],
};

export interface ShippingData {
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPhone: string;
}

// Responde con una pequeña demora, como lo haría una API real
function delay<T>(data: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), 400));
}

// Los pedidos se guardan en el navegador para que no se pierdan al recargar
function loadOrders(): Order[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Order[]) : initialOrders;
  } catch {
    return initialOrders;
  }
}

function saveOrders(list: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function newestFirst(list: Order[]): Order[] {
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getAllOrders(): Promise<Order[]> {
  return delay(newestFirst(loadOrders()));
}

export function getOrdersByUser(userId: number): Promise<Order[]> {
  return delay(newestFirst(loadOrders().filter((o) => o.userId === userId)));
}

export function createOrder(
  userId: number,
  cartItems: CartItem[],
  shipping: ShippingData,
): Promise<Order> {
  const list = loadOrders();
  const products = readProducts();
  const items: OrderItem[] = [];
  let total = 0;
  let nextItemId = Math.max(0, ...list.flatMap((o) => o.items.map((i) => i.id))) + 1;

  for (const { product: inCart, quantity } of cartItems) {
    // El precio y el stock se leen de los productos, no del carrito
    const product = products.find((p) => p.id === inCart.id);
    if (!product) {
      return Promise.reject(new Error(`El producto "${inCart.name}" ya no existe.`));
    }
    if (quantity < 1 || quantity > product.stock) {
      return Promise.reject(new Error(`No hay suficiente stock de "${product.name}".`));
    }
    items.push({
      id: nextItemId++,
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: product.price,
    });
    total += product.price * quantity;
  }

  const order: Order = {
    id: Math.max(0, ...list.map((o) => o.id)) + 1,
    userId,
    createdAt: new Date().toISOString(),
    total,
    status: 'pendiente',
    ...shipping,
    items,
  };

  saveOrders([...list, order]);
  return delay(order);
}

export function updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
  const list = loadOrders();
  const index = list.findIndex((o) => o.id === orderId);

  if (index === -1) {
    return Promise.reject(new Error('El pedido no existe.'));
  }
  if (!allowedTransitions[list[index].status].includes(status)) {
    return Promise.reject(
      new Error(`No se puede pasar de "${list[index].status}" a "${status}".`),
    );
  }

  const updated = { ...list[index], status };
  list[index] = updated;
  saveOrders(list);
  return delay(updated);
}