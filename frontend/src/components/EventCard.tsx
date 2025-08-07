import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Info, ImageOff } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import type { Event } from "@/types";
import { useUpdateEvent, useDeleteEvent } from "../hooks/event.hook";

type Props = {
  event: Event;
  userId?: string;
  onEdit: () => void;
  onDelete: () => void;
  onJoin: () => void;
  showJoinButton?: boolean; // ברירת מחדל true
};

export function EventCard({ event, userId, onEdit, onDelete, onJoin, showJoinButton = true }: Props) {
  const [openDetails, setOpenDetails] = useState(false);

  const participantsCount = event.acceptedParticipants.length;
  const userJoined = userId ? event.acceptedParticipants.some((id) => id.toString() === userId.toString()) : false;

  const { mutate: updateEvent } = useUpdateEvent();
  const { mutate: deleteEvent } = useDeleteEvent();

  const handleJoinClick = () => {
    if (!userId) {
      alert("You must be logged in to join this event.");
      return;
    }
    if (!userJoined) {
      updateEvent({
        id: event._id,
        data: {
          acceptedParticipants: [...event.acceptedParticipants, userId],
        },
      });
      setOpenDetails(false);
      if (onJoin) onJoin();
    }
  };

  const hobbyName = event.hobby?.name || "Unknown Hobby";

  console.log(hobbyName);
  console.log("Event.hobby:", event.hobby);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-300 bg-white/60 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow">
      <div className="absolute top-3 left-3 bg-amber-600 text-white px-10 py-1 rounded-full text-xs font-semibold shadow-lg z-10">
        {hobbyName}
      </div>

      <div className="relative">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            loading="lazy"
            className="w-full h-56 object-cover rounded-t-2xl"
          />
        ) : (
          <div className="w-full h-56 bg-black flex items-center justify-center rounded-t-2xl">
            <div className="flex items-center gap-2 text-gray-400 select-none">
              <ImageOff className="w-6 h-6" />
              <span className="text-sm">No image</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pt-4 pb-5">
        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{event.title}</h3>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-400">📍 {event.address}</p>
        <p className="text-sm text-gray-700 dark:text-gray-400">⏰ {new Date(event.time).toLocaleString()}</p>
        <p className="text-sm text-gray-700 dark:text-gray-400">
          👥 {participantsCount} / {event.maxParticipants} joined
        </p>
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
          Status: <span className="capitalize">{event.status.replace("_", " ")}</span>
        </p>
        {event.description && (
          <p className="text-sm mt-3 italic text-gray-500 dark:text-gray-300">{event.description}</p>
        )}
      </div>

      <div className="absolute top-3 right-3 flex flex-col items-center gap-2 z-20">
        <Dialog open={openDetails} onOpenChange={setOpenDetails}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/90 hover:bg-white"
              aria-label="Event details"
            >
              <Info className="w-5 h-5 text-purple-900" />
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-xl bg-white dark:bg-gray-900">
            <div className="relative">
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-60 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-60 bg-gray-200 dark:bg-gray-800" />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-4 pt-10">
                <h2 className="text-2xl font-bold text-white">{event.title}</h2>
                <p className="mt-1 text-xs text-white/90">
                  📍 {event.address} • ⏰ {new Date(event.time).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6 text-gray-700 dark:text-gray-300">
                <section>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Description</h3>
                  <p className="mt-2 text-sm leading-6">{event.description || "No description provided."}</p>
                </section>

                <section>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Participants</h3>
                  <p className="mt-2 text-sm leading-6">
                    {participantsCount} out of {event.maxParticipants} joined
                  </p>
                </section>
              </div>

              <aside className="space-y-6 text-sm text-gray-700 dark:text-gray-300">
                <section>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Hobby</h3>
                  <p className="mt-2">{hobbyName}</p>
                </section>
                <section>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Status</h3>
                  <p className="mt-2 capitalize">{event.status}</p>
                </section>

                {showJoinButton && userId && !userJoined && (
                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white" onClick={handleJoinClick}>
                    Join Event
                  </Button>
                )}
                {showJoinButton && !userId && (
                  <Button
                    className="w-full mt-4 bg-gray-400 cursor-not-allowed text-white"
                    onClick={() => alert("You must be logged in to join this event.")}
                    disabled
                  >
                    Join Event
                  </Button>
                )}
                {showJoinButton && userId && userJoined && (
                  <div className="text-green-600 font-semibold mt-4 text-center">
                    You are registered for this event.
                  </div>
                )}
              </aside>
            </div>
          </DialogContent>
        </Dialog>

        {userId === event.creator && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="rounded-full bg-white/90 hover:bg-white"
              aria-label="Edit event"
            >
              <Pencil className="w-5 h-5 text-purple-900" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white/90 hover:bg-white"
                  aria-label="Delete event"
                >
                  <Trash2 className="w-5 h-5 text-purple-900" />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Event</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Are you sure you want to delete this event?
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-600 hover:bg-gray-500 text-white rounded-md px-4 py-2">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-700 hover:bg-red-600 text-white rounded-md px-4 py-2"
                    onClick={() => deleteEvent(event._id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
}
