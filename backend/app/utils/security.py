from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import select
from jose import jwt, JWTError

from app.utils.database import get_db
# Імпортуємо константи для розшифровки токена
from app.utils.generator_jwt import SECRET_KEY, ALGORITHM
from app.models.users import Users
from app.models.roles import Roles

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не вдалося перевірити облікові дані",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    stmt = select(Users).where(Users.id == int(user_id))
    user = db.execute(stmt).scalars().first()
    
    if user is None:
        raise credentials_exception
        
    return user

def get_current_manager(current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    stmt = select(Roles).where(Roles.id == current_user.role_id)
    role = db.execute(stmt).scalars().first()
    if not role or role.name != "Менеджер":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Доступ заборонено. Потрібні права Менеджера."
        )
    return current_user

def get_current_team(current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    stmt = select(Roles).where(Roles.id == current_user.role_id)
    role = db.execute(stmt).scalars().first()
    if not role or role.name != "Бригада":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Доступ заборонено. Потрібні права Бригади."
        )
    return current_user