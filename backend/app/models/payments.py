from sqlalchemy import Column, Integer, ForeignKey, DateTime, Numeric, String
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.utils.database import Base

class Payments(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(String(20), default='pending')  # 'pending' или 'paid'
    order_id = Column(Integer, ForeignKey("orders.id"))
    team_id = Column(Integer, ForeignKey("teams.id"))

    order = relationship("Orders", back_populates="payments")
    team = relationship("Teams", back_populates="payments")