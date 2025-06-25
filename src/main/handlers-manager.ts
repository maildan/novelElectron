/**
 * 🔥 기가차드 핸들러 통합 관리자
 * Loop Typing Analytics - Handlers Manager
 * 
 * 모든 IPC 핸들러를 관리하고 초기화하는 중앙 관리자
 */

import { ipcMain } from 'electron';
import { IpcManager } from './managers/IpcManager';
import { DatabaseManager } from './managers/DatabaseManager';
import { KeyboardManager } from './managers/KeyboardManager';
// 🔥 NEW: Dashboard 핸들러 추가
import { DashboardIpcHandlers } from './handlers/dashboardIpcHandlers';

// 간단한 디버그 로깅
function debugLog(message: string, ...args: unknown[]): void {
  console.log(`[🔥 HandlersManager] ${message}`, ...args);
}

function errorLog(message: string, ...args: unknown[]): void {
  console.error(`[❌ HandlersManager] ${message}`, ...args);
}

// 핸들러 관리 상태
interface HandlersState {
  isAllHandlersSetup: boolean;
  registeredHandlers: Set<string>;
  initializationOrder: string[];
}

// 전역 핸들러 상태
const handlersState: HandlersState = {
  isAllHandlersSetup: false,
  registeredHandlers: new Set(),
  initializationOrder: []
};

/**
 * 🔥 기가차드 핸들러 매니저 클래스
 */
export class HandlersManager {
  private static instance: HandlersManager;
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): HandlersManager {
    if (!HandlersManager.instance) {
      HandlersManager.instance = new HandlersManager();
    }
    return HandlersManager.instance;
  }

  /**
   * 모든 핸들러 초기화
   */
  async initializeAllHandlers(): Promise<void> {
    if (this.initialized) {
      debugLog('이미 초기화된 핸들러들을 다시 초기화하려고 합니다.');
      return;
    }

    try {
      debugLog('🚀 기가차드 핸들러 초기화 시작...');

      // 1. 데이터베이스 핸들러
      await this.initializeDatabaseHandlers();

      // 🔥 NEW: Dashboard 핸들러 초기화
      await this.initializeDashboardHandlers();

      // 2. 키보드 핸들러는 UnifiedKeyboardHandler에서 처리하므로 제외
      // (중복 등록 방지)

      // 3. Window 핸들러
      await this.initializeWindowHandlers();

      // 4. 시스템 핸들러
      await this.initializeSystemHandlers();

      handlersState.isAllHandlersSetup = true;
      this.initialized = true;

      debugLog('✅ 모든 핸들러 초기화 완료');
      debugLog(`📊 등록된 핸들러: ${Array.from(handlersState.registeredHandlers).join(', ')}`);

    } catch (error) {
      errorLog('핸들러 초기화 실패:', error);
      throw error;
    }
  }

  /**
   * 데이터베이스 관련 핸들러 초기화
   */
  private async initializeDatabaseHandlers(): Promise<void> {
    debugLog('🗄️ 데이터베이스 핸들러 초기화 중...');

    // 데이터베이스 상태 조회
    ipcMain.handle('database:get-status', async () => {
      try {
        const dbManager = DatabaseManager.getInstance();
        return {
          connected: true,
          dbPath: 'userData/loop.db'
        };
      } catch (error) {
        return {
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    // 세션 통계 조회
    ipcMain.handle('database:get-sessions', async () => {
      try {
        debugLog('🗄️ database:get-sessions 핸들러 호출됨');
        
        // 실제 DB에서 세션 목록 조회
        const dashboardData = await DatabaseManager.getInstance().getDashboardData();
        const sessions = dashboardData.recentSessions.map(session => ({
          id: session.id,
          content: session.appName || 'Unknown App',
          keyCount: session.totalKeys || 0,
          typingTime: session.duration || 0,
          timestamp: session.startTime.toISOString(),
          wpm: session.wpm || 0,
          accuracy: session.accuracy || 0,
          totalChars: session.totalChars || 0
        }));
        
        debugLog('✅ database:get-sessions 반환 데이터:', sessions.length + '개');
        return sessions;
      } catch (error) {
        errorLog('세션 조회 실패:', error);
        return [];
      }
    });

    // 분석 데이터 조회 추가
    ipcMain.handle('database:get-analytics', async (_, sessionId: string) => {
      try {
        debugLog('📊 database:get-analytics 핸들러 호출됨, sessionId:', sessionId);
        
        // 실제 DB에서 세션 분석 데이터 조회
        const analytics = await DatabaseManager.getInstance().getSessionAnalytics(sessionId);
        if (!analytics) {
          debugLog('⚠️ 세션 분석 데이터를 찾을 수 없음:', sessionId);
          return null;
        }
        
        debugLog('✅ database:get-analytics 반환 완료');
        return analytics;
      } catch (error) {
        errorLog('분석 데이터 조회 실패:', error);
        return null;
      }
    });

    handlersState.registeredHandlers.add('database');
    debugLog('✅ 데이터베이스 핸들러 등록 완료');
  }

  /**
   * ⚠️ 키보드 관련 핸들러는 UnifiedKeyboardHandler에서 처리
   * 중복 등록 방지를 위해 여기서는 처리하지 않음
   */
  private async initializeKeyboardHandlers(): Promise<void> {
    debugLog('⌨️ 키보드 핸들러는 UnifiedKeyboardHandler에서 관리됩니다.');
    // 실제 핸들러 등록은 UnifiedKeyboardHandler가 담당
    handlersState.registeredHandlers.add('keyboard');
    debugLog('✅ 키보드 핸들러 등록 완료 (위임)');
  }

  /**
   * 윈도우 관련 핸들러 초기화
   */
  private async initializeWindowHandlers(): Promise<void> {
    debugLog('🪟 윈도우 핸들러 초기화 중...');

    // 윈도우 최소화/최대화
    ipcMain.handle('window:minimize', async () => {
      try {
        const { BrowserWindow } = require('electron');
        const mainWindow = BrowserWindow.getFocusedWindow();
        if (mainWindow) {
          mainWindow.minimize();
          return { success: true };
        }
        return { success: false, error: '활성 윈도우 없음' };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });

    ipcMain.handle('window:maximize', async () => {
      try {
        const { BrowserWindow } = require('electron');
        const mainWindow = BrowserWindow.getFocusedWindow();
        if (mainWindow) {
          if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
          } else {
            mainWindow.maximize();
          }
          return { success: true };
        }
        return { success: false, error: '활성 윈도우 없음' };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });

    handlersState.registeredHandlers.add('window');
    debugLog('✅ 윈도우 핸들러 등록 완료');
  }

  /**
   * 시스템 관련 핸들러 초기화
   */
  private async initializeSystemHandlers(): Promise<void> {
    debugLog('🖥️ 시스템 핸들러 초기화 중...');

    // 시스템 정보 조회
    ipcMain.handle('system:get-info', async () => {
      try {
        const os = require('os');
        const { app } = require('electron');
        
        return {
          platform: process.platform,
          arch: process.arch,
          version: process.version,
          appVersion: app.getVersion(),
          electronVersion: process.versions.electron,
          nodeVersion: process.versions.node,
          cpus: os.cpus().length,
          memory: Math.round(os.totalmem() / 1024 / 1024 / 1024) + 'GB'
        };
      } catch (error) {
        errorLog('시스템 정보 조회 실패:', error);
        return null;
      }
    });

    // 앱 재시작
    ipcMain.handle('app:restart', async () => {
      try {
        const { app } = require('electron');
        app.relaunch();
        app.exit(0);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });

    handlersState.registeredHandlers.add('system');
    debugLog('✅ 시스템 핸들러 등록 완료');
  }

  /**
   * 대시보드 관련 핸들러 초기화
   */
  private async initializeDashboardHandlers(): Promise<void> {
    debugLog('📊 대시보드 핸들러 초기화 중...');

    try {
      // 🔥 기가차드 Dashboard IPC 핸들러 등록
      const dashboardHandler = DashboardIpcHandlers.getInstance();
      dashboardHandler.registerHandlers();
      debugLog('✅ Dashboard IPC 핸들러 등록 완료');
    } catch (error) {
      errorLog('❌ Dashboard IPC 핸들러 등록 실패:', error);
    }

    // 추가 대시보드 데이터 조회 (기본)
    ipcMain.handle('dashboard:get-data', async () => {
      try {
        // TODO: 실제 대시보드 데이터 조회 로직 구현
        return {
          totalSessions: 100,
          activeUsers: 75,
          errorRate: 0.02
        };
      } catch (error) {
        errorLog('대시보드 데이터 조회 실패:', error);
        return null;
      }
    });

    handlersState.registeredHandlers.add('dashboard');
    debugLog('✅ 대시보드 핸들러 등록 완료');
  }

  /**
   * 모든 핸들러 정리
   */
  cleanup(): void {
    debugLog('🧹 핸들러 정리 시작...');

    try {
      // 등록된 모든 IPC 핸들러 제거
      for (const handlerName of handlersState.registeredHandlers) {
        debugLog(`🧹 ${handlerName} 핸들러 정리 중...`);
      }

      // IPC 핸들러 모두 제거
      ipcMain.removeAllListeners();

      // 상태 초기화
      handlersState.isAllHandlersSetup = false;
      handlersState.registeredHandlers.clear();
      handlersState.initializationOrder = [];
      this.initialized = false;

      debugLog('✅ 모든 핸들러 정리 완료');
    } catch (error) {
      errorLog('핸들러 정리 실패:', error);
    }
  }

  /**
   * 핸들러 상태 조회
   */
  getHandlersState(): HandlersState {
    return { ...handlersState };
  }
}

// 기본 내보내기
export default HandlersManager;
