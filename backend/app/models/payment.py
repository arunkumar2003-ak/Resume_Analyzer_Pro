from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_id = Column(String(100), nullable=False)
    payment_id = Column(String(100), nullable=True)
    amount = Column(Integer, nullable=False)  # stored in paise
    status = Column(String(20), default="created")  # created, success, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
