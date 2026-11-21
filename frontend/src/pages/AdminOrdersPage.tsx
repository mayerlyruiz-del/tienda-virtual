import { useEffect, useState } from 'react';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { users } from '../data/users';
import {
  allowedTransitions,
  getAllOrders,
  updateOrderStatus,
} from '../services/orderService';
import { formatDate, formatPrice } from '../utils/format';
import type { Order, OrderStatus } from '../types';

const estados: OrderStatus[] = ['pendiente', 'enviado', 'entregado', 'cancelado'];

const textoBoton: Record<OrderStatus, string> = {
  pendiente: 'Volver a pendiente',
  enviado: 'Marcar como enviado',
  entregado: 'Marcar como entregado',
  cancelado: 'Cancelar pedido',
};

interface Message {
  type: 'ok' | 'error';
  text: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState<Message | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .catch(() => setError('No se pudieron cargar los pedidos. Intenta de nuevo.'))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(order: Order, status: OrderStatus) {
    if (status === 'cancelado' && !window.confirm(`¿Seguro que quieres cancelar el pedido #${order.id}?`)) {
      return;
    }

    setBusyId(order.id);
    setMessage(null);
    updateOrderStatus(order.id, status)
      .then((updated) => {
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        setMessage({ type: 'ok', text: `El pedido #${updated.id} cambió a "${status}".` });
      })
      .catch((err: Error) => setMessage({ type: 'error', text: err.message }))
      .finally(() => setBusyId(null));
  }

  if (loading) return <p className="mensaje">Cargando pedidos...</p>;
  if (error) return <p className="mensaje mensaje-error">{error}</p>;

  const shown = filter ? orders.filter((o) => o.status === filter) : orders;

  return (
    <section>
      <h1>Administración de pedidos</h1>

      <div className="filtros">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Todos los estados</option>
          {estados.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <span className="resultados">{shown.length} pedido(s)</span>
      </div>

      {message && (
        <p className={message.type === 'ok' ? 'alerta alerta-ok' : 'alerta alerta-error'}>
          {message.text}
        </p>
      )}

      {shown.length === 0 && <p className="mensaje">No hay pedidos con ese estado.</p>}

      {shown.map((order) => {
        const client = users.find((u) => u.id === order.userId);
        const nextStates = allowedTransitions[order.status];

        return (
          <article key={order.id} className="pedido">
            <div className="pedido-cabecera">
              <strong>Pedido #{order.id}</strong>
              <span>{formatDate(order.createdAt)}</span>
              <OrderStatusBadge status={order.status} />
            </div>

            <p className="pedido-cliente">
              Cliente: {client ? `${client.name} (${client.email})` : 'Usuario desconocido'}
            </p>

            <ul className="pedido-items">
              {order.items.map((item) => (
                <li key={item.id}>
                  <span>
                    {item.quantity} × {item.productName}
                  </span>
                  <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <p className="pedido-envio">
              Entrega: {order.shippingName} · {order.shippingAddress}, {order.shippingCity} ·
              Tel. {order.shippingPhone}
            </p>
            <p className="pedido-total">Total: {formatPrice(order.total)}</p>

            <div className="pedido-acciones">
              {nextStates.length === 0 ? (
                <span className="pedido-envio">Este pedido ya no admite cambios.</span>
              ) : (
                nextStates.map((s) => (
                  <button
                    key={s}
                    className={s === 'cancelado' ? 'btn-mini btn-peligro' : 'btn-mini'}
                    disabled={busyId === order.id}
                    onClick={() => handleChange(order, s)}
                  >
                    {textoBoton[s]}
                  </button>
                ))
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}

