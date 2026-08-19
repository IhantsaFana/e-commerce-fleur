from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.core.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    # Decodage du token
    payload = decode_access_token(token)
    if payload is None:
        print("[DEBUG DEPENDENCY] Échec : Le token n'a pas pu être décodé (None)")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Extraction du sub
    user_id = payload.get("sub")
    print(f"[DEBUG DEPENDENCY] ID extrait du token : {user_id} (Type: {type(user_id)})")
    
    if user_id is None:
        print("[DEBUG DEPENDENCY] Échec : Pas de champ 'sub' dans le payload")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide : identifiant manquant",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Requete Base de données
    try:
        search_id = int(user_id)
    except ValueError:
        search_id = user_id
        
    user = db.query(User).filter(User.id == search_id).first()
    print(f"[DEBUG DEPENDENCY] Résultat BDD pour l'ID {search_id} : {user}")

    # Blocage de sécurité
    if user is None:
        print(f"[DEBUG DEPENDENCY] Échec : L'ID {search_id} n'existe pas !")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utilisateur introuvable",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return user
