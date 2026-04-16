import React, { useState } from 'react';
import { Icons } from '../../constants/Icons';
import { StatusBadge } from './StatusBadge';
import { TEAM_STATUSES, STATUS_STRIPE } from '../../constants/appConstants';
import { resolveStatus } from './utils';

export function TaskCard({ order, onStatusChange, updating }) {
  const [open, setOpen] = useState(false);
  const status = resolveStatus(order);
  const stripeColor = STATUS_STRIPE[status.id] || '#8BC34A';
  const isDone = status.id === 4;

  const availableStatuses = TEAM_STATUSES.filter(s => s.id !== 1);
  const formattedDate = order.scheduled_time 
    ? new Date(order.scheduled_time).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Не встановлена';

  return (
    <div className="team-task-card" style={{ borderLeftColor: stripeColor, opacity: isDone ? 0.75 : 1 }}>
      {/* Header with service title and status */}
      <div className="team-task-header">
        <div className="team-task-content">
          <h3 className="team-task-title">
            {order.service?.name ?? `Послуга #${order.service_id}`}
          </h3>
          <div className="team-task-order-id">Замовлення #{order.id}</div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Main information grid */}
      <div className="team-task-info-grid">
        {/* Client section */}
        <div className="team-task-info-section">
          <h4 className="team-task-section-title">{Icons.user} Клієнт</h4>
          <div className="team-task-info-content">
            <p className="team-task-info-value">{order.user?.username ?? order.user?.email ?? 'Невідомий клієнт'}</p>
            {order.user?.phone && (
              <p className="team-task-info-meta">
                {Icons.phone} <a href={`tel:${order.user.phone}`} className="team-task-phone">{order.user.phone}</a>
              </p>
            )}
            {order.user?.email && (
              <p className="team-task-info-meta">✉ {order.user.email}</p>
            )}
          </div>
        </div>

        {/* Location section */}
        <div className="team-task-info-section">
          <h4 className="team-task-section-title">{Icons.pin} Локація</h4>
          <div className="team-task-info-content">
            <p className="team-task-info-value">{order.plot?.address ?? `Ділянка #${order.plot_id}`}</p>
            {order.plot?.area && (
              <p className="team-task-info-meta">Площа: {order.plot.area} м²</p>
            )}
            {order.plot?.features && (
              <p className="team-task-info-meta">Характеристики: {order.plot.features}</p>
            )}
          </div>
        </div>

        {/* Execution date section */}
        <div className="team-task-info-section">
          <h4 className="team-task-section-title">{Icons.calendar} Дата виконання</h4>
          <div className="team-task-info-content">
            <p className="team-task-info-value">{formattedDate}</p>
            {order.execution_date && order.scheduled_time && (
              <p className="team-task-info-meta">
                Запланований термін виконання
              </p>
            )}
          </div>
        </div>

        {/* Price section */}
        {order.total_price && (
          <div className="team-task-info-section">
            <h4 className="team-task-section-title">💰 Вартість</h4>
            <div className="team-task-info-content">
              <p className="team-task-info-value">{order.total_price} грн.</p>
            </div>
          </div>
        )}
      </div>

      {/* Manager instructions */}
      {order.manager_instructions && (
        <div className="team-task-instructions">
          <span className="team-task-instructions-icon">{Icons.note}</span>
          <div>
            <p className="team-task-instructions-title">Інструкції менеджера</p>
            <p className="team-task-instructions-text">{order.manager_instructions}</p>
          </div>
        </div>
      )}

      {/* Comment from customer */}
      {order.comment && (
        <div className="team-task-comment-box">
          <p className="team-task-comment-title">💬 Коментар клієнта</p>
          <p className="team-task-comment-text">{order.comment}</p>
        </div>
      )}

      {/* Status change — collapse toggle */}
      {!isDone && (
        <>
          <button
            onClick={() => setOpen(v => !v)}
            className="team-task-toggle-btn"
          >
            {open ? Icons.chevronUp : Icons.chevronDown}
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
          {Icons.check}
          <span>Замовлення виконано</span>
        </div>
      )}
    </div>
  );
}
