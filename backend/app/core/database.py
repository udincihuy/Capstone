"""
Konfigurasi database (async SQLAlchemy engine dan session).
"""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Base class untuk semua model
Base = declarative_base()

# Buat async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True,
)

# Session factory
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db():
    """
    Dependency injection untuk mendapatkan database session.
    Gunakan di FastAPI endpoint dengan Depends(get_db).
    """
    async with AsyncSessionLocal() as session:
        yield session
