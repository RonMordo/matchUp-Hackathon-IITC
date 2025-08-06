import { eventService } from "./event.service.js";
import { CreateEventInput, PatchEventInput, IEvent } from "./event.types.js";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, IdParams } from "../../utils/globalTypes.js";

const getAllEvents = async (
  _req: Request,
  res: Response<IEvent[]>,
  next: NextFunction
) => {
  try {
    const events = await eventService.getAllEvents();
    return res.status(200).json(events);
  } catch (err) {
    return next(err);
  }
};

const getEventById = async (
  req: Request<IdParams>,
  res: Response<IEvent>,
  next: NextFunction
) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    return res.status(200).json(event);
  } catch (err) {
    return next(err);
  }
};

const createEvent = async (
  req: AuthenticatedRequest<{}, {}, CreateEventInput>,
  res: Response<IEvent>,
  next: NextFunction
) => {
  try {
    const newEvent = await eventService.createEvent(req.body);
    const savedEvent = await eventService.getEventById(newEvent._id.toString());
    return res.status(201).json(savedEvent);
  } catch (err) {
    return next(err);
  }
};

const updateEvent = async (
  req: AuthenticatedRequest<IdParams, {}, CreateEventInput>,
  res: Response<IEvent>,
  next: NextFunction
) => {
  try {
    const updatedEvent = await eventService.updateEvent(
      req.params.id,
      req.body
    );
    return res.status(200).json(updatedEvent);
  } catch (err) {
    return next(err);
  }
};

const patchEvent = async (
  req: AuthenticatedRequest<IdParams, {}, PatchEventInput>,
  res: Response<IEvent>,
  next: NextFunction
) => {
  try {
    const updatedEvent = await eventService.patchEvent(req.params.id, req.body);
    return res.status(200).json(updatedEvent);
  } catch (err) {
    return next(err);
  }
};

const deleteEvent = async (
  req: AuthenticatedRequest<IdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    await eventService.deleteEvent(req.params.id);
    return res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
};

export const requestController = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  patchEvent,
  deleteEvent,
};
