import { Schema, model } from "mongoose";
import { HobbyDocument, IHobbyModel } from "./hobby.types.js";

const hobbySchema = new Schema<HobbyDocument, IHobbyModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    icon: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const HobbyModel = model<HobbyDocument, IHobbyModel>(
  "Hobby",
  hobbySchema
);
