/**
 * 🔥 기가차드 IPC 핸들러 관리자
 * Loop Typing Analytics - IPC Handlers Manager
 */

import { ipcMain } from 'electron';
import { dashboardIpcHandlers } from './dashboardIpcHandlers';

/**
 * 모든 IPC 핸들러 설정
 */
export function setupIpcHandlers(): void {
  console.log('🔌 기가차드 IPC 핸들러 등록 시작...');

  try {
    // Dashboard IPC 핸들러 등록
    registerDashboardHandlers();

    // 기본 앱 핸들러 등록
    registerAppHandlers();

    // 키보드 핸들러 등록
    registerKeyboardHandlers();

    console.log('✅ 모든 IPC 핸들러 등록 완료');
  } catch (error) {
    console.error('❌ IPC 핸들러 등록 실패:', error);
    throw error;
  }
}

/**
 * Dashboard IPC 핸들러 등록
 */
function registerDashboardHandlers(): void {
  dashboardIpcHandlers.registerHandlers();
  console.log('✅ Dashboard IPC 핸들러 등록 완료');
}

/**
 * 기본 앱 IPC 핸들러 등록
 */
function registerAppHandlers(): void {
  // 앱 버전 조회
  ipcMain.handle('app:getVersion', () => {
    const { app } = require('electron');
    return app.getVersion();
  });

  // 플랫폼 정보 조회
  ipcMain.handle('app:getPlatform', () => {
    return {
      platform: process.platform,
      arch: process.arch,
      version: process.version
    };
  });

  // 앱 종료
  ipcMain.handle('app:quit', () => {
    const { app } = require('electron');
    app.quit();
  });

  console.log('✅ 기본 앱 IPC 핸들러 등록 완료');
}

/**
 * 키보드 IPC 핸들러 등록
 */
function registerKeyboardHandlers(): void {
  // 키보드 모니터링 시작
  ipcMain.handle('keyboard:start-monitoring', async () => {
    try {
      const { registerKeyboardListener } = require('../services/keyboardService');
      const { mainWindow } = require('../index');
      
      if (!mainWindow) {
        throw new Error('메인 윈도우를 찾을 수 없습니다');
      }
      
      const success = registerKeyboardListener(mainWindow);
      return {
        success,
        message: success ? '키보드 모니터링이 시작되었습니다' : '키보드 모니터링 시작에 실패했습니다'
      };
    } catch (error) {
      console.error('키보드 모니터링 시작 오류:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      };
    }
  });

  // 키보드 모니터링 중지
  ipcMain.handle('keyboard:stop-monitoring', async () => {
    try {
      const { stopKeyboardListener } = require('../services/keyboardService');
      
      const success = stopKeyboardListener();
      return {
        success,
        message: success ? '키보드 모니터링이 중지되었습니다' : '키보드 모니터링 중지에 실패했습니다'
      };
    } catch (error) {
      console.error('키보드 모니터링 중지 오류:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      };
    }
  });

  // 키보드 모니터링 상태 확인
  ipcMain.handle('keyboard:get-status', async () => {
    try {
      const { getMonitoringStatus } = require('../services/keyboardService');
      
      const status = getMonitoringStatus();
      return {
        isActive: status.isActive,
        message: status.isActive ? '모니터링 중' : '정지됨'
      };
    } catch (error) {
      console.error('키보드 모니터링 상태 확인 오류:', error);
      return {
        isActive: false,
        message: '상태 확인 실패'
      };
    }
  });

  console.log('✅ 키보드 IPC 핸들러 등록 완료');
}

/**
 * 모든 IPC 핸들러 정리
 */
export function cleanupIpcHandlers(): void {
  console.log('🧹 IPC 핸들러 정리 시작...');
  
  try {
    ipcMain.removeAllListeners();
    console.log('✅ 모든 IPC 핸들러 정리 완료');
  } catch (error) {
    console.error('❌ IPC 핸들러 정리 실패:', error);
  }
}
