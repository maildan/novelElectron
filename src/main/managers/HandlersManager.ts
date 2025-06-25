/**
 * 🔥 기가차드 핸들러 매니저
 * Loop Typing Analytics - Handlers Manager
 * 
 * Loop 6의 handlers-manager.ts를 기반으로 모든 IPC 핸들러를 통합 관리
 */

import { ipcMain, BrowserWindow, IpcMainInvokeEvent } from 'electron';
import { DatabaseManager } from './DatabaseManager';
import { WindowManager } from './WindowManager';
import type { IpcHandlerFunction } from '@shared/types';

export interface HandlerInfo {
  channel: string;
  handler: IpcHandlerFunction<unknown, unknown>;
  registered: boolean;
  registeredAt: number;
}

/**
 * 핸들러 매니저 클래스
 */
export class HandlersManager {
  private static instance: HandlersManager;
  private handlers: Map<string, HandlerInfo> = new Map();
  private mainWindow: BrowserWindow | null = null;

  private constructor() {}

  static getInstance(): HandlersManager {
    if (!HandlersManager.instance) {
      HandlersManager.instance = new HandlersManager();
    }
    return HandlersManager.instance;
  }

  /**
   * 핸들러 매니저 초기화
   */
  initialize(mainWindow: BrowserWindow): void {
    console.log('🔧 기가차드 핸들러 매니저: 초기화 시작...');
    
    this.mainWindow = mainWindow;
    this.registerAllHandlers();
    
    console.log('✅ 핸들러 매니저 초기화 완료');
  }

  /**
   * 모든 IPC 핸들러 등록
   */
  private registerAllHandlers(): void {
    // 기본 앱 핸들러
    this.registerAppHandlers();
    
    // 데이터베이스 핸들러
    this.registerDatabaseHandlers();
    
    // 윈도우 핸들러
    this.registerWindowHandlers();
    
    // 시스템 정보 핸들러
    this.registerSystemHandlers();
  }

  /**
   * 기본 앱 핸들러 등록
   */
  private registerAppHandlers(): void {
    this.registerHandler('app:get-version', async () => {
      const { app } = require('electron');
      return {
        success: true,
        data: {
          version: app.getVersion(),
          name: app.getName(),
          platform: process.platform,
          arch: process.arch
        }
      };
    });

    this.registerHandler('app:quit', async () => {
      const { app } = require('electron');
      app.quit();
      return { success: true };
    });

    this.registerHandler('app:minimize', async () => {
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.minimize();
        return { success: true };
      }
      return { success: false, error: '윈도우를 찾을 수 없습니다' };
    });

    this.registerHandler('app:maximize', async () => {
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        if (this.mainWindow.isMaximized()) {
          this.mainWindow.unmaximize();
        } else {
          this.mainWindow.maximize();
        }
        return { success: true };
      }
      return { success: false, error: '윈도우를 찾을 수 없습니다' };
    });
  }

  /**
   * 데이터베이스 핸들러 등록
   */
  private registerDatabaseHandlers(): void {
    const databaseManager = DatabaseManager.getInstance();

    this.registerHandler('db:get-stats', async () => {
      try {
        const stats = await databaseManager.getDashboardData();
        return { success: true, data: stats };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        console.error('❌ 통계 조회 실패:', error);
        return { success: false, error: errorMessage };
      }
    });

    this.registerHandler('db:get-recent-sessions', async (_event: IpcMainInvokeEvent, limit = 10) => {
      try {
        // TODO: DatabaseManager에 getAllSessions 메서드 추가 필요
        console.log('최근 세션 조회 요청, limit:', limit);
        return { success: true, data: [] }; // 임시로 빈 배열 반환
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        console.error('❌ 최근 세션 조회 실패:', error);
        return { success: false, error: errorMessage };
      }
    });

    this.registerHandler('db:export-data', async (_event: IpcMainInvokeEvent, options: Record<string, unknown>) => {
      try {
        // TODO: DatabaseManager에 exportData 메서드 추가 필요
        console.log('데이터 내보내기 요청:', options);
        return { success: true, data: { message: '데이터 내보내기 기능 구현 예정' } };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        console.error('❌ 데이터 내보내기 실패:', error);
        return { success: false, error: errorMessage };
      }
    });
  }

  /**
   * 윈도우 핸들러 등록
   */
  private registerWindowHandlers(): void {
    this.registerHandler('window:get-bounds', async () => {
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        return {
          success: true,
          data: this.mainWindow.getBounds()
        };
      }
      return { success: false, error: '윈도우를 찾을 수 없습니다' };
    });

    this.registerHandler('window:set-bounds', async (_event: IpcMainInvokeEvent, bounds: Electron.Rectangle) => {
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.setBounds(bounds);
        return { success: true };
      }
      return { success: false, error: '윈도우를 찾을 수 없습니다' };
    });

    this.registerHandler('window:toggle-devtools', async () => {
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.toggleDevTools();
        return { success: true };
      }
      return { success: false, error: '윈도우를 찾을 수 없습니다' };
    });
  }

  /**
   * 시스템 핸들러 등록
   */
  private registerSystemHandlers(): void {
    this.registerHandler('system:get-info', async () => {
      const os = require('os');
      const { app } = require('electron');
      
      return {
        success: true,
        data: {
          platform: process.platform,
          arch: process.arch,
          nodeVersion: process.version,
          electronVersion: process.versions.electron,
          chromeVersion: process.versions.chrome,
          v8Version: process.versions.v8,
          totalMemory: os.totalmem(),
          freeMemory: os.freemem(),
          cpus: os.cpus().length,
          uptime: os.uptime(),
          appVersion: app.getVersion(),
          appName: app.getName(),
          userData: app.getPath('userData'),
          temp: app.getPath('temp')
        }
      };
    });

    this.registerHandler('system:get-memory-usage', async () => {
      return {
        success: true,
        data: process.memoryUsage()
      };
    });
  }

  /**
   * 핸들러 등록
   */
  private registerHandler<T = unknown, R = unknown>(
    channel: string, 
    handler: (event: IpcMainInvokeEvent, ...args: T[]) => Promise<R>
  ): void {
    try {
      ipcMain.handle(channel, handler);
      
      this.handlers.set(channel, {
        channel,
        handler: handler as IpcHandlerFunction<unknown, unknown>,
        registered: true,
        registeredAt: Date.now()
      });
      
      console.log(`🔧 핸들러 등록: ${channel}`);
    } catch (error) {
      console.error(`❌ 핸들러 등록 실패 [${channel}]:`, error);
    }
  }

  /**
   * 핸들러 등록 해제
   */
  unregisterHandler(channel: string): void {
    try {
      ipcMain.removeHandler(channel);
      this.handlers.delete(channel);
      console.log(`🔧 핸들러 등록 해제: ${channel}`);
    } catch (error) {
      console.error(`❌ 핸들러 등록 해제 실패 [${channel}]:`, error);
    }
  }

  /**
   * 모든 핸들러 등록 해제
   */
  cleanup(): void {
    console.log('🧹 핸들러 매니저 정리 시작...');
    
    for (const [channel] of this.handlers) {
      this.unregisterHandler(channel);
    }
    
    this.handlers.clear();
    this.mainWindow = null;
    
    console.log('✅ 핸들러 매니저 정리 완료');
  }

  /**
   * 등록된 핸들러 목록 조회
   */
  getHandlers(): HandlerInfo[] {
    return Array.from(this.handlers.values());
  }

  /**
   * 핸들러 통계
   */
  getStats(): {
    totalHandlers: number;
    registeredHandlers: number;
    lastRegistrationTime: number | null;
  } {
    const handlers = Array.from(this.handlers.values());
    const registeredHandlers = handlers.filter(h => h.registered);
    const lastRegistrationTime = handlers.length > 0 
      ? Math.max(...handlers.map(h => h.registeredAt))
      : null;

    return {
      totalHandlers: handlers.length,
      registeredHandlers: registeredHandlers.length,
      lastRegistrationTime
    };
  }
}

// Export singleton instance
export const handlersManager = HandlersManager.getInstance();
