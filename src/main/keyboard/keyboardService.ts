// 🔥 기가차드 키보드 서비스 - 완전히 새로운 다국어 지원!

import { EventEmitter } from 'events';
import { Logger } from '../../shared/logger';
import { LanguageDetector } from './detectors/LanguageDetector';
import { HangulComposer, type HangulCompositionResult } from './HangulComposer';
import { BaseManager } from '../common/BaseManager';
import { KEYBOARD_LANGUAGES } from '../../shared/common';
import { HANGUL_KEY_MAP } from './constants';
import type { UiohookInstance } from 'uiohook-napi';
import { WindowTracker, WindowInfo as GetWindowsInfo } from './WindowTracker';



// 🔥 타입 임포트 (기존 타입만 사용)
import type {
  UiohookKeyboardEvent,
  KeyboardEvent,
  IpcResponse,
  MonitoringStatus,
  RealtimeStats
} from '../../shared/types';

// 🔥 내부 타입 정의
interface ProcessedKeyboardEvent {
  key: string;
  code: string;
  keychar: string;
  timestamp: number;
  windowTitle: string;
  type: 'keydown' | 'keyup' | 'input';
  language: string;
  composedChar: string;
  isComposing: boolean;
  inputMethod: 'direct' | 'composition';
  processingTime: number;
}

interface KeyboardServiceState {
  isMonitoring: boolean;
  isRecording: boolean;
  language: string;
  inputMethod: 'direct' | 'composition';
  totalEvents: number;
  sessionStartTime: Date | null;
  lastEventTime: Date | null;
}

/**
 * 🔥 기가차드 키보드 서비스 - 완전히 새로운 다국어 지원 시스템!
 */
export class KeyboardService extends EventEmitter {
  private readonly componentName = 'KEYBOARD';
  
  // 🔥 의존성 주입
  private languageDetector: LanguageDetector;
  private hangulComposer: HangulComposer;
  private windowTracker: WindowTracker | null = null;
  private uiohook: UiohookInstance | null = null; // 🔥 uiohook 인스턴스 복구!
  
  // 🔥 상태 관리
  private state: KeyboardServiceState = {
    isMonitoring: false,
    isRecording: false,
    language: 'en', // 기본값은 영어
    inputMethod: 'direct',
    totalEvents: 0,
    sessionStartTime: null,
    lastEventTime: null,
  };
  
  // 🔥 이벤트 버퍼
  private eventBuffer: ProcessedKeyboardEvent[] = [];
  private readonly maxBufferSize = 1000;
  
  // 🔥 성능 추적
  private eventsPerSecond = 0;
  private lastSecondTime = 0;
  private lastSecondCount = 0;

  constructor() {
    super();
    
    // 🔥 의존성 초기화
    this.languageDetector = new LanguageDetector();
    this.hangulComposer = new HangulComposer();
    
    // 🔥 uiohook 초기화
    this.initializeUiohook();
    
    Logger.info(this.componentName, '🔥 Advanced KeyboardService initialized');
  }

  /**
   * 🔥 uiohook 초기화
   */
  private async initializeUiohook(): Promise<void> {
    try {
      Logger.info(this.componentName, 'Loading uiohook-napi...');
      
      const uiohookModule = await import('uiohook-napi');
      this.uiohook = uiohookModule.uIOhook as unknown as UiohookInstance;
      
      Logger.info(this.componentName, 'uiohook-napi loaded successfully');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to load uiohook-napi', error);
      throw new Error('Keyboard monitoring unavailable');
    }
  }

  /**
   * 🔥 키보드 모니터링 시작
   */
  public async startMonitoring(): Promise<IpcResponse<boolean>> {
    try {
      if (this.state.isMonitoring) {
        return { 
          success: true, 
          data: true,
          timestamp: new Date()
        };
      }

      Logger.info(this.componentName, '🔥 Starting keyboard monitoring');
      
      // 🔥 uiohook 확인
      if (!this.uiohook) {
        throw new Error('uiohook not initialized');
      }
      
      // 🔥 의존성 초기화
      await this.languageDetector.initialize();
      await this.languageDetector.start();
      
      await this.hangulComposer.initialize();
      await this.hangulComposer.start();

      // 🔥 키보드 이벤트 리스너 설정 - 핵심!
      this.uiohook.on('keydown', (rawEvent: UiohookKeyboardEvent) => {
        this.handleKeyEvent('keydown', rawEvent).catch(error => {
          Logger.error(this.componentName, 'Failed to handle keydown event', error);
        });
      });

      this.uiohook.on('keyup', (rawEvent: UiohookKeyboardEvent) => {
        this.handleKeyEvent('keyup', rawEvent).catch(error => {
          Logger.error(this.componentName, 'Failed to handle keyup event', error);
        });
      });

      // 🔥 모니터링 시작
      this.uiohook.start();

      this.state.isMonitoring = true;
      this.state.sessionStartTime = new Date();
      
      this.emit('monitoring-started');
      
      Logger.info(this.componentName, 'Keyboard monitoring started successfully');
      
      return { 
        success: true, 
        data: true,
        timestamp: new Date()
      };
      
    } catch (error) {
      Logger.error(this.componentName, 'Failed to start monitoring', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        data: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * 🔥 키보드 모니터링 중지
   */
  public async stopMonitoring(): Promise<IpcResponse<boolean>> {
    try {
      if (!this.state.isMonitoring) {
        return { 
          success: true, 
          data: true,
          timestamp: new Date()
        };
      }

      Logger.info(this.componentName, '🔥 Stopping keyboard monitoring');
      
      // 🔥 uiohook 중지
      if (this.uiohook) {
        this.uiohook.stop();
        this.uiohook.removeAllListeners();
      }
      
      // 🔥 의존성 정리
      await this.languageDetector.stop();
      await this.hangulComposer.stop();

      this.state.isMonitoring = false;
      this.state.sessionStartTime = null;
      
      this.emit('monitoring-stopped');
      
      Logger.info(this.componentName, 'Keyboard monitoring stopped successfully');
      
      return { 
        success: true, 
        data: true,
        timestamp: new Date()
      };
      
    } catch (error) {
      Logger.error(this.componentName, 'Failed to stop monitoring', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        data: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * 🔥 모니터링 상태 조회
   */
  public async getStatus(): Promise<IpcResponse<MonitoringStatus>> {
    try {
      const status: MonitoringStatus = {
        isActive: this.state.isMonitoring,
        startTime: this.state.sessionStartTime || undefined,
        sessionDuration: this.state.sessionStartTime 
          ? Date.now() - this.state.sessionStartTime.getTime()
          : 0,
        language: this.state.language
      };

      return {
        success: true,
        data: status,
        timestamp: new Date()
      };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to get status', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }

  /**
   * 🔥 키 이벤트 처리 - 다국어 지원
   */
  private async handleKeyEvent(type: 'keydown' | 'keyup', rawEvent: UiohookKeyboardEvent): Promise<void> {
    try {
      const processingStart = performance.now();

      // 🔥 즉시 로깅으로 실제 데이터 확인
      Logger.info(this.componentName, '🚨 Raw key event received', {
        type,
        keycode: rawEvent.keycode,
        keycodeChar: rawEvent.keycode ? String.fromCharCode(rawEvent.keycode) : 'unknown',
        altKey: rawEvent.altKey,
        ctrlKey: rawEvent.ctrlKey,
        metaKey: rawEvent.metaKey,
        shiftKey: rawEvent.shiftKey
      });

      // 🔥 1. 언어 감지 (새로운 시스템)
      const detectionResult = this.languageDetector.detectLanguage(rawEvent);
      const currentLanguage = detectionResult.language;
      
      Logger.debug(this.componentName, '🔥 Advanced language detection completed', {
        keycode: rawEvent.keycode,
        keychar: undefined, // uiohook-napi에는 keychar가 없음
        result: {
          language: detectionResult.language,
          confidence: detectionResult.confidence,
          method: detectionResult.method || 'unknown',
          isComposing: detectionResult.isComposing
        },
        detectionTime: `${(performance.now() - processingStart).toFixed(3)}ms`
      });

      // 🔥 언어 상태 업데이트 (신뢰도 기반)
      if (detectionResult.confidence >= 0.7) {
        // 🔥 고신뢰도: 즉시 업데이트
        if (this.state.language !== detectionResult.language) {
          Logger.info(this.componentName, '✅ High confidence language update', {
            from: this.state.language,
            to: detectionResult.language,
            confidence: detectionResult.confidence
          });
          
          this.state.language = detectionResult.language;
          this.state.inputMethod = this.getInputMethod(detectionResult.language);
        }
      } else if (detectionResult.confidence >= 0.5) {
        // 🔥 중간신뢰도: 부분적 업데이트
        Logger.debug(this.componentName, '⚠️ Medium confidence, partial update', {
          currentLanguage: this.state.language,
          detectedLanguage: detectionResult.language,
          confidence: detectionResult.confidence
        });
        
        if (this.state.language !== detectionResult.language) {
          this.state.language = detectionResult.language;
        }
      } else {
        // 🔥 낮은신뢰도: 현재 언어 유지
        Logger.debug(this.componentName, '⚠️ Low confidence, keeping current language', {
          currentLanguage: this.state.language,
          detectedLanguage: detectionResult.language,
          confidence: detectionResult.confidence
        });
      }

      // 🔥 2. 언어별 조합 처리
      let composedChar: string | undefined;
      let hangulResult: HangulCompositionResult | undefined;
      
      if (currentLanguage === 'ko' && type === 'keydown') {
        hangulResult = await this.processHangulComposition(rawEvent);
        composedChar = hangulResult?.completed || hangulResult?.composing;
        
        Logger.info(this.componentName, '🇰🇷 Korean input processing', {
          keycode: rawEvent.keycode,
          keycodeChar: String.fromCharCode(rawEvent.keycode || 0),
          hangulResult: {
            completed: hangulResult?.completed || 'none',
            composing: hangulResult?.composing || 'none'
          }
        });
      } else if (currentLanguage === 'ja' && type === 'keydown') {
        composedChar = this.processJapaneseComposition(rawEvent);
      } else if (currentLanguage === 'zh' && type === 'keydown') {
        composedChar = this.processChineseComposition(rawEvent);
      }

      // 🔥 3. 윈도우 정보 가져오기
      const windowTitle = this.windowTracker?.getCurrentWindow()?.title || 'Unknown Window';

      // 🔥 4. 이벤트 생성
      const processedEvent: ProcessedKeyboardEvent = {
        key: this.getDisplayKey(rawEvent, currentLanguage, composedChar, hangulResult),
        code: `Key${rawEvent.keycode}`,
        keychar: composedChar || '',
        timestamp: Date.now(),
        windowTitle,
        type: type === 'keydown' && composedChar ? 'input' : type,
        language: currentLanguage,
        composedChar: composedChar || '',
        isComposing: !!hangulResult?.composing || !!composedChar,
        inputMethod: this.getInputMethod(currentLanguage),
        processingTime: performance.now() - processingStart,
      };

      // 🔥 이벤트 처리 완료 로깅
      Logger.info(this.componentName, '✅ Event processing completed', {
        key: processedEvent.key,
        language: processedEvent.language,
        isComposing: processedEvent.isComposing,
        processingTime: `${processedEvent.processingTime.toFixed(2)}ms`
      });

      // 🔥 5. 이벤트 버퍼 관리
      this.eventBuffer.push(processedEvent);
      if (this.eventBuffer.length > this.maxBufferSize) {
        this.eventBuffer.shift();
      }

      // 🔥 6. 통계 업데이트
      this.state.totalEvents++;
      this.state.lastEventTime = new Date();
      this.updateEventsPerSecond();

      // 🔥 7. 이벤트 발송
      this.emit('keyboard-event', processedEvent);
      
      Logger.debug(this.componentName, 'Event processed', {
        type,
        language: currentLanguage,
        processingTime: `${processedEvent.processingTime.toFixed(2)}ms`,
        isComposing: processedEvent.isComposing
      });

    } catch (error) {
      Logger.error(this.componentName, 'Error processing key event', error);
    }
  }

  /**
   * 🔥 한글 조합 처리
   */
  private async processHangulComposition(rawEvent: UiohookKeyboardEvent): Promise<HangulCompositionResult> {
    try {
      const keyboardEvent: KeyboardEvent = {
        key: this.mapKeyToString(rawEvent.keycode),
        code: `Key${rawEvent.keycode}`,
        keychar: String.fromCharCode(rawEvent.keycode || 0),
        timestamp: Date.now(),
        windowTitle: this.windowTracker?.getCurrentWindow()?.title || 'Unknown',
        type: 'keydown'
      };

      if (!this.hangulComposer.isRunning()) {
        await this.hangulComposer.initialize();
        await this.hangulComposer.start();
      }

      const result = await this.hangulComposer.processKey(keyboardEvent);
      
      Logger.debug(this.componentName, 'Hangul composition result', {
        completed: result.completed,
        composing: result.composing,
        isComposing: !!result.composing
      });

      return result;
      
    } catch (error) {
      Logger.error(this.componentName, 'Failed to process hangul composition', error);
      return {
        completed: '',
        composing: ''
      };
    }
  }

  /**
   * 🔥 일본어 조합 처리
   */
  private processJapaneseComposition(rawEvent: UiohookKeyboardEvent): string | undefined {
    // 🔥 일본어 히라가나/가타가나 범위 확인
    const keycode = rawEvent.keycode;
    
    // A-Z 범위에서 일본어 로마자 입력 처리
    if (keycode >= 65 && keycode <= 90) {
      const char = String.fromCharCode(keycode).toLowerCase();
      // 🔥 여기서 실제 일본어 IME 로직을 구현할 수 있음
      return char;
    }
    
    return undefined;
  }

  /**
   * 🔥 중국어 조합 처리
   */
  private processChineseComposition(rawEvent: UiohookKeyboardEvent): string | undefined {
    // 🔥 중국어 한자 범위 확인
    const keycode = rawEvent.keycode;
    
    // A-Z 범위에서 중국어 병음 입력 처리
    if (keycode >= 65 && keycode <= 90) {
      const char = String.fromCharCode(keycode).toLowerCase();
      // 🔥 여기서 실제 중국어 IME 로직을 구현할 수 있음
      return char;
    }
    
    return undefined;
  }

  /**
   * 🔥 표시할 키 문자 결정
   */
  private getDisplayKey(
    rawEvent: UiohookKeyboardEvent,
    language: string,
    composedChar?: string,
    hangulResult?: HangulCompositionResult
  ): string {
    try {
      // 🔥 1. 완성된 한글 문자 우선
      if (hangulResult?.completed) {
        return hangulResult.completed;
      }

      // 🔥 2. 조합된 문자 우선
      if (composedChar) {
        return composedChar;
      }

      // 🔥 3. 조합 중인 한글 문자
      if (hangulResult?.composing) {
        return hangulResult.composing;
      }

      // 🔥 4. 한글 키 매핑
      if (language === 'ko') {
        const pressedKey = String.fromCharCode(rawEvent.keycode).toLowerCase();
        const hangulChar = this.getHangulCharFromKey(pressedKey);
        if (hangulChar) {
          return hangulChar;
        }
      }

      // 🔥 5. 일반 문자
      if (rawEvent.keycode >= 32 && rawEvent.keycode <= 126) {
        return String.fromCharCode(rawEvent.keycode);
      }

      // 🔥 6. 특수 키
      return this.mapKeyToString(rawEvent.keycode);
      
    } catch (error) {
      Logger.error(this.componentName, 'Error in getDisplayKey', error);
      return String.fromCharCode(rawEvent.keycode);
    }
  }

  /**
   * 🔥 한글 키 → 한글 문자 매핑
   */
  private getHangulCharFromKey(key: string): string | undefined {
    // 🔥 이제 HANGUL_KEY_MAP이 영어→한글 구조이므로 직접 접근
    return HANGUL_KEY_MAP[key.toLowerCase() as keyof typeof HANGUL_KEY_MAP];
  }

  /**
   * 🔥 키코드 → 문자열 매핑
   */
  private mapKeyToString(keycode: number): string {
    const specialKeys: Record<number, string> = {
      8: 'Backspace',
      9: 'Tab',
      13: 'Enter',
      16: 'Shift',
      17: 'Ctrl',
      18: 'Alt',
      20: 'CapsLock',
      27: 'Escape',
      32: ' ',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      46: 'Delete',
    };
    
    return specialKeys[keycode] || String.fromCharCode(keycode);
  }

  /**
   * 🔥 언어별 입력 방식 결정
   */
  private getInputMethod(language: string): 'direct' | 'composition' {
    switch (language) {
      case 'ko':
      case 'ja':
      case 'zh':
        return 'composition';
      default:
        return 'direct';
    }
  }

  /**
   * 🔥 이벤트/초 계산
   */
  private updateEventsPerSecond(): void {
    const now = Date.now();
    const currentSecond = Math.floor(now / 1000);
    
    if (currentSecond !== this.lastSecondTime) {
      this.eventsPerSecond = this.lastSecondCount;
      this.lastSecondTime = currentSecond;
      this.lastSecondCount = 1;
    } else {
      this.lastSecondCount++;
    }
  }

  /**
   * 🔥 실시간 통계 조회
   */
  public getRealtimeStats(): IpcResponse<RealtimeStats> {
    try {
      const stats: RealtimeStats = {
        currentWpm: 0, // 🔥 WPM 계산 로직 추가 예정
        accuracy: 100, // 🔥 정확도 계산 로직 추가 예정
        sessionTime: this.state.sessionStartTime 
          ? Date.now() - this.state.sessionStartTime.getTime()
          : 0,
        charactersTyped: this.eventBuffer.filter(e => e.type === 'input').length,
        errorsCount: 0 // 🔥 에러 카운트 로직 추가 예정
      };

      return { 
        success: true, 
        data: stats,
        timestamp: new Date()
      };
      
    } catch (error) {
      Logger.error(this.componentName, 'Failed to get realtime stats', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }

  /**
   * 🔥 언어 강제 설정
   */
  public forceKorean(): IpcResponse<boolean> {
    try {
      Logger.info(this.componentName, '🔥 Force setting language to Korean');
      this.state.language = 'ko';
      this.state.inputMethod = 'composition';
      this.languageDetector.setLanguage('ko');
      
      return {
        success: true,
        data: true,
        timestamp: new Date()
      };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to force Korean language', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * 🔥 언어 감지 테스트
   */
  public testLanguageDetection(keycode: number): IpcResponse<string> {
    try {
      const testEvent = { keycode } as UiohookKeyboardEvent;
      
      Logger.info(this.componentName, '🔥 Testing language detection', {
        testKeycode: keycode,
        testKeycodeChar: String.fromCharCode(keycode)
      });
      
      const result = this.languageDetector.detectLanguage(testEvent);
      Logger.info(this.componentName, '🔥 Language detection test result', { result });
      
      return {
        success: true,
        data: result.language,
        timestamp: new Date()
      };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to test language detection', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: 'en',
        timestamp: new Date()
      };
    }
  }

  /**
   * 🔥 WindowTracker 설정
   */
  public setWindowTracker(tracker: WindowTracker): void {
    this.windowTracker = tracker;
    Logger.info(this.componentName, 'WindowTracker attached');
  }

  /**
   * 🔥 접근성 권한 설정
   */
  public setAccessibilityPermission(hasPermission: boolean): void {
    Logger.info(this.componentName, `Accessibility permission set: ${hasPermission}`);
    // 권한 상태에 따른 추가 로직이 필요하면 여기에 구현
  }

  /**
   * 🔥 정리
   */
  public async cleanup(): Promise<void> {
    try {
      await this.stopMonitoring();
      
      // 🔥 uiohook 정리
      if (this.uiohook) {
        this.uiohook.removeAllListeners();
        this.uiohook = null;
      }
      
      await this.languageDetector.cleanup();
      await this.hangulComposer.cleanup();
      
      this.eventBuffer = [];
      this.removeAllListeners();
      
      Logger.info(this.componentName, 'KeyboardService cleaned up');
    } catch (error) {
      Logger.error(this.componentName, 'Error during cleanup', error);
    }
  }
}

// 🔥 기가차드 전역 키보드 서비스
export const keyboardService = new KeyboardService();

Logger.debug('KEYBOARD', 'Advanced keyboard service initialization complete');

export default keyboardService;
