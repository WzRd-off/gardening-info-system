from pydantic import BaseModel, ConfigDict
from typing import Optional

class TeamBase(BaseModel):
    name: str
    efficiency_rating: Optional[float] = 0.0

class TeamCreate(TeamBase):
    pass

class TeamRead(TeamBase):
    id: int
    model_config = ConfigDict(from_attributes=True)