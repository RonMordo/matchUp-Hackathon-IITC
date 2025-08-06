import { messageService } from "./message.service.js";
import {
  CreateMessageInput,
  PatchMessageInput,
  IMessage,
} from "./message.types.js";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, IdParams } from "../../utils/globalTypes.js";

const getAllMessages = async (
  _req: Request,
  res: Response<IMessage[]>,
  next: NextFunction
) => {
  try {
    const messages = await messageService.getAllMessages();
    return res.status(200).json(messages);
  } catch (err) {
    return next(err);
  }
};

const getMessageById = async (
  req: Request<IdParams>,
  res: Response<IMessage>,
  next: NextFunction
) => {
  try {
    const message = await messageService.getMessageById(req.params.id);
    return res.status(200).json(message);
  } catch (err) {
    return next(err);
  }
};

const createMessage = async (
  req: AuthenticatedRequest<{}, {}, CreateMessageInput>,
  res: Response<IMessage>,
  next: NextFunction
) => {
  try {
    const newMessage = await messageService.createMessage(req.body);
    const savedMessage = await messageService.getMessageById(
      newMessage._id.toString()
    );
    return res.status(201).json(savedMessage);
  } catch (err) {
    return next(err);
  }
};

const updateMessage = async (
  req: AuthenticatedRequest<IdParams, {}, CreateMessageInput>,
  res: Response<IMessage>,
  next: NextFunction
) => {
  try {
    const updatedMessage = await messageService.updateMessage(
      req.params.id,
      req.body
    );
    return res.status(200).json(updatedMessage);
  } catch (err) {
    return next(err);
  }
};

const patchMessage = async (
  req: AuthenticatedRequest<IdParams, {}, PatchMessageInput>,
  res: Response<IMessage>,
  next: NextFunction
) => {
  try {
    const updatedMessage = await messageService.patchMessage(
      req.params.id,
      req.body
    );
    return res.status(200).json(updatedMessage);
  } catch (err) {
    return next(err);
  }
};

const deleteMessage = async (
  req: AuthenticatedRequest<IdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    await messageService.deleteMessage(req.params.id);
    return res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
};

export const messageController = {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  patchMessage,
  deleteMessage,
};
