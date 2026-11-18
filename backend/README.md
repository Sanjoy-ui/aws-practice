# FastAPI CRUD Backend (MVC Architecture)

A modular, production-ready FastAPI backend structured in an **MVC / Layered Architecture** with full CRUD APIs and database integration using SQLAlchemy.

---

## 🏗️ Architecture Overview

The backend follows clear separation of concerns:

```
Request ──> [ Routes ] ──> [ Controllers ] ──> [ Services ] ──> [ Models & DB ]
                 │                │                  │
                 ▼                ▼                  ▼
             HTTP Paths     HTTP Status &       Business &
             & Docs Tags    Error Handling      Data Logic
```

- **Routes (`app/routes/`)**: Defines HTTP verbs, paths, OpenAPI documentation, and request dependencies.
- **Controllers (`app/controllers/`)**: Handles request orchestration, HTTP status codes, and error formatting (`HTTPException`).
- **Services (`app/services/`)**: Encapsulates business logic, database queries, and data manipulation.
- **Models (`app/models/`)**: SQLAlchemy ORM entities representing database tables.
- **Schemas (`app/schemas/`)**: Pydantic models (DTOs) for request validation and response serialization.

---

## 🚀 Quick Start

### 1. Activate the Virtual Environment

From the `backend` directory:
```bash
# macOS / Linux
source venv/bin/activate

# Windows (Command Prompt)
venv\Scripts\activate.bat

# Windows (PowerShell)
venv\Scripts\Activate.ps1
```

### 2. Start the Server

```bash
python run.py
```
Or directly with `uvicorn`:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server will run at `http://localhost:8000`.

---

## 🗄️ Database Setup & Configuration

The application reads the database URL from `.env`. By default, it uses SQLite (`sqlite:///./sql_app.db`) so it works immediately with zero configuration.

### Switching to your remote or production database:
When you have your database URL ready (PostgreSQL, Supabase, Neon, MySQL, RDS, etc.):
1. Open `.env` (inside `backend/`).
2. Update the `DATABASE_URL` variable:
   ```env
   # PostgreSQL (Local, Supabase, Neon, AWS RDS, Render, etc.)
   DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database_name>

   # MySQL
   DATABASE_URL=mysql+pymysql://<username>:<password>@<host>:<port>/<database_name>
   ```
3. Restart the server. Tables are created automatically on startup.

> **Note:** `psycopg2-binary` is pre-installed in the virtual environment for instant PostgreSQL compatibility.

---

## 📖 Interactive API Docs

Once running, access:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🛠️ CRUD API Endpoints

| Method | Endpoint | Layer Flow | Description |
|---|---|---|---|
| `GET` | `/` | Main Root | API status and root links |
| `GET` | `/health` | Route ➔ Controller ➔ Service | Health check & database connection test |
| `POST` | `/api/items/` | Route ➔ Controller ➔ Service | **Create** a new item |
| `GET` | `/api/items/` | Route ➔ Controller ➔ Service | **Read** all items (`skip`, `limit`, `search`, `completed`) |
| `GET` | `/api/items/{id}` | Route ➔ Controller ➔ Service | **Read** a single item by ID |
| `PUT` | `/api/items/{id}` | Route ➔ Controller ➔ Service | **Update** full item |
| `PATCH` | `/api/items/{id}` | Route ➔ Controller ➔ Service | **Update** item fields partially |
| `DELETE` | `/api/items/{id}` | Route ➔ Controller ➔ Service | **Delete** an item |

---

## 🧪 Running Tests

To run the automated test suite:
```bash
./venv/bin/pytest
```

---

## 📁 Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py                 # Pydantic Settings & environment config
│   ├── database.py               # SQLAlchemy engine, session, Base, init_db
│   ├── models/                   # Database ORM models
│   │   ├── __init__.py
│   │   └── item.py
│   ├── schemas/                  # Pydantic validation & response DTOs
│   │   ├── __init__.py
│   │   ├── item.py
│   │   └── health.py
│   ├── services/                 # Business logic & database operations
│   │   ├── __init__.py
│   │   ├── item_service.py
│   │   └── health_service.py
│   ├── controllers/              # Request handling & HTTP status/exceptions
│   │   ├── __init__.py
│   │   ├── item_controller.py
│   │   └── health_controller.py
│   ├── routes/                   # API endpoint definitions
│   │   ├── __init__.py
│   │   ├── item_routes.py
│   │   └── health_routes.py
│   └── main.py                   # FastAPI application & middleware
├── tests/
│   └── test_crud.py              # Automated test suite (11 unit/integration tests)
├── .env                          # Environment variables (set DATABASE_URL here)
├── .env.example
├── .gitignore
├── requirements.txt              # Project dependencies
├── run.py                        # Server runner script
└── README.md
```
