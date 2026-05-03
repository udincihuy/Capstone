"""
Konfigurasi aplikasi (settings, environment variables).
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Konfigurasi aplikasi menggunakan Pydantic Settings.
    Baca dari environment variables atau file .env
    """
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:123@localhost:5432/phishing_db"
    
    # App settings
    APP_NAME: str = "Anti-Phishing Risk Scoring System"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
