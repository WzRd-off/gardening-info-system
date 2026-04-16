import React, { useState, useEffect, useCallback, useRef } from 'react';
// ─── Helpers ──────────────────────────────────────────────────────────────────

import { statusMeta, MONTH_UA, WEEKDAYS, STATUS_LIST } from '../../constants/appConstants';
import { Icon } from '../../constants/Icons';
import { managerAPI, teamsAPI } from '../../services/api';

// YYYY-MM-DD для date object
function toDateStr(date) {
  return date.toISOString().slice(0, 10);
}

// Получить информацию о статусе заказа
function resolveStatus(order) {
  const statusName = order.status?.name ?? order.status?.id ?? '';
  const meta = statusMeta(statusName);
  return { color: meta.color, bg: meta.bg, label: meta.name };
}

// Кількість замовлень бригади на дату
function teamOrderCount(orders, teamId, dateStr) {
  return orders.filter(o =>
    o.team_id === teamId &&
    (o.scheduled_time ?? '').slice(0, 10) === dateStr
  ).length;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type, onHide }) {
  useEffect(() => {
    const t = setTimeout(onHide, 3000);
    return () => clearTimeout(t);
  }, [onHide]);

  return (
    <div className={`cal-toast cal-toast--${type}`}>
      {type === 'success' ? (
        Icon.check
      ) : (
        Icon.exclamation
      )}
      <span>{message}</span>
    </div>
  );
}

// ─── DayOrdersModal ───────────────────────────────────────────────────────────

function DayOrdersModal({ date, orders, teams, allOrders, onClose, onTeamAssigned }) {
  const [patching, setPatching] = useState(null); // order id
  const [localOrders, setLocalOrders] = useState(orders);
  const backdropRef = useRef();

  // Sync if parent updates
  useEffect(() => { setLocalOrders(orders); }, [orders]);

  // Закриття Escape
  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const dateStr = toDateStr(date);

  const handleTeamChange = async (order, newTeamId) => {
    setPatching(order.id);
    try {
      await managerAPI.updateOrderStatus(order.id, { team_id: newTeamId ? Number(newTeamId) : null });
      setLocalOrders(prev =>
        prev.map(o => o.id === order.id ? { ...o, team_id: newTeamId ? Number(newTeamId) : null } : o)
      );
      onTeamAssigned('success', `Бригаду призначено для замовлення #${order.id}`);
    } catch (e) {
      onTeamAssigned('error', e.message || 'Не вдалося призначити бригаду');
    } finally {
      setPatching(null);
    }
  };

  const formattedDate = `${date.getDate()} ${MONTH_UA[date.getMonth()]} ${date.getFullYear()}`;

  return (
    <div
      className="mgr-modal-backdrop"
      ref={backdropRef}
      onClick={e => e.target === backdropRef.current && onClose()}
    >
      <div className="mgr-modal cal-modal">
        {/* Шапка */}
        <div className="mgr-modal__header">
          <div>
            <h3>{formattedDate}</h3>
            <p className="cal-modal__sub">
              {localOrders.length === 0
                ? 'Замовлень на цей день немає'
                : `${localOrders.length} замовлень`}
            </p>
          </div>
          <button className="mgr-icon-button" onClick={onClose} aria-label="Закрити">
            {Icon.close}
          </button>
        </div>

        {/* Таблиця */}
        {localOrders.length === 0 ? (
          <div className="cal-modal__empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D8ECD0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <p>Немає замовлень на цей день</p>
          </div>
        ) : (
          <div className="cal-modal__table-wrap">
            <table className="mgr-table cal-table">
              <thead>
                <tr className="mgr-table__head-row">
                  <th className="mgr-table__head-cell">ID</th>
                  <th className="mgr-table__head-cell">Клієнт</th>
                  <th className="mgr-table__head-cell">Послуга</th>
                  <th className="mgr-table__head-cell">Статус</th>
                  <th className="mgr-table__head-cell cal-table__team-col">Бригада</th>
                </tr>
              </thead>
              <tbody>
                {localOrders.map((order, i) => {
                  const st = resolveStatus(order);
                  const currentTeamId = order.team_id ?? '';
                  return (
                    <tr key={order.id} className={`mgr-table__row ${i % 2 === 0 ? 'mgr-table__row--even' : 'mgr-table__row--odd'}`}>
                      <td className="mgr-table__cell cal-table__id">#{order.id}</td>
                      <td className="mgr-table__cell">
                        <span className="cal-table__email">
                          {order.user?.email ?? order.user?.username ?? `#${order.user_id}`}
                        </span>
                      </td>
                      <td className="mgr-table__cell cal-table__service">
                        {order.service?.name ?? `Послуга #${order.service_id}`}
                      </td>
                      <td className="mgr-table__cell">
                        <span className="cal-status-badge" style={{ color: st.color, background: st.bg }}>
                          <span className="cal-status-badge__dot" style={{ background: st.color }} />
                          {st.label}
                        </span>
                      </td>
                      <td className="mgr-table__cell cal-table__team-col">
                        <div className="cal-team-select-wrap">
                          <select
                            className="mgr-input--select cal-team-select"
                            value={currentTeamId}
                            disabled={patching === order.id}
                            onChange={e => handleTeamChange(order, e.target.value || null)}
                          >
                            <option value="">— Без бригади —</option>
                            {teams.map(t => {
                              const count = teamOrderCount(allOrders, t.id, dateStr);
                              const full = count >= 3;
                              return (
                                <option key={t.id} value={t.id}>
                                  {t.name} {full ? `(Зайнято: ${count}/3)` : count > 0 ? `(${count}/3)` : '(вільна)'}
                                </option>
                              );
                            })}
                          </select>
                          {patching === order.id && (
                            <div className="cal-team-select__spinner" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CalendarTab ──────────────────────────────────────────────────────────────

export default function CalendarTab() {
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date(); d.setDate(1); return d;
  });
  const [schedules, setSchedules] = useState([]);   // /manager/schedules
  const [orders, setOrders] = useState([]);          // /manager/orders (усі)
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null); // Date object
  const [toast, setToast] = useState(null);           // { message, type }

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Завантаження
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [schData, ordData, teamData] = await Promise.all([
        managerAPI.getSchedules(),
        managerAPI.getOrders(),
        teamsAPI.getAll(),
      ]);
      setSchedules(Array.isArray(schData)  ? schData  : []);
      setOrders(   Array.isArray(ordData)  ? ordData  : []);
      setTeams(    Array.isArray(teamData) ? teamData : []);
    } catch { /* мовчки */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Перебудова сітки
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay(); // 0=Sun
  const startOffset  = (firstWeekday + 6) % 7;            // Mon-based

  // Групуємо schedules по дню поточного місяця
  const ordersByDay = {};
  schedules.forEach(s => {
    const d = (s.scheduled_time ?? '').slice(0, 10);
    if (!d) return;
    const [sy, sm, sd] = d.split('-').map(Number);
    if (sy !== year || sm - 1 !== month) return;
    if (!ordersByDay[sd]) ordersByDay[sd] = [];
    // Знаходимо повний об'єкт замовлення
    const fullOrder = s.order ?? { id: s.order_id };
    ordersByDay[sd].push({ ...fullOrder, scheduled_time: s.scheduled_time });
  });

  const today = new Date();
  const isToday = (d) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

  // Замовлення вибраного дня для модалу
  const selectedDayOrders = selectedDay
    ? (ordersByDay[selectedDay.getDate()] ?? [])
    : [];

  const handleToast = useCallback((type, message) => {
    setToast({ type, message });
    // Оновлюємо дані після призначення
    fetchData();
  }, [fetchData]);

  // Повна кількість замовлень на місяць
  const totalThisMonth = Object.values(ordersByDay).reduce((s, arr) => s + arr.length, 0);

  return (
    <div className="cal-root">

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast(null)}
        />
      )}

      {/* ── Заголовок + навігація ── */}
      <div className="mgr-section__header">
        <div>
          <h2 className="mgr-page-title">Календар</h2>
          {!loading && (
            <p className="cal-month-summary">
              {totalThisMonth} замовлень у {MONTH_UA[month].toLowerCase()}
            </p>
          )}
        </div>

        <div className="cal-nav">
          <button
            className="cal-nav__btn"
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            aria-label="Попередній місяць"
          >
            {Icon.chevronLeft}
          </button>

          <span className="cal-nav__label">
            {MONTH_UA[month]} {year}
          </span>

          <button
            className="cal-nav__btn"
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            aria-label="Наступний місяць"
          >
            {Icon.chevronRight}
          </button>

          <button
            className="cal-nav__today"
            onClick={() => { const d = new Date(); d.setDate(1); setCurrentDate(d); }}
          >
            Сьогодні
          </button>
        </div>
      </div>

      {/* ── Легенда статусів ── */}
      <div className="cal-legend">
        {STATUS_LIST.map(s => (
          <div key={s.id} className="cal-legend__item">
            <span className="cal-legend__dot" style={{ background: s.color }} />
            <span className="cal-legend__label">{s.name}</span>
          </div>
        ))}
      </div>

      {/* ── Сітка календаря ── */}
      {loading ? (
        <div className="mgr-spinner-wrap"><div className="mgr-spinner" /></div>
      ) : (
        <div className="cal-grid-wrap">
          {/* Дні тижня */}
          <div className="cal-weekdays">
            {WEEKDAYS.map(d => (
              <div key={d} className="cal-weekday">{d}</div>
            ))}
          </div>

          {/* Клітинки */}
          <div className="cal-days">
            {/* Порожні комірки зміщення */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`e${i}`} className="cal-cell cal-cell--empty" />
            ))}

            {/* Дні місяця */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const dayOrders = ordersByDay[day] ?? [];
              const hasOrders = dayOrders.length > 0;
              const PILLS_MAX = 3;
              const visible  = dayOrders.slice(0, PILLS_MAX);
              const overflow = dayOrders.length - PILLS_MAX;

              return (
                <div
                  key={day}
                  className={[
                    'cal-cell',
                    isToday(day)  ? 'cal-cell--today'    : '',
                    hasOrders     ? 'cal-cell--has-orders' : '',
                  ].join(' ')}
                  onClick={() => setSelectedDay(new Date(year, month, day))}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setSelectedDay(new Date(year, month, day))}
                  aria-label={`${day} ${MONTH_UA[month]}, замовлень: ${dayOrders.length}`}
                >
                  {/* Номер дня */}
                  <div className={`cal-cell__day-num${isToday(day) ? ' cal-cell__day-num--today' : ''}`}>
                    {day}
                  </div>

                  {/* Пілюлі замовлень */}
                  <div className="cal-cell__pills">
                    {visible.map((o, idx) => {
                      const st = resolveStatus(o);
                      return (
                        <div
                          key={o.id ?? idx}
                          className="cal-pill"
                          style={{ borderLeftColor: st.color, background: st.bg }}
                          title={`#${o.id} ${o.service?.name ?? ''}`}
                        >
                          <span className="cal-pill__text">
                            #{o.id} {o.service?.name ?? ''}
                          </span>
                        </div>
                      );
                    })}
                    {overflow > 0 && (
                      <div className="cal-cell__overflow">+{overflow} ще</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Модал дня ── */}
      {selectedDay && (
        <DayOrdersModal
          date={selectedDay}
          orders={selectedDayOrders}
          teams={teams}
          allOrders={orders}
          onClose={() => setSelectedDay(null)}
          onTeamAssigned={handleToast}
        />
      )}
    </div>
  );
}
