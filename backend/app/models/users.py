from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.utils.database import Base

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False) 
    email = Column(String, unique=True, index=True, nullable=False) 
    password_hash = Column(String, nullable=False)
    phone = Column(String)
    role_id = Column(Integer, ForeignKey("roles.id"))
    
    role = relationship("Role", back_populates="users")
    plots = relationship("GardenPlot", back_populates="owner")
    orders = relationship("Order", back_populates="client")