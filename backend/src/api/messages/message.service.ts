import { AppError } from "../../utils/appError.js";
import { MessageModel } from "./message.model.js";
import { CreateMessageInput, PatchMessageInput } from "./message.types.js";

const getAllMessages = () => {
  return MessageModel.find().select("-__v");
};

const getMessageById = async (id: string) => {
  const message = await MessageModel.findById(id).select("-__v");
  if (!message) {
    throw new AppError(`Message with ID ${id} not found`, 404);
  }
  return message;
};

const createMessage = async (messageData: CreateMessageInput) => {
  const message = await MessageModel.create(messageData);
  return getMessageById(message._id.toString());
};

const updateMessage = async (id: string, messageData: CreateMessageInput) => {
  const updatedMessage = await MessageModel.findByIdAndUpdate(id, messageData, {
    runValidators: true,
    new: true,
  }).select("-__v");
  if (!updatedMessage) {
    throw new AppError(`Message with ID ${id} not found`, 404);
  }
  return updatedMessage;
};

const patchMessage = async (id: string, messageData: PatchMessageInput) => {
  const updatedMessage = await MessageModel.findByIdAndUpdate(id, messageData, {
    runValidators: true,
    new: true,
  }).select("-__v");

  if (!updatedMessage) {
    throw new AppError(`Message with ID: ${id} not found.`, 404);
  }
  return updatedMessage;
};

const deleteMessage = async (id: string) => {
  const deletedMessage = await MessageModel.findByIdAndDelete(id);
  if (!deletedMessage) {
    throw new AppError(`Message with ID: ${id} not found.`, 404);
  }
};

export const messageService = {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  patchMessage,
  deleteMessage,
};
