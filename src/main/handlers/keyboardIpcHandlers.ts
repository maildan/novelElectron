// 🔥 기가차드 키보드 IPC 핸들러 - 다국어 모니터링 전문!

import { ipcMain, BrowserWindow } from 'electron';
import { Logger } from '../../shared/logger';
import { IPC_CHANNELS } from '../../shared/types';
import { createSafeIpcHandler, createSafeAsyncIpcHandler } from '../../shared/ipc-utils';
import { keyboardService } from '../keyboard/keyboardService';

// #DEBUG: Keyboard IPC handlers entry point
Logger.time('KEYBOARD_IPC_SETUP');
Logger.debug('KEYBOARD_IPC', 'Setting up keyboard IPC handlers');

// 🔥 기가차드 키보드 모니터링 IPC 핸들러 설정
export function setupKeyboardIpcHandlers(): void {
  try {
    // #DEBUG: Registering keyboard monitoring handlers
    
    // 🔥 모니터링 시작
    ipcMain.handle(
      IPC_CHANNELS.KEYBOARD.START_MONITORING,
      createSafeAsyncIpcHandler
      (
        async (event) => {
          // #DEBUG: IPC call - start monitoring
          Logger.debug('KEYBOARD_IPC', 'IPC: Start monitoring requested');
          
          // 🔥 모니터링 시작 시 권한 체크
          const loopApp = (global as any).loopApp;
          if (loopApp && typeof loopApp.checkAndRequestPermissions === 'function') {
            const hasPermission = await loopApp.checkAndRequestPermissions();
            
            if (!hasPermission) {
              throw new Error('Accessibility permission required to start monitoring');
            }
          }
          
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
      createSafeAsyncIpcHandler(
        async (event) => {
          // #DEBUG: IPC call - get status
          Logger.debug('KEYBOARD_IPC', 'IPC: Status requested');
          const result = await keyboardService.getStatus();
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
          
          // 🔥 현재는 한국어 강제 설정만 지원
          if (langStr === 'ko') {
            return keyboardService.forceKorean();
          }
          
          return {
            success: true,
            data: true,
            timestamp: new Date()
          };
        },
        'KEYBOARD_IPC',
        'Set keyboard language'
      )
    );

    // 🔥 최근 이벤트 조회 (현재는 실시간 통계로 대체)
    ipcMain.handle(
      'keyboard:get-recent-events',
      createSafeIpcHandler(
        (event: unknown, count: unknown = 10) => {
          // #DEBUG: IPC call - get recent events
          const countNum = typeof count === 'number' ? count : 10;
          Logger.debug('KEYBOARD_IPC', 'IPC: Recent events requested', { count: countNum });
          
          // 🔥 현재는 실시간 통계로 대체
          return keyboardService.getRealtimeStats();
        },
        'KEYBOARD_IPC',
        'Get recent keyboard events'
      )
    );

    // 🔥 실시간 통계 조회
    ipcMain.handle('keyboard:get-realtime-stats', createSafeAsyncIpcHandler(
      async () => {
        Logger.debug('KEYBOARD_IPC', 'IPC: Get realtime stats requested');
        
        try {
          // TODO: 실제 실시간 통계 구현
          const realtimeStats = {
            currentWpm: 0,
            charactersTyped: 0,
            sessionTime: 0,
            accuracy: 0,
          };
          
          return realtimeStats;
        } catch (error) {
          Logger.error('KEYBOARD_IPC', 'Failed to get realtime stats', error);
          throw error;
        }
      },
      'KEYBOARD_IPC',
      'Get realtime statistics'
    ));

    // 🔥 한글 강제 설정 (디버깅용)
    ipcMain.handle('keyboard:force-korean', createSafeAsyncIpcHandler(
      async () => {
        Logger.info('KEYBOARD_IPC', 'IPC: Force Korean language requested');
        
        const result = keyboardService.forceKorean();
        
        Logger.info('KEYBOARD_IPC', 'Force Korean result', { success: result.success });
        return result;
      },
      'KEYBOARD_IPC',
      'Force Korean language setting'
    ));

    // 🔥 언어 감지 테스트 (디버깅용)
    ipcMain.handle('keyboard:test-language-detection', createSafeAsyncIpcHandler(
      async (event, ...args: unknown[]) => {
        const keycode = args[0] as number;
        
        Logger.info('KEYBOARD_IPC', 'IPC: Language detection test requested', { keycode });
        
        const result = keyboardService.testLanguageDetection(keycode);
        
        Logger.info('KEYBOARD_IPC', 'Language detection test result', { result, keycode });
        return result;
      },
      'KEYBOARD_IPC',
      'Test language detection'
    ));

    // 🔥 새로운 다국어 지원 IPC 핸들러들

    // 언어 감지 (단일 키코드)
    ipcMain.handle('keyboard:detect-language', createSafeIpcHandler(
      (event: unknown, keycode: unknown) => {
        const keycodeNum = typeof keycode === 'number' ? keycode : 0;
        Logger.debug('KEYBOARD_IPC', 'IPC: Detect language requested', { keycode: keycodeNum });
        
        const detectedLanguage = keyboardService.testLanguageDetection(keycodeNum);
        
        Logger.debug('KEYBOARD_IPC', 'Language detected', { keycode: keycodeNum, detectedLanguage });
        return detectedLanguage;
      },
      'KEYBOARD_IPC',
      'Detect language from keycode'
    ));

    // 지원되는 언어 목록 조회
    ipcMain.handle('keyboard:get-supported-languages', createSafeIpcHandler(
      () => {
        Logger.debug('KEYBOARD_IPC', 'IPC: Get supported languages requested');
        
        const supportedLanguages = ['ko', 'en', 'ja', 'zh'];
        
        Logger.debug('KEYBOARD_IPC', 'Supported languages returned', { languages: supportedLanguages });
        return supportedLanguages;
      },
      'KEYBOARD_IPC',
      'Get supported languages'
    ));

    // 입력 방식 설정
    ipcMain.handle('keyboard:set-input-method', createSafeAsyncIpcHandler(
      async (event: unknown, method: unknown) => {
        const methodStr = typeof method === 'string' ? method as 'direct' | 'composition' : 'composition';
        Logger.info('KEYBOARD_IPC', 'IPC: Set input method requested', { method: methodStr });
        
        // 🔥 입력 방식에 따른 언어 설정
        if (methodStr === 'composition') {
          const result = keyboardService.forceKorean();
          Logger.info('KEYBOARD_IPC', 'Input method set to composition (Korean)', { result });
          return result;
        } else {
          Logger.info('KEYBOARD_IPC', 'Input method set to direct (English)', { method: methodStr });
          return {
            success: true,
            data: true,
            timestamp: new Date()
          };
        }
      },
      'KEYBOARD_IPC',
      'Set input method'
    ));

    // 조합 상태 초기화
    ipcMain.handle('keyboard:reset-composition', createSafeIpcHandler(
      () => {
        Logger.info('KEYBOARD_IPC', 'IPC: Reset composition requested');
        
        // 🔥 한글 조합 상태 초기화
        const result = keyboardService.forceKorean();
        
        Logger.info('KEYBOARD_IPC', 'Composition reset', { result });
        return result;
      },
      'KEYBOARD_IPC',
      'Reset composition state'
    ));

    // 조합 상태 조회
    ipcMain.handle('keyboard:get-composition-state', createSafeAsyncIpcHandler(
      async () => {
        Logger.debug('KEYBOARD_IPC', 'IPC: Get composition state requested');
        
        const status = await keyboardService.getStatus();
        const compositionState = {
          isComposing: status.data?.language === 'ko',
          composingText: '' // 🔥 추후 HangulComposer에서 실제 조합 중인 텍스트 반환
        };
        
        Logger.debug('KEYBOARD_IPC', 'Composition state returned', compositionState);
        return compositionState;
      },
      'KEYBOARD_IPC',
      'Get composition state'
    ));

    // 🔥 키보드 이벤트 포워딩 설정
    keyboardService.on('keyboard-event', (event: unknown) => {
      // #DEBUG: Forwarding keyboard event to renderer
      const mainWindow = (global as Record<string, unknown>).mainWindow as BrowserWindow | undefined;
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(IPC_CHANNELS.KEYBOARD.EVENT, event);
        
        // 타입 가드로 안전하게 로깅
        const eventData = event as { type?: string; language?: string };
        Logger.debug('KEYBOARD_IPC', 'Event forwarded to renderer', {
          eventType: eventData.type || 'unknown',
          language: eventData.language || 'unknown'
        });
      }
    });

    Logger.timeEnd('KEYBOARD_IPC_SETUP');
    Logger.info('KEYBOARD_IPC', 'Keyboard IPC handlers setup completed', {
      handlersCount: 6,
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
    ipcMain.removeHandler('keyboard:get-realtime-stats');
    ipcMain.removeHandler('keyboard:force-korean');
    ipcMain.removeHandler('keyboard:test-language-detection');
    ipcMain.removeHandler('keyboard:detect-language');
    ipcMain.removeHandler('keyboard:get-supported-languages');
    ipcMain.removeHandler('keyboard:set-input-method');
    ipcMain.removeHandler('keyboard:reset-composition');
    ipcMain.removeHandler('keyboard:get-composition-state');

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
