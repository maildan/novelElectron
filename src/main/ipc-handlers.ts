// 🔥 기가차드 IPC 핸들러 통합 관리

import { Logger } from '../shared/logger';
import { setupKeyboardIpcHandlers } from './handlers/keyboardIpcHandlers';
import { setupDashboardIpcHandlers } from './handlers/dashboardIpcHandlers';

// #DEBUG: IPC handlers entry point
Logger.debug('IPC_HANDLERS', 'IPC handlers module loaded');

// 🔥 기가차드 모든 IPC 핸들러 설정
export function setupAllIpcHandlers(): void {
  try {
    // #DEBUG: Setting up all IPC handlers
    Logger.debug('IPC_HANDLERS', 'Setting up all IPC handlers');

    // 키보드 IPC 핸들러
    setupKeyboardIpcHandlers();
    Logger.info('IPC_HANDLERS', 'Keyboard IPC handlers setup complete');

    // 대시보드 IPC 핸들러
    setupDashboardIpcHandlers();
    Logger.info('IPC_HANDLERS', 'Dashboard IPC handlers setup complete');

    // TODO: 추가 IPC 핸들러들
    // setupDatabaseIpcHandlers();
    // setupSettingsIpcHandlers();
    // setupScreenshotIpcHandlers();

    Logger.info('IPC_HANDLERS', 'All IPC handlers setup complete');

  } catch (error) {
    Logger.error('IPC_HANDLERS', 'Failed to setup IPC handlers', error);
    throw error;
  }
}

// 🔥 기가차드 IPC 핸들러 정리
export function cleanupAllIpcHandlers(): void {
  try {
    Logger.debug('IPC_HANDLERS', 'Cleaning up all IPC handlers');
    
    // TODO: 각 핸들러별 정리 함수 호출
    
    Logger.info('IPC_HANDLERS', 'All IPC handlers cleaned up');
  } catch (error) {
    Logger.error('IPC_HANDLERS', 'Failed to cleanup IPC handlers', error);
  }
}

// #DEBUG: IPC handlers exit point
Logger.debug('IPC_HANDLERS', 'IPC handlers module setup complete');

export default {
  setupAllIpcHandlers,
  cleanupAllIpcHandlers,
};
