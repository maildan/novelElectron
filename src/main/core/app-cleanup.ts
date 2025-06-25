import { Logger } from "../../shared/logger";
const log = Logger;/**
 * 🔥 기가차드 애플리케이션 정리 로직
 * Application Cleanup Logic
 */

import { BrowserWindow } from 'electron';
import type { AppState } from '../managers/AppLifecycle';

/**
 * 애플리케이션 정리
 */
export async function cleanupApplication(appState: AppState): Promise<void> {
  log.info("Console", '🧹 애플리케이션 정리 시작...');

  try {
    // 🔥 통합 키보드 시스템 정리
    if (appState.unifiedKeyboardHandler) {
      log.info("Console", '🔥 통합 키보드 시스템 정리 중...');
      await appState.unifiedKeyboardHandler.cleanup();
    }

    // 레거시 키보드 매니저 정리
    if (appState.keyboardManager) {
      log.info("Console", '⌨️ 키보드 매니저 정리 중...');
      await appState.keyboardManager.cleanup();
    }

    // 데이터베이스 매니저 정리
    if (appState.databaseManager) {
      log.info("Console", '💾 데이터베이스 매니저 정리 중...');
      await appState.databaseManager.cleanup();
    }

    // IPC 매니저 정리
    if (appState.ipcManager) {
      log.info("Console", '📡 IPC 매니저 정리 중...');
      appState.ipcManager.cleanup();
    }

    // 보안 매니저 정리
    if (appState.securityManager) {
      log.info("Console", '🔒 보안 매니저 정리 중...');
      appState.securityManager.cleanup();
    }

    // 윈도우 매니저 정리
    if (appState.windowManager) {
      log.info("Console", '🪟 윈도우 매니저 정리 중...');
      await appState.windowManager.cleanup();
    }

    // 에러 매니저 정리
    if (appState.errorManager) {
      log.info("Console", '⚠️ 에러 매니저 정리 중...');
      await appState.errorManager.cleanup();
    }

    // 모든 윈도우 강제 종료
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length > 0) {
      log.info("Console", `🪟 ${allWindows.length}개 윈도우 종료 중...`);
      allWindows.forEach(window => {
        if (!window.isDestroyed()) {
          window.destroy();
        }
      });
    }

    // IPC 핸들러 정리
    if (appState.ipcManager) {
      log.info("Console", '📡 IPC 핸들러 정리 중...');
      await appState.ipcManager.cleanup();
    }

    log.info("Console", '✅ 애플리케이션 정리 완료');
  } catch (error) {
    log.error("Console", '❌ 애플리케이션 정리 중 오류:', error);
    throw error;
  }
}

/**
 * 긴급 정리 (강제 종료 시)
 */
export function emergencyCleanup(): void {
  log.info("Console", '🚨 긴급 정리 시작...');

  try {
    // 모든 윈도우 즉시 종료
    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach(window => {
      if (!window.isDestroyed()) {
        window.destroy();
      }
    });

    log.info("Console", '✅ 긴급 정리 완료');
  } catch (error) {
    log.error("Console", '❌ 긴급 정리 중 오류:', error);
  }
}
