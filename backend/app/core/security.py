import os
import jwt
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

def create_access_token(user_id: int, role: str):
    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    playload = {
        "sub": str(user_id),
        "role": role,
        "exp": expire
    }

    return jwt.encode(playload, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        playload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return playload
    except jwt.ExpiredSignatureError:
        print("[DEBUG] Le token a expiré !")
        return None
    except jwt.InvalidTokenError:
        print("[DEBUG] Le token est invalide !")
        return None