import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageService } from "@/services/message.service";
import type {
  Message,
  CreateMessageDto,
  UpdateMessageDto,
} from "@/types/index";

export const useMessages = () => {
  return useQuery({
    queryKey: ["messages"],
    queryFn: MessageService.getAllMessages,
  });
};

export const useMessage = (id: string) => {
  return useQuery({
    queryKey: ["messages", id],
    queryFn: () => MessageService.getMessageById(id),
    enabled: !!id,
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: MessageService.createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMessageDto }) =>
      MessageService.updateMessage(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["messages", data._id] });
    },
  });
};

export const usePatchMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMessageDto }) =>
      MessageService.patchMessage(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["messages", data._id] });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => MessageService.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};
