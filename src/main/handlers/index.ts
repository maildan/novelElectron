// 🔥 기가차드 핸들러 통합 관리자

import { Logger } from '../../shared/logger';
import { setupKeyboardIpcHandlers } from './keyboardIpcHandlers';
import { setupDashboardIpcHandlers } from './dashboardIpcHandlers';
import { setupSettingsIpcHandlers } from './settingsIpcHandlers';

// #DEBUG: Handlers index entry point
Logger.debug('HANDLERS_INDEX', 'Handlers index module loaded');

// 🔥 기가차드 IPC 핸들러 설정 인터페이스
export interface IpcHandlerInfo {
  name: string;
  channels: string[];
  isActive: boolean;
  setupTime?: Date;
}

// 🔥 기가차드 핸들러 관리자 클래스
export class HandlersManager {
  private static instance: HandlersManager | null = null;
  private registeredHandlers: Map<string, IpcHandlerInfo> = new Map();

  private constructor() {
    Logger.info('HANDLERS_INDEX', 'Handlers manager instance created');
  }

  // 🔥 싱글톤 인스턴스 가져오기
  public static getInstance(): HandlersManager {
    if (!HandlersManager.instance) {
      HandlersManager.instance = new HandlersManager();
    }
    return HandlersManager.instance;
  }

  // 🔥 모든 IPC 핸들러 설정
  public async setupAllHandlers(): Promise<boolean> {
    try {
      // #DEBUG: Setting up all IPC handlers
      Logger.debug('HANDLERS_INDEX', 'Setting up all IPC handlers');

      const setupPromises = [
        this.setupHandler('keyboard', () => setupKeyboardIpcHandlers(), [
          'keyboard:start-monitoring',
          'keyboard:stop-monitoring',
          'keyboard:get-status',
          'keyboard:set-language',
          'keyboard:get-recent-events',
        ]),
        this.setupHandler('dashboard', () => setupDashboardIpcHandlers(), [
          'dashboard:get-stats',
          'dashboard:get-sessions',
          'dashboard:export-data',
        ]),
        this.setupHandler('settings', () => setupSettingsIpcHandlers(), [
          'settings:get-all',
          'settings:get-category',
          'settings:get-value',
          'settings:set-category',
          'settings:set-value',
          'settings:reset',
          'settings:backup',
          'settings:restore',
        ]),
        
        // this.setupHandler('database', () => setupDatabaseIpcHandlers(), [...]),
        // this.setupHandler('settings', () => setupSettingsIpcHandlers(), [...]),
        // this.setupHandler('screenshot', () => setupScreenshotIpcHandlers(), [...]),
      ];

      const results = await Promise.allSettled(setupPromises);
      
      let successCount = 0;
      let failCount = 0;

      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          successCount++;
        } else {
          failCount++;
          Logger.error('HANDLERS_INDEX', 'Handler setup failed', {
            reason: result.status === 'rejected' ? result.reason : 'Setup returned false'
          });
        }
      }

      Logger.info('HANDLERS_INDEX', 'IPC handlers setup complete', {
        success: successCount,
        failed: failCount,
        total: setupPromises.length,
      });

      return failCount === 0;

    } catch (error) {
      Logger.error('HANDLERS_INDEX', 'Failed to setup IPC handlers', error);
      return false;
    }
  }

  // 🔥 개별 핸들러 설정
  private async setupHandler(
    name: string,
    setupFunction: () => void,
    channels: string[]
  ): Promise<boolean> {
    try {
      // #DEBUG: Setting up individual handler
      Logger.debug('HANDLERS_INDEX', `Setting up ${name} handler`);

      const startTime = Date.now();
      setupFunction();
      const setupTime = Date.now() - startTime;

      const handlerInfo: IpcHandlerInfo = {
        name,
        channels,
        isActive: true,
        setupTime: new Date(),
      };

      this.registeredHandlers.set(name, handlerInfo);

      Logger.info('HANDLERS_INDEX', `${name} handler setup successfully`, {
        channels: channels.length,
        setupTimeMs: setupTime,
      });

      return true;

    } catch (error) {
      Logger.error('HANDLERS_INDEX', `Failed to setup ${name} handler`, error);
      
      // 실패한 핸들러도 등록 (비활성 상태로)
      this.registeredHandlers.set(name, {
        name,
        channels,
        isActive: false,
      });

      return false;
    }
  }

  // 🔥 핸들러 상태 조회
  public getHandlerStatus(name: string): IpcHandlerInfo | null {
    return this.registeredHandlers.get(name) || null;
  }

  // 🔥 모든 핸들러 상태 조회
  public getAllHandlerStatus(): IpcHandlerInfo[] {
    return Array.from(this.registeredHandlers.values());
  }

  // 🔥 활성 핸들러 개수
  public getActiveHandlerCount(): number {
    return Array.from(this.registeredHandlers.values())
      .filter(handler => handler.isActive).length;
  }

  // 🔥 헬스 체크
  public healthCheck(): {
    healthy: boolean;
    totalHandlers: number;
    activeHandlers: number;
    failedHandlers: string[];
  } {
    const allHandlers = this.getAllHandlerStatus();
    const activeHandlers = allHandlers.filter(h => h.isActive);
    const failedHandlers = allHandlers.filter(h => !h.isActive).map(h => h.name);

    return {
      healthy: failedHandlers.length === 0,
      totalHandlers: allHandlers.length,
      activeHandlers: activeHandlers.length,
      failedHandlers,
    };
  }

  // 🔥 핸들러 재시작
  public async restartHandler(name: string): Promise<boolean> {
    const handler = this.registeredHandlers.get(name);
    if (!handler) {
      Logger.warn('HANDLERS_INDEX', `Handler ${name} not found`);
      return false;
    }

    try {
      // #DEBUG: Restarting handler
      Logger.debug('HANDLERS_INDEX', `Restarting ${name} handler`);

      // 핸들러 종류에 따른 재시작 로직
      switch (name) {
        case 'keyboard':
          setupKeyboardIpcHandlers();
          break;
        // 추가 핸들러들은 필요시 확장 가능
        default:
          Logger.warn('HANDLERS_INDEX', `Unknown handler type: ${name}`);
          return false;
      }

      handler.isActive = true;
      handler.setupTime = new Date();

      Logger.info('HANDLERS_INDEX', `${name} handler restarted successfully`);
      return true;

    } catch (error) {
      Logger.error('HANDLERS_INDEX', `Failed to restart ${name} handler`, error);
      handler.isActive = false;
      return false;
    }
  }

  // 🔥 핸들러 정리
  public cleanup(): void {
    // #DEBUG: Cleaning up handlers
    Logger.debug('HANDLERS_INDEX', 'Cleaning up handlers manager');

    this.registeredHandlers.clear();
    Logger.info('HANDLERS_INDEX', 'Handlers manager cleaned up');
  }

  // 🔥 통계 정보
  public getStats(): Record<string, unknown> {
    const handlers = this.getAllHandlerStatus();
    const totalChannels = handlers.reduce((sum, h) => sum + h.channels.length, 0);
    
    return {
      totalHandlers: handlers.length,
      activeHandlers: handlers.filter(h => h.isActive).length,
      totalChannels,
      handlers: handlers.map(h => ({
        name: h.name,
        isActive: h.isActive,
        channelCount: h.channels.length,
        setupTime: h.setupTime?.toISOString(),
      })),
    };
  }
}

// 🔥 기가차드 전역 핸들러 관리자
export const handlersManager = HandlersManager.getInstance();

// 🔥 편의 함수: 모든 핸들러 설정
export async function setupAllIpcHandlers(): Promise<boolean> {
  return handlersManager.setupAllHandlers();
}

// 🔥 편의 함수: 핸들러 상태 확인
export function getHandlersHealthCheck(): ReturnType<HandlersManager['healthCheck']> {
  return handlersManager.healthCheck();
}

// #DEBUG: Handlers index exit point
Logger.debug('HANDLERS_INDEX', 'Handlers index module setup complete');

export default handlersManager;
