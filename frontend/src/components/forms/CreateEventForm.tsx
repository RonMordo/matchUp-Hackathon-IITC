import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";

const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  hobby: z.string().min(1, "Hobby is required"),
  creator: z.string().min(1, "Creator is required"),
  address: z.string().min(1, "Address is required"),
  time: z.string().min(1, "Time is required"), // datetime-local string
  minParticipants: z.string().regex(/^\d+$/, "Minimum Participants must be a number"),
  maxParticipants: z.string().regex(/^\d+$/, "Maximum Participants must be a number"),
  locationLat: z.string().regex(/^(-?\d+(\.\d+)?)$/, "Latitude must be a valid number").optional(),
  locationLng: z.string().regex(/^(-?\d+(\.\d+)?)$/, "Longitude must be a valid number").optional(),
  status: z.enum(["open", "closed", "cancelled", "full"]).optional(),
  isPrivate: z.boolean().optional(),
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;

type Props = {
  event?: Partial<CreateEventFormData> & { _id?: string; location?: { coordinates: [number, number] } };
  onClose?: () => void;
};

const hobbyOptions = [
  { value: "hobby1", label: "Hiking" },
  { value: "hobby2", label: "Cooking" },
  { value: "hobby3", label: "Photography" },
  { value: "hobby4", label: "Reading" },
];

export function CreateEventForm({ event, onClose }: Props) {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      hobby: "",
      creator: "",
      address: "",
      time: "",
      minParticipants: "",
      maxParticipants: "",
      locationLat: "",
      locationLng: "",
      status: "open",
      isPrivate: false,
    },
  });

  useEffect(() => {
    if (event) {
      form.reset({
        title: event.title ?? "",
        description: event.description ?? "",
        hobby: event.hobby ?? "",
        creator: event.creator ?? "",
        address: event.address ?? "",
        time: event.time
          ? typeof event.time === "string"
            ? event.time
            : new Date(event.time).toISOString().slice(0, 16)
          : "",
        minParticipants: event.minParticipants !== undefined ? String(event.minParticipants) : "",
        maxParticipants: event.maxParticipants !== undefined ? String(event.maxParticipants) : "",
        locationLat:
          event.location?.coordinates
            ? String(event.location.coordinates[1])
            : "",
        locationLng:
          event.location?.coordinates
            ? String(event.location.coordinates[0])
            : "",
        status: event.status ?? "open",
        isPrivate: event.isPrivate ?? false,
      });
    }
  }, [event, form]);

  const mutation = useMutation({
    mutationFn: async (data: CreateEventFormData) => {
      const method = event?._id ? "PATCH" : "POST";
      const url = event?._id
        ? `http://localhost:3001/api/events/${event._id}`
        : `http://localhost:3001/api/events`;

      const body: any = {
        title: data.title,
        description: data.description || "",
        hobby: data.hobby,
        creator: data.creator,
        address: data.address,
        time: new Date(data.time),
        minParticipants: Number(data.minParticipants),
        maxParticipants: Number(data.maxParticipants),
        status: data.status || "open",
        isPrivate: data.isPrivate || false,
      };

      if (data.locationLat && data.locationLng) {
        body.location = {
          type: "Point",
          coordinates: [Number(data.locationLng), Number(data.locationLat)],
        };
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save event");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      form.reset();
      if (onClose) onClose();
      else {
        setSuccessMessage("✅ Event saved successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    },
    onError: (error: any) => {
      setSuccessMessage(null);
      form.setError("title", { type: "manual", message: error.message });
    },
  });

  const onSubmit = (data: CreateEventFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-10 rounded-3xl shadow-xl max-h-screen overflow-auto">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Sparkles className="text-indigo-500 dark:text-pink-400" />
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white text-center">
          {event?._id ? "Edit Event" : "Add a New Event"}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 transition-all">
          <FormFieldWrapper control={form.control} name="title" label="Title" type="text" placeholder="Event title" />
          <FormFieldWrapper control={form.control} name="description" label="Description" type="text" placeholder="Event description" />

          {/* Hobby select */}
          <Controller
            control={form.control}
            name="hobby"
            render={({ field }) => (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">Hobby</label>
                <select
                  {...field}
                  className="w-full rounded-xl px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Select hobby</option>
                  {hobbyOptions.map((hobby) => (
                    <option key={hobby.value} value={hobby.value}>
                      {hobby.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          />

          <FormFieldWrapper control={form.control} name="creator" label="Creator" type="text" placeholder="Creator string" />
          <FormFieldWrapper control={form.control} name="address" label="Address" type="text" placeholder="e.g. Tel Aviv Beach" />
          <FormFieldWrapper control={form.control} name="time" label="Date and Time" type="datetime-local" placeholder="YYYY-MM-DDTHH:mm" />
          <FormFieldWrapper control={form.control} name="minParticipants" label="Minimum Participants" type="text" placeholder="e.g. 2" />
          <FormFieldWrapper control={form.control} name="maxParticipants" label="Maximum Participants" type="text" placeholder="e.g. 10" />
          <FormFieldWrapper control={form.control} name="locationLat" label="Latitude (optional)" type="text" placeholder="e.g. 32.0853" />
          <FormFieldWrapper control={form.control} name="locationLng" label="Longitude (optional)" type="text" placeholder="e.g. 34.7818" />

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full text-base font-semibold tracking-wide py-3 rounded-full"
          >
            {mutation.isPending
              ? event?._id
                ? "Updating..."
                : "Adding..."
              : event?._id
              ? "Update Event ✏️"
              : "Add Event 🎯"}
          </Button>

          {successMessage && (
            <div className="text-center text-green-600 dark:text-green-400 font-medium mt-4 animate-pulse">
              {successMessage}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
