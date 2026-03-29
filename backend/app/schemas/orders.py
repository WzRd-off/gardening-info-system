from pydantic import BaseModel, ConfigDict
from datetime import date
from decimal import Decimal
from typing import Optional

class OrderBase(BaseModel):
    execution_date: date
    regularity: Optional[str] = "разово"
    comment: Optional[str] = None
    plot_id: int
    service_id: int

class OrderCreate(OrderBase):
    pass

class OrderRead(OrderBase):
    id: int
    total_price: Decimal
    user_id: int
    status_id: int
    team_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)