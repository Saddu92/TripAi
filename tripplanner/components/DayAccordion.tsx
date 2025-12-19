"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Place {
  display_name: string;   // ✅ FIX
  category: string;
  best_time: string;
  activities?: string[];
}

interface Day {
  day: number;
  places: Place[];
}

export default function DayAccordion({ day }: { day: Day }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100"
      >
        <h3 className="text-lg font-semibold">Day {day.day}</h3>
        <ChevronDown
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Content */}
      {open && (
        <div className="p-4 space-y-4">
          {day.places.map((place, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-3 bg-gray-50"
            >
              {/* ✅ PLACE NAME FIXED */}
              <h4 className="font-semibold text-gray-900">
                {place.display_name}
              </h4>

              {/* Meta */}
              <p className="text-sm text-gray-600">
                {place.category} • Best time: {place.best_time}
              </p>

              {/* Activities */}
              {place.activities && place.activities.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Things to do:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {place.activities.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
