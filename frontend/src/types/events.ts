import type { Hobby } from "./hobbies";

export interface Event {
  _id: string;
  title: string;
  description?: string;
  hobby: Hobby;
  creator: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  address: string;
  time: Date | string;
  duration: number;
  minParticipants: number;
  maxParticipants: number;
  acceptedParticipants: string[];
  pendingParticipants: string[];
  status: "open" | "closed" | "cancelled" | "full";
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
}

export interface CreateEventDto {
  title: string;
  description?: string;
  hobby: string;
  creator: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  address: string;
  time: Date;
  duration: number; // Duration in minutes
  minParticipants: number;
  maxParticipants: number;
  status?: "open" | "closed" | "cancelled" | "full";
  isPrivate?: boolean;
}
