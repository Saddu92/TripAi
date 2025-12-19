"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

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


export default function ItineraryMap({
  places,
  destination,
}: {
  places: Place[];
  destination: string;
}) {
  const validPlaces = places.filter(p => p.location);

if (!validPlaces.length) {
  return (
    <div className="h-[400px] flex items-center justify-center text-gray-400 border rounded-xl">
      No locations available for map
    </div>
  );
}


  return (
    <MapContainer
      center={[
        validPlaces[0].location!.lat,
        validPlaces[0].location!.lng,
      ]}
      zoom={12}
      className="h-[400px] w-full rounded-xl"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {validPlaces.map((p, i) => (
        <Marker
          key={i}
          position={[
            p.location!.lat,
            p.location!.lng,
          ]}
        >
         <Popup>
  <strong>{p.display_name}</strong>
  <p className="text-xs text-gray-500">
    Pinned to {p.map_entity}
  </p>
</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
