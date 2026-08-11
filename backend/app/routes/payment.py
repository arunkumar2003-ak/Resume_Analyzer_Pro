from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.payment import CreateOrderRequest, OrderOut, VerifyPaymentRequest, PaymentStatusOut
from app.services import payment_service
from app.models.payment import Payment
from app.config import settings

router = APIRouter(prefix="/payment", tags=["Payment"])

@router.post("/create-order", response_model=OrderOut)
def create_order(
    payload: CreateOrderRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    order = payment_service.create_razorpay_order(payload.plan)

    payment = Payment(
        user_id=current_user.id,
        order_id=order["id"],
        amount=order["amount"],
        status="created",
    )
    db.add(payment)
    db.commit()

    return {
        "order_id": order["id"],
        "amount": order["amount"],
        "currency": order["currency"],
        "key_id": settings.RAZORPAY_KEY_ID,
    }

@router.post("/verify", response_model=PaymentStatusOut)
def verify_payment(
    payload: VerifyPaymentRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    is_valid = payment_service.verify_payment_signature(
        payload.razorpay_order_id, payload.razorpay_payment_id, payload.razorpay_signature
    )

    payment = (
        db.query(Payment)
        .filter(Payment.order_id == payload.razorpay_order_id, Payment.user_id == current_user.id)
        .first()
    )
    if not payment:
        raise HTTPException(status_code=404, detail="Order not found")

    if not is_valid:
        payment.status = "failed"
        db.commit()
        raise HTTPException(status_code=400, detail="Payment verification failed")

    payment.payment_id = payload.razorpay_payment_id
    payment.status = "success"
    current_user.plan = "premium"
    db.commit()

    return {"status": "success", "plan": current_user.plan}
