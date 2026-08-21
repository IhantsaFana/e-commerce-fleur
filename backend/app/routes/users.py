from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    if current_user is None:
        print("\n[CRITICAL ERROR] La dépendance get_current_user a renvoyé None à la route /me !")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur interne : l'authentification a renvoyé un utilisateur vide."
        )
    
    print(f"\n[SUCCESS ROUTE] Utilisateur reçu avec succès : ID={current_user.id}, Email={current_user.email}")
    
    return current_user
