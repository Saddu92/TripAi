import re
import requests
import difflib
from typing import Optional

from app.services.place_aliases import PLACE_ALIASES
from app.services.photon import photon_search
from app.services.overpass import overpass_search

# Small mapping used as a last-resort fallback for some cities.
CITY_CENTERS = {
    "Ooty": {"lat": 11.4064, "lng": 76.6932},
    "Mumbai": {"lat": 19.0760, "lng": 72.8777},
}


def normalize(s: str) -> str:
    return re.sub(r"[^a-z0-9 ]+", "", s.lower())


def resolve_alias(name: str) -> str:
    for k, v in PLACE_ALIASES.items():
        if k.lower() in name.lower() or name.lower() in k.lower():
            return v
    return name


def nominatim_search(query: str) -> Optional[dict]:
    """Search OSM Nominatim for a query and return lat/lng if found."""
    try:
        res = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={"q": query, "format": "json", "limit": 3, "addressdetails": 0},
            headers={"User-Agent": "TripAi/1.0 (contact:shaikhmdsaad92@gmail.com))"},
            timeout=8,
        )
        data = res.json()
        if not data:
            return None
        first = data[0]
        return {"lat": float(first["lat"]), "lng": float(first["lon"]), "display_name": first.get("display_name")}
    except Exception:
        return None


def parse_coords_from_text(text: str) -> Optional[dict]:
    m = re.search(r"(-?\d{1,3}\.\d+)[,\s]+(-?\d{1,3}\.\d+)", text)
    if m:
        try:
            lat = float(m.group(1))
            lng = float(m.group(2))
            return {"lat": lat, "lng": lng}
        except Exception:
            return None
    return None


def geocode_place(place_name: str, city: str):
    """Resolve `place_name` to coordinates.

    Strategy (ordered):
    1. Parse explicit coordinates embedded in text.
    2. Resolve known aliases.
    3. Nominatim search: "<place>, <city>".
    4. Photon search with city hint.
    5. Overpass search using a bbox around the city center if available.
    6. Fuzzy / tokenized Nominatim searches for partial matches.
    7. City center fallback.
    """
    # 0️⃣ explicit coords in the text
    coords = parse_coords_from_text(place_name)
    if coords:
        return coords

    resolved = resolve_alias(place_name)

    # 1️⃣ Nominatim exact-like search with city hint
    q = f"{resolved}, {city}" if city else resolved
    nom = nominatim_search(q)
    if nom:
        return {"lat": nom["lat"], "lng": nom["lng"]}

    # 2️⃣ Photon (fast text -> coords)
    coords = photon_search(f"{resolved} {city}".strip())
    if coords:
        return coords

    # 3️⃣ Overpass: prefer bbox-based search using known city centre
    city_center = CITY_CENTERS.get(city)
    coords = overpass_search(resolved, city_center)
    if coords:
        return coords

    # 4️⃣ Fuzzy/tokenized fallback: try smaller chunks of the name with Nominatim
    tokens = [t for t in re.split(r"[,\-/]", resolved) if t.strip()]
    for tok in tokens + resolved.split():
        if len(tok) < 3:
            continue
        nom = nominatim_search(f"{tok.strip()}, {city}")
        if nom:
            return {"lat": nom["lat"], "lng": nom["lng"]}

    # 5️⃣ best-effort fuzzy match using Nominatim with only city (return most similar display_name)
    if city:
        city_nom = nominatim_search(city)
        if city_nom:
            # try searching common landmarks inside city by name similarity (one more request)
            nom = nominatim_search(resolved)
            if nom:
                return {"lat": nom["lat"], "lng": nom["lng"]}

    # 6️⃣ final fallback: city center or None
    return CITY_CENTERS.get(city)
