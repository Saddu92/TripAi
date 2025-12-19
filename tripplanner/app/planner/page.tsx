"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageTransition from "@/components/PageTransition";
import axios from "axios";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";


export default function PlannerPage() {
  useAuthGuard();
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tripType, setTripType] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);

  const router = useRouter();   // ✅ Correct place

  const togglePreference = (value: string) => {
    setPreferences((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };

  const handleGenerate = async () => {   // ✅ Inside component
    const payload = {
      destination,
      budget: Number(budget),
      start_date: startDate,
      end_date: endDate,
      preferences,
    };

    console.log(payload);

    // Redirect to loading screen
    router.push("/loading");

    const response = await api.post("/ai/generate", payload);


    // Save itinerary result locally
    localStorage.setItem("itinerary", JSON.stringify(response.data));

    // Go to results page
    router.push("/itinerary");
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-4xl font-bold mb-6 text-center">Plan Your Trip ✈️</h1>

        <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
          <div>
            <label className="font-semibold">Destination</label>
            <Input
              placeholder="e.g. Paris, Tokyo, Bali"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">Budget (₹ / $)</label>
            <Input
              type="number"
              placeholder="Enter your budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="font-semibold mb-2 block">Trip Type</label>
            <div className="flex gap-3 flex-wrap">
              {["Solo", "Family", "Friends", "Couple"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTripType(t)}
                  className={`px-4 py-2 rounded-full border ${
                    tripType === t ? "bg-blue-600 text-white" : "bg-gray-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold mb-2 block">Preferences</label>
            <div className="flex gap-3 flex-wrap">
              {["Adventure", "Culture", "Food", "Shopping", "Nature", "Relax"].map((p) => (
                <button
                  key={p}
                  onClick={() => togglePreference(p)}
                  className={`px-4 py-2 rounded-full border ${
                    preferences.includes(p)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <Button
            className="w-full text-lg py-6 mt-4 bg-blue-600 hover:bg-blue-700"
            onClick={handleGenerate}
          >
            Generate Itinerary 🚀
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
