import { config } from './env';

// ===============================
// API Constants
// ===============================
export const API = {
  BASE_URL: config.VITE_API_BASE_URL,
  TIMEOUT: config.VITE_API_TIMEOUT,
} as const;

// ===============================
// Cache Constants (in milliseconds)
// ===============================
export const CACHE = {
  STALE_TIME: config.VITE_CACHE_STALE_TIME,
  GC_TIME: config.VITE_CACHE_STALE_TIME * 2, // 2x stale time
} as const;

// ===============================
// App Constants
// ===============================
export const APP = {
  TITLE: config.VITE_APP_TITLE,
  VERSION: config.VITE_APP_VERSION,
} as const;

// ===============================
// Pagination Constants
// ===============================
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// ===============================
// Date/Time Constants
// ===============================
export const DATETIME = {
  // Time format for display (HH:mm)
  TIME_FORMAT: 'HH:mm' as const,

  // Date format for display (DD/MM/YYYY)
  DATE_FORMAT: 'DD/MM/YYYY' as const,

  // DateTime format for display (DD/MM/YYYY HH:mm)
  DATETIME_FORMAT: 'DD/MM/YYYY HH:mm' as const,

  // ISO format for API (YYYY-MM-DDTHH:mm:ss.sssZ)
  ISO_FORMAT: 'YYYY-MM-DDTHH:mm:ss.sssZ' as const,

  // Auto-refresh intervals (in milliseconds)
  REFRESH_INTERVAL: 60000, // 1 minute
  AUTO_SYNC_INTERVAL: 300000, // 5 minutes
} as const;

// ===============================
// List Constants
// ===============================
export const LIST = {
  MIN_NUMBER: 1,
  MAX_NUMBER: 3,
  DEFAULT_LIST: 1,
} as const;

// ===============================
// Caddie Status Constants
// ===============================
export const CADDIE_STATUS = {
  AVAILABLE: 'Disponible' as const,
  IN_FIELD: 'En campo' as const,
  ABSENT: 'Ausente' as const,
} as const;

export type CaddieStatus = (typeof CADDIE_STATUS)[keyof typeof CADDIE_STATUS];

// ===============================
// Attendance Status Constants
// ===============================
export const ATTENDANCE_STATUS = {
  PRESENT: 'Presente' as const,
  LATE: 'Llegó tarde' as const,
  ABSENT: 'No vino' as const,
  PERMISSION: 'Permiso' as const,
} as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

// ===============================
// List Order Constants
// ===============================
export const LIST_ORDER = {
  ASCENDING: 'ascendente' as const,
  DESCENDING: 'descendente' as const,
} as const;

export type ListOrder = (typeof LIST_ORDER)[keyof typeof LIST_ORDER];

// ===============================
// Storage Keys
// ===============================
export const STORAGE = {
  TOKEN_KEY: 'caddiePro_token',
  THEME_KEY: 'caddiePro_theme',
  SETTINGS_KEY: 'caddiePro_settings',
} as const;

// ===============================
// Breakpoints (for responsive design)
// ===============================
export const BREAKPOINTS = {
  SM: 640,   // Small screens (mobile)
  MD: 768,   // Medium screens (tablet)
  LG: 1024,  // Large screens (desktop)
  XL: 1280,  // Extra large screens
  XXL: 1536, // 2XL screens
} as const;

// ===============================
// Routes
// ===============================
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  TURNS: '/turns',
  ATTENDANCE: '/attendance',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;

// ===============================
// Error Messages (Spanish)
// ===============================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifique su internet.',
  SERVER_ERROR: 'Error del servidor. Por favor, intente más tarde.',
  UNAUTHORIZED: 'No autorizado. Por favor, inicie sesión.',
  NOT_FOUND: 'Recurso no encontrado.',
  VALIDATION_ERROR: 'Error de validación. Por favor, verifique los datos.',
  UNKNOWN_ERROR: 'Ocurrió un error inesperado.',
} as const;

// ===============================
// Success Messages (Spanish)
// ===============================
export const SUCCESS_MESSAGES = {
  CREATED: 'Creado exitosamente.',
  UPDATED: 'Actualizado exitosamente.',
  DELETED: 'Eliminado exitosamente.',
  SAVED: 'Guardado exitosamente.',
} as const;

// ===============================
// Animation Durations (in milliseconds)
// ===============================
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// ===============================
// Debounce/Throttle Times (in milliseconds)
// ===============================
export const DEBOUNCE = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 200,
} as const;

export const THROTTLE = {
  SCROLL: 100,
  MOUSE_MOVE: 50,
} as const;

// ===============================
// Feature Flags
// ===============================
export const FEATURES = {
  WEBSOCKET: config.VITE_ENABLE_WEBSOCKET,
  OFFLINE: config.VITE_ENABLE_OFFLINE,
  ANALYTICS: config.VITE_ENABLE_ANALYTICS,
} as const;

// ===============================
// Validation Rules
// ===============================
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  PHONE_MIN_LENGTH: 8,
  PHONE_MAX_LENGTH: 15,
  MESSAGE_MIN_LENGTH: 1,
  MESSAGE_MAX_LENGTH: 500,
} as const;

// ===============================
// Export all constants
// ===============================
export const CONSTANTS = {
  API,
  CACHE,
  APP,
  PAGINATION,
  DATETIME,
  LIST,
  CADDIE_STATUS,
  ATTENDANCE_STATUS,
  LIST_ORDER,
  STORAGE,
  BREAKPOINTS,
  ROUTES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ANIMATION,
  DEBOUNCE,
  THROTTLE,
  FEATURES,
  VALIDATION,
} as const;
