import { authAPI } from './api';

/**
 * Перевірити, чи є користувач автентифікований
 * Цей метод тепер мав би викликатися через AuthContext
 */
export const isAuthenticated = () => {
  // Рекомендується використовувати AuthContext для перевірки
  console.warn('isAuthenticated() is deprecated. Use AuthContext instead.');
  return false;
};

/**
 * Вхід користувача
 * Рекомендується використовувати AuthContext.login замість цієї функції
 */
export const login = async (email, password) => {
  try {
    const response = await authAPI.login(email, password);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Реєстрація користувача
 * Рекомендується використовувати AuthContext.register замість цієї функції
 */
export const register = async (username, email, password, phone = '') => {
  try {
    const response = await authAPI.register(username, email, password, phone);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Вихід користувача
 * Рекомендується використовувати AuthContext.logout замість цієї функції
 */
export const logout = async () => {
  try {
    await authAPI.logout();
  } catch (error) {
    console.error('Error logging out:', error);
  }
};