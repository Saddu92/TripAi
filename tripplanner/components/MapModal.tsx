"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function MapModal({
  open,
  onClose,
  places,
}: {
  open: boolean;
  onClose: () => void;
  places: any[];
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (!open) return null;

  const center =
    places.length > 0
      ? { lat: places[0].lat, lng: places[0].lng }
      : { lat: 20.5937, lng: 78.9629 }; // India fallback

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl h-[80vh] rounded-xl p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-3">Trip Map</h2>

        {!isLoaded ? (
          <p className="text-center mt-10">Loading map...</p>
        ) : (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={12}
          >
            {places.map((p, i) => (
              <Marker
                key={i}
                position={{ lat: p.lat, lng: p.lng }}
                title={p.name}
              />
            ))}
          </GoogleMap>
        )}
      </div>
    </div>
  );
}
