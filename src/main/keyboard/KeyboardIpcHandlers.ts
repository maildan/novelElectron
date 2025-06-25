/**
 * 🔥 기가차드 키보드 IPC 핸들러
 * Loop Advanced Keyboard IPC Handlers - IPC 통신 관리
 */

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { SUCCESS_MESSAGES } from './constants';
import { GigaChadLogger } from './logger';
import type { TypedIpcHandler, KeyboardEngine, KeyboardConfig } from '@shared/types';

/**
 * 🔥 기가차드 키보드 IPC 핸들러
 */
export class KeyboardIpcHandlers {
  private registeredChannels: string[] = [];

  constructor() {}

  /**
   * IPC 핸들러 등록
   */
  public registerHandlers(handlers: TypedIpcHandler): void {
    for (const [channel, handler] of Object.entries(handlers)) {
      ipcMain.handle(channel, handler);
      this.registeredChannels.push(channel);
    }

    GigaChadLogger.info('KeyboardIpcHandlers', SUCCESS_MESSAGES.HANDLERS_REGISTERED);
  }

  /**
   * 기본 키보드 IPC 핸들러들 생성
   */
  public createDefaultHandlers(keyboardEngine: KeyboardEngine): TypedIpcHandler {
    return {
      // 모니터링 제어
      'keyboard-engine:start-monitoring': () => keyboardEngine.startMonitoring(),
      'keyboard-engine:stop-monitoring': () => keyboardEngine.stopMonitoring(),
      'keyboard-engine:toggle-monitoring': () => keyboardEngine.toggleMonitoring(),

      // 상태 조회
      'keyboard-engine:get-status': () => keyboardEngine.getMonitoringStatus(),
      'keyboard-engine:get-session-stats': () => keyboardEngine.getSessionStats(),
      'keyboard-engine:get-permissions': () => keyboardEngine.getPermissionStatus(),

      // 설정 관리
      'keyboard-engine:update-config': (_event: IpcMainInvokeEvent, config: Partial<KeyboardConfig>) => keyboardEngine.updateConfig(config),
      'keyboard-engine:get-config': () => keyboardEngine.getConfig(),

      // 권한 관리
      'keyboard-engine:open-permission-settings': () => keyboardEngine.openPermissionSettings(),
      'keyboard-engine:check-permissions': () => keyboardEngine.checkSystemPermissions(),

      // 세션 관리
      'keyboard-engine:start-new-session': () => keyboardEngine.startNewSession(),
      'keyboard-engine:end-current-session': () => keyboardEngine.endCurrentSession(),

      // 한글 조합
      'keyboard-engine:get-hangul-state': () => keyboardEngine.getHangulState(),
      'keyboard-engine:finish-composition': () => keyboardEngine.finishHangulComposition(),

      // 헬스체크
      'keyboard-engine:get-health': () => keyboardEngine.getHealthAlerts(),
      'keyboard-engine:get-performance-metrics': () => keyboardEngine.getPerformanceMetrics()
    };
  }

  /**
   * 특정 채널의 핸들러 등록
   */
  public registerHandler<T = unknown, R = unknown>(
    channel: string, 
    handler: (event: IpcMainInvokeEvent, ...args: T[]) => Promise<R> | R
  ): void {
    ipcMain.handle(channel, handler);
    this.registeredChannels.push(channel);
    
    GigaChadLogger.debug('KeyboardIpcHandlers', `IPC 핸들러 등록: ${channel}`);
  }

  /**
   * IPC 핸들러 해제
   */
  public unregisterHandlers(): void {
    for (const channel of this.registeredChannels) {
      ipcMain.removeHandler(channel);
    }

    GigaChadLogger.info('KeyboardIpcHandlers', '🔌 키보드 엔진 IPC 핸들러 해제 완료');
    this.registeredChannels.length = 0;
  }

  /**
   * 특정 채널의 핸들러 해제
   */
  public unregisterHandler(channel: string): void {
    ipcMain.removeHandler(channel);
    
    const index = this.registeredChannels.indexOf(channel);
    if (index > -1) {
      this.registeredChannels.splice(index, 1);
    }

    GigaChadLogger.debug('KeyboardIpcHandlers', `IPC 핸들러 해제: ${channel}`);
  }

  /**
   * 등록된 채널 목록 가져오기
   */
  public getRegisteredChannels(): string[] {
    return [...this.registeredChannels];
  }

  /**
   * 정리
   */
  public cleanup(): void {
    this.unregisterHandlers();
  }
}
