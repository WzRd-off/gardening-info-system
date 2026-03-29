from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.utils.database import Base

class Plants(Base):
    __tablename__ = "plants"
    id = Column(Integer, primary_key=True, index=True)
    plant_type = Column(String, nullable=False)
    description = Column(Text)
    plot_id = Column(Integer, ForeignKey("garden_plots.id"))
    
    plot = relationship("GardenPlots", back_populates="plants")