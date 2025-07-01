// 🔥 기가차드 키보드 서비스 - 완전 모듈화된 새 버전

import { EventEmitter } from 'events';
import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import type { 
  ProcessedKeyboardEvent, 
  MonitoringStatus,
  RealtimeStats,
  Result,
  KeyInputData
} from '../../shared/types';

// 🔥 코어 매니저들 (main/managers)
import { KeyboardPermissionManager } from '../managers/KeyboardPermissionManager';
import { KeyboardStatsManager } from '../managers/KeyboardStatsManager';
import { SessionManager } from '../managers/SessionManager';

// 🔥 핸들러들 (main/handlers)
import { MacOSKeyboardHandler } from '../handlers/MacOSKeyboardHandler';

// 🔥 키보드 전용 모듈들 (keyboard/)
import { WindowTracker } from './WindowTracker';
import { HangulComposer } from './HangulComposer';
import { KeyboardEventProcessor } from './KeyboardEventProcessor';

/**
 * 🔥 KeyboardService - 모듈화된 키보드 서비스 (DI 패턴)
 * 
 * 책임:
 * - 모듈 간 조정 및 오케스트레이션
 * - 이벤트 흐름 관리
 * - 외부 API 제공
 * 
 * 의존성:
 * - PermissionManager: 권한 관리
 * - StatsManager: 통계 계산  
 * - SessionManager: 세션 관리
 * - EventProcessor: 이벤트 처리
 * - Handlers: 플랫폼별 처리
 */
export class KeyboardService extends BaseManager {
  private readonly componentName = 'KEYBOARD_SERVICE';
  private isMonitoring = false;
  private eventEmitter: EventEmitter;

  // 🔥 의존성 주입된 모듈들
  private permissionManager: KeyboardPermissionManager;
  private statsManager: KeyboardStatsManager;
  private sessionManager: SessionManager;
  private eventProcessor: KeyboardEventProcessor;
  private windowTracker: WindowTracker;
  private hangulComposer: HangulComposer;
  private macOSHandler: MacOSKeyboardHandler | null = null;

  constructor() {
    super({
      name: 'KeyboardService',
      autoStart: false
    });

    this.eventEmitter = new EventEmitter();
    
    // 🔥 의존성 주입 (IoC Container 패턴)
    this.permissionManager = new KeyboardPermissionManager();
    this.statsManager = new KeyboardStatsManager();
    this.sessionManager = new SessionManager();
    this.eventProcessor = new KeyboardEventProcessor();
    this.windowTracker = new WindowTracker();
    this.hangulComposer = new HangulComposer();

    // Platform-specific handlers
    if (process.platform === 'darwin') {
      this.macOSHandler = new MacOSKeyboardHandler(this.windowTracker);
    }
    
    Logger.info(this.componentName, '모듈화된 키보드 서비스 초기화됨', {
      platform: process.platform,
      hasHandlers: !!this.macOSHandler
    });
  }

  /**
   * BaseManager 구현
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, '키보드 서비스 초기화 시작');

    // 의존성 모듈들 초기화
    await this.permissionManager.initialize();
    await this.statsManager.initialize();
    await this.sessionManager.initialize();
    await this.eventProcessor.initialize();
    await this.windowTracker.initialize();
    await this.hangulComposer.initialize();

    // 이벤트 연결
    this.setupEventHandlers();
  }

  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, '키보드 서비스 시작됨');
    
    // 모든 모듈 시작
    await this.permissionManager.start();
    await this.statsManager.start();
    await this.sessionManager.start();
    await this.eventProcessor.start();
    await this.windowTracker.start();
    await this.hangulComposer.start();
  }

  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, '키보드 서비스 중지됨');

    if (this.isMonitoring) {
      await this.stopMonitoring();
    }

    // 모든 모듈 중지
    await this.hangulComposer.stop();
    await this.windowTracker.stop();
    await this.eventProcessor.stop();
    await this.sessionManager.stop();
    await this.statsManager.stop();
    await this.permissionManager.stop();
  }

  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, '키보드 서비스 정리됨');

    // 모든 모듈 정리
    await this.hangulComposer.cleanup();
    await this.windowTracker.cleanup();
    await this.eventProcessor.cleanup();
    await this.sessionManager.cleanup();
    await this.statsManager.cleanup();
    await this.permissionManager.cleanup();

    this.eventEmitter.removeAllListeners();
  }

  /**
   * 🔥 공개 API - 모니터링 시작
   */
  public async startMonitoring(): Promise<Result<boolean>> {
    try {
      if (this.isMonitoring) {
        return { success: true, data: true };
      }

      // 1. 권한 확인
      const permissionResult = await this.permissionManager.checkPermissions();
      if (!permissionResult.success || !permissionResult.data) {
        return { 
          success: false, 
          error: '키보드 접근 권한이 필요합니다' 
        };
      }

      // 2. 세션 시작
      await this.sessionManager.startKeyboardSession();

      // 3. 이벤트 프로세서 시작 (BaseManager의 start() 사용)
      if (!this.eventProcessor.isRunning()) {
        await this.eventProcessor.start();
      }

      this.isMonitoring = true;

      Logger.info(this.componentName, '키보드 모니터링 시작됨');
      this.eventEmitter.emit('monitoring-started');

      return { success: true, data: true };

    } catch (error) {
      Logger.error(this.componentName, '모니터링 시작 실패', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * 🔥 공개 API - 모니터링 중지
   */
  public async stopMonitoring(): Promise<Result<boolean>> {
    try {
      if (!this.isMonitoring) {
        return { success: true, data: true };
      }

      // 1. 이벤트 프로세서 중지
      if (this.eventProcessor.isRunning()) {
        await this.eventProcessor.stop();
      }

      // 2. 세션 종료
      await this.sessionManager.endKeyboardCurrentSession();

      this.isMonitoring = false;

      Logger.info(this.componentName, '키보드 모니터링 중지됨');
      this.eventEmitter.emit('monitoring-stopped');

      return { success: true, data: true };

    } catch (error) {
      Logger.error(this.componentName, '모니터링 중지 실패', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * 🔥 공개 API - 상태 조회
   */
  public async getStatus(): Promise<Result<MonitoringStatus>> {
    try {
      const session = this.sessionManager.getKeyboardCurrentSession();
      
      const status: MonitoringStatus = {
        isActive: this.isMonitoring,
        startTime: session?.startTime,
        sessionDuration: session ? 
          Date.now() - session.startTime.getTime() : 0,
        language: 'auto'
      };

      return { success: true, data: status };

    } catch (error) {
      Logger.error(this.componentName, '상태 조회 실패', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * 🔥 공개 API - 실시간 통계 조회
   */
  public async getRealtimeStats(): Promise<Result<RealtimeStats>> {
    try {
      // 기본 통계를 직접 생성 (실제 StatsManager 메서드가 없으므로)
      const session = this.sessionManager.getKeyboardCurrentSession();
      
      const stats: RealtimeStats = {
        currentWpm: session?.wpm || 0,
        accuracy: session?.accuracy || 100,
        sessionTime: session ? Date.now() - session.startTime.getTime() : 0,
        charactersTyped: session?.keyCount || 0,
        errorsCount: 0
      };

      return { success: true, data: stats };

    } catch (error) {
      Logger.error(this.componentName, '통계 조회 실패', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * 🔥 이벤트 핸들러 설정
   */
  private setupEventHandlers(): void {
    // 이벤트 프로세서에서 오는 키 이벤트 처리
    this.eventProcessor.on('keyboard-event', async (event: ProcessedKeyboardEvent) => {
      await this.handleProcessedKeyEvent(event);
    });

    // 통계 업데이트 이벤트
    this.statsManager.on('stats-updated', (stats: RealtimeStats) => {
      this.eventEmitter.emit('stats-updated', stats);
    });

    // 세션 이벤트
    this.sessionManager.on('session-started', (session) => {
      this.eventEmitter.emit('session-started', session);
    });

    this.sessionManager.on('session-ended', (session) => {
      this.eventEmitter.emit('session-ended', session);
    });

    Logger.debug(this.componentName, '이벤트 핸들러 설정 완료');
  }

  /**
   * 🔥 처리된 키 이벤트 핸들링
   */
  private async handleProcessedKeyEvent(event: ProcessedKeyboardEvent): Promise<void> {
    try {
      // 1. 세션에 기록
      this.sessionManager.recordKeyboardInput({
        character: event.composedChar || event.key,
        timestamp: event.timestamp,
        language: event.language,
        windowInfo: {
          title: event.windowTitle,
          processName: 'Unknown'
        },
        inputMethod: (event.inputMethod || 'direct') as 'ime' | 'direct' | 'composition' | 'complete'
      });

      // 2. 통계는 세션 매니저에서 자동으로 계산됨 (processKeyEvent 대신)
      Logger.debug(this.componentName, '키 이벤트 처리됨', { 
        char: event.key,
        language: event.language 
      });

      // 3. 외부로 이벤트 발송
      this.eventEmitter.emit('keyboard-event', event);

    } catch (error) {
      Logger.error(this.componentName, '키 이벤트 처리 실패', error);
    }
  }

  /**
   * 🔥 이벤트 리스너 인터페이스
   */
  public on(event: string, listener: (...args: unknown[]) => void): this {
    this.eventEmitter.on(event, listener);
    return this;
  }

  public emit(event: string, ...args: unknown[]): boolean {
    return this.eventEmitter.emit(event, ...args);
  }

  public off(event: string, listener?: (...args: unknown[]) => void): this {
    if (listener) {
      this.eventEmitter.off(event, listener);
    } else {
      this.eventEmitter.removeAllListeners(event);
    }
    return this;
  }

  /**
   * 🔥 헬스 체크
   */
  public async healthCheck(): Promise<{
    healthy: boolean;
    uptime?: number;
    lastError?: string;
    modules: {
      permission: boolean;
      stats: boolean;
      session: boolean;
      processor: boolean;
      windowTracker: boolean;
      hangulComposer: boolean;
    };
  }> {
    const baseHealth = await super.healthCheck();
    
    // 모든 모듈의 헬스 체크
    const moduleHealth = {
      permission: (await this.permissionManager.healthCheck()).healthy,
      stats: (await this.statsManager.healthCheck()).healthy,
      session: (await this.sessionManager.keyboardHealthCheck()).healthy,
      processor: (await this.eventProcessor.healthCheck()).healthy,
      windowTracker: (await this.windowTracker.healthCheck()).healthy,
      hangulComposer: (await this.hangulComposer.healthCheck()).healthy,
    };

    const allModulesHealthy = Object.values(moduleHealth).every(Boolean);

    return {
      ...baseHealth,
      healthy: baseHealth.healthy && allModulesHealthy,
      modules: moduleHealth
    };
  }

  /**
   * 🔥 추가 API 메서드들 (기존 호환성 유지)
   */
  public setAccessibilityPermission(hasPermission: boolean): void {
    this.permissionManager.setPermission(hasPermission);
    Logger.info(this.componentName, '접근성 권한 상태 설정됨', { hasPermission });
  }

  public async setLanguage(language: string): Promise<Result<boolean>> {
    try {
      // 언어 설정 로직 (향후 구현)
      Logger.info(this.componentName, '언어 설정됨', { language });
      return { success: true, data: true };
    } catch (error) {
      Logger.error(this.componentName, '언어 설정 실패', error);
      return { success: false, error: String(error) };
    }
  }

  public async getRecentEvents(count: number): Promise<Result<ProcessedKeyboardEvent[]>> {
    try {
      // 최근 이벤트 조회 (향후 구현)
      Logger.debug(this.componentName, '최근 이벤트 조회됨', { count });
      return { success: true, data: [] };
    } catch (error) {
      Logger.error(this.componentName, '최근 이벤트 조회 실패', error);
      return { success: false, error: String(error) };
    }
  }

  public forceKoreanLanguage(): Result<boolean> {
    try {
      // 한국어 강제 설정 (향후 구현)
      Logger.info(this.componentName, '한국어 언어 강제 설정됨');
      return { success: true, data: true };
    } catch (error) {
      Logger.error(this.componentName, '한국어 강제 설정 실패', error);
      return { success: false, error: String(error) };
    }
  }

  public async testLanguageDetection(keycode: number, keychar?: number): Promise<Result<string>> {
    try {
      // 언어 감지 테스트 (향후 구현)
      const detectedLanguage = keycode >= 0xAC00 && keycode <= 0xD7AF ? 'ko' : 'en';
      Logger.debug(this.componentName, '언어 감지 테스트됨', { keycode, keychar, detectedLanguage });
      return { success: true, data: detectedLanguage };
    } catch (error) {
      Logger.error(this.componentName, '언어 감지 테스트 실패', error);
      return { success: false, error: String(error) };
    }
  }
}

// 🔥 싱글톤 인스턴스 (선택적)
export const keyboardService = new KeyboardService();

export default KeyboardService;
