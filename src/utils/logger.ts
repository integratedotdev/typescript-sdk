/**
 * Logger Utility
 * Centralized logging system with configurable log levels
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

let globalLogLevel: LogLevel = 'error'; // Default: only errors

/**
 * Log level hierarchy (higher number = more verbose)
 */
const logLevelHierarchy: Record<LogLevel, number> = {
  none: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

/**
 * Check if a log level should be output based on current global log level
 */
function shouldLog(level: LogLevel): boolean {
  return logLevelHierarchy[level] <= logLevelHierarchy[globalLogLevel];
}

/**
 * Set the global log level
 * @param level - Log level to set
 */
export function setLogLevel(level: LogLevel): void {
  globalLogLevel = level;
}

/**
 * Get the current global log level
 */
export function getLogLevel(): LogLevel {
  return globalLogLevel;
}

/**
 * Logger interface returned by createLogger
 */
export interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

/**
 * Create a logger instance with a namespace prefix
 * @param namespace - Namespace to prefix all log messages with (e.g., 'OAuth', 'MCP')
 * @returns Logger instance with debug, info, warn, and error methods
 * 
 * @example
 * ```typescript
 * const logger = createLogger('OAuth');
 * logger.debug('Token refreshed'); // [OAuth] Token refreshed
 * logger.error('Auth failed', error); // [OAuth] Auth failed Error: ...
 * ```
 */
export function createLogger(namespace: string): Logger {
  const prefix = `[${namespace}]`;
  
  return {
    debug: (...args: unknown[]) => {
      if (shouldLog('debug')) {
        console.log(prefix, ...args);
      }
    },
    info: (...args: unknown[]) => {
      if (shouldLog('info')) {
        console.log(prefix, ...args);
      }
    },
    warn: (...args: unknown[]) => {
      if (shouldLog('warn')) {
        console.warn(prefix, ...args);
      }
    },
    error: (...args: unknown[]) => {
      if (shouldLog('error')) {
        console.error(prefix, ...args);
      }
    },
  };
}
