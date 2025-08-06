// src/hooks/useHobbies.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HobbyService } from "@/services/hobbies.service";
import type { CreateHobbyDto } from "@/types/index";

export const useHobbies = () => {
  return useQuery({
    queryKey: ["hobbies"],
    queryFn: HobbyService.getAll,
  });
};

export const useHobby = (id: string) => {
  return useQuery({
    queryKey: ["hobbies", id],
    queryFn: () => HobbyService.getById(id),
    enabled: !!id,
  });
};

export const useCreateHobby = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: HobbyService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hobbies"] });
    },
  });
};

export const useUpdateHobby = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateHobbyDto }) => HobbyService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["hobbies"] });
      queryClient.invalidateQueries({ queryKey: ["hobbies", data._id] });
    },
  });
};

export const useDeleteHobby = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => HobbyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hobbies"] });
    },
  });
};
