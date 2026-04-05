from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.utils.database import get_db
from app.utils.generator_jwt import create_access_token
from app.models.users import Users
from app.models.roles import Roles

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = create_access_token(token, credentials_exception)
    user = db.query(Users).filter(Users.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_manager(current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    role = db.query(Roles).filter(Roles.id == current_user.role_id).first()
    if not role or role.name != "Менеджер":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Доступ заборонено. Потрібні права Менеджера."
        )
    return current_user

def get_current_team(current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    role = db.query(Roles).filter(Roles.id == current_user.role_id).first()
    if not role or role.name != "Бригада":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Доступ заборонено. Потрібні права Бригади."
        )
    return current_user