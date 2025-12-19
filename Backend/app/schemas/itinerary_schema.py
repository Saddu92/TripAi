from pydantic import BaseModel
from typing import List, Optional, Dict


class CreateItineraryRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    preferences: List[str]
    budget: Optional[float] = None


class Place(BaseModel):
    display_name: str
    map_entity: str
    entity_type: str
    category: str
    best_time: str
    activities: List[str]
    location: Optional[Dict[str, float]] = None
    estimated_cost: Optional[float] = None
    allocated_cost: Optional[float] = None


class DayPlan(BaseModel):
    day: int
    places: List[Place]
