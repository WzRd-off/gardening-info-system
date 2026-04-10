import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Екран успішного оформлення замовлення.
 * Props:
 *   onReset — повернутись до каталогу і замовити ще
 */
export default function SuccessScreen({ onReset }) {
  return (
    <div className="ss-overlay">
      <div className="ss-card">
        <div className="ss-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="var(--primary-green)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 className="ss-title">Замовлення прийнято!</h2>
        <p className="ss-text">
          Ваше замовлення успішно відправлено. Менеджер зв'яжеться з вами найближчим часом.
        </p>
        <div className="ss-actions">
          <Link to="/profile" className="ss-btn-primary">
            Перейти до замовлень
          </Link>
          <button className="ss-btn-secondary" onClick={onReset}>
            Замовити ще
          </button>
        </div>
      </div>
    </div>
  );
}
