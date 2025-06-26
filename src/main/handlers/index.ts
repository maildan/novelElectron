import { Logger } from "../../shared/logger";
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
  Logger.info("Console", '🔌 기가차드 IPC 핸들러 등록 시작...');

  try {
    // Dashboard IPC 핸들러 등록
    registerDashboardHandlers();

    // 기본 앱 핸들러 등록
    registerAppHandlers();

    // 키보드 핸들러 등록
    registerKeyboardHandlers();

    Logger.info("Console", '✅ 모든 IPC 핸들러 등록 완료');
  } catch (error) {
    Logger.error("Console", '❌ IPC 핸들러 등록 실패:', error);
    throw error;
  }
}

/**
 * Dashboard IPC 핸들러 등록
 */
function registerDashboardHandlers(): void {
  dashboardIpcHandlers.registerHandlers();
  Logger.info("Console", '✅ Dashboard IPC 핸들러 등록 완료');
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
    return process.platform;
  });

  // 앱 종료
  ipcMain.handle('app:quit', () => {
    const { app } = require('electron');
    app.quit();
  });

  Logger.info("Console", '✅ 기본 앱 IPC 핸들러 등록 완료');
}

/**
 * 키보드 IPC 핸들러는 UnifiedHandler에서 처리됨 - 중복 제거
 */
function registerKeyboardHandlers(): void {
  // UnifiedKeyboardHandler에서 모든 키보드 관련 IPC 핸들러를 처리하므로
  // 이곳에서는 중복 핸들러를 등록하지 않음
  Logger.info("Console", '🔌 키보드 핸들러는 UnifiedHandler에서 관리됨');
}

/**
 * 모든 IPC 핸들러 정리
 */
export function cleanupIpcHandlers(): void {
  Logger.info("Console", '🧹 IPC 핸들러 정리 시작...');
  
  try {
    ipcMain.removeAllListeners();
    Logger.info("Console", '✅ 모든 IPC 핸들러 정리 완료');
  } catch (error) {
    Logger.error("Console", '❌ IPC 핸들러 정리 실패:', error);
  }
}
