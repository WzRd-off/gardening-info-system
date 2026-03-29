from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from decimal import Decimal


class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal = Field(max_digits=10, decimal_places=2)
    image_url: Optional[str] = None

class ServiceRead(ServiceBase):
    id: int
    model_config = ConfigDict(from_attributes=True)