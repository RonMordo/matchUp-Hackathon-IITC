import { AppError } from "../../utils/appError.js";
import { NotificationModel } from "./notification.model.js";
import {
  CreateNotificationInput,
  PatchNotificationInput,
} from "./notification.types.js";

const getAllNotifications = () => {
  return NotificationModel.find().select("-__v");
};

const getNotificationById = async (id: string) => {
  const notification = await NotificationModel.findById(id).select("-__v");
  if (!notification) {
    throw new AppError(`Notification with ID ${id} not found`, 404);
  }
  return notification;
};

const createNotification = async (
  notificationData: CreateNotificationInput
) => {
  const notification = await NotificationModel.create(notificationData);
  return getNotificationById(notification._id.toString());
};

const updateNotification = async (
  id: string,
  notificationData: CreateNotificationInput
) => {
  const updatedNotification = await NotificationModel.findByIdAndUpdate(
    id,
    notificationData,
    {
      runValidators: true,
      new: true,
    }
  ).select("-__v");
  if (!updatedNotification) {
    throw new AppError(`Notification with ID ${id} not found`, 404);
  }
  return updatedNotification;
};

const patchNotification = async (
  id: string,
  notificationData: PatchNotificationInput
) => {
  const updatedNotification = await NotificationModel.findByIdAndUpdate(
    id,
    notificationData,
    {
      runValidators: true,
      new: true,
    }
  ).select("-__v");

  if (!updatedNotification) {
    throw new AppError(`Notification with ID: ${id} not found.`, 404);
  }
  return updatedNotification;
};

const deleteNotification = async (id: string) => {
  const deletedNotification = await NotificationModel.findByIdAndDelete(id);
  if (!deletedNotification) {
    throw new AppError(`Notification with ID: ${id} not found.`, 404);
  }
};

export const notificationService = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  patchNotification,
  deleteNotification,
};
