export type ListNumber = 1 | 2 | 3;
export type CaddieStatus = 'Disponible' | 'En campo' | 'Ausente';
export type AttendanceStatus = 'Presente' | 'Llegó tarde' | 'No vino' | 'Permiso';
export type ListOrder = 'ascendente' | 'descendente';

export interface Caddie {
  id: string;
  name: string;
  listNumber: number;
  status: CaddieStatus;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Turn {
  id: string;
  caddieId: string;
  caddieName: string;
  listNumber: number;
  startTime: string;
  endTime: string | null;
  completed: boolean;
}

export interface AttendanceRecord {
  id: string;
  caddieId: string;
  caddieName: string;
  listNumber: number;
  date: string;
  status: AttendanceStatus;
  callTime: string;
  arrivalTime: string | null;
  turnsCount: number;
  endTime: string | null;
  createdAt: string;
}

export interface ListSettings {
  listNumber: number;
  callTime: string; // HH:mm format
  order: ListOrder;
  rangeStart?: number;
  rangeEnd?: number;
  createdAt: string;
  updatedAt: string;
}

export interface QueueItem {
  id: string;
  position: number;
  listNumber: number;
  available: boolean;
  caddie: {
    id: string;
    name: string;
    status: CaddieStatus;
  };
}

export interface Message {
  id: string;
  content: string;
  targetList: number | null;
  createdAt: string;
  read: boolean;
}

export interface DailyReport {
  date: string;
  records: Array<{
    id: string;
    caddieName: string;
    listNumber: number;
    date: string;
    status: AttendanceStatus;
    turnsCount: number;
  }>;
  summary: {
    totalCaddies: number;
    present: number;
    late: number;
    absent: number;
    permission: number;
    totalTurns: number;
  };
}

export interface AppState {
  caddies: Caddie[];
  turns: Turn[];
  attendance: AttendanceRecord[];
  listSettings: ListSettings[];
  currentDate: string;
}

