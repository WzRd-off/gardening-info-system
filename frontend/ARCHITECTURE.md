# Архитектура фронтенда - Gardening Info System

## 📋 Обзор

Фронтенд использует **Context API** для управления состоянием авторизации и **API слой** для центализованной работы с бэкендом.

## 📁 Структура папок

```
src/
├── components/          # React компоненты
│   ├── routing/        # ProtectedRoute для защиты маршрутов
│   ├── layout/         # Header, Footer
│   ├── auth/           # Компоненты авторизации
│   ├── profile/        # Компоненты профиля пользователя
│   ├── manager/        # Компоненты для менеджера (role_id=2)
│   ├── team/           # Компоненты для бригадира (role_id=3)
│   ├── order/          # Компоненты для заказов
│   └── landing/        # Компоненты главной страницы
├── contexts/           # React Context (AuthContext)
├── hooks/              # Custom React hooks (useAuth)
├── pages/              # Страницы (Main, Auth, Profile, Manager, Team)
├── services/           # API сервисы
│   ├── config.js       # Конфигурация API (BASE_URL)
│   ├── api.js          # Базовые функции для API запросов
│   ├── authService.js  # Сервис авторизации
│   ├── profileService.js # Сервис профиля
│   ├── managerService.js # Сервис менеджера
│   └── teamService.js  # Сервис команды
└── App.jsx             # Главный компонент с маршрутизацией
```

## 🔐 Авторизация и защита маршрутов

### AuthContext
Хранит:
- `user` - данные пользователя
- `token` - JWT токен
- `isAuthenticated` - статус авторизации
- `userRole` - роль пользователя (1=Client, 2=Manager, 3=Team)
- `isLoading` - статус загрузки
- `error` - сообщение об ошибке

Методы:
- `login(email, password)` - вход
- `register(username, email, password, phone)` - регистрация
- `logout()` - выход

### useAuth Hook
```javascript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, token, isAuthenticated, userRole, login, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Привет, {user.username}!</p>
      ) : (
        <p>Пожалуйста, войдите</p>
      )}
    </div>
  );
}
```

### ProtectedRoute
Компонент для защиты маршрутов:
```javascript
// Только для авторизованных пользователей
<Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

// Для менеджеров (role_id=2)
<Route path="/manager" element={<ProtectedRoute allowedRole={2}><ManagerPage /></ProtectedRoute>} />

// Для бригадиров (role_id=3)
<Route path="/team" element={<ProtectedRoute allowedRole={3}><TeamPage /></ProtectedRoute>} />
```

## 🔗 API Сервисы

### api.js
Содержит базовые функции и API clients группированные по модулям:

- `authAPI` - авторизация
- `profileAPI` - профиль пользователя
- `ordersAPI` - заказы
- `managerAPI` - функции менеджера
- `teamsAPI` - команды
- `servicesAPI` - услуги
- `paymentsAPI` - платежи

### Использование API

```javascript
import { profileAPI, managerAPI } from '../services/api';

// Получить профиль
const user = await profileAPI.getMyProfile();

// Обновить профиль
await profileAPI.updateProfile({ username: 'New Name' });

// Получить заказы (менеджер)
const orders = await managerAPI.getOrders({ status: 1 });
```

### authService.js
Удобные функции для работы с авторизацией:
```javascript
import * as authService from '../services/authService';

await authService.login(email, password);
await authService.register(username, email, password, phone);
authService.logout();
```

### profileService.js
Функции для работы с профилем:
```javascript
import * as profileService from '../services/profileService';

await profileService.getMyProfile();
await profileService.updateProfile(data);
await profileService.addPlot(address, area, features);
```

## 📝 Примеры использования

### Компонент с Context
```javascript
import { useAuth } from '../hooks/useAuth';

export function MyProfile() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>{user.username}</h1>
      <p>{user.email}</p>
      <button onClick={logout}>Выход</button>
    </div>
  );
}
```

### Компонент с API сервисом
```javascript
import { useEffect, useState } from 'react';
import { managerAPI } from '../services/api';

export function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    managerAPI.getOrders()
      .then(setOrders)
      .catch(error => console.error(error))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <ul>
      {orders.map(order => (
        <li key={order.id}>{order.title}</li>
      ))}
    </ul>
  );
}
```

## 🔄 Обработка ошибок

API сервис автоматически:
- Обновляет заголовки авторизации из localStorage
- Обрабатывает 401 ошибки (перенаправляет на /auth)
- Преобразует JSON ответы
- Обрабатывает пустые ответы (204)

```javascript
try {
  await profileAPI.updateProfile(data);
} catch (error) {
  console.error(error.message);
}
```

## 🚀 Миграция существующих компонентов

### Перед (Old)
```javascript
const authHeaders = { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` };
const response = await fetch(`${API_BASE_URL}/profile/my_profile`, {
  headers: authHeaders
});
```

### После (New)
```javascript
import { profileAPI } from '../services/api';

const user = await profileAPI.getMyProfile();
```

## 🛠️ Конфигурация

`services/config.js`:
```javascript
export const API_BASE_URL = 'http://127.0.0.1:8000';
```

Измените URL при развертывании в production.

## 📦 Установка и использование

1. Обновите `main.jsx` для использования AuthProvider:
```javascript
import { AuthProvider } from './contexts/AuthContext';

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```

2. Используйте `useAuth` в компонентах вместо прямого доступа к localStorage
3. Используйте API сервисы вместо прямых fetch вызовов

## ✅ Преимущества новой архитектуры

- ✅ Нет дублирования кода
- ✅ Централизованная обработка авторизации
- ✅ Единая точка обработки ошибок
- ✅ Легко добавлять новые API функции
- ✅ Лучше типизация (для TypeScript)
- ✅ Проще тестировать компоненты
- ✅ Более читаемый и поддерживаемый код
