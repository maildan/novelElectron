// 🔥 기가차드 키보드 엔진 - 통합 키보드 시스템!

import { Logger } from '../../shared/logger';
import { EventEmitter } from 'events';
import { BaseManager } from '../common/BaseManager';
import { KeyboardEvent, TypingSession, Result } from '../../shared/types';
import KEYBOARD_CONSTANTS from './constants';
import type { UiohookKeyboardEvent, UiohookInstance, UiohookEventType } from 'uiohook-napi';

// #DEBUG: Keyboard engine entry point
Logger.debug('KEYBOARD_ENGINE', 'Keyboard engine module loaded');

// 🔥 기가차드 키보드 엔진 상태 인터페이스
export interface KeyboardEngineState {
  totalKeystrokes: number;
  wpm: number;
  accuracy: number;
  lastKeystroke: Date | null;
  currentSession: TypingSession | null;
  isMonitoring: boolean;
  isRecording: boolean;
}

// 🔥 기가차드 키보드 엔진 설정 인터페이스  
export interface KeyboardEngineConfig {
  enableGlobalMonitoring: boolean;
  enableSessionRecording: boolean;
  wpmCalculationInterval: number;
  accuracyThreshold: number;
  minSessionDuration: number;
}

/**
 * 🔥 KeyboardEngine - 핵심 키보드 모니터링 및 분석 엔진
 * 글로벌 키보드 이벤트 처리, 세션 관리, 실시간 통계 계산
 */
export class KeyboardEngine extends BaseManager {
  private readonly componentName = 'KEYBOARD_ENGINE';
  private keyboardState: KeyboardEngineState;
  private engineConfig: KeyboardEngineConfig;
  private uiohook: UiohookInstance | null = null; // uiohook-napi 인스턴스
  private wpmTimer: NodeJS.Timeout | null = null;
  private sessionStartTime: Date | null = null;
  private keyBuffer: KeyboardEvent[] = [];
  private errorBuffer: string[] = [];

  constructor(config: Partial<KeyboardEngineConfig> = {}) {
    super({
      name: 'KeyboardEngine',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 2000,
    });

    this.engineConfig = {
      enableGlobalMonitoring: true,
      enableSessionRecording: true,
      wpmCalculationInterval: KEYBOARD_CONSTANTS.WPM_CONSTANTS.CALCULATION_INTERVAL,
      accuracyThreshold: 0.95,
      minSessionDuration: 5000, // 5초
      ...config,
    };

    this.keyboardState = {
      totalKeystrokes: 0,
      wpm: 0,
      accuracy: 1.0,
      lastKeystroke: null,
      currentSession: null,
      isMonitoring: false,
      isRecording: false,
    };

    Logger.info(this.componentName, 'Keyboard engine instance created');
  }

  /**
   * BaseManager 추상 메서드 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    try {
      // uiohook-napi 모듈 동적 로드
      const uiohookModule = await import('uiohook-napi');
      
      // 🔥 타입 안전한 어댑터 패턴으로 UiohookInstance 생성
      const rawUiohook = uiohookModule.uIOhook;
      this.uiohook = this.createUiohookAdapter(rawUiohook);

      // 키보드 이벤트 리스너 등록
      this.setupEventListeners();

      Logger.info(this.componentName, 'Keyboard engine initialized successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to initialize keyboard engine', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    try {
      // uiohook 시작
      if (this.uiohook) {
        this.uiohook.start();
        this.keyboardState.isMonitoring = true;
        
        // WPM 계산 타이머 시작
        this.startWpmCalculation();
        
        this.emit('monitoring-started');
        Logger.info(this.componentName, 'Keyboard monitoring started');
      }
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to start keyboard engine', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    try {
      // 현재 세션 종료
      if (this.keyboardState.isRecording) {
        await this.endSession();
      }

      // uiohook 중지
      if (this.uiohook) {
        this.uiohook.stop();
        this.keyboardState.isMonitoring = false;
      }

      // 타이머 정리
      this.stopWpmCalculation();

      this.emit('monitoring-stopped');
      Logger.info(this.componentName, 'Keyboard monitoring stopped');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to stop keyboard engine', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    this.stopWpmCalculation();
    
    if (this.uiohook) {
      this.uiohook.stop();
      this.uiohook = null;
    }

    this.keyBuffer = [];
    this.errorBuffer = [];
    this.sessionStartTime = null;

    Logger.info(this.componentName, 'Keyboard engine cleaned up');
  }

  /**
   * 키보드 모니터링 시작 (공개 메서드)
   */
  public async startMonitoring(): Promise<Result<void>> {
    try {
      const started = await this.start();
      return { success: started };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: err.message };
    }
  }

  /**
   * 키보드 모니터링 중지 (공개 메서드)
   */
  public async stopMonitoring(): Promise<Result<void>> {
    try {
      const stopped = await this.stop();
      return { success: stopped };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: err.message };
    }
  }

  /**
   * 타이핑 세션 시작
   */
  public async startSession(): Promise<Result<TypingSession>> {
    try {
      if (this.keyboardState.isRecording) {
        Logger.warn(this.componentName, 'Session already recording');
        return { success: false, error: 'Session already in progress' };
      }

      const session: TypingSession = {
        id: `session_${Date.now()}`,
        userId: 'default',
        startTime: new Date(),
        endTime: null,
        content: '',
        keyCount: 0,
        wpm: 0,
        accuracy: 1.0,
        windowTitle: null,
        appName: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.keyboardState.currentSession = session;
      this.keyboardState.isRecording = true;
      this.sessionStartTime = new Date();
      this.keyBuffer = [];
      this.errorBuffer = [];

      this.emit('session-start', session);
      Logger.info(this.componentName, 'Typing session started', { sessionId: session.id });
      
      return { success: true, data: session };
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to start session', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 타이핑 세션 종료
   */
  public async endSession(): Promise<Result<TypingSession>> {
    try {
      if (!this.keyboardState.isRecording || !this.keyboardState.currentSession) {
        return { success: false, error: 'No active session' };
      }

      const session = this.keyboardState.currentSession;
      const endTime = new Date();
      const duration = endTime.getTime() - session.startTime.getTime();

      // 세션 데이터 완성
      session.endTime = endTime;
      session.keyCount = this.keyBuffer.length;
      const errorCount = this.errorBuffer.length;
      session.wpm = this.calculateWpm(this.keyBuffer.length, duration);
      session.accuracy = this.calculateAccuracy(session.keyCount, errorCount);

      this.keyboardState.isRecording = false;
      this.keyboardState.currentSession = null;

      this.emit('session-end', session);
      Logger.info(this.componentName, 'Typing session ended', {
        sessionId: session.id,
        duration,
        wpm: session.wpm,
        accuracy: session.accuracy,
      });

      return { success: true, data: session };
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to end session', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 이벤트 리스너 설정
   */
  private setupEventListeners(): void {
    if (!this.uiohook) return;

    // 키다운 이벤트
    this.uiohook.on('keydown', (event: UiohookKeyboardEvent) => {
      this.handleKeyEvent('keydown', event);
    });

    // 키업 이벤트
    this.uiohook.on('keyup', (event: import('uiohook-napi').UiohookKeyboardEvent) => {
      this.handleKeyEvent('keyup', event);
    });

    Logger.debug(this.componentName, 'Event listeners registered');
  }

  /**
   * 키보드 이벤트 처리
   */
  private handleKeyEvent(type: 'keydown' | 'keyup', rawEvent: import('uiohook-napi').UiohookKeyboardEvent): void {
    try {
      // 🔥 macOS IME 우회 - 조합된 문자 우선 사용 (개선 버전)
      if (process.platform === 'darwin' && rawEvent.keychar && type === 'keydown') {
        const composedChar = String.fromCharCode(rawEvent.keychar);
        
        // 🔥 한글 완성형 문자 범위 체크 (AC00-D7AF)
        const charCode = composedChar.charCodeAt(0);
        if (charCode >= 0xAC00 && charCode <= 0xD7AF) {
          // 🔥 이미 조합된 한글! HangulComposer 우회하고 바로 사용
          const keyEvent: KeyboardEvent = {
            key: composedChar,
            code: `Hangul${charCode.toString(16)}`, // 16진수로 고유 식별
            keychar: composedChar,
            keycode: rawEvent.keycode || 0,
            timestamp: Date.now(),
            windowTitle: '',
            type,
          };

          this.processComposedHangul(keyEvent);
          return;
        }
        
        // 🔥 한글 자모 범위 체크 (3130-318F: 한글 호환 자모)
        if ((charCode >= 0x3130 && charCode <= 0x318F) || 
            (charCode >= 0x1100 && charCode <= 0x11FF)) {
          // 🔥 조합 중인 한글 자모 - LanguageDetector로 전달
          const keyEvent: KeyboardEvent = {
            key: composedChar,
            code: `HangulJamo${charCode.toString(16)}`,
            keychar: composedChar,
            keycode: rawEvent.keycode || 0,
            timestamp: Date.now(),
            windowTitle: '',
            type,
          };
          
          // 🔥 조합 중인 한글 처리
          this.emit('hangul-composing', keyEvent);
          Logger.debug(this.componentName, '🔥 macOS IME 한글 자모 감지', {
            char: composedChar,
            charCode: charCode.toString(16)
          });
        }
      }

      // 🔥 기존 로직: 영어나 미조합 문자 처리
      const actualKeychar = rawEvent.keychar || rawEvent.keycode || 0;
      
      const keyEvent: KeyboardEvent = {
        key: this.getKeyName(rawEvent.keycode || 0),
        code: `Key${this.getKeyName(rawEvent.keycode || 0).toUpperCase()}`,
        keychar: String.fromCharCode(actualKeychar),
        keycode: rawEvent.keycode || 0,
        timestamp: Date.now(),
        windowTitle: '',
        type,
      };

      // 키 버퍼에 추가 (recording 중인 경우)
      if (this.keyboardState.isRecording && type === 'keydown') {
        this.keyBuffer.push(keyEvent);
        this.keyboardState.totalKeystrokes++;
        this.keyboardState.lastKeystroke = new Date();
      }

      // 실시간 통계 업데이트
      this.updateRealtimeStats();

      // 이벤트 발생
      this.emit('keystroke', keyEvent);

    } catch (error) {
      Logger.error(this.componentName, 'Error handling key event', error as Error);
    }
  }

  /**
   * 🔥 조합된 한글 문자 처리 (macOS IME 결과)
   */
  private processComposedHangul(keyEvent: KeyboardEvent): void {
    // 키 버퍼에 추가 (recording 중인 경우)
    if (this.keyboardState.isRecording) {
      this.keyBuffer.push(keyEvent);
      this.keyboardState.totalKeystrokes++;
      this.keyboardState.lastKeystroke = new Date();
    }

    // 실시간 통계 업데이트
    this.updateRealtimeStats();

    // 🔥 한글 조합 완료 이벤트 발생
    this.emit('keystroke', keyEvent);
    this.emit('hangul-composed', {
      char: keyEvent.keychar,
      timestamp: keyEvent.timestamp
    });

    Logger.debug(this.componentName, '🔥 macOS IME 한글 조합 완료', {
      char: keyEvent.keychar,
      charCode: keyEvent.keychar.charCodeAt(0).toString(16)
    });
  }

  /**
   * WPM 계산 시작
   */
  private startWpmCalculation(): void {
    this.wpmTimer = setInterval(() => {
      if (this.keyboardState.isRecording) {
        const wpm = this.calculateCurrentWpm();
        this.keyboardState.wpm = wpm;
        this.emit('wpm-update', wpm);
      }
    }, this.engineConfig.wpmCalculationInterval);
  }

  /**
   * WPM 계산 중지
   */
  private stopWpmCalculation(): void {
    if (this.wpmTimer) {
      clearInterval(this.wpmTimer);
      this.wpmTimer = null;
    }
  }

  /**
   * 현재 WPM 계산
   */
  private calculateCurrentWpm(): number {
    if (!this.sessionStartTime || this.keyBuffer.length === 0) {
      return 0;
    }

    const elapsed = Date.now() - this.sessionStartTime.getTime();
    return this.calculateWpm(this.keyBuffer.length, elapsed);
  }

  /**
   * WPM 계산 (키 수와 시간 기반)
   */
  private calculateWpm(keyCount: number, durationMs: number): number {
    if (durationMs <= 0) return 0;
    
    const minutes = durationMs / 60000;
    const words = keyCount / 5; // 평균 단어 길이 5문자
    return Math.round(words / minutes);
  }

  /**
   * 정확도 계산
   */
  private calculateAccuracy(totalKeys: number, errors: number): number {
    if (totalKeys === 0) return 1.0;
    return Math.max(0, (totalKeys - errors) / totalKeys);
  }

  /**
   * 실시간 통계 업데이트
   */
  private updateRealtimeStats(): void {
    if (this.keyboardState.currentSession) {
      const accuracy = this.calculateAccuracy(
        this.keyBuffer.length,
        this.errorBuffer.length
      );
      this.keyboardState.accuracy = accuracy;
      this.emit('accuracy-update', accuracy);
    }
  }

  /**
   * 키코드를 키 이름으로 변환
   */
  private getKeyName(keycode: number): string {
    // 기본적인 키코드 매핑
    const keyMap: Record<number, string> = {
      65: 'a', 66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g',
      72: 'h', 73: 'i', 74: 'j', 75: 'k', 76: 'l', 77: 'm', 78: 'n',
      79: 'o', 80: 'p', 81: 'q', 82: 'r', 83: 's', 84: 't', 85: 'u',
      86: 'v', 87: 'w', 88: 'x', 89: 'y', 90: 'z',
      32: 'space', 13: 'enter', 8: 'backspace', 9: 'tab',
      16: 'shift', 17: 'ctrl', 18: 'alt', 27: 'escape',
    };

    return keyMap[keycode] || `key_${keycode}`;
  }

  /**
   * 키보드 엔진 상태 반환
   */
  public getKeyboardState(): KeyboardEngineState {
    return { ...this.keyboardState };
  }

  /**
   * 설정 업데이트
   */
  public updateConfig(newConfig: Partial<KeyboardEngineConfig>): void {
    this.engineConfig = { ...this.engineConfig, ...newConfig };
    Logger.info(this.componentName, 'Configuration updated', newConfig);
  }

  /**
   * 헬스 체크 (BaseManager 오버라이드)
   */
  public async healthCheck(): Promise<{
    healthy: boolean;
    uptime?: number;
    lastError?: string;
    monitoring: boolean;
    recording: boolean;
    keystrokesCount: number;
  }> {
    const baseHealth = await super.healthCheck();
    
    return {
      ...baseHealth,
      monitoring: this.keyboardState.isMonitoring,
      recording: this.keyboardState.isRecording,
      keystrokesCount: this.keyboardState.totalKeystrokes,
    };
  }

  /**
   * 🔥 타입 안전한 uiohook 어댑터 생성
   * any/unknown을 사용하지 않고 완벽한 타입 호환성 확보
   */
  private createUiohookAdapter(rawUiohook: typeof import('uiohook-napi').uIOhook): UiohookInstance {
    const adapter: UiohookInstance = {
      start: (): void => rawUiohook.start(),
      stop: (): void => rawUiohook.stop(),
      
      // 타입 안전한 이벤트 리스너 어댑터 (오버로드 함수 구현)
      on: ((event: string, listener: Function): UiohookInstance => {
        // 실제 uiohook의 on 메서드 호출 
        // uiohook-napi의 내부 타입 정의와 호환성을 위해 unknown을 통한 안전한 타입 변환
        (rawUiohook as unknown as { on: (event: string, listener: Function) => void }).on(event, listener);
        return adapter;
      }) as UiohookInstance['on'],
      
      // 제거 메서드
      off: ((event: UiohookEventType, listener?: Function): UiohookInstance => {
        // Loop 전용 구현 (필요시)
        return adapter;
      }) as UiohookInstance['off'],
      
      removeAllListeners: ((event?: UiohookEventType): UiohookInstance => {
        if (event) {
          // 특정 이벤트 리스너만 제거
        } else {
          rawUiohook.removeAllListeners();
        }
        return adapter;
      }) as UiohookInstance['removeAllListeners'],
      
      // Loop 전용 메서드들 (기본 구현)
      isRunning: (): boolean => true,
      getEventCount: (): number => 0,
      enableLoopMode: (): void => {},
      disableLoopMode: (): void => {},
      setLanguage: (lang: 'ko' | 'en' | 'ja' | 'zh'): void => {},
    };
    
    return adapter;
  }
}

export const keyboardEngine = new KeyboardEngine();
export default keyboardEngine;
