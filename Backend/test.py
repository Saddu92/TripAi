from app.services.ai_planner import generate_places

result = generate_places(
    destination="Goa",
    preferences=["beach", "nightlife"],
    days=2
)

print(result)