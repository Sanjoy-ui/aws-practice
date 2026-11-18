from fastapi import APIRouter
from app.routes.item_routes import router as item_router
from app.routes.health_routes import router as health_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(item_router, prefix="/api")

__all__ = ["api_router", "item_router", "health_router"]

