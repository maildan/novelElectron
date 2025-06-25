import { ipcMain } from 'electron';
import { SUCCESS_MESSAGES } from '../constants';
import { GigaChadLogger } from '../logger';

export interface KeyboardEngine {
  startMonitoring(): unknown;
  stopMonitoring(): unknown;
  toggleMonitoring(): unknown;
  getMonitoringStatus(): unknown;
  getSessionData(): unknown;
  getMetrics(): unknown;
  cleanup(): unknown;
  updateConfig(config: Record<string, unknown>): unknown;
  getConfig(): unknown;
  getPermissionStatus(): unknown;
}

export interface IpcHandler {
  [channel: string]: (...args: unknown[]) => unknown;
}

// 🔥 키보드 엔진 인터페이스 - any 박살내기

/**
 * 🔥 기가차드 키보드 IPC 핸들러
 */
export class KeyboardIpcHandlers {
  private registeredChannels: string[] = [];

  constructor() {}

  /**
   * IPC 핸들러 등록
   */
  public registerHandlers(handlers: IpcHandler): void {
    for (const [channel, handler] of Object.entries(handlers)) {
      ipcMain.handle(channel, handler);
      this.registeredChannels.push(channel);
    }

    GigaChadLogger.info('KeyboardIpcHandlers', SUCCESS_MESSAGES.HANDLERS_REGISTERED);
  }

  /**
   * 기본 키보드 IPC 핸들러들 생성
   */
  public createDefaultHandlers(keyboardEngine: KeyboardEngine): IpcHandler {
    return {
      // 모니터링 제어
      'keyboard-engine:start-monitoring': () => keyboardEngine.startMonitoring(),
      'keyboard-engine:stop-monitoring': () => keyboardEngine.stopMonitoring(),
      'keyboard-engine:toggle-monitoring': () => keyboardEngine.toggleMonitoring(),

      // 상태 조회
      'keyboard-engine:get-status': () => keyboardEngine.getMonitoringStatus(),
      'keyboard-engine:get-session-stats': () => keyboardEngine.getSessionData(),
      'keyboard-engine:get-permissions': () => keyboardEngine.getPermissionStatus(),

      // 설정 관리
      'keyboard-engine:update-config': (...args: unknown[]) => {
        const [config] = args as [Record<string, unknown>];
        return keyboardEngine.updateConfig(config);
      },
      'keyboard-engine:get-config': () => keyboardEngine.getConfig(),

      // 권한 관리 (임시 구현)
      'keyboard-engine:open-permission-settings': () => ({ success: false, message: 'Not implemented' }),
      'keyboard-engine:check-permissions': () => ({ success: true, message: 'Permissions OK' }),

      // 세션 관리 (임시 구현)
      'keyboard-engine:start-new-session': () => ({ success: true, sessionId: Date.now().toString() }),
      'keyboard-engine:end-current-session': () => ({ success: true }),

      // 한글 처리 (임시 구현)
      'keyboard-engine:get-hangul-state': () => ({ cho: '', jung: '', jong: '' }),
      'keyboard-engine:finish-composition': () => ({ success: true }),

      // 건강 및 성능 모니터링 (임시 구현)
      'keyboard-engine:get-health': () => [],
      'keyboard-engine:get-performance-metrics': () => ({ cpu: 0, memory: 0, keyrate: 0 })
    };
  }

  /**
   * 특정 채널의 핸들러 등록
   */
  public registerHandler(channel: string, handler: (...args: unknown[]) => unknown): void {
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
