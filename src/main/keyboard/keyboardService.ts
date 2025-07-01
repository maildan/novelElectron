// 🔥 기가차드 새로운 KeyboardService - 완전 재작성

import { EventEmitter } from 'events';
import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import type { 
  ProcessedKeyboardEvent, 
  MonitoringStatus,
  RealtimeStats,
  Result,
  UiohookKeyboardEvent,
  WindowInfo
} from '../../shared/types';

// 🔥 의존성 모듈들
import { KeyboardPermissionManager } from '../managers/KeyboardPermissionManager';
import { KeyboardStatsManager } from '../managers/KeyboardStatsManager';
import { SessionManager } from '../managers/SessionManager';
import { WindowTracker } from './WindowTracker';

/**
 * 🔥 KeyboardService - 완전히 새로 작성된 키보드 서비스
 * 
 * 목표:
 * - uIOhook 정상 작동 보장
 * - active-win 윈도우 감지 정상화
 * - 모듈 간 의존성 정리
 * - 실제 키 입력 감지 및 세션 관리
 */
export class KeyboardService extends BaseManager {
  private readonly componentName = 'KEYBOARD_SERVICE';
  private isMonitoring = false;
  private eventEmitter: EventEmitter;
  
  // 🔥 uIOhook 인스턴스
  private uiohook: any = null;
  
  // 🔥 의존성 모듈들
  private permissionManager: KeyboardPermissionManager;
  private statsManager: KeyboardStatsManager;
  private sessionManager: SessionManager;
  private windowTracker: WindowTracker;

  constructor() {
    super({
      name: 'KeyboardService',
      autoStart: false
    });

    this.eventEmitter = new EventEmitter();
    
    // 🔥 의존성 초기화
    this.permissionManager = new KeyboardPermissionManager();
    this.statsManager = new KeyboardStatsManager();
    this.sessionManager = new SessionManager();
    this.windowTracker = new WindowTracker();
    
    Logger.info(this.componentName, '키보드 서비스 생성됨');
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
    await this.windowTracker.initialize();
    
    // uIOhook 초기화
    await this.initializeUiohook();
    
    Logger.info(this.componentName, '키보드 서비스 초기화 완료');
  }

  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, '키보드 서비스 시작');
    
    await this.permissionManager.start();
    await this.statsManager.start();
    await this.sessionManager.start();
    await this.windowTracker.start();
  }

  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, '키보드 서비스 중지');
    
    if (this.isMonitoring) {
      await this.stopMonitoring();
    }
    
    await this.windowTracker.stop();
    await this.sessionManager.stop();
    await this.statsManager.stop();
    await this.permissionManager.stop();
  }

  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, '키보드 서비스 정리');
    
    if (this.uiohook) {
      try {
        this.uiohook.stop();
        this.uiohook.removeAllListeners();
      } catch (error) {
        Logger.warn(this.componentName, 'uIOhook 정리 중 에러 무시', error);
      }
      this.uiohook = null;
    }
    
    await this.windowTracker.cleanup();
    await this.sessionManager.cleanup();
    await this.statsManager.cleanup();
    await this.permissionManager.cleanup();
  }

  /**
   * 🔥 uIOhook 초기화 - 올바른 방법
   */
  private async initializeUiohook(): Promise<void> {
    try {
      Logger.info(this.componentName, 'uIOhook 초기화 시작');
      
      // 🔥 여러 방법으로 uIOhook 로딩 시도
      let uiohookModule;
      try {
        uiohookModule = require('uiohook-napi');
        Logger.debug(this.componentName, 'uIOhook 모듈 로드 성공', {
          moduleKeys: Object.keys(uiohookModule),
          hasUIOhook: 'uIOhook' in uiohookModule,
          hasDefault: 'default' in uiohookModule
        });
      } catch (requireError) {
        Logger.error(this.componentName, 'uIOhook 모듈 require 실패', requireError);
        throw requireError;
      }
      
      // 🔥 uIOhook 인스턴스 찾기 - 여러 패턴 시도
      if (uiohookModule.uIOhook) {
        this.uiohook = uiohookModule.uIOhook;
        Logger.debug(this.componentName, 'uIOhook from .uIOhook property');
      } else if (uiohookModule.default && uiohookModule.default.uIOhook) {
        this.uiohook = uiohookModule.default.uIOhook;
        Logger.debug(this.componentName, 'uIOhook from .default.uIOhook');
      } else if (typeof uiohookModule.start === 'function') {
        this.uiohook = uiohookModule;
        Logger.debug(this.componentName, 'uIOhook from module itself');
      } else {
        Logger.error(this.componentName, 'uIOhook 인스턴스를 찾을 수 없음', {
          moduleKeys: Object.keys(uiohookModule),
          moduleType: typeof uiohookModule
        });
        throw new Error('uIOhook 인스턴스를 찾을 수 없습니다');
      }
      
      // 🔥 필수 함수 존재 확인
      if (typeof this.uiohook.start !== 'function') {
        Logger.error(this.componentName, 'uIOhook.start 함수가 없음', {
          startType: typeof this.uiohook.start,
          availableMethods: Object.getOwnPropertyNames(this.uiohook)
        });
        throw new Error('uIOhook.start 함수가 없습니다');
      }
      
      if (typeof this.uiohook.stop !== 'function') {
        Logger.error(this.componentName, 'uIOhook.stop 함수가 없음');
        throw new Error('uIOhook.stop 함수가 없습니다');
      }
      
      Logger.info(this.componentName, 'uIOhook 초기화 성공', {
        hasStart: typeof this.uiohook.start,
        hasStop: typeof this.uiohook.stop,
        hasOn: typeof this.uiohook.on,
        hasOff: typeof this.uiohook.off
      });
      
    } catch (error) {
      Logger.error(this.componentName, 'uIOhook 초기화 실패', error);
      this.uiohook = null;
      throw error;
    }
  }

  /**
   * 🔥 공개 API - 모니터링 시작
   */
  public async startMonitoring(): Promise<Result<boolean>> {
    try {
      Logger.info(this.componentName, '키보드 모니터링 시작 요청');
      
      if (this.isMonitoring) {
        Logger.info(this.componentName, '이미 모니터링 중');
        return { success: true, data: true };
      }

      // 1. 권한 확인
      const permissionResult = await this.permissionManager.checkPermissions();
      if (!permissionResult.success || !permissionResult.data) {
        Logger.warn(this.componentName, '권한 없음 - 권한 요청 시도');
        
        const requestResult = await this.permissionManager.requestPermissions();
        if (!requestResult.success || !requestResult.data) {
          return { 
            success: false, 
            error: '키보드 접근 권한이 필요합니다. 시스템 설정에서 접근성 권한을 허용해주세요.' 
          };
        }
      }

      // 2. 세션 시작
      Logger.info(this.componentName, '새 키보드 세션 시작');
      await this.sessionManager.startKeyboardSession();

      // 3. uIOhook 초기화 (아직 초기화되지 않은 경우)
      if (!this.uiohook) {
        Logger.info(this.componentName, 'uIOhook 초기화 시작');
        await this.initializeUiohook();
      }

      // 4. uIOhook 초기화 확인
      if (!this.uiohook) {
        Logger.error(this.componentName, 'uIOhook 초기화 실패');
        return { success: false, error: 'uIOhook 초기화 실패' };
      }

      // 5. uIOhook 이벤트 리스너 설정
      this.setupUiohookListeners();

      // 6. uIOhook 시작
      Logger.info(this.componentName, 'uIOhook 시작');
      this.uiohook.start();

      this.isMonitoring = true;
      this.eventEmitter.emit('monitoring-started');

      Logger.info(this.componentName, '✅ 키보드 모니터링 시작 성공');
      return { success: true, data: true };

    } catch (error) {
      Logger.error(this.componentName, '키보드 모니터링 시작 실패', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * 🔥 공개 API - 모니터링 중지
   */
  public async stopMonitoring(): Promise<Result<boolean>> {
    try {
      Logger.info(this.componentName, '키보드 모니터링 중지 요청');
      
      if (!this.isMonitoring) {
        Logger.info(this.componentName, '모니터링이 실행 중이 아님');
        return { success: true, data: true };
      }

      // 1. uIOhook 중지
      if (this.uiohook) {
        Logger.info(this.componentName, 'uIOhook 중지');
        this.uiohook.stop();
        this.uiohook.removeAllListeners();
      }

      // 2. 세션 종료
      Logger.info(this.componentName, '키보드 세션 종료');
      await this.sessionManager.endKeyboardCurrentSession();

      this.isMonitoring = false;
      this.eventEmitter.emit('monitoring-stopped');

      Logger.info(this.componentName, '✅ 키보드 모니터링 중지 성공');
      return { success: true, data: true };

    } catch (error) {
      Logger.error(this.componentName, '키보드 모니터링 중지 실패', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * 🔥 uIOhook 이벤트 리스너 설정
   */
  private setupUiohookListeners(): void {
    if (!this.uiohook) {
      Logger.error(this.componentName, 'uIOhook이 초기화되지 않음');
      return;
    }

    // keydown 이벤트
    this.uiohook.on('keydown', (rawEvent: UiohookKeyboardEvent) => {
      this.handleKeyEvent('keydown', rawEvent).catch(error => {
        Logger.error(this.componentName, 'keydown 처리 실패', error);
      });
    });

    // keyup 이벤트
    this.uiohook.on('keyup', (rawEvent: UiohookKeyboardEvent) => {
      this.handleKeyEvent('keyup', rawEvent).catch(error => {
        Logger.error(this.componentName, 'keyup 처리 실패', error);
      });
    });

    Logger.info(this.componentName, 'uIOhook 이벤트 리스너 설정 완료');
  }

  /**
   * 🔥 키 이벤트 처리
   */
  private async handleKeyEvent(type: 'keydown' | 'keyup', rawEvent: UiohookKeyboardEvent): Promise<void> {
    try {
      // 🔥 디버그: 모든 키 이벤트 로깅
      Logger.debug(this.componentName, `🔥 키 이벤트 감지!`, {
        type,
        keycode: rawEvent.keycode,
        keychar: rawEvent.keychar,
        char: rawEvent.keychar ? String.fromCharCode(rawEvent.keychar) : 'none'
      });

      // keydown만 처리 (중복 방지)
      if (type !== 'keydown') {
        Logger.debug(this.componentName, `keyup 이벤트 무시`, { type });
        return;
      }

      // 현재 윈도우 정보 가져오기
      const currentWindow = this.windowTracker.getCurrentWindow();
      
      // 기본 윈도우 정보 생성 (윈도우 정보가 없을 때)
      const windowInfo: WindowInfo = currentWindow || {
        id: 0,
        title: 'Unknown Window',
        owner: {
          name: 'Unknown App',
          processId: 0
        },
        bounds: { x: 0, y: 0, width: 0, height: 0 },
        memoryUsage: 0
      };

      // 문자 추출 - keychar 대신 keycode 기반 변환 시도
      const keychar = rawEvent.keychar || 0;
      let char = '';
      
      // 1차: keychar가 있으면 사용
      if (keychar > 0) {
        char = String.fromCharCode(keychar);
      } 
      // 2차: keycode 기반 문자 변환 시도
      else if (rawEvent.keycode) {
        char = this.convertKeycodeToChar(rawEvent.keycode);
      }

      Logger.debug(this.componentName, `🔥 문자 추출 완료`, {
        keycode: rawEvent.keycode,
        keychar,
        char,
        charMethod: keychar > 0 ? 'keychar' : 'keycode',
        isValid: char ? this.isValidCharacter(char) : false
      });

      // 유효한 문자만 처리 (공백, 문자, 숫자, 한글 등)
      if (char && this.isValidCharacter(char)) {
        Logger.info(this.componentName, `✅ 유효한 키 입력 감지!`, { char });
        
        // 세션에 키 입력 기록
        this.sessionManager.recordKeyboardInput({
          character: char,
          timestamp: Date.now(),
          language: this.detectLanguage(char),
          windowInfo: {
            title: windowInfo.title,
            bundleId: windowInfo.owner.bundleId,
            processName: windowInfo.owner.name
          },
          inputMethod: 'direct', // 직접 입력
          rawKeyInfo: {
            keycode: rawEvent.keycode || 0,
            keychar: rawEvent.keychar || 0,
            key: char,
            shiftKey: rawEvent.shiftKey || false,
            ctrlKey: rawEvent.ctrlKey || false,
            altKey: rawEvent.altKey || false,
            metaKey: rawEvent.metaKey || false
          }
        });

        Logger.debug(this.componentName, '키 입력 처리됨', {
          char: char.charCodeAt(0) > 127 ? '[한글]' : char,
          keycode: rawEvent.keycode,
          window: windowInfo.title
        });

        // 외부 이벤트 발송
        this.eventEmitter.emit('key-input', {
          character: char,
          windowTitle: windowInfo.title,
          timestamp: Date.now()
        });
      }

    } catch (error) {
      Logger.error(this.componentName, '키 이벤트 처리 실패', error);
    }
  }

  /**
   * 🔥 유효한 문자인지 판별
   */
  private isValidCharacter(char: string): boolean {
    if (!char || char.length !== 1) return false;
    
    const charCode = char.charCodeAt(0);
    
    // 제어 문자 제외 (백스페이스, 탭, 엔터 등)
    if (charCode < 32) return false;
    
    // DEL 키 제외
    if (charCode === 127) return false;
    
    return true;
  }

  /**
   * 🔥 언어 감지
   */
  private detectLanguage(char: string): string {
    const charCode = char.charCodeAt(0);
    
    // 한글 (가-힣)
    if (charCode >= 0xAC00 && charCode <= 0xD7AF) {
      return 'ko';
    }
    
    // 영어 및 기타
    return 'en';
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
   * 🔥 이벤트 API
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
   * 🔥 권한 관련 API
   */
  public setAccessibilityPermission(hasPermission: boolean): void {
    this.permissionManager.setPermission(hasPermission);
    this.windowTracker.setAccessibilityPermission(hasPermission);
    Logger.info(this.componentName, '접근성 권한 상태 설정됨', { hasPermission });
  }

  /**
   * 🔥 언어 설정 API (IPC 호환성)
   */
  public setLanguage(language: string): Result<boolean> {
    try {
      Logger.info(this.componentName, '언어 설정', { language });
      // TODO: 실제 언어 설정 로직 구현
      return { success: true, data: true };
    } catch (error) {
      Logger.error(this.componentName, '언어 설정 실패', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * 🔥 최근 이벤트 조회 (IPC 호환성)
   */
  public getRecentEvents(count: number): Result<ProcessedKeyboardEvent[]> {
    try {
      Logger.info(this.componentName, '최근 이벤트 조회', { count });
      // TODO: 실제 최근 이벤트 조회 로직 구현
      return { success: true, data: [] };
    } catch (error) {
      Logger.error(this.componentName, '최근 이벤트 조회 실패', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * 🔥 한국어 강제 설정 (IPC 호환성)
   */
  public forceKoreanLanguage(): Result<boolean> {
    try {
      Logger.info(this.componentName, '한국어 강제 설정');
      return this.setLanguage('ko');
    } catch (error) {
      Logger.error(this.componentName, '한국어 강제 설정 실패', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * 🔥 언어 감지 테스트 (IPC 호환성)
   */
  public testLanguageDetection(keycodeOrChar: number | string, keychar?: number): Result<string> {
    try {
      if (typeof keycodeOrChar === 'string') {
        const language = this.detectLanguage(keycodeOrChar);
        Logger.debug(this.componentName, '언어 감지 테스트 (문자)', { char: keycodeOrChar, language });
        return { success: true, data: language };
      } else {
        const char = keychar ? String.fromCharCode(keychar) : String.fromCharCode(keycodeOrChar);
        const language = this.detectLanguage(char);
        Logger.debug(this.componentName, '언어 감지 테스트 (키코드)', { keycode: keycodeOrChar, char, language });
        return { success: true, data: language };
      }
    } catch (error) {
      Logger.error(this.componentName, '언어 감지 테스트 실패', error);
      return { success: false, error: String(error) };
    }
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
      windowTracker: boolean;
      uiohook: boolean;
    };
  }> {
    const baseHealth = await super.healthCheck();
    
    const moduleHealth = {
      permission: (await this.permissionManager.healthCheck()).healthy,
      stats: (await this.statsManager.healthCheck()).healthy,
      session: (await this.sessionManager.keyboardHealthCheck()).healthy,
      windowTracker: (await this.windowTracker.healthCheck()).healthy,
      uiohook: this.uiohook !== null
    };

    const allModulesHealthy = Object.values(moduleHealth).every(Boolean);

    return {
      ...baseHealth,
      healthy: baseHealth.healthy && allModulesHealthy,
      modules: moduleHealth
    };
  }

  /**
   * 🔥 키코드를 문자로 변환
   */
  private convertKeycodeToChar(keycode: number): string {
    // 일반 문자 키 (A-Z) - keycode 65-90
    if (keycode >= 65 && keycode <= 90) {
      return String.fromCharCode(keycode).toLowerCase();
    }
    
    // 숫자 키 (0-9) - keycode 48-57
    if (keycode >= 48 && keycode <= 57) {
      return String.fromCharCode(keycode);
    }
    
    // 특수 키들
    switch (keycode) {
      case 32: return ' '; // 스페이스
      case 13: return '\n'; // 엔터
      case 9: return '\t'; // 탭
      case 46: return '.'; // 마침표
      case 44: return ','; // 쉼표
      case 59: return ';'; // 세미콜론
      case 39: return "'"; // 아포스트로피
      case 91: return '['; // 열린 대괄호
      case 93: return ']'; // 닫힌 대괄호
      case 45: return '-'; // 하이픈
      case 61: return '='; // 등호
      case 47: return '/'; // 슬래시
      case 92: return '\\'; // 백슬래시
      
      // 한글 키보드 관련 키코드들 (macOS 기준)
      case 31: return 'ㅏ'; // ㅏ
      case 33: return 'ㅓ'; // ㅓ  
      case 32: return 'ㅡ'; // ㅡ
      case 37: return 'ㅜ'; // ㅜ
      case 38: return 'ㅠ'; // ㅠ
      case 35: return 'ㅗ'; // ㅗ
      case 30: return 'ㅛ'; // ㅛ
      case 57: return 'ㅕ'; // ㅕ
      case 45: return 'ㅣ'; // ㅣ
      case 19: return 'ㄱ'; // ㄱ
      case 20: return 'ㄴ'; // ㄴ
      case 21: return 'ㄷ'; // ㄷ
      case 23: return 'ㄹ'; // ㄹ
      case 24: return 'ㅁ'; // ㅁ
      case 25: return 'ㅂ'; // ㅂ
      case 26: return 'ㅅ'; // ㅅ
      case 18: return 'ㅇ'; // ㅇ
      case 17: return 'ㅈ'; // ㅈ
      case 46: return 'ㅊ'; // ㅊ
      case 22: return 'ㅋ'; // ㅋ
      case 15: return 'ㅌ'; // ㅌ
      case 16: return 'ㅍ'; // ㅍ
      case 14: return 'ㅎ'; // ㅎ
      case 42: return 'ㅗ'; // ㅗ (조합)
      case 29: return 'ㅏ'; // ㅏ (조합)
      case 58: return 'ㅁ'; // ㅁ (대문자)
      case 3675: return 'ㅇ'; // ㅇ (cmd 키 조합)
      
      default:
        // 알 수 없는 키코드는 빈 문자열 반환
        Logger.debug(this.componentName, `알 수 없는 키코드: ${keycode}`);
        return '';
    }
  }
}

// 🔥 싱글톤 인스턴스
export const keyboardService = new KeyboardService();

export default KeyboardService;
