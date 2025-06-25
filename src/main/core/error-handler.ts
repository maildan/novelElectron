/**
 * 🔥 기가차드 에러 핸들러 - 돌아가게 버전!
 * Global error handler for the Electron application
 */

import { app, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { ErrorMetadata } from '@shared/types';
import { log } from '../../shared/logger'; // 

export class ErrorHandler {
  private static initialized = false;
  private static logFile: string;

  /**
   * 🔥 기가차드식 글로벌 에러 핸들러 초기화 - 간단하게!
   */
  static initialize(): void {
    if (this.initialized) return;

    // 로그 파일 경로 설정
    const userDataPath = app.getPath('userData');
    this.logFile = path.join(userDataPath, 'error.log');

    // 로그 디렉토리 생성
    try {
      fs.mkdirSync(path.dirname(this.logFile), { recursive: true });
    } catch (error) {
      log.error("Console", '❌ 로그 디렉토리 생성 실패:', error);
    }

    // 🔥 글로벌 에러 핸들러 설정
    process.on('uncaughtException', (error) => {
      log.error("Console", '🔥 기가차드가 잡은 예외:', error);
      this.handleError('Uncaught Exception', error);
    });

    process.on('unhandledRejection', (reason, promise) => {
      log.error("Console", '🔥 기가차드가 잡은 Promise 거부:', reason);
      this.handleError('Unhandled Rejection', reason as Error, { promise });
    });

    app.on('render-process-gone', (event, webContents, details) => {
      log.error("Console", '🔥 렌더러 프로세스 죽음:', details);
      this.handleError('Renderer Process Crash', new Error(details.reason), {
        exitCode: details.exitCode
      });
    });

    this.initialized = true;
    log.info("Console", '🔥 기가차드 에러 핸들러 초기화 완료!');
  }

  /**
   * Handle and log errors
   */
  static handleError(context: string, error: Error | unknown, additionalData?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';
    
    const logEntry = {
      timestamp,
      context,
      message: errorMessage,
      stack: errorStack,
      additionalData,
      pid: process.pid,
      platform: process.platform,
      version: app.getVersion()
    };

    // Log to console
    log.error("Console", `❌ [${context}] ${errorMessage}`);
    if (errorStack) {
      log.error("Console", errorStack);
    }

    // Log to file
    this.writeToLogFile(logEntry);

    // Show error dialog in development or for critical errors
    if (this.shouldShowErrorDialog(context, error)) {
      this.showErrorDialog(context, errorMessage);
    }
  }

  /**
   * Write error to log file
   */
  private static writeToLogFile(logEntry: Record<string, unknown>): void {
    try {
      const logLine = JSON.stringify(logEntry) + '\n';
      fs.appendFileSync(this.logFile, logLine);
    } catch (writeError) {
      log.error("Console", 'Failed to write to error log:', writeError);
    }
  }

  /**
   * Determine if error dialog should be shown
   */
  private static shouldShowErrorDialog(context: string, error: Error | unknown): boolean {
    const isDev = process.env.NODE_ENV === 'development';
    const isCritical = context.includes('Crash') || context.includes('Exception');
    
    return isDev || isCritical;
  }

  /**
   * Show error dialog to user
   */
  private static showErrorDialog(context: string, message: string): void {
    try {
      dialog.showErrorBox(
        `Loop Error - ${context}`,
        `An error occurred: ${message}\n\nCheck the error log for more details.`
      );
    } catch (dialogError) {
      log.error("Console", 'Failed to show error dialog:', dialogError);
    }
  }

  /**
   * Get the path to the error log file
   */
  static getLogPath(): string {
    return this.logFile;
  }

  /**
   * Clear the error log
   */
  static clearLog(): void {
    try {
      if (fs.existsSync(this.logFile)) {
        fs.unlinkSync(this.logFile);
      }
    } catch (error) {
      log.error("Console", 'Failed to clear error log:', error);
    }
  }
}