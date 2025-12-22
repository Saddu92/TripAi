"use client";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";

const downloadItinerary = async (itineraryId: string) => {
  try {
    const res = await api.get(
      `/itineraries/${itineraryId}/download`,
      { responseType: "blob" }
    );

    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `itinerary_${itineraryId}.csv`;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert("Failed to download itinerary");
  }
};

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin Reports</h1>

      <Button
        onClick={() => downloadItinerary("123")}
      >
        Download Itinerary CSV
      </Button>
    </div>
  );
}
