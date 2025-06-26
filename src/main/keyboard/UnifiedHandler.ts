import { Logger } from "../../shared/logger";
/**
 * 🔥 기가차드 통합 키보드 핸들러
 * Unified Keyboard Handler integrating all keyboard modules
 */

import { ipcMain, BrowserWindow } from 'electron';
import { KeyboardEngine, keyboardEngine } from './KeyboardEngine';
import type { KeyboardConfig } from './KeyboardEngine';
import { KeyboardPermissionManager } from './PermissionManager';
import type { PermissionCheckResult } from './PermissionManager';
import { KeyboardStatsManager } from './StatsManager';
import type { TypingStats, RealtimeStats } from './StatsManager';
import { HangulComposer } from './HangulComposer';
import type { SessionStats, LoopKeyboardEvent, DebugInfo, PermissionStatus } from '@shared/types';

export interface KeyboardSystemStatus {
  engine: {
    initialized: boolean;
    monitoring: boolean;
    listening: boolean;
  };
  permissions: PermissionCheckResult;
  session: TypingStats | null;
  realtime: RealtimeStats;
  hangul: {
    isComposing: boolean;
    currentResult: string;
  };
}

/**
 * 통합 키보드 핸들러
 * 모든 키보드 관련 기능을 IPC로 노출
 */
export class UnifiedKeyboardHandler {
  private static instance: UnifiedKeyboardHandler;
  private isRegistered: boolean = false;
  private mainWindow: BrowserWindow | null = null;
  
  // Manager 인스턴스들
  private permissionManager: KeyboardPermissionManager;
  private statsManager: KeyboardStatsManager;
  private hangulComposer: HangulComposer;

  private constructor() {
    // 매니저 인스턴스들 초기화
    this.permissionManager = KeyboardPermissionManager.getInstance();
    this.statsManager = KeyboardStatsManager.getInstance();
    this.hangulComposer = new HangulComposer();
  }

  static getInstance(): UnifiedKeyboardHandler {
    if (!UnifiedKeyboardHandler.instance) {
      UnifiedKeyboardHandler.instance = new UnifiedKeyboardHandler();
    }
    return UnifiedKeyboardHandler.instance;
  }

  /**
   * 핸들러 초기화 및 등록
   */
  async initialize(mainWindow: BrowserWindow): Promise<void> {
    Logger.info("Console", '🔌 통합 키보드 핸들러 초기화 시작...');
    
    this.mainWindow = mainWindow;
    
    // 이벤트 리스너 설정
    this.setupEventListeners();
    
    // IPC 핸들러 등록
    this.registerIpcHandlers();
    
    // 키보드 엔진 초기화 (인자 없이)
    await keyboardEngine.initialize();
    
    // 권한 확인
    await this.permissionManager.checkPermissions();
    
    this.isRegistered = true;
    Logger.info("Console", '✅ 통합 키보드 핸들러 초기화 완료');
  }

  /**
   * 이벤트 리스너 설정
   */
  private setupEventListeners(): void {
    // 키보드 엔진 이벤트
    keyboardEngine.on('initialized', (status) => {
      this.sendToRenderer('keyboard:engine-initialized', status);
    });

    keyboardEngine.on('monitoring-started', (status) => {
      this.sendToRenderer('keyboard:monitoring-started', status);
    });

    keyboardEngine.on('monitoring-stopped', (status) => {
      this.sendToRenderer('keyboard:monitoring-stopped', status);
    });

    keyboardEngine.on('key-event', (event) => {
      this.sendToRenderer('keyboard:key-event', event);
    });

    keyboardEngine.on('session-started', (session) => {
      this.sendToRenderer('keyboard:session-started', session);
    });

    keyboardEngine.on('session-ended', (session) => {
      this.sendToRenderer('keyboard:session-ended', session);
    });

    keyboardEngine.on('app-changed', (appInfo) => {
      this.sendToRenderer('keyboard:app-changed', appInfo);
    });

    keyboardEngine.on('hangul-composed', (composition) => {
      this.sendToRenderer('keyboard:hangul-composed', composition);
    });

    keyboardEngine.on('error', (error) => {
      this.sendToRenderer('keyboard:error', { message: error.message });
    });

    // 권한 관리자 이벤트
    this.permissionManager.on('permissions-checked', (result: PermissionCheckResult) => {
      this.sendToRenderer('keyboard:permissions-updated', result);
    });

    this.permissionManager.on('permission-status-changed', (result: PermissionCheckResult) => {
      this.sendToRenderer('keyboard:permissions-changed', result);
    });

    // 통계 관리자 이벤트
    this.statsManager.on('session-started', (session: SessionStats) => {
      this.sendToRenderer('keyboard:stats-session-started', session);
    });

    this.statsManager.on('session-ended', (session: SessionStats) => {
      this.sendToRenderer('keyboard:stats-session-ended', session);
    });

    this.statsManager.on('key-processed', (data: { keyEvent: LoopKeyboardEvent; stats: SessionStats }) => {
      this.sendToRenderer('keyboard:stats-updated', data);
    });

    this.statsManager.on('pattern-analysis-completed', (patterns: Array<{ pattern: string; count: number }>) => {
      this.sendToRenderer('keyboard:pattern-analysis', patterns);
    });

    Logger.info("Console", '🔗 키보드 시스템 이벤트 리스너 설정 완료');
  }

  /**
   * IPC 핸들러 등록
   */
  private registerIpcHandlers(): void {
    if (this.isRegistered) {
      Logger.warn("Console", '⚠️ IPC 핸들러가 이미 등록되어 있습니다');
      return;
    }

    const handlers = {
      // ===== 키보드 엔진 제어 =====
      'keyboard:start-monitoring': () => keyboardEngine.startListening(),
      'keyboard:stop-monitoring': () => keyboardEngine.stopListening(),
      'keyboard:toggle-monitoring': () => this.toggleMonitoring(),
      'keyboard:get-status': () => keyboardEngine.getStatus(),
      'keyboard:update-config': (_event: Electron.IpcMainInvokeEvent, config: Partial<KeyboardConfig>) => 
        keyboardEngine.updateConfig(config),
      'keyboard:get-config': () => this.getConfig(),

      // ===== 권한 관리 =====
      'keyboard:check-permissions': () => this.permissionManager.checkPermissions(),
      'keyboard:request-permissions': () => this.permissionManager.requestPermissions(),
      'keyboard:open-permission-settings': () => this.permissionManager.openSystemPreferences(),
      'keyboard:get-permission-status': () => this.getPermissionStatus(),
      'keyboard:start-permission-monitoring': () => this.startPermissionMonitoring(),
      'keyboard:stop-permission-monitoring': () => this.stopPermissionMonitoring(),

      // ===== 세션 관리 =====
      'keyboard:start-session': (_event: Electron.IpcMainInvokeEvent, appName: string, windowTitle?: string, language?: string) =>
        this.startSession(appName, windowTitle, language),
      'keyboard:end-session': () => this.endSession(),
      'keyboard:get-session-stats': () => keyboardEngine.getSessionData(),
      'keyboard:get-realtime-stats': () => this.getRealtimeStats(),

      // ===== 한글 조합 =====
      'keyboard:process-hangul-key': (_event: Electron.IpcMainInvokeEvent, key: string) => this.hangulComposer.processKey(key),
      'keyboard:get-hangul-state': () => this.hangulComposer.getState(),
      'keyboard:finish-hangul-composition': () => this.hangulComposer.finishComposition(),
      'keyboard:reset-hangul-composer': () => this.hangulComposer.reset(),
      'keyboard:decompose-hangul': (_event: Electron.IpcMainInvokeEvent, char: string) => this.decomposeHangul(char),
      'keyboard:is-hangul': (_event: Electron.IpcMainInvokeEvent, char: string) => this.isHangul(char),
      'keyboard:get-jamo-count': (_event: Electron.IpcMainInvokeEvent, text: string) => this.getJamoCount(text),

      // ===== 통계 및 분석 =====
      'keyboard:reset-stats': () => this.resetStats(),
      'keyboard:get-system-status': () => this.getSystemStatus(),

      // ===== 디버그 및 테스트 =====
      'keyboard:test-connection': () => this.testKeyboardConnection(),
      'keyboard:get-debug-info': () => this.getDebugInfo(),
      'keyboard:simulate-key-event': (_event: Electron.IpcMainInvokeEvent, keycode: number, type: 'keydown' | 'keyup') =>
        this.simulateKeyEvent(keycode, type),

      // ===== 설정 관리 =====
      'keyboard:get-language': () => 'korean', // 기본값
      'keyboard:set-language': (_event: Electron.IpcMainInvokeEvent, language: 'korean' | 'japanese' | 'chinese' | 'english') => {
        keyboardEngine.updateConfig({ language });
        return true;
      },
      'keyboard:enable-ime': (_event: Electron.IpcMainInvokeEvent, enabled: boolean) => {
        keyboardEngine.updateConfig({ enableIme: enabled });
        return true;
      },
      'keyboard:enable-global-shortcuts': (_event: Electron.IpcMainInvokeEvent, enabled: boolean) => {
        keyboardEngine.updateConfig({ enableGlobalShortcuts: enabled });
        return true;
      },
      'keyboard:enable-app-detection': (_event: Electron.IpcMainInvokeEvent, enabled: boolean) => {
        keyboardEngine.updateConfig({ enableAppDetection: enabled });
        return true;
      },

      // ===== 레거시 호환성 =====
      'start-keyboard-listener': () => keyboardEngine.startListening(),
      'stop-keyboard-listener': () => keyboardEngine.stopListening(),
      'get-keyboard-status': () => this.getSystemStatus(),
      'keyboard-test': () => this.testKeyboardConnection(),

      // ===== 추가 기능 =====
      'keyboard:export-session-data': () => this.exportSessionData(),
      'keyboard:import-session-data': (_event: Electron.IpcMainInvokeEvent, data: string) => this.importSessionData(data),
      'keyboard:get-typing-heatmap': () => this.getTypingHeatmap(),
      'keyboard:get-performance-metrics': () => this.getPerformanceMetrics()
    };

    // 핸들러 등록
    for (const [channel, handler] of Object.entries(handlers)) {
      ipcMain.handle(channel, handler);
    }

    Logger.info("Console", '📡 통합 키보드 IPC 핸들러 등록 완료');
  }

  /**
   * 시스템 전체 상태 조회
   */
  private async getSystemStatus(): Promise<KeyboardSystemStatus> {
    const engineStatus = keyboardEngine.getStatus();
    const permissionStatus = await this.permissionManager.checkPermissions();
    const sessionStats = this.statsManager.getCurrentSession();
    const realtimeStats = this.statsManager.getRealtimeStats();
    const hangulState = this.hangulComposer.getState();

    return {
      engine: {
        initialized: engineStatus.isInitialized,
        monitoring: engineStatus.isListening, // 모니터링 대신 listening 사용
        listening: engineStatus.isListening
      },
      permissions: permissionStatus,
      session: sessionStats,
      realtime: realtimeStats,
      hangul: {
        isComposing: hangulState.isComposing,
        currentResult: hangulState.result
      }
    };
  }

  /**
   * 키보드 연결 테스트
   */
  private async testKeyboardConnection(): Promise<{
    success: boolean;
    message: string;
    details: Record<string, unknown>;
  }> {
    try {
      const status = await this.getSystemStatus();
      
      const tests = {
        engineInitialized: status.engine.initialized,
        permissionsGranted: status.permissions.hasAllPermissions,
        canStartMonitoring: status.engine.initialized && status.permissions.hasAllPermissions,
        hangulComposerReady: true // hangulComposer는 항상 준비됨
      };

      const allTestsPassed = Object.values(tests).every(Boolean);

      return {
        success: allTestsPassed,
        message: allTestsPassed ? 
          '키보드 시스템이 정상적으로 작동하고 있습니다' :
          '키보드 시스템에 문제가 있습니다',
        details: {
          tests,
          status,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `키보드 연결 테스트 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        details: { error: error instanceof Error ? error.message : error }
      };
    }
  }

  /**
   * 디버그 정보 조회
   */
  private getDebugInfo(): DebugInfo {
    return {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      electronVersion: process.versions.electron,
      engineStatus: keyboardEngine.getStatus(),
      permissionStatus: this.permissionManager.getCurrentStatus(),
      sessionStats: this.statsManager.getCurrentSession(),
      realtimeStats: this.statsManager.getRealtimeStats(),
      hangulState: this.hangulComposer.getState(),
      timestamp: Date.now()
    };
  }

  /**
   * 키 이벤트 시뮬레이션 (테스트용)
   */
  private simulateKeyEvent(keycode: number, type: 'keydown' | 'keyup'): boolean {
    try {
      // 실제 구현에서는 keyboardEngine에 테스트 이벤트 전송
      Logger.info("Console", `🧪 키 이벤트 시뮬레이션: ${keycode} (${type})`);
      return true;
    } catch (error) {
      Logger.error("Console", '❌ 키 이벤트 시뮬레이션 실패:', error);
      return false;
    }
  }

  /**
   * 세션 데이터 내보내기
   */
  private exportSessionData(): string {
    try {
      const data = {
        currentSession: this.statsManager.getCurrentSession(),
        realtimeStats: this.statsManager.getRealtimeStats(),
        systemStatus: keyboardEngine.getStatus(),
        timestamp: Date.now()
      };
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      Logger.error("Console", '❌ 세션 데이터 내보내기 실패:', error);
      return JSON.stringify({ error: '데이터 내보내기 실패' });
    }
  }

  /**
   * 세션 데이터 가져오기
   */
  private importSessionData(data: string): boolean {
    try {
      const parsedData = JSON.parse(data);
      Logger.info("Console", '📥 세션 데이터 가져오기:', parsedData);
      
      // 실제 구현에서는 데이터 검증 및 복원 로직 추가
      return true;
    } catch (error) {
      Logger.error("Console", '❌ 세션 데이터 가져오기 실패:', error);
      return false;
    }
  }

  /**
   * 타이핑 히트맵 데이터
   */
  private getTypingHeatmap(): Record<string, unknown> | null {
    const session = this.statsManager.getCurrentSession();
    if (!session) return null;

    return {
      hourlyDistribution: session.hourlyDistribution,
      timestamp: Date.now()
    };
  }

  /**
   * 성능 메트릭 조회
   */
  private getPerformanceMetrics(): Record<string, unknown> {
    const engineStatus = keyboardEngine.getStatus();
    const realtimeStats = this.statsManager.getRealtimeStats();

    return {
      queueSize: engineStatus.queueSize,
      totalEvents: engineStatus.totalEvents,
      currentWPM: realtimeStats.currentWPM,
      currentCPM: realtimeStats.currentCPM,
      recentKeyInterval: realtimeStats.recentKeyInterval,
      memoryUsage: process.memoryUsage(),
      timestamp: Date.now()
    };
  }

  /**
   * 모니터링 토글
   */
  private async toggleMonitoring(): Promise<void> {
    const status = keyboardEngine.getStatus();
    if (status.isListening) {
      await keyboardEngine.stopListening();
    } else {
      await keyboardEngine.startListening();
    }
  }

  /**
   * 설정 가져오기
   */
  private getConfig(): KeyboardConfig {
    Logger.debug('UnifiedHandler', '설정 정보 가져오기 요청');
    // 기본 설정 반환 - 실제로는 ConfigManager에서 가져와야 함
    return {
      enabled: true,
      language: 'korean',
      enableIme: true,
      enableGlobalShortcuts: true,
      enableAppDetection: true,
      autoSaveInterval: 60000,
      debugMode: false,
      autoStartMonitoring: true,
      sessionTimeout: 30,
      enableBatchProcessing: true,
      batchSize: 100,
      debounceDelay: 300
    };
  }

  /**
   * 권한 상태 가져오기
   */
  private getPermissionStatus(): PermissionStatus {
    Logger.debug('UnifiedHandler', '권한 상태 가져오기 요청');
    // 기본 권한 상태 반환 - 실제로는 권한 확인 로직 필요
    return {
      accessibility: true,
      screenRecording: true,
      inputMonitoring: true,
      all: true
    };
  }

  /**
   * 권한 모니터링 시작
   */
  private startPermissionMonitoring(): void {
    // Permission manager 통해 모니터링 시작
  }

  /**
   * 권한 모니터링 중지
   */
  private stopPermissionMonitoring(): void {
    // Permission manager 통해 모니터링 중지
  }

  /**
   * 세션 시작
   */
  private startSession(appName: string, windowTitle?: string, language?: string): void {
    this.statsManager.startSession(`session_${Date.now()}`, appName, windowTitle, language);
  }

  /**
   * 세션 종료
   */
  private endSession(): void {
    this.statsManager.endSession();
  }

  /**
   * 실시간 통계 가져오기
   */
  private getRealtimeStats(): unknown {
    return this.statsManager.getRealtimeStats();
  }

  /**
   * 한글 분해
   */
  private decomposeHangul(char: string): unknown {
    return HangulComposer.decomposeHangul(char);
  }

  /**
   * 한글 여부 확인
   */
  private isHangul(char: string): boolean {
    return HangulComposer.isHangul(char);
  }

  /**
   * 자모 수 계산
   */
  private getJamoCount(text: string): number {
    return HangulComposer.getJamoCount(text);
  }

  /**
   * 통계 초기화
   */
  private resetStats(): void {
    this.statsManager.reset();
  }

  /**
   * 렌더러로 데이터 전송
   */
  private sendToRenderer(channel: string, data: unknown): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(channel, data);
    }
  }

  /**
   * IPC 핸들러 해제
   */
  private unregisterIpcHandlers(): void {
    const channels = [
      'keyboard:start-monitoring',
      'keyboard:stop-monitoring',
      'keyboard:toggle-monitoring',
      'keyboard:get-status',
      'keyboard:update-config',
      'keyboard:get-config',
      'keyboard:check-permissions',
      'keyboard:request-permissions',
      'keyboard:open-permission-settings',
      'keyboard:get-permission-status',
      'keyboard:start-permission-monitoring',
      'keyboard:stop-permission-monitoring',
      'keyboard:start-session',
      'keyboard:end-session',
      'keyboard:get-session-stats',
      'keyboard:get-realtime-stats',
      'keyboard:process-hangul-key',
      'keyboard:get-hangul-state',
      'keyboard:finish-hangul-composition',
      'keyboard:reset-hangul-composer',
      'keyboard:decompose-hangul',
      'keyboard:is-hangul',
      'keyboard:get-jamo-count',
      'keyboard:reset-stats',
      'keyboard:get-system-status',
      'keyboard:test-connection',
      'keyboard:get-debug-info',
      'keyboard:simulate-key-event',
      'keyboard:get-language',
      'keyboard:set-language',
      'keyboard:enable-ime',
      'keyboard:enable-global-shortcuts',
      'keyboard:enable-app-detection',
      'start-keyboard-listener',
      'stop-keyboard-listener',
      'get-keyboard-status',
      'keyboard-test',
      'keyboard:export-session-data',
      'keyboard:import-session-data',
      'keyboard:get-typing-heatmap',
      'keyboard:get-performance-metrics'
    ];

    for (const channel of channels) {
      ipcMain.removeHandler(channel);
    }

    Logger.info("Console", '🔌 통합 키보드 IPC 핸들러 해제 완료');
  }

  /**
   * 정리 및 종료
   */
  async cleanup(): Promise<void> {
    Logger.info("Console", '🧹 통합 키보드 핸들러 정리 시작...');

    try {
      // 권한 모니터링 중지
      this.permissionManager.stopMonitoring();

      // 키보드 엔진 정리
      await keyboardEngine.cleanup();

      // 통계 관리자 정리
      this.statsManager.cleanup();

      // 권한 관리자 정리
      this.permissionManager.cleanup();

      // IPC 핸들러 해제
      this.unregisterIpcHandlers();

      // 이벤트 리스너 제거
      keyboardEngine.removeAllListeners();
      this.permissionManager.removeAllListeners();
      this.statsManager.removeAllListeners();

      this.isRegistered = false;
      this.mainWindow = null;

      Logger.info("Console", '✅ 통합 키보드 핸들러 정리 완료');
    } catch (error) {
      Logger.error("Console", '❌ 통합 키보드 핸들러 정리 실패:', error);
    }
  }

  /**
   * 언어 설정
   */
  private setLanguage(language: string): void {
    // 언어 설정 로직
  }

  /**
   * IME 활성화/비활성화
   */
  private enableIME(enabled: boolean): void {
    // IME 설정 로직
  }

  /**
   * 전역 단축키 활성화/비활성화
   */
  private enableGlobalShortcuts(enabled: boolean): void {
    // 전역 단축키 설정 로직
  }

  /**
   * 앱 감지 활성화/비활성화
   */
  private enableAppDetection(enabled: boolean): void {
    // 앱 감지 설정 로직
  }
}

// Export singleton instance
export const unifiedKeyboardHandler = UnifiedKeyboardHandler.getInstance();
