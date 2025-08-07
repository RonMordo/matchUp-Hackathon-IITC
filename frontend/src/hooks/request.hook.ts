import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RequestService } from "@/services/request.service";
import type {
  Request,
  CreateRequestDto,
  UpdateRequestDto,
} from "@/types/index";

export const useRequests = () => {
  return useQuery({
    queryKey: ["requests"],
    queryFn: RequestService.getAllRequests,
  });
};

export const useRequest = (id: string) => {
  return useQuery({
    queryKey: ["requests", id],
    queryFn: () => RequestService.getRequestById(id),
    enabled: !!id,
  });
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: RequestService.createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};

export const useUpdateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRequestDto }) =>
      RequestService.updateRequest(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["requests", data._id] });
    },
  });
};

export const usePatchRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRequestDto }) =>
      RequestService.patchRequest(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["requests", data._id] });
    },
  });
};

export const useDeleteRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => RequestService.deleteRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};
