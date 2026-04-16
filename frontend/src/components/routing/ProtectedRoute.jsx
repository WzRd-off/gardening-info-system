import React, { useState, useEffect, createContext, useContext } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Контекст авторизації (локальна реалізація для забезпечення автономності файлу)
 */
const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: false,
  userRole: null
});

/**
 * Хук для доступу до стану авторизації
 * У реальному проекті цей хук зазвичай знаходиться у окремому файлі.
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Захищений маршрут із перевіркою авторизації та ролі.
 * Забезпечує доступ до сторінок лише автентифікованим користувачам з відповідними правами.
 * @param {React.ReactNode} props.children - Компонент, який потрібно відобразити
 * @param {number} [props.allowedRole] - Код ролі, необхідний для доступу (опціонально)
 */
const ProtectedRoute = ({ children, allowedRole }) => {
  // Отримуємо дані про стан користувача з контексту
  const { isAuthenticated, isLoading, userRole } = useAuth();

  // Відображаємо індикатор завантаження, поки перевіряється профіль
  if (isLoading) {
    return (
      <div 
        style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          fontFamily: 'sans-serif',
          color: '#666'
        }}
      >
        Завантаження...
      </div>
    );
  }

  // Якщо користувач не авторизований (немає токена) — перенаправляємо на сторінку входу
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Якщо вказана обов'язкова роль, але роль користувача не відповідає їй — повертаємо на головну
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // Якщо всі перевірки пройдено — відображаємо вкладений контент
  return children;
};

export default ProtectedRoute;