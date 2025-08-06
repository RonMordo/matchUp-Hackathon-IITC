import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { mockEvents } from "../data/mockData";

export type EventStatus =
  | "open"
  | "closed"
  | "cancelled"
  | "full"
  | "pending_approval"
  | "ongoing"
  | "finished"
  | "postponed";

export type Event = {
  _id: string;
  title: string;
  description?: string;
  hobby: string;
  creator: string;
  location: {
    type: "Point"; // <-- חייב להיות טיפוס מילולי
    coordinates: [number, number];
  };
  address: string;
  time: string;
  minParticipants: number;
  maxParticipants: number;
  acceptedParticipants: string[];
  pendingParticipants: string[];
  status: EventStatus;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
};

export function EventsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const {
    data: events = [],
    isLoading,
    isError,
  } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async (): Promise<Event[]> => {
  return mockEvents.map((e) => ({
    ...e,
    time: new Date(e.time).toISOString(),
    createdAt: new Date(e.createdAt).toISOString(),
    updatedAt: new Date(e.updatedAt).toISOString(),
    status: e.status as EventStatus, // 👈 פתרון לשגיאת טיפוס
    location: {
      type: "Point" as const,
      coordinates: [e.location.coordinates[0], e.location.coordinates[1]] as [number, number],
    },
  }));
},


  });

  const handleDelete = async () => {
    if (!user || !eventToDelete) return;
    try {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setEventToDelete(null);
    } catch (err: any) {
      alert(`Error deleting event: ${err.message}`);
    }
  };

  return (
  <div className="max-w-7xl mx-auto py-16 px-6">
    {/* HEADER */}
    <div className="flex justify-between items-center mb-12">
      <h1 className="text-5xl font-black text-amber-700 dark:text-amber-300 tracking-tight drop-shadow-md">
        🎉 Upcoming Events
      </h1>

      {user && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-2xl shadow-2xl border border-amber-400">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-amber-800">
                Add a New Event
              </DialogTitle>
            </DialogHeader>
            {/* AddEventForm */}
          </DialogContent>
        </Dialog>
      )}
    </div>

    {/* EVENTS GRID */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {isLoading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading events...</p>
      ) : isError ? (
        <p className="text-red-600 dark:text-red-400">Failed to load events</p>
      ) : (
        events.map((event) => (
          <div
            key={event._id}
            className="group relative border border-amber-200 dark:border-gray-700 rounded-2xl p-6 bg-gradient-to-br from-white via-amber-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-md hover:shadow-xl transition duration-300"
          >
            <div className="absolute -top-4 -left-4 bg-amber-600 text-white px-3 py-1 text-xs font-semibold rounded-full shadow">
              {event.hobby}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {event.title}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              📍 <span className="font-medium">{event.address}</span>
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              ⏰ {new Date(event.time).toLocaleString()}
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              👥 {event.acceptedParticipants.length} / {event.maxParticipants} joined
            </p>

            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mt-2">
              Status:{" "}
              <span className="capitalize">{event.status.replace("_", " ")}</span>
            </p>

            {event.description && (
              <p className="text-sm mt-3 italic text-gray-500 dark:text-gray-300">
                {event.description}
              </p>
            )}

            {user && user.userId === event.creator && (
              <Button
                onClick={() => setEventToDelete(event._id)}
                className="mt-5 w-full bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-md"
              >
                Delete Event
              </Button>
            )}
          </div>
        ))
      )}
    </div>

    {/* DELETE DIALOG */}
    <AlertDialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
      <AlertDialogContent className="rounded-2xl border border-red-300 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-red-700">
            Delete this event?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-300">
            This action cannot be undone. Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-600 hover:bg-gray-500 text-white rounded-md">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-700 hover:bg-red-600 text-white rounded-md"
            onClick={handleDelete}
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
);
}
