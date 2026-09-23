/**
 * Structured Backend Logger Utility
 * Ensures sensitive patient data, passwords, and tokens are never logged.
 */

const SENSITIVE_KEYS = ['password', 'token', 'authorization', 'secret', 'aadhaar', 'vitals', 'diagnosis'];

function sanitize(data: any): any {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(sanitize);

  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s))) {
      clean[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      clean[key] = sanitize(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

export const logger = {
  info: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString();
    if (meta) {
      console.log(`[${timestamp}] [INFO] ${message}`, sanitize(meta));
    } else {
      console.log(`[${timestamp}] [INFO] ${message}`);
    }
  },

  warn: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString();
    if (meta) {
      console.warn(`[${timestamp}] [WARN] ${message}`, sanitize(meta));
    } else {
      console.warn(`[${timestamp}] [WARN] ${message}`);
    }
  },

  error: (message: string, error?: any) => {
    const timestamp = new Date().toISOString();
    const errMeta = error instanceof Error ? { message: error.message, stack: error.stack } : error;
    console.error(`[${timestamp}] [ERROR] ${message}`, sanitize(errMeta));
  },
};
