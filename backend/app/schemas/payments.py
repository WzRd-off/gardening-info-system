from pydantic import BaseModel, ConfigDict
from datetime import datetime

class PaymentBase(BaseModel):
    amount: float
    payment_status: str

class PaymentOut(PaymentBase):
    id: int
    order_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)