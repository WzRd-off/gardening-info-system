from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.utils.database import Base

class OrderStatus(Base):
    __tablename__ = "order_statuses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False) # Створено, в роботі, виконано
