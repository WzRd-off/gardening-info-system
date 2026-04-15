import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Хук для доступа к контексту авторизации
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth должен быть использован внутри AuthProvider');
  }

  return context;
}
