import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { turnsApi } from '../services/api';
import type { Turn, CreateTurnDto, UpdateTurnDto } from '../types';

// Polling interval for real-time updates (2 seconds for fast updates across devices)
export const POLLING_INTERVAL = 2000;

// Query keys for React Query cache management
export const turnsQueryKeys = {
  all: ['turns'] as const,
  lists: () => [...turnsQueryKeys.all, 'list'] as const,
  list: (listNumber: number) => [...turnsQueryKeys.lists(), listNumber] as const,
  details: () => [...turnsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...turnsQueryKeys.details(), id] as const,
  caddies: () => [...turnsQueryKeys.all, 'caddie'] as const,
  caddie: (caddieId: string) => [...turnsQueryKeys.caddies(), caddieId] as const,
  dates: () => [...turnsQueryKeys.all, 'date'] as const,
  date: (date: string) => [...turnsQueryKeys.dates(), date] as const,
} as const;

// Get all turns with real-time polling
export function useTurns(options?: Omit<UseQueryOptions<Turn[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: turnsQueryKeys.all,
    queryFn: turnsApi.getAll,
    refetchInterval: POLLING_INTERVAL, // Auto-refresh every 5 seconds
    ...options,
  });
}

// Get turn by ID
export function useTurn(id: string, options?: Omit<UseQueryOptions<Turn>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: turnsQueryKeys.detail(id),
    queryFn: () => turnsApi.getById(id),
    enabled: !!id,
    ...options,
  });
}

// Get turns by list number
export function useTurnsByList(
  listNumber: number,
  options?: Omit<UseQueryOptions<Turn[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: turnsQueryKeys.list(listNumber),
    queryFn: () => turnsApi.getByList(listNumber),
    ...options,
  });
}

// Get turns by caddie
export function useTurnsByCaddie(
  caddieId: string,
  options?: Omit<UseQueryOptions<Turn[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: turnsQueryKeys.caddie(caddieId),
    queryFn: () => turnsApi.getByCaddie(caddieId),
    enabled: !!caddieId,
    ...options,
  });
}

// Get turns by date
export function useTurnsByDate(
  date: string,
  options?: Omit<UseQueryOptions<Turn[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: turnsQueryKeys.date(date),
    queryFn: () => turnsApi.getByDate(date),
    enabled: !!date,
    ...options,
  });
}

// Create turn mutation
export function useCreateTurn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTurnDto) => turnsApi.create(data),
    onSuccess: (newTurn) => {
      // Invalidate and refetch all turns queries
      queryClient.invalidateQueries({ queryKey: turnsQueryKeys.all });
      // Also invalidate caddie-specific queries
      queryClient.invalidateQueries({ queryKey: turnsQueryKeys.caddie(newTurn.caddieId) });
      queryClient.invalidateQueries({ queryKey: turnsQueryKeys.list(newTurn.listNumber) });
    },
  });
}

// Update turn mutation
export function useUpdateTurn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTurnDto }) =>
      turnsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: turnsQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: turnsQueryKeys.all });
    },
  });
}
