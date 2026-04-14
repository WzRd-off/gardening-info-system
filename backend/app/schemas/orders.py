from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from decimal import Decimal

# ─── Short schemas for nested responses ───────────────────────────────────────

class UserShortSchema(BaseModel):
    id: int
    username: str
    email: str
    phone: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ServiceShortSchema(BaseModel):
    id: int
    name: str
    price: Decimal
    category: Optional[str] = None
    image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class PlotShortSchema(BaseModel):
    id: int
    address: Optional[str] = None
    area: Decimal

    model_config = ConfigDict(from_attributes=True)

class OrderStatusShortSchema(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)

# ─── Main order schemas ───────────────────────────────────────────────────────

class OrderBase(BaseModel):
    plot_id: int
    service_id: int
    comment: Optional[str] = None
    execution_date: Optional[datetime] = None
    regularity: Optional[str] = None
    total_price: Optional[float] = None

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    team_id: Optional[int] = None
    manager_instructions: Optional[str] = None
    scheduled_date: Optional[datetime] = None

class OrderOut(OrderBase):
    id: int
    user_id: int
    team_id: Optional[int] = None
    status_id: int
    manager_instructions: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ─── Enhanced response with nested objects ────────────────────────────────────

class OrderResponse(BaseModel):
    id: int
    user: UserShortSchema
    team_id: Optional[int] = None
    status: OrderStatusShortSchema
    plot: PlotShortSchema
    service: ServiceShortSchema
    comment: Optional[str] = None
    manager_instructions: Optional[str] = None
    execution_date: Optional[datetime] = None
    regularity: Optional[str] = None
    total_price: Optional[float] = None
    created_at: datetime
    scheduled_date: Optional[datetime] = None
    schedule_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)