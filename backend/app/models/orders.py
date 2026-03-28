from sqlalchemy import Column, Integer, String, ForeignKey, Text, Date, Numeric
from sqlalchemy.orm import relationship
from backend.app.utils.database import Base

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
    
    client = relationship("User", back_populates="orders")
    plot = relationship("GardenPlot", back_populates="orders")
    service = relationship("Service", back_populates="orders")
    team = relationship("Team", back_populates="orders")