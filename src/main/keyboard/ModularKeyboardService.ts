// 🔥 기가차드 키보드 서비스 - 모듈화된 새 버전

import { Logger } from '../../shared/logger';
import { Platform } from '../utils/platform';
import { 
  IpcResponse, 
  ProcessedKeyboardEvent,
  KeyboardState,
  KeyboardMonitorState,
  Result
} from '../../shared/types';
import { KEYBOARD_LANGUAGES, perf } from '../../shared/common';
import { EventEmitter } from 'events';
import type { UiohookInstance, UiohookKeyboardEvent } from 'uiohook-napi';

// 🔥 새로운 모듈화된 컴포넌트들
import KeyboardStatsManager from '../managers/KeyboardStatsManager';
import KeyboardPermissionManager from '../managers/KeyboardPermissionManager';
import KeyboardEventProcessor from '../services/KeyboardEventProcessor';
import { SessionManager } from '../managers/SessionManager';

/**
 * 🔥 KeyboardService - 모듈화된 키보드 모니터링 서비스
 * 
 * 역할:
 * - uIOhook 관리 (시작/중지)
 * - 모듈 간 조정 (Orchestration)
 * - 이벤트 발송 및 구독
 * - 전반적인 상태 관리
 */
export class KeyboardService extends EventEmitter {
  private readonly componentName = 'KEYBOARD_SERVICE';
  
  // 핵심 상태
  private state: KeyboardState = {
    isActive: false,
    language: 'ko', // 기본값: 한글
    inputMethod: 'composition',
    totalEvents: 0,
    startTime: new Date(),
  };

  // uIOhook 인스턴스
  private uiohook: UiohookInstance | null = null;
  private isInitialized = false;
  
  // 🔥 모듈화된 관리자들
  private statsManager: KeyboardStatsManager;
  private permissionManager: KeyboardPermissionManager;
  private eventProcessor: KeyboardEventProcessor;
  private sessionManager: SessionManager;
  
  // 성능 추적
  private performanceTracker = perf;

  constructor() {
    super();
    
    Logger.info(this.componentName, '🔥 모듈화된 키보드 서비스 초기화 시작');
    
    // 관리자들 초기화
    this.statsManager = new KeyboardStatsManager();
    this.permissionManager = new KeyboardPermissionManager();
    this.eventProcessor = new KeyboardEventProcessor();
    this.sessionManager = new SessionManager();
    
    this.setupEventHandlers();
    
    Logger.info(this.componentName, '키보드 서비스 인스턴스 생성됨');
  }

  /**
   * 🔥 이벤트 핸들러 설정
   */
  private setupEventHandlers(): void {
    // 권한 관리자 이벤트
    this.permissionManager.on('permission-granted', () => {
      Logger.info(this.componentName, '✅ 키보드 권한 승인됨');
      this.emit('permission-granted');
    });
    
    this.permissionManager.on('permission-denied', () => {
      Logger.warn(this.componentName, '❌ 키보드 권한 거부됨');
      this.emit('permission-denied');
    });
    
    this.permissionManager.on('permission-changed', (hasPermission: boolean) => {
      Logger.info(this.componentName, '권한 상태 변경됨', { hasPermission });
      this.emit('permission-changed', hasPermission);
    });
  }

  /**
   * 🔥 초기화
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      Logger.debug(this.componentName, '이미 초기화됨');
      return;
    }

    try {
      Logger.info(this.componentName, '키보드 서비스 초기화 시작');
      
      // 관리자들 초기화
      await this.permissionManager.initialize();
      await this.permissionManager.start();
      
      await this.statsManager.initialize();
      
      await this.eventProcessor.initialize();
      
      await this.sessionManager.initialize();
      
      // uIOhook 초기화
      await this.initializeUiohook();
      
      this.isInitialized = true;
      
      Logger.info(this.componentName, '✅ 키보드 서비스 초기화 완료');
      
    } catch (error) {
      Logger.error(this.componentName, '키보드 서비스 초기화 실패', error);
      throw error;
    }
  }

  /**
   * 🔥 uIOhook 초기화
   */
  private async initializeUiohook(): Promise<void> {
    try {
      this.performanceTracker.start('UIOHOOK_LOAD');
      
      const uiohookModule = await import('uiohook-napi');
      this.uiohook = uiohookModule.uIOhook as unknown as UiohookInstance;
      
      const loadTime = this.performanceTracker.end('UIOHOOK_LOAD');
      Logger.info(this.componentName, 'uiohook-napi 로드 성공', { 
        loadTime: `${loadTime.toFixed(2)}ms` 
      });
      
    } catch (error) {
      Logger.error(this.componentName, 'uiohook-napi 로드 실패', error);
      throw new Error('키보드 모니터링을 사용할 수 없습니다');
    }
  }

  /**
   * 🔥 모니터링 시작
   */
  public async startMonitoring(): Promise<IpcResponse<boolean>> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (this.state.isActive) {
        return {
          success: true,
          data: true,
          timestamp: new Date()
        };
      }

      // 권한 확인
      const permissionResult = await this.permissionManager.checkPermissions();
      if (!permissionResult.success || !permissionResult.data) {
        Logger.warn(this.componentName, '키보드 접근 권한이 없습니다');
        
        // 권한 요청
        const requestResult = await this.permissionManager.requestPermissions();
        if (!requestResult.success || !requestResult.data) {
          return {
            success: false,
            error: '키보드 접근 권한이 필요합니다',
            timestamp: new Date()
          };
        }
      }

      // uIOhook 시작
      if (!this.uiohook) {
        throw new Error('uIOhook이 초기화되지 않음');
      }

      // 이벤트 리스너 등록
      this.uiohook.on('keydown', (rawEvent: UiohookKeyboardEvent) => {
        this.handleKeyEvent('keydown', rawEvent).catch(error => {
          Logger.error(this.componentName, 'keydown 처리 실패', error);
        });
      });

      this.uiohook.on('keyup', (rawEvent: UiohookKeyboardEvent) => {
        this.handleKeyEvent('keyup', rawEvent).catch(error => {
          Logger.error(this.componentName, 'keyup 처리 실패', error);
        });
      });

      // uIOhook 시작
      this.uiohook.start();
      
      // 상태 업데이트
      this.state.isActive = true;
      this.state.startTime = new Date();
      this.state.totalEvents = 0;
      
      // 통계 관리자 시작
      await this.statsManager.start();
      
      Logger.info(this.componentName, '✅ 키보드 모니터링 시작됨');
      this.emit('monitoring-started');

      return {
        success: true,
        data: true,
        timestamp: new Date()
      };

    } catch (error) {
      Logger.error(this.componentName, '키보드 모니터링 시작 실패', error);
      
      return {
        success: false,
        error: String(error),
        timestamp: new Date()
      };
    }
  }

  /**
   * 🔥 모니터링 중지
   */
  public async stopMonitoring(): Promise<IpcResponse<boolean>> {
    try {
      if (!this.state.isActive) {
        return {
          success: true,
          data: true,
          timestamp: new Date()
        };
      }

      // uIOhook 중지
      if (this.uiohook) {
        this.uiohook.stop();
      }
      
      // 상태 업데이트
      this.state.isActive = false;
      
      // 통계 관리자 중지
      await this.statsManager.stop();
      
      Logger.info(this.componentName, '✅ 키보드 모니터링 중지됨');
      this.emit('monitoring-stopped');

      return {
        success: true,
        data: true,
        timestamp: new Date()
      };

    } catch (error) {
      Logger.error(this.componentName, '키보드 모니터링 중지 실패', error);
      
      return {
        success: false,
        error: String(error),
        timestamp: new Date()
      };
    }
  }

  /**
   * 🔥 키 이벤트 처리 (메인 로직)
   */
  private async handleKeyEvent(type: 'keydown' | 'keyup', rawEvent: UiohookKeyboardEvent): Promise<void> {
    try {
      this.state.totalEvents++;
      
      // 이벤트 프로세서로 처리
      const processedEvent = await this.eventProcessor.processKeyEvent(type, rawEvent);
      
      if (processedEvent) {
        // 통계 업데이트
        this.statsManager.updateKeyboardStats(processedEvent);
        
        // 세션에 기록 (keydown만)
        if (type === 'keydown') {
          const keyInputData = {
            character: processedEvent.composedChar || processedEvent.key,
            timestamp: processedEvent.timestamp,
            language: processedEvent.language,
            windowInfo: {
              title: processedEvent.windowTitle,
              processName: 'Unknown'
            },
            inputMethod: processedEvent.inputMethod as 'direct' | 'ime' | 'composition'
          };
          
          this.sessionManager.recordKeyboardInput(keyInputData);
        }
        
        // 이벤트 발송
        this.emit('keyboard-event', processedEvent);
        
        // 언어별 특별 이벤트
        if (processedEvent.language) {
          this.emit(`language-${processedEvent.language}`, processedEvent);
        }
      }
      
    } catch (error) {
      Logger.error(this.componentName, '키 이벤트 처리 실패', error);
    }
  }

  /**
   * 🔥 모니터링 상태 조회
   */
  public getStatus(): KeyboardMonitorState {
    return {
      isActive: this.state.isActive,
      language: this.state.language,
      inputMethod: this.state.inputMethod,
      eventsPerSecond: 0, // TODO: 계산 로직 추가
      totalEvents: this.state.totalEvents,
      startTime: this.state.startTime || null
    };
  }

  /**
   * 🔥 확장 상태 조회 (추가 정보 포함)
   */
  public getExtendedStatus() {
    const currentStats = this.statsManager.getCurrentStats();
    const baseStatus = this.getStatus();
    
    return {
      ...baseStatus,
      wpm: currentStats.wpm,
      accuracy: currentStats.accuracy,
      hasPermission: this.permissionManager.hasPermission(),
      sessionDuration: this.state.isActive && this.state.startTime ? 
        Date.now() - this.state.startTime.getTime() : 0
    };
  }

  /**
   * 🔥 언어 설정
   */
  public setLanguage(language: string): IpcResponse<boolean> {
    try {
      if (!Object.keys(KEYBOARD_LANGUAGES).includes(language)) {
        return {
          success: false,
          error: `지원하지 않는 언어: ${language}`,
          timestamp: new Date()
        };
      }
      
      this.state.language = language;
      this.eventProcessor.setLanguage(language);
      
      Logger.info(this.componentName, '언어 설정됨', { language });
      this.emit('language-changed', language);
      
      return {
        success: true,
        data: true,
        timestamp: new Date()
      };
      
    } catch (error) {
      Logger.error(this.componentName, '언어 설정 실패', error);
      
      return {
        success: false,
        error: String(error),
        timestamp: new Date()
      };
    }
  }

  /**
   * 🔥 세션 시작
   */
  public async startSession(): Promise<IpcResponse<boolean>> {
    try {
      await this.sessionManager.startKeyboardSession();
      
      Logger.info(this.componentName, '타이핑 세션 시작됨');
      this.emit('session-started');
      
      return {
        success: true,
        data: true,
        timestamp: new Date()
      };
      
    } catch (error) {
      Logger.error(this.componentName, '세션 시작 실패', error);
      
      return {
        success: false,
        error: String(error),
        timestamp: new Date()
      };
    }
  }

  /**
   * 🔥 세션 종료
   */
  public async endSession(): Promise<IpcResponse<boolean>> {
    try {
      const session = await this.sessionManager.endKeyboardCurrentSession();
      
      Logger.info(this.componentName, '타이핑 세션 종료됨');
      this.emit('session-ended', session);
      
      return {
        success: true,
        data: true,
        timestamp: new Date()
      };
      
    } catch (error) {
      Logger.error(this.componentName, '세션 종료 실패', error);
      
      return {
        success: false,
        error: String(error),
        timestamp: new Date()
      };
    }
  }

  /**
   * 🔥 권한 관련 메서드들
   */
  public async requestPermissions(): Promise<Result<boolean>> {
    return await this.permissionManager.requestPermissions();
  }

  public async checkPermissions(): Promise<Result<boolean>> {
    return await this.permissionManager.checkPermissions();
  }

  public hasPermission(): boolean {
    return this.permissionManager.hasPermission();
  }

  /**
   * 🔥 통계 조회
   */
  public getStats() {
    return this.statsManager.getCurrentStats();
  }

  /**
   * 🔥 정리
   */
  public async cleanup(): Promise<void> {
    try {
      Logger.info(this.componentName, '키보드 서비스 정리 시작');
      
      // 모니터링 중지
      if (this.state.isActive) {
        await this.stopMonitoring();
      }
      
      // 관리자들 정리
      await this.statsManager.cleanup();
      await this.permissionManager.cleanup();
      await this.eventProcessor.cleanup();
      await this.sessionManager.cleanup();
      
      // uIOhook 정리
      if (this.uiohook) {
        this.uiohook.stop();
        this.uiohook = null;
      }
      
      this.isInitialized = false;
      
      Logger.info(this.componentName, '키보드 서비스 정리 완료');
      
    } catch (error) {
      Logger.error(this.componentName, '키보드 서비스 정리 실패', error);
    }
  }

  /**
   * 🔥 헬스 체크
   */
  public async getHealthStatus() {
    const [statsHealth, permissionHealth, processorHealth, sessionHealth] = await Promise.all([
      this.statsManager.healthCheck(),
      this.permissionManager.healthCheck(),
      Promise.resolve(this.eventProcessor.getHealthStatus()),
      this.sessionManager.keyboardHealthCheck()
    ]);

    return {
      overall: {
        isInitialized: this.isInitialized,
        isActive: this.state.isActive,
        totalEvents: this.state.totalEvents
      },
      components: {
        statsManager: statsHealth,
        permissionManager: permissionHealth,
        eventProcessor: processorHealth,
        sessionManager: sessionHealth
      }
    };
  }
}

// 🔥 싱글톤 인스턴스 (기존 호환성 유지)
const keyboardService = new KeyboardService();

export { keyboardService };
export default keyboardService;
