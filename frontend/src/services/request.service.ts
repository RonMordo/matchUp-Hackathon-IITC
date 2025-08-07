import axiosInstance from "@/utils/axiosInstance";
import type {
  Request,
  CreateRequestDto,
  UpdateRequestDto,
} from "@/types/index";

export const RequestService = {
  async getAllRequests(): Promise<Request[]> {
    return await axiosInstance.get("/requests");
  },

  async getRequestById(id: string): Promise<Request> {
    return await axiosInstance.get(`/requests/${id}`);
  },

  async createRequest(data: CreateRequestDto): Promise<Request> {
    return await axiosInstance.post("/requests", data);
  },

  async updateRequest(id: string, data: UpdateRequestDto): Promise<Request> {
    return await axiosInstance.put(`/requests/${id}`, data);
  },

  async patchRequest(id: string, data: UpdateRequestDto): Promise<Request> {
    return await axiosInstance.patch(`/requests/${id}`, data);
  },

  async deleteRequest(id: string): Promise<{ message: string }> {
    return await axiosInstance.delete(`/requests/${id}`);
  },
};
