# app/services/ai_planner.py

import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
load_dotenv()


genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel("gemini-3-flash-preview")

def generate_places(destination: str, preferences: list[str], days: int):
    prompt = f"""
You are a professional travel planner.

Generate a {days}-day travel itinerary for {destination}.
User preferences: {", ".join(preferences)}

For EACH place, return:
- display_name: human friendly name
- map_entity MUST be:
- a single canonical landmark, monument, market, palace, park, beach, or POI
- NOT an activity, walk, experience, or sentence
- EXACT name as it would appear on Google Maps / OpenStreetMap
Examples:
- "Charminar Heritage Walk" → "Charminar Hyderabad"
- "Laad Bazaar Shopping" → "Laad Bazaar Hyderabad"
- "Irani Chai at Nimrah Cafe" → "Nimrah Cafe Hyderabad"

- entity_type: landmark | park | area | street | attraction | route
- category
- best_time
- activities (3 short bullet points)

Rules:
- map_entity MUST be a real place that exists on maps
- If the activity is an experience or route, choose the nearest landmark
- map_entity should work globally (any country)
- Return STRICT JSON ONLY
- No markdown, no explanations

JSON format:
[
  {{
    "day": 1,
    "places": [
      {{
        "display_name": "Private Yacht Sailing at Gateway of India",
        "map_entity": "Gateway of India Mumbai",
        "entity_type": "landmark",
        "category": "Adventure",
        "best_time": "Morning",
        "activities": [
          "Private yacht sailing",
          "Harbor ferry ride",
          "Photography of Taj Mahal Palace"
        ]
      }}
    ]
  }}
]
"""



    response = model.generate_content(prompt)
    

    try:
        return json.loads(response.text.strip())
    except Exception as e:
        print("JSON parse error:", e)
        print("RAW RESPONSE:", response.text)
        return []
