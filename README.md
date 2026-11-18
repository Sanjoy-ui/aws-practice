# Full-Stack Web Application (FastAPI MVC + React Vite)

A complete full-stack web application featuring an MVC FastAPI backend connected to PostgreSQL and a React + TypeScript frontend built with Vite.

---

## 🏗️ Architecture

```
webproject/
├── backend/                       # FastAPI Backend (MVC Architecture)
│   ├── app/
│   │   ├── routes/                # API endpoint definitions
│   │   ├── controllers/           # Request orchestration & HTTP handlers
│   │   ├── services/              # Business logic & database queries
│   │   ├── models/                # SQLAlchemy ORM models
│   │   ├── schemas/               # Pydantic validation schemas (DTOs)
│   │   ├── config.py              # Environment configuration & CORS parser
│   │   ├── database.py            # SQLAlchemy database engine & session
│   │   └── main.py                # App entrypoint & CORS middleware
│   ├── .env                       # Backend settings (DB URL & CORS Origins)
│   ├── requirements.txt
│   └── run.py
│
└── frontend/                      # React Frontend (Vite + TypeScript)
    ├── src/
    │   ├── components/            # UI components (Navbar, ItemForm, ItemList, Modal)
    │   ├── services/              # API Client (CRUD and Health)
    │   ├── types/                 # TypeScript interfaces
    │   ├── App.tsx
    │   └── index.css
    ├── .env                       # Frontend settings (VITE_API_BASE_URL)
    └── package.json
```

---

## 🌐 CORS Configuration via Environment Variables

CORS is explicitly configured between both tiers using `.env` files:

### 1. Backend ([`backend/.env`](backend/.env))
```env
# Allowed frontend origins (comma-separated or JSON list)
CORS_ORIGINS="http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
```
The backend parses this in `app/config.py` and feeds it to `CORSMiddleware` in `app/main.py`.

### 2. Frontend ([`frontend/.env`](frontend/.env))
```env
# URL where the FastAPI backend is running
VITE_API_BASE_URL=http://localhost:8000
```
The frontend API client (`src/services/api.ts`) automatically uses this URL for all requests.

---

## 🚀 Running the Project

### Terminal 1: Backend
```bash
cd backend
source venv/bin/activate
python run.py
```
* Backend runs on: `http://localhost:8000`
* Interactive API Docs: `http://localhost:8000/docs`
* Health Check: `http://localhost:8000/health`

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```
* Frontend runs on: `http://localhost:5173`

---

## 🧪 Testing

### Backend Unit & Integration Tests:
```bash
cd backend
./venv/bin/pytest
```

### Frontend Build Check:
```bash
cd frontend
npm run build
```

