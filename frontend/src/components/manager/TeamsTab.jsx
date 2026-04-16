import React, { useState, useEffect, useCallback } from 'react';
import { statusMeta } from '../../constants/appConstants';
import { Spinner, EmptyState, Modal, Field } from './shared';
import { Icon } from '../../constants/Icons';
import { managerAPI, teamsAPI } from '../../services/api';

export default function TeamsTab() {
  const [teams, setTeams] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [teamData, orderData] = await Promise.all([
        teamsAPI.getAll(),
        managerAPI.getOrders(),
      ]);
      setTeams(Array.isArray(teamData) ? teamData : []);
      setOrders(Array.isArray(orderData) ? orderData : []);
      setError('');
    } catch (err) {
      setError('Помилка завантаження');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const teamStats = teamId => {
    const teamOrders = orders.filter(order => order.team_id === teamId);
    if (!teamOrders.length) return null;
    const done = teamOrders.filter(order => statusMeta(order.status?.name ?? order.status).id === 4).length;
    const inWork = teamOrders.filter(order => [2, 3].includes(statusMeta(order.status?.name ?? order.status).id)).length;
    const problems = teamOrders.filter(order => statusMeta(order.status?.name ?? order.status).id === 5).length;
    const pending = teamOrders.filter(order => statusMeta(order.status?.name ?? order.status).id === 1).length;
    const efficiency = Math.round((done / teamOrders.length) * 100);
    return { total: teamOrders.length, done, inWork, problems, pending, efficiency };
  };

  const effColor = efficiency => efficiency >= 75 ? '#007D00' : efficiency >= 40 ? '#FF9800' : '#D32F2F';
  const effLabel = efficiency => efficiency >= 75 ? 'Висока' : efficiency >= 40 ? 'Середня' : 'Низька';

  const handleCreate = async () => {
    if (!newTeam.name.trim()) {
      setError('Назва бригади обов\'язкова');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await teamsAPI.createTeam(newTeam.name, newTeam.email);
      setShowCreate(false);
      setNewTeam({ name: '', email: '' });
      await fetchAll();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mgr-section">
      <div className="mgr-section__header">
        <h2 className="mgr-page-title">Бригади</h2>
        <button type="button" className="mgr-button mgr-button--primary" onClick={() => setShowCreate(true)}>{Icon.plus} Створити бригаду</button>
      </div>

      {error && <div className="mgr-error-box">{error}</div>}

      {loading ? (
        <Spinner />
      ) : !teams.length ? (
        <EmptyState text="Бригад ще немає. Створіть першу бригаду." />
      ) : (
        <div className="mgr-grid-list">
          {teams.map(team => {
            const stats = teamStats(team.id);
            return (
              <div key={team.id} className="mgr-team-card">
                <div className="mgr-team-card__header">
                  <div>
                    <h3>{team.name}</h3>
                    {team.leader && <p className="mgr-team-card__leader">{Icon.user} {team.leader}</p>}
                  </div>
                </div>

                {stats === null ? (
                  <p className="mgr-team-card__empty">Замовлень ще не призначено</p>
                ) : (
                  <>
                    <div className="mgr-team-card__stats">
                      {[
                        { label: 'Всього', value: stats.total, color: '#1A1A1A' },
                        { label: 'Виконано', value: stats.done, color: '#007D00' },
                        { label: 'В роботі', value: stats.inWork, color: '#FF9800' },
                        { label: 'Очікують', value: stats.pending, color: '#2196F3' },
                      ].map(item => (
                        <div key={item.label} className="mgr-team-card__stat">
                          <p style={{ color: item.color }}>{item.value}</p>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>

                    {stats.problems > 0 && (
                      <div className="mgr-team-card__warning">Проблемних замовлень: {stats.problems}</div>
                    )}

                    <div className="mgr-team-card__efficiency">
                      <div className="mgr-team-card__efficiency-row">
                        <span className="mgr-team-card__efficiency-label">{Icon.chartBar} Ефективність</span>
                        <div className="mgr-team-card__efficiency-status">
                          <span style={{ color: effColor(stats.efficiency) }}>{stats.efficiency}%</span>
                          <span style={{ background: effColor(stats.efficiency) + '22', color: effColor(stats.efficiency) }}>{effLabel(stats.efficiency)}</span>
                        </div>
                      </div>
                      <div className="mgr-team-card__progress">
                        <div className="mgr-team-card__progress-fill" style={{ width: `${stats.efficiency}%`, background: effColor(stats.efficiency) }} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <Modal title="Нова бригада" onClose={() => setShowCreate(false)} width={420}>
          {error && <div className="mgr-error-box mgr-error-box--modal">{error}</div>}
          <div className="mgr-form-grid">
            <Field label="Назва бригади *">
              <input className="mgr-input" value={newTeam.name} onChange={e => setNewTeam(p => ({ ...p, name: e.target.value }))} placeholder="Бригада №1" />
            </Field>
            <Field label="Лідер (email)">
              <input className="mgr-input" value={newTeam.email} onChange={e => setNewTeam(p => ({ ...p, email: e.target.value }))} placeholder="ivan@example.com" />
            </Field>
          </div>
          <div className="mgr-modal__actions">
            <button type="button" className="mgr-button mgr-button--outlined" onClick={() => setShowCreate(false)}>Скасувати</button>
            <button type="button" className="mgr-button mgr-button--primary" onClick={handleCreate} disabled={saving}>{saving ? 'Збереження...' : 'Створити'}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
