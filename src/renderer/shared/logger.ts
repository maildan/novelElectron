export interface LoggerMeta {
  [key: string]: unknown;
}

export class Logger {
  static info(tag: string, message: string, meta?: LoggerMeta): void {
    window?.electron?.log?.info?.(`[${tag}] ${message}`, meta);
  }
  static error(tag: string, message: string, error?: unknown): void {
    window?.electron?.log?.error?.(`[${tag}] ${message}`, error);
  }
  static debug(tag: string, message: string, meta?: LoggerMeta): void {
    window?.electron?.log?.debug?.(`[${tag}] ${message}`, meta);
  }
} 