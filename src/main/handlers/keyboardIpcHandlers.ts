// 🔥 기가차드 키보드 IPC 핸들러 - 다국어 모니터링 전문!

import { ipcMain, BrowserWindow } from 'electron';
import { Logger } from '../../shared/logger';
import { IPC_CHANNELS } from '../../shared/types';
import { createSafeIpcHandler, createSafeAsyncIpcHandler } from '../../shared/ipc-utils';
import { keyboardService } from '../services/keyboardService';

// #DEBUG: Keyboard IPC handlers entry point
console.time('KEYBOARD_IPC_SETUP');
Logger.debug('KEYBOARD_IPC', 'Setting up keyboard IPC handlers');

// 🔥 기가차드 키보드 모니터링 IPC 핸들러 설정
export function setupKeyboardIpcHandlers(): void {
  try {
    // #DEBUG: Registering keyboard monitoring handlers
    
    // 🔥 모니터링 시작
    ipcMain.handle(
      IPC_CHANNELS.KEYBOARD.START_MONITORING,
      createSafeAsyncIpcHandler(
        async (event) => {
          // #DEBUG: IPC call - start monitoring
          Logger.debug('KEYBOARD_IPC', 'IPC: Start monitoring requested');
          const result = await keyboardService.startMonitoring();
          return result.data;
        },
        'KEYBOARD_IPC',
        'Start keyboard monitoring'
      )
    );

    // 🔥 모니터링 중지
    ipcMain.handle(
      IPC_CHANNELS.KEYBOARD.STOP_MONITORING,
      createSafeAsyncIpcHandler(
        async (event) => {
          // #DEBUG: IPC call - stop monitoring
          Logger.debug('KEYBOARD_IPC', 'IPC: Stop monitoring requested');
          const result = await keyboardService.stopMonitoring();
          return result.data;
        },
        'KEYBOARD_IPC',
        'Stop keyboard monitoring'
      )
    );

    // 🔥 모니터링 상태 조회
    ipcMain.handle(
      IPC_CHANNELS.KEYBOARD.GET_STATUS,
      createSafeIpcHandler(
        (event) => {
          // #DEBUG: IPC call - get status
          Logger.debug('KEYBOARD_IPC', 'IPC: Status requested');
          const result = keyboardService.getStatus();
          return result.data;
        },
        'KEYBOARD_IPC',
        'Get keyboard monitoring status'
      )
    );

    // 🔥 언어 설정 변경
    ipcMain.handle(
      'keyboard:set-language',
      createSafeIpcHandler(
        (event: unknown, language: unknown) => {
          // #DEBUG: IPC call - set language
          const langStr = String(language);
          Logger.debug('KEYBOARD_IPC', 'IPC: Set language requested', { language: langStr });
          return keyboardService.setLanguage(langStr);
        },
        'KEYBOARD_IPC',
        'Set keyboard language'
      )
    );

    // 🔥 최근 이벤트 조회
    ipcMain.handle(
      'keyboard:get-recent-events',
      createSafeIpcHandler(
        (event: unknown, count: unknown = 10) => {
          // #DEBUG: IPC call - get recent events
          const countNum = typeof count === 'number' ? count : 10;
          Logger.debug('KEYBOARD_IPC', 'IPC: Recent events requested', { count: countNum });
          return keyboardService.getRecentEvents(countNum);
        },
        'KEYBOARD_IPC',
        'Get recent keyboard events'
      )
    );

    // 🔥 키보드 이벤트 포워딩 설정
    keyboardService.on('keyboard-event', (event) => {
      // #DEBUG: Forwarding keyboard event to renderer
      const mainWindow = (global as Record<string, unknown>).mainWindow as BrowserWindow | undefined;
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(IPC_CHANNELS.KEYBOARD.EVENT, event);
        Logger.debug('KEYBOARD_IPC', 'Event forwarded to renderer', {
          eventType: event.type,
          language: event.language
        });
      }
    });

    console.timeEnd('KEYBOARD_IPC_SETUP');
    Logger.info('KEYBOARD_IPC', 'Keyboard IPC handlers setup completed', {
      handlersCount: 5,
      setupTime: 'measured'
    });

  } catch (error) {
    Logger.error('KEYBOARD_IPC', 'Failed to setup keyboard IPC handlers', error);
    throw error;
  }
}

// 🔥 기가차드 IPC 핸들러 정리
export function cleanupKeyboardIpcHandlers(): void {
  try {
    // #DEBUG: Cleaning up keyboard IPC handlers
    Logger.debug('KEYBOARD_IPC', 'Cleaning up keyboard IPC handlers');

    // 모든 키보드 관련 IPC 핸들러 제거
    ipcMain.removeHandler(IPC_CHANNELS.KEYBOARD.START_MONITORING);
    ipcMain.removeHandler(IPC_CHANNELS.KEYBOARD.STOP_MONITORING);
    ipcMain.removeHandler(IPC_CHANNELS.KEYBOARD.GET_STATUS);
    ipcMain.removeHandler('keyboard:set-language');
    ipcMain.removeHandler('keyboard:get-recent-events');

    // 키보드 서비스 이벤트 리스너 정리
    keyboardService.removeAllListeners();

    Logger.info('KEYBOARD_IPC', 'Keyboard IPC handlers cleaned up');

  } catch (error) {
    Logger.error('KEYBOARD_IPC', 'Failed to cleanup keyboard IPC handlers', error);
  }
}

// #DEBUG: Keyboard IPC handlers module exit point
Logger.debug('KEYBOARD_IPC', 'Keyboard IPC handlers module loaded');

export default {
  setupKeyboardIpcHandlers,
  cleanupKeyboardIpcHandlers,
};
