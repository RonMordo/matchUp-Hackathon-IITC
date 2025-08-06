import { HydratedDocument, Model, Types } from "mongoose";

export interface IRequest {
  event: Types.ObjectId;
  from: Types.ObjectId;
  to: Types.ObjectId;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  message?: string;
  responseMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateRequestInput = Omit<IRequest, "createdAt" | "updatedAt">;

export type PatchRequestInput = Partial<CreateRequestInput>;

// Mongo
export type RequestDocument = HydratedDocument<IRequest>;

export interface IRequestModel extends Model<RequestDocument> {}
