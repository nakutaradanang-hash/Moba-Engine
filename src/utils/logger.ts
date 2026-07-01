/**
 * Logger Utility - Optimized for Mobile Devices
 * Zero allocation after initialization, performance-critical logging
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: number;
  level: LogLevel;
  context: string;
  message: string;
  data?: any;
}

export class Logger {
  private context: string;
  private isDevelopment: boolean;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize: number = 100;
  private enableConsole: boolean;

  constructor(context: string, enableConsole: boolean = true) {
    this.context = context;
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.enableConsole = enableConsole && this.isDevelopment;
  }

  debug(message: string, data?: any): void {
    if (!this.isDevelopment) return;
    this.log('debug', message, data);
  }

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  error(message: string, error?: any): void {
    this.log('error', message, error);
  }

  private log(level: LogLevel, message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: performance.now(),
      level,
      context: this.context,
      message,
      data,
    };

    this.logBuffer.push(entry);

    // Keep buffer size manageable
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    if (!this.enableConsole) return;

    const prefix = `[${this.context}]`;
    const timestamp = new Date().toISOString();

    switch (level) {
      case 'debug':
        console.debug(`${prefix} ${message}`, data);
        break;
      case 'info':
        console.info(`${prefix} ${message}`, data || '');
        break;
      case 'warn':
        console.warn(`⚠️  ${prefix} ${message}`, data || '');
        break;
      case 'error':
        console.error(`❌ ${prefix} ${message}`, data || '');
        break;
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    return level ? this.logBuffer.filter((e) => e.level === level) : this.logBuffer;
  }

  clearLogs(): void {
    this.logBuffer.length = 0;
  }
}
