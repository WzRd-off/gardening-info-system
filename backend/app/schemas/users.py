from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Optional, Annotated

class PasswordUpdate(BaseModel):
    old_password: str
    new_password: Annotated[str, Field(min_length=8, max_length=128)] 

class UserBase(BaseModel):
    username: str
    email: EmailStr
    phone: Optional[str] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    role_id: int

    model_config = ConfigDict(from_attributes=True)