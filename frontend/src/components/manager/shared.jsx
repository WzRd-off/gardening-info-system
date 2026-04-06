import React, { useEffect } from 'react';
import { statusMeta } from './constants';
import { Icon } from './icons';

export function Spinner() {
  return (
    <div className="mgr-spinner-wrap">
      <div className="mgr-spinner" />
    </div>
  );
}

export function StatusBadge({ status }) {
  const m = statusMeta(status);
  return (
    <span className="mgr-status-badge" style={{ background: m.bg, color: m.color }}>
      <span className="mgr-status-badge__dot" style={{ background: m.color }} />
      {m.name}
    </span>
  );
}

export function EmptyState({ text }) {
  return (
    <div className="mgr-empty-state">
      {Icon.filePlaceholder}
      <p>{text}</p>
    </div>
  );
}

export function Modal({ title, onClose, children, width = 560 }) {
  useEffect(() => {
    const handleKeyDown = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="mgr-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="mgr-modal" style={{ maxWidth: width }}>
        <div className="mgr-modal__header">
          <h3>{title}</h3>
          <button type="button" className="mgr-icon-button" onClick={onClose}>{Icon.close}</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children, hint }) {
  return (
    <div className="mgr-field">
      <label>{label}</label>
      {children}
      {hint && <span className="mgr-field__hint">{hint}</span>}
    </div>
  );
}
