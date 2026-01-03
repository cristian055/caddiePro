export type ListNumber = 1 | 2 | 3;
export type CaddieStatus = 'Disponible' | 'En campo' | 'Ausente';
export type AttendanceStatus = 'Presente' | 'Llegó tarde' | 'No vino' | 'Permiso';

export interface Caddie {
  id: string;
  name: string;
  list: ListNumber;
  status: CaddieStatus;
  createdAt: string;
}

export interface Turn {
  id: string;
  caddieId: string;
  caddieName: string;
  listNumber: ListNumber;
  startTime: string;
  endTime?: string;
  completed: boolean;
}

export interface AttendanceRecord {
  id: string;
  caddieId: string;
  caddieName: string;
  listNumber: ListNumber;
  date: string;
  status: AttendanceStatus;
  callTime: string;
  arrivalTime?: string;
  turnsCount: number;
  endTime?: string;
}

export interface ListSettings {
  listNumber: ListNumber;
  callTime: string; // HH:mm format
}

export interface DailyReport {
  date: string;
  records: AttendanceRecord[];
}

export interface AppState {
  caddies: Caddie[];
  turns: Turn[];
  attendance: AttendanceRecord[];
  listSettings: ListSettings[];
  currentDate: string;
}
