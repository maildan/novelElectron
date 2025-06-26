import { Logger } from "../shared/logger";
/**
 * 🔥 기가차드 Electron 메인 프로세스 진입점
 * Loop Typing Analytics - Main Process Entry Point
 */

import { app, BrowserWindow } from 'electron';
import { isDev } from './utils/environment';
import { createMainWindow } from './core/window';
import { initializeSecurity, setSecurityHeaders, disableDevTools } from './core/security';
import { setupIpcHandlers } from './handlers';
import { initializeDatabase } from './services/databaseService';
import { registerKeyboardListener, stopKeyboardListener } from './services/keyboardService';

// 전역 상태
let mainWindow: BrowserWindow | null = null;

/**
 * 기가차드 앱 초기화
 */
async function initializeApp(): Promise<void> {
  Logger.gigachad('App', 'Loop 앱 초기화 시작...');

  try {
    // 1. 보안 설정
    initializeSecurity();
    Logger.success('App', '보안 설정 완료');

    // 2. 데이터베이스 초기화
    await initializeDatabase();
    Logger.success('App', '데이터베이스 초기화 완료');

    // 3. IPC 핸들러 등록
    setupIpcHandlers();
    Logger.success('App', 'IPC 핸들러 등록 완료');

    // 4. 메인 윈도우 생성
    mainWindow = await createMainWindow();
    Logger.success('App', '메인 윈도우 생성 완료');

    // 5. 키보드 리스너 등록
    if (mainWindow) {
      await registerKeyboardListener();
      Logger.success('App', '키보드 리스너 등록 완료');
    }

    Logger.gigachad('App', 'Loop 앱 초기화 완료!');
  } catch (error) {
    Logger.error('App', '앱 초기화 실패', error);
    app.quit();
  }
}

/**
 * 앱 정리
 */
async function cleanupApp(): Promise<void> {
  Logger.info('App', '앱 정리 시작...');
  
  try {
    // 키보드 리스너 정리
    stopKeyboardListener();
    Logger.success('App', '키보드 리스너 정리 완료');

    Logger.success('App', '앱 정리 완료');
  } catch (error) {
    Logger.error('App', '앱 정리 실패', error);
  }
}

// 메인 실행 함수
async function main() {
  Logger.info('App', `Environment: ${isDev ? 'Development' : 'Production'}`);
  Logger.info('App', `Platform: ${process.platform}`);
  Logger.info('App', 'App: Loop v0.1.0');

  // Electron 앱 이벤트 핸들러
  await app.whenReady();
  await initializeApp();

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = await createMainWindow();
    }
  });

  app.on('before-quit', cleanupApp);

  // 단일 인스턴스 보장
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
  } else {
    app.on('second-instance', () => {
      // 두 번째 인스턴스가 시작되면 기존 윈도우를 포커스
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
    });
  }
}

// 프로그램 시작
main().catch(error => {
  Logger.error('App', '앱 시작 실패', error);
  process.exit(1);
});

export { mainWindow };
