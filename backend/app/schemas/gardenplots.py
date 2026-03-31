from pydantic import BaseModel, ConfigDict
from datetime import date
from decimal import Decimal
from typing import Optional

class GardenPlotBase(BaseModel):
    address: Optional[str] = None
    area: Decimal
    features: Optional[str] = None

class GardenPlotCreate(GardenPlotBase):
    pass

class GardenPlotUpdate(GardenPlotBase):
    pass

class GardenPlotRead(GardenPlotBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)