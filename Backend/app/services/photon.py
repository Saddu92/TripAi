import requests

def photon_search(query: str):
    try:
        res = requests.get(
            "https://photon.komoot.io/api/",
            params={"q": query, "limit": 1},
            timeout=8
        )

        data = res.json()
        if not data.get("features"):
            return None

        coords = data["features"][0]["geometry"]["coordinates"]
        return {
            "lat": coords[1],
            "lng": coords[0]
        }

    except Exception:
        return None
