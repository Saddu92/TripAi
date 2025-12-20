"use client";

import axios from "axios";
import { Button } from "@/components/ui/button";
import { Share2, Download, Heart, Pencil } from "lucide-react";
import toast from "react-hot-toast";

export default function ItineraryActions() {

  const handleSave = async () => {
    try {
      // ✅ Always read localStorage inside handler
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please log in to save this itinerary");
        return;
      }

      const raw = localStorage.getItem("itinerary");
      if (!raw) {
        toast("No itinerary found to save", { icon: "ℹ️" });
        return;
      }

      const itinerary = JSON.parse(raw);

      await axios.post(
        "http://localhost:8000/itineraries/save",
        itinerary,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Itinerary saved successfully!");
    } catch (error: any) {
      console.error("Save itinerary failed", error);

      if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to save itinerary. Try again later.");
      }
    }
  };

  return (
    <div className="card-style p-3 flex flex-wrap gap-3 justify-end">
      <button onClick={handleSave} className="btn-primary flex gap-2 items-center px-4 py-2 rounded-lg">
        <Heart size={16} /> Save
      </button>

      <Button variant="outline" className="flex gap-2 items-center">
        <Share2 size={16} /> Share
      </Button>

      <Button variant="outline" className="flex gap-2 items-center">
        <Pencil size={16} /> Edit
      </Button>

      <button className="btn-primary flex gap-2 items-center px-4 py-2 rounded-lg">
        <Download size={16} /> Download
      </button>
    </div>
  );
}
