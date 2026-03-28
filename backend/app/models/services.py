from sqlalchemy import Column, Integer, String, Text, Numeric
from sqlalchemy.orm import relationship
from app.database import Base

class Services(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text) 
    price = Column(Numeric(10, 2))
    image_url = Column(String)
    
    orders = relationship("Order", back_populates="service")