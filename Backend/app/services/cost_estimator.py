from typing import List, Dict, Optional

# Simple heuristic cost estimator driven by category/entity_type.
# These are rough defaults and can be improved later with richer data.
COST_BY_CATEGORY = {
    "Adventure": 2500,
    "Culture": 800,
    "Food": 600,
    "Shopping": 1500,
    "Nature": 300,
    "Relax": 400,
    "Attraction": 700,
    "park": 50,
    "landmark": 200,
}


def estimate_place_base_cost(place: Dict) -> float:
    cat = (place.get("category") or "").strip()
    ent = (place.get("entity_type") or "").strip()

    # try category first
    if cat and cat in COST_BY_CATEGORY:
        return float(COST_BY_CATEGORY[cat])

    # try normalized entity type
    if ent and ent.lower() in COST_BY_CATEGORY:
        return float(COST_BY_CATEGORY[ent.lower()])

    # fallback heuristics based on keywords
    name = (place.get("display_name") or "").lower()
    if "museum" in name or "gallery" in name:
        return 500.0
    if "beach" in name:
        return 100.0
    if "temple" in name or "church" in name:
        return 50.0

    # default
    return 400.0


def allocate_budget(days: List[Dict], user_budget: Optional[float] = None) -> Dict:
    """Return enriched days with `estimated_cost` and `allocated_cost` per place,
    and a budget_summary dict.

    If user_budget is provided, allocated_costs are scaled to fit the budget.
    """
    places = []
    for day in days:
        for p in day.get("places", []):
            base = estimate_place_base_cost(p)
            places.append((p, base))

    total_estimated = sum(base for _, base in places)

    # if no places, return empty summary
    if not places:
        return {"days": days, "budget_summary": {"requested_budget": user_budget, "estimated_total": 0, "allocated_total": 0, "per_day": []}}

    # determine allocation scale
    if user_budget and user_budget > 0 and total_estimated > 0:
        scale = float(user_budget) / float(total_estimated)
    else:
        scale = 1.0

    allocated_total = 0.0

    # apply costs back to days
    for day in days:
        day_total = 0.0
        for p in day.get("places", []):
            base = estimate_place_base_cost(p)
            allocated = round(base * scale, 2)
            p["estimated_cost"] = round(base, 2)
            p["allocated_cost"] = allocated
            day_total += allocated
            allocated_total += allocated
        day["day_allocated_total"] = round(day_total, 2)

    budget_summary = {
        "requested_budget": user_budget,
        "estimated_total": round(total_estimated, 2),
        "allocated_total": round(allocated_total, 2),
        "per_day": [{"day": d.get("day"), "allocated": d.get("day_allocated_total", 0)} for d in days],
    }

    return {"days": days, "budget_summary": budget_summary}
