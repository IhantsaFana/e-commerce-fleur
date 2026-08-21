from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.models.user import User
from app.models.cart import Cart
from app.models.product import Product
from app.models.cart_items import CartItem

from app.routes.cart import router as cart_router
from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.products import router as products_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # Origines de développement Vite (localhost et adresse de boucle IPv4).
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(products_router)
app.include_router(cart_router)
