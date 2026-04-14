from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional

class ScheduleBase(BaseModel):
    order_id: int
    scheduled_time: datetime

class ScheduleCreate(ScheduleBase):
    pass

class ScheduleUpdate(BaseModel):
    scheduled_time: datetime

    model_config = ConfigDict(from_attributes=True)

class ScheduleOut(ScheduleBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

# Forward reference for circular import avoidance
class ScheduleWithOrderOut(BaseModel):
    id: int
    scheduled_time: datetime
    order_id: int
    order: Optional['OrderResponse'] = None  # type: ignore

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

# Update forward references after OrderResponse is available
from app.schemas.orders import OrderResponse  # noqa: E402, F401
ScheduleWithOrderOut.model_rebuild()