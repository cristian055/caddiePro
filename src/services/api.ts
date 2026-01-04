import type {
  Caddie,
  Turn,
  AttendanceRecord,
  ListSettings,
  QueueItem,
  DailyReport,
  RangeReport,
  Message,
  CreateCaddieDto,
  UpdateCaddieDto,
  CreateTurnDto,
  UpdateTurnDto,
  CreateAttendanceDto,
  UpdateAttendanceDto,
  UpdateListSettingsDto,
  CreateMessageDto,
  LoginResponse,
  VerifyResponse,
  LogoutResponse,
  WhatsAppUrlResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const TOKEN_KEY = 'caddiePro_token';

// API Error class for better error handling
export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem(TOKEN_KEY);
  }

  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth = false
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.getHeaders(requireAuth);

    console.log(`[API] ${options.method || 'GET'} ${url}`, requireAuth ? '(auth)' : '');

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = typeof errorData === 'object' && 'error' in errorData
        ? String(errorData.error)
        : `HTTP error! status: ${response.status}`;
      console.error(`[API] Error ${response.status}:`, errorMessage);
      throw new ApiError(errorMessage, response.status, errorData);
    }

    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    console.log(`[API] Response:`, data);
    return data;
  }

  async get<T>(endpoint: string, requireAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, requireAuth);
  }

  async post<T>(endpoint: string, data: unknown, requireAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, requireAuth);
  }

  async put<T>(endpoint: string, data: unknown, requireAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, requireAuth);
  }

  async delete<T>(endpoint: string, requireAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, requireAuth);
  }

  // Special method for file downloads (CSV, etc.)
  async downloadFile(endpoint: string, filename: string): Promise<void> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.getHeaders(true); // Always require auth for downloads

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new ApiError(`Failed to download ${filename}`, response.status);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
  }
}

export const apiClient = new ApiClient();

export const authApi = {
  login: async (password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', { password });
    apiClient.setToken(response.token);
    return response;
  },

  verify: async (): Promise<VerifyResponse> => {
    return apiClient.get<VerifyResponse>('/auth/verify', true);
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await apiClient.post<LogoutResponse>('/auth/logout', {}, true);
    apiClient.setToken(null);
    return response;
  },
};

export const caddiesApi = {
  getAll: async (): Promise<Caddie[]> => {
    return apiClient.get<Caddie[]>('/caddies', true);
  },

  getById: async (id: string): Promise<Caddie> => {
    return apiClient.get<Caddie>(`/caddies/${id}`, true);
  },

  getByList: async (listNumber: number): Promise<Caddie[]> => {
    return apiClient.get<Caddie[]>(`/caddies/list/${listNumber}`, true);
  },

  create: async (data: CreateCaddieDto): Promise<Caddie> => {
    return apiClient.post<Caddie>('/caddies', data, true);
  },

  update: async (id: string, data: UpdateCaddieDto): Promise<Caddie> => {
    return apiClient.put<Caddie>(`/caddies/${id}`, data, true);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/caddies/${id}`, true);
  },
};

export const turnsApi = {
  getAll: async (): Promise<Turn[]> => {
    return apiClient.get<Turn[]>('/turns', true);
  },

  getById: async (id: string): Promise<Turn> => {
    return apiClient.get<Turn>(`/turns/${id}`, true);
  },

  getByCaddie: async (caddieId: string): Promise<Turn[]> => {
    return apiClient.get<Turn[]>(`/turns/caddie/${caddieId}`, true);
  },

  getByList: async (listNumber: number): Promise<Turn[]> => {
    return apiClient.get<Turn[]>(`/turns/list/${listNumber}`, true);
  },

  getByDate: async (date: string): Promise<Turn[]> => {
    return apiClient.get<Turn[]>(`/turns/date/${date}`, true);
  },

  create: async (data: CreateTurnDto): Promise<Turn> => {
    return apiClient.post<Turn>('/turns', data, true);
  },

  update: async (id: string, data: UpdateTurnDto): Promise<Turn> => {
    return apiClient.put<Turn>(`/turns/${id}`, data, true);
  },
};

export const attendanceApi = {
  getAll: async (): Promise<AttendanceRecord[]> => {
    return apiClient.get<AttendanceRecord[]>('/attendance', true);
  },

  getByCaddie: async (caddieId: string): Promise<AttendanceRecord[]> => {
    return apiClient.get<AttendanceRecord[]>(`/attendance/caddie/${caddieId}`, true);
  },

  getByList: async (listNumber: number): Promise<AttendanceRecord[]> => {
    return apiClient.get<AttendanceRecord[]>(`/attendance/list/${listNumber}`, true);
  },

  getByDate: async (date: string): Promise<AttendanceRecord[]> => {
    return apiClient.get<AttendanceRecord[]>(`/attendance/date/${date}`, true);
  },

  create: async (data: CreateAttendanceDto): Promise<AttendanceRecord> => {
    return apiClient.post<AttendanceRecord>('/attendance', data, true);
  },

  update: async (id: string, data: UpdateAttendanceDto): Promise<AttendanceRecord> => {
    return apiClient.put<AttendanceRecord>(`/attendance/${id}`, data, true);
  },
};

export const listSettingsApi = {
  getAll: async (): Promise<ListSettings[]> => {
    return apiClient.get<ListSettings[]>('/list-settings', true);
  },

  getByList: async (listNumber: number): Promise<ListSettings> => {
    return apiClient.get<ListSettings>(`/list-settings/${listNumber}`, true);
  },

  getQueue: async (listNumber: number): Promise<QueueItem[]> => {
    return apiClient.get<QueueItem[]>(`/list-settings/${listNumber}/queue`, true);
  },

  update: async (listNumber: number, data: UpdateListSettingsDto): Promise<ListSettings> => {
    return apiClient.put<ListSettings>(`/list-settings/${listNumber}`, data, true);
  },

  updateOrder: async (listNumber: number, order: 'ascendente' | 'descendente'): Promise<ListSettings> => {
    return apiClient.put<ListSettings>(`/list-settings/${listNumber}/order`, { order }, true);
  },

  updateRange: async (listNumber: number, rangeStart?: number, rangeEnd?: number): Promise<ListSettings> => {
    return apiClient.put<ListSettings>(`/list-settings/${listNumber}/range`, { rangeStart, rangeEnd }, true);
  },
};

export const reportsApi = {
  getDaily: async (date: string): Promise<DailyReport> => {
    return apiClient.get<DailyReport>(`/reports/daily/${date}`, true);
  },

  getRange: async (startDate: string, endDate: string): Promise<RangeReport> => {
    return apiClient.get<RangeReport>(`/reports/range/${startDate}/${endDate}`, true);
  },

  downloadCsv: async (date: string): Promise<void> => {
    await apiClient.downloadFile(`/reports/csv/${date}`, `reporte_${date}.csv`);
  },
};

export const messagesApi = {
  getAll: async (): Promise<Message[]> => {
    return apiClient.get<Message[]>('/messages', true);
  },

  create: async (data: CreateMessageDto): Promise<Message> => {
    return apiClient.post<Message>('/messages', data, true);
  },

  markAsRead: async (id: string): Promise<{ id: string; read: boolean }> => {
    return apiClient.put<{ id: string; read: boolean }>(`/messages/${id}/read`, {}, true);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/messages/${id}`, true);
  },

  getWhatsAppUrl: async (id: string): Promise<WhatsAppUrlResponse> => {
    return apiClient.get<WhatsAppUrlResponse>(`/messages/${id}/whatsapp`, true);
  },
};
