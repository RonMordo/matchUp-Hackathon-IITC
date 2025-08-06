// src/types/event.ts
export interface Event {
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
  status: "open" | "closed" | "cancelled" | "full";
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}
