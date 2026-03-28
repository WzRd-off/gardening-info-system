from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base
class Teams(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    
    orders = relationship("Order", back_populates="team")
    schedules = relationship("Schedule", back_populates="team")

