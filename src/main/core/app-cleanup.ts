/**
 * 🔥 기가차드 애플리케이션 정리 로직
 * Application Cleanup Logic
 */

import { BrowserWindow } from 'electron';
import type { AppState } from '../managers/AppLifecycle';

/**
 * 애플리케이션 정리
 */
export async function cleanupApplication(appState: AppState): Promise<void> {
  console.log('🧹 애플리케이션 정리 시작...');

  try {
    // 🔥 통합 키보드 시스템 정리
    if (appState.unifiedKeyboardHandler) {
      console.log('🔥 통합 키보드 시스템 정리 중...');
      await appState.unifiedKeyboardHandler.cleanup();
    }

    // 레거시 키보드 매니저 정리
    if (appState.keyboardManager) {
      console.log('⌨️ 키보드 매니저 정리 중...');
      await appState.keyboardManager.cleanup();
    }

    // 데이터베이스 매니저 정리
    if (appState.databaseManager) {
      console.log('💾 데이터베이스 매니저 정리 중...');
      await appState.databaseManager.cleanup();
    }

    // IPC 매니저 정리
    if (appState.ipcManager) {
      console.log('📡 IPC 매니저 정리 중...');
      appState.ipcManager.cleanup();
    }

    // 보안 매니저 정리
    if (appState.securityManager) {
      console.log('🔒 보안 매니저 정리 중...');
      appState.securityManager.cleanup();
    }

    // 윈도우 매니저 정리
    if (appState.windowManager) {
      console.log('🪟 윈도우 매니저 정리 중...');
      await appState.windowManager.cleanup();
    }

    // 에러 매니저 정리
    if (appState.errorManager) {
      console.log('⚠️ 에러 매니저 정리 중...');
      await appState.errorManager.cleanup();
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
