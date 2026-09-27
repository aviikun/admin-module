"""
Pydantic schemas for inspection records.

An inspection record represents a visit that has been (or is being)
carried out. `InspectionCreate` is what the API accepts when a new record
is submitted; `Inspection` is what the API returns, with a server-assigned
id. Storage is in-memory for now (see app/services/inspection_service.py)
and is designed so PostgreSQL/PostGIS can replace it later without
changing this contract.
"""

from typing import Optional

from pydantic import BaseModel


class InspectionBase(BaseModel):
    organization: str
    location: str
    date: str  # YYYY-MM-DD
    time: str  # e.g. "10:30 AM"
    inspector: str
    status: str = "Submitted"  # e.g. "Submitted", "Verified"
    notes: Optional[str] = None


class InspectionCreate(InspectionBase):
    """Fields required to create a new inspection record."""


class Inspection(InspectionBase):
    """An inspection record as returned by the API, with its id."""

    id: str
