from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.utils.database import Base
from app.models.users import Users
class Teams(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    efficiency_rating = Column(Float, default=0.0)
    leader_id = Column(Integer, ForeignKey("users.id", use_alter=True, name="fk_teams_users"), nullable=True)
    
    leader = relationship("Users", foreign_keys=[leader_id])
    members = relationship("Users", back_populates="team", foreign_keys=[Users.team_id])
    orders = relationship("Orders", back_populates="team")
    schedules = relationship("Schedules", back_populates="team")

