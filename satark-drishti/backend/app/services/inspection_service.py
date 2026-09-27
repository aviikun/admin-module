"""
Inspection record service.

DEMO / IN-MEMORY DATA ONLY.
`_INSPECTIONS` acts as a stand-in table. It is written so that a real
database (PostgreSQL/PostGIS, added by Member 4) can replace the list
below without changing the function signatures used by the routes.
"""

import uuid
from typing import List, Optional

from app.schemas.inspection import Inspection, InspectionCreate

# Demo/in-memory "table". Replace with a real database query later.
_INSPECTIONS: List[Inspection] = [
    Inspection(
        id="REC-1001",
        organization="Nirmal Jeevan Foundation",
        location="Kondhwa, Pune",
        date="2026-09-18",
        time="10:00 AM",
        inspector="Ramesh Kadam",
        status="Verified",
        notes="Records and facilities found in order.",
    ),
]


def get_all_inspections() -> List[Inspection]:
    return _INSPECTIONS


def get_inspection_by_id(inspection_id: str) -> Optional[Inspection]:
    for record in _INSPECTIONS:
        if record.id == inspection_id:
            return record
    return None


def create_inspection(data: InspectionCreate) -> Inspection:
    record = Inspection(id=f"REC-{uuid.uuid4().hex[:6].upper()}", **data.model_dump())
    _INSPECTIONS.append(record)
    return record
