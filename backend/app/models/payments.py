from sqlalchemy import Column, Integer, ForeignKey, DateTime, Numeric
from backend.app.utils.database import Base
from datetime import datetime, timezone

class Payments(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    order_id = Column(Integer, ForeignKey("orders.id"))