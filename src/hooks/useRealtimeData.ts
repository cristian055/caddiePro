import { useQueryClient } from '@tanstack/react-query';
import { useCaddies, caddiesQueryKeys } from './useCaddies';
import { useTurns, turnsQueryKeys } from './useTurns';
import { useListSettings, listSettingsQueryKeys } from './useListSettings';
import { caddiesApi, turnsApi, listSettingsApi } from '../services/api';
import type { Caddie, ListNumber } from '../types';

// Re-export POLLING_INTERVAL for convenience
export { POLLING_INTERVAL } from './useCaddies';

/**
 * Hook for real-time data on the main page.
 * Automatically polls all relevant data every 2 seconds.
 * Use this hook in CaddieTurns and other real-time components.
 */
export function useRealtimeData() {
  const caddies = useCaddies();
  const turns = useTurns();
  const listSettings = useListSettings();

  const isLoading = caddies.isLoading || turns.isLoading || listSettings.isLoading;
  const error = caddies.error || turns.error || listSettings.error;

  // Helper function to get caddies for a specific list (same logic as AppContext)
  const getListCaddies = (list: ListNumber): Caddie[] => {
    if (!caddies.data) return [];

    const settings = listSettings.data?.find(s => s.listNumber === list);
    let filtered = caddies.data.filter(c => c.listNumber === list && c.status !== 'Ausente');

    // Apply range filter
    if (settings?.rangeStart !== undefined && settings?.rangeEnd !== undefined) {
      const startIndex = settings.rangeStart - 1;
      const endIndex = settings.rangeEnd - 1;
      filtered = filtered.filter((_, index) => index >= startIndex && index <= endIndex);
    }

    // Apply order
    if (settings?.order === 'descendente') {
      filtered = [...filtered].reverse();
    }

    // Sort: Disponible first, then others
    return filtered.sort((a, b) => {
      if (a.status === 'Disponible' && b.status !== 'Disponible') return -1;
      if (a.status !== 'Disponible' && b.status === 'Disponible') return 1;
      return 0;
    });
  };

  return {
    caddies: caddies.data || [],
    turns: turns.data || [],
    listSettings: listSettings.data || [],
    getListCaddies,
    isLoading,
    error,
  };
}

/**
 * Hook to manually refresh all real-time data.
 * Use this after mutations to immediately update the UI.
 */
export function useRefreshRealtimeData() {
  const queryClient = useQueryClient();

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: caddiesQueryKeys.all }),
      queryClient.invalidateQueries({ queryKey: turnsQueryKeys.all }),
      queryClient.invalidateQueries({ queryKey: listSettingsQueryKeys.all }),
    ]);
  };

  return { refresh, isRefreshing: queryClient.isMutating() };
}

/**
 * Prefetch real-time data to warm the cache.
 * Call this in useEffect on page mount.
 */
export function usePrefetchRealtimeData() {
  const queryClient = useQueryClient();

  const prefetch = async () => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: caddiesQueryKeys.all,
        queryFn: caddiesApi.getAll,
      }),
      queryClient.prefetchQuery({
        queryKey: turnsQueryKeys.all,
        queryFn: turnsApi.getAll,
      }),
      queryClient.prefetchQuery({
        queryKey: listSettingsQueryKeys.all,
        queryFn: listSettingsApi.getAll,
      }),
    ]);
  };

  return prefetch;
}
