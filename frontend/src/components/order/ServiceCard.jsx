import React, { useState } from 'react';
import { Icons } from '../order/Icons';

/**
 * Картка однієї послуги в каталозі.
 * Props:
 *   service  — об'єкт послуги { id, name, description, price, image_url }
 *   onOrder  — callback(service) при натисканні «Замовити послугу»
 */
export default function ServiceCard({ service, onOrder }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="sc-card">
      {/* ── Зображення ── */}
      <div className="sc-image-wrap">
        {service.image_url ? (
          <img src={service.image_url} alt={service.name} className="sc-image" />
        ) : (
          <div className="sc-image-placeholder">
            {Icons.imagePlaceholder}
            <span className="sc-image-placeholder__label">Немає фото</span>
          </div>
        )}
        <div className="sc-price-badge">
          {Number(service.price).toLocaleString('uk-UA')} ₴
        </div>
      </div>

      {/* ── Контент ── */}
      <div className="sc-body">
        <h3 className="sc-title">{service.name}</h3>

        <button
          className="sc-toggle-btn"
          onClick={() => setExpanded(v => !v)}
        >
          {expanded ? Icons.chevronUp : Icons.chevronDown}
          {expanded ? 'Сховати опис' : 'Детальніше'}
        </button>

        {expanded && (
          <div className="sc-expanded">
            <p className="sc-description">
              {service.description || 'Опис послуги відсутній.'}
            </p>
            <button
              className="sc-order-btn"
              onClick={() => onOrder(service)}
            >
              Замовити послугу
            </button>
          </div>
        )}
      </div>
    </div>
  );
}