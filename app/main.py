from fastapi import FastAPI

from app.database import Base, engine
from app.models.user import User
from app.models.product import Product
from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.products import router as products_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(products_router)