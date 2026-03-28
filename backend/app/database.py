from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Cессія для запитів у таблиці
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Батьківський класс для моделей
Base = declarative_base()

# Функція для доступу до бд через роути
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()