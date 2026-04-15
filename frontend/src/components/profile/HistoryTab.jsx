import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spinner, EmptyState, StatusBadge } from './CommonComponents';
import { ordersAPI } from '../../services/api';

export function HistoryTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    ordersAPI.getMyOrders()
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setError('Не вдалося завантажити замовлення'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="card">
      <h2 className="card-title">Історія замовлень</h2>
      {error && <div className="error-box">{error}</div>}

      {orders.length === 0 ? (
        <EmptyState
          icon="📋"
          text="У вас ще немає жодного замовлення. Оформіть першу послугу для вашої ділянки."
          action={
            <Link to="/services" className="btn-sm">Замовити послугу</Link>
          }
        />
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-item">
              <div className="order-info">
                <p className="order-title">
                  {order.service?.name ?? `Послуга #${order.service_id}`}
                </p>
                <div className="order-meta">
                  <span className="order-detail">📍 {order.plot?.address ?? `Ділянка #${order.plot_id}`}</span>
                  {order.scheduled_time && (
                    <span className="order-detail">📅 {new Date(order.scheduled_time).toLocaleDateString('uk-UA')}</span>
                  )}
                  {order.comment && (
                    <span className="order-detail" style={{ fontStyle: 'italic' }}>💬 {order.comment}</span>
                  )}
                </div>
              </div>
              <div className="order-status-col">
                <StatusBadge status={order.status?.name ?? order.status} />
                <span className="order-id">#{order.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
