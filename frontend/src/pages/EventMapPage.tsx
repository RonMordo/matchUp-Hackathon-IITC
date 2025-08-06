import { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

const GOOGLE_API = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_MAP_ID;
console.log("mapID", MAP_ID);

export default function EventMap() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        console.log("✅ User location:", latitude, longitude);
      },
      (err) => {
        console.warn("❌ User denied geolocation:", err.message);
      }
    );
  }, []);

  return (
    <APIProvider apiKey={GOOGLE_API}>
      <Map
        mapId={MAP_ID}
        defaultCenter={userLocation ?? { lat: 32.08, lng: 34.78 }} // Default to Tel Aviv
        defaultZoom={13}
        style={{ height: "600px", width: "100%" }}
      >
        {userLocation && (
          <AdvancedMarker position={userLocation}>
            <Pin background="blue" glyphColor="white" borderColor="white" />
          </AdvancedMarker>
        )}
      </Map>
    </APIProvider>
  );
}
