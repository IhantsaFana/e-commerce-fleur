from fastapi import FastAPI

from app.database import Base, engine
from app.models.user import User
from app.routes.auth import router as auth_router
from app.routes.users import router as users_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router)
app.include_router(users_router)