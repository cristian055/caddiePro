import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/api';

// Query keys for React Query cache management
export const authQueryKeys = {
  all: ['auth'] as const,
  verify: () => [...authQueryKeys.all, 'verify'] as const,
} as const;

// Verify authentication status
export function useAuth() {
  return useQuery({
    queryKey: authQueryKeys.verify(),
    queryFn: authApi.verify,
    retry: false, // Don't retry auth failures
    staleTime: 5 * 60 * 1000, // 5 minutes - auth status stays fresh
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (password: string) => authApi.login(password),
    onSuccess: () => {
      // Invalidate auth verification query
      queryClient.invalidateQueries({ queryKey: authQueryKeys.verify() });
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear all queries from cache
      queryClient.clear();
    },
  });
}
