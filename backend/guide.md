cd backend

Créer le fichier .env
Copy-Item .env.example .env

Puis ajouter ça dans env
DB_USER=postgres
DB_PASSWORD=votre password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=floraqueen
SECRET_KEY=voninkazo_na_jwt_secret_key_2026_change_this_987654321
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30


py -m venv venv

.\venv\Scripts\Activate.ps1

python -m pip install --upgrade pip
pip install -r requirements.txt
pip install reportlab
python -m compileall app
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
http://localhost:8000/docs
