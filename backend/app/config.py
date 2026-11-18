from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "FastAPI CRUD Backend"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Default to SQLite for immediate usability
    # When using PostgreSQL/MySQL/RDS, update in .env
    DATABASE_URL: str = "sqlite:///./sql_app.db"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def normalized_database_url(self) -> str:
        """Fix postgres:// to postgresql:// for SQLAlchemy 1.4+ / 2.0+ compatibility."""
        url = self.DATABASE_URL.strip()
        if url.startswith("postgres://"):
            return url.replace("postgres://", "postgresql://", 1)
        return url


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
