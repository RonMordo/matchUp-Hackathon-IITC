import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { EventCard } from "@/components/EventCard";
import { useAuth } from "@/context/AuthContext";
import type { Hobby, User } from "../types";
import { useUserEventsProtected } from "../hooks/user.hook";

type Event = {
  _id: string;
  title: string;
  description: string;
  location: { type: "Point"; coordinates: [number, number] };
  address: string;
  time: string;
  date?: string;
  hobby: Hobby;
  imageUrl: string;
  minParticipants: number;
  maxParticipants: number;
  creator: string;
  isPrivate: boolean;
  status: "open" | "closed";
  participantIds: string[];
  acceptedParticipants: string[];
  pendingParticipants: string[];
  createdAt: string;
  updatedAt: string;
  duration: number;
};

export function MyEventsPage() {
  const { user } = useAuth();
  const userId = user?._id;
  const queryClient = useQueryClient();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formState, setFormState] = useState<Partial<Event>>({});
  const [approved, setApproved] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [participantsInfo, setParticipantsInfo] = useState<Record<string, User>>({});

  const {
    data: events = [],
    isLoading,
    error,
  } = useUserEventsProtected();

  // Fetch participant info for accepted and pending participants
  useEffect(() => {
    async function fetchParticipantsInfo() {
      if (!events.length) return;
      // Collect all unique participant IDs from accepted and pending participants
      const allParticipantIds = events.flatMap(
        (e) => [...e.acceptedParticipants, ...e.pendingParticipants]
      );
      const uniqueIds = Array.from(new Set(allParticipantIds));
      if (uniqueIds.length === 0) return;

      try {
        const res = await fetch("/api/users/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: uniqueIds }),
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch participants info");
        const users: User[] = await res.json();
        const map = users.reduce((acc, user) => {
          acc[user._id] = user;
          return acc;
        }, {} as Record<string, User>);
        setParticipantsInfo(map);
      } catch {
        setParticipantsInfo({});
      }
    }
    fetchParticipantsInfo();
  }, [events]);

  const { mutate: updateEvent } = useMutation({
    mutationFn: async (updatedEvent: Partial<Event>) => {
      const res = await fetch(`/api/events/${selectedEvent?._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedEvent),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update event");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "events", "protected"] });
      setSelectedEvent(null);
      setIsEditDialogOpen(false);
      setApproved([]);
      setRejected([]);
    },
  });

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setFormState(event);
    setApproved([]);
    setRejected([]);
    setIsEditDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedEvent) return;

    const updatedPending = selectedEvent.pendingParticipants.filter(
      (uid) => !approved.includes(uid) && !rejected.includes(uid)
    );

    const updatedAccepted = [...selectedEvent.acceptedParticipants, ...approved];

    updateEvent({
      title: formState.title ?? selectedEvent.title,
      description: formState.description ?? selectedEvent.description,
      address: formState.address ?? selectedEvent.address,
      minParticipants: formState.minParticipants ?? selectedEvent.minParticipants,
      maxParticipants: formState.maxParticipants ?? selectedEvent.maxParticipants,
      status: formState.status ?? selectedEvent.status,
      isPrivate: formState.isPrivate ?? selectedEvent.isPrivate,
      participantIds: [...(selectedEvent.participantIds ?? []), ...approved],
      pendingParticipants: updatedPending,
      acceptedParticipants: updatedAccepted,
      duration: formState.duration ?? selectedEvent.duration,
    });
  };

  if (isLoading) return <p className="text-center mt-10">Loading events...</p>;
  if (error) {
    return (
      <p className="text-center text-red-500 mt-10">
        Error loading events: {(error as any)?.response?.data?.message || (error as any).message}
      </p>
    );
  }

  return (
  <div className="p-8 max-w-7xl mx-auto bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 min-h-screen">
    <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-900 drop-shadow-md">
      My Events
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event: Event) => (
        <EventCard
          key={event._id}
          event={event}
          userId={userId || ""}
          onEdit={() => handleEditClick(event)}
          onDelete={() => console.log("delete not implemented")}
          onJoin={() => {}}
          showJoinButton={false}
        />
      ))}
    </div>

    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-w-lg p-8 rounded-lg shadow-xl bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-700">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold mb-6 text-indigo-900 dark:text-indigo-300">
            Edit Event
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <Input
            value={formState.title ?? ""}
            onChange={(e) => setFormState({ ...formState, title: e.target.value })}
            placeholder="Title"
            className="w-full border-indigo-300 focus:ring-indigo-500"
          />
          <Input
            value={formState.description ?? ""}
            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
            placeholder="Description"
            className="w-full border-indigo-300 focus:ring-indigo-500"
          />
          <Input
            value={formState.address ?? ""}
            onChange={(e) => setFormState({ ...formState, address: e.target.value })}
            placeholder="Address"
            className="w-full border-indigo-300 focus:ring-indigo-500"
          />
          <div className="grid grid-cols-2 gap-6">
            <Input
              type="number"
              min={1}
              value={formState.minParticipants ?? ""}
              onChange={(e) => setFormState({ ...formState, minParticipants: Number(e.target.value) })}
              placeholder="Minimum Participants"
              className="border-indigo-300 focus:ring-indigo-500"
            />
            <Input
              type="number"
              min={1}
              value={formState.maxParticipants ?? ""}
              onChange={(e) => setFormState({ ...formState, maxParticipants: Number(e.target.value) })}
              placeholder="Maximum Participants"
              className="border-indigo-300 focus:ring-indigo-500"
            />
          </div>
          <select
            className="w-full rounded-md border border-indigo-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={formState.status ?? ""}
            onChange={(e) => setFormState({ ...formState, status: e.target.value as "open" | "closed" })}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>

          <label className="flex items-center gap-3">
            <Checkbox
              checked={formState.isPrivate ?? false}
              onCheckedChange={(checked) => setFormState({ ...formState, isPrivate: !!checked })}
              className="border-indigo-300 focus:ring-indigo-500"
            />
            <span className="text-indigo-700 dark:text-indigo-300 font-medium">Private Event</span>
          </label>

          <hr className="my-6 border-indigo-300" />

          <p className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 mb-3">Pending Participants</p>
          {selectedEvent?.pendingParticipants?.length === 0 && (
            <p className="text-gray-500 italic">No pending participants</p>
          )}

          {selectedEvent?.pendingParticipants?.map((uid) => (
            <div
              key={uid}
              className="flex items-center justify-between p-3 rounded-md border border-indigo-200 dark:border-indigo-700 mb-3 bg-indigo-50 dark:bg-indigo-900"
            >
              <span className="text-sm font-mono text-indigo-900 dark:text-indigo-300">
                {participantsInfo[uid]?.name || uid}
              </span>
              <div className="flex gap-6 items-center">
                <label className="flex items-center gap-2 cursor-pointer text-green-700 dark:text-green-400">
                  <Checkbox
                    checked={approved.includes(uid)}
                    onCheckedChange={(checked) => {
                      setApproved((prev) =>
                        checked ? [...prev, uid] : prev.filter((id) => id !== uid)
                      );
                      if (checked) {
                        setRejected((prev) => prev.filter((id) => id !== uid));
                      }
                    }}
                    className="border-green-700 dark:border-green-400 focus:ring-green-500"
                  />
                  <span className="text-xs font-semibold">Approve</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-red-700 dark:text-red-400">
                  <Checkbox
                    checked={rejected.includes(uid)}
                    onCheckedChange={(checked) => {
                      setRejected((prev) =>
                        checked ? [...prev, uid] : prev.filter((id) => id !== uid)
                      );
                      if (checked) {
                        setApproved((prev) => prev.filter((id) => id !== uid));
                      }
                    }}
                    className="border-red-700 dark:border-red-400 focus:ring-red-500"
                  />
                  <span className="text-xs font-semibold">Reject</span>
                </label>
              </div>
            </div>
          ))}

          <Button
            onClick={handleSubmit}
            className="mt-8 w-full font-semibold bg-indigo-700 hover:bg-indigo-800 text-white shadow-lg"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
);

}
