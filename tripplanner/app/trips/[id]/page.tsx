"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import DayAccordion from "@/components/DayAccordion";
import api from "@/lib/api";
import ItineraryActions from "@/components/ItineraryActions";
import Link from "next/link";
import CostSummary from "@/components/CostSummary";
import ExpensesChart from "@/components/ExpensesChart";
import ItineraryMap from "@/components/ClientMap";

function TripDetailPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState<any>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await api.get(`/itineraries/${id}`);
        setTrip(response.data);
      } catch (e) {
        console.error("Failed to load trip", e);
      }
    };

    fetchTrip();
  }, [id]);

  const days = useMemo(() => (Array.isArray(trip?.days) ? trip.days : trip?.days ?? null), [trip]);

  const places = useMemo(() => {
    if (!Array.isArray(days)) return [];
    return days.flatMap((day: any) =>
      (day.places ?? [])
        .filter((p: any) => p.location && p.location.lat && p.location.lng)
        .map((p: any) => ({
          display_name: p.display_name,
          map_entity: p.map_entity,
          location: { lat: Number(p.location.lat), lng: Number(p.location.lng) },
        }))
    );
  }, [days]);

  if (!trip) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold">{trip.destination}</h1>
            {trip.start_date && trip.end_date && (
              <div className="text-sm text-muted-foreground mt-1">{trip.start_date} → {trip.end_date}</div>
            )}
          </div>
          <ItineraryActions />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="card-style p-4">
              <ItineraryMap places={places} destination={trip.destination ?? "Trip"} />
            </div>

            <div className="space-y-4">
              {Array.isArray(days) && days.map((day: any) => (
                <DayAccordion key={day.day ?? Math.random()} day={day} />
              ))}
            </div>
          </div>

          <aside className="space-y-4 sticky top-24">
            <div className="card-style p-4">
              <CostSummary data={trip} />
            </div>

            {trip.budget_summary?.per_day && (
              <div className="card-style p-4">
                <ExpensesChart perDay={trip.budget_summary.per_day} />
              </div>
            )}
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}

export default TripDetailPage;
