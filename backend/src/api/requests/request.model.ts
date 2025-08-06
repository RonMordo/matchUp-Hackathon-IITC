import { Schema, model } from "mongoose";
import { RequestDocument, IRequestModel } from "./request.types.js";

const requestSchema = new Schema<RequestDocument, IRequestModel>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      required: true,
    },
    message: String,
    responseMessage: String,
  },
  {
    timestamps: true,
  }
);

export const RequestModel = model<RequestDocument, IRequestModel>(
  "Request",
  requestSchema
);
