from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_admin
from app.models.user import User
from app.models.payment import Payment
from app.schemas.admin import AdminStatsOut

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/stats", response_model=AdminStatsOut)
def get_stats(db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    total_users = db.query(User).count()

    success_payments = db.query(Payment).filter(Payment.status == "success").all()
    total_payments = len(success_payments)
    total_revenue = sum(p.amount for p in success_payments) / 100  # paise -> rupees

    recent_users = db.query(User).order_by(User.created_at.desc()).limit(5).all()
    recent_payments = db.query(Payment).order_by(Payment.created_at.desc()).limit(5).all()

    return {
        "total_users": total_users,
        "total_payments": total_payments,
        "total_revenue": total_revenue,
        "recent_users": recent_users,
        "recent_payments": recent_payments,
    }
