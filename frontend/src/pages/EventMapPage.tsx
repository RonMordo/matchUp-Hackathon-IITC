import { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useEvents } from "@/hooks/event.hook";
import { useAuth } from "@/context/AuthContext";
import { EventCard } from "@/components/EventCard";

const GOOGLE_API = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_MAP_ID;

export default function EventMap() {
  const [userLocation, setUserLocation] = useState<
    { lat: number; lng: number } | google.maps.LatLngLiteral | undefined
  >(undefined);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const { user } = useAuth();
  const userId = user?._id;

  const { data: events = [] } = useEvents();

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }

    const intevalID = setInterval(() => {
      console.log("gettting new location");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.warn("❌ User denied geolocation:", err.message);
        }
      );
    }, 1000);
    return () => clearInterval(intevalID);
  }, [userLocation]);

  return (
    <APIProvider apiKey={GOOGLE_API}>
      <Map
        mapId={MAP_ID}
        defaultCenter={userLocation || { lat: 32.0853, lng: 34.7818 }}
        defaultZoom={13}
        style={{ height: "100vh", width: "100vw" }}
      >
        {userLocation && (
          <AdvancedMarker position={userLocation}>
            <Pin background="blue" glyphColor="white" borderColor="white" />
          </AdvancedMarker>
        )}

        {events.map((event) => {
          const [lng, lat] = event.location?.coordinates || [];
          if (!lat || !lng) return null;
          const isUserEvent = event.creator === userId;

          let color: string;
          if (isUserEvent) {
            color = "purple";
          } else if (event.status === "open") {
            color = "green";
          } else if (event.status === "cancelled") {
            color = "red";
          } else {
            color = "gray";
          }
          const isSelected = selectedEventId === event._id;

          return (
            <AdvancedMarker
              key={event._id}
              position={{ lat, lng }}
              onClick={() => setSelectedEventId(isSelected ? null : event._id)}
            >
              <Pin background={color} glyphColor="white" borderColor="white" />
              {isSelected && (
                <InfoWindow position={{ lat, lng }} onCloseClick={() => setSelectedEventId(null)}>
                  <div style={{ width: "300px" }}>
                    <EventCard
                      event={event}
                      userId={userId}
                      onEdit={() => console.log("Edit event", event._id)}
                      onDelete={() => console.log("Delete event", event._id)}
                      onJoin={() => console.log("Join event", event._id)}
                    />
                  </div>
                </InfoWindow>
              )}
            </AdvancedMarker>
          );
        })}
      </Map>
    </APIProvider>
  );
}
