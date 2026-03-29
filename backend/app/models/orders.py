from sqlalchemy import Column, Integer, String, ForeignKey, Text, Date, Numeric
from sqlalchemy.orm import relationship
from app.utils.database import Base

class Orders(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    execution_date = Column(Date, nullable=False)
    regularity = Column(String) # разово, щотижня, щомісяця
    comment = Column(Text)
    total_price = Column(Numeric(10, 2)) 
    
    user_id = Column(Integer, ForeignKey("users.id"))
    plot_id = Column(Integer, ForeignKey("garden_plots.id"))
    service_id = Column(Integer, ForeignKey("services.id"))
    status_id = Column(Integer, ForeignKey("order_statuses.id"))
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    
    client = relationship("Users", back_populates="orders")
    plot = relationship("GardenPlots", back_populates="orders")
    service = relationship("Services", back_populates="orders")
    team = relationship("Teams", back_populates="orders")