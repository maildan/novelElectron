/**
 * 🔥 기가차드 통합 로거 시스템
 * Loop Typing Analytics - Unified Logging System
 */

import { KEYBOARD_CONSTANTS } from '@main/keyboard/constants';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

interface LogEntry {
  timestamp: number;
  level: LogLevel;
  component: string;
  message: string;
  meta?: any;
  stack?: string;
}

export class GigaChadLogger {
  private static instance: GigaChadLogger;
  private logBuffer: LogEntry[] = [];
  private logLevel: LogLevel = LogLevel.INFO;

  private constructor() {
    // 개발 환경에서는 DEBUG 레벨
    if (KEYBOARD_CONSTANTS.ENABLE_VERBOSE_LOGGING) {
      this.logLevel = LogLevel.DEBUG;
    }
  }

  static getInstance(): GigaChadLogger {
    if (!GigaChadLogger.instance) {
      GigaChadLogger.instance = new GigaChadLogger();
    }
    return GigaChadLogger.instance;
  }

  /**
   * 🔥 기가차드 정보 로그
   */
  static info(component: string, message: string, meta?: any): void {
    const logger = GigaChadLogger.getInstance();
    logger.log(LogLevel.INFO, component, message, meta);
    console.log(`🔥 [${new Date().toISOString()}] ${component}: ${message}`, meta || '');
  }

  /**
   * 🔥 기가차드 에러 로그
   */
  static error(component: string, message: string, error?: Error | any): void {
    const logger = GigaChadLogger.getInstance();
    const stack = error instanceof Error ? error.stack : undefined;
    logger.log(LogLevel.ERROR, component, message, error, stack);
    console.error(`❌ [${new Date().toISOString()}] ${component}: ${message}`, error || '');
  }

  /**
   * 🔥 기가차드 경고 로그
   */
  static warn(component: string, message: string, meta?: any): void {
    const logger = GigaChadLogger.getInstance();
    logger.log(LogLevel.WARN, component, message, meta);
    console.warn(`⚠️ [${new Date().toISOString()}] ${component}: ${message}`, meta || '');
  }

  /**
   * 🔥 기가차드 디버그 로그
   */
  static debug(component: string, message: string, meta?: any): void {
    if (!KEYBOARD_CONSTANTS.ENABLE_VERBOSE_LOGGING) return;
    
    const logger = GigaChadLogger.getInstance();
    logger.log(LogLevel.DEBUG, component, message, meta);
    console.log(`🔍 [${new Date().toISOString()}] ${component}: ${message}`, meta || '');
  }

  /**
   * 내부 로그 저장
   */
  private log(level: LogLevel, component: string, message: string, meta?: any, stack?: string): void {
    if (level < this.logLevel) return;

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      component,
      message,
      meta,
      stack
    };

    this.logBuffer.push(entry);

    // 🔥 기가차드 메모리 관리: 로그 버퍼 크기 제한
    if (this.logBuffer.length > KEYBOARD_CONSTANTS.LOG_BUFFER_SIZE) {
      this.logBuffer.splice(0, Math.floor(KEYBOARD_CONSTANTS.LOG_BUFFER_SIZE * 0.3));
    }
  }

  /**
   * 최근 로그 가져오기
   */
  getRecentLogs(count: number = 100, level?: LogLevel): LogEntry[] {
    let logs = this.logBuffer.slice(-count);
    
    if (level !== undefined) {
      logs = logs.filter(log => log.level >= level);
    }
    
    return logs.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * 로그 버퍼 클리어
   */
  clearLogs(): void {
    this.logBuffer.length = 0;
    GigaChadLogger.info('Logger', '🧹 로그 버퍼가 클리어되었습니다');
  }

  /**
   * 로그 레벨 설정
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
    GigaChadLogger.info('Logger', `로그 레벨이 ${LogLevel[level]}로 설정되었습니다`);
  }

  /**
   * 성능 측정 시작
   */
  static startTimer(component: string, operation: string): string {
    const timerId = `${component}:${operation}:${Date.now()}`;
    if (KEYBOARD_CONSTANTS.ENABLE_VERBOSE_LOGGING) {
      console.time(timerId);
    }
    return timerId;
  }

  /**
   * 성능 측정 종료
   */
  static endTimer(timerId: string): void {
    if (KEYBOARD_CONSTANTS.ENABLE_VERBOSE_LOGGING) {
      console.timeEnd(timerId);
    }
  }
}

// 🔥 기가차드 편의 함수들
export const logger = {
  info: GigaChadLogger.info,
  error: GigaChadLogger.error,
  warn: GigaChadLogger.warn,
  debug: GigaChadLogger.debug,
  startTimer: GigaChadLogger.startTimer,
  endTimer: GigaChadLogger.endTimer
};
