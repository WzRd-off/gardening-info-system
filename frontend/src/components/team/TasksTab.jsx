import React, { useState, useEffect, useCallback } from 'react';
import { Icons } from './Icons.jsx';
import { Spinner } from './Spinner';
import { EmptyState } from './EmptyState';
import { TaskCard } from './TaskCard';
import { TEAM_STATUSES } from './constants';
import { authHeaders, jsonHeaders, resolveStatus } from './utils';
import { API_BASE_URL } from '../../services/config';

export function TasksTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const r = await fetch(`${API_BASE_URL}/teams/orders`, { headers: authHeaders() });
      if (!r.ok) throw new Error('Помилка завантаження');
      const d = await r.json();
      setOrders(Array.isArray(d) ? d : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, statusId) => {
    setUpdating(orderId);
    setError('');
    try {
      const r = await fetch(`${API_BASE_URL}/teams/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: jsonHeaders(),
        body: JSON.stringify({ status_id: statusId }),
      });
      if (!r.ok) throw new Error((await r.json()).detail || 'Помилка оновлення статусу');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status_id: statusId, status: TEAM_STATUSES.find(s => s.id === statusId) } : o));
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filterStatus === 'all'
    ? orders
    : filterStatus === 'active'
      ? orders.filter(o => resolveStatus(o).id !== 4)
      : orders.filter(o => resolveStatus(o).id === 4);

  const counts = {
    total: orders.length,
    active: orders.filter(o => resolveStatus(o).id !== 4).length,
    done: orders.filter(o => resolveStatus(o).id === 4).length,
  };

  return (
    <div className="team-tasks-container">
      {/* Summary cards */}
      <div className="team-summary-grid">
        {[
          { label: 'Всього завдань', value: counts.total, color: 'var(--text-dark)', bg: 'var(--white)' },
          { label: 'В роботі', value: counts.active, color: '#FF9800', bg: '#FFF8F0' },
          { label: 'Виконано', value: counts.done, color: 'var(--primary-green)', bg: 'var(--bg-light)' },
        ].map(c => (
          <div key={c.label} className="team-summary-card" style={{ background: c.bg }}>
            <p className="team-summary-value" style={{ color: c.color }}>{c.value}</p>
            <p className="team-summary-label">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="team-filter-tabs">
        {[
          { key: 'all', label: 'Усі' },
          { key: 'active', label: 'Активні' },
          { key: 'done', label: 'Виконані' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(f.key)}
            className="team-filter-tab"
            style={{
              background: filterStatus === f.key ? 'var(--primary-green)' : 'transparent',
              color: filterStatus === f.key ? '#fff' : 'var(--text-secondary)',
              fontWeight: filterStatus === f.key ? 600 : 400,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="team-error-msg">
          {Icons.alert} {error}
        </div>
      )}

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <EmptyState
          icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
          title={filterStatus === 'done' ? 'Виконаних завдань немає' : 'Завдань немає'}
          sub={filterStatus === 'all' ? 'Менеджер ще не призначив жодного замовлення вашій бригаді' : undefined}
        />
      ) : (
        <div className="team-tasks-list">
          {filtered.map(order => (
            <TaskCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              updating={updating}
            />
          ))}
        </div>
      )}
    </div>
  );
}
