import axiosInstance from "@/utils/axiosInstance";
import type { User, UserResponse } from "@/types/index";

export const UserService = {
  async getAllUsers(): Promise<UserResponse[]> {
    return await axiosInstance.get("/users");
  },

  async getUserById(id: string): Promise<UserResponse> {
    return await axiosInstance.get(`/users/${id}`);
  },

  async getAllMessages(): Promise<any[]> {
    return await axiosInstance.get("/users/messages");
  },

  async getAllEventsProtected(): Promise<any[]> {
    return await axiosInstance.get("/users/events");
  },

  async getAllEvents(id: string): Promise<any[]> {
    return await axiosInstance.get(`/users/${id}/events`);
  },
async getUserParticipatedEvents(): Promise<any[]> {
  return await axiosInstance.get("/users/events/participent");
},
  async sendMessage(data: any): Promise<any> {
    return await axiosInstance.post("/users/messages", data);
  },

  async updateUser(data: Partial<User>): Promise<UserResponse> {
    return await axiosInstance.put("/users", data);
  },

  async patchUser(data: Partial<User>): Promise<UserResponse> {
    return await axiosInstance.patch("/users", data);
  },

  async deleteUser(): Promise<{ message: string }> {
    return await axiosInstance.delete("/users");
  },

  async getUserNotifications(): Promise<any[]> {
    return await axiosInstance.get("/users/notifications");
  },

  async toggleReadNotification(id: string): Promise<{ success: boolean }> {
    return await axiosInstance.patch(`/users/notifications/${id}`);
  },
};
