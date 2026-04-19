import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Хук для доступe до контексту авторизації
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Помилка');
  }

  return context;
}
