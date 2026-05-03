"""
Inisialisasi package api.
"""
from app.api.submissions import router as submissions_router
from app.api.admin import router as admin_router

__all__ = ["submissions_router", "admin_router"]
