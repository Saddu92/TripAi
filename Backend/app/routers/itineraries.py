from fastapi import APIRouter
from app.database import get_database
from app.schemas.itinerary_schema import CreateItineraryRequest
from bson import ObjectId
from fastapi import HTTPException
from app.dependencies.auth import get_current_user
from fastapi import Depends


router = APIRouter()
db = get_database()
collection = db["itineraries"]

def serialize_doc(doc):
    return {
        "_id": str(doc["_id"]),
        "destination": doc.get("destination"),
        "budget": doc.get("budget"),
        "days": doc.get("days"),
        "start_date": doc.get("start_date"),
        "end_date": doc.get("end_date"),
        "preferences": doc.get("preferences"),
    }

@router.get("/")
def get_user_itineraries(user=Depends(get_current_user)):
    trips = list(collection.find({"user_id": user["user_id"]}))
    for trip in trips:
        trip["_id"] = str(trip["_id"])
    return trips


@router.post("/")
def create_itinerary(req: CreateItineraryRequest):
    data = req.dict()
    result = collection.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return {"message": "Itinerary saved successfully", "data": data}


@router.post("/save")
def save_generated_itinerary(
    itinerary: dict,
    user=Depends(get_current_user)
):
    itinerary["user_id"] = user["user_id"]
    collection.insert_one(itinerary)
    return {"message": "Itinerary saved in the DataBase"}


@router.get("/{trip_id}")
def get_itinerary_by_id(trip_id:str):
    collection= db["itineraries"]
    item=collection.find_one({"_id":ObjectId(trip_id)})

    if not item:
        return {"error":"Not Found"}
    
    item["_id"]=str(item["_id"])
    return item

@router.delete("/{trip_id}")
def delete_itinerary(trip_id: str):
    collection = db["itineraries"]

    result = collection.delete_one({"_id": ObjectId(trip_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    return {"message": "Itinerary deleted successfully"}