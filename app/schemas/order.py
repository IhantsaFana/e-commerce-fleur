from decimal import Decimal
from datetime import datetime

from pydantic import BaseModel


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: Decimal
    subtotal: Decimal

    model_config = {
        "from_attributes": True
    }


class OrderResponse(BaseModel):
    id: int
    status: str
    total: Decimal
    created_at: datetime
    items: list[OrderItemResponse]

class OrderListResponse(BaseModel):
    id: int
    status: str
    total: Decimal
    created_at: datetime

class OrderDetailResponse(BaseModel):
    id: int
    status: str
    total: Decimal
    created_at: datetime
    items: list[OrderItemResponse]

    model_config = {
        "from_attributes": True
    }

class OrderStatusUpdate(BaseModel):
    status: str