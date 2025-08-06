// src/services/event.service.ts
import axiosInstance from "@/utils/axiosInstance"; // adjust path if needed
import type { Event } from "@/types/index"; // define this type based on your schema

export const EventService = {
  // GET /api/events
  async getAllEvents(): Promise<Event[]> {
    return axiosInstance.get("/events");
  },

  // GET /api/events/:id
  async getEventById(id: string): Promise<Event> {
    return axiosInstance.get(`/events/${id}`);
  },

  // POST /api/events
  async createEvent(data: Partial<Event>): Promise<Event> {
    return axiosInstance.post("/events", data);
  },

  // PUT /api/events/:id
  async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    return axiosInstance.put(`/events/${id}`, data);
  },

  // PATCH /api/events/:id
  async patchEvent(id: string, data: Partial<Event>): Promise<Event> {
    return axiosInstance.patch(`/events/${id}`, data);
  },

  // DELETE /api/events/:id
  async deleteEvent(id: string): Promise<{ message: string }> {
    return axiosInstance.delete(`/events/${id}`);
  },
};
