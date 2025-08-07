import { UserModel } from "./user.model.js";
import { AppError } from "../../utils/appError.js";
import { CreateUserInput, PatchUserInput } from "./user.types.js";
import { EventModel } from "../events/event.model.js";
import { MessageModel } from "../messages/message.model.js";
import { CreateMessageInput } from "../messages/message.types.js";
import { messageService } from "../messages/message.service.js";
import { notificationService } from "../notifications/notification.service.js";
import { CreateNotificationInput } from "../notifications/notification.types.js";
import { Types } from "mongoose";
import { NotificationModel } from "../notifications/notification.model.js";

const getAllUsers = () => {
  return UserModel.find()
    .select("-password -__v")
    .populate({ path: "ownEvents", select: "-__v" })
    .populate({ path: "participantEvents", select: "-__v" })
    .populate({ path: "messages", select: "-__v" })
    .populate({ path: "notifications", select: "-__v" })
    .populate({ path: "ratings", select: "-__v" })
    .populate({ path: "requestsSent", select: "-__v" })
    .populate({ path: "requestsReceived", select: "-__v" });
};

const getUserById = async (id: string) => {
  const user = await UserModel.findById(id)
    .select("-password -__v")
    .populate({ path: "ownEvents", select: "-__v" })
    .populate({ path: "participantEvents", select: "-__v" })
    .populate({ path: "messages", select: "-__v" })
    .populate({ path: "notifications", select: "-__v" })
    .populate({ path: "ratings", select: "-__v" })
    .populate({ path: "requestsSent", select: "-__v" })
    .populate({ path: "requestsReceived", select: "-__v" });
  if (!user) {
    throw new AppError(`User with ID: ${id} not found.`, 404);
  }
  return user;
};

const getUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError("Invalid credentials.", 400);
  }
  return user;
};

const createUser = async (userData: CreateUserInput) => {
  const emailExists = await UserModel.findOne({ email: userData.email });
  if (emailExists) {
    throw new AppError("Email already in use.", 409);
  }
  const savedUser = await UserModel.create(userData);
  return getUserById(savedUser._id.toString());
};

const updateUser = async (id: string, userData: CreateUserInput) => {
  const updatedUser = await UserModel.findByIdAndUpdate(id, userData, {
    runValidators: true,
    new: true,
  })
    .select("-password -__v")
    .populate({ path: "ownEvents", select: "-__v" })
    .populate({ path: "participantEvents", select: "-__v" })
    .populate({ path: "messages", select: "-__v" })
    .populate({ path: "notifications", select: "-__v" })
    .populate({ path: "ratings", select: "-__v" })
    .populate({ path: "requestsSent", select: "-__v" })
    .populate({ path: "requestsReceived", select: "-__v" });
  if (!updatedUser) {
    throw new AppError("Invalid credentials.", 400);
  }
  return updatedUser;
};

const patchUser = async (id: string, userData: PatchUserInput) => {
  const updatedUser = await UserModel.findByIdAndUpdate(id, userData, {
    runValidators: true,
    new: true,
  })
    .select("-password -__v")
    .populate({ path: "ownEvents", select: "-__v" })
    .populate({ path: "participantEvents", select: "-__v" })
    .populate({ path: "messages", select: "-__v" })
    .populate({ path: "notifications", select: "-__v" })
    .populate({ path: "ratings", select: "-__v" })
    .populate({ path: "requestsSent", select: "-__v" })
    .populate({ path: "requestsReceived", select: "-__v" });
  if (!updatedUser) {
    throw new AppError(`User with ID: ${id} not found.`, 404);
  }
  return updatedUser;
};

const deleteUser = async (id: string) => {
  const deletedUser = await UserModel.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new AppError(`User with ID: ${id} not found.`, 404);
  }
};

const getAllEvents = (id: string) => {
  return EventModel.find({ creator: id })
    .select(
      "-pendingParticipants -acceptedParticipants -isPrivate -creator -minParticipants -maxParticipants -__v"
    )
    .populate("hobby");
};

const getAllEventsProtected = (id: string) => {
  return EventModel.find({ creator: id })
    .populate({ path: "pendingParticipants", select: "-password -__v" })
    .populate({ path: "acceptedParticipants", select: "-password -__v" });
};

const getAllMessages = (id: string) => {
  return MessageModel.find({ recipient: id }).populate({
    path: "event",
    select:
      "-pendingParticipants -acceptedParticipants -minParticipants -maxParticipants -__v",
  });
};

const sendMessage = async (
  senderId: string,
  messageData: CreateMessageInput
) => {
  const newMessage = await messageService.createMessage(messageData);
  const newNotification: CreateNotificationInput = {
    recipient: messageData.recipient,
    type: "message",
    from: new Types.ObjectId(senderId),
    event: messageData.event,
    message: newMessage._id,
    status: "unread",
    content: messageData.content,
  };
  return notificationService.createNotification(newNotification);
};

const getAllNotifications = (id: string) => {
  return NotificationModel.find({ recipient: id }).select("-__v");
};

export const userService = {
  getAllUsers,
  getUserById,
  getAllEvents,
  getAllEventsProtected,
  getAllMessages,
  getAllNotifications,
  createUser,
  getUserByEmail,
  updateUser,
  patchUser,
  deleteUser,
  sendMessage,
};
