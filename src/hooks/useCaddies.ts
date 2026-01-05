import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { caddiesApi } from '../services/api';
import type { Caddie, CreateCaddieDto, UpdateCaddieDto } from '../types';

// Query keys for React Query cache management
export const caddiesQueryKeys = {
  all: ['caddies'] as const,
  lists: () => [...caddiesQueryKeys.all, 'list'] as const,
  list: (listNumber: number) => [...caddiesQueryKeys.lists(), listNumber] as const,
  details: () => [...caddiesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...caddiesQueryKeys.details(), id] as const,
} as const;

// Get all caddies
export function useCaddies(options?: Omit<UseQueryOptions<Caddie[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: caddiesQueryKeys.all,
    queryFn: caddiesApi.getAll,
    ...options,
  });
}

// Get caddie by ID
export function useCaddie(id: string, options?: Omit<UseQueryOptions<Caddie>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: caddiesQueryKeys.detail(id),
    queryFn: () => caddiesApi.getById(id),
    enabled: !!id, // Only fetch if ID exists
    ...options,
  });
}

// Get caddies by list number
export function useCaddiesByList(
  listNumber: number,
  options?: Omit<UseQueryOptions<Caddie[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: caddiesQueryKeys.list(listNumber),
    queryFn: () => caddiesApi.getByList(listNumber),
    ...options,
  });
}

// Create caddie mutation
export function useCreateCaddie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCaddieDto) => caddiesApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch all caddies queries
      queryClient.invalidateQueries({ queryKey: caddiesQueryKeys.all });
    },
  });
}

// Update caddie mutation
export function useUpdateCaddie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCaddieDto }) =>
      caddiesApi.update(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific caddie query and all caddies queries
      queryClient.invalidateQueries({ queryKey: caddiesQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: caddiesQueryKeys.all });
    },
  });
}

// Delete caddie mutation
export function useDeleteCaddie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => caddiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caddiesQueryKeys.all });
    },
  });
}
