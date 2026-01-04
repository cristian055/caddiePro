import { useQuery, useMutation, type UseQueryOptions } from '@tanstack/react-query';
import { reportsApi } from '../services/api';
import type { DailyReport, RangeReport } from '../types';

// Query keys for React Query cache management
export const reportsQueryKeys = {
  all: ['reports'] as const,
  daily: () => [...reportsQueryKeys.all, 'daily'] as const,
  dailyDate: (date: string) => [...reportsQueryKeys.daily(), date] as const,
  ranges: () => [...reportsQueryKeys.all, 'range'] as const,
  range: (startDate: string, endDate: string) =>
    [...reportsQueryKeys.ranges(), startDate, endDate] as const,
} as const;

// Get daily report
export function useDailyReport(
  date: string,
  options?: Omit<UseQueryOptions<DailyReport>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: reportsQueryKeys.dailyDate(date),
    queryFn: () => reportsApi.getDaily(date),
    enabled: !!date,
    ...options,
  });
}

// Get range report
export function useRangeReport(
  startDate: string,
  endDate: string,
  options?: Omit<UseQueryOptions<RangeReport>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: reportsQueryKeys.range(startDate, endDate),
    queryFn: () => reportsApi.getRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
    ...options,
  });
}

// Download CSV mutation
export function useDownloadCSV() {
  return useMutation({
    mutationFn: (date: string) => reportsApi.downloadCsv(date),
  });
}
