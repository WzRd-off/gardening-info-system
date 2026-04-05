from pydantic import BaseModel, ConfigDict
from typing import Optional

class PlantBase(BaseModel):
    plant_type: str
    description: Optional[str] = None

class PlantCreate(PlantBase):
    pass

class PlantOut(PlantBase):
    id: int
    plot_id: int

    model_config = ConfigDict(from_attributes=True)