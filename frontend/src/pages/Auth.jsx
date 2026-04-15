import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../hooks/useAuth';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      if (activeTab === 'login') {
        const result = await login(email, password);
        if (result.success) {
          navigate('/');
        } else {
          setErrorMessage(result.error || 'Помилка входу');
        }
      } else {
        if (password !== confirmPassword) {
          setErrorMessage('Паролі не співпадають');
          return;
        }

        const result = await register(username, email, password, phone);
        if (result.success) {
          navigate('/');
        } else {
          setErrorMessage(result.error || 'Помилка реєстрації');
        }
      }
    } catch (error) {
      setErrorMessage('Помилка з\'єднання з сервером');
    }
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-tabs">
            <div
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => handleTabChange('login')}
            >
              Вхід
            </div>
            <div
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => handleTabChange('register')}
            >
              Реєстрація
            </div>
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <form onSubmit={handleSubmit}>
            {activeTab === 'register' && (
              <div className="input-group">
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Ваше ім'я"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="input-group">
              <input
                type="email"
                className="auth-input"
                placeholder="Електронна пошта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {activeTab === 'register' && (
              <div className="input-group">
                <input
                  type="tel"
                  className="auth-input"
                  placeholder="Телефон"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            <div className="input-group">
              <input
                type="password"
                className="auth-input"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {activeTab === 'register' && (
              <div className="input-group">
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Підтвердження пароля"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <button type="submit" className="btn-filled" disabled={isLoading}>
              {isLoading ? 'Завантаження...' : activeTab === 'login' ? 'Увійти' : 'Зареєструватися'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}