import { config } from '../config';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

// Log levels priority (higher = more severe)
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  none: 4,
};

// Current log level from config
const currentLevel = config.VITE_LOG_LEVEL;

// Check if a log should be printed
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

// Format log message with timestamp and level
function formatMessage(level: LogLevel, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}

// Console methods mapped to log levels
function getConsoleMethod(level: LogLevel): (...args: unknown[]) => void {
  switch (level) {
    case 'debug':
      return console.debug.bind(console);
    case 'info':
      return console.info.bind(console);
    case 'warn':
      return console.warn.bind(console);
    case 'error':
      return console.error.bind(console);
    default:
      return console.log.bind(console);
  }
}

// Log debug messages
export function debug(message: string, ...args: unknown[]): void {
  if (!shouldLog('debug')) return;
  const consoleMethod = getConsoleMethod('debug');
  consoleMethod(formatMessage('debug', message), ...args);
}

// Log info messages
export function info(message: string, ...args: unknown[]): void {
  if (!shouldLog('info')) return;
  const consoleMethod = getConsoleMethod('info');
  consoleMethod(formatMessage('info', message), ...args);
}

// Log warning messages
export function warn(message: string, ...args: unknown[]): void {
  if (!shouldLog('warn')) return;
  const consoleMethod = getConsoleMethod('warn');
  consoleMethod(formatMessage('warn', message), ...args);
}

// Log error messages
export function error(message: string, ...args: unknown[]): void {
  if (!shouldLog('error')) return;
  const consoleMethod = getConsoleMethod('error');
  consoleMethod(formatMessage('error', message), ...args);
}

// Log error objects with stack trace
export function errorObj(error: unknown, context?: string): void {
  if (!shouldLog('error')) return;

  const consoleMethod = getConsoleMethod('error');

  if (error instanceof Error) {
    const message = context
      ? `${context}: ${error.message}`
      : error.message;
    consoleMethod(formatMessage('error', message));
    if (error.stack) {
      consoleMethod('Stack trace:', error.stack);
    }
  } else {
    consoleMethod(formatMessage('error', String(context || 'Unknown error')), error);
  }
}

// Create a scoped logger for specific modules
export function createLogger(module: string) {
  return {
    debug: (message: string, ...args: unknown[]) => {
      debug(`[${module}] ${message}`, ...args);
    },
    info: (message: string, ...args: unknown[]) => {
      info(`[${module}] ${message}`, ...args);
    },
    warn: (message: string, ...args: unknown[]) => {
      warn(`[${module}] ${message}`, ...args);
    },
    error: (message: string, ...args: unknown[]) => {
      error(`[${module}] ${message}`, ...args);
    },
    errorObj: (error: unknown, context?: string) => {
      const fullContext = context ? `[${module}] ${context}` : `[${module}]`;
      errorObj(error, fullContext);
    },
  };
}

// Log performance measurements
export function performanceLog(label: string, duration: number): void {
  if (!shouldLog('debug')) return;
  const durationStr = duration > 1000
    ? `${(duration / 1000).toFixed(2)}s`
    : `${duration.toFixed(2)}ms`;
  debug(`Performance [${label}]: ${durationStr}`);
}
