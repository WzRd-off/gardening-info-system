# 🎯 Шпаргалка по использованию новой архитектуры

## 1. Использование useAuth в компонентах

```javascript
import { useAuth } from '../hooks/useAuth';

export function MyComponent() {
  const { user, isAuthenticated, userRole, login, logout, isLoading } = useAuth();

  return (
    <>
      {isLoading && <p>Загрузка...</p>}
      {isAuthenticated ? (
        <>
          <p>Вы вошли как: {user.username}</p>
          <button onClick={logout}>Выход</button>
        </>
      ) : (
        <p>Пожалуйста, войдите</p>
      )}
    </>
  );
}
```

## 2. Использование API сервисов

```javascript
import { profileAPI, managerAPI, ordersAPI } from '../services/api';

// Получить профиль
const user = await profileAPI.getMyProfile();

// Обновить профиль
await profileAPI.updateProfile({ username: 'New Name' });

// Получить заказы
const orders = await managerAPI.getOrders();

// Обновить статус заказа
await managerAPI.updateOrderStatus(orderId, 2);
```

## 3. Защита маршрутов

```javascript
// Уже настроено в App.jsx!
<Route path="/manager" element={<ProtectedRoute allowedRole={2}><ManagerPage /></ProtectedRoute>} />
<Route path="/team" element={<ProtectedRoute allowedRole={3}><TeamPage /></ProtectedRoute>} />
```

## 4. Обработка ошибок

```javascript
try {
  await profileAPI.updateProfile(data);
} catch (error) {
  console.error('Ошибка:', error.message);
  // Ошибка 401 автоматически перенаправит на /auth
}
```

## 5. Компоненты, готовые к использованию

✅ **Header** — использует useAuth  
✅ **Auth.jsx** — использует контекст  
✅ **ProtectedRoute** — проверяет роли  

## 6. Как обновить существующий компонент

```javascript
// ДО (старое)
const headers = { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` };
const response = await fetch(`${API_BASE_URL}/profile/my_plots`, { headers });
const plots = await response.json();

// ПОСЛЕ (новое)
import { profileAPI } from '../services/api';
const plots = await profileAPI.getMyPlots();
```

## 7. Роли пользователей

```
role_id = 1: Клієнт (обычный пользователь)
role_id = 2: Менеджер
role_id = 3: Бригадир (Team)
```

## 8. Структура папок

```
📁 frontend/src/
├── 📁 contexts/        # AuthContext
├── 📁 hooks/           # useAuth
├── 📁 services/        # API функции
├── 📁 components/      # React компоненты
├── 📁 pages/           # Страницы
└── App.jsx             # С AuthProvider!
```

## ⚡ Быстрые команды

```bash
# Сборка
npm run build

# Разработка
npm run dev

# Linting
npm run lint
```

## 📚 Полная документация

Смотри `ARCHITECTURE.md` для подробного описания!
