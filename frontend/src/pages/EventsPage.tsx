import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import { EventCard } from "../components/EventCard";
import { CreateEventForm } from "../components/forms/CreateEventForm";
import { useEvents } from "@/hooks/event.hook";

export function EventsPage() {
  const { user } = useAuth();
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: events = [], isLoading, isError } = useEvents();

  const handleDelete = async () => {
    if (!user || !eventToDelete) return;
    try {
      setEventToDelete(null);
    } catch (err: any) {
      alert(`Error deleting event: ${err.message}`);
    }
  };

  const handleJoin = (eventId: string) => {
    if (!user) {
      alert("You must be logged in to join an event.");
      return;
    }
    alert(`Joining event ${eventId}`);
  };

  const userId = (user as any)?._id || "";

  return (
    <div className="max-w-7xl mx-auto py-16 px-8 bg-gradient-to-tr from-purple-50 via-indigo-100 to-pink-50 min-h-screen">
      <div className="flex justify-between items-center mb-16">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 drop-shadow-lg">
          🎉 Upcoming Events
        </h1>

        {user && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-pink-600 to-yellow-400 hover:from-pink-500 hover:to-yellow-300 text-white px-8 py-4 rounded-full shadow-xl flex items-center gap-4 font-semibold tracking-wide text-lg transition-transform transform hover:scale-110 active:scale-95"
                aria-label="Add new event"
              >
                <Plus className="w-6 h-6" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg rounded-3xl shadow-2xl border border-pink-300">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-pink-700">Add a New Event</DialogTitle>
              </DialogHeader>

              <CreateEventForm onClose={() => setIsCreateOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {isLoading && (
          <p className="text-center col-span-full text-xl font-medium text-indigo-600 animate-pulse">
            Loading events...
          </p>
        )}
        {isError && (
          <p className="text-center col-span-full text-xl font-semibold text-red-600">Failed to load events</p>
        )}
        {!isLoading &&
          !isError &&
          events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              userId={userId}
              onEdit={() => console.log("Edit event", event._id)}
              onDelete={() => setEventToDelete(event._id)}
              onJoin={() => handleJoin(event._id)}
            />
          ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
        <AlertDialogContent className="rounded-3xl border border-red-400 shadow-2xl bg-gradient-to-tr from-red-50 to-red-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-extrabold text-red-700">Delete this event?</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-red-600">
              This action cannot be undone. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex justify-end gap-4 p-6 border-t border-red-300">
            <button
              onClick={() => setEventToDelete(null)}
              className="bg-red-100 hover:bg-red-200 text-red-700 rounded-full px-6 py-2 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 font-semibold transition-colors"
            >
              Confirm Delete
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
