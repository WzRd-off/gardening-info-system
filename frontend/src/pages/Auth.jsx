import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'

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
        const response = await fetch('http://127.0.0.1:8000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json ; charset=utf-8',
          },
          body: JSON.stringify({
            email: email,
            password: password
          }),
        });

        const data = await response.json();
        
        if (response.ok) {      
            localStorage.setItem('jwt', data.access_token);
            window.location.href = '/'; 
        } else {
            setErrorMessage(data.detail || 'Помилка авторизації');
        }
      } else {
        if (password !== confirmPassword) {
            setErrorMessage('Паролі не співпадають');
            return;
        }

        const response = await fetch('http://127.0.0.1:8000/auth/reg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                phone: phone
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Реєстрація успішна! Тепер ви можете увійти.');
            handleTabChange('login'); 
        } else {
            setErrorMessage(data.detail || 'Помилка реєстрації');
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
                    required 
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

                <button type="submit" className="btn-filled">
                {activeTab === 'login' ? 'Увійти' : 'Зареєструватися'}
                </button>

            </form>

        </div>
    </div>
    <Footer />
    </>
  );
}