/**
 * Structured Logger Utility
 * No console.log in production code — use this instead
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: unknown;
  error?: Error;
}

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context, error } = entry;
    let log = `[${timestamp}] [${level}] ${message}`;

    if (context !== undefined) {
      log += ` ${JSON.stringify(context)}`;
    }

    if (error) {
      log += `\n${error.stack}`;
    }

    return log;
  }

  private log(level: LogLevel, message: string, context?: unknown, error?: Error): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    };

    const formatted = this.formatLog(entry);

    // In development, log to console for visibility
    if (this.isDevelopment) {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formatted);
          break;
        case LogLevel.INFO:
          console.info(formatted);
          break;
        case LogLevel.WARN:
          console.warn(formatted);
          break;
        case LogLevel.ERROR:
          console.error(formatted);
          break;
      }
    }

    // TODO: In production, send to external logging service (e.g., Sentry, LogRocket)
    // this.sendToLoggingService(entry);
  }

  debug(message: string, context?: unknown): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: unknown): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: unknown): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: unknown): void {
    this.log(LogLevel.ERROR, message, context, error);
  }
}

export const logger = new Logger();
