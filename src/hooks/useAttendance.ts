import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { attendanceApi } from '../services/api';
import type { AttendanceRecord, CreateAttendanceDto, UpdateAttendanceDto } from '../types';

// Query keys for React Query cache management
export const attendanceQueryKeys = {
  all: ['attendance'] as const,
  lists: () => [...attendanceQueryKeys.all, 'list'] as const,
  list: (listNumber: number) => [...attendanceQueryKeys.lists(), listNumber] as const,
  details: () => [...attendanceQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...attendanceQueryKeys.details(), id] as const,
  caddies: () => [...attendanceQueryKeys.all, 'caddie'] as const,
  caddie: (caddieId: string) => [...attendanceQueryKeys.caddies(), caddieId] as const,
  dates: () => [...attendanceQueryKeys.all, 'date'] as const,
  date: (date: string) => [...attendanceQueryKeys.dates(), date] as const,
} as const;

// Get all attendance records
export function useAttendance(options?: Omit<UseQueryOptions<AttendanceRecord[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: attendanceQueryKeys.all,
    queryFn: attendanceApi.getAll,
    ...options,
  });
}

// Get attendance by list number
export function useAttendanceByList(
  listNumber: number,
  options?: Omit<UseQueryOptions<AttendanceRecord[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: attendanceQueryKeys.list(listNumber),
    queryFn: () => attendanceApi.getByList(listNumber),
    ...options,
  });
}

// Get attendance by caddie
export function useAttendanceByCaddie(
  caddieId: string,
  options?: Omit<UseQueryOptions<AttendanceRecord[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: attendanceQueryKeys.caddie(caddieId),
    queryFn: () => attendanceApi.getByCaddie(caddieId),
    enabled: !!caddieId,
    ...options,
  });
}

// Get attendance by date
export function useAttendanceByDate(
  date: string,
  options?: Omit<UseQueryOptions<AttendanceRecord[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: attendanceQueryKeys.date(date),
    queryFn: () => attendanceApi.getByDate(date),
    enabled: !!date,
    ...options,
  });
}

// Create attendance record mutation
export function useCreateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAttendanceDto) => attendanceApi.create(data),
    onSuccess: (newRecord) => {
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.caddie(newRecord.caddieId) });
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.list(newRecord.listNumber) });
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.date(newRecord.date) });
    },
  });
}

// Update attendance record mutation
export function useUpdateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAttendanceDto }) =>
      attendanceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.all });
    },
  });
}
