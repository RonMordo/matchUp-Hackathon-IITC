import { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useEvents } from "@/hooks/event.hook";
import { useAuth } from "@/context/AuthContext";
import { EventCard } from "@/components/EventCard"; // adjust path as needed

const GOOGLE_API = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_MAP_ID;

export default function EventMap() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const { user } = useAuth();
  const userId = user?._id;

  const { data: allEvents = [] } = useEvents();

  // Filter out full events and only show events we want to display
  const events = allEvents.filter((event) => event.status !== "full");

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }

    const intervalID = setInterval(() => {
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
    return () => clearInterval(intervalID);
  }, [userLocation]);

  const goToMyLocation = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setMapZoom(15);
    }
  };

  const getEventColor = (event: Event) => {
    const isUserEvent = event.creator === userId;

    if (isUserEvent) {
      return "purple";
    } else if (event.status === "open") {
      return "green";
    } else if (event.status === "closed") {
      return "orange";
    } else if (event.status === "cancelled") {
      return "red";
    } else {
      return "gray"; // for full events or any other status
    }
  };

  const eventTypes = [
    { color: "purple", label: "My Events", status: "my" },
    { color: "green", label: "Open Events", status: "open" },
    { color: "orange", label: "Closed Events", status: "closed" },
    { color: "red", label: "Cancelled Events", status: "cancelled" },
  ];

  return (
    <div className="relative h-screen w-screen pointer-events-auto">
      <APIProvider apiKey={GOOGLE_API}>
        <Map
          mapId={MAP_ID}
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%", margin: "10px auto", marginTop: "50px" }}
          disableDefaultUI={true}
          gestureHandling="greedy"
          onCenterChanged={(e) => {
            const center = e.detail.center;
            if (center) {
              setMapCenter({ lat: center.lat, lng: center.lng });
            }
          }}
          onZoomChanged={(e) => {
            const zoom = e.detail.zoom;
            if (zoom) {
              setMapZoom(zoom);
            }
          }}
        >
          {userLocation && (
            <AdvancedMarker position={userLocation}>
              <div className="relative">
                <div className="w-10 h-10 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-white rounded-full"></div>
                </div>
                <div className="absolute -top-1 -left-1 w-8 h-8 bg-blue-500 rounded-full animate-ping opacity-20"></div>
              </div>
            </AdvancedMarker>
          )}

          {events.map((event) => {
            const [lng, lat] = event.location?.coordinates || [];
            if (!lat || !lng) return null;

            const color = event.status === "open" ? "green" : event.status === "cancelled" ? "red" : "gray";

            const isSelected = selectedEventId === event._id;

            return (
              <AdvancedMarker
                key={event._id}
                position={{ lat, lng }}
                onClick={() => setSelectedEventId(isSelected ? null : event._id)}
              >
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                      color === "purple"
                        ? "bg-purple-500"
                        : color === "green"
                        ? "bg-green-500"
                        : color === "orange"
                        ? "bg-orange-500"
                        : color === "red"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                  >
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"></div>
                  )}
                </div>

                {isSelected && (
                  <InfoWindow position={{ lat, lng }} onCloseClick={() => setSelectedEventId(null)}>
                    <div className="p-0 max-w-[350px]">
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

      <div className="absolute bottom-20 right-10 z-10 ">
        <button
          onClick={goToMyLocation}
          disabled={!userLocation}
          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Go to my location"
        >
          <Navigation className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      <div className="absolute bottom-20 left-4 z-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 p-4 max-w-xs">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Event Types</h3>
          </div>

          <div className="space-y-2">
            {eventTypes.map((type) => (
              <div key={type.status} className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                    type.color === "purple"
                      ? "bg-purple-500"
                      : type.color === "green"
                      ? "bg-green-500"
                      : type.color === "orange"
                      ? "bg-orange-500"
                      : type.color === "red"
                      ? "bg-red-500"
                      : "bg-gray-500"
                  }`}
                ></div>
                <span className="text-xs text-gray-700 dark:text-gray-300">{type.label}</span>
              </div>
            ))}
          </div>

          {/* User Location Indicator */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-300">Your Location</span>
            </div>
          </div>
        </div>
      </div>

      {/* Events Counter */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 px-4 py-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{events.length} Events</span>
          </div>
        </div>
      </div>
    </div>
  );
}
