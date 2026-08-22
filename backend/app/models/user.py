from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # Les noms et prénoms ne sont pas uniques :
    # plusieurs personnes peuvent s'appeler Rakoto Hery.
    lastname = Column(
        String,
        index=True,
        nullable=False
    )

    firstname = Column(
        String,
        index=True,
        nullable=False
    )

    # L'e-mail doit être unique.
    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    hashed_password = Column(
        String,
        nullable=False
    )

    # Votre migration Alembic rend le téléphone unique.
    telephone = Column(
        String(20),
        unique=True,
        index=True,
        nullable=True
    )

    role = Column(
        String(20),
        nullable=False,
        default="Client"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now()
    )

    # Un utilisateur possède un panier.
    cart = relationship(
        "Cart",
        back_populates="user",
        uselist=False
    )

    # Un utilisateur peut avoir plusieurs commandes.
    orders = relationship(
        "Order",
        back_populates="user"
    )