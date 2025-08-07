import type { ReactNode } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  return (
    <APIProvider apiKey={googleMapsApiKey} libraries={["places"]}>
      <div style={{ display: "none" }}>
        <Map
          //defaultCenter={{ lat: 32.0853, lng: 34.7818 }} // Tel Aviv coordinates
          defaultZoom={10}
          mapId="hidden-map"
        />
      </div>
      {children}
    </APIProvider>
  );
}
