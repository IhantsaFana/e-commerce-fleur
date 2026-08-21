from decimal import Decimal
from datetime import datetime

from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    price: Decimal
    stock: int
    image: str | None = None

class ProductResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    price: Decimal
    stock: int
    image: str | None = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: Decimal | None = None
    stock: int | None = None
    image: str | None = None
    is_active: bool | None = None