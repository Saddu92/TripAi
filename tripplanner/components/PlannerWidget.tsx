"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PlannerWidget() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");

  return (
    <aside className="card-style p-6 space-y-4">
      <h2 className="text-2xl font-semibold">AI Trip Planner ✈️</h2>

      <div className="space-y-3">
        <Input
          placeholder="Where to?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <Input
          placeholder="Budget (USD)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <button className="btn-primary-soft flex-1">Generate Itinerary</button>
        <button className="px-4 py-2 rounded-md border">Advanced</button>
      </div>
    </aside>
  );
}
