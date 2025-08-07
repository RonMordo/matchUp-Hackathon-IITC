import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationService } from "@/services/notification.service";
import type { UpdateNotificationDto } from "@/types/index";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: NotificationService.getAllNotifications,
  });
};

export const useNotification = (id: string) => {
  return useQuery({
    queryKey: ["notifications", id],
    queryFn: () => NotificationService.getNotificationById(id),
    enabled: !!id,
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: NotificationService.createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNotificationDto }) =>
      NotificationService.updateNotification(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", data._id] });
    },
  });
};

export const usePatchNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNotificationDto }) =>
      NotificationService.patchNotification(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", data._id] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => NotificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
