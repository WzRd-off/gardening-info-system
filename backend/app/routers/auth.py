from fastapi import Depends, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter
from sqlalchemy import select
from sqlalchemy.orm import Session
from passlib.hash import bcrypt

from app.utils.database import get_db
from app.utils.generator_jwt import create_access_token
from app.schemas.users import UserCreate, UserLogin
from app.models.users import Users
from app.models.roles import Roles 

router = APIRouter(prefix='/auth', tags=['Authentication'])

# Реєстрація нового користувача
@router.post('/reg')
async def reg_user(user_data: UserCreate, db: Session = Depends(get_db)):
    # Чи існує юзер
    stmt = select(Users).where(Users.email == user_data.email)
    existing_user = db.execute(stmt).scalars().first()

    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Користувач з такою поштою вже існує")
    
    stmt_role = select(Roles).where(Roles.name == "Клієнт")
    role = db.execute(stmt_role).scalars().first()

    if not role:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Роль 'Клієнт' не знайдена в системі")

    hashed_password = bcrypt.hash(user_data.password)

    new_user = Users(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password,
        phone=user_data.phone,
        role_id=role.id
    )

    db.add(new_user)
    db.commit()
    
    # Створити JWT токен
    access_token = create_access_token(data={"sub": str(new_user.id), "role": new_user.role_id})
    
    response = JSONResponse(
        status_code=status.HTTP_201_CREATED, 
        content={'status': 'success', 'message': 'Користувача успішно зареєстровано'}
    )
    
    # Встановити HttpOnly cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # Встановити True для production (HTTPS)
        samesite="lax",
        max_age=1440 * 60  # 1 день в секундах
    )
    
    return response

# Авторизація користувача
@router.post('/login')
async def auth_user(auth_data: UserLogin, db: Session = Depends(get_db)):
    # Пошук юзера
    stmt = select(Users).where(Users.email == auth_data.email)
    user = db.execute(stmt).scalars().first()

    if not user or not bcrypt.verify(auth_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Невірний email або пароль")

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role_id})

    response = JSONResponse(
        status_code=status.HTTP_200_OK, 
        content={"status": "success", "message": "Ви успішно увійшли"}
    )
    
    # Встановити HttpOnly cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,  # Встановити True для production (HTTPS)
        samesite=None,
        max_age=1440 * 60  # 1 день в секундах
    )
    
    return response

# Вихід користувача
@router.post('/logout')
async def logout():
    response = JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "success", "message": "Ви успішно вийшли"}
    )
    
    # Видалити HttpOnly cookie
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=False,
        samesite="lax"
    )
    
    return response