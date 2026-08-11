import razorpay
from app.config import settings

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

# Amounts are in paise (smallest currency unit). 100 paise = ₹1
PLANS = {
    "monthly": {"amount": 29900, "label": "Monthly Plan"},  # ₹299
    "yearly": {"amount": 249900, "label": "Yearly Plan"},   # ₹2499
}

def create_razorpay_order(plan: str):
    if plan not in PLANS:
        raise ValueError("Invalid plan")
    amount = PLANS[plan]["amount"]
    order = client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": 1,
    })
    return order

def verify_payment_signature(order_id: str, payment_id: str, signature: str) -> bool:
    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": signature,
        })
        return True
    except razorpay.errors.SignatureVerificationError:
        return False
