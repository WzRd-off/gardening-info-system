from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ScheduleBase(BaseModel):
    order_id: int
    scheduled_time: datetime

class ScheduleCreate(ScheduleBase):
    pass

class ScheduleOut(ScheduleBase):
    id: int
    model_config = ConfigDict(from_attributes=True)