from app.services.place_aliases import PLACE_ALIASES
from app.services.photon import photon_search
from app.services.overpass import overpass_search

CITY_CENTERS = {
    "Ooty": {"lat": 11.4064, "lng": 76.6932},
    "Mumbai": {"lat": 19.0760, "lng": 72.8777},
}

def resolve_alias(name: str) -> str:
    for k, v in PLACE_ALIASES.items():
        if k.lower() in name.lower():
            return v
    return name

def geocode_place(place_name: str, city: str):
    resolved = resolve_alias(place_name)

    # 1️⃣ Photon
    coords = photon_search(f"{resolved} {city}")
    if coords:
        return coords

    # 2️⃣ Overpass
    coords = overpass_search(resolved, city)
    if coords:
        return coords

    # 3️⃣ City center fallback
    return CITY_CENTERS.get(city)
