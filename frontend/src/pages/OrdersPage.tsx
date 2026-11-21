import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { useAuth } from '../context/useAuth';
import { getOrdersByUser } from '../services/orderService';
import { formatDate, formatPrice } from '../utils/format';
import type { Order } from '../types';

export default function OrdersPage() {
  const { user } = useAuth();
  const location = useLocation();
  // Si venimos de confirmar un pedido, el checkout nos pasó su número
  const newOrderId = (location.state as { newOrderId?: number } | null)?.newOrderId;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = user?.id;

  useEffect(() => {
    if (userId === undefined) return;
    getOrdersByUser(userId)
      .then(setOrders)
      .catch(() => setError('No se pudieron cargar tus pedidos. Intenta de nuevo.'))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p className="mensaje">Cargando pedidos...</p>;
  if (error) return <p className="mensaje mensaje-error">{error}</p>;

  return (
    <section>
      <h1>Mis pedidos</h1>

      {newOrderId && (
        <p className="alerta alerta-ok">
          ¡Tu pedido #{newOrderId} fue creado con éxito! Quedó en estado pendiente.
        </p>
      )}

      {orders.length === 0 ? (
        <>
          <p className="mensaje">Aún no tienes pedidos.</p>
          <p className="mensaje">
            <Link className="btn" to="/">Ir al catálogo</Link>
          </p>
        </>
      ) : (
        orders.map((order) => (
          <article key={order.id} className="pedido">
            <div className="pedido-cabecera">
              <strong>Pedido #{order.id}</strong>
              <span>{formatDate(order.createdAt)}</span>
              <OrderStatusBadge status={order.status} />
            </div>

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
          </article>
        ))
      )}
    </section>
  );
}