from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import engine
from app.config import settings
from app.schemas.health import HealthResponse


class HealthService:
    @staticmethod
    def check_health(db: Session) -> HealthResponse:
        """Verify database connectivity and application status."""
        db_connected = False
        try:
            db.execute(text("SELECT 1"))
            db_connected = True
        except Exception:
            db_connected = False

        dialect = engine.url.get_backend_name()

        return HealthResponse(
            status="healthy" if db_connected else "degraded",
            app_name=settings.APP_NAME,
            environment=settings.ENVIRONMENT,
            database_connected=db_connected,
            database_type=dialect,
        )

