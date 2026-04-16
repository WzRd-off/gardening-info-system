import React, { useState } from 'react';
import { Field } from './CommonComponents';
import * as profileService from '../../services/profileService';

export function ChangePasswordTab() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async () => {
    // Валідація
    if (!oldPassword.trim()) {
      setError('Введіть поточний пароль');
      return;
    }
    if (!newPassword.trim()) {
      setError('Введіть новий пароль');
      return;
    }
    if (newPassword.length < 8) {
      setError('Новий пароль повинен мати щонайменше 8 символів');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }
    if (oldPassword === newPassword) {
      setError('Новий пароль не повинен співпадати з поточним');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await profileService.changePassword(oldPassword, newPassword);
      setSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e.message || 'Помилка при зміні пароля');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Змінити пароль</h2>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">✓ Пароль успішно змінено</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, maxWidth: 560 }}>
        <Field label="Поточний пароль *">
          <input
            className="input"
            type="password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            placeholder="Введіть поточний пароль"
            disabled={saving}
          />
        </Field>

        <Field label="Новий пароль *">
          <input
            className="input"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Мінімум 8 символів"
            disabled={saving}
          />
        </Field>

        <Field label="Підтвердіть пароль *">
          <input
            className="input"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Повторіть новий пароль"
            disabled={saving}
          />
        </Field>
      </div>

      <button
        onClick={handleChangePassword}
        disabled={saving}
        className="btn-sm"
        style={{
          marginTop: 28,
          background: success ? '#4CAF50' : undefined,
          minWidth: 180,
        }}
      >
        {saving ? 'Збереження...' : success ? '✓ Змінено' : 'Змінити пароль'}
      </button>
    </div>
  );
}