/**
 * 🔥 기가차드 IPC 핸들러 관리자
 * Loop Typing Analytics - IPC Handlers Manager
 */

import { ipcMain } from 'electron';
import { dashboardIpcHandlers } from './dashboardIpcHandlers';
// 🔥 NEW: 통합 키보드 핸들러는 UnifiedHandler에서 자동 등록
// import { unifiedKeyboardHandler } from '../keyboard';

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

    // 윈도우 핸들러 등록
    registerWindowHandlers();

    console.log('✅ 모든 IPC 핸들러 등록 완료');
    console.log('� 키보드 핸들러는 UnifiedKeyboardHandler가 자동으로 등록 관리합니다');
    console.log('📋 등록된 핸들러: Dashboard, App, Window');
    console.log('🎯 키보드 관련 IPC는 UnifiedKeyboardHandler.initialize()에서 처리됩니다');
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
 * 새로운 통합 키보드 시스템 사용 안내
 */
function registerKeyboardHandlers(): void {
  console.log('📝 키보드 핸들러는 새로운 통합 시스템으로 이관되었습니다.');
  console.log('   사용법: unifiedKeyboardHandler.initialize(mainWindow)');
  console.log('   위치: src/main/keyboard/UnifiedHandler.ts');
  
  // 레거시 호환성을 위한 기본 핸들러만 유지
  ipcMain.handle('keyboard:legacy-info', () => ({
    message: '새로운 통합 키보드 시스템으로 이관됨',
    newLocation: 'src/main/keyboard/',
    migrationNote: 'unifiedKeyboardHandler를 사용하세요'
  }));

  console.log('✅ 키보드 레거시 호환 핸들러 등록 완료');
}

/**
 * 윈도우 IPC 핸들러 등록
 */
function registerWindowHandlers(): void {
  // 윈도우 최소화
  ipcMain.handle('window:minimize', () => {
    const { BrowserWindow } = require('electron');
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      focusedWindow.minimize();
    }
  });

  // 윈도우 최대화
  ipcMain.handle('window:maximize', () => {
    const { BrowserWindow } = require('electron');
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      focusedWindow.maximize();
    }
  });

  // 윈도우 최대화 토글
  ipcMain.handle('window:toggle-maximize', () => {
    const { BrowserWindow } = require('electron');
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      if (focusedWindow.isMaximized()) {
        focusedWindow.unmaximize();
      } else {
        focusedWindow.maximize();
      }
    }
  });

  // 윈도우 닫기
  ipcMain.handle('window:close', () => {
    const { BrowserWindow } = require('electron');
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      focusedWindow.close();
    }
  });

  console.log('✅ 윈도우 IPC 핸들러 등록 완료');
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
