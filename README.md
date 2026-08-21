E-commerce vente des fleurs

## Structure du projet

- `backend/` : API FastAPI, modèles SQLAlchemy, authentification et routes.
- `frontend/` : application React/Vite.
- `postman_collection.json` et `postman_environment.json` : tests de l'API.

### Lancer le backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Lancer le frontend

```bash
cd frontend
npm install
npm run dev
```
