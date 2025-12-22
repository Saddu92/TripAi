"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import DayAccordion from "@/components/DayAccordion";
import CostSummary from "@/components/CostSummary";
import ItineraryActions from "@/components/ItineraryActions";
import { MapPin } from "lucide-react";

import dynamic from "next/dynamic";

const ItineraryMap = dynamic(
  () => import("@/components/ClientMap"),
  { ssr: false }
);

const ExpensesChart = dynamic(
  () => import("@/components/ExpensesChart"),
  { ssr: false }
);


export default function ItineraryPage() {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("itinerary");
      if (raw) setData(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to parse itinerary from storage", e);
    }
  }, []);

  const days = Array.isArray(data) ? data : data?.days ?? null;

  const places = useMemo(() => {
    if (!Array.isArray(days)) return [];
    return days.flatMap((day: any) =>
      (day.places ?? [])
        .filter((p: any) => p.location && p.location.lat && p.location.lng)
        .map((p: any) => ({
          display_name: p.display_name,
          map_entity: p.map_entity,
          location: {
            lat: Number(p.location.lat),
            lng: Number(p.location.lng),
          },
        }))
    );
  }, [days]);

  if (!data) {
    return (
      <PageTransition>
        <div className="max-w-3xl mx-auto py-20">
          <div className="card-style p-10 text-center space-y-6">
            <div className="flex items-center justify-center text-indigo-600">
              <MapPin size={48} />
            </div>
            <h2 className="text-2xl font-semibold">No itinerary found</h2>
            <p className="text-sm text-muted-foreground">You don't have any saved trip yet. Create an itinerary and it will appear here.</p>
            <div className="flex justify-center gap-3">
              <Link href="/planner" className="btn-primary-soft">Plan Your Adventure</Link>
              <Link href="/" className="px-4 py-2 rounded-md border">Browse Trips</Link>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold">{data.destination ?? "Your Trip"}</h1>
            {data.start_date && data.end_date && (
              <div className="text-sm text-muted-foreground mt-1">{data.start_date} → {data.end_date}</div>
            )}
          </div>
          <ItineraryActions />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="card-style p-4">
              <ItineraryMap places={places} destination={data.destination ?? "Trip"} />
            </div>

            <div className="space-y-4">
              {Array.isArray(days) && days.map((day: any) => (
                <DayAccordion key={day.day ?? Math.random()} day={day} />
              ))}
            </div>
          </div>

          <aside className="space-y-4 sticky top-24">
            <div className="card-style p-4">
              <CostSummary data={data} />
            </div>

            {data.budget_summary?.per_day && (
              <div className="card-style p-4">
                <ExpensesChart perDay={data.budget_summary.per_day} />
              </div>
            )}
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}
