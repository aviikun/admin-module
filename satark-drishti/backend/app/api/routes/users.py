"""
Users API.

DEMO / IN-MEMORY DATA ONLY. This is not an authentication system — it only
exposes basic inspector/user records so the API shape exists for later
database integration.
"""

from fastapi import APIRouter, HTTPException

from app.schemas.user import User
from app.services import user_service

router = APIRouter(tags=["Users"])


@router.get("/users", response_model=list[User])
def list_users():
    """Return all demo users (inspectors)."""
    return user_service.get_all_users()


@router.get("/users/{user_id}", response_model=User)
def get_user(user_id: int):
    """Return a single demo user by id, or 404 if not found."""
    user = user_service.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
