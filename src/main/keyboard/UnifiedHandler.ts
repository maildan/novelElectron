/**
 * 🔥 기가차드 통합 키보드 핸들러
 * Unified Keyboard Handler integrating all keyboard modules
 */

import { ipcMain, BrowserWindow } from 'electron';
import { KeyboardEngine, keyboardEngine, KeyboardConfig } from './KeyboardEngine';
import { keyboardPermissionManager, PermissionCheckResult } from './PermissionManager';
import { keyboardStatsManager, TypingStats, RealtimeStats } from './StatsManager';
import { hangulComposer, HangulComposer } from './HangulComposer';

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

  private constructor() {}

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
    console.log('🔌 통합 키보드 핸들러 초기화 시작...');
    
    this.mainWindow = mainWindow;
    
    // 이벤트 리스너 설정
    this.setupEventListeners();
    
    // IPC 핸들러 등록
    this.registerIpcHandlers();
    
    // 키보드 엔진 초기화
    await keyboardEngine.initialize(mainWindow);
    
    // 권한 확인
    await keyboardPermissionManager.checkPermissions();
    
    this.isRegistered = true;
    console.log('✅ 통합 키보드 핸들러 초기화 완료');
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
    keyboardPermissionManager.on('permissions-checked', (result) => {
      this.sendToRenderer('keyboard:permissions-updated', result);
    });

    keyboardPermissionManager.on('permission-status-changed', (result) => {
      this.sendToRenderer('keyboard:permissions-changed', result);
    });

    // 통계 관리자 이벤트
    keyboardStatsManager.on('session-started', (session) => {
      this.sendToRenderer('keyboard:stats-session-started', session);
    });

    keyboardStatsManager.on('session-ended', (session) => {
      this.sendToRenderer('keyboard:stats-session-ended', session);
    });

    keyboardStatsManager.on('key-processed', (data) => {
      this.sendToRenderer('keyboard:stats-updated', data);
    });

    keyboardStatsManager.on('pattern-analysis-completed', (patterns) => {
      this.sendToRenderer('keyboard:pattern-analysis', patterns);
    });

    console.log('🔗 키보드 시스템 이벤트 리스너 설정 완료');
  }

  /**
   * IPC 핸들러 등록
   */
  private registerIpcHandlers(): void {
    if (this.isRegistered) {
      console.warn('⚠️ IPC 핸들러가 이미 등록되어 있습니다');
      return;
    }

    const handlers = {
      // ===== 키보드 엔진 제어 =====
      'keyboard:start-monitoring': () => keyboardEngine.startMonitoring(),
      'keyboard:stop-monitoring': () => keyboardEngine.stopMonitoring(),
      'keyboard:toggle-monitoring': () => keyboardEngine.toggleMonitoring(),
      'keyboard:get-status': () => this.getSystemStatus(),
      'keyboard:update-config': (_event: any, config: Partial<KeyboardConfig>) => 
        keyboardEngine.updateConfig(config),
      'keyboard:get-config': () => keyboardEngine.getConfig(),

      // ===== 권한 관리 =====
      'keyboard:check-permissions': () => keyboardPermissionManager.checkPermissions(),
      'keyboard:request-permissions': () => keyboardPermissionManager.requestPermissions(),
      'keyboard:open-permission-settings': () => keyboardPermissionManager.openSystemPreferences(),
      'keyboard:get-permission-status': () => keyboardPermissionManager.getCurrentStatus(),
      'keyboard:start-permission-monitoring': () => keyboardPermissionManager.startMonitoring(),
      'keyboard:stop-permission-monitoring': () => keyboardPermissionManager.stopMonitoring(),

      // ===== 세션 관리 =====
      'keyboard:start-session': (_event: any, appName: string, windowTitle?: string, language?: string) =>
        keyboardStatsManager.startSession(`session_${Date.now()}`, appName, windowTitle, language),
      'keyboard:end-session': () => keyboardStatsManager.endSession(),
      'keyboard:get-session-stats': () => keyboardStatsManager.getCurrentSession(),
      'keyboard:get-realtime-stats': () => keyboardStatsManager.getRealtimeStats(),

      // ===== 한글 조합 =====
      'keyboard:process-hangul-key': (_event: any, key: string) => hangulComposer.processKey(key),
      'keyboard:get-hangul-state': () => hangulComposer.getState(),
      'keyboard:finish-hangul-composition': () => hangulComposer.finishComposition(),
      'keyboard:reset-hangul-composer': () => hangulComposer.reset(),
      'keyboard:decompose-hangul': (_event: any, char: string) => HangulComposer.decomposeHangul(char),
      'keyboard:is-hangul': (_event: any, char: string) => HangulComposer.isHangul(char),
      'keyboard:get-jamo-count': (_event: any, text: string) => HangulComposer.getJamoCount(text),

      // ===== 통계 및 분석 =====
      'keyboard:reset-stats': () => keyboardStatsManager.reset(),
      'keyboard:get-system-status': () => this.getSystemStatus(),

      // ===== 디버그 및 테스트 =====
      'keyboard:test-connection': () => this.testKeyboardConnection(),
      'keyboard:get-debug-info': () => this.getDebugInfo(),
      'keyboard:simulate-key-event': (_event: any, keycode: number, type: 'keydown' | 'keyup') =>
        this.simulateKeyEvent(keycode, type),

      // ===== 설정 관리 =====
      'keyboard:get-language': () => keyboardEngine.getConfig()?.language || 'korean',
      'keyboard:set-language': (_event: any, language: 'korean' | 'japanese' | 'chinese' | 'english') => {
        keyboardEngine.updateConfig({ language });
        return true;
      },
      'keyboard:enable-ime': (_event: any, enabled: boolean) => {
        keyboardEngine.updateConfig({ enableIME: enabled });
        return true;
      },
      'keyboard:enable-global-shortcuts': (_event: any, enabled: boolean) => {
        keyboardEngine.updateConfig({ enableGlobalShortcuts: enabled });
        return true;
      },
      'keyboard:enable-app-detection': (_event: any, enabled: boolean) => {
        keyboardEngine.updateConfig({ enableAppDetection: enabled });
        return true;
      },

      // ===== 레거시 호환성 =====
      'start-keyboard-listener': () => keyboardEngine.startMonitoring(),
      'stop-keyboard-listener': () => keyboardEngine.stopMonitoring(),
      'get-keyboard-status': () => this.getSystemStatus(),
      'keyboard-test': () => this.testKeyboardConnection(),

      // ===== 추가 기능 =====
      'keyboard:export-session-data': () => this.exportSessionData(),
      'keyboard:import-session-data': (_event: any, data: string) => this.importSessionData(data),
      'keyboard:get-typing-heatmap': () => this.getTypingHeatmap(),
      'keyboard:get-performance-metrics': () => this.getPerformanceMetrics()
    };

    // 핸들러 등록
    for (const [channel, handler] of Object.entries(handlers)) {
      ipcMain.handle(channel, handler);
    }

    console.log('📡 통합 키보드 IPC 핸들러 등록 완료');
  }

  /**
   * 시스템 전체 상태 조회
   */
  private async getSystemStatus(): Promise<KeyboardSystemStatus> {
    const engineStatus = keyboardEngine.getMonitoringStatus();
    const permissionStatus = await keyboardPermissionManager.checkPermissions();
    const sessionStats = keyboardStatsManager.getCurrentSession();
    const realtimeStats = keyboardStatsManager.getRealtimeStats();
    const hangulState = hangulComposer.getState();

    return {
      engine: {
        initialized: engineStatus.isInitialized,
        monitoring: engineStatus.isMonitoring,
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
    details: any;
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
  private getDebugInfo(): any {
    return {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      electronVersion: process.versions.electron,
      engineStatus: keyboardEngine.getMonitoringStatus(),
      permissionStatus: keyboardPermissionManager.getCurrentStatus(),
      sessionStats: keyboardStatsManager.getCurrentSession(),
      realtimeStats: keyboardStatsManager.getRealtimeStats(),
      hangulState: hangulComposer.getState(),
      timestamp: Date.now()
    };
  }

  /**
   * 키 이벤트 시뮬레이션 (테스트용)
   */
  private simulateKeyEvent(keycode: number, type: 'keydown' | 'keyup'): boolean {
    try {
      // 실제 구현에서는 keyboardEngine에 테스트 이벤트 전송
      console.log(`🧪 키 이벤트 시뮬레이션: ${keycode} (${type})`);
      return true;
    } catch (error) {
      console.error('❌ 키 이벤트 시뮬레이션 실패:', error);
      return false;
    }
  }

  /**
   * 세션 데이터 내보내기
   */
  private exportSessionData(): string {
    try {
      const data = {
        currentSession: keyboardStatsManager.getCurrentSession(),
        realtimeStats: keyboardStatsManager.getRealtimeStats(),
        systemStatus: keyboardEngine.getMonitoringStatus(),
        timestamp: Date.now()
      };
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('❌ 세션 데이터 내보내기 실패:', error);
      return JSON.stringify({ error: '데이터 내보내기 실패' });
    }
  }

  /**
   * 세션 데이터 가져오기
   */
  private importSessionData(data: string): boolean {
    try {
      const parsedData = JSON.parse(data);
      console.log('📥 세션 데이터 가져오기:', parsedData);
      
      // 실제 구현에서는 데이터 검증 및 복원 로직 추가
      return true;
    } catch (error) {
      console.error('❌ 세션 데이터 가져오기 실패:', error);
      return false;
    }
  }

  /**
   * 타이핑 히트맵 데이터
   */
  private getTypingHeatmap(): any {
    const session = keyboardStatsManager.getCurrentSession();
    if (!session) return null;

    return {
      hourlyDistribution: session.hourlyDistribution,
      timestamp: Date.now()
    };
  }

  /**
   * 성능 메트릭 조회
   */
  private getPerformanceMetrics(): any {
    const engineStatus = keyboardEngine.getMonitoringStatus();
    const realtimeStats = keyboardStatsManager.getRealtimeStats();

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
   * 렌더러로 데이터 전송
   */
  private sendToRenderer(channel: string, data: any): void {
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

    console.log('🔌 통합 키보드 IPC 핸들러 해제 완료');
  }

  /**
   * 정리 및 종료
   */
  async cleanup(): Promise<void> {
    console.log('🧹 통합 키보드 핸들러 정리 시작...');

    try {
      // 권한 모니터링 중지
      keyboardPermissionManager.stopMonitoring();

      // 키보드 엔진 정리
      await keyboardEngine.cleanup();

      // 통계 관리자 정리
      keyboardStatsManager.cleanup();

      // 권한 관리자 정리
      keyboardPermissionManager.cleanup();

      // IPC 핸들러 해제
      this.unregisterIpcHandlers();

      // 이벤트 리스너 제거
      keyboardEngine.removeAllListeners();
      keyboardPermissionManager.removeAllListeners();
      keyboardStatsManager.removeAllListeners();

      this.isRegistered = false;
      this.mainWindow = null;

      console.log('✅ 통합 키보드 핸들러 정리 완료');
    } catch (error) {
      console.error('❌ 통합 키보드 핸들러 정리 실패:', error);
    }
  }
}

// Export singleton instance
export const unifiedKeyboardHandler = UnifiedKeyboardHandler.getInstance();
