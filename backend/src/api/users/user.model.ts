import { Schema, model } from "mongoose";
import { UserDocument, IUserModel } from "./user.types.js";
import { authService } from "../auth/auth.service.js";

const userSchema = new Schema<UserDocument, IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
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
    hobbies: [
      {
        type: [Schema.Types.ObjectId],
        ref: "Hobby",
        default: [],
      },
    ],
    availability: {
      type: [
        {
          day: {
            type: String,
            enum: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            required: true,
          },
          from: {
            type: String,
            required: true,
          },
          to: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    profilePicture: String,
    online: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await authService.hashPassword(this.password);
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as {
    password?: string;
    $set?: { password?: string };
  };

  const plainPassword = update?.password ?? update?.$set?.password;
  if (!plainPassword) return next();

  const hashed = await authService.hashPassword(plainPassword);

  if (update.password) update.password = hashed;
  if (update.$set?.password) update.$set.password = hashed;

  next();
});

userSchema.virtual("requestsSent", {
  ref: "Request",
  localField: "_id",
  foreignField: "from",
});

userSchema.virtual("requestsReceived", {
  ref: "Request",
  localField: "_id",
  foreignField: "to",
});

userSchema.virtual("ownEvents", {
  ref: "Event",
  localField: "_id",
  foreignField: "creator",
});

userSchema.virtual("participantEvents", {
  ref: "Event",
  localField: "_id",
  foreignField: "acceptedParticipants",
});

userSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "recipient",
});

userSchema.virtual("ratings", {
  ref: "Rating",
  localField: "_id",
  foreignField: "to",
});

userSchema.virtual("notifications", {
  ref: "Notification",
  localField: "_id",
  foreignField: "user",
});

export const UserModel = model<UserDocument, IUserModel>("User", userSchema);
