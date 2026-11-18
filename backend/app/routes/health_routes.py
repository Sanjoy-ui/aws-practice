from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.health_controller import HealthController
from app.schemas.health import HealthResponse

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    description="Check API status and database connectivity.",
)
def health_check(db: Session = Depends(get_db)):
    return HealthController.get_health(db=db)

