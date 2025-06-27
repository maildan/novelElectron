// 🔥 기가차드 대시보드 IPC 핸들러 - 실시간 데이터 전송!

import { ipcMain } from 'electron';
import { Logger } from '../../shared/logger';
import { IPC_CHANNELS } from '../../shared/types';
import { createSafeIpcHandler, createSafeAsyncIpcHandler } from '../../shared/ipc-utils';
import { databaseService } from '../services/databaseService';

// #DEBUG: Dashboard IPC handlers entry point
console.time('DASHBOARD_IPC_SETUP');
Logger.debug('DASHBOARD_IPC', 'Setting up dashboard IPC handlers');

// 🔥 기가차드 대시보드 IPC 핸들러 설정
export function setupDashboardIpcHandlers(): void {
  try {
    // #DEBUG: Registering dashboard handlers
    
    // 🔥 타이핑 세션 목록 조회
    ipcMain.handle(
      IPC_CHANNELS.DATABASE.GET_SESSIONS,
      createSafeAsyncIpcHandler(
        async (...args: unknown[]) => {
          const [, limit, offset] = args;
          // #DEBUG: IPC call - get sessions
          Logger.debug('DASHBOARD_IPC', 'IPC: Get sessions requested', { limit, offset });
          
          const result = await databaseService.getTypingSessions(
            typeof limit === 'number' ? limit : 50, 
            typeof offset === 'number' ? offset : 0
          );
          if (!result.success) {
            throw new Error(result.error);
          }
          return result.data;
        },
        'DASHBOARD_IPC',
        'Get typing sessions'
      )
    );

    // 🔥 타이핑 통계 조회
    ipcMain.handle(
      IPC_CHANNELS.DATABASE.GET_STATS,
      createSafeAsyncIpcHandler(
        async (...args: unknown[]) => {
          const [, days] = args;
          // #DEBUG: IPC call - get stats
          Logger.debug('DASHBOARD_IPC', 'IPC: Get stats requested', { days });
          
          const result = await databaseService.getTypingStats(
            typeof days === 'number' ? days : 30
          );
          if (!result.success) {
            throw new Error(result.error);
          }
          return result.data;
        },
        'DASHBOARD_IPC',
        'Get typing statistics'
      )
    );

    // 🔥 실시간 WPM 업데이트 (향후 구현)
    ipcMain.handle(
      'dashboard:get-realtime-wpm',
      createSafeAsyncIpcHandler(
        async (event) => {
          // #DEBUG: IPC call - get realtime WPM
          Logger.debug('DASHBOARD_IPC', 'IPC: Get realtime WPM requested');
          
          // TODO: 실시간 WPM 계산 로직 구현
          return {
            currentWpm: 0,
            avgWpm: 0,
            peakWpm: 0,
            timestamp: new Date(),
          };
        },
        'DASHBOARD_IPC',
        'Get realtime WPM'
      )
    );

    // 🔥 앱 정보 조회
    ipcMain.handle(
      IPC_CHANNELS.APP.GET_VERSION,
      createSafeIpcHandler(
        (event) => {
          // #DEBUG: IPC call - get app version
          Logger.debug('DASHBOARD_IPC', 'IPC: Get app version requested');
          
          return process.env.npm_package_version || '1.0.0';
        },
        'DASHBOARD_IPC',
        'Get app version'
      )
    );

    // 🔥 앱 종료
    ipcMain.handle(
      IPC_CHANNELS.APP.QUIT,
      createSafeAsyncIpcHandler(
        async (event) => {
          // #DEBUG: IPC call - quit app
          Logger.debug('DASHBOARD_IPC', 'IPC: Quit app requested');
          
          const { app } = await import('electron');
          app.quit();
          return true;
        },
        'DASHBOARD_IPC',
        'Quit application'
      )
    );

    // 🔥 윈도우 최소화
    ipcMain.handle(
      IPC_CHANNELS.APP.MINIMIZE,
      createSafeIpcHandler(
        (...args: unknown[]) => {
          const [event] = args;
          // #DEBUG: IPC call - minimize window
          Logger.debug('DASHBOARD_IPC', 'IPC: Minimize window requested');
          
          if (event && typeof event === 'object' && 'sender' in event) {
            const sender = (event as { sender: { getOwnerBrowserWindow(): unknown } }).sender;
            const window = sender.getOwnerBrowserWindow();
            if (window && typeof window === 'object' && 'minimize' in window) {
              (window as { minimize(): void }).minimize();
              return true;
            }
          }
          return false;
        },
        'DASHBOARD_IPC',
        'Minimize window'
      )
    );

    // 🔥 윈도우 최대화/복원
    ipcMain.handle(
      IPC_CHANNELS.APP.MAXIMIZE,
      createSafeIpcHandler(
        (...args: unknown[]) => {
          const [event] = args;
          // #DEBUG: IPC call - maximize window
          Logger.debug('DASHBOARD_IPC', 'IPC: Maximize window requested');
          
          if (event && typeof event === 'object' && 'sender' in event) {
            const sender = (event as { sender: { getOwnerBrowserWindow(): unknown } }).sender;
            const window = sender.getOwnerBrowserWindow();
            if (window && typeof window === 'object' && 'isMaximized' in window && 'maximize' in window && 'unmaximize' in window) {
              const browserWindow = window as { isMaximized(): boolean; maximize(): void; unmaximize(): void };
              if (browserWindow.isMaximized()) {
                browserWindow.unmaximize();
              } else {
                browserWindow.maximize();
              }
              return true;
            }
          }
          return false;
        },
        'DASHBOARD_IPC',
        'Maximize/restore window'
      )
    );

    // 🔥 사용자 설정 저장
    ipcMain.handle(
      IPC_CHANNELS.SETTINGS.SET,
      createSafeAsyncIpcHandler(
        async (event, preferences: unknown) => {
          // #DEBUG: IPC call - save settings
          Logger.debug('DASHBOARD_IPC', 'IPC: Save settings requested');
          
          const result = await databaseService.saveUserPreferences(preferences as never);
          return result.success ? result.data : null;
        },
        'DASHBOARD_IPC',
        'Save user preferences'
      )
    );

    // 🔥 사용자 설정 조회
    ipcMain.handle(
      IPC_CHANNELS.SETTINGS.GET,
      createSafeAsyncIpcHandler(
        async (event) => {
          // #DEBUG: IPC call - get settings
          Logger.debug('DASHBOARD_IPC', 'IPC: Get settings requested');
          
          const result = await databaseService.getUserPreferences();
          return result.success ? result.data : null;
        },
        'DASHBOARD_IPC',
        'Get user preferences'
      )
    );

    // 🔥 데이터베이스 헬스 체크
    ipcMain.handle(
      'dashboard:health-check',
      createSafeAsyncIpcHandler(
        async (event) => {
          // #DEBUG: IPC call - health check
          Logger.debug('DASHBOARD_IPC', 'IPC: Health check requested');
          
          const dbHealth = await databaseService.healthCheck();
          return {
            database: dbHealth.success ? dbHealth.data : null,
            timestamp: new Date(),
          };
        },
        'DASHBOARD_IPC',
        'Health check'
      )
    );

    // 🔥 세션 삭제 (향후 구현)
    ipcMain.handle(
      'dashboard:delete-session',
      createSafeAsyncIpcHandler(
        async (event, ...args: unknown[]) => {
          const sessionId = args[0] as string;
          // #DEBUG: IPC call - delete session
          Logger.debug('DASHBOARD_IPC', 'IPC: Delete session requested', { sessionId });
          
          // TODO: 세션 삭제 로직 구현
          Logger.warn('DASHBOARD_IPC', 'Session deletion not implemented yet');
          return false;
        },
        'DASHBOARD_IPC',
        'Delete session'
      )
    );

    // 🔥 데이터 내보내기 (향후 구현)
    ipcMain.handle(
      'dashboard:export-data',
      createSafeAsyncIpcHandler(
        async (event, ...args: unknown[]) => {
          const format = (args[0] as 'json' | 'csv') || 'json';
          // #DEBUG: IPC call - export data
          Logger.debug('DASHBOARD_IPC', 'IPC: Export data requested', { format });
          
          // TODO: 데이터 내보내기 로직 구현
          Logger.warn('DASHBOARD_IPC', 'Data export not implemented yet');
          return null;
        },
        'DASHBOARD_IPC',
        'Export data'
      )
    );

    console.timeEnd('DASHBOARD_IPC_SETUP');
    Logger.info('DASHBOARD_IPC', 'Dashboard IPC handlers setup successfully', {
      handlerCount: 12,
    });

  } catch (error) {
    console.timeEnd('DASHBOARD_IPC_SETUP');
    Logger.error('DASHBOARD_IPC', 'Failed to setup dashboard IPC handlers', error);
    throw error;
  }
}

// 🔥 기가차드 대시보드 IPC 핸들러 정리
export function cleanupDashboardIpcHandlers(): void {
  try {
    // #DEBUG: Cleaning up dashboard IPC handlers
    Logger.debug('DASHBOARD_IPC', 'Cleaning up dashboard IPC handlers');

    const channels = [
      IPC_CHANNELS.DATABASE.GET_SESSIONS,
      IPC_CHANNELS.DATABASE.GET_STATS,
      IPC_CHANNELS.APP.GET_VERSION,
      IPC_CHANNELS.APP.QUIT,
      IPC_CHANNELS.APP.MINIMIZE,
      IPC_CHANNELS.APP.MAXIMIZE,
      IPC_CHANNELS.SETTINGS.SET,
      IPC_CHANNELS.SETTINGS.GET,
      'dashboard:get-realtime-wpm',
      'dashboard:health-check',
      'dashboard:delete-session',
      'dashboard:export-data',
    ];

    for (const channel of channels) {
      ipcMain.removeAllListeners(channel);
    }

    Logger.info('DASHBOARD_IPC', 'Dashboard IPC handlers cleaned up successfully');

  } catch (error) {
    Logger.error('DASHBOARD_IPC', 'Failed to cleanup dashboard IPC handlers', error);
  }
}

// #DEBUG: Dashboard IPC handlers exit point
Logger.debug('DASHBOARD_IPC', 'Dashboard IPC handlers module setup complete');

export default setupDashboardIpcHandlers;
