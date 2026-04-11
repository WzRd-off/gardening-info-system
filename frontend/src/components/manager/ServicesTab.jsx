import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from './icons';
import { authHeaders } from './constants';
import { Spinner, EmptyState, Modal, Field } from './shared';
import { API_BASE_URL } from '../../services/config';

export default function ServicesTab() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', image: null });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const CATEGORIES = ["Система поливу", "Садівництво та догляд", "Ландшафний дизайн", "Екологічні матеріали", "Газон"];

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/manager/services`, { headers: authHeaders() });
      setServices(await response.json());
    } catch {
      setError('Не вдалося завантажити послуги');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const openAdd = () => {
    setSelected(null);
    setForm({ name: '', description: '', price: '', category: '', image: null });
    setModal('add');
    setError('');
  };

  const openEdit = svc => {
    setSelected(svc);
    setForm({ name: svc.name, description: svc.description || '', price: String(svc.price), category: svc.category || '', image: null });
    setModal('edit');
    setError('');
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.category) {
      setError('Назва, категорія та ціна обов\'язкові');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price.replace(',', '.'));
      formData.append('category', form.category);
      if (form.image) formData.append('upload_file', form.image);

      const url = modal === 'edit'
        ? `${API_BASE_URL}/manager/services/${selected.id}`
        : `${API_BASE_URL}/manager/services`;
      const response = await fetch(url, {
        method: modal === 'edit' ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: formData,
      });

      if (!response.ok) throw new Error((await response.json()).detail || 'Помилка');
      setModal(false);
      fetchServices();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Видалити послугу?')) return;
    try {
      await fetch(`${API_BASE_URL}/manager/services/${id}`, { method: 'DELETE', headers: authHeaders() });
      fetchServices();
      setSelected(null);
    } catch {
      setError('Помилка видалення');
    }
  };

  return (
    <div className="mgr-section">
      <div className="mgr-section__header">
        <h2 className="mgr-page-title">Послуги</h2>
        <div className="mgr-section__actions">
          {selected && (
            <>
              <button type="button" className="mgr-button mgr-button--outlined" onClick={() => openEdit(selected)}>{Icon.edit} Редагувати</button>
              <button type="button" className="mgr-button mgr-button--danger" onClick={() => handleDelete(selected.id)}>{Icon.trash} Видалити</button>
            </>
          )}
          <button type="button" className="mgr-button mgr-button--primary" onClick={openAdd}>{Icon.plus} Додати послугу</button>
        </div>
      </div>

      {error && <div className="mgr-error-box">{error}</div>}

      {loading ? (
        <Spinner />
      ) : !services.length ? (
        <EmptyState text="Послуг ще немає. Додайте першу послугу." />
      ) : (
        <div className="mgr-table-wrapper">
          <table className="mgr-table">
            <thead>
              <tr className="mgr-table__head-row">
                {['', 'Назва', 'Категорія', 'Опис', 'Ціна (₴)', 'Дії'].map(h => (
                  <th key={h} className="mgr-table__head-cell">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((svc, index) => {
                const rowClass = [
                  'mgr-table__row',
                  selected?.id === svc.id ? 'mgr-table__row--selected' : index % 2 === 0 ? 'mgr-table__row--even' : 'mgr-table__row--odd',
                ].join(' ');
                console.log(`svc.image_url: ${svc.image_url}`);
                return (
                  <tr key={svc.id} className={rowClass} onClick={() => setSelected(selected?.id === svc.id ? null : svc)}>
                    <td className="mgr-table__cell mgr-table__cell--image">
                      {svc.image_url ? (
                        <img src={`${API_BASE_URL}${svc.image_url}`} alt="" className="mgr-table__image" />
                      ) : (
                        <div className="mgr-image-placeholder">{Icon.image}</div>
                      )}
                    </td>
                    <td className="mgr-table__cell mgr-table__cell--name">{svc.name}</td>
                    <td className="mgr-table__cell mgr-table__cell--category">{svc.category || '—'}</td>
                    <td className="mgr-table__cell mgr-table__cell--description">
                      <span className="mgr-clamped-text">{svc.description || '—'}</span>
                    </td>
                    <td className="mgr-table__cell mgr-table__cell--price">{svc.price} ₴</td>
                    <td className="mgr-table__cell mgr-table__cell--actions">
                      <div className="mgr-action-group">
                        <button type="button" className="mgr-button mgr-button--outlined mgr-button--small" onClick={e => { e.stopPropagation(); openEdit(svc); }}>{Icon.edit}</button>
                        <button type="button" className="mgr-button mgr-button--danger mgr-button--small" onClick={e => { e.stopPropagation(); handleDelete(svc.id); }}>{Icon.trash}</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'Нова послуга' : 'Редагувати послугу'} onClose={() => setModal(false)}>
          {error && <div className="mgr-error-box mgr-error-box--modal">{error}</div>}
          <div className="mgr-form-grid">
            <Field label="Назва послуги *">
              <input className="mgr-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Наприклад: Стрижка газону" />
            </Field>
            <Field label="Категорія *">
              <select className="mgr-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                <option value="">Оберіть категорію</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </Field>
            <Field label="Опис">
              <textarea className="mgr-input mgr-input--textarea" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Короткий опис послуги..." />
            </Field>
            <Field label="Ціна (₴) *" hint="Тільки цифри та кома">
              <input className="mgr-input" value={form.price} onKeyDown={e => { if (!['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', ','].includes(e.key) && (e.key < '0' || e.key > '9')) e.preventDefault(); }} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="1200" />
            </Field>
            <Field label="Зображення" hint={modal === 'edit' ? 'Залиште порожнім, щоб не змінювати фото' : ''}>
              <div className="mgr-file-row">
                <input ref={fileRef} type="file" accept="image/*" className="mgr-file-input" onChange={e => setForm(p => ({ ...p, image: e.target.files[0] || null }))} />
                <button type="button" className="mgr-button mgr-button--outlined" onClick={() => fileRef.current.click()}>Обрати файл</button>
                {form.image && <span className="mgr-file-name">{form.image.name}</span>}
              </div>
            </Field>
          </div>
          <div className="mgr-modal__actions">
            <button type="button" className="mgr-button mgr-button--outlined" onClick={() => setModal(false)}>Скасувати</button>
            <button type="button" className="mgr-button mgr-button--primary" onClick={handleSave} disabled={saving}>{saving ? 'Збереження...' : modal === 'add' ? 'Додати' : 'Зберегти'}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
