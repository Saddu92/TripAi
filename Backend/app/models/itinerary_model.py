from datetime import datetime
from typing import List, Dict
from pydantic import BaseModel


class Activity(BaseModel):
    time:str
    place_name:str
    notes:str|None=None
    estimated_cost:float |None=None


class DayPlan(BaseModel):
    day:int
    date:str
    activities:List[Activity]
    

class Itinerary(BaseModel):
    user_id:str |None=None
    destination:str
    budget:float
    start_date:str
    end_date:str
    preferences:List[str]
    days:List[DayPlan]|None=None
    created_at: datetime = datetime.utcnow()