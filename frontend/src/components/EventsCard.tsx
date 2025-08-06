// EventCard.tsx (Updated version based on RecipeCard structure)

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Info } from "lucide-react";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  event: Event;
  userId?: string;
  onEdit: () => void;
  onDelete: () => void;
};

export function EventCard({ event, userId, onEdit, onDelete }: Props) {
  const [openDetails, setOpenDetails] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow">
      <div className="px-5 pt-4 pb-5">
        <h3 className="text-2xl font-extrabold text-gray-800 dark:text-white">
          {event.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          📍 {event.address}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ⏰ {new Date(event.time).toLocaleString()}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          👥 {event.acceptedParticipants.length} / {event.maxParticipants} joined
        </p>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-1">
        <Dialog open={openDetails} onOpenChange={setOpenDetails}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/90 hover:bg-white"
            >
              <Info className="w-5 h-5 text-purple-900" />
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{event.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Address:</strong> {event.address}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Time:</strong> {new Date(event.time).toLocaleString()}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Participants:</strong> {event.acceptedParticipants.length} / {event.maxParticipants}
              </p>
              {event.description && (
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Description:</strong> {event.description}
                </p>
              )}
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Hobby:</strong> {event.hobby}
              </p>
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
            >
              <Pencil className="w-5 h-5 text-purple-900" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white/90 hover:bg-white"
                >
                  <Trash2 className="w-5 h-5 text-purple-900" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Event</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Are you sure?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
}
