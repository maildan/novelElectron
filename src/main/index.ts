/**
 * 🔥 기가차드 Electron 메인 프로세스 진입점
 * Loop Typing Analytics - Main Process Entry Point
 */

import { app, BrowserWindow } from 'electron';
import { isDev } from './utils/environment';
import { AppLifecycle } from './managers/AppLifecycle';

// 전역 상태
let appLifecycle: AppLifecycle | null = null;

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('🔧 Environment:', isDev ? 'Development' : 'Production');
  console.log('💻 Platform:', process.platform);
  console.log('📱 App: Loop v0.1.0');

  // AppLifecycle 인스턴스 생성
  appLifecycle = AppLifecycle.getInstance();

  // Electron 앱 이벤트 핸들러
  await app.whenReady();
  await appLifecycle.initializeApp();

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', async () => {
    await appLifecycle?.handleAppActivation();
  });

  app.on('before-quit', async () => {
    await appLifecycle?.cleanupApp();
  });

  // 단일 인스턴스 보장
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
  } else {
    app.on('second-instance', async () => {
      await appLifecycle?.handleSecondInstance();
    });
  }
}

// 프로그램 시작
main().catch(error => {
  console.error('❌ 앱 시작 실패:', error);
  process.exit(1);
});

export { appLifecycle };
