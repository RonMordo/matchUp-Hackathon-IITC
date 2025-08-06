import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
  address: z.string().min(1, "Address is required"),
  hobby: z.string().min(1, "Hobby is required"),
  time: z.string().min(1, "Time is required"),
  minParticipants: z
    .string()
    .regex(/^\d+$/, "Minimum Participants must be a number"),
  maxParticipants: z
    .string()
    .regex(/^\d+$/, "Maximum Participants must be a number"),
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;

export type Event = {
  _id: string;
  title: string;
  description?: string;
  hobby: string;
  creator: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  address: string;
  time: string;
  minParticipants: number;
  maxParticipants: number;
  acceptedParticipants: string[];
  pendingParticipants: string[];
  status: "open" | "closed";
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  event?: Event;
  onClose?: () => void;
};

export function CreateEventForm({ event, onClose }: Props) {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      hobby: "",
      time: "",
      minParticipants: "",
      maxParticipants: "",
    },
  });

  useEffect(() => {
    if (event) {
      form.reset({
        title: event.title,
        description: event.description ?? "",
        address: event.address,
        hobby: event.hobby,
        time: event.time,
        minParticipants: String(event.minParticipants),
        maxParticipants: String(event.maxParticipants),
      });
    }
  }, [event, form]);

  const mutation = useMutation({
    mutationFn: async (data: CreateEventFormData) => {
      const method = event ? "PATCH" : "POST";
      const url = event
        ? `http://localhost:3001/api/events/${event._id}`
        : `http://localhost:3001/api/events`;

      const body = {
        title: data.title,
        description: data.description || "",
        address: data.address,
        hobby: data.hobby,
        time: data.time,
        minParticipants: Number(data.minParticipants),
        maxParticipants: Number(data.maxParticipants),
      };

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
    <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-10 rounded-3xl shadow-xl">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Sparkles className="text-indigo-500 dark:text-pink-400" />
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white text-center">
          {event ? "Edit Event" : "Add a New Event"}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 transition-all">
          <FormFieldWrapper
            control={form.control}
            name="title"
            label="Title"
            type="text"
            placeholder="Event title"
          />
          <FormFieldWrapper
            control={form.control}
            name="description"
            label="Description"
            type="text"
            placeholder="Event description"
          />
          <FormFieldWrapper
            control={form.control}
            name="address"
            label="Address"
            type="text"
            placeholder="e.g. Tel Aviv Beach"
          />
          <FormFieldWrapper
            control={form.control}
            name="hobby"
            label="Hobby"
            type="text"
            placeholder="e.g. volleyball"
          />
          <FormFieldWrapper
            control={form.control}
            name="time"
            label="Date and Time"
            type="datetime-local"
            placeholder="YYYY-MM-DDTHH:mm"
          />
          <FormFieldWrapper
            control={form.control}
            name="minParticipants"
            label="Minimum Participants"
            type="text"
            placeholder="e.g. 2"
          />
          <FormFieldWrapper
            control={form.control}
            name="maxParticipants"
            label="Maximum Participants"
            type="text"
            placeholder="e.g. 10"
          />

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full text-base font-semibold tracking-wide py-3 rounded-full"
          >
            {mutation.isPending
              ? event
                ? "Updating..."
                : "Adding..."
              : event
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
