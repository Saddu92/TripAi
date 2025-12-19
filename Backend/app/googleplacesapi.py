import requests
import os

GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

def get_place_coordinates(place_name: str):
    """
    Converts a place name into latitude & longitude using Google Places API
    """

    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"

    params = {
        "query": place_name,
        "key": GOOGLE_API_KEY
    }

    response = requests.get(url, params=params)
    data = response.json()

    if data.get("status") != "OK":
        return None

    location = data["results"][0]["geometry"]["location"]

    return {
        "lat": location["lat"],
        "lng": location["lng"]
    }
