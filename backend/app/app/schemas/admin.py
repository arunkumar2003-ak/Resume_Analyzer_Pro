from pydantic import BaseModel
from datetime import datetime
from typing import List

class RecentUserOut(BaseModel):
    id: int
    name: str
    email: str
    plan: str
    created_at: datetime

    class Config:
        from_attributes = True

class RecentPaymentOut(BaseModel):
    id: int
    user_id: int
    amount: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class AdminStatsOut(BaseModel):
    total_users: int
    total_payments: int
    total_revenue: float
    recent_users: List[RecentUserOut]
    recent_payments: List[RecentPaymentOut]
