import { HydratedDocument, Model, Types } from "mongoose";

export interface IRating {
  from: Types.ObjectId;
  to: Types.ObjectId;
  score: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  event?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateRatingInput = Omit<IRating, "createdAt" | "updatedAt">;

export type PatchRatingInput = Partial<CreateRatingInput>;

// Mongo
export type RatingDocument = HydratedDocument<IRating>;

export interface IRatingModel extends Model<RatingDocument> {}
