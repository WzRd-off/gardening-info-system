from pydantic import BaseModel, ConfigDict
from typing import Optional

class TeamBase(BaseModel):
    name: str

class TeamCreate(TeamBase):
    email: str

class TeamRead(TeamBase):
    id: int
    model_config = ConfigDict(from_attributes=True)