import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RatingService } from "@/services/rating.service";
import type { Rating, CreateRatingDto, UpdateRatingDto } from "@/types/index";

export const useRatings = () => {
  return useQuery({
    queryKey: ["ratings"],
    queryFn: RatingService.getAllRatings,
  });
};

export const useRating = (id: string) => {
  return useQuery({
    queryKey: ["ratings", id],
    queryFn: () => RatingService.getRatingById(id),
    enabled: !!id,
  });
};

export const useCreateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: RatingService.createRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
    },
  });
};

export const useUpdateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRatingDto }) =>
      RatingService.updateRating(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
      queryClient.invalidateQueries({ queryKey: ["ratings", data._id] });
    },
  });
};

export const usePatchRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRatingDto }) =>
      RatingService.patchRating(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
      queryClient.invalidateQueries({ queryKey: ["ratings", data._id] });
    },
  });
};

export const useDeleteRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => RatingService.deleteRating(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
    },
  });
};
