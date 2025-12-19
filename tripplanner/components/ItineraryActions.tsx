"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Share2, Download, Heart, Pencil } from "lucide-react";



export default  function ItineraryActions() {

  const handleSave=async()=>{
    const raw=localStorage.getItem("itinerary");
    if(!raw) return;

    const itinerary=JSON.parse(raw);

    const response =await axios.post(
      "http://localhost:8000/itineraries/save",
      itinerary
    );

    alert("Itinerary saved Successfully!");

  }
  return (
    <div className="flex flex-wrap gap-3 justify-end">
      <Button variant="outline" className="flex gap-2 items-center" onClick={handleSave}>
        <Heart size={18} /> Save
      </Button>

      <Button variant="outline" className="flex gap-2 items-center">
        <Share2 size={18} /> Share
      </Button>

      <Button variant="outline" className="flex gap-2 items-center">
        <Pencil size={18} /> Edit
      </Button>

      <Button className="flex gap-2 items-center bg-blue-600 hover:bg-blue-700">
        <Download size={18} /> Download PDF
      </Button>
    </div>
  );
}
