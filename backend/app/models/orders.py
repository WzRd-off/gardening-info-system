from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from app.utils.database import Base
from datetime import datetime

class Orders(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    status_id = Column(Integer, ForeignKey("order_statuses.id"))
    plot_id = Column(Integer, ForeignKey("garden_plots.id"))
    service_id = Column(Integer, ForeignKey("services.id"))
    
    comment = Column(String, nullable=True) 
    manager_instructions = Column(Text, nullable=True) 
    
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("Users", back_populates="orders")
    team = relationship("Teams", back_populates="orders")
    status = relationship("OrderStatus", back_populates="orders")
    plot = relationship("GardenPlots", back_populates="orders")
    service = relationship("Services", back_populates="orders")
    payments = relationship("Payments", back_populates="order")
    schedules = relationship("Schedules", back_populates="order")