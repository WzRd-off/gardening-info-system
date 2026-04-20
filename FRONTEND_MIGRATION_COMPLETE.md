# Миграция Фронтенда на HttpOnly Cookies - Завершено ✅

## Резюме

Система аутентификации React-приложения успешно перенесена с **localStorage** на **HttpOnly cookies**. Все JWT токены теперь управляются браузером безопасно, без доступа из JavaScript.

---

## Изменения по файлам

### 1. 📄 `frontend/src/services/api.js`

**Удалены:**
- ❌ Функция `getAuthHeaders()` - больше не нужна передача токена в заголовках
- ❌ Логика `localStorage.getItem('jwt')` в заголовках

**Обновлено:**
- ✅ `getJsonHeaders()` - удалена логика Authorization заголовка
- ✅ `apiFetch()` - добавлен параметр `credentials: 'include'` для всех запросов
- ✅ Обработка 401 ошибки - удалена операция `localStorage.removeItem('jwt')`
- ✅ `authAPI.logout()` - добавлен новый метод для вызова API выхода

**Примеры изменений:**

```javascript
// ДО
const headers = options.headers || getJsonHeaders();
const response = await fetch(url, {
  ...options,
  headers
});
if (response.status === 401) {
  localStorage.removeItem('jwt');  // ❌ Удалено
  window.location.href = '/auth';
}

// ПОСЛЕ
const headers = options.headers || getJsonHeaders();
const response = await fetch(url, {
  ...options,
  headers,
  credentials: 'include'  // ✅ Добавлено
});
if (response.status === 401) {
  window.location.href = '/auth';
}
```

---

### 2. 📄 `frontend/src/contexts/AuthContext.jsx`

**Удалено:**
- ❌ Состояние `token` - больше не отслеживаем токен вручную
- ❌ Все вызовы `localStorage.getItem/setItem/removeItem`
- ❌ Зависимость `[token]` в useEffect
- ❌ Ручная передача `Authorization: Bearer ...` заголовков

**Обновлено:**
- ✅ Импорт `authAPI` и `profileAPI` из `api.js`
- ✅ Новый `useEffect` для проверки аутентификации при загрузке
- ✅ Функция `login()` - после login запрашиваем профиль
- ✅ Функция `register()` - после регистрации делаем login и запрашиваем профиль
- ✅ Функция `logout()` - вызываем API logout перед очисткой состояния
- ✅ `isAuthenticated` - основан на наличии `user` объекта

**Ключевые изменения:**

```javascript
// ДО
const [token, setToken] = useState(() => localStorage.getItem('jwt'));
useEffect(() => {
  if (!token) { setIsLoading(false); return; }
  // Запрашиваем профиль с токеном из localStorage
}, [token]);

// ПОСЛЕ
const [user, setUser] = useState(null);
useEffect(() => {
  // Запрашиваем профиль при загрузке - если есть cookie, работает автоматически
  const checkAuth = async () => {
    try {
      const userData = await profileAPI.getMyProfile();
      setUser(userData);
    } catch (err) {
      setUser(null);
    }
  };
  checkAuth();
}, []);
```

**Функция login:**
```javascript
const login = async (email, password) => {
  await authAPI.login(email, password);  // Бэкенд установит cookie
  const userData = await profileAPI.getMyProfile();  // Запросим профиль
  setUser(userData);
};
```

**Функция logout:**
```javascript
const logout = async () => {
  await authAPI.logout();  // Бэкенд удалит cookie
  setUser(null);
};
```

---

### 3. 📄 `frontend/src/services/authService.js`

**Удалено:**
- ❌ `getToken()` - больше не нужна работа с localStorage
- ❌ `setToken()` - больше не нужна работа с localStorage
- ❌ Логика сохранения токена в функциях login/register

**Обновлено:**
- ✅ `isAuthenticated()` - добавлено предупреждение использовать AuthContext
- ✅ `login()` - упрощена, не возвращает токен
- ✅ `register()` - упрощена, не возвращает токен
- ✅ `logout()` - вызывает API вместо localStorage очистки

**Примечание:** Этот файл оставлен для обратной совместимости. Рекомендуется использовать `AuthContext` напрямую в компонентах.

---

## Архитектурные изменения

### Поток аутентификации (ДО)

```
1. User вводит email/password
   ↓
2. POST /auth/login
   ↓
3. Бэкенд возвращает: { access_token: "jwt..." }
   ↓
4. Фронтенд сохраняет в: localStorage.setItem('jwt', token)
   ↓
5. Каждый запрос отправляет: Authorization: Bearer jwt...
   ↓
6. При logout: localStorage.removeItem('jwt')
```

### Поток аутентификации (ПОСЛЕ)

```
1. User вводит email/password
   ↓
2. POST /auth/login { credentials: 'include' }
   ↓
3. Бэкенд возвращает: Set-Cookie: access_token=jwt...; HttpOnly
   ↓
4. Браузер автоматически сохраняет cookie (js не может прочитать)
   ↓
5. Каждый запрос автоматически отправляет: Cookie: access_token=jwt...
   ↓
6. При logout: POST /auth/logout, бэкенд удаляет cookie
```

### Преимущества

| Аспект | localStorage | HttpOnly Cookies |
|--------|--------------|-----------------|
| **XSS атаки** | ❌ Уязвим | ✅ Защищен |
| **Доступ из JS** | ❌ Легко | ✅ Невозможен |
| **Автоматическая отправка** | ❌ Нет | ✅ Да |
| **CSRF защита** | ❌ Нужно реализовывать | ✅ SameSite флаг |
| **Размер ограничен** | ❌ До 5MB | ✅ До 4KB |
| **Браузер управляет** | ❌ Нет | ✅ Да |

---

## Проверка работоспособности

### ✅ Локальное тестирование

1. **Login**
   ```bash
   npm run dev
   # Открыть http://localhost:5173
   # Войти в систему
   # DevTools > Application > Cookies > access_token (должен быть HttpOnly)
   ```

2. **Persistence**
   ```bash
   # После login:
   # F5 - перезагрузить страницу
   # Авторизация должна сохраниться ✓
   ```

3. **Logout**
   ```bash
   # Нажать кнопку logout
   # DevTools > Cookies > access_token должен быть удален ✓
   ```

4. **Protected Routes**
   ```bash
   # Попробовать открыть /profile без авторизации
   # Должно быть перенаправление на /auth ✓
   ```

### ⚠️ Что нужно для полной работы

1. **Бэкенд должен быть обновлен** (см. [BACKEND_MIGRATION_CHECKLIST.md](./BACKEND_MIGRATION_CHECKLIST.md))
   - `/auth/login` должен устанавливать cookie
   - `/auth/logout` должен удалять cookie
   - `/auth/reg` должен устанавливать cookie

2. **CORS должен быть настроен**
   - `allow_credentials=True` ✓ (уже есть)
   - `allow_origins` с явным доменом ✓ (уже есть)

---

## Возможные проблемы и решения

### ❌ "Cookie не видна в DevTools"

**Причина:** Бэкенд не устанавливает cookie или не использует HttpOnly

**Решение:** Проверить, что бэкенд использует `response.set_cookie()` с флагом `httponly=True`

### ❌ "401 при каждом запросе"

**Причина:** Бэкенд не получает cookie или не читает её правильно

**Решение:** 
- Проверить, что фронтенд отправляет `credentials: 'include'` ✓
- Проверить, что бэкенд читает из `Cookie` заголовка, а не `Authorization` ✓

### ❌ "CORS ошибки при login"

**Причина:** `allow_credentials=True` не установлен на бэкенде

**Решение:** Убедиться, что в CORS Middleware `allow_credentials=True`

### ❌ "После перезагрузки приложение говорит что не авторизован"

**Причина:** `useEffect` для проверки аутентификации не завершился

**Решение:** Подождать, пока `isLoading` станет `false`, затем проверять `isAuthenticated`

---

## Environment Configuration

### Локальная разработка (`.env.local`)

```javascript
# frontend/.env.local
VITE_API_URL=http://localhost:8000
```

### Production (`.env.production`)

```javascript
# frontend/.env.production
VITE_API_URL=https://api.production.com
```

---

## Следующие шаги

1. **Обновить бэкенд** согласно [BACKEND_MIGRATION_CHECKLIST.md](./BACKEND_MIGRATION_CHECKLIST.md)
2. **Протестировать** полный цикл login/logout
3. **Проверить** что все защищенные эндпоинты работают
4. **Документировать** для команды разработки
5. **Развернуть** на production с параметрами `secure=True` и `samesite="strict"`

---

## Файлы, затронутые изменениями

```
frontend/
├── src/
│   ├── services/
│   │   ├── api.js ✅ ОБНОВЛЕНО
│   │   └── authService.js ✅ ОБНОВЛЕНО
│   └── contexts/
│       └── AuthContext.jsx ✅ ОБНОВЛЕНО
└── package.json ⚠️ (без изменений)

backend/
├── app/
│   ├── routers/
│   │   └── auth.py 📝 ТРЕБУЕТ ОБНОВЛЕНИЯ
│   └── utils/
│       └── security.py 📝 ТРЕБУЕТ ОБНОВЛЕНИЯ
└── BACKEND_MIGRATION_CHECKLIST.md ✅ СОЗДАНО
```

---

## Контрольный список (Frontend ✅ завершен)

- [x] Удалить localStorage логику из api.js
- [x] Добавить credentials: 'include' во все fetch запросы
- [x] Обновить AuthContext.jsx - новая логика аутентификации
- [x] Удалить getToken/setToken из authService.js
- [x] Добавить /auth/logout в authAPI
- [x] Создать документацию для бэкенда

---

## Документация

- 📄 [BACKEND_MIGRATION_CHECKLIST.md](./BACKEND_MIGRATION_CHECKLIST.md) - инструкции для бэкенда
- 📄 [api.js](./frontend/src/services/api.js) - обновленный API слой
- 📄 [AuthContext.jsx](./frontend/src/contexts/AuthContext.jsx) - обновленный контекст аутентификации
- 📄 [authService.js](./frontend/src/services/authService.js) - обновленный сервис (legacy)

---

**Дата завершения:** 2026-04-19  
**Статус:** ✅ FRONTEND ГОТОВ К ТЕСТИРОВАНИЮ  
**Следующий шаг:** Обновить бэкенд
