from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.utils.database import Base

class GardenPlots(Base):
    __tablename__ = "garden_plots"
    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, nullable=False) 
    area = Column(Float, nullable=False)
    features = Column(Text) 
    user_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("Users", back_populates="plots")
    plants = relationship("Plants", back_populates="plot")
    orders = relationship("Orders", back_populates="plot")
