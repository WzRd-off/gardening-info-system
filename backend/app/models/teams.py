from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.utils.database import Base
class Teams(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    
    orders = relationship("Orders", back_populates="team")
    schedules = relationship("Schedules", back_populates="team")

