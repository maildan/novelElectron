import { Logger } from "../shared/logger";
const log = Logger;/**
 * 🔥 기가차드 IPC 핸들러 - 중앙집중식 IPC 관리
 * Loop Typing Analytics - IPC Handlers
 */
import { ipcMain, BrowserWindow, app, dialog } from 'electron';
import { DatabaseManager } from './managers/DatabaseManager';
import { SystemMonitor } from './managers/SystemMonitor';
import { KeyboardManager } from './managers/KeyboardManager';

export class IpcHandlers {
  private static instance: IpcHandlers;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): IpcHandlers {
    if (!IpcHandlers.instance) {
      IpcHandlers.instance = new IpcHandlers();
    }
    return IpcHandlers.instance;
  }

  /**
   * 모든 IPC 핸들러 초기화
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    try {
      this.setupSystemHandlers();
      this.setupDatabaseHandlers();
      this.setupKeyboardHandlers();
      this.setupWindowHandlers();
      this.setupAppHandlers();
      
      this.isInitialized = true;
      log.info("Console", '🔥 기가차드 IPC 핸들러 초기화 완료');
    } catch (error) {
      log.error("Console", '❌ IPC 핸들러 초기화 실패:', error);
    }
  }

  /**
   * 시스템 관련 IPC 핸들러
   */
  private setupSystemHandlers(): void {
    // 시스템 통계 조회
    ipcMain.handle('get-system-stats', async () => {
      try {
        const systemMonitor = SystemMonitor.getInstance();
        return systemMonitor.getSystemStats();
      } catch (error) {
        log.error("Console", '시스템 통계 조회 실패:', error);
        throw error;
      }
    });

    // 앱 통계 조회
    ipcMain.handle('get-app-stats', async () => {
      try {
        const systemMonitor = SystemMonitor.getInstance();
        return systemMonitor.getAppStats();
      } catch (error) {
        log.error("Console", '앱 통계 조회 실패:', error);
        throw error;
      }
    });

    // 시스템 모니터링 시작
    ipcMain.handle('start-system-monitoring', async (event, intervalMs) => {
      try {
        const systemMonitor = SystemMonitor.getInstance();
        systemMonitor.startMonitoring(intervalMs);
        return true;
      } catch (error) {
        log.error("Console", '시스템 모니터링 시작 실패:', error);
        throw error;
      }
    });

    // 시스템 모니터링 중지
    ipcMain.handle('stop-system-monitoring', async () => {
      try {
        const systemMonitor = SystemMonitor.getInstance();
        systemMonitor.stopMonitoring();
        return true;
      } catch (error) {
        log.error("Console", '시스템 모니터링 중지 실패:', error);
        throw error;
      }
    });
  }

  /**
   * 데이터베이스 관련 IPC 핸들러
   */
  private setupDatabaseHandlers(): void {
    // 타이핑 세션 저장
    ipcMain.handle('save-typing-session', async (event, sessionData) => {
      try {
        const dbManager = DatabaseManager.getInstance();
        return await dbManager.createTypingSession(sessionData);
      } catch (error) {
        log.error("Console", '타이핑 세션 저장 실패:', error);
        throw error;
      }
    });

    // 키 이벤트 저장
    ipcMain.handle('save-key-event', async (event, keyEventData) => {
      try {
        const dbManager = DatabaseManager.getInstance();
        return await dbManager.createKeyEvent(keyEventData);
      } catch (error) {
        log.error("Console", '키 이벤트 저장 실패:', error);
        throw error;
      }
    });

    // 데이터베이스 초기화
    ipcMain.handle('initialize-database', async () => {
      try {
        const dbManager = DatabaseManager.getInstance();
        await dbManager.initialize();
        return true;
      } catch (error) {
        log.error("Console", '데이터베이스 초기화 실패:', error);
        throw error;
      }
    });

    // Prisma 클라이언트 상태 확인
    ipcMain.handle('check-database-status', async () => {
      try {
        const dbManager = DatabaseManager.getInstance();
        const prisma = dbManager.getPrisma();
        return { connected: !!prisma };
      } catch (error) {
        log.error("Console", '데이터베이스 상태 확인 실패:', error);
        return { connected: false, error: (error as Error).message };
      }
    });
  }

  /**
   * 키보드 관련 IPC 핸들러는 UnifiedHandler에서 처리됨
   * 중복 제거로 인해 비활성화
   */
  private setupKeyboardHandlers(): void {
    // UnifiedKeyboardHandler에서 모든 키보드 관련 IPC 핸들러를 처리하므로
    // 이곳에서는 중복 핸들러를 등록하지 않음
    log.info("Console", '🔌 키보드 핸들러는 UnifiedHandler에서 관리됨');
  }

  /**
   * 윈도우 관련 IPC 핸들러
   */
  private setupWindowHandlers(): void {
    // 윈도우 최소화
    ipcMain.handle('minimize-window', async (event) => {
      try {
        const window = BrowserWindow.fromWebContents(event.sender);
        if (window) {
          window.minimize();
        }
        return true;
      } catch (error) {
        log.error("Console", '윈도우 최소화 실패:', error);
        throw error;
      }
    });

    // 윈도우 최대화/복원
    ipcMain.handle('toggle-maximize-window', async (event) => {
      try {
        const window = BrowserWindow.fromWebContents(event.sender);
        if (window) {
          if (window.isMaximized()) {
            window.unmaximize();
          } else {
            window.maximize();
          }
        }
        return true;
      } catch (error) {
        log.error("Console", '윈도우 최대화/복원 실패:', error);
        throw error;
      }
    });

    // 윈도우 닫기
    ipcMain.handle('close-window', async (event) => {
      try {
        const window = BrowserWindow.fromWebContents(event.sender);
        if (window) {
          window.close();
        }
        return true;
      } catch (error) {
        log.error("Console", '윈도우 닫기 실패:', error);
        throw error;
      }
    });

    // 개발자 도구 토글
    ipcMain.handle('toggle-dev-tools', async (event) => {
      try {
        const window = BrowserWindow.fromWebContents(event.sender);
        if (window) {
          window.webContents.toggleDevTools();
        }
        return true;
      } catch (error) {
        log.error("Console", '개발자 도구 토글 실패:', error);
        throw error;
      }
    });
  }

  /**
   * 앱 관련 IPC 핸들러
   */
  private setupAppHandlers(): void {
    // 앱 정보 조회
    ipcMain.handle('get-app-info', async () => {
      try {
        return {
          name: app.getName(),
          version: app.getVersion(),
          path: app.getPath('userData'),
          locale: app.getLocale(),
          platform: process.platform,
          arch: process.arch,
        };
      } catch (error) {
        log.error("Console", '앱 정보 조회 실패:', error);
        throw error;
      }
    });

    // 앱 종료
    ipcMain.handle('quit-app', async () => {
      try {
        app.quit();
        return true;
      } catch (error) {
        log.error("Console", '앱 종료 실패:', error);
        throw error;
      }
    });

    // 앱 재시작
    ipcMain.handle('restart-app', async () => {
      try {
        app.relaunch();
        app.exit();
        return true;
      } catch (error) {
        log.error("Console", '앱 재시작 실패:', error);
        throw error;
      }
    });

    // 파일 대화상자 열기
    ipcMain.handle('show-open-dialog', async (event, options) => {
      try {
        const window = BrowserWindow.fromWebContents(event.sender);
        if (!window) {
          throw new Error('윈도우를 찾을 수 없습니다');
        }
        const result = await dialog.showOpenDialog(window, options);
        return result;
      } catch (error) {
        log.error("Console", '파일 대화상자 열기 실패:', error);
        throw error;
      }
    });

    // 저장 대화상자 열기
    ipcMain.handle('show-save-dialog', async (event, options) => {
      try {
        const window = BrowserWindow.fromWebContents(event.sender);
        if (!window) {
          throw new Error('윈도우를 찾을 수 없습니다');
        }
        const result = await dialog.showSaveDialog(window, options);
        return result;
      } catch (error) {
        log.error("Console", '저장 대화상자 열기 실패:', error);
        throw error;
      }
    });
  }

  /**
   * 정리
   */
  cleanup(): void {
    try {
      // 모든 IPC 핸들러 제거
      ipcMain.removeAllListeners();
      
      this.isInitialized = false;
      log.info("Console", '✅ IPC 핸들러 정리 완료');
    } catch (error) {
      log.error("Console", '❌ IPC 핸들러 정리 실패:', error);
    }
  }
}

export default IpcHandlers;
