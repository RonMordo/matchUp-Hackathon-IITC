import { HydratedDocument, Model } from "mongoose";

export interface IHobby {
  name: string;
  icon: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateHobbyInput = Omit<IHobby, "createdAt" | "updatedAt">;

export type PatchHobbyInput = Partial<CreateHobbyInput>;

// Mongo
export type HobbyDocument = HydratedDocument<IHobby>;

export interface IHobbyModel extends Model<HobbyDocument> {}
