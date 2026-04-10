import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icons } from '../order/Icons';
import { authHeaders, jsonHeaders } from '../order/api';

const REPEAT_OPTIONS = [
  { value: 'once',    label: 'Разово' },
  { value: 'weekly',  label: 'Щотижня' },
  { value: 'monthly', label: 'Щомісяця' },
];

/**
 * Модальне вікно оформлення замовлення.
 * Props:
 *   service   — послуга, передвибрана з каталогу
 *   onClose   — закрити модал
 *   onSuccess — викликається після успішного замовлення
 */
export default function OrderModal({ service, onClose, onSuccess }) {
  const [plots, setPlots] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [selectedService, setSelectedService] = useState(service);
  const [date, setDate] = useState('');
  const [repeat, setRepeat] = useState('once');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Завантаження ділянок і послуг
  useEffect(() => {
    if (!localStorage.getItem('jwt')) { navigate('/auth'); return; }
    Promise.all([
      fetch('/profile/my_plots', { headers: authHeaders() }).then(r => r.json()),
      fetch('/manager/services', { headers: authHeaders() }).then(r => r.json()),
    ])
      .then(([p, s]) => {
        setPlots(Array.isArray(p) ? p : []);
        setServices(Array.isArray(s) ? s : []);
      })
      .catch(() => setError('Не вдалося завантажити дані'))
      .finally(() => setLoadingData(false));
  }, [navigate]);

  // Закриття по Escape
  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  // Орієнтовна вартість
  const estimatedCost = useMemo(() => {
    if (!selectedService) return null;
    const base = Number(selectedService.price);
    if (repeat === 'weekly')  return base * 4;
    if (repeat === 'monthly') return base * 12;
    return base;
  }, [selectedService, repeat]);

  const handleSubmit = async () => {
    if (!selectedPlot)    { setError('Оберіть ділянку'); return; }
    if (!selectedService) { setError('Оберіть послугу'); return; }
    if (!date)            { setError('Вкажіть дату виконання'); return; }
    setSubmitting(true); setError('');
    try {
      const orderRes = await fetch('/orders/', {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify({
          plot_id:    selectedPlot.id,
          service_id: selectedService.id,
          comment:    comment.trim() || undefined,
        }),
      });
      if (!orderRes.ok) throw new Error((await orderRes.json()).detail || 'Помилка створення замовлення');
      const order = await orderRes.json();
      await fetch('/manager/schedules', {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify({ order_id: order.id, scheduled_date: date }),
      });
      onSuccess();
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div
      className="om-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="om-modal">

        {/* Шапка */}
        <div className="om-header">
          <div>
            <h2 className="om-header__title">Оформлення замовлення</h2>
            <p className="om-header__sub">Заповніть деталі замовлення</p>
          </div>
          <button className="om-close-btn" onClick={onClose}>{Icons.close}</button>
        </div>

        {/* Тіло */}
        <div className="om-body">
          {error && <div className="om-error">{error}</div>}

          {loadingData ? (
            <div className="co-spinner-wrap"><div className="co-spinner" /></div>
          ) : (
            <>
              {/* 1. Ділянка */}
              <FormSection icon={Icons.pin} label="Оберіть ділянку">
                {plots.length === 0 ? (
                  <div className="om-no-plots">
                    <p className="om-no-plots__text">У вас ще немає доданих ділянок.</p>
                    <Link to="/profile" className="om-no-plots__link">Додати ділянку в профілі →</Link>
                  </div>
                ) : (
                  <div className="om-radio-list">
                    {plots.map(p => (
                      <label
                        key={p.id}
                        className={`om-radio-item${selectedPlot?.id === p.id ? ' om-radio-item--active' : ''}`}
                      >
                        <input
                          type="radio" name="plot"
                          className="om-radio-hidden"
                          checked={selectedPlot?.id === p.id}
                          onChange={() => setSelectedPlot(p)}
                        />
                        <div className={`om-radio-dot${selectedPlot?.id === p.id ? ' om-radio-dot--active' : ''}`}>
                          {selectedPlot?.id === p.id && <div className="om-radio-dot__inner" />}
                        </div>
                        <div>
                          <p className="om-radio-item__title">{p.address}</p>
                          <p className="om-radio-item__sub">Площа: {p.area} соток</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </FormSection>

              {/* 2. Послуга */}
              <FormSection icon={Icons.tag} label="Оберіть послугу">
                <div className="om-radio-list">
                  {services.map(s => (
                    <label
                      key={s.id}
                      className={`om-radio-item${selectedService?.id === s.id ? ' om-radio-item--active' : ''}`}
                    >
                      <input
                        type="radio" name="service"
                        className="om-radio-hidden"
                        checked={selectedService?.id === s.id}
                        onChange={() => setSelectedService(s)}
                      />
                      <div className={`om-radio-dot${selectedService?.id === s.id ? ' om-radio-dot--active' : ''}`}>
                        {selectedService?.id === s.id && <div className="om-radio-dot__inner" />}
                      </div>
                      <div className="om-radio-item__body">
                        <p className="om-radio-item__title">{s.name}</p>
                      </div>
                      <span className="om-radio-item__price">{s.price} ₴</span>
                    </label>
                  ))}
                </div>
              </FormSection>

              {/* 3. Дата */}
              <FormSection icon={Icons.calendar} label="Дата виконання">
                <input
                  type="date"
                  className="om-input"
                  min={new Date().toISOString().slice(0, 10)}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </FormSection>

              {/* 4. Регулярність */}
              <FormSection icon={Icons.repeat} label="Регулярність">
                <div className="om-repeat-grid">
                  {REPEAT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      className={`om-repeat-btn${repeat === opt.value ? ' om-repeat-btn--active' : ''}`}
                      onClick={() => setRepeat(opt.value)}
                    >
                      {repeat === opt.value && Icons.check}
                      {opt.label}
                    </button>
                  ))}
                </div>
                {repeat !== 'once' && (
                  <p className="om-repeat-hint">
                    {repeat === 'weekly'
                      ? 'Замовлення повторюватиметься щотижня від обраної дати'
                      : 'Замовлення повторюватиметься щомісяця від обраної дати'}
                  </p>
                )}
              </FormSection>

              {/* 5. Коментар */}
              <FormSection icon={Icons.comment} label="Коментар (необов'язково)">
                <textarea
                  className="om-textarea"
                  rows={3}
                  placeholder="Додаткові побажання або уточнення для бригади..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
              </FormSection>

              {/* Орієнтовна вартість */}
              {estimatedCost !== null && (
                <div className="om-cost">
                  <div>
                    <p className="om-cost__label">Орієнтовна вартість</p>
                    <p className="om-cost__period">
                      {repeat === 'once' ? 'Разове виконання' : repeat === 'weekly' ? '× 4 тижні' : '× 12 місяців'}
                    </p>
                  </div>
                  <span className="om-cost__value">
                    {estimatedCost.toLocaleString('uk-UA')} ₴
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Футер */}
        <div className="om-footer">
          <button className="om-btn-cancel" onClick={onClose}>Скасувати</button>
          <button
            className="om-btn-submit"
            onClick={handleSubmit}
            disabled={submitting || !selectedPlot || !selectedService || !date}
          >
            {submitting ? 'Відправка...' : 'Замовити'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Обгортка секції форми з іконкою та заголовком
function FormSection({ icon, label, children }) {
  return (
    <div className="om-section">
      <div className="om-section__header">
        <span className="om-section__icon">{icon}</span>
        <span className="om-section__label">{label}</span>
      </div>
      {children}
    </div>
  );
}
