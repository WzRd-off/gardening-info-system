from pydantic import BaseModel, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)