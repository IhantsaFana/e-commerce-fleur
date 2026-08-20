cd dossier_du_backend

python -m venv .venv

.venv\Scripts\activate

pip install -r requirements.txt


uvicorn app.main:app --reload --port 8000


##Dans env
DB_USER=postgres
DB_PASSWORD=ton_mot_de_pass
DB_HOST=localhost
DB_PORT=5432
DB_NAME=floraqueen

SECRET_KEY=une_cle_secrete_longue_et_aleatoire_123456
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30