import { authAPI } from './api';

/**
 * Отримати поточний токен
 */
export const getToken = () => localStorage.getItem('jwt');

/**
 * Встановити токен
 */
export const setToken = (token) => {
  if (token) {
    localStorage.setItem('jwt', token);
  } else {
    localStorage.removeItem('jwt');
  }
};

/**
 * Перевірити, чи є дійсний токен
 */
export const isAuthenticated = () => !!getToken();

/**
 * Вхід користувача
 */
export const login = async (email, password) => {
  try {
    const response = await authAPI.login(email, password);
    if (response.access_token) {
      setToken(response.access_token);
      return { success: true, token: response.access_token };
    }
    return { success: false, error: 'Токен не отримано' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Реєстрація користувача
 */
export const register = async (username, email, password, phone = '') => {
  try {
    const response = await authAPI.register(username, email, password, phone);
    if (response.access_token) {
      setToken(response.access_token);
      return { success: true, token: response.access_token };
    }
    return { success: false, error: 'Токен не отримано' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Вихід користувача
 */
export const logout = () => {
  setToken(null);
};