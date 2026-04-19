# 🌱 Gardening Info System

Полнофункциональная система управления садовыми участками с поддержкой заказов, команд и платежей.

## 🚀 Стек технологий

### Backend
- **FastAPI** - современный Python фреймворк
- **SQLAlchemy** - ORM для работы с БД
- **JWT** - аутентификация с токенами
- **Alembic** - миграции БД
- **CORS** - поддержка кросс-доменных запросов

### Frontend
- **React** - библиотека UI
- **Vite** - быстрый build tool
- **ESLint** - проверка качества кода
- **Modern JavaScript** - ES6+

---

## 📋 Структура проекта

```
gardening-info-system/
├── backend/                    # FastAPI приложение
│   ├── app/
│   │   ├── routers/           # API маршруты
│   │   │   ├── auth.py        # Аутентификация
│   │   │   ├── profile.py     # Профиль пользователя
│   │   │   ├── manager.py     # Менеджер
│   │   │   ├── team.py        # Бригады
│   │   │   └── order.py       # Заказы
│   │   ├── models/            # SQLAlchemy модели
│   │   ├── schemas/           # Pydantic схемы
│   │   ├── utils/             # Утилиты
│   │   └── server.py          # Конфиг FastAPI
│   ├── alembic/               # Миграции БД
│   └── images/                # Хранилище картинок
├── frontend/                  # React приложение
│   ├── src/
│   │   ├── components/        # React компоненты
│   │   ├── pages/             # Страницы
│   │   ├── services/          # API сервисы
│   │   ├── contexts/          # Context API
│   │   └── constants/         # Константы
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🔐 Миграция на HttpOnly Cookies

### ✅ Статус: ЗАВЕРШЕНА

Система аутентификации успешно перенесена с `localStorage` на **HttpOnly cookies** для повышения безопасности.

**Улучшения безопасности:**
- 🛡️ Защита от XSS атак (JavaScript не может прочитать cookie)
- 🔒 Автоматическое управление браузером
- 🚀 Встроенная CSRF защита через SameSite флаг

### Документация миграции:
- [README_MIGRATION.md](README_MIGRATION.md) - Итоговый отчет
- [START_HERE.md](START_HERE.md) - С чего начать
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Быстрое руководство

---

## ⚙️ Запуск приложения

### Backend

```bash
cd backend

# Активировать виртуальное окружение
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac

# Установить зависимости
pip install -r requirements.txt

# Запустить сервер
python -m uvicorn app.server:app --reload
# Доступно на http://localhost:8000
# API документация: http://localhost:8000/docs
```

### Frontend

```bash
cd frontend

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev
# Доступно на http://localhost:5173

# Build для production
npm run build

# Preview production build
npm run preview
```

---

## 🧪 Тестирование

### Быстрый тест

```bash
# Terminal 1: Backend
cd backend
python -m uvicorn app.server:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: API тесты
# POST /auth/login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}' \
  -c cookies.txt -v
```

### В браузере

1. Открыть http://localhost:5173
2. DevTools > Application > Cookies
3. Войти в систему
4. Проверить что `access_token` имеет флаг `HttpOnly` ✓
5. F5 (перезагрузить) - авторизация должна сохраниться ✓

---

## 🔑 Переменные окружения

### Backend

Создайте файл `backend/.env`:

```env
# Database
DATABASE_URL=sqlite:///./database.db

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Cookie settings
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
```

### Frontend

Создайте файл `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8000
```

---

## 📚 API Endpoints

### Аутентификация
- `POST /auth/login` - Вход пользователя
- `POST /auth/reg` - Регистрация
- `POST /auth/logout` - Выход

### Профиль
- `GET /profile/my_profile` - Мой профиль
- `PUT /profile/update_profile` - Обновить профиль
- `PUT /profile/change-password` - Изменить пароль

### Заказы
- `GET /orders/` - Все заказы
- `GET /orders/my_orders` - Мои заказы
- `POST /orders/` - Создать заказ

### Команды
- `GET /teams/` - Все команды
- `POST /teams/` - Создать команду
- `GET /teams/orders` - Заказы команды

### Менеджер
- `GET /manager/orders` - Управление заказами
- `GET /manager/services` - Услуги
- `GET /manager/schedules` - Расписание

### Услуги
- `GET /services/` - Все услуги

### Платежи
- `GET /payments/team` - Платежи команды
- `GET /payments/` - Все платежи

Полная документация: http://localhost:8000/docs (Swagger UI)

---

## 🛠️ Разработка

### Структура Branch'ей
- `main` - Production
- `develop` - Development
- `feature/*` - Новые функции

### Commit сообщения
```
[FEATURE] Добавлена поддержка cookies
[FIX] Исправлена ошибка в auth
[DOCS] Обновлена документация
```

---

## 🔒 Безопасность

### Текущая защита
- ✅ JWT токены с подписью
- ✅ HttpOnly cookies (XSS защита)
- ✅ SameSite флаги (CSRF защита)
- ✅ Хеширование паролей (bcrypt)
- ✅ CORS конфигурация
- ✅ Валидация данных (Pydantic)

### Recommendations
- Всегда использовать HTTPS в production
- Регулярно обновлять зависимости
- Использовать environment переменные для secrets
- Проводить security аудит регулярно

---

## 📊 Database

### Миграции

```bash
cd backend

# Создать новую миграцию
alembic revision --autogenerate -m "Описание миграции"

# Применить миграции
alembic upgrade head

# Откатить миграцию
alembic downgrade -1
```

### Модели
- Users - Пользователи
- Roles - Роли (Клієнт, Менеджер, Бригада)
- GardenPlots - Участки сада
- Plants - Растения
- Orders - Заказы
- OrderStatus - Статусы заказов
- Services - Услуги
- Teams - Команды
- Payments - Платежи
- Schedules - Расписание

---

## 🚀 Production Deploy

### Pre-deployment Checklist

```bash
# Backend
[ ] Установить COOKIE_SECURE=true
[ ] Установить COOKIE_SAMESITE=strict
[ ] Обновить CORS домены
[ ] Обновить SECRET_KEY
[ ] Проверить DATABASE_URL
[ ] Запустить tests
[ ] Проверить логи

# Frontend
[ ] npm run build
[ ] Проверить bundle size
[ ] Обновить VITE_API_URL
[ ] Проверить environment variables
[ ] Протестировать все routes
```

### Deploy Commands

```bash
# Backend (Docker)
docker build -t gardening-api .
docker run -p 8000:8000 --env-file .env gardening-api

# Frontend (Nginx)
npm run build
# Deploy dist/ folder to web server
```

---

## 🐛 Troubleshooting

### Backend не запускается
```bash
# Проверить зависимости
pip install -r requirements.txt

# Проверить БД
alembic upgrade head

# Проверить конфиг
cat .env
```

### Frontend ошибки
```bash
# Очистить кеш
rm -rf node_modules package-lock.json
npm install

# Проверить версию Node
node --version  # Нужна 16+
```

### Cookie не сохраняется
1. Проверить что backend возвращает Set-Cookie header
2. Проверить что frontend использует `credentials: 'include'`
3. Проверить DevTools > Application > Cookies

---

## 📞 Контакты и поддержка

Для вопросов или предложений создавайте Issues на GitHub.

---

## 📄 Лицензия

Проект распространяется под лицензией MIT.

---

## 🎯 Дорожная карта

- [ ] Двухфакторная аутентификация
- [ ] Refresh token механизм
- [ ] Улучшенный поиск и фильтрация
- [ ] Экспорт отчетов (PDF, Excel)
- [ ] Mobile приложение
- [ ] Real-time уведомления
- [ ] Integration с платежными системами

---

**Последнее обновление:** 2026-04-19  
**Версия:** 2.0 (HttpOnly Cookies Ready)  
**Статус:** ✅ Production Ready
