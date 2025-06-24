/**
 * 🔥 기가차드 애플리케이션 정리 로직
 * Application Cleanup Logic
 */

import { BrowserWindow } from 'electron';
import type { AppState } from './app-initialization';

/**
 * 애플리케이션 정리
 */
export async function cleanupApplication(appState: AppState): Promise<void> {
  console.log('🧹 애플리케이션 정리 시작...');

  try {
    // 키보드 매니저 정리
    if (appState.keyboardManager) {
      console.log('⌨️ 키보드 매니저 정리 중...');
      await appState.keyboardManager.cleanup();
    }

    // 데이터베이스 연결 종료
    if (appState.databaseManager) {
      console.log('💾 데이터베이스 연결 종료 중...');
      await appState.databaseManager.disconnect();
    }

    // 메모리 매니저 정리
    if (appState.memoryManager) {
      console.log('🧠 메모리 매니저 정리 중...');
      await appState.memoryManager.cleanup();
    }

    // 정적 서버 종료
    if (appState.staticServer) {
      console.log('🌐 정적 서버 종료 중...');
      await appState.staticServer.stop();
    }

    // 시스템 모니터 정리
    if (appState.systemMonitor) {
      console.log('📊 시스템 모니터 정리 중...');
      await appState.systemMonitor.cleanup();
    }

    // 모든 윈도우 강제 종료
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length > 0) {
      console.log(`🪟 ${allWindows.length}개 윈도우 종료 중...`);
      allWindows.forEach(window => {
        if (!window.isDestroyed()) {
          window.destroy();
        }
      });
    }

    // IPC 핸들러 정리
    if (appState.ipcManager) {
      console.log('📡 IPC 핸들러 정리 중...');
      await appState.ipcManager.cleanup();
    }

    // 에러 매니저 정리
    if (appState.errorManager) {
      console.log('🚨 에러 매니저 정리 중...');
      await appState.errorManager.cleanup();
    }

    console.log('✅ 애플리케이션 정리 완료');
  } catch (error) {
    console.error('❌ 애플리케이션 정리 중 오류:', error);
    throw error;
  }
}

/**
 * 긴급 정리 (강제 종료 시)
 */
export function emergencyCleanup(): void {
  console.log('🚨 긴급 정리 시작...');

  try {
    // 모든 윈도우 즉시 종료
    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach(window => {
      if (!window.isDestroyed()) {
        window.destroy();
      }
    });

    console.log('✅ 긴급 정리 완료');
  } catch (error) {
    console.error('❌ 긴급 정리 중 오류:', error);
  }
}
