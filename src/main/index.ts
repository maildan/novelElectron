/**
 * 🔥 기가차드 Electron 메인 프로세스 진입점
 * Loop Typing Analytics - Main Process Entry Point
 * 
 * 통합 키보드 시스템 및 모듈식 아키텍처 적용
 */

import { app, BrowserWindow } from 'electron';
import { isDev } from './utils/environment';
import { AppLifecycle } from './managers/AppLifecycle';
import { initializeAppConfig } from './config/app-config';

// 전역 상태
let appLifecycle: AppLifecycle | null = null;

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('🚀 Loop Typing Analytics 시작');
  console.log('🔧 Environment:', isDev ? 'Development' : 'Production');
  console.log('💻 Platform:', process.platform);
  console.log('🏗️ Architecture:', process.arch);
  console.log('📱 App: Loop v0.1.0 - 기가차드 에디션');

  // 앱 설정 초기화
  const config = initializeAppConfig();
  console.log('⚙️ 앱 설정 로드 완료');

  // AppLifecycle 인스턴스 생성
  appLifecycle = AppLifecycle.getInstance();

  // Electron 앱 이벤트 핸들러
  await app.whenReady();
  console.log('🎯 Electron 앱 준비 완료');
  
  await appLifecycle.initializeApp();
  console.log('🔥 기가차드 앱 시스템 초기화 완료');

  // 앱 라이프사이클 이벤트 처리
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      console.log('🪟 모든 윈도우 닫힘 - 종료');
      app.quit();
    }
  });

  app.on('activate', async () => {
    console.log('🔄 앱 활성화');
    await appLifecycle?.handleAppActivation();
  });

  app.on('before-quit', async () => {
    console.log('🛑 앱 종료 전 정리');
    await appLifecycle?.cleanupApp();
  });

  // 단일 인스턴스 보장
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    console.log('💡 이미 실행 중인 인스턴스가 있어 종료');
    app.quit();
  } else {
    app.on('second-instance', async () => {
      console.log('👥 두 번째 인스턴스 시도 감지');
      await appLifecycle?.handleSecondInstance();
    });
  }
}

// 프로그램 시작
main().catch(error => {
  console.error('❌ Loop 앱 시작 실패:', error);
  console.error('📋 에러 스택:', error.stack);
  process.exit(1);
});

export { appLifecycle };
