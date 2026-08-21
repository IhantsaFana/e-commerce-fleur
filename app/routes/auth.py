from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token
from app.services.auth import hash_password, verify_password
from app.core.security import create_access_token

from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter( (User.email == user.email)).first() # Verifie s'il existe déjà un utilisateur avec le même email

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email ou username déjà utilisé"
        )

    hashed_password = hash_password(user.password)

    new_user = User(
        lastname=user.lastname,
        firstname=user.firstname,
        email=user.email,
        hashed_password=hashed_password,
        telephone=user.telephone,
        role="Client"  # Role par defaut client
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == form_data.username).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Email ou mot de passe incorrect"
        )

    if not verify_password(form_data.password, existing_user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Email ou mot de passe incorrect"
        )

    access_token = create_access_token(user_id=existing_user.id, role=existing_user.role)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }