import requests
from typing import Optional


def overpass_search(name: str, city_center: Optional[dict] = None):
    """Search Overpass for an element matching `name`.

    If `city_center` provided (dict with lat/lng) the search will be limited
    to a small bbox around that center to improve relevance. Otherwise a
    broad name-based search is attempted.
    """
    # sanitize name for use in regex
    safe_name = name.replace('"', "'")

    if city_center and "lat" in city_center and "lng" in city_center:
        lat = city_center["lat"]
        lon = city_center["lng"]
        # ~5km bbox (approx). Adjust if needed.
        delta = 0.05
        south = lat - delta
        north = lat + delta
        west = lon - delta
        east = lon + delta

        query = f"""
        [out:json][timeout:25];
        (
          node["name"~"{safe_name}",i]({south},{west},{north},{east});
          way["name"~"{safe_name}",i]({south},{west},{north},{east});
          relation["name"~"{safe_name}",i]({south},{west},{north},{east});
        );
        out center 1;
        """
    else:
        # broader search across the planet (no bbox) but limit results
        query = f"""
        [out:json][timeout:25];
        (
          node["name"~"{safe_name}",i];
          way["name"~"{safe_name}",i];
          relation["name"~"{safe_name}",i];
        );
        out center 1;
        """

    try:
        res = requests.post(
            "https://overpass-api.de/api/interpreter",
            data=query,
            timeout=25
        )
        data = res.json()
        if not data.get("elements"):
            return None

        el = data["elements"][0]
        lat = el.get("lat") or (el.get("center") or {}).get("lat")
        lon = el.get("lon") or (el.get("center") or {}).get("lon")
        if lat is None or lon is None:
            return None

        return {"lat": lat, "lng": lon}

    except Exception:
        return None
