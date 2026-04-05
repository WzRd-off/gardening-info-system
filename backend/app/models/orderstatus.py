from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.utils.database import Base

class OrderStatus(Base):
    __tablename__ = "order_statuses"
    
    id = Column(Integer, primary_key=True, index=True) # 1, 2, 3, 4, 5
    name = Column(String, unique=True, nullable=False) # отримано, в дорозі, в роботі, виконано, проблема виконання

    orders = relationship("Orders", back_populates="status")