// types/user.ts
export type AvailabilitySlot = {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  from: string;
  to: string;
};

export type User = {
  _id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  hobbies: string[];
  availability: AvailabilitySlot[];
  profilePicture?: string;
  online: boolean;
  createdAt: string;
  updatedAt: string;
  requestsSent?: string[];
  requestsReceived?: string[];
  ownEvents?: string[];
  participantEvents?: string[];
  messages?: string[];
  ratings?: string[];
  notifications?: string[];
};

export type UserResponse = Omit<User, "password">;
