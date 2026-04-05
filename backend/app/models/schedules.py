from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.utils.database import Base

class Schedules(Base):

    __tablename__ = "schedules" 
    
    id = Column(Integer, primary_key=True, index=True)
    scheduled_time = Column(DateTime, nullable=False) 
    order_id = Column(Integer, ForeignKey("orders.id"))
    team_id = Column(Integer, ForeignKey("teams.id"))
    
    team = relationship("Teams", back_populates="schedules")
    order = relationship("Orders", back_populates="schedules")