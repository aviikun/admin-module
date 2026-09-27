"""
Inspection schedule service.

DEMO / IN-MEMORY DATA ONLY.
`_SCHEDULE` acts as a stand-in table. `generate_random_schedule` creates
demo schedule entries so the Inspector Portal has something to display
before Member 4's database is connected.
"""

import random
import uuid
from datetime import date, timedelta
from typing import List

from app.schemas.schedule import ScheduleItem

_DEMO_ORGANIZATIONS = [
    ("Asha Bal Vikas Sanstha", "Kothrud, Pune"),
    ("Sanjeevani Old Age Support Trust", "Hadapsar, Pune"),
    ("Prerna Mahila Sangh", "Shivaji Nagar, Pune"),
    ("Gramin Shiksha Kendra", "Wagholi, Pune"),
    ("Nirmal Jeevan Foundation", "Kondhwa, Pune"),
    ("Disha Punarvasan Kendra", "Aundh, Pune"),
]

_DEMO_INSPECTORS = ["Ramesh Kadam", "Sunita Patil", "Arjun Deshmukh"]

_DEMO_TIMES = ["09:30 AM", "10:30 AM", "11:00 AM", "02:00 PM", "03:30 PM"]

_DEMO_STATUSES = ["Scheduled", "In Progress", "Completed", "Missed"]

# Demo/in-memory "table". Replace with a real database query later.
_SCHEDULE: List[ScheduleItem] = [
    ScheduleItem(
        id="SCH-1001",
        organization="Asha Bal Vikas Sanstha",
        location="Kothrud, Pune",
        date="2026-09-29",
        time="10:30 AM",
        inspector="Ramesh Kadam",
        status="Scheduled",
    ),
    ScheduleItem(
        id="SCH-1002",
        organization="Sanjeevani Old Age Support Trust",
        location="Hadapsar, Pune",
        date="2026-09-29",
        time="02:00 PM",
        inspector="Ramesh Kadam",
        status="Scheduled",
    ),
]


def get_all_schedules() -> List[ScheduleItem]:
    return _SCHEDULE


def generate_random_schedule(count: int = 3) -> List[ScheduleItem]:
    """
    Create `count` new demo schedule entries with random organisation,
    date, time, inspector and status, append them to the in-memory
    schedule, and return only the newly created entries.

    This is a demo data generator, not a real scheduling algorithm.
    """
    new_items: List[ScheduleItem] = []

    for _ in range(count):
        organization, location = random.choice(_DEMO_ORGANIZATIONS)
        random_offset_days = random.randint(0, 14)
        scheduled_date = date.today() + timedelta(days=random_offset_days)

        item = ScheduleItem(
            id=f"SCH-{uuid.uuid4().hex[:6].upper()}",
            organization=organization,
            location=location,
            date=scheduled_date.isoformat(),
            time=random.choice(_DEMO_TIMES),
            inspector=random.choice(_DEMO_INSPECTORS),
            status=random.choice(_DEMO_STATUSES),
        )
        _SCHEDULE.append(item)
        new_items.append(item)

    return new_items
