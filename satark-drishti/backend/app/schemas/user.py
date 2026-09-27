"""
Pydantic schemas for users (inspectors).

These describe the shape of user data returned by the API. Storage is
in-memory for now (see app/services/user_service.py) and can be swapped
for a real database later without changing this contract.
"""

from pydantic import BaseModel


class User(BaseModel):
    id: int
    name: str
    designation: str
    region: str
