import axiosInstance from "@/utils/axiosInstance";
import type {
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto,
} from "@/types/index";

export const NotificationService = {
  async getAllNotifications(): Promise<Notification[]> {
    return await axiosInstance.get("/notifications");
  },

  async getNotificationById(id: string): Promise<Notification> {
    return await axiosInstance.get(`/notifications/${id}`);
  },

  async createNotification(data: CreateNotificationDto): Promise<Notification> {
    return await axiosInstance.post("/notifications", data);
  },

  async updateNotification(
    id: string,
    data: UpdateNotificationDto
  ): Promise<Notification> {
    return await axiosInstance.put(`/notifications/${id}`, data);
  },

  async patchNotification(
    id: string,
    data: UpdateNotificationDto
  ): Promise<Notification> {
    return await axiosInstance.patch(`/notifications/${id}`, data);
  },

  async deleteNotification(id: string): Promise<{ message: string }> {
    return await axiosInstance.delete(`/notifications/${id}`);
  },
};
