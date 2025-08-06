import { Schema, model } from "mongoose";
import { MessageDocument, IMessageModel } from "./message.types.js";

const messageSchema = new Schema<MessageDocument, IMessageModel>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    subject: {
      type: String,
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

export const MessageModel = model<MessageDocument, IMessageModel>(
  "Message",
  messageSchema
);
