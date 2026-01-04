import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { apiClient } from '../services/api';

// Global error handler for 401 unauthorized errors
function handleUnauthorizedError(error: unknown) {
  const apiError = error as { status?: number };
  if (apiError?.status === 401) {
    console.warn('[QueryClient] Unauthorized - clearing token and cache');
    // Clear token from localStorage and client
    apiClient.setToken(null);
    // Clear all queries
    queryClient.clear();
    // Redirect to login (you might want to use React Router here)
    window.location.href = '/login';
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds
      staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes - garbage collection time (was cacheTime)
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnReconnect: true, // Refetch when reconnecting to network
      retry: (failureCount, error) => {
        // Don't retry on 401, 403, 404 errors
        const apiError = error as { status?: number };
        if (apiError?.status === 401) {
          handleUnauthorizedError(error);
          return false;
        }
        if (apiError?.status === 403 || apiError?.status === 404) {
          return false;
        }
        // Retry up to 3 times
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff, max 30s
    },
    mutations: {
      retry: (failureCount, error) => {
        const apiError = error as { status?: number };
        if (apiError?.status === 401) {
          handleUnauthorizedError(error);
          return false;
        }
        // Retry once for other errors
        return failureCount < 1;
      },
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
