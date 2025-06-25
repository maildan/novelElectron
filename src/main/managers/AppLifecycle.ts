import { Logger } from "../../shared/logger";
const log = Logger;/**
 * 🔥 기가차드 앱 라이프사이클 매니저
 * Loop Typing Analytics - Application Lifecycle Manager
 */

import { app, BrowserWindow } from 'electron';
import { WindowManager } from './WindowManager';
import { KeyboardManager } from './KeyboardManager';
import { DatabaseManager } from './DatabaseManager';
import { SecurityManager } from './SecurityManager';
import { IpcManager } from './IpcManager';

export interface AppState {
  isInitialized: boolean;
  windowManager: WindowManager | null;
  keyboardManager: KeyboardManager | null;
  databaseManager: DatabaseManager | null;
  securityManager: SecurityManager | null;
  ipcManager: IpcManager | null;
  unifiedKeyboardHandler?: { cleanup:  () => Promise<void> } | null; // 통합 키보드 핸들러
  errorManager?: { cleanup: () => Promise<void> } | null; // 에러 매니저
}

export class AppLifecycle {
  private static instance: AppLifecycle;
  private appState: AppState;

  private constructor() {
    this.appState = {
      isInitialized: false,
      windowManager: null,
      keyboardManager: null,
      databaseManager: null,
      securityManager: null,
      ipcManager: null
    };
  }

  static getInstance(): AppLifecycle {
    if (!AppLifecycle.instance) {
      AppLifecycle.instance = new AppLifecycle();
    }
    return AppLifecycle.instance;
  }

  /**
   * 앱 초기화
   */
  async initializeApp(): Promise<void> {
    log.info("Console", '🔥 기가차드 앱 라이프사이클: 초기화 시작...');

    try {
      // 1. 보안 매니저 초기화
      this.appState.securityManager = SecurityManager.getInstance();
      await this.appState.securityManager.initialize();
      log.info("Console", '✅ 보안 매니저 초기화 완료');

      // 2. 데이터베이스 매니저 초기화
      this.appState.databaseManager = DatabaseManager.getInstance();
      await this.appState.databaseManager.initialize();
      log.info("Console", '✅ 데이터베이스 매니저 초기화 완료');

      // 3. IPC 매니저 초기화
      this.appState.ipcManager = IpcManager.getInstance();
      this.appState.ipcManager.initialize();
      log.info("Console", '✅ IPC 매니저 초기화 완료');

      // 4. 윈도우 매니저 초기화
      this.appState.windowManager = WindowManager.getInstance();
      await this.appState.windowManager.createMainWindow();
      log.info("Console", '✅ 윈도우 매니저 초기화 완료');

      // 5. 키보드 매니저 초기화
      this.appState.keyboardManager = KeyboardManager.getInstance();
      const mainWindow = this.appState.windowManager.getMainWindow();
      if (mainWindow) {
        await this.appState.keyboardManager.initialize(); // 인자 없이 호출
        log.info("Console", '✅ 키보드 매니저 초기화 완료');
      }

      this.appState.isInitialized = true;
      log.info("Console", '🚀 기가차드 앱 라이프사이클: 초기화 완료!');
    } catch (error) {
      log.error("Console", '❌ 앱 초기화 실패:', error);
      throw error;
    }
  }

  /**
   * 앱 정리
   */
  async cleanupApp(): Promise<void> {
    log.info("Console", '🧹 기가차드 앱 라이프사이클: 정리 시작...');

    try {
      // 키보드 매니저 정리
      if (this.appState.keyboardManager) {
        this.appState.keyboardManager.cleanup();
        this.appState.keyboardManager = null;
        log.info("Console", '✅ 키보드 매니저 정리 완료');
      }

      // 윈도우 매니저 정리
      if (this.appState.windowManager) {
        this.appState.windowManager.cleanup();
        this.appState.windowManager = null;
        log.info("Console", '✅ 윈도우 매니저 정리 완료');
      }

      // IPC 매니저 정리
      if (this.appState.ipcManager) {
        this.appState.ipcManager.cleanup();
        this.appState.ipcManager = null;
        log.info("Console", '✅ IPC 매니저 정리 완료');
      }

      // 데이터베이스 매니저 정리
      if (this.appState.databaseManager) {
        await this.appState.databaseManager.cleanup();
        this.appState.databaseManager = null;
        log.info("Console", '✅ 데이터베이스 매니저 정리 완료');
      }

      // 보안 매니저 정리
      if (this.appState.securityManager) {
        this.appState.securityManager.cleanup();
        this.appState.securityManager = null;
        log.info("Console", '✅ 보안 매니저 정리 완료');
      }

      this.appState.isInitialized = false;
      log.info("Console", '✅ 앱 라이프사이클 정리 완료');
    } catch (error) {
      log.error("Console", '❌ 앱 정리 실패:', error);
    }
  }

  /**
   * 앱 상태 가져오기
   */
  getAppState(): AppState {
    return { ...this.appState };
  }

  /**
   * 특정 매니저 가져오기
   */
  getWindowManager(): WindowManager | null {
    return this.appState.windowManager;
  }

  getKeyboardManager(): KeyboardManager | null {
    return this.appState.keyboardManager;
  }

  getDatabaseManager(): DatabaseManager | null {
    return this.appState.databaseManager;
  }

  getSecurityManager(): SecurityManager | null {
    return this.appState.securityManager;
  }

  getIpcManager(): IpcManager | null {
    return this.appState.ipcManager;
  }

  /**
   * 앱 재시작
   */
  async restartApp(): Promise<void> {
    log.info("Console", '🔄 앱 재시작 중...');
    
    await this.cleanupApp();
    app.relaunch();
    app.exit();
  }

  /**
   * 앱 종료
   */
  async quitApp(): Promise<void> {
    log.info("Console", '🛑 앱 종료 중...');
    
    await this.cleanupApp();
    app.quit();
  }

  /**
   * 새 윈도우 생성 (두 번째 인스턴스 시도 시)
   */
  async handleSecondInstance(): Promise<void> {
    log.info("Console", '🔄 두 번째 인스턴스 감지: 기존 윈도우 포커스');
    
    if (this.appState.windowManager) {
      this.appState.windowManager.focusMainWindow();
    } else {
      // 윈도우가 없으면 새로 생성
      await this.initializeApp();
    }
  }

  /**
   * macOS에서 앱 활성화 처리
   */
  async handleAppActivation(): Promise<void> {
    log.info("Console", '🍎 macOS 앱 활성화');
    
    if (BrowserWindow.getAllWindows().length === 0) {
      if (this.appState.isInitialized) {
        // 매니저들이 초기화되어 있으면 윈도우만 새로 생성
        if (this.appState.windowManager) {
          await this.appState.windowManager.createMainWindow();
        }
      } else {
        // 완전히 새로 초기화
        await this.initializeApp();
      }
    } else {
      // 기존 윈도우 포커스
      if (this.appState.windowManager) {
        this.appState.windowManager.focusMainWindow();
      }
    }
  }
}
