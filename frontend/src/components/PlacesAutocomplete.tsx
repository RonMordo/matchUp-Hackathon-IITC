import { useState, useCallback } from "react";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { Input } from "@/components/ui/input";

interface PlaceResult {
  address: string;
  lat: number;
  lng: number;
  placeId: string;
}

interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: PlaceResult) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function PlacesAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Search for a location...",
  className,
  disabled = false,
}: PlacesAutocompleteProps) {
  const map = useMap();
  const places = useMapsLibrary("places");
  const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken>();
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [predictionResults, setPredictionResults] = useState<Array<google.maps.places.AutocompletePrediction>>([]);
  const [isOpen, setIsOpen] = useState(false);

  const initializeServices = useCallback(() => {
    if (!places || !map) return;

    if (!autocompleteService) {
      setAutocompleteService(new places.AutocompleteService());
    }
    if (!placesService) {
      setPlacesService(new places.PlacesService(map));
    }
    if (!sessionToken) {
      setSessionToken(new places.AutocompleteSessionToken());
    }
  }, [places, map, autocompleteService, placesService, sessionToken]);

  const fetchPredictions = useCallback(
    async (inputValue: string) => {
      if (!autocompleteService || !inputValue) {
        setPredictionResults([]);
        return;
      }

      const request = {
        input: inputValue,
        sessionToken,
        types: ["establishment", "geocode"],
      };

      try {
        const response = await autocompleteService.getPlacePredictions(request);
        setPredictionResults(response.predictions || []);
      } catch (error) {
        console.error("Error fetching predictions:", error);
        setPredictionResults([]);
      }
    },
    [autocompleteService, sessionToken]
  );

  const handleInputChange = (newValue: string) => {
    onChange(newValue);

    if (newValue.length > 2) {
      initializeServices();
      fetchPredictions(newValue);
      setIsOpen(true);
    } else {
      setPredictionResults([]);
      setIsOpen(false);
    }
  };

  const handlePlaceSelect = useCallback(
    (placeId: string, description: string) => {
      if (!placesService) return;

      const request = {
        placeId,
        fields: ["geometry", "formatted_address", "place_id"],
        sessionToken,
      };

      placesService.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || description;

          onChange(address);

          if (onPlaceSelect) {
            onPlaceSelect({
              address,
              lat,
              lng,
              placeId,
            });
          }

          // Create new session token for next search
          setSessionToken(new google.maps.places.AutocompleteSessionToken());
        }
      });

      setIsOpen(false);
      setPredictionResults([]);
    },
    [placesService, sessionToken, onChange, onPlaceSelect]
  );

  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        autoComplete="off"
      />

      {isOpen && predictionResults.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {predictionResults.map((prediction) => (
            <button
              key={prediction.place_id}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none transition-colors"
              onClick={() => handlePlaceSelect(prediction.place_id, prediction.description)}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {prediction.structured_formatting?.main_text || prediction.description}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {prediction.structured_formatting?.secondary_text || ""}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && predictionResults.length === 0 && value.length > 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No results found</div>
        </div>
      )}
    </div>
  );
}
