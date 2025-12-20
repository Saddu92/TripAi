"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

export interface Place {
  display_name: string;
  map_entity: string;
  entity_type: string;
  category: string;
  best_time: string;
  activities: string[];
  location?: {
    lat: number;
    lng: number;
  };
}

function FitBounds({ places }: { places: Place[] }) {
  const map = useMap();
  const bounds = places
    .filter((p) => p.location)
    .map((p) => [p.location!.lat, p.location!.lng]) as [number, number][];
  if (bounds.length === 0) return null;
  try {
    map.fitBounds(bounds as any, { padding: [40, 40] });
  } catch (e) {
    // ignore
  }
  return null;
}

export default function ItineraryMap({
  places,
  destination,
}: {
  places: Place[];
  destination: string;
}) {
  const validPlaces = places.filter((p) => p.location);

  if (!validPlaces.length) {
    return (
      <div className="card-style h-64 md:h-80 lg:h-[420px] flex items-center justify-center text-gray-400">
        No locations available for map
      </div>
    );
  }

  return (
    <div className="card-style rounded-xl overflow-hidden">
      <MapContainer
        center={[validPlaces[0].location!.lat, validPlaces[0].location!.lng]}
        zoom={12}
        className="h-64 md:h-80 lg:h-[420px] w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {validPlaces.map((p, i) => (
          <Marker key={i} position={[p.location!.lat, p.location!.lng]}>
            <Popup>
              <strong>{p.display_name}</strong>
              <p className="text-xs text-gray-500">Pinned to {p.map_entity}</p>
            </Popup>
          </Marker>
        ))}

        <FitBounds places={validPlaces} />
      </MapContainer>
    </div>
  );
}
