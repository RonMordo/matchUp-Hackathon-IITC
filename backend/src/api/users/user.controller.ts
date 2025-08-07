import { userService } from "./user.service.js";
import { CreateUserInput, PatchUserInput, ResponseUser } from "./user.types.js";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, IdParams } from "../../utils/globalTypes.js";
import { IEvent } from "../events/event.types.js";
import { CreateMessageInput, IMessage } from "../messages/message.types.js";
import { notificationService } from "../notifications/notification.service.js";
import { INotification } from "../notifications/notification.types.js";

const getAllUsers = async (
  _req: Request,
  res: Response<ResponseUser[]>,
  next: NextFunction
) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (
  req: Request<IdParams>,
  res: Response<ResponseUser>,
  next: NextFunction
) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

const getAllCreatorEvents = async (
  req: Request<IdParams>,
  res: Response<IEvent[]>,
  next: NextFunction
) => {
  try {
    const events = await userService.getAllCreatorEvents(req.params.id);
    return res.status(200).json(events);
  } catch (err) {
    return next(err);
  }
};

const getAllCreatorEventsProtected = async (
  req: AuthenticatedRequest,
  res: Response<IEvent[]>,
  next: NextFunction
) => {
  try {
    const events = await userService.getAllCreatorEventsProtected(req.user!.id);
    return res.status(200).json(events);
  } catch (err) {
    return next(err);
  }
};

const getAllEvents = async (
  req: AuthenticatedRequest,
  res: Response<IEvent[]>,
  next: NextFunction
) => {
  try {
    const events = await userService.getAllEvents(req.user!.id);
    return res.status(200).json(events);
  } catch (err) {
    return next(err);
  }
};

const getAllMessages = async (
  req: AuthenticatedRequest,
  res: Response<IMessage[]>,
  next: NextFunction
) => {
  try {
    const messages = await userService.getAllMessages(req.user!.id);
    return res.status(200).json(messages);
  } catch (err) {
    return next(err);
  }
};

const getAllNotifications = async (
  req: AuthenticatedRequest,
  res: Response<INotification[]>,
  next: NextFunction
) => {
  try {
    console.log(req.user!);

    const notifications = await userService.getAllNotifications(req.user!.id);
    return res.status(200).json(notifications);
  } catch (err) {
    return next(err);
  }
};

const updateUser = async (
  req: AuthenticatedRequest<{}, {}, CreateUserInput>,
  res: Response<ResponseUser>,
  next: NextFunction
) => {
  try {
    const updatedUser = await userService.updateUser(req.user!.id, req.body);
    return res.status(200).json(updatedUser);
  } catch (err) {
    return next(err);
  }
};

const patchUser = async (
  req: AuthenticatedRequest<{}, {}, PatchUserInput>,
  res: Response<ResponseUser>,
  next: NextFunction
) => {
  try {
    const updatedUser = await userService.patchUser(req.user!.id, req.body);
    return res.status(200).json(updatedUser);
  } catch (err) {
    return next(err);
  }
};

const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await userService.deleteUser(req.user!.id);
    return res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
};

const sendMessage = async (
  req: AuthenticatedRequest<{}, {}, CreateMessageInput>,
  res: Response<{ success: boolean }>,
  next: NextFunction
) => {
  try {
    await userService.sendMessage(req.user!.id, req.body);
    return res.status(201).json({ success: true });
  } catch (err) {
    return next(err);
  }
};

const toggleReadNotification = async (
  req: AuthenticatedRequest<IdParams>,
  res: Response<{ success: boolean }>,
  next: NextFunction
) => {
  try {
    await notificationService.toggleReadNotification(req.params.id);
    return res.status(201).json({ success: true });
  } catch (err) {
    return next(err);
  }
};

export const userController = {
  getAllUsers,
  getUserById,
  getAllEvents,
  getAllCreatorEventsProtected,
  getAllCreatorEvents,
  getAllMessages,
  getAllNotifications,
  updateUser,
  patchUser,
  deleteUser,
  sendMessage,
  toggleReadNotification,
};
