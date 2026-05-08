"""
Main entry point untuk aplikasi FastAPI.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import submissions_router, admin_router

# Buat FastAPI instance
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Sistem Anti-Phishing berbasis Risk Scoring dan NLP",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "http://phishing_frontend:5173",  # Docker internal
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(submissions_router)
app.include_router(admin_router)


@app.get("/")
async def root():
    """Root endpoint - health check."""
    return {
        "message": "Anti-Phishing Risk Scoring System",
        "status": "running",
        "version": "1.0.0",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )