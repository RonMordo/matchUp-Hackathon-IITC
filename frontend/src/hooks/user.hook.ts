import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services/user.service";
import type { User, UserResponse } from "@/types/index";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: UserService.getAllUsers,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => UserService.getUserById(id),
    enabled: !!id,
  });
};

export const useUserMessages = () => {
  return useQuery({
    queryKey: ["users", "messages"],
    queryFn: UserService.getAllMessages,
  });
};

export const useUserEventsProtected = () => {
  return useQuery({
    queryKey: ["users", "events", "protected"],
    queryFn: UserService.getAllEventsProtected,
  });
};

export const useUserEvents = (id: string) => {
  return useQuery({
    queryKey: ["users", id, "events"],
    queryFn: () => UserService.getAllEvents(id),
    enabled: !!id,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserService.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "messages"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserService.updateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", data._id] });
    },
  });
};

export const usePatchUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserService.patchUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", data._id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
