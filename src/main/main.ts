import { Logger } from "../shared/logger";
/**
 * 🔥 기가차드 메인 프로세스 - 돌아가게 만들기
 * Main entry point for the Electron application
 */

import { app, BrowserWindow } from 'electron';
import path from 'path';
import { AppLifecycle } from './managers/AppLifecycle';
import { ErrorHandler } from './core/error-handler'; // 🔥 일단 주석처리, 나중에 만들자
import { initializeAppConfig, isDevMode } from './config/app-config';

/**
 * 🔥 기가차드식 에러 핸들링 - 간단하게!
 */
process.on('uncaughtException', (error) => {
  Logger.error("Console", '🔥 기가차드 에러 캐치:', error);
});

process.on('unhandledRejection', (reason) => {
  Logger.error("Console", '🔥 기가차드 프로미스 에러:', reason);
});

/**
 * 앱 설정 초기화
 */
const appConfig = initializeAppConfig();
const isDev = isDevMode();

/**
 * Security: Prevent new window creation from external sources
 */
app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });
});

/**
 * Handle app activation (macOS)
 */
app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await AppLifecycle.getInstance().handleAppActivation();
  }
});

/**
 * Handle all windows closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * Initialize app when ready
 */
app.whenReady().then(async () => {
  try {
    await AppLifecycle.getInstance().initializeApp();
    Logger.info("Console", '✅ 🔥 기가차드 앱 초기화 완료!');
  } catch (error) {
    Logger.error("Console", '❌ 🔥 기가차드 앱 초기화 실패:', error);
    app.quit();
  }
});

/**
 * Handle before quit
 */
app.on('before-quit', async (event) => {
  Logger.info("Console", '🔄 Application shutting down...');
  event.preventDefault();
  
  try {
    await AppLifecycle.getInstance().cleanupApp();
    app.exit(0);
  } catch (error) {
    Logger.error("Console", '❌ 정리 중 오류:', error);
    app.exit(1);
  }
});

/**
 * Export for potential use in other modules
 */
export { app, isDev };
