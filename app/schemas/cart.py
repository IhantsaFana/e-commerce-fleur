from decimal import Decimal
from pydantic import BaseModel


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: Decimal
    subtotal: Decimal


class CartResponse(BaseModel):
    id: int
    items: list[CartItemResponse]
    total: Decimal

class CartItemUpdate(BaseModel):
    quantity: int