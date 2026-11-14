// Rol del usuario: cliente normal o administrador del catálogo
export type Role = 'cliente' | 'admin';

// Estados por los que pasa un pedido
export type OrderStatus = 'pendiente' | 'enviado' | 'entregado' | 'cancelado';

// Tabla users
export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

// Tabla categories
export interface Category {
  id: number;
  name: string;
  description: string;
}

// Tabla products
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
}

// Tabla order_items: un producto dentro de un pedido.
// unitPrice guarda el precio que tenía el producto al momento de comprar.
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

// Tabla orders
export interface Order {
  id: number;
  userId: number;
  createdAt: string;
  total: number;
  status: OrderStatus;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPhone: string;
  items: OrderItem[];
}

// El carrito solo existe en el navegador (no es una tabla)
export interface CartItem {
  product: Product;
  quantity: number;
}