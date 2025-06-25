/**
 * 🔥 기가차드 통합 로거 시스템
 * Loop Typing Analytics - Unified Logger
 */

import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { app } from 'electron';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  meta?: any;
}

/**
 * 기가차드 통합 로거 클래스
 */
export class GigaChadLogger {
  private static instance: GigaChadLogger;
  private logPath: string;
  private enableConsole: boolean;
  private enableFile: boolean;
  private logLevel: LogLevel;

  private constructor() {
    // 로그 디렉토리 설정
    const userDataPath = app?.getPath('userData') || process.cwd();
    const logsDir = join(userDataPath, 'logs');
    
    // 로그 디렉토리 생성
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }

    this.logPath = join(logsDir, `gigachad-${new Date().toISOString().split('T')[0]}.log`);
    this.enableConsole = process.env.NODE_ENV !== 'production';
    this.enableFile = true;
    this.logLevel = 'debug';
  }

  /**
   * 싱글톤 인스턴스 가져오기
   */
  public static getInstance(): GigaChadLogger {
    if (!GigaChadLogger.instance) {
      GigaChadLogger.instance = new GigaChadLogger();
    }
    return GigaChadLogger.instance;
  }

  /**
   * 로그 설정
   */
  public configure(options: {
    enableConsole?: boolean;
    enableFile?: boolean;
    logLevel?: LogLevel;
    logPath?: string;
  }): void {
    if (options.enableConsole !== undefined) this.enableConsole = options.enableConsole;
    if (options.enableFile !== undefined) this.enableFile = options.enableFile;
    if (options.logLevel !== undefined) this.logLevel = options.logLevel;
    if (options.logPath !== undefined) this.logPath = options.logPath;
  }

  /**
   * 로그 레벨 우선순위 확인
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
      success: 1
    };
    return levels[level] >= levels[this.logLevel];
  }

  /**
   * 로그 출력
   */
  private writeLog(level: LogLevel, component: string, message: string, meta?: any): void {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const logEntry: LogEntry = {
      timestamp,
      level,
      component,
      message,
      meta
    };

    // 콘솔 출력
    if (this.enableConsole) {
      this.writeToConsole(logEntry);
    }

    // 파일 출력
    if (this.enableFile) {
      this.writeToFile(logEntry);
    }
  }

  /**
   * 콘솔에 로그 출력
   */
  private writeToConsole(entry: LogEntry): void {
    const emoji = this.getLogEmoji(entry.level);
    const timestamp = entry.timestamp.split('T')[1].split('.')[0];
    const prefix = `${emoji} [${timestamp}] ${entry.component}:`;
    
    const message = entry.meta 
      ? `${prefix} ${entry.message}`
      : `${prefix} ${entry.message}`;

    switch (entry.level) {
      case 'error':
        console.error(message, entry.meta || '');
        break;
      case 'warn':
        console.warn(message, entry.meta || '');
        break;
      case 'debug':
        console.debug(message, entry.meta || '');
        break;
      default:
        console.log(message, entry.meta || '');
    }
  }

  /**
   * 파일에 로그 출력
   */
  private writeToFile(entry: LogEntry): void {
    try {
      const logLine = JSON.stringify(entry) + '\n';
      appendFileSync(this.logPath, logLine, 'utf8');
    } catch (error) {
      // 파일 쓰기 실패 시 콘솔에만 출력
      console.error('❌ 로그 파일 쓰기 실패:', error);
    }
  }

  /**
   * 로그 레벨별 이모지 가져오기
   */
  private getLogEmoji(level: LogLevel): string {
    const emojis: Record<LogLevel, string> = {
      debug: '🔍',
      info: '📝',
      warn: '⚠️',
      error: '❌',
      success: '✅'
    };
    return emojis[level];
  }

  /**
   * Debug 로그
   */
  public debug(component: string, message: string, meta?: any): void {
    this.writeLog('debug', component, message, meta);
  }

  /**
   * Info 로그
   */
  public info(component: string, message: string, meta?: any): void {
    this.writeLog('info', component, message, meta);
  }

  /**
   * Warning 로그
   */
  public warn(component: string, message: string, meta?: any): void {
    this.writeLog('warn', component, message, meta);
  }

  /**
   * Error 로그
   */
  public error(component: string, message: string, meta?: any): void {
    this.writeLog('error', component, message, meta);
  }

  /**
   * Success 로그
   */
  public success(component: string, message: string, meta?: any): void {
    this.writeLog('success', component, message, meta);
  }

  /**
   * 기가차드 스타일 시작 로그
   */
  public gigachad(component: string, message: string, meta?: any): void {
    this.writeLog('success', component, `🔥 ${message}`, meta);
  }

  /**
   * 로그 파일 경로 가져오기
   */
  public getLogPath(): string {
    return this.logPath;
  }

  /**
   * 로그 히스토리 정리 (7일 이상 된 로그 삭제)
   */
  public cleanupOldLogs(): void {
    // TODO: 7일 이상 된 로그 파일 정리 로직 구현
    this.info('Logger', '로그 정리 작업은 추후 구현 예정');
  }
}

// 싱글톤 인스턴스 내보내기
export const logger = GigaChadLogger.getInstance();

// 편의 함수들
export const log = {
  debug: (component: string, message: string, meta?: any) => logger.debug(component, message, meta),
  info: (component: string, message: string, meta?: any) => logger.info(component, message, meta),
  warn: (component: string, message: string, meta?: any) => logger.warn(component, message, meta),
  error: (component: string, message: string, meta?: any) => logger.error(component, message, meta),
  success: (component: string, message: string, meta?: any) => logger.success(component, message, meta),
  gigachad: (component: string, message: string, meta?: any) => logger.gigachad(component, message, meta),
};

// 기본 로거 설정
logger.configure({
  enableConsole: true,
  enableFile: true,
  logLevel: 'debug'
});
