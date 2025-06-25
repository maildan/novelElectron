/**
 * 🔥 기가차드 통합 로거 시스템
 * Loop Typing Analytics - Unified Logging System
 */

import { KEYBOARD_CONSTANTS } from './constants';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

type LogMeta = unknown;

interface LogEntry {
  timestamp: number;
  level: LogLevel;
  component: string;
  message: string;
  meta?: unknown;
  stack?: string;
}

export class GigaChadLogger {
  private static instance: GigaChadLogger;
  private consoleBuffer: LogEntry[] = [];
  private consoleLevel: LogLevel = LogLevel.INFO;

  private constructor() {
    // 개발 환경에서는 DEBUG 레벨
    if (KEYBOARD_CONSTANTS.ENABLE_VERBOSE_LOGGING) {
      this.consoleLevel = LogLevel.DEBUG;
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
  static info(component: string, message: string, meta?: LogMeta): void {
    const consoleger = GigaChadLogger.getInstance();
    consoleger.console(LogLevel.INFO, component, message, meta);
    console.info("Console", `🔥 [${new Date().toISOString()}] ${component}: ${message}`, meta || '');
  }

  /**
   * 🔥 기가차드 에러 로그
   */
  static error(component: string, message: string, error?: Error | LogMeta | unknown): void {
    const consoleger = GigaChadLogger.getInstance();
    const stack = error instanceof Error ? error.stack : undefined;
    consoleger.console(LogLevel.ERROR, component, message, error as LogMeta, stack);
    console.error("Console", `❌ [${new Date().toISOString()}] ${component}: ${message}`, error || '');
  }

  /**
   * 🔥 기가차드 경고 로그
   */
  static warn(component: string, message: string, meta?: unknown): void {
    const consoleger = GigaChadLogger.getInstance();
    consoleger.console(LogLevel.WARN, component, message, meta);
    console.warn("Console", `⚠️ [${new Date().toISOString()}] ${component}: ${message}`, meta || '');
  }

  /**
   * 🔥 기가차드 디버그 로그
   */
  static debug(component: string, message: string, meta?: LogMeta): void {
    if (!KEYBOARD_CONSTANTS.ENABLE_VERBOSE_LOGGING) return;
    
    const consoleger = GigaChadLogger.getInstance();
    consoleger.console(LogLevel.DEBUG, component, message, meta);
    console.info("Console", `🔍 [${new Date().toISOString()}] ${component}: ${message}`, meta || '');
  }

  /**
   * 내부 로그 저장
   */
  private console(level: LogLevel, component: string, message: string, meta?: unknown, stack?: string): void {
    if (level < this.consoleLevel) return;

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      component,
      message,
      meta,
      stack
    };

    this.consoleBuffer.push(entry);

    // 🔥 기가차드 메모리 관리: 로그 버퍼 크기 제한
    if (this.consoleBuffer.length > KEYBOARD_CONSTANTS.LOG_BUFFER_SIZE) {
      this.consoleBuffer.splice(0, Math.floor(KEYBOARD_CONSTANTS.LOG_BUFFER_SIZE * 0.3));
    }
  }

  /**
   * 최근 로그 가져오기
   */
  getRecentLogs(count: number = 100, level?: LogLevel): LogEntry[] {
    let consoles = this.consoleBuffer.slice(-count);
    
    if (level !== undefined) {
      consoles = consoles.filter(console => console.level >= level);
    }
    
    return consoles.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * 로그 버퍼 클리어
   */
  clearLogs(): void {
    this.consoleBuffer.length = 0;
    GigaChadLogger.info('Logger', '🧹 로그 버퍼가 클리어되었습니다');
  }

  /**
   * 로그 레벨 설정
   */
  setLogLevel(level: LogLevel): void {
    this.consoleLevel = level;
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
export const consoleger = {
  info: GigaChadLogger.info,
  error: GigaChadLogger.error,
  warn: GigaChadLogger.warn,
  debug: GigaChadLogger.debug,
  startTimer: GigaChadLogger.startTimer,
  endTimer: GigaChadLogger.endTimer
};

export const Logger = GigaChadLogger;
export default GigaChadLogger;
