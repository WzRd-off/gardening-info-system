from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.utils.database import Base

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False) 
    email = Column(String, unique=True, index=True, nullable=False) 
    password_hash = Column(String, nullable=False)
    phone = Column(String)
    role_id = Column(Integer, ForeignKey("roles.id"))
    team_id = Column(Integer, ForeignKey("teams.id", use_alter=True, name="fk_users_teams"), nullable=True)

    team = relationship("Teams", back_populates="members", foreign_keys=[team_id])  
    role = relationship("Roles", back_populates="users")
    plots = relationship("GardenPlots", back_populates="owner")
    orders = relationship("Orders", back_populates="client")