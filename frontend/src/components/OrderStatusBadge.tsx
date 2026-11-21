import type { OrderStatus } from '../types';

const clases: Record<OrderStatus, string> = {
  pendiente: 'badge-amarillo',
  enviado: 'badge-azul',
  entregado: 'badge-verde',
  cancelado: 'badge-rojo',
};

const nombres: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`badge ${clases[status]}`}>{nombres[status]}</span>;
}