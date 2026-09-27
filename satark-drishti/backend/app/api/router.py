"""
Combines all feature routers into a single API router.
Mounted under the "/api" prefix in app/main.py.
"""

from fastapi import APIRouter

from app.api.routes import inspections, schedules, users

api_router = APIRouter()

api_router.include_router(users.router)
api_router.include_router(schedules.router)
api_router.include_router(inspections.router)
