from decimal import Decimal
from datetime import datetime

from pydantic import BaseModel


class PaymentCreate(BaseModel):
    payment_method: str


class PaymentResponse(BaseModel):
    id: int
    order_id: int
    amount: Decimal
    payment_method: str
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class PaymentResult(BaseModel):
    payment: PaymentResponse
    invoice: str