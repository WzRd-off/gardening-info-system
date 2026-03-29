from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session
from passlib.hash import bcrypt

from app.utils.database import get_db
from app.utils.security import get_current_user
from app.schemas.users import UserRead, UserUpdate, PasswordUpdate
from app.models.users import Users

router = APIRouter(prefix="/profile", tags=["Profile"])

# Отримання профілю поточного користувача

@router.get("/my_profile", response_model=UserRead)
async def get_profile(сurrent_user = Depends(get_current_user)):
    return сurrent_user

# Оновлення профілю поточного користувача

@router.put("/update_profile")
async def update_profile(profile_data: UserUpdate,
                         db: Session = Depends(get_db), 
                         current_user = Depends(get_current_user)):
    
    if profile_data.email and profile_data.email != current_user.email:
        stmt = select(Users).where(Users.email == profile_data.email and Users.id != current_user.id)
        existing_user = db.execute(stmt).scalars().first()

        if existing_user:
            raise HTTPException(
                status_code=409,
                detail="Користувач з такою поштою вже існує"
            )
    
    current_user.username = profile_data.get("username", current_user.username)
    current_user.email = profile_data.get("email", current_user.email)
    current_user.phone = profile_data.get("phone", current_user.phone)

    db.commit()
    db.refresh(current_user)

    return JSONResponse(status_code=200, content={
        "status": "success",
        "message": "Профіль успішно оновлено"
    })

# Оновлення пароля поточного користувача

@router.put("/change-password")
async def change_password(
    pass_data: PasswordUpdate, 
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    if not bcrypt.verify(pass_data.old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Старий пароль введений невірно"
        )

    hashed_password = bcrypt.hash(pass_data.new_password)
    
    current_user.password_hash = hashed_password
    
    db.commit()
    db.refresh(current_user)

    return {"status": "success", "message": "Пароль успішно змінено"}