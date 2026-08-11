from pydantic import BaseModel
from typing import Literal

class CreateOrderRequest(BaseModel):
    plan: Literal["monthly", "yearly"]

class OrderOut(BaseModel):
    order_id: str
    amount: int
    currency: str
    key_id: str

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class PaymentStatusOut(BaseModel):
    status: str
    plan: str
