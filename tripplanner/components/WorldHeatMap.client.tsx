"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { useEffect } from "react";

function HeatLayer({ points }: { points: number[][] }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const heat = (L as any).heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 5,
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [points, map]);

  return null;
}

export default function WorldHeatmapClient({
  points,
}: {
  points: number[][];
}) {
  if (!points.length) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-400 bg-gray-900 rounded-xl">
        No heatmap data available
      </div>
    );
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      className="h-96 w-full rounded-xl"
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <HeatLayer points={points} />
    </MapContainer>
  );
}
