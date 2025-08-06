import { HydratedDocument, Model, Types } from "mongoose";

export interface IMessage {
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  event: Types.ObjectId;
  subject: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateMessageInput = Omit<IMessage, "createdAt" | "updatedAt">;

export type PatchMessageInput = Partial<CreateMessageInput>;

// Mongo
export type MessageDocument = HydratedDocument<IMessage>;

export interface IMessageModel extends Model<MessageDocument> {}
