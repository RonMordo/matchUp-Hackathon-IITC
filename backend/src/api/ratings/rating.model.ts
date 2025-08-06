import { Schema, model } from "mongoose";
import { RatingDocument, IRatingModel } from "./rating.types.js";

const ratingSchema = new Schema<RatingDocument, IRatingModel>(
  {
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
    score: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    comment: String,
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  },
  {
    timestamps: true,
  }
);

export const RatingModel = model<RatingDocument, IRatingModel>(
  "Rating",
  ratingSchema
);
