/**
 * Logger Utility
 * Centralized logging system with configurable log levels
 * 
 * Uses separate log levels for client and server contexts to prevent
 * server debug mode from affecting client logging and vice versa.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';
export type LogContext = 'client' | 'server';

/**
 * Separate log levels for client and server contexts
 * This prevents server debug: true from causing client logs to appear
 */
const contextLogLevels: Record<LogContext, LogLevel> = {
  client: 'error', // Default: only errors
  server: 'error', // Default: only errors
};

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
 * Check if a log level should be output based on the context's log level
 */
function shouldLog(level: LogLevel, context: LogContext): boolean {
  return logLevelHierarchy[level] <= logLevelHierarchy[contextLogLevels[context]];
}

/**
 * Set the log level for a specific context
 * @param level - Log level to set
 * @param context - Which context to set ('client' or 'server'). Defaults to 'client'.
 */
export function setLogLevel(level: LogLevel, context: LogContext = 'client'): void {
  contextLogLevels[context] = level;
}

/**
 * Get the current log level for a context
 * @param context - Which context to get ('client' or 'server'). Defaults to 'client'.
 */
export function getLogLevel(context: LogContext = 'client'): LogLevel {
  return contextLogLevels[context];
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
 * @param context - Which log context to use ('client' or 'server'). Defaults to 'client'.
 * @returns Logger instance with debug, info, warn, and error methods
 * 
 * @example
 * ```typescript
 * // Client-side logger (uses client log level)
 * const logger = createLogger('OAuth');
 * logger.debug('Token refreshed'); // [OAuth] Token refreshed
 * 
 * // Server-side logger (uses server log level)
 * const serverLogger = createLogger('MCPServer', 'server');
 * serverLogger.debug('Request received'); // Only logs if server debug is enabled
 * ```
 */
export function createLogger(namespace: string, context: LogContext = 'client'): Logger {
  const prefix = `[${namespace}]`;

  return {
    debug: (...args: unknown[]) => {
      if (shouldLog('debug', context)) {
        console.log(prefix, ...args);
      }
    },
    info: (...args: unknown[]) => {
      if (shouldLog('info', context)) {
        console.log(prefix, ...args);
      }
    },
    warn: (...args: unknown[]) => {
      if (shouldLog('warn', context)) {
        console.warn(prefix, ...args);
      }
    },
    error: (...args: unknown[]) => {
      if (shouldLog('error', context)) {
        console.error(prefix, ...args);
      }
    },
  };
}
