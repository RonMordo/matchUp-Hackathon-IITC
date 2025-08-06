import { Schema, model } from "mongoose";
import { EventDocument, IEventModel } from "./event.types.js";

const eventSchema = new Schema<EventDocument, IEventModel>(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    hobby: {
      type: Schema.Types.ObjectId,
      ref: "Hobby",
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    address: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    minParticipants: {
      type: Number,
      required: true,
    },
    maxParticipants: {
      type: Number,
      required: true,
    },
    acceptedParticipants: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: true,
      default: [],
    },
    pendingParticipants: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: true,
      default: [],
    },
    status: {
      type: String,
      enum: ["open", "closed", "cancelled", "full"],
      required: true,
    },
    isPrivate: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ creator: 1, time: 1 }, { unique: true });

export const EventModel = model<EventDocument, IEventModel>(
  "Event",
  eventSchema
);
