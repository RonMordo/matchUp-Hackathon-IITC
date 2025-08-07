import { HydratedDocument, Model, Types } from "mongoose";

export interface INotification {
  recipient: Types.ObjectId;
  type: "message" | "request";
  from?: Types.ObjectId;
  event?: Types.ObjectId;
  message?: Types.ObjectId;
  request?: Types.ObjectId;
  status: "unread" | "raed" | "archived";
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateNotificationInput = Omit<
  INotification,
  "createdAt" | "updatedAt"
>;

export type PatchNotificationInput = Partial<CreateNotificationInput>;

// Mongo
export type NotificationDocument = HydratedDocument<INotification>;

export interface INotificationModel extends Model<NotificationDocument> {}
