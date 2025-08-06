import { AppError } from "../../utils/appError.js";
import { EventModel } from "./event.model.js";
import { CreateEventInput, PatchEventInput } from "./event.types.js";

const getAllEvents = () => {
  return EventModel.find().select("-__v");
};

const getEventById = async (id: string) => {
  const event = await EventModel.findById(id).select("-__v");
  if (!event) {
    throw new AppError(`Event with ID ${id} not found`, 404);
  }
  return event;
};

const createEvent = async (eventData: CreateEventInput) => {
  const event = await EventModel.create(eventData);
  return getEventById(event._id.toString());
};

const updateEvent = async (id: string, eventData: CreateEventInput) => {
  const updatedEvent = await EventModel.findByIdAndUpdate(id, eventData, {
    runValidators: true,
    new: true,
  }).select("-__v");
  if (!updatedEvent) {
    throw new AppError(`Event with ID ${id} not found`, 404);
  }
  return updatedEvent;
};

const patchEvent = async (id: string, eventData: PatchEventInput) => {
  const updatedEvent = await EventModel.findByIdAndUpdate(id, eventData, {
    runValidators: true,
    new: true,
  }).select("-__v");

  if (!updatedEvent) {
    throw new AppError(`Event with ID: ${id} not found.`, 404);
  }
  return updatedEvent;
};

const deleteEvent = async (id: string) => {
  const deletedEvent = await EventModel.findByIdAndDelete(id);
  if (!deletedEvent) {
    throw new AppError(`Event with ID: ${id} not found.`, 404);
  }
};

export const eventService = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  patchEvent,
  deleteEvent,
};
