"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import "@/lib/leaflet";

const ItineraryMap = dynamic(
  () => import("./ItineraryMap"),
  { ssr: false }
);

export default ItineraryMap;
