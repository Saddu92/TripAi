import requests

def overpass_search(name: str, city: str):
    query = f"""
    [out:json];
    (
      node["name"~"{name}",i]["tourism"](area:3600062423);
      way["name"~"{name}",i]["tourism"](area:3600062423);
    );
    out center 1;
    """

    try:
        res = requests.post(
            "https://overpass-api.de/api/interpreter",
            data=query,
            timeout=15
        )
        data = res.json()
        if not data["elements"]:
            return None

        el = data["elements"][0]
        return {
            "lat": el.get("lat") or el["center"]["lat"],
            "lng": el.get("lon") or el["center"]["lon"]
        }

    except Exception:
        return None
