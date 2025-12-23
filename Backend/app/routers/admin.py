from fastapi import APIRouter, Depends, HTTPException
from app.database import db
from app.dependencies.rbac import require_roles
from bson import ObjectId
from app.dependencies.auth import get_current_user
from app.utils.csv_export import generate_csv_from_itinerary
router = APIRouter()


users = db["users"]
itineraries = db["itineraries"]

@router.get("/users")
def get_users(user=Depends(require_roles(["admin", "super_admin"]))):
    result = []
    for u in users.find({}, {"password": 0}):
        u["_id"] = str(u["_id"])   # ✅ FIX
        result.append(u)
    return result


@router.patch("/users/{user_id}/role")
def change_role(
    user_id: str,
    role: str,
    user=Depends(require_roles(["super_admin"]))
):
    users.update_one({"_id": user_id}, {"$set": {"role": role}})
    return {"message": "Role updated"}

@router.get("/itineraries")
def all_itineraries(user=Depends(require_roles(["admin","super_admin"]))):
    result = []
    for it in itineraries.find():
        it["_id"] = str(it["_id"])   # ✅ FIX
        result.append(it)
    return result   

@router.delete("/itineraries/{trip_id}")
def delete_itinerary(
    trip_id: str,
    _user=Depends(require_roles(["admin", "super_admin"]))
):
    res = itineraries.delete_one({"_id": ObjectId(trip_id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"message": "Itinerary deleted"}




@router.get("/analytics/summary")
def analytics_summary(_user=Depends(require_roles(["admin", "super_admin"]))):
    return {
        "total_users": db["users"].count_documents({}),
        "total_trips": itineraries.count_documents({}),
        "avg_budget": round(
            sum(it.get("budget", 0) for it in itineraries.find()) /
            max(1, itineraries.count_documents({})),
            2
        ),
        "top_destinations": list(
            itineraries.aggregate([
                {"$group": {"_id": "$destination", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 5}
            ])
        )
    }

import csv
from fastapi.responses import StreamingResponse
from io import StringIO

@router.get("/reports/itineraries")
def export_itineraries_csv(_user=Depends(require_roles(["super_admin"]))):
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Destination", "Budget", "Start", "End"])

    for it in itineraries.find():
        writer.writerow([
            it.get("destination"),
            it.get("budget"),
            it.get("start_date"),
            it.get("end_date"),
        ])

    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=itineraries.csv"}
    )
@router.get("/analytics/heatmap")
def heatmap_data(_user=Depends(require_roles(["admin", "super_admin"]))):
    points = []

    for it in itineraries.find():
        for day in it.get("days", []):
            for place in day.get("places", []):
                loc = place.get("location")
                if loc and "lat" in loc and "lng" in loc:
                    points.append([
                        loc["lat"],
                        loc["lng"],
                        1  # weight
                    ])

    return points

@router.get("/itineraries/{itinerary_id}/download")
def download_itinerary(
    itinerary_id: str,
    user=Depends(get_current_user)
):
    itinerary = itineraries.find_one({
        "_id": ObjectId(itinerary_id),
        "user_id": ObjectId(user["_id"])  # ✅ FIX
    })

    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    csv_data = generate_csv_from_itinerary(itinerary)

    return StreamingResponse(
        iter([csv_data]),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={itinerary['destination']}.csv"
        }
    )

@router.get("/admin/itineraries/{itinerary_id}/download")
def admin_download_itinerary(
    itinerary_id: str,
    _user=Depends(require_roles(["admin", "super_admin"]))
):
    itinerary = itineraries.find_one({
        "_id": ObjectId(itinerary_id)
    })

    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    csv_data = generate_csv_from_itinerary(itinerary)

    return StreamingResponse(
        iter([csv_data]),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={itinerary['destination']}.csv"
        }
    )
