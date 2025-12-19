"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PlannerWidget() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4 border">
      <h2 className="text-2xl font-semibold text-center">
        AI Trip Planner ✈️
      </h2>

      <Input
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <Input
        placeholder="Budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />

      <Button className="w-full bg-blue-600 hover:bg-blue-700">
        Generate Itinerary
      </Button>
    </div>
  );
}
