import React, { useState, useEffect, useCallback } from 'react';
import { STATUS_LIST, authHeaders, jsonHeaders } from './constants';
import { Spinner, EmptyState, Modal, Field, StatusBadge } from './shared';
import { Icon } from './icons';
import { API_BASE_URL } from '../../services/config';

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [instrModal, setInstrModal] = useState(null);
  const [instrText, setInstrText] = useState('');
  const [dateModal, setDateModal] = useState(null);
  const [dateValue, setDateValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set('status_id', filterStatus);
      if (filterTeam) params.set('team_id', filterTeam);

      const [ordersResponse, teamsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/manager/orders?${params}`, { headers: authHeaders() }),
        fetch(`${API_BASE_URL}/teams/`, { headers: authHeaders() }),
      ]);

      const [orderData, teamData] = await Promise.all([ordersResponse.json(), teamsResponse.json()]);
      setOrders(Array.isArray(orderData) ? orderData : []);
      setTeams(Array.isArray(teamData) ? teamData : []);
    } catch {
      setError('Помилка завантаження');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterTeam]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const patch = async (id, body) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/manager/orders/${id}`, {
        method: 'PATCH',
        headers: jsonHeaders(),
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error((await response.json()).detail);
      fetchAll();
    } catch (e) {
      setError(e.message || 'Помилка');
    } finally {
      setSaving(false);
    }
  };

  const saveDate = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/manager/schedules`, {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify({ order_id: dateModal.id, scheduled_date: dateValue }),
      });
      if (!response.ok) throw new Error((await response.json()).detail);
      setDateModal(null);
      fetchAll();
    } catch (e) {
      setError(e.message || 'Помилка');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mgr-section">
      <div className="mgr-section__header">
        <h2 className="mgr-page-title">Замовлення</h2>
        <div className="mgr-section__actions mgr-section__actions--filter">
          <select className="mgr-input mgr-input--select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Всі статуси</option>
            {STATUS_LIST.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select className="mgr-input mgr-input--select" value={filterTeam} onChange={e => setFilterTeam(e.target.value)}>
            <option value="">Всі бригади</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="mgr-error-box">{error}</div>}

      {loading ? (
        <Spinner />
      ) : !orders.length ? (
        <EmptyState text="Замовлень за вибраними фільтрами не знайдено." />
      ) : (
        <div className="mgr-orders-list">
          {orders.map(order => (
            <div key={order.id} className="mgr-order-card">
              <div className="mgr-order-card__content">
                <div className="mgr-order-card__header">
                  <span className="mgr-order-card__title">#{order.id} — {order.service?.name ?? `Послуга #${order.service_id}`}</span>
                  <span className="mgr-order-card__status"><StatusBadge status={order.status?.name ?? order.status} /></span>
                </div>
                <div className="mgr-order-card__meta">
                  <span className="mgr-meta-item">{Icon.user} {order.user?.email ?? `Клієнт #${order.user_id}`}</span>
                  <span className="mgr-meta-item">{Icon.pin} {order.plot?.address ?? `Ділянка #${order.plot_id}`}</span>
                  {order.scheduled_date && <span className="mgr-meta-item">{Icon.calendar} {new Date(order.scheduled_date).toLocaleDateString('uk-UA')}</span>}
                  {order.team && <span className="mgr-meta-item">{Icon.users} {order.team.name}</span>}
                </div>
                {order.comment && <p className="mgr-order-card__comment">{order.comment}</p>}
                {order.manager_instructions && (
                  <div className="mgr-order-card__instructions">
                    <span>{order.manager_instructions}</span>
                  </div>
                )}
              </div>
              <div className="mgr-order-card__actions">
                <select className="mgr-input mgr-input--select" value={order.team_id ?? ''}
                  onChange={e => patch(order.id, { team_id: e.target.value ? Number(e.target.value) : null })}>
                  <option value="">Без бригади</option>
                  {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
                </select>
                <button type="button" className="mgr-button mgr-button--outlined mgr-button--small" onClick={() => { setInstrModal(order); setInstrText(order.manager_instructions || ''); }}>{Icon.note} Інструкції</button>
                <button type="button" className="mgr-button mgr-button--outlined mgr-button--small" onClick={() => { setDateModal(order); setDateValue(order.scheduled_date?.slice(0, 10) || ''); }}>{Icon.calendar} Дата</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {instrModal && (
        <Modal title={`Інструкції — Замовлення #${instrModal.id}`} onClose={() => setInstrModal(null)}>
          <Field label="Інструкції для бригади">
            <textarea className="mgr-input mgr-input--textarea" value={instrText} onChange={e => setInstrText(e.target.value)} placeholder="Детальні вказівки щодо виконання замовлення..." />
          </Field>
          <div className="mgr-modal__actions">
            <button type="button" className="mgr-button mgr-button--outlined" onClick={() => setInstrModal(null)}>Скасувати</button>
            <button type="button" className="mgr-button mgr-button--primary" onClick={async () => { await patch(instrModal.id, { manager_instructions: instrText }); setInstrModal(null); }} disabled={saving}>Зберегти</button>
          </div>
        </Modal>
      )}

      {dateModal && (
        <Modal title={`Дата виконання — Замовлення #${dateModal.id}`} onClose={() => setDateModal(null)} width={380}>
          <Field label="Дата виконання">
            <input className="mgr-input" type="date" value={dateValue} onChange={e => setDateValue(e.target.value)} />
          </Field>
          <div className="mgr-modal__actions">
            <button type="button" className="mgr-button mgr-button--outlined" onClick={() => setDateModal(null)}>Скасувати</button>
            <button type="button" className="mgr-button mgr-button--primary" onClick={saveDate} disabled={saving || !dateValue}>Зберегти</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
