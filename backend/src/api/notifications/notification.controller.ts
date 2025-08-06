import { notificationService } from "./notification.service.js";
import {
  CreateNotificationInput,
  PatchNotificationInput,
  INotification,
} from "./notification.types.js";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, IdParams } from "../../utils/globalTypes.js";

const getAllNotifications = async (
  _req: Request,
  res: Response<INotification[]>,
  next: NextFunction
) => {
  try {
    const notification = await notificationService.getAllNotifications();
    return res.status(200).json(notification);
  } catch (err) {
    return next(err);
  }
};

const getNotificationById = async (
  req: Request<IdParams>,
  res: Response<INotification>,
  next: NextFunction
) => {
  try {
    const notification = await notificationService.getNotificationById(
      req.params.id
    );
    return res.status(200).json(notification);
  } catch (err) {
    return next(err);
  }
};

const createNotification = async (
  req: AuthenticatedRequest<{}, {}, CreateNotificationInput>,
  res: Response<INotification>,
  next: NextFunction
) => {
  try {
    const newNotification = await notificationService.createNotification(
      req.body
    );
    const savedNotification = await notificationService.getNotificationById(
      newNotification._id.toString()
    );
    return res.status(201).json(savedNotification);
  } catch (err) {
    return next(err);
  }
};

const updateNotification = async (
  req: AuthenticatedRequest<IdParams, {}, CreateNotificationInput>,
  res: Response<INotification>,
  next: NextFunction
) => {
  try {
    const updatedNotification = await notificationService.updateNotification(
      req.params.id,
      req.body
    );
    return res.status(200).json(updatedNotification);
  } catch (err) {
    return next(err);
  }
};

const patchNotification = async (
  req: AuthenticatedRequest<IdParams, {}, PatchNotificationInput>,
  res: Response<INotification>,
  next: NextFunction
) => {
  try {
    const updatedNotification = await notificationService.patchNotification(
      req.params.id,
      req.body
    );
    return res.status(200).json(updatedNotification);
  } catch (err) {
    return next(err);
  }
};

const deleteNotification = async (
  req: AuthenticatedRequest<IdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    await notificationService.deleteNotification(req.params.id);
    return res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
};

export const notificationController = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  patchNotification,
  deleteNotification,
};
