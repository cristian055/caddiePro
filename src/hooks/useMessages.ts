import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { messagesApi } from '../services/api';
import type { Message, CreateMessageDto } from '../types';

// Query keys for React Query cache management
export const messagesQueryKeys = {
  all: ['messages'] as const,
  details: () => [...messagesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...messagesQueryKeys.details(), id] as const,
} as const;

// Get all messages
export function useMessages(options?: Omit<UseQueryOptions<Message[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: messagesQueryKeys.all,
    queryFn: messagesApi.getAll,
    ...options,
  });
}

// Create message mutation
export function useCreateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMessageDto) => messagesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesQueryKeys.all });
    },
  });
}

// Mark message as read mutation
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => messagesApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesQueryKeys.all });
    },
  });
}

// Delete message mutation
export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => messagesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesQueryKeys.all });
    },
  });
}
