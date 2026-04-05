import React from 'react';

const STATUS_META = {
  'отримано':           { label: 'Отримано',           color: '#2196F3', bg: '#E3F2FD' },
  'в дорозі':           { label: 'В дорозі',           color: '#FF9800', bg: '#FFF3E0' },
  'в роботі':           { label: 'В роботі',           color: '#8BC34A', bg: '#F1F8E9' },
  'виконано':           { label: 'Виконано',           color: '#616161', bg: '#F5F5F5' },
  'проблема виконання': { label: 'Проблема виконання', color: '#D32F2F', bg: '#FFEBEE' },
};

export function StatusBadge({ status }) {
  const s = STATUS_META[status?.toLowerCase()] ?? { label: status, color: '#616161', bg: '#F5F5F5' };
  return (
    <span className="status-badge" style={{ background: s.bg, color: s.color }}>
      <span className="status-badge__dot" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}

export function EmptyState({ icon, text, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <p className="empty-state__text">{text}</p>
      {action}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="spinner">
      <div className="spinner__circle" />
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <div className="field">
      <label className="field__label">{label}</label>
      {children}
      {hint && <span className="field__hint">{hint}</span>}
    </div>
  );
}
