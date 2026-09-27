"""
User (inspector) service.

DEMO / IN-MEMORY DATA ONLY.
This is not a real user list and is not connected to any authentication
system. It exists so the API structure is ready for Member 4's database
to be plugged in later.
"""

from typing import List, Optional

from app.schemas.user import User

# Demo/in-memory "table". Replace with a real database query later.
_USERS: List[User] = [
    User(id=1, name="Ramesh Kadam", designation="Field Inspector", region="Pune Division"),
    User(id=2, name="Sunita Patil", designation="Field Inspector", region="Nashik Division"),
    User(id=3, name="Arjun Deshmukh", designation="Senior Inspector", region="Pune Division"),
]


def get_all_users() -> List[User]:
    return _USERS


def get_user_by_id(user_id: int) -> Optional[User]:
    for user in _USERS:
        if user.id == user_id:
            return user
    return None
