/**
 * 🔥 기가차드 렌더러 로거 (브라우저 환경용)
 * Loop Typing Analytics - Renderer Logger
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';
export type LogMeta = unknown;

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  meta?: LogMeta;
}

/**
 * 기가차드 렌더러 로거 (브라우저 환경용)
 */
class RendererLogger {
  private static instance: RendererLogger;
  private enableConsole: boolean = false; // 기가차드: 콘솔 로그 금지

  private constructor() {}

  public static getInstance(): RendererLogger {
    if (!RendererLogger.instance) {
      RendererLogger.instance = new RendererLogger();
    }
    return RendererLogger.instance;
  }

  private formatMessage(level: LogLevel, component: string, message: string, meta?: LogMeta): string {
    const timestamp = new Date().toISOString();
    const emoji = this.getLevelEmoji(level);
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${emoji} [${component}] ${message}${metaStr}`;
  }

  private getLevelEmoji(level: LogLevel): string {
    switch (level) {
      case 'debug': return '🐛';
      case 'info': return '📋';
      case 'warn': return '⚠️';
      case 'error': return '❌';
      case 'success': return '✅';
      default: return '📋';
    }
  }

  public debug(component: string, message: string, meta?: LogMeta): void {
    if (this.enableConsole) {
      console.debug(this.formatMessage('debug', component, message, meta));
    }
    // 렌더러에서는 IPC로 메인 프로세스로 로그 전송 가능 (나중 구현)
  }

  public info(component: string, message: string, meta?: LogMeta): void {
    if (this.enableConsole) {
      console.info(this.formatMessage('info', component, message, meta));
    }
  }

  public warn(component: string, message: string, meta?: LogMeta): void {
    if (this.enableConsole) {
      console.warn(this.formatMessage('warn', component, message, meta));
    }
  }

  public error(component: string, message: string, meta?: LogMeta): void {
    if (this.enableConsole) {
      console.error(this.formatMessage('error', component, message, meta));
    }
  }

  public success(component: string, message: string, meta?: LogMeta): void {
    if (this.enableConsole) {
      console.log(this.formatMessage('success', component, message, meta));
    }
  }

  // 기가차드 정적 메서드들
  public static debug(message: string, meta?: LogMeta): void {
    RendererLogger.getInstance().debug('RENDERER', message, meta);
  }

  public static info(message: string, meta?: LogMeta): void {
    RendererLogger.getInstance().info('RENDERER', message, meta);
  }

  public static warn(message: string, meta?: LogMeta): void {
    RendererLogger.getInstance().warn('RENDERER', message, meta);
  }

  public static error(message: string, meta?: LogMeta): void {
    RendererLogger.getInstance().error('RENDERER', message, meta);
  }

  public static success(message: string, meta?: LogMeta): void {
    RendererLogger.getInstance().success('RENDERER', message, meta);
  }
}

// 기가차드 Export
export const Logger = RendererLogger;
export default RendererLogger;
