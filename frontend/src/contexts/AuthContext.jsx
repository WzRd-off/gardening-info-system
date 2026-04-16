import React, { createContext, useState, useEffect, useCallback } from 'react';

/**
 * Базова URL-адреса API. 
 * Визначена локально, щоб уникнути помилок імпорту в поточному середовищі.
 */
const API_BASE_URL = 'http://localhost:8000';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('jwt'));

  // Завантаження профілю за наявності токена
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/profile/my_profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          // Термін дії токена закінчився
          localStorage.removeItem('jwt');
          setToken(null);
          setUser(null);
          setError('Сесія завершилася. Будь ласка, увійдіть знову');
          return;
        }

        if (!response.ok) {
          throw new Error('Помилка під час завантаження профілю');
        }

        const userData = await response.json();
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error('Помилка під час завантаження профілю:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Вхід
  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Помилка входу');
      }

      const data = await response.json();
      const newToken = data.access_token;

      localStorage.setItem('jwt', newToken);
      setToken(newToken);

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Реєстрація
  const register = useCallback(async (username, email, password, phone = '') => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/reg`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, phone })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Помилка реєстрації');
      }

      // Після реєстрації потрібно виконати вхід
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.detail || 'Помилка входу після реєстрації');
      }

      const loginData = await loginResponse.json();
      const newToken = loginData.access_token;

      localStorage.setItem('jwt', newToken);
      setToken(newToken);

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Вихід
  const logout = useCallback(() => {
    localStorage.removeItem('jwt');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const value = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    userRole: user?.role_id
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}