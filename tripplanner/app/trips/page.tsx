"use client";

import axios from "axios";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchTrips = async () => {
    try {
      const response = await api.get("/itineraries");

      // Normalize ONCE
      const normalized = response.data.map((trip: any) => ({
        ...trip,
        days: Array.isArray(trip.days) ? trip.days : [],
      }));

      setTrips(normalized);
    } catch (error) {
      console.error("Failed to fetch trips", error);
    } finally {
      setLoading(false);
    }
  };

  fetchTrips();
}, []);


  const handleDelete = async (id: string, destination: string) => {
    const confirmed = confirm(`Delete trip to ${destination}?`);
    if (!confirmed) return;

    try {
      await api.delete(`/itineraries/${id}`);

      // Remove from UI instantly
      setTrips((prev) => prev.filter((trip) => trip._id !== id));
      toast.success("Trip deleted");
    } catch (error) {
      console.error("Failed to delete trip", error);
      toast.error("Failed to delete itinerary");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading trips...</p>;
  }

  return (
    <PageTransition>
      <div className="w-full mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">Your Saved Trips</h1>

        </div>

        {trips.length === 0 ? (
          <p className="text-gray-500 text-lg">No saved trips yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="relative bg-white shadow rounded-2xl p-6 hover:shadow-lg transition flex flex-col justify-between"
              >
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(trip._id, trip.destination);
                  }}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  title="Delete trip"
                >
                  🗑️
                </button>

                {/* Trip Card */}
                <Link href={`/trips/${trip._id}`} className="block">
                  <h2 className="text-2xl font-semibold">{trip.destination}</h2>

                  <p className="text-gray-600 mt-2">
                    {trip.start_date} → {trip.end_date}
                  </p>

                  <p className="text-gray-800 mt-4 font-medium">{trip.days.length} Days</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
