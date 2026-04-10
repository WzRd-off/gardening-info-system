import React, { useState } from 'react';
import { Icons } from './Icons.jsx';
import { StatusBadge } from './StatusBadge';
import { TEAM_STATUSES, STATUS_STRIPE } from './constants';
import { resolveStatus } from './utils';

export function TaskCard({ order, onStatusChange, updating }) {
  const [open, setOpen] = useState(false);
  const status = resolveStatus(order);
  const stripeColor = STATUS_STRIPE[status.id] || '#8BC34A';
  const isDone = status.id === 4;

  const availableStatuses = TEAM_STATUSES.filter(s => s.id !== 1);

  return (
    <div className="team-task-card" style={{ borderLeftColor: stripeColor, opacity: isDone ? 0.75 : 1 }}>
      {/* Header row */}
      <div className="team-task-header">
        <div className="team-task-content">
          <h3 className="team-task-title">
            {order.service?.name ?? `Послуга #${order.service_id}`}
          </h3>
          <div className="team-task-meta">
            <span className="team-task-meta-item">{Icons.pin} {order.plot?.address ?? `Ділянка #${order.plot_id}`}</span>
            {order.scheduled_date && (
              <span className="team-task-meta-item">{Icons.calendar} {new Date(order.scheduled_date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            )}
            {order.user?.email && (
              <span className="team-task-meta-item">{Icons.user} {order.user.email}</span>
            )}
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Manager instructions */}
      {order.manager_instructions && (
        <div className="team-task-instructions">
          <span className="team-task-instructions-icon">{Icons.note}</span>
          <p className="team-task-instructions-text">{order.manager_instructions}</p>
        </div>
      )}

      {/* Comment */}
      {order.comment && (
        <p className="team-task-comment">Коментар клієнта: {order.comment}</p>
      )}

      {/* Status change — collapse toggle */}
      {!isDone && (
        <>
          <button
            onClick={() => setOpen(v => !v)}
            className="team-task-toggle-btn"
          >
            {open ? Icons.chevronDown : Icons.chevronDown}
            {open ? 'Сховати статуси' : 'Змінити статус'}
          </button>

          {open && (
            <div className="team-task-statuses">
              {availableStatuses.map(s => {
                const isActive = s.id === status.id;
                return (
                  <button
                    key={s.id}
                    disabled={isActive || updating === order.id}
                    onClick={() => onStatusChange(order.id, s.id)}
                    className="team-task-status-btn"
                    style={{
                      borderColor: isActive ? s.color : s.borderColor,
                      background: isActive ? s.bg : 'transparent',
                      color: s.color,
                      opacity: updating === order.id && !isActive ? 0.5 : 1,
                    }}
                  >
                    {isActive && Icons.check}
                    {s.name}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {isDone && (
        <div className="team-task-done">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Замовлення виконано</span>
        </div>
      )}
    </div>
  );
}
