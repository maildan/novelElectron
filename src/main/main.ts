/**
 * 🔥 기가차드 메인 프로세스 - 돌아가게 만들기
 * Main entry point for the Electron application
 */

import { app, BrowserWindow } from 'electron';
import path from 'path';
import { AppLifecycle } from './managers/AppLifecycle';
// import { ErrorHandler } from './core/error-handler'; // 🔥 일단 주석처리, 나중에 만들자
import { AppConfig } from './config/app-config';

/**
 * 🔥 기가차드식 에러 핸들링 - 간단하게!
 */
process.on('uncaughtException', (error) => {
  console.error('🔥 기가차드 에러 캐치:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('🔥 기가차드 프로미스 에러:', reason);
});

/**
 * App-wide configuration
 */
const isDev = process.env.NODE_ENV === 'development';
const isPackaged = app.isPackaged;

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
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    AppLifecycle.createMainWindow();
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
    await AppLifecycle.initialize();
    console.log('✅ 🔥 기가차드 앱 초기화 완료!');
  } catch (error) {
    console.error('❌ 🔥 기가차드 앱 초기화 실패:', error);
    app.quit();
  }
});

/**
 * Handle before quit
 */
app.on('before-quit', (event) => {
  console.log('🔄 Application shutting down...');
  AppLifecycle.cleanup();
});

/**
 * Export for potential use in other modules
 */
export { app, isDev, isPackaged };
