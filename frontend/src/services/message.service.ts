import axiosInstance from "@/utils/axiosInstance";
import type {
  Message,
  CreateMessageDto,
  UpdateMessageDto,
} from "@/types/index";

export const MessageService = {
  async getAllMessages(): Promise<Message[]> {
    return await axiosInstance.get("/messages");
  },

  async getMessageById(id: string): Promise<Message> {
    return await axiosInstance.get(`/messages/${id}`);
  },

  async createMessage(data: CreateMessageDto): Promise<Message> {
    return await axiosInstance.post("/messages", data);
  },

  async updateMessage(id: string, data: UpdateMessageDto): Promise<Message> {
    return await axiosInstance.put(`/messages/${id}`, data);
  },

  async patchMessage(id: string, data: UpdateMessageDto): Promise<Message> {
    return await axiosInstance.patch(`/messages/${id}`, data);
  },

  async deleteMessage(id: string): Promise<{ message: string }> {
    return await axiosInstance.delete(`/messages/${id}`);
  },
};
