from pydantic import BaseModel
from typing import List, Optional, Dict


class CreateItineraryRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    preferences: List[str]


class Place(BaseModel):
    display_name: str
    map_entity: str
    entity_type: str
    category: str
    best_time: str
    activities: List[str]
    location: Optional[Dict[str, float]] = None


class DayPlan(BaseModel):
    day: int
    places: List[Place]
