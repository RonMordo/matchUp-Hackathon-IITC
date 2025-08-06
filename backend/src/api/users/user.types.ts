import { Point } from "geojson";
import { HydratedDocument, Model, Types } from "mongoose";

export type AvailabilitySlot = {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  from: string;
  to: string;
};

export interface IUser {
  email: string;
  password: string;
  name: string;
  phone: string;
  location?: Point;
  hobbies?: Types.ObjectId[];
  availability?: AvailabilitySlot[];
  ownEvents?: Types.ObjectId[];
  participantEvents?: Types.ObjectId[];
  messages?: Types.ObjectId[];
  ratings?: Types.ObjectId[];
  profilePicture: string;
  notifications?: Types.ObjectId[];
  requestsSent?: Types.ObjectId[];
  requestsReceived?: Types.ObjectId[];
  online: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserInput = Pick<
  IUser,
  "email" | "password" | "name" | "phone"
>;

export type PatchUserInput = Partial<CreateUserInput>;

export type ResponseUser = Omit<IUser, "password">;

// Mongo
export type UserDocument = HydratedDocument<IUser>;

export interface IUserModel extends Model<UserDocument> {}
