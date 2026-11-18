from sqlalchemy.orm import Session
from app.services.health_service import HealthService
from app.schemas.health import HealthResponse


class HealthController:
    @staticmethod
    def get_health(db: Session) -> HealthResponse:
        """Controller to get system and database health status."""
        return HealthService.check_health(db=db)

