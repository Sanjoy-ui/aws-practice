from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.config import settings
from app.database import init_db
from app.routes import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables are created in the database
    init_db()
    yield
    # Shutdown logic (if any) can go here


app = FastAPI(
    title=settings.APP_NAME,
    description="FastAPI CRUD Backend organized in an MVC / Layered architecture (Routes, Controllers, Services, Models).",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Centralized API routes (No CORS needed: same-origin routing via CloudFront / reverse proxy)
app.include_router(api_router)


@app.get("/", summary="Root", tags=["Root"])
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "architecture": "MVC (Routes -> Controllers -> Services -> Models)",
        "docs": "/docs",
        "health": "/health",
        "api_items": "/api/items",
    }
