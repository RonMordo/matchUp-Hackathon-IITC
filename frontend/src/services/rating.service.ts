import axiosInstance from "@/utils/axiosInstance";
import type { Rating, CreateRatingDto, UpdateRatingDto } from "@/types/index";

export const RatingService = {
  async getAllRatings(): Promise<Rating[]> {
    return await axiosInstance.get("/ratings");
  },

  async getRatingById(id: string): Promise<Rating> {
    return await axiosInstance.get(`/ratings/${id}`);
  },

  async createRating(data: CreateRatingDto): Promise<Rating> {
    return await axiosInstance.post("/ratings", data);
  },

  async updateRating(id: string, data: UpdateRatingDto): Promise<Rating> {
    return await axiosInstance.put(`/ratings/${id}`, data);
  },

  async patchRating(id: string, data: UpdateRatingDto): Promise<Rating> {
    return await axiosInstance.patch(`/ratings/${id}`, data);
  },

  async deleteRating(id: string): Promise<{ message: string }> {
    return await axiosInstance.delete(`/ratings/${id}`);
  },
};
