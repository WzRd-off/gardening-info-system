import React, { useState } from 'react';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setName] = useState(''); 
  const [phone, setPhone] = useState('');
  
  const [errorMessage, setErrorMessage] = useState('');

  // Очистка ошибок при смене таба
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMessage('');
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      if (activeTab === 'login') {
        const formData = new URLSearchParams();
        formData.append('username', email); // В доках указано, что логин идет как username (email)
        formData.append('password', password);

        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        });

        const data = await response.json();
        
        if (response.ok) {      
            localStorage.setItem('jwt', data.access_token);
        } else {
          setErrorMessage(data.detail || 'Помилка авторизації');
        }
        
      } else {
        // Валидация совпадения паролей
        if (password !== confirmPassword) {
          setErrorMessage('Паролі не співпадають');
          return;
        }

        // Регистрация: обычный JSON
        const response = await fetch('/auth/reg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password, phone }),
        });
        
        const data = await response.json();

        if (response.ok) {
          console.log('Успішна реєстрація!', data);
          setActiveTab('login');
        } else {
          setErrorMessage(data.detail || 'Помилка реєстрації');
        }
      }
    } catch (error) {
      console.error('Помилка при відправці запиту:', error);
    }
  };

  return (
    <div className="auth-container">
        <div className="auth-card">
        
            {/* AuthTabs */}
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

            {/* Вывод ошибки */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            {/* Форма */}
            <form onSubmit={handleSubmit}>
                
                {/* Поле "Имя" показываем только при регистрации */}
                {activeTab === 'register' && (
                <div className="input-group">
                    <input 
                    type="text" 
                    className="auth-input" 
                    placeholder="Ваше ім'я" 
                    value={username}
                    onChange={(e) => setName(e.target.value)}
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

                {/* Поле "Телефон" показываем только при регистрации */}
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
  );
}