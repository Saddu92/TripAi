import csv
from io import StringIO


def generate_csv_from_itinerary(itinerary: dict) -> str:
    """
    Converts a single itinerary document into CSV string
    """

    output = StringIO()
    writer = csv.writer(output)

    # ---- Header ----
    writer.writerow([
        "Destination",
        "Start Date",
        "End Date",
        "Day",
        "Place Name",
        "Category",
        "Latitude",
        "Longitude",
    ])

    destination = itinerary.get("destination")
    start_date = itinerary.get("start_date")
    end_date = itinerary.get("end_date")

    for day in itinerary.get("days", []):
        day_number = day.get("day")

        for place in day.get("places", []):
            location = place.get("location", {})

            writer.writerow([
                destination,
                start_date,
                end_date,
                day_number,
                place.get("place_name"),
                place.get("category"),
                location.get("lat"),
                location.get("lng"),
            ])

    return output.getvalue()
