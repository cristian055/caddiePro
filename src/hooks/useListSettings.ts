import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { listSettingsApi } from '../services/api';
import type { ListSettings, QueueItem, UpdateListSettingsDto } from '../types';

// Query keys for React Query cache management
export const listSettingsQueryKeys = {
  all: ['listSettings'] as const,
  details: () => [...listSettingsQueryKeys.all, 'detail'] as const,
  detail: (listNumber: number) => [...listSettingsQueryKeys.details(), listNumber] as const,
  queues: () => [...listSettingsQueryKeys.all, 'queue'] as const,
  queue: (listNumber: number) => [...listSettingsQueryKeys.queues(), listNumber] as const,
} as const;

// Get all list settings
export function useListSettings(options?: Omit<UseQueryOptions<ListSettings[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: listSettingsQueryKeys.all,
    queryFn: listSettingsApi.getAll,
    ...options,
  });
}

// Get list settings by list number
export function useListSettingsByList(
  listNumber: number,
  options?: Omit<UseQueryOptions<ListSettings>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: listSettingsQueryKeys.detail(listNumber),
    queryFn: () => listSettingsApi.getByList(listNumber),
    enabled: !!listNumber,
    ...options,
  });
}

// Get queue for a list
export function useQueue(
  listNumber: number,
  options?: Omit<UseQueryOptions<QueueItem[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: listSettingsQueryKeys.queue(listNumber),
    queryFn: () => listSettingsApi.getQueue(listNumber),
    enabled: !!listNumber,
    ...options,
  });
}

// Update list settings mutation
export function useUpdateListSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listNumber, data }: { listNumber: number; data: UpdateListSettingsDto }) =>
      listSettingsApi.update(listNumber, data),
    onSuccess: (_, { listNumber }) => {
      queryClient.invalidateQueries({ queryKey: listSettingsQueryKeys.detail(listNumber) });
      queryClient.invalidateQueries({ queryKey: listSettingsQueryKeys.all });
    },
  });
}

// Update list order mutation
export function useUpdateListOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listNumber, order }: { listNumber: number; order: 'ascendente' | 'descendente' }) =>
      listSettingsApi.updateOrder(listNumber, order),
    onSuccess: (_, { listNumber }) => {
      queryClient.invalidateQueries({ queryKey: listSettingsQueryKeys.detail(listNumber) });
      queryClient.invalidateQueries({ queryKey: listSettingsQueryKeys.queue(listNumber) });
      queryClient.invalidateQueries({ queryKey: listSettingsQueryKeys.all });
    },
  });
}

// Update list range mutation
export function useUpdateListRange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      listNumber,
      rangeStart,
      rangeEnd,
    }: {
      listNumber: number;
      rangeStart?: number;
      rangeEnd?: number;
    }) => listSettingsApi.updateRange(listNumber, rangeStart, rangeEnd),
    onSuccess: (_, { listNumber }) => {
      queryClient.invalidateQueries({ queryKey: listSettingsQueryKeys.detail(listNumber) });
      queryClient.invalidateQueries({ queryKey: listSettingsQueryKeys.queue(listNumber) });
      queryClient.invalidateQueries({ queryKey: listSettingsQueryKeys.all });
    },
  });
}
