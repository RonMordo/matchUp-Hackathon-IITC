import axiosInstance from "@/utils/axiosInstance";
import type { Event, CreateEventDto } from "@/types/index";

export const EventService = {
  async getAllEvents(): Promise<Event[]> {
    return await axiosInstance.get("/events");
  },

  async getEventById(id: string): Promise<Event> {
    return await axiosInstance.get(`/events/${id}`);
  },

  async createEvent(data: CreateEventDto): Promise<Event> {
    return await axiosInstance.post("/events", data);
  },

  async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    return await axiosInstance.put(`/events/${id}`, data);
  },

  async patchEvent(id: string, data: Partial<Event>): Promise<Event> {
    return await axiosInstance.patch(`/events/${id}`, data);
  },

  async deleteEvent(id: string): Promise<{ message: string }> {
    return await axiosInstance.delete(`/events/${id}`);
  },
};
