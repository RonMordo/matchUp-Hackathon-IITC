import axiosInstance from "@/utils/axiosInstance";
import type { Hobby, CreateHobbyDto } from "@/types/index";

export const HobbyService = {
  async getAll(): Promise<Hobby[]> {
    return await axiosInstance.get("/hobbies");
  },

  async getById(id: string): Promise<Hobby> {
    return await axiosInstance.get(`/hobbies/${id}`);
  },

  async create(data: CreateHobbyDto): Promise<Hobby> {
    return await axiosInstance.post("/hobbies", data);
  },

  async update(id: string, data: CreateHobbyDto): Promise<Hobby> {
    return await axiosInstance.put(`/hobbies/${id}`, data);
  },

  async patch(id: string, data: Partial<CreateHobbyDto>): Promise<Hobby> {
    return await axiosInstance.patch(`/hobbies/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/hobbies/${id}`);
  },
};
