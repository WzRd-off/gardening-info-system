from fastapi import Depends, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter
from sqlalchemy import select
from sqlalchemy.orm import Session
from passlib.hash import bcrypt

from backend.app.utils.database import get_db
from models.users import Users
from models.roles import Roles 

router = APIRouter(prefix='/auth', tags=['Authentication'])

@router.post('/reg')
async def reg_user(user_data: dict, db: Session = Depends(get_db)):
    # Чи існує юзер
    stmt = select(Users).where(Users.email == user_data.get('email'))
    existing_user = db.execute(stmt).scalars().first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Користувач з такою поштою вже існує"
        )
    
    stmt_role = select(Roles).where(Roles.name == "Клієнт")
    role = db.execute(stmt_role).scalars().first()

    if not role:
        raise HTTPException(status_code=500, detail="Роль 'Клієнт' не знайдена в системі")

    hashed_password = bcrypt.hash(user_data.get('password'))

    new_user = Users(
        username=user_data.get('username'),
        email=user_data.get('email'),
        password_hash=hashed_password,
        phone=user_data.get('phone'),
        role_id=role.id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={
        'stasus': 'success', 'message': 'Користувача успішно зареєстровано'
    })

@router.post('/login')
async def auth_user(auth_data: dict, db: Session = Depends(get_db)):
    # Пошук юзера
    stmt = select(Users).where(Users.email == auth_data.get('email'))
    user = db.execute(stmt).scalars().first()

    if not user or not bcrypt.verify(auth_data.get('password'), user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Невірний email або пароль"
        )

    access_token =

    return JSONResponse(status_code=status.HTTP_200_OK, content={
        "status": "success", 
        "access_token": access_token
        "message": "Ви успішно увійшли",
    })