import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { isDev } from './utils/environment';
import { registerKeyboardListener, stopKeyboardListener } from './services/keyboardService';
import { initializeDatabase, closeDatabaseConnection } from './services/databaseService';
import { IPC_CHANNELS, type IpcResponse } from '@shared/types';

// 전역 변수
let mainWindow: BrowserWindow | null = null;

// 개발 환경에서 핫 리로드
if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}

async function createWindow(): Promise<void> {
  // BrowserWindow 생성
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/index.js')
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    icon: path.join(__dirname, '../../public/icon.png')
  });

  // 개발 환경에서는 Next.js dev 서버, 프로덕션에서는 빌드된 파일
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../renderer/out/index.html')}`;

  await mainWindow.loadURL(startUrl);

  // 개발 환경에서 DevTools 자동 열기
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // 윈도우 닫힘 이벤트 처리
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 앱 준비 완료 이벤트
app.whenReady().then(async () => {
  await createWindow();

  // macOS에서 독에서 앱 클릭시 윈도우 재생성
  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

// 모든 윈도우가 닫혔을 때
app.on('window-all-closed', () => {
  // macOS가 아닌 경우 앱 종료
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 앱 종료 전 정리 작업
app.on('before-quit', async () => {
  // 키보드 리스너 정리
  try {
    stopKeyboardListener();
    await closeDatabaseConnection();
  } catch (error) {
    console.error('앱 종료 중 오류:', error);
  }
});

// IPC 핸들러들
ipcMain.handle('app:getVersion', () => {
  return app.getVersion();
});

ipcMain.handle('app:getPlatform', () => {
  return process.platform;
});

// 키보드 모니터링 시작/중지 (테스트용)
ipcMain.handle('keyboard:start-monitoring', async () => {
  try {
    if (!mainWindow) {
      throw new Error('메인 윈도우가 없습니다.');
    }
    const started = registerKeyboardListener(mainWindow);
    return { success: started, message: started ? '키보드 모니터링 시작됨' : '키보드 모니터링 시작 실패' };
  } catch (error) {
    console.error('키보드 모니터링 시작 실패:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
});

ipcMain.handle('keyboard:stop-monitoring', async () => {
  try {
    const stopped = stopKeyboardListener();
    return { success: stopped, message: stopped ? '키보드 모니터링 중지됨' : '키보드 모니터링 중지 실패' };
  } catch (error) {
    console.error('키보드 모니터링 중지 실패:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
});

// 에러 핸들링
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log('🚀 Loop Electron App 시작됨 - 기가차드 버전');
