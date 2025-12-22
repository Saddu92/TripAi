"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import api from "@/lib/api";

interface Trip {
  _id: string;
  destination: string;
  start_date: string;
  end_date: string;
  days: number;
}

export default function ProfilePage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/itineraries/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTrips(res.data);
      } catch (err) {
        console.error("Failed to load trips", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-2">Profile</h1>
      <p className="text-gray-600 mb-8">
        Manage your saved trips and travel plans
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Saved Trips</p>
          <p className="text-3xl font-bold">{trips.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Trips Created</p>
          <p className="text-3xl font-bold">{trips.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Favorite Destination</p>
          <p className="text-lg font-medium">{trips[0]?.destination || "—"}</p>
        </div>
      </div>

      {/* Saved Trips */}
      <h2 className="text-2xl font-semibold mb-4">Your Saved Itineraries</h2>

      {loading && <p className="text-gray-500">Loading your trips…</p>}

      {!loading && trips.length === 0 && (
        <p className="text-gray-500">You haven’t saved any trips yet.</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {trips.map((trip) => (
          <div
            key={trip._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-6"
          >
            <h3 className="text-xl font-semibold mb-1">{trip.destination}</h3>

            <p className="text-gray-600 text-sm mb-3">
              {trip.start_date} → {trip.end_date}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {Array.isArray(trip.days) ? trip.days.length : trip.days} days
              itinerary
            </p>

            <Link
              href={`/itinerary/${trip._id}`}
              className="inline-block text-blue-600 font-medium hover:underline"
            >
              View itinerary →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
