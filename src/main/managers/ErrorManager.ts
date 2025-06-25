import { Logger } from "../../shared/logger";
const log = Logger;/**
 * 🔥 기가차드 에러 매니저
 * Loop Typing Analytics - Error Manager
 */

import { app, dialog, BrowserWindow } from 'electron';
import { join } from 'path';
import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';

export class ErrorManager {
  private static instance: ErrorManager;
  private errorLogDir: string;
  private errorLogFile: string;

  private constructor() {
    this.errorLogDir = join(app.getPath('userData'), 'logs');
    this.errorLogFile = join(this.errorLogDir, 'error.log');
    this.ensureLogDirectory();
  }

  static getInstance(): ErrorManager {
    if (!ErrorManager.instance) {
      ErrorManager.instance = new ErrorManager();
    }
    return ErrorManager.instance;
  }

  /**
   * 에러 매니저 초기화
   */
  initialize(): void {
    log.info("Console", '🔥 기가차드 에러 매니저 초기화 시작...');

    // 전역 에러 핸들러 등록
    this.setupGlobalErrorHandlers();
    
    log.info("Console", '✅ 에러 매니저 초기화 완료');
  }

  /**
   * 로그 디렉토리 확인/생성
   */
  private ensureLogDirectory(): void {
    if (!existsSync(this.errorLogDir)) {
      try {
        mkdirSync(this.errorLogDir, { recursive: true });
        log.info("Console", '📁 에러 로그 디렉토리 생성:', this.errorLogDir);
      } catch (err) {
        log.error("Console", '❌ 에러 로그 디렉토리 생성 실패:', err);
      }
    }
  }

  /**
   * 전역 에러 핸들러 설정
   */
  private setupGlobalErrorHandlers(): void {
    // 처리되지 않은 예외
    process.on('uncaughtException', (error: Error) => {
      log.error("Console", '💥 처리되지 않은 예외:', error);
      this.logError(error, 'uncaughtException');
      this.showErrorDialog(error, '심각한 오류 발생');
      
      // 치명적 오류인 경우 앱 종료
      setTimeout(() => {
        app.quit();
      }, 1000);
    });

    // 처리되지 않은 Promise 거부
    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
      const error = reason instanceof Error ? reason : new Error(String(reason));
      log.error("Console", '💥 처리되지 않은 Promise 거부:', error);
      this.logError(error, 'unhandledRejection');
      this.showErrorDialog(error, '비동기 작업 오류');
    });

    // Electron 관련 에러
    app.on('render-process-gone', (event, webContents, details) => {
      const error = new Error(`렌더러 프로세스 크래시: ${details.reason}`);
      log.error("Console", '💥 렌더러 프로세스 크래시:', details);
      this.logError(error, 'render-process-gone');
      
      // 윈도우 재생성 시도
      this.attemptWindowRecovery();
    });
  }

  /**
   * 에러 로그 파일에 기록
   */
  logError(error: Error, context: string = 'unknown'): void {
    const timestamp = new Date().toISOString();
    const errorMessage = error.stack || error.toString();
    const logEntry = `[${timestamp}] [${context}] ${errorMessage}\n\n`;

    try {
      appendFileSync(this.errorLogFile, logEntry);
      log.info("Console", `📝 에러 로그 기록: ${context}`);
    } catch (err) {
      log.error("Console", '❌ 에러 로깅 실패:', err);
    }
  }

  /**
   * 사용자에게 에러 대화상자 표시
   */
  showErrorDialog(
    error: Error | string,
    title: string = '오류 발생',
    context: string = ''
  ): void {
    const message = error instanceof Error ? error.message : error;
    const detail = error instanceof Error && error.stack ? error.stack : '';

    dialog.showErrorBox(
      title,
      `${context ? `[${context}] ` : ''}${message}${detail ? `\n\n${detail}` : ''}`
    );
  }

  /**
   * 윈도우 복구 시도
   */
  private attemptWindowRecovery(): void {
    log.info("Console", '🔄 윈도우 복구 시도...');
    
    try {
      const windows = BrowserWindow.getAllWindows();
      if (windows.length === 0) {
        // 윈도우가 없으면 새로 생성 (WindowManager 사용)
        log.info("Console", '🪟 새 윈도우 생성 시도');
        // 여기서는 직접 생성하지 않고 AppLifecycle에서 처리하도록 이벤트 발생
        app.emit('window-recovery-needed' as keyof Electron.App);
      }
    } catch (recoveryError) {
      log.error("Console", '❌ 윈도우 복구 실패:', recoveryError);
      this.logError(recoveryError as Error, 'window-recovery');
    }
  }

  /**
   * 에러 통계 가져오기
   */
  getErrorStats(): { totalErrors: number; lastError: string | null } {
    try {
      if (!existsSync(this.errorLogFile)) {
        return { totalErrors: 0, lastError: null };
      }

      const fs = require('fs');
      const logContent = fs.readFileSync(this.errorLogFile, 'utf8');
      const errorEntries = logContent.split('\n\n').filter((entry: string) => entry.trim());
      
      return {
        totalErrors: errorEntries.length,
        lastError: errorEntries.length > 0 ? errorEntries[errorEntries.length - 1] : null
      };
    } catch (err) {
      log.error("Console", '❌ 에러 통계 조회 실패:', err);
      return { totalErrors: 0, lastError: null };
    }
  }

  /**
   * 정리
   */
  cleanup(): void {
    log.info("Console", '🧹 에러 매니저 정리 시작...');
    
    // 전역 핸들러 제거는 프로세스 종료 시 자동으로 됨
    
    log.info("Console", '✅ 에러 매니저 정리 완료');
  }
}
