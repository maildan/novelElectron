// 🔥 기가차드 로거 시스템
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  level: LogLevel;
  component: string;
  message: string;
  data?: unknown;
  timestamp: Date;
}

class LoggerService {
  private logLevel: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private log(level: LogLevel, component: string, message: string, data?: unknown): void {
    if (level < this.logLevel) return;

    const entry: LogEntry = {
      level,
      component,
      message,
      data,
      timestamp: new Date(),
    };

    this.logs.push(entry);
    
    // 로그 개수 제한
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 콘솔 출력 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      const timestamp = entry.timestamp.toISOString();
      const levelName = LogLevel[level];
      const prefix = `[${timestamp}] ${levelName} [${component}]`;

      switch (level) {
        case LogLevel.DEBUG:
          console.debug(prefix, message, data || '');
          break;
        case LogLevel.INFO:
          console.info(prefix, message, data || '');
          break;
        case LogLevel.WARN:
          console.warn(prefix, message, data || '');
          break;
        case LogLevel.ERROR:
          console.error(prefix, message, data || '');
          break;
      }
    }
  }

  debug(component: string, message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, component, message, data);
  }

  info(component: string, message: string, data?: unknown): void {
    this.log(LogLevel.INFO, component, message, data);
  }

  warn(component: string, message: string, data?: unknown): void {
    this.log(LogLevel.WARN, component, message, data);
  }

  error(component: string, message: string, data?: unknown): void {
    this.log(LogLevel.ERROR, component, message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  getLogsByComponent(component: string): LogEntry[] {
    return this.logs.filter(log => log.component === component);
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level >= level);
  }
}

export const Logger = new LoggerService();
