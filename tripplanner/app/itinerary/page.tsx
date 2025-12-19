"use client";

import { useEffect, useState } from "react";
import PageTransition from "@/components/PageTransition";
import DayAccordion from "@/components/DayAccordion";
import CostSummary from "@/components/CostSummary";
import ItineraryActions from "@/components/ItineraryActions";
import ItineraryMap from "@/components/ClientMap";

export default function ItineraryPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("itinerary");
    if (raw) setData(JSON.parse(raw));
  }, []);

  const days = Array.isArray(data) ? data : data?.days;

  if (!data || !Array.isArray(days)) {
    return (
      <PageTransition>
        <div className="max-w-3xl mx-auto py-20 text-center text-gray-500">
          Loading itinerary...
        </div>
      </PageTransition>
    );
  }

const places =
  days.flatMap((day: any) =>
    day.places
      .filter((p: any) => p.location && p.location.lat && p.location.lng)
      .map((p: any) => ({
        display_name: p.display_name,
        map_entity: p.map_entity,
        location: {
          lat: p.location.lat,
          lng: p.location.lng,
        },
      }))
  );


  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold">
              {data.destination ?? "Your Trip"}
            </h1>
          </div>
          <ItineraryActions />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {days.map((day: any) => (
              <DayAccordion key={day.day} day={day} />
            ))}
          </div>

          <div className="space-y-4">
            <ItineraryMap places={places} destination="Trip" />
            <CostSummary />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
