const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const TOKEN_KEY = 'caddiePro_token';

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

  setToken(token: string | null) {
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
      const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
      console.error(`[API] Error ${response.status}:`, errorMessage);
      throw new Error(errorMessage);
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

  async post<T>(endpoint: string, data: any, requireAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, requireAuth);
  }

  async put<T>(endpoint: string, data: any, requireAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, requireAuth);
  }

  async delete<T>(endpoint: string, requireAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, requireAuth);
  }
}

const apiClient = new ApiClient();

interface LoginResponse {
  token: string;
  admin: boolean;
}

interface VerifyResponse {
  valid: boolean;
  user: {
    adminId: string;
  };
}

interface LogoutResponse {
  message: string;
}

interface Caddie {
  id: string;
  name: string;
  listNumber: number;
  status: 'Disponible' | 'En campo' | 'Ausente';
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateCaddieDto {
  name: string;
  listNumber: number;
  phoneNumber?: string;
  status?: 'Disponible' | 'En campo' | 'Ausente';
}

interface UpdateCaddieDto {
  name?: string;
  listNumber?: number;
  status?: 'Disponible' | 'En campo' | 'Ausente';
}

interface Turn {
  id: string;
  caddieId: string;
  caddieName: string;
  listNumber: number;
  startTime: string;
  endTime: string | null;
  completed: boolean;
}

interface CreateTurnDto {
  caddieId: string;
  caddieName: string;
  listNumber: number;
}

interface UpdateTurnDto {
  endTime?: string;
  completed?: boolean;
}

interface AttendanceRecord {
  id: string;
  caddieId: string;
  caddieName: string;
  listNumber: number;
  date: string;
  status: 'Presente' | 'Llegó tarde' | 'No vino' | 'Permiso';
  callTime: string;
  arrivalTime: string | null;
  turnsCount: number;
  endTime: string | null;
  createdAt: string;
}

interface CreateAttendanceDto {
  caddieId: string;
  caddieName: string;
  listNumber: number;
  date: string;
  status: 'Presente' | 'Llegó tarde' | 'No vino' | 'Permiso';
}

interface UpdateAttendanceDto {
  status?: 'Presente' | 'Llegó tarde' | 'No vino' | 'Permiso';
  arrivalTime?: string;
  turnsCount?: number;
  endTime?: string;
}

interface ListSettings {
  listNumber: number;
  callTime: string;
  order: 'ascendente' | 'descendente';
  rangeStart?: number;
  rangeEnd?: number;
  createdAt: string;
  updatedAt: string;
}

interface UpdateListSettingsDto {
  callTime?: string;
  order?: 'ascendente' | 'descendente';
  rangeStart?: number;
  rangeEnd?: number;
}

interface QueueItem {
  id: string;
  position: number;
  listNumber: number;
  available: boolean;
  caddie: {
    id: string;
    name: string;
    status: 'Disponible' | 'En campo' | 'Ausente';
  };
}

interface DailyReport {
  date: string;
  records: Array<{
    id: string;
    caddieName: string;
    listNumber: number;
    date: string;
    status: 'Presente' | 'Llegó tarde' | 'No vino' | 'Permiso';
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

interface Message {
  id: string;
  content: string;
  targetList: number | null;
  createdAt: string;
  read: boolean;
}

interface CreateMessageDto {
  content: string;
  targetList?: number | null;
}

interface WhatsAppUrlResponse {
  whatsappUrl: string;
}

export const authApi = {
  login: async (password: string): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', { password });
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
    return apiClient.get<Caddie[]>('/caddies');
  },

  getById: async (id: string): Promise<Caddie> => {
    return apiClient.get<Caddie>(`/caddies/${id}`);
  },

  getByList: async (listNumber: number): Promise<Caddie[]> => {
    return apiClient.get<Caddie[]>(`/caddies/list/${listNumber}`);
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
    return apiClient.get<Turn[]>('/turns');
  },

  getById: async (id: string): Promise<Turn> => {
    return apiClient.get<Turn>(`/turns/${id}`);
  },

  getByCaddie: async (caddieId: string): Promise<Turn[]> => {
    return apiClient.get<Turn[]>(`/turns/caddie/${caddieId}`);
  },

  getByList: async (listNumber: number): Promise<Turn[]> => {
    return apiClient.get<Turn[]>(`/turns/list/${listNumber}`);
  },

  getByDate: async (date: string): Promise<Turn[]> => {
    return apiClient.get<Turn[]>(`/turns/date/${date}`);
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
    return apiClient.get<AttendanceRecord[]>('/attendance');
  },

  getByCaddie: async (caddieId: string): Promise<AttendanceRecord[]> => {
    return apiClient.get<AttendanceRecord[]>(`/attendance/caddie/${caddieId}`);
  },

  getByList: async (listNumber: number): Promise<AttendanceRecord[]> => {
    return apiClient.get<AttendanceRecord[]>(`/attendance/list/${listNumber}`);
  },

  getByDate: async (date: string): Promise<AttendanceRecord[]> => {
    return apiClient.get<AttendanceRecord[]>(`/attendance/date/${date}`);
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
    return apiClient.get<ListSettings[]>('/list-settings');
  },

  getByList: async (listNumber: number): Promise<ListSettings> => {
    return apiClient.get<ListSettings>(`/list-settings/${listNumber}`);
  },

  getQueue: async (listNumber: number): Promise<QueueItem[]> => {
    return apiClient.get<QueueItem[]>(`/list-settings/${listNumber}/queue`);
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
    return apiClient.get<DailyReport>(`/reports/daily/${date}`);
  },

  getRange: async (startDate: string, endDate: string): Promise<any> => {
    return apiClient.get<any>(`/reports/range/${startDate}/${endDate}`);
  },

  downloadCsv: async (date: string): Promise<void> => {
    const url = `${API_BASE_URL}/reports/csv/${date}`;
    const token = apiClient.getToken();
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download CSV');
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `reporte_${date}.csv`;
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
  },
};

export const messagesApi = {
  getAll: async (): Promise<Message[]> => {
    return apiClient.get<Message[]>('/messages');
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
    return apiClient.get<WhatsAppUrlResponse>(`/messages/${id}/whatsapp`);
  },
};
