import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Защищённый маршрут с проверкой авторизации и роли
 * @param {React.ReactNode} children - компонент для отображения
 * @param {number} allowedRole - требуемая роль (опционально)
 */
export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, isLoading, userRole } = useAuth();

  // Загрузка профиля
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Загрузка...</div>;
  }

  // Нет токена - перенаправляем на вход
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Проверяем роль если требуется
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};