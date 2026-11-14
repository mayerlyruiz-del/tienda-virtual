import type { Order } from '../types';

export const orders: Order[] = [
  {
    id: 1,
    userId: 2,
    createdAt: '2026-11-02T10:30:00',
    total: 315000,
    status: 'entregado',
    shippingName: 'Cliente Uno',
    shippingAddress: 'Calle 10 # 5-20',
    shippingCity: 'Cali',
    shippingPhone: '3001112233',
    items: [
      { id: 1, productId: 1, productName: 'Teclado mecánico', quantity: 1, unitPrice: 185000 },
      { id: 2, productId: 2, productName: 'Mouse inalámbrico', quantity: 2, unitPrice: 65000 },
    ],
  },
  {
    id: 2,
    userId: 2,
    createdAt: '2026-11-10T16:45:00',
    total: 131000,
    status: 'enviado',
    shippingName: 'Cliente Uno',
    shippingAddress: 'Calle 10 # 5-20',
    shippingCity: 'Cali',
    shippingPhone: '3001112233',
    items: [
      { id: 3, productId: 11, productName: 'Libro de bases de datos', quantity: 1, unitPrice: 95000 },
      { id: 4, productId: 9, productName: 'Cuerda para saltar', quantity: 2, unitPrice: 18000 },
    ],
  },
  {
    id: 3,
    userId: 3,
    createdAt: '2026-11-12T09:15:00',
    total: 265000,
    status: 'pendiente',
    shippingName: 'Cliente Dos',
    shippingAddress: 'Carrera 7 # 12-34',
    shippingCity: 'Medellín',
    shippingPhone: '3004445566',
    items: [
      { id: 5, productId: 5, productName: 'Juego de ollas', quantity: 1, unitPrice: 210000 },
      { id: 6, productId: 6, productName: 'Lámpara de escritorio', quantity: 1, unitPrice: 55000 },
    ],
  },
  {
    id: 4,
    userId: 3,
    createdAt: '2026-10-28T18:20:00',
    total: 158000,
    status: 'cancelado',
    shippingName: 'Cliente Dos',
    shippingAddress: 'Carrera 7 # 12-34',
    shippingCity: 'Medellín',
    shippingPhone: '3004445566',
    items: [
      { id: 7, productId: 8, productName: 'Balón de fútbol', quantity: 1, unitPrice: 80000 },
      { id: 8, productId: 12, productName: 'Libro de programación web', quantity: 1, unitPrice: 78000 },
    ],
  },
];