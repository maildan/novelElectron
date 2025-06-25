import { ipcMain, BrowserWindow, app } from 'electron';
import { EventEmitter } from 'events';
import { logger } from '@main/keyboard/logger';
import { 
  KEYBOARD_CONSTANTS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES,
  INFO_MESSAGES 
} from '@main/keyboard/constants';

// Module imports
import { KeyboardEventProcessor } from '@main/keyboard/processors/KeyboardEventProcessor';
import { SessionManager } from '@main/keyboard/managers/SessionManager';
import { KeyboardConfigManager } from '@main/keyboard/managers/KeyboardConfigManager';
import { AppDetector } from '@main/keyboard/detectors/AppDetector';
import { KeyboardIpcHandlers } from '@main/keyboard/handlers/KeyboardIpcHandlers';
import { HangulComposer } from '@main/keyboard/HangulComposer';
import { HealthCheckManager } from '@main/keyboard/HealthCheckManager';
import { KeyboardPermissionManager } from '@main/keyboard/PermissionManager';
import { KeyboardStatsManager } from '@main/keyboard/StatsManager';
import { UnifiedKeyboardHandler } from '@main/keyboard/UnifiedHandler';

/**
 * 기가차드 표준 KeyboardEngine
 * 모든 키보드 관련 로직을 모듈화하여 관리하는 중앙 오케스트레이터
 */
export class KeyboardEngine extends EventEmitter {
  private static instance: KeyboardEngine;
  private isInitialized: boolean = false;
  private isListening: boolean = false;

  // Core modules
  private eventProcessor!: KeyboardEventProcessor;
  private sessionManager!: SessionManager;
  private configManager!: KeyboardConfigManager;
  private appDetector!: AppDetector;
  private ipcHandlers!: KeyboardIpcHandlers;
  private hangulComposer!: HangulComposer;
  private healthCheckManager!: HealthCheckManager;
  private permissionManager!: KeyboardPermissionManager;
  private statsManager!: KeyboardStatsManager;
  private unifiedHandler!: UnifiedKeyboardHandler;

  private constructor() {
    super(); // EventEmitter 상속을 위한 super() 호출
    logger.info('KeyboardEngine', '🔥 기가차드 KeyboardEngine 초기화 시작...');
    this.initializeModules();
  }

  /**
   * 싱글톤 인스턴스 반환
   */
  public static getInstance(): KeyboardEngine {
    if (!KeyboardEngine.instance) {
      KeyboardEngine.instance = new KeyboardEngine();
    }
    return KeyboardEngine.instance;
  }

  /**
   * 모든 모듈 초기화
   */
  private initializeModules(): void {
    try {
      logger.info('KeyboardEngine', '모든 모듈 초기화 중...');

      // Core managers - 싱글톤 인스턴스 사용
      this.configManager = new KeyboardConfigManager();
      this.sessionManager = new SessionManager();
      this.statsManager = KeyboardStatsManager.getInstance();
      
      // Detection and composition
      this.appDetector = new AppDetector();
      this.hangulComposer = new HangulComposer();
      
      // System managers
      this.permissionManager = KeyboardPermissionManager.getInstance();
      this.healthCheckManager = HealthCheckManager.getInstance();
      
      // Event processing
      this.eventProcessor = new KeyboardEventProcessor();
      
      // IPC handlers
      this.ipcHandlers = new KeyboardIpcHandlers();
      
      // Unified handler
      this.unifiedHandler = UnifiedKeyboardHandler.getInstance();

      logger.info('KeyboardEngine', '✅ 모든 모듈 초기화 완료');
    } catch (error) {
      logger.error('KeyboardEngine', '모듈 초기화 실패:', error);
      throw error;
    }
  }

  /**
   * KeyboardEngine 초기화
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      logger.warn('KeyboardEngine', '이미 초기화됨');
      return;
    }

    try {
      logger.info('KeyboardEngine', '초기화 시작...');

      // 권한 확인
      const permissionResult = await this.permissionManager.checkPermissions();
      if (!permissionResult.hasAllPermissions) {
        logger.warn('KeyboardEngine', '필요한 권한이 없습니다', permissionResult.missingPermissions);
      }

      // IPC 핸들러 등록
      // this.ipcHandlers.registerHandlers(ipcMain);
      
      // 이벤트 리스너 등록
      this.registerEventListeners();

      this.isInitialized = true;
      logger.info('KeyboardEngine', '✅ 초기화 완료');

    } catch (error) {
      logger.error('KeyboardEngine', '초기화 실패:', error);
      throw error;
    }
  }

  /**
   * 키보드 리스닝 시작
   */
  public async startListening(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('KeyboardEngine이 초기화되지 않았습니다');
    }

    if (this.isListening) {
      logger.warn('KeyboardEngine', '이미 리스닝 중');
      return;
    }

    try {
      logger.info('KeyboardEngine', '키보드 리스닝 시작...');

      // 권한 재확인
      const permissionResult = await this.permissionManager.checkPermissions();
      if (!permissionResult.hasAllPermissions) {
        throw new Error('권한이 필요합니다');
      }

      // 세션 시작
      this.sessionManager.startNewSession();

      this.isListening = true;
      
      // 상태 알림
      this.notifyStatusChange('listening', true);
      
      logger.info('KeyboardEngine', '✅ 키보드 리스닝 시작됨');

    } catch (error) {
      logger.error('KeyboardEngine', '리스닝 시작 실패:', error);
      throw error;
    }
  }

  /**
   * 키보드 리스닝 중지
   */
  public async stopListening(): Promise<void> {
    if (!this.isListening) {
      logger.warn('KeyboardEngine', '현재 리스닝 중이 아님');
      return;
    }

    try {
      logger.info('KeyboardEngine', '키보드 리스닝 중지...');

      // 세션 종료
      this.sessionManager.endCurrentSession();

      this.isListening = false;
      
      // 상태 알림
      this.notifyStatusChange('listening', false);
      
      logger.info('KeyboardEngine', '✅ 키보드 리스닝 중지됨');

    } catch (error) {
      logger.error('KeyboardEngine', '리스닝 중지 실패:', error);
      throw error;
    }
  }

  /**
   * 이벤트 리스너 등록
   */
  private registerEventListeners(): void {
    // 앱 생명주기 이벤트
    app.on('before-quit', () => {
      this.cleanup();
    });

    app.on('window-all-closed', () => {
      this.cleanup();
    });

    logger.info('KeyboardEngine', '이벤트 리스너 등록 완료');
  }

  /**
   * 상태 변경 알림
   */
  private notifyStatusChange(type: string, data: any): void {
    try {
      const windows = BrowserWindow.getAllWindows();
      windows.forEach(window => {
        window.webContents.send('keyboard-status-changed', {
          type,
          data,
          timestamp: Date.now()
        });
      });
    } catch (error) {
      logger.error('KeyboardEngine', '상태 변경 알림 실패:', error);
    }
  }

  /**
   * 키 이벤트 알림
   */
  private notifyKeyEvent(eventData: any): void {
    try {
      const windows = BrowserWindow.getAllWindows();
      windows.forEach(window => {
        window.webContents.send('keyboard-event', eventData);
      });
    } catch (error) {
      logger.error('KeyboardEngine', '키 이벤트 알림 실패:', error);
    }
  }

  /**
   * 에러 처리
   */
  private handleError(error: any): void {
    logger.error('KeyboardEngine', '에러 처리:', error);
    
    try {
      const windows = BrowserWindow.getAllWindows();
      windows.forEach(window => {
        window.webContents.send('keyboard-error', {
          error: error.message || 'Unknown error',
          timestamp: Date.now()
        });
      });
    } catch (notifyError) {
      logger.error('KeyboardEngine', '에러 알림 실패:', notifyError);
    }
  }

  /**
   * 현재 상태 반환
   */
  public getStatus(): any {
    return {
      isInitialized: this.isInitialized,
      isListening: this.isListening,
      currentSession: this.sessionManager?.getSessionStats(),
      currentApp: this.appDetector?.getLastAppInfo(),
      health: {
        isHealthy: true,
        lastCheck: Date.now()
      }
    };
  }

  /**
   * 설정 업데이트
   */
  public async updateConfig(newConfig: any): Promise<void> {
    try {
      await this.configManager.updateConfig(newConfig);
      logger.info('KeyboardEngine', '설정 업데이트 완료');
    } catch (error) {
      logger.error('KeyboardEngine', '설정 업데이트 실패:', error);
      throw error;
    }
  }

  /**
   * 세션 데이터 반환
   */
  public getSessionData(): any {
    return this.sessionManager?.getSessionStats() || null;
  }

  /**
   * 현재 앱 정보 반환
   */
  public getCurrentApp(): any {
    return this.appDetector?.getLastAppInfo() || null;
  }

  /**
   * 권한 상태 확인
   */
  public async checkPermissions(): Promise<boolean> {
    const result = await this.permissionManager.checkPermissions();
    return result.hasAllPermissions;
  }

  /**
   * 권한 요청
   */
  public async requestPermissions(): Promise<boolean> {
    return await this.permissionManager.requestPermissions();
  }

  /**
   * 헬스체크 상태 반환
   */
  public getHealthStatus(): any {
    return {
      isHealthy: true,
      lastCheck: Date.now(),
      uptime: Date.now() - (this.isInitialized ? Date.now() : Date.now()),
      modules: {
        sessionManager: this.sessionManager?.isSessionActive() || false,
        appDetector: this.appDetector?.isActive() || false,
        permissionManager: true,
        configManager: true
      }
    };
  }

  /**
   * 리소스 정리 및 종료
   */
  public async cleanup(): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    try {
      logger.info('KeyboardEngine', '정리 시작...');

      // 리스닝 중지
      if (this.isListening) {
        await this.stopListening();
      }

      // 세션 정리
      this.sessionManager?.endCurrentSession();

      this.isInitialized = false;
      
      logger.info('KeyboardEngine', '✅ 정리 완료');

    } catch (error) {
      logger.error('KeyboardEngine', '정리 중 에러:', error);
    }
  }

  /**
   * 인스턴스 재시작
   */
  public async restart(): Promise<void> {
    logger.info('KeyboardEngine', '재시작 중...');
    
    await this.cleanup();
    this.initializeModules();
    await this.initialize();
    
    if (this.isListening) {
      await this.startListening();
    }
    
    logger.info('KeyboardEngine', '✅ 재시작 완료');
  }
}

/**
 * Singleton 인스턴스 export
 */
export const keyboardEngine = KeyboardEngine.getInstance();

/**
 * 편의 함수: KeyboardEngine 인스턴스 가져오기
 */
export function getKeyboardEngine(): KeyboardEngine {
  return KeyboardEngine.getInstance();
}

/**
 * 편의 함수: KeyboardEngine 초기화
 */
export async function initializeKeyboardEngine(): Promise<KeyboardEngine> {
  const engine = KeyboardEngine.getInstance();
  await engine.initialize();
  return engine;
}

/**
 * 기본 내보내기
 */
export default KeyboardEngine;

/**
 * 타입 re-exports - 모든 공유 타입들을 중앙에서 관리
 */
// 기본 키보드 이벤트 타입 (공유 타입 사용)
export type { LoopKeyboardEvent as KeyEvent } from '@shared/types';

// 각 모듈에서 정의된 타입들
export type { SessionStats } from './managers/SessionManager';
export type { KeyboardConfig } from './managers/KeyboardConfigManager';
export type { PermissionStatus } from './PermissionManager';
export type { HangulComposerState } from './HangulComposer';

// 모니터링 상태 타입 (내부적으로 정의)
export interface MonitoringState {
  isActive: boolean;
  startTime: number | null;
  sessionCount: number;
  lastActivity: number | null;
}
