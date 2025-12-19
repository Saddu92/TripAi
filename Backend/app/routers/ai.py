from fastapi import APIRouter
from datetime import datetime
from app.schemas.itinerary_schema import CreateItineraryRequest
from app.services.ai_planner import generate_places
from app.services.geocoding import geocode_place  # ✅ only import

router = APIRouter()

MAX_GEOCODE_PLACES = 8

@router.post("/generate")
def generate_itinerary(req: CreateItineraryRequest):

    start = datetime.fromisoformat(req.start_date)
    end = datetime.fromisoformat(req.end_date)
    total_days = (end - start).days + 1

    days = generate_places(
        destination=req.destination,
        preferences=req.preferences,
        days=total_days
    )

    count = 0
    for day in days:
        for place in day.get("places", []):

            if count >= MAX_GEOCODE_PLACES:
                place["location"] = None
                continue

            map_entity = place.get("map_entity")
            if not map_entity:
                place["location"] = None
                continue

            coords = geocode_place(map_entity, req.destination)
            place["location"] = coords
            count += 1

    return {
        "destination": req.destination,
        "start_date": req.start_date,
        "end_date": req.end_date,
        "days": days
    }
