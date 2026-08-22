from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    DateTime,
    Date,
    Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    status = Column(
        String(20),
        nullable=False,
        default="pending"
    )

    total = Column(
        Numeric(10, 2),
        nullable=False
    )

    # Informations de livraison.
    delivery_address = Column(
        String(255),
        nullable=True
    )

    city = Column(
        String(100),
        nullable=True
    )

    postal_code = Column(
        String(30),
        nullable=True
    )

    country = Column(
        String(100),
        nullable=True
    )

    delivery_date = Column(
        Date,
        nullable=True
    )

    note = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship(
        "User",
        back_populates="orders"
    )

    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan"
    )

    payment = relationship(
        "Payment",
        back_populates="order",
        uselist=False,
        cascade="all, delete-orphan"
    )