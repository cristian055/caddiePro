import { z } from 'zod';

// Environment variables schema for validation
const envSchema = z.object({
  // API Configuration
  VITE_API_BASE_URL: z.string().url().default('http://localhost:3000/api'),

  // App Configuration
  VITE_APP_TITLE: z.string().default('CaddiePro'),
  VITE_APP_VERSION: z.string().default('1.0.0'),

  // Feature Flags (strings that will be converted to booleans)
  VITE_ENABLE_WEBSOCKET: z.string().default('false'),
  VITE_ENABLE_OFFLINE: z.string().default('false'),
  VITE_ENABLE_ANALYTICS: z.string().default('false'),

  // Logging
  VITE_LOG_LEVEL: z
    .enum(['debug', 'info', 'warn', 'error', 'none'])
    .default('info'),

  // Timeouts (in milliseconds)
  VITE_API_TIMEOUT: z.coerce.number().default(30000),
  VITE_CACHE_STALE_TIME: z.coerce.number().default(300000), // 5 minutes
});

// Validate environment variables at build time
function validateEnv() {
  try {
    const env = envSchema.parse(import.meta.env);
    // Convert string booleans to actual booleans
    return {
      ...env,
      VITE_ENABLE_WEBSOCKET: env.VITE_ENABLE_WEBSOCKET === 'true',
      VITE_ENABLE_OFFLINE: env.VITE_ENABLE_OFFLINE === 'true',
      VITE_ENABLE_ANALYTICS: env.VITE_ENABLE_ANALYTICS === 'true',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues
        .map((e) => `  ${e.path.join('.')}: ${e.message}`)
        .join('\n');
      console.error(
        '[Config] Invalid environment variables:\n' + formattedErrors
      );
    }
    // Return defaults if validation fails
    const defaultEnv = envSchema.parse({});
    return {
      ...defaultEnv,
      VITE_ENABLE_WEBSOCKET: defaultEnv.VITE_ENABLE_WEBSOCKET === 'true',
      VITE_ENABLE_OFFLINE: defaultEnv.VITE_ENABLE_OFFLINE === 'true',
      VITE_ENABLE_ANALYTICS: defaultEnv.VITE_ENABLE_ANALYTICS === 'true',
    };
  }
}

// Validated environment configuration
export const config = validateEnv();

// Type-safe environment config (with booleans)
export interface Config {
  VITE_API_BASE_URL: string;
  VITE_APP_TITLE: string;
  VITE_APP_VERSION: string;
  VITE_ENABLE_WEBSOCKET: boolean;
  VITE_ENABLE_OFFLINE: boolean;
  VITE_ENABLE_ANALYTICS: boolean;
  VITE_LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error' | 'none';
  VITE_API_TIMEOUT: number;
  VITE_CACHE_STALE_TIME: number;
}

// Helper to check if we're in development mode
export const isDevelopment = import.meta.env.DEV;

// Helper to check if we're in production mode
export const isProduction = import.meta.env.PROD;

// Helper to check if we're in test mode
export const isTest = import.meta.env.MODE === 'test';
