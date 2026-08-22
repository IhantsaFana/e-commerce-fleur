from decimal import Decimal
from datetime import datetime, date

from pydantic import BaseModel, Field


class OrderCreate(BaseModel):
    delivery_address: str = Field(
        min_length=2,
        max_length=255
    )

    city: str = Field(
        min_length=2,
        max_length=100
    )

    postal_code: str = Field(
        min_length=1,
        max_length=30
    )

    country: str = Field(
        min_length=2,
        max_length=100
    )

    delivery_date: date | None = None

    note: str | None = Field(
        default=None,
        max_length=2000
    )


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

    delivery_address: str | None = None
    city: str | None = None
    postal_code: str | None = None
    country: str | None = None
    delivery_date: date | None = None
    note: str | None = None

    created_at: datetime
    items: list[OrderItemResponse]

    model_config = {
        "from_attributes": True
    }


class OrderListResponse(BaseModel):
    id: int
    status: str
    total: Decimal

    delivery_address: str | None = None
    city: str | None = None
    country: str | None = None
    delivery_date: date | None = None

    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class OrderDetailResponse(BaseModel):
    id: int
    status: str
    total: Decimal

    delivery_address: str | None = None
    city: str | None = None
    postal_code: str | None = None
    country: str | None = None
    delivery_date: date | None = None
    note: str | None = None

    created_at: datetime
    items: list[OrderItemResponse]

    model_config = {
        "from_attributes": True
    }


class OrderStatusUpdate(BaseModel):
    status: str