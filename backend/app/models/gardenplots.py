from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.utils.database import Base

class GardenPlots(Base):
    __tablename__ = "garden_plots"
    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, nullable=False) 
    area = Column(Float, nullable=False)
    features = Column(Text) 
    user_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="plots")
    plants = relationship("Plant", back_populates="plot")
    orders = relationship("Order", back_populates="plot")
