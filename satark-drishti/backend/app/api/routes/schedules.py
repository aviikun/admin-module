"""
Inspection schedule API.

DEMO / IN-MEMORY DATA ONLY. `POST /schedule/generate` creates random demo
schedule entries — it is a data generator for testing, not a real
scheduling algorithm.
"""

from fastapi import APIRouter, Query

from app.schemas.schedule import ScheduleItem
from app.services import schedule_service

router = APIRouter(tags=["Schedule"])


@router.get("/schedule", response_model=list[ScheduleItem])
def list_schedule():
    """Return all demo inspection schedule entries."""
    return schedule_service.get_all_schedules()


@router.post("/schedule/generate", response_model=list[ScheduleItem])
def generate_schedule(
    count: int = Query(default=3, ge=1, le=20, description="How many demo entries to create"),
):
    """Generate `count` new random demo schedule entries and return them."""
    return schedule_service.generate_random_schedule(count)
