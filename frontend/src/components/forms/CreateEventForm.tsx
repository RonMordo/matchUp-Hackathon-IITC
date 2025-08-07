import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { GoogleMapsProvider } from "@/components/GoogleMapsProvider";
import { PlacesAutocomplete } from "@/components/PlacesAutocomplete";
import { Sparkles, Calendar, MapPin, Users, Tag, Clock, X, CheckCircle, ChevronDown } from "lucide-react";
import { useCreateEvent } from "@/hooks/event.hook";
import { useHobbies } from "@/hooks/hobbies.hook";
import { useAuth } from "@/context/AuthContext";
import type { CreateEventDto } from "@/types/index";
import type { Hobby } from "@/types/hobbies";

const createEventSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
    description: z.string().optional(),
    hobby: z.string().min(1, "Hobby is required"),
    address: z.string().min(1, "Location is required"),
    time: z.string().min(1, "Date and time is required"),
    duration: z.number().min(15, "Duration must be at least 15 minutes").max(480, "Duration cannot exceed 8 hours"),
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
  const [hobbyDropdownOpen, setHobbyDropdownOpen] = useState(false);
  const [selectedHobby, setSelectedHobby] = useState<Hobby | null>(null);
  const [hobbySearchTerm, setHobbySearchTerm] = useState("");
  const hobbyDropdownRef = useRef<HTMLDivElement>(null);

  const { data: hobbies = [], isLoading: hobbiesLoading, error: hobbiesError } = useHobbies();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (hobbyDropdownRef.current && !hobbyDropdownRef.current.contains(event.target as Node)) {
        setHobbyDropdownOpen(false);
        setHobbySearchTerm("");
      }
    };

    if (hobbyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hobbyDropdownOpen]);

  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      hobby: "",
      address: "",
      time: "",
      duration: 60,
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
        duration: data.duration,
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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <span className="text-lg font-semibold text-gray-800 dark:text-white">Loading hobbies...</span>
          </div>
        </div>
      </div>
    );
  }

  if (hobbiesError) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Hobbies</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Please refresh the page to try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GoogleMapsProvider>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Event</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fill in the details below</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <Form {...form}>
              <form id="create-event-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                      <Tag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Event Title *
                      </label>
                      <input
                        {...form.register("title")}
                        type="text"
                        placeholder="Enter event title..."
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:ring-2 focus:outline-none focus:ring-indigo-500 dark:bg-gray-800 dark:text-white ${
                          form.formState.errors.title
                            ? "border-red-500 bg-red-50 dark:bg-red-950"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        }`}
                      />
                      {form.formState.errors.title && (
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                          {form.formState.errors.title.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Hobby Category *
                      </label>
                      <div className="relative" ref={hobbyDropdownRef}>
                        <button
                          type="button"
                          onClick={() => {
                            setHobbyDropdownOpen(!hobbyDropdownOpen);
                            if (hobbyDropdownOpen) {
                              setHobbySearchTerm("");
                            }
                          }}
                          className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:ring-2 focus:outline-none focus:ring-indigo-500 dark:bg-gray-800 dark:text-white flex items-center justify-between ${
                            form.formState.errors.hobby
                              ? "border-red-500 bg-red-50 dark:bg-red-950"
                              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {selectedHobby ? (
                              <>
                                <img 
                                  src={selectedHobby.icon} 
                                  alt={selectedHobby.name}
                                  className="w-5 h-5 object-contain"
                                />
                                <span>{selectedHobby.name}</span>
                              </>
                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">Select category</span>
                            )}
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${hobbyDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {hobbyDropdownOpen && (
                          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                            {/* Search Input */}
                            <div className="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                              <input
                                type="text"
                                placeholder="Search hobbies..."
                                value={hobbySearchTerm}
                                onChange={(e) => setHobbySearchTerm(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                                autoFocus
                              />
                            </div>
                            
                            {/* Filtered Hobbies */}
                            {hobbies
                              .filter((hobby) =>
                                hobby.name.toLowerCase().includes(hobbySearchTerm.toLowerCase())
                              )
                              .map((hobby) => (
                                <button
                                  key={hobby._id}
                                  type="button"
                                  onClick={() => {
                                    form.setValue("hobby", hobby._id);
                                    setSelectedHobby(hobby);
                                    setHobbyDropdownOpen(false);
                                    setHobbySearchTerm("");
                                    form.clearErrors("hobby");
                                  }}
                                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors duration-200"
                                >
                                  <img 
                                    src={hobby.icon} 
                                    alt={hobby.name}
                                    className="w-5 h-5 object-contain"
                                  />
                                  <span className="text-sm">{hobby.name}</span>
                                </button>
                              ))}
                            
                            {/* No results message */}
                            {hobbies.filter((hobby) =>
                              hobby.name.toLowerCase().includes(hobbySearchTerm.toLowerCase())
                            ).length === 0 && hobbySearchTerm && (
                              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                                No hobbies found matching "{hobbySearchTerm}"
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {form.formState.errors.hobby && (
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                          {form.formState.errors.hobby.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description (Optional)
                    </label>
                    <textarea
                      {...form.register("description")}
                      placeholder="Describe your event..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-sm transition-all duration-200 focus:ring-2 focus:outline-none focus:ring-indigo-500 dark:bg-gray-800 dark:text-white hover:border-gray-400 dark:hover:border-gray-500 resize-none"
                    />
                  </div>
                </div>

                {/* Location & Time Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location & Time</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Location *
                      </label>
                      <PlacesAutocomplete
                        value={form.watch("address")}
                        onChange={(value) => form.setValue("address", value)}
                        onPlaceSelect={handlePlaceSelect}
                        placeholder="Search for a location..."
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:ring-2 focus:outline-none focus:ring-indigo-500 dark:bg-gray-800 dark:text-white ${
                          form.formState.errors.address
                            ? "border-red-500 bg-red-50 dark:bg-red-950"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        }`}
                      />
                      {form.formState.errors.address && (
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                          {form.formState.errors.address.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date and Time *
                      </label>
                      <input
                        {...form.register("time")}
                        type="datetime-local"
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:ring-2 focus:outline-none focus:ring-indigo-500 dark:bg-gray-800 dark:text-white ${
                          form.formState.errors.time
                            ? "border-red-500 bg-red-50 dark:bg-red-950"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        }`}
                      />
                      {form.formState.errors.time && (
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                          {form.formState.errors.time.message}
                        </p>
                      )}
                    </div>
                  </div>

                                     {/* Duration Section */}
                   <div className="space-y-3">
                     <div className="flex items-center gap-2">
                       <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                         <Clock className="w-3 h-3 text-green-600 dark:text-green-400" />
                       </div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                         Duration
                       </label>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                           Duration (minutes)
                         </label>
                         <div className="flex items-center gap-2">
                           <input
                             {...form.register("duration", { valueAsNumber: true })}
                             type="number"
                             min="15"
                             max="480"
                             step="15"
                             className={`flex-1 px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:ring-2 focus:outline-none focus:ring-indigo-500 dark:bg-gray-800 dark:text-white ${
                               form.formState.errors.duration
                                 ? "border-red-500 bg-red-50 dark:bg-red-950"
                                 : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                             }`}
                           />
                           <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">min</span>
                         </div>
                         {form.formState.errors.duration && (
                           <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                             {form.formState.errors.duration.message}
                           </p>
                         )}
                       </div>

                       <div className="space-y-2">
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                           Quick Select
                         </label>
                         <div className="flex flex-wrap gap-2">
                           {[30, 60, 90, 120, 180].map((minutes) => (
                             <button
                               key={minutes}
                               type="button"
                               onClick={() => form.setValue("duration", minutes)}
                               className={`px-3 py-2 text-xs rounded-lg border transition-all duration-200 font-medium ${
                                 form.watch("duration") === minutes
                                   ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                                   : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                               }`}
                             >
                               {minutes}m
                             </button>
                           ))}
                         </div>
                       </div>
                     </div>
                   </div>
                </div>

                {/* Participants Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Participants</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Min Participants *
                      </label>
                      <input
                        {...form.register("minParticipants", { valueAsNumber: true })}
                        type="number"
                        min="1"
                        placeholder="2"
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:ring-2 focus:outline-none focus:ring-indigo-500 dark:bg-gray-800 dark:text-white ${
                          form.formState.errors.minParticipants
                            ? "border-red-500 bg-red-50 dark:bg-red-950"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        }`}
                      />
                      {form.formState.errors.minParticipants && (
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                          {form.formState.errors.minParticipants.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Max Participants *
                      </label>
                      <input
                        {...form.register("maxParticipants", { valueAsNumber: true })}
                        type="number"
                        min="1"
                        placeholder="10"
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:ring-2 focus:outline-none focus:ring-indigo-500 dark:bg-gray-800 dark:text-white ${
                          form.formState.errors.maxParticipants
                            ? "border-red-500 bg-red-50 dark:bg-red-950"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        }`}
                      />
                      {form.formState.errors.maxParticipants && (
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                          {form.formState.errors.maxParticipants.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <input
                      type="checkbox"
                      id="isPrivate"
                      {...form.register("isPrivate")}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="isPrivate" className="text-sm text-gray-700 dark:text-gray-300">
                      Private event (invitation only)
                    </label>
                  </div>
                </div>
              </form>
            </Form>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
            {form.formState.errors.root && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                    {form.formState.errors.root.message}
                  </p>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">{successMessage}</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              form="create-event-form"
              disabled={createEvent.isPending}
              className="w-full text-sm font-semibold py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {createEvent.isPending ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Event...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Calendar className="w-5 h-5" />
                  <span>Create Event</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </GoogleMapsProvider>
  );
}
