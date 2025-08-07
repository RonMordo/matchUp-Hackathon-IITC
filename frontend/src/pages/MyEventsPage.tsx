import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { EventCard } from "@/components/EventCard";
import { useAuth } from "@/context/AuthContext";
import type { Hobby } from "../types"; 
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
  participants: { _id: string; name: string }[];
  pendingParticipants: string[];
  createdAt: string;
  updatedAt: string;
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

  const {
    data: events = [],
    isLoading,
    error,
  } = useUserEventsProtected();

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

    updateEvent({
      title: formState.title ?? selectedEvent.title,
      description: formState.description ?? selectedEvent.description,
      address: formState.address ?? selectedEvent.address,
      date: formState.date ?? selectedEvent.date,
      time: formState.time ?? selectedEvent.time,
      participantIds: [...(selectedEvent.participantIds ?? []), ...approved],
      pendingParticipants: updatedPending,
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
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">My Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {events.map((event: Event) => (
          <div key={event._id}>
            <EventCard
         event={event}
        userId={userId || ""}
        onEdit={() => handleEditClick(event)}
        onDelete={() => console.log("delete not implemented")}
        onJoin={() => {}}
        showJoinButton={false} // מפעיל/מכבה את כפתור Join
        />

          </div>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={formState.title || ""}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
              placeholder="Title"
            />
            <Input
              value={formState.description || ""}
              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
              placeholder="Description"
            />
            <Input
              value={formState.address || ""}
              onChange={(e) => setFormState({ ...formState, address: e.target.value })}
              placeholder="Address"
            />
            <Input
              type="date"
              value={formState.date || ""}
              onChange={(e) => setFormState({ ...formState, date: e.target.value })}
            />
            <Input
              type="time"
              value={formState.time || ""}
              onChange={(e) => setFormState({ ...formState, time: e.target.value })}
            />

            <div>
              <p className="text-lg font-medium mb-2">Pending Participants</p>
              {selectedEvent?.pendingParticipants?.length === 0 && (
                <p className="text-muted-foreground">No pending participants</p>
              )}

              {selectedEvent?.pendingParticipants?.map((uid) => (
                <div key={uid} className="flex items-center justify-between p-2 rounded border mb-2">
                  <span className="text-sm">{uid}</span>
                  <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-1">
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
                      />
                      <span className="text-xs">Approve</span>
                    </label>
                    <label className="flex items-center gap-1">
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
                      />
                      <span className="text-xs">Reject</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleSubmit} className="mt-4 w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
