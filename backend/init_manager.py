import sys
import os
import bcrypt
from sqlalchemy import select

# Додаємо шлях до кореневої директорії, щоб коректно імпортувати модулі app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Імпортуємо вашу сесію та модель користувача
from app.utils.database import SessionLocal
from app.models.users import Users

def create_superuser():
    db = SessionLocal()
    try:
        email = "manager@gmail.com"
        
        # Перевіряємо, чи вже існує менеджер з таким email
        stmt = select(Users).where(Users.email == email)
        existing_user = db.execute(stmt).scalars().first()
        
        if not existing_user:
            # Хешуємо пароль за допомогою bcrypt
            password = "manager321".encode('utf-8')
            hashed_password = bcrypt.hashpw(password, bcrypt.gensalt()).decode('utf-8')
            
            # Створюємо запис нового менеджера
            manager = Users(
                username="Manager",
                email=email,
                password_hash=hashed_password,
                role_id=2
            )
            
            db.add(manager)
            db.commit()
            print(f"Користувача {email} успішно створено з роллю ID: 2.")
        else:
            print(f"Користувач з email {email} вже існує в базі даних.")
            
    except Exception as e:
        print(f"Виникла помилка під час створення користувача: {e}")
        db.rollback()
    finally:
        # Обов'язково закриваємо сесію
        db.close()

if __name__ == "__main__":
    print("Ініціалізація початкових даних...")
    create_superuser()