import React, { useState, useEffect } from 'react';
import { Field } from './CommonComponents';
import { Spinner } from './CommonComponents';
import { useAuth } from '../../hooks/useAuth';
import * as profileService from '../../services/profileService';

export function ProfileTab() {
  const { user, isLoading: authLoading } = useAuth();
  const [form, setForm] = useState({ username: '', phone: '' });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(!authLoading);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setForm({ username: user.username ?? '', phone: user.phone ?? '' });
    setEmail(user.email ?? '');
    setLoading(false);
  }, [user]);

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false);
    try {
      await profileService.updateProfile({ username: form.username, phone: form.phone });
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
            onChange={e => {
              const value = e.target.value.replace(/[^\d+]/g, '');
              setForm(p => ({ ...p, phone: value }));
            }}
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
