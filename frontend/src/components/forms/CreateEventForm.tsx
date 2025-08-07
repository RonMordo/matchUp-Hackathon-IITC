import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { GoogleMapsProvider } from "@/components/GoogleMapsProvider";
import { PlacesAutocomplete } from "@/components/PlacesAutocomplete";
import { Sparkles, Calendar, MapPin, Users, Tag } from "lucide-react";
import { useCreateEvent } from "@/hooks/event.hook";
import { useHobbies } from "@/hooks/hobbies.hook";
import { useAuth } from "@/context/AuthContext";
import type { CreateEventDto } from "@/types/index";

const createEventSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
    description: z.string().optional(),
    hobby: z.string().min(1, "Hobby is required"),
    address: z.string().min(1, "Location is required"),
    time: z.string().min(1, "Date and time is required"),
    minParticipants: z.number().min(1, "Minimum participants must be at least 1"),
    maxParticipants: z.number().min(1, "Maximum participants must be at least 1"),
    status: z.enum(["open", "closed", "cancelled", "full"]).optional(),
    isPrivate: z.boolean().optional(),
  })
  .refine((data) => data.maxParticipants >= data.minParticipants, {
    message: "Maximum participants must be greater than or equal to minimum participants",
    path: ["maxParticipants"],
  });

export type CreateEventFormData = z.infer<typeof createEventSchema>;

interface CreateEventFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

interface PlaceData {
  address: string;
  lat: number;
  lng: number;
  placeId: string;
}

export function CreateEventForm({ onClose, onSuccess }: CreateEventFormProps) {
  const { user } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);

  const { data: hobbies = [], isLoading: hobbiesLoading, error: hobbiesError } = useHobbies();

  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      hobby: "",
      address: "",
      time: "",
      minParticipants: 2,
      maxParticipants: 10,
      status: "open",
      isPrivate: false,
    },
  });

  const createEvent = useCreateEvent();

  const handlePlaceSelect = (place: PlaceData) => {
    setSelectedPlace(place);
    form.setValue("address", place.address);
    form.clearErrors("address");
  };

  const handleSubmit = async (data: CreateEventFormData) => {
    if (!user?._id) {
      form.setError("root", { message: "You must be logged in to create an event" });
      return;
    }

    if (!selectedPlace) {
      form.setError("address", { message: "Please select a location from the suggestions" });
      return;
    }

    try {
      const payload: CreateEventDto = {
        title: data.title,
        description: data.description,
        hobby: data.hobby,
        creator: user._id,
        time: new Date(data.time),
        address: selectedPlace.address,
        minParticipants: data.minParticipants,
        maxParticipants: data.maxParticipants,
        status: data.status || "open",
        isPrivate: data.isPrivate || false,
        location: {
          type: "Point",
          coordinates: [selectedPlace.lng, selectedPlace.lat],
        },
      };

      createEvent.mutate(payload, {
        onSuccess: () => {
          setSuccessMessage("✅ Event created successfully!");
          form.reset();
          setSelectedPlace(null);

          setTimeout(() => {
            setSuccessMessage(null);
            if (onSuccess) onSuccess();
            if (onClose) onClose();
          }, 2000);
        },
        onError: (error: any) => {
          console.error("Failed to create event:", error);
          const errorMessage = error?.response?.data?.message || error?.message || "Failed to create event";
          form.setError("root", { message: errorMessage });
          setSuccessMessage(null);
        },
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      form.setError("root", { message: "An unexpected error occurred" });
    }
  };

  if (hobbiesLoading) {
    return (
      <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-10 rounded-3xl shadow-xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Sparkles className="text-indigo-500 dark:text-pink-400 animate-spin" />
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white">Loading...</h2>
        </div>
      </div>
    );
  }

  if (hobbiesError) {
    return (
      <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md border border-red-200 dark:border-red-700 p-10 rounded-3xl shadow-xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Hobbies</h2>
          <p className="text-gray-600 dark:text-gray-400">Please refresh the page to try again.</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMapsProvider>
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-4 sm:p-6 rounded-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-center gap-2 mb-4 flex-shrink-0">
          <Sparkles className="text-indigo-500 dark:text-pink-400 w-6 h-6" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">Create Event</h2>
        </div>

        <Form {...form}>
          <form
            id="create-event-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex-1 overflow-y-auto space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-indigo-500" />
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormFieldWrapper
                  control={form.control}
                  name="title"
                  label="Event Title"
                  type="text"
                  placeholder="Enter event title..."
                />

                <Controller
                  control={form.control}
                  name="hobby"
                  render={({ field, fieldState }) => (
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Hobby Category
                      </label>
                      <select
                        {...field}
                        className={`w-full rounded-lg px-3 py-2 text-sm transition-all duration-200 border focus:ring-2 focus:outline-none focus:ring-indigo-500 dark:bg-gray-800 dark:text-white ${
                          fieldState.error
                            ? "border-red-500 bg-red-50 dark:bg-red-950"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                      >
                        <option value="">Select category</option>
                        {hobbies.map((hobby) => (
                          <option key={hobby._id} value={hobby._id}>
                            {hobby.icon} {hobby.name}
                          </option>
                        ))}
                      </select>
                      {fieldState.error?.message && (
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              <FormFieldWrapper
                control={form.control}
                name="description"
                label="Description (Optional)"
                type="text"
                placeholder="Describe your event..."
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">Location & Time</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Controller
                  control={form.control}
                  name="address"
                  render={({ field, fieldState }) => (
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">Location</label>
                      <PlacesAutocomplete
                        value={field.value}
                        onChange={field.onChange}
                        onPlaceSelect={handlePlaceSelect}
                        placeholder="Search for a location..."
                        className={`w-full rounded-lg px-3 py-2 text-sm transition-all duration-200 border focus:ring-2 focus:outline-none focus:ring-indigo-500 dark:bg-gray-800 dark:text-white ${
                          fieldState.error
                            ? "border-red-500 bg-red-50 dark:bg-red-950"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                      />
                      {fieldState.error?.message && (
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />

                <FormFieldWrapper control={form.control} name="time" label="Date and Time" type="datetime-local" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-indigo-500" />
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">Participants</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormFieldWrapper
                  control={form.control}
                  name="minParticipants"
                  label="Min"
                  type="number"
                  placeholder="2"
                  inputProps={{ min: 1 }}
                />
                <FormFieldWrapper
                  control={form.control}
                  name="maxParticipants"
                  label="Max"
                  type="number"
                  placeholder="10"
                  inputProps={{ min: 1 }}
                />
              </div>

              <Controller
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPrivate"
                      checked={field.value}
                      onChange={field.onChange}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="isPrivate" className="text-sm text-gray-700 dark:text-gray-300">
                      Private event (invitation only)
                    </label>
                  </div>
                )}
              />
            </div>
          </form>
        </Form>

        <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          {form.formState.errors.root && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{form.formState.errors.root.message}</p>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium text-center">{successMessage}</p>
            </div>
          )}
          ד{" "}
          <Button
            type="submit"
            form="create-event-form"
            disabled={createEvent.isPending}
            className="w-full text-sm font-semibold py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            onClick={form.handleSubmit(handleSubmit)}
          >
            {createEvent.isPending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Create Event
              </div>
            )}
          </Button>
        </div>
      </div>
    </GoogleMapsProvider>
  );
}
