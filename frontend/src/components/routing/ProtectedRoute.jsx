import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Захищений маршрут із перевіркою авторизації та ролі
 * @param {React.ReactNode} children - компонент для відображення
 * @param {number} allowedRole - необхідна роль (опціонально)
 */
export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, isLoading, userRole } = useAuth();

  // Завантаження профілю
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Завантаження...</div>;
  }

  // Немає токена — перенаправляємо на вхід
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Перевіряємо роль, якщо це потрібно
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};