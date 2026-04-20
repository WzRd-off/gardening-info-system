from pydantic import BaseModel, ConfigDict
from datetime import datetime

class PaymentBase(BaseModel):
    amount: float

class PaymentOut(PaymentBase):
    id: int
    order_id: int
    team_id: int
    payment_date: datetime
    status: str = 'pending'

    model_config = ConfigDict(from_attributes=True)