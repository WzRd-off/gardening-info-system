from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class OrderBase(BaseModel):
    plot_id: int
    service_id: int
    comment: Optional[str] = None

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    team_id: Optional[int] = None
    status_id: Optional[int] = None
    manager_instructions: Optional[str] = None

class OrderOut(OrderBase):
    id: int
    user_id: int
    team_id: Optional[int] = None
    status_id: int
    manager_instructions: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True