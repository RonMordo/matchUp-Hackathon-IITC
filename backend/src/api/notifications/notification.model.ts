import { Schema, model } from "mongoose";
import {
  NotificationDocument,
  INotificationModel,
} from "./notification.types.js";

const notificationSchema = new Schema<NotificationDocument, INotificationModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["message", "request"],
      required: true,
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    message: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    request: {
      type: Schema.Types.ObjectId,
      ref: "Request",
    },
    status: {
      type: String,
      enum: ["unread", "read", "archived"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const NotificationModel = model<
  NotificationDocument,
  INotificationModel
>("Notification", notificationSchema);
