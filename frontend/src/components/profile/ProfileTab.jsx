import React, { useState, useEffect } from 'react';
import { Field } from './CommonComponents';
import { Spinner } from './CommonComponents';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('jwt')}`,
});

export function ProfileTab() {
  const [form, setForm] = useState({ username: '', phone: '' });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/profile/my_profile', { headers: authHeaders() })
      .then(r => r.json())
      .then(d => {
        setForm({ username: d.username ?? '', phone: d.phone ?? '' });
        setEmail(d.email ?? '');
      })
      .catch(() => setError('Не вдалося завантажити профіль'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false);
    try {
      const r = await fetch('http://127.0.0.1:8000/profile/update_profile', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      if (!r.ok) { const d = await r.json(); throw new Error(d.detail || 'Помилка збереження'); }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="card">
      <h2 className="card-title">Персональні дані</h2>

      {error && <div className="error-box">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, maxWidth: 560 }}>
        <Field label="Ім'я">
          <input
            className="input"
            value={form.username}
            onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
            placeholder="Ваше ім'я"
          />
        </Field>
        <Field label="Телефон">
          <input
            className="input"
            value={form.phone}
            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            placeholder="+38 (0__) ___-__-__"
            type="tel"
          />
        </Field>
        <Field label="Електронна пошта" hint="Email використовується для входу і не може бути змінений">
          <input className="input"
            value={email} disabled />
        </Field>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-sm"
        style={{
          marginTop: 28,
          background: saved ? '#4CAF50' : undefined,
          minWidth: 180,
        }}
      >
        {saving ? 'Збереження...' : saved ? '✓ Збережено' : 'Зберегти зміни'}
      </button>
    </div>
  );
}
