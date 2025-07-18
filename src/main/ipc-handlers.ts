// 🔥 기가차드 IPC 핸들러 통합 관리

import { ipcMain } from 'electron';
import { Logger } from '../shared/logger';
import { setupKeyboardIpcHandlers } from './handlers/keyboardIpcHandlers';
import { setupDashboardIpcHandlers } from './handlers/dashboardIpcHandlers';
import { setupSettingsIpcHandlers } from './handlers/settingsIpcHandlers';
import { setupTrayIpcHandlers } from './handlers/trayIpcHandlers';
import { setupProjectIpcHandlers } from './handlers/projectIpcHandlers';
import { setupOAuthIpcHandlers } from './handlers/oauthIpcHandlers';
import { setupAIIpcHandlers } from './handlers/aiIpcHandlers';

// #DEBUG: IPC handlers entry point
Logger.debug('IPC_HANDLERS', 'IPC handlers module loaded');

// 🔥 등록된 핸들러 추적
const registeredHandlers = new Set<string>();

// 🔥 기가차드 모든 IPC 핸들러 정리 (중복 등록 방지)
export function cleanupAllIpcHandlers(): void {
  try {
    Logger.debug('IPC_HANDLERS', 'Cleaning up all IPC handlers');
    
    // 개별 핸들러 제거 (removeHandler는 없으므로 removeAllListeners 사용)
    const handlersToClean = [
      'keyboard:start-monitoring',
      'keyboard:stop-monitoring', 
      'keyboard:get-status',
      'keyboard:get-realtime-stats',
      'keyboard:set-language',
      'dashboard:get-stats',
      'dashboard:get-recent-sessions',
      'projects:get-all',
      'projects:get-by-id',
      'projects:create',
      'projects:update', 
      'projects:delete',
      'projects:create-sample',
      'projects:import-file',
      'settings:get-all',
      'settings:get',
      'settings:set',
      'settings:reset',
      'tray:get-info',
      'tray:set-monitoring-status',
      'tray:update-stats',
      'tray:show-success',
      'tray:show-error',
      'tray:toggle-visibility',
      'tray:test',
      'oauth:start-google-auth',
      'oauth:handle-callback',
      'oauth:get-google-documents',
      'oauth:import-google-doc',
      'oauth:get-auth-status',
      'oauth:revoke-auth'
    ];
    
    handlersToClean.forEach(channel => {
      try {
        ipcMain.removeHandler(channel);
      } catch (error) {
        // 핸들러가 없어도 무시
      }
    });
    
    registeredHandlers.clear();
    
    Logger.info('IPC_HANDLERS', 'All IPC handlers cleaned up');
  } catch (error) {
    Logger.error('IPC_HANDLERS', 'Failed to cleanup IPC handlers', error);
  }
}

// 🔥 기가차드 모든 IPC 핸들러 설정
export async function setupAllIpcHandlers(): Promise<void> {
  try {
    // 먼저 기존 핸들러들 정리
    cleanupAllIpcHandlers();
    
    // #DEBUG: Setting up all IPC handlers
    Logger.debug('IPC_HANDLERS', 'Setting up all IPC handlers');

    // 키보드 IPC 핸들러
    if (!registeredHandlers.has('keyboard')) {
      await setupKeyboardIpcHandlers();
      registeredHandlers.add('keyboard');
      Logger.info('IPC_HANDLERS', 'Keyboard IPC handlers setup complete');
    }

    // 대시보드 IPC 핸들러
    if (!registeredHandlers.has('dashboard')) {
      setupDashboardIpcHandlers();
      registeredHandlers.add('dashboard');
      Logger.info('IPC_HANDLERS', 'Dashboard IPC handlers setup complete');
    }

    // 프로젝트 IPC 핸들러
    if (!registeredHandlers.has('projects')) {
      setupProjectIpcHandlers();
      registeredHandlers.add('projects');
      Logger.info('IPC_HANDLERS', 'Project IPC handlers setup complete');
    }

    // 설정 IPC 핸들러는 handlers/index.ts에서 관리하므로 여기서는 제외
    // if (!registeredHandlers.has('settings')) {
    //   setupSettingsIpcHandlers();
    //   registeredHandlers.add('settings');
    //   Logger.info('IPC_HANDLERS', 'electron-store based Settings IPC handlers setup complete');
    // }

    // 트레이 IPC 핸들러
    if (!registeredHandlers.has('tray')) {
      setupTrayIpcHandlers();
      registeredHandlers.add('tray');
      Logger.info('IPC_HANDLERS', 'Tray IPC handlers setup complete');
    }

    // AI IPC 핸들러는 handlers/index.ts에서 관리하므로 여기서는 제외
    // if (!registeredHandlers.has('ai')) {
    //   setupAIIpcHandlers();
    //   registeredHandlers.add('ai');
    //   Logger.info('IPC_HANDLERS', 'AI IPC handlers setup complete');
    // }

    // OAuth IPC 핸들러
    if (!registeredHandlers.has('oauth')) {
      setupOAuthIpcHandlers();
      registeredHandlers.add('oauth');
      Logger.info('IPC_HANDLERS', 'OAuth IPC handlers setup complete');
    }

    Logger.info('IPC_HANDLERS', 'All IPC handlers setup complete');

  } catch (error) {
    Logger.error('IPC_HANDLERS', 'Failed to setup IPC handlers', error);
    throw error;
  }
}



// #DEBUG: IPC handlers exit point
Logger.debug('IPC_HANDLERS', 'IPC handlers module setup complete');

export default {
  setupAllIpcHandlers,
  cleanupAllIpcHandlers,
};
