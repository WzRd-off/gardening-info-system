import { authAPI } from './api';

/**
 * Получить текущий токен
 */
export const getToken = () => localStorage.getItem('jwt');

/**
 * Установить токен
 */
export const setToken = (token) => {
  if (token) {
    localStorage.setItem('jwt', token);
  } else {
    localStorage.removeItem('jwt');
  }
};

/**
 * Проверить, есть ли действительный токен
 */
export const isAuthenticated = () => !!getToken();

/**
 * Вход пользователя
 */
export const login = async (email, password) => {
  try {
    const response = await authAPI.login(email, password);
    if (response.access_token) {
      setToken(response.access_token);
      return { success: true, token: response.access_token };
    }
    return { success: false, error: 'Токен не получен' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Регистрация пользователя
 */
export const register = async (username, email, password, phone = '') => {
  try {
    const response = await authAPI.register(username, email, password, phone);
    if (response.access_token) {
      setToken(response.access_token);
      return { success: true, token: response.access_token };
    }
    return { success: false, error: 'Токен не получен' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Выход пользователя
 */
export const logout = () => {
  setToken(null);
};
