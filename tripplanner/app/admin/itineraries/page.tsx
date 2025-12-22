"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";

export default function AdminItinerariesPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTrips = async () => {
    const res = await api.get("/admin/itineraries");
    setTrips(res.data);
    setLoading(false);
  };

  const deleteTrip = async (id: string) => {
    if (!confirm("Delete this itinerary?")) return;
    await api.delete(`/admin/itineraries/${id}`);
    loadTrips();
  };

  useEffect(() => {
    loadTrips();
  }, []);

  if (loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">All Itineraries</h1>

      {trips.length === 0 && (
        <p className="text-gray-400">No itineraries found.</p>
      )}

      <div className="grid gap-4">
        {trips.map((t) => (
          <div
            key={t._id}
            className="card-style flex justify-between items-center p-5"
          >
            <div>
              <p className="font-semibold text-gray-900">{t.destination}</p>
              <p className="text-sm text-gray-500">
                {t.start_date} → {t.end_date}
              </p>
              <p className="text-xs text-gray-400">
                Budget: {t.budget ?? "—"}
              </p>
            </div>

            <button
              onClick={() => deleteTrip(t._id)}
              className="text-sm text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
