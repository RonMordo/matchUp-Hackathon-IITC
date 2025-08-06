import { HydratedDocument, Model, Types } from "mongoose";
import { Point } from "geojson";

export interface IEvent {
  title: string;
  description?: string;
  hobby: Types.ObjectId;
  creator: Types.ObjectId;
  location: Point;
  address: string;
  time: Date;
  duration: number;
  minParticipants: number;
  maxParticipants: number;
  acceptedParticipants: Types.ObjectId[];
  pendingParticipants: Types.ObjectId[];
  status: "open" | "private" | "cancelled" | "full";
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateEventInput = Omit<IEvent, "createdAt" | "updatedAt">;

export type PatchEventInput = Partial<CreateEventInput>;

// Mongo
export type EventDocument = HydratedDocument<IEvent>;

export interface IEventModel extends Model<EventDocument> {}
