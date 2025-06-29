// 🔥 기가차드 키보드 모니터링 서비스 - 다국어 지원 전문!

import { Logger } from '../../shared/logger';
import { IpcResponse, KeyboardEvent } from '../../shared/types';
import { KEYBOARD_LANGUAGES, perf } from '../../shared/common';
import { EventEmitter } from 'events';
import type { UiohookKeyboardEvent, UiohookInstance } from 'uiohook-napi';
import { WindowTracker } from './WindowTracker';

// #DEBUG: Keyboard service entry point
Logger.debug('KEYBOARD', 'Keyboard service initialization started');
Logger.debug('KEYBOARD', 'Keyboard service module loaded');

// 🔥 기가차드 키보드 모니터링 상태
export interface KeyboardMonitorState {
  isActive: boolean;
  language: string;
  inputMethod: 'direct' | 'composition' | 'complex';
  eventsPerSecond: number;
  totalEvents: number;
  startTime: Date | null;
}

// 🔥 기가차드 키보드 이벤트 타입
export interface ProcessedKeyboardEvent extends KeyboardEvent {
  language: string;
  composedChar?: string; // 조합된 문자 (한글 등)
  isComposing: boolean;
  inputMethod: string;
  processingTime: number; // 처리 시간 (ms)
}

// 🔥 기가차드 키보드 서비스 클래스
export class KeyboardService extends EventEmitter {
  private state: KeyboardMonitorState = {
    isActive: false,
    language: 'en',
    inputMethod: 'direct',
    eventsPerSecond: 0,
    totalEvents: 0,
    startTime: null,
  };

  private uiohook: UiohookInstance | null = null;
  private eventBuffer: ProcessedKeyboardEvent[] = [];
  private performanceTracker = perf;
  private windowTracker: WindowTracker | null = null; // 🔥 지연 초기화로 변경
  private hasAccessibilityPermission = false; // 🔥 권한 상태 추적
  
  constructor() {
    super();
    // 🔥 WindowTracker는 권한 확인 후 지연 초기화
    this.initializeUiohook();
  }

  // 🔥 접근성 권한 설정 (main process에서 호출)
  public setAccessibilityPermission(hasPermission: boolean): void {
    this.hasAccessibilityPermission = hasPermission;
    
    if (hasPermission && !this.windowTracker) {
      try {
        // 🔥 권한 정보를 WindowTracker에 전달
        this.windowTracker = new WindowTracker({}, hasPermission);
        Logger.info('KEYBOARD', 'WindowTracker initialized with accessibility permission');
      } catch (error) {
        Logger.error('KEYBOARD', 'Failed to initialize WindowTracker', error);
        this.windowTracker = null;
      }
    } else if (!hasPermission && this.windowTracker) {
      // 권한이 제거되면 WindowTracker 정리
      this.windowTracker.cleanup();
      this.windowTracker = null;
      Logger.warn('KEYBOARD', 'WindowTracker disabled due to missing permissions');
    }
  }

  private async initializeUiohook(): Promise<void> {
    try {
      // #DEBUG: Loading uiohook-napi
      this.performanceTracker.start('UIOHOOK_LOAD');
      
      const uiohookModule = await import('uiohook-napi');
      this.uiohook = uiohookModule.uIOhook as unknown as UiohookInstance;
      
      const loadTime = this.performanceTracker.end('UIOHOOK_LOAD');
      Logger.info('KEYBOARD', 'uiohook-napi loaded successfully', { 
        loadTime: `${loadTime.toFixed(2)}ms` 
      });
    } catch (error) {
      Logger.error('KEYBOARD', 'Failed to load uiohook-napi', error);
      throw new Error('Keyboard monitoring unavailable');
    }
  }

  // 🔥 모니터링 시작
  public async startMonitoring(): Promise<IpcResponse<boolean>> {
    try {
      // #DEBUG: Starting keyboard monitoring
      this.performanceTracker.start('MONITORING_START');
      
      if (this.state.isActive) {
        Logger.warn('KEYBOARD', 'Monitoring already active');
        return {
          success: true,
          data: true,
          timestamp: new Date(),
        };
      }

      if (!this.uiohook) {
        throw new Error('uiohook not initialized');
      }

      // 🔥 WindowTracker 시작 (모니터링 시작시에만)
      if (this.windowTracker && !this.windowTracker.isRunning()) {
        await this.windowTracker.start();
        Logger.info('KEYBOARD', 'WindowTracker started with monitoring');
      }

      // 키보드 이벤트 리스너 설정
      this.uiohook.on('keydown', this.handleKeyEvent.bind(this, 'keydown'));
      this.uiohook.on('keyup', this.handleKeyEvent.bind(this, 'keyup'));

      // 모니터링 시작
      this.uiohook.start();
      
      this.state.isActive = true;
      this.state.startTime = new Date();
      this.state.totalEvents = 0;

      const startTime = this.performanceTracker.end('MONITORING_START');
      Logger.info('KEYBOARD', 'Keyboard monitoring started', {
        language: this.state.language,
        inputMethod: this.state.inputMethod,
        startTime: `${startTime.toFixed(2)}ms`
      });

      return {
        success: true,
        data: true,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('KEYBOARD', 'Failed to start monitoring', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  }

  // 🔥 모니터링 중지
  public async stopMonitoring(): Promise<IpcResponse<boolean>> {
    try {
      // #DEBUG: Stopping keyboard monitoring
      this.performanceTracker.start('MONITORING_STOP');

      if (!this.state.isActive) {
        Logger.warn('KEYBOARD', 'Monitoring not active');
        return {
          success: true,
          data: false,
          timestamp: new Date(),
        };
      }

      if (this.uiohook) {
        this.uiohook.stop();
        this.uiohook.removeAllListeners();
      }

      // 🔥 WindowTracker 중지 (모니터링 중지시)
      if (this.windowTracker && this.windowTracker.isRunning()) {
        await this.windowTracker.stop();
        Logger.info('KEYBOARD', 'WindowTracker stopped with monitoring');
      }

      this.state.isActive = false;
      this.state.startTime = null;
      
      const stopTime = this.performanceTracker.end('MONITORING_STOP');
      Logger.info('KEYBOARD', 'Keyboard monitoring stopped', {
        totalEvents: this.state.totalEvents,
        stopTime: `${stopTime.toFixed(2)}ms`
      });

      return {
        success: true,
        data: false,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('KEYBOARD', 'Failed to stop monitoring', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  }

  // 🔥 키보드 이벤트 처리 (다국어 지원)
  private handleKeyEvent(type: 'keydown' | 'keyup', rawEvent: UiohookKeyboardEvent): void {
    try {
      // #DEBUG: Processing keyboard event
      const processingStart = performance.now();
      
      // 현재 언어 감지
      const currentLanguage = this.detectLanguage(rawEvent);
      const languageConfig = KEYBOARD_LANGUAGES[currentLanguage];
      
      // 조합형 문자 처리 (한글, 일본어, 중국어)
      const composedChar = this.processComposition(rawEvent, languageConfig);
      
      // 🔥 실제 윈도우 정보 가져오기 (권한이 있을 때만)
      const currentWindow = this.windowTracker?.getCurrentWindow();
      const windowTitle = currentWindow?.title || 'Unknown Window';
      
      const processedEvent: ProcessedKeyboardEvent = {
        key: this.mapKeyToString(rawEvent.keycode),
        code: `Key${rawEvent.keycode}`,
        keychar: String.fromCharCode(rawEvent.keychar || 0),
        timestamp: Date.now(),
        windowTitle, // 🔥 실제 윈도우 타이틀 사용
        type,
        language: currentLanguage,
        composedChar,
        isComposing: languageConfig?.composition || false,
        inputMethod: languageConfig?.inputMethod || 'direct',
        processingTime: performance.now() - processingStart,
      };

      // 이벤트 버퍼에 추가
      this.eventBuffer.push(processedEvent);
      if (this.eventBuffer.length > 1000) {
        this.eventBuffer.shift(); // 오래된 이벤트 제거
      }

      // 통계 업데이트
      this.state.totalEvents++;
      this.updateEventsPerSecond();

      // 이벤트 발송
      this.emit('keyboard-event', processedEvent);
      
      Logger.debug('KEYBOARD', 'Event processed', {
        type,
        language: currentLanguage,
        processingTime: `${processedEvent.processingTime.toFixed(2)}ms`,
        isComposing: processedEvent.isComposing
      });

    } catch (error) {
      Logger.error('KEYBOARD', 'Failed to process keyboard event', error);
    }
  }

  // 🔥 언어 감지 (키코드 기반)
  private detectLanguage(rawEvent: UiohookKeyboardEvent): string {
    // #DEBUG: Detecting input language
    
    // 한글 감지 (한글 키코드 범위)
    if (rawEvent.keychar >= 0xAC00 && rawEvent.keychar <= 0xD7AF) {
      return 'ko';
    }
    
    // 일본어 감지 (히라가나/가타카나)
    if ((rawEvent.keychar >= 0x3040 && rawEvent.keychar <= 0x309F) || 
        (rawEvent.keychar >= 0x30A0 && rawEvent.keychar <= 0x30FF)) {
      return 'ja';
    }
    
    // 중국어 감지 (한자 범위)
    if (rawEvent.keychar >= 0x4E00 && rawEvent.keychar <= 0x9FFF) {
      return 'zh';
    }
    
    // 기본값: 영어
    return 'en';
  }

  // 🔥 조합형 문자 처리
  private processComposition(rawEvent: UiohookKeyboardEvent, languageConfig?: typeof KEYBOARD_LANGUAGES[keyof typeof KEYBOARD_LANGUAGES]): string | undefined {
    // #DEBUG: Processing character composition
    
    if (!languageConfig?.composition) {
      return undefined;
    }

    // 🔥 한글 조합 처리 (초성 + 중성 + 종성)
    if (languageConfig.code === 'ko') {
      return this.processHangulComposition(rawEvent);
    }

    // 🔥 일본어 조합 처리 (로마자 → 히라가나/가타카나)
    if (languageConfig.code === 'ja') {
      return this.processJapaneseComposition(rawEvent);
    }

    // 🔥 중국어 조합 처리 (핀인 입력)
    if (languageConfig.code === 'zh') {
      return this.processChineseComposition(rawEvent);
    }
    
    return String.fromCharCode(rawEvent.keychar || 0);
  }

  // 🔥 한글 조합 처리 (초성 + 중성 + 종성)
  private processHangulComposition(rawEvent: UiohookKeyboardEvent): string | undefined {
    const char = rawEvent.keychar;
    if (!char) return undefined;

    // 한글 완성형 문자 범위 (가-힣)
    if (char >= 0xAC00 && char <= 0xD7AF) {
      return String.fromCharCode(char);
    }

    // 한글 자모 분리 처리 (향후 확장 가능)
    return String.fromCharCode(char);
  }

  // 🔥 일본어 조합 처리 (로마자 → 히라가나/가타카나)
  private processJapaneseComposition(rawEvent: UiohookKeyboardEvent): string | undefined {
    const char = rawEvent.keychar;
    if (!char) return undefined;

    // 히라가나 범위 (あ-ん)
    if (char >= 0x3040 && char <= 0x309F) {
      return String.fromCharCode(char);
    }

    // 가타카나 범위 (ア-ン)
    if (char >= 0x30A0 && char <= 0x30FF) {
      return String.fromCharCode(char);
    }

    return String.fromCharCode(char);
  }

  // 🔥 중국어 조합 처리 (핀인 입력)
  private processChineseComposition(rawEvent: UiohookKeyboardEvent): string | undefined {
    const char = rawEvent.keychar;
    if (!char) return undefined;

    // 한자 범위 (一-龯)
    if (char >= 0x4E00 && char <= 0x9FFF) {
      return String.fromCharCode(char);
    }

    return String.fromCharCode(char);
  }

  // 🔥 키코드를 문자열로 매핑
  private mapKeyToString(keycode: number): string {
    // #DEBUG: Mapping keycode to string
    
    // 기본 알파벳 (A-Z)
    if (keycode >= 65 && keycode <= 90) {
      return String.fromCharCode(keycode);
    }
    
    // 숫자 (0-9)
    if (keycode >= 48 && keycode <= 57) {
      return String.fromCharCode(keycode);
    }
    
    // 특수 키 매핑
    const specialKeys: Record<number, string> = {
      8: 'Backspace',
      9: 'Tab',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      20: 'CapsLock',
      27: 'Escape',
      32: 'Space',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      46: 'Delete',
    };
    
    return specialKeys[keycode] || `Key${keycode}`;
  }

  // 🔥 초당 이벤트 수 계산
  private updateEventsPerSecond(): void {
    if (!this.state.startTime) return;
    
    const elapsedSeconds = (Date.now() - this.state.startTime.getTime()) / 1000;
    this.state.eventsPerSecond = this.state.totalEvents / elapsedSeconds;
  }

  // 🔥 상태 조회
  public getStatus(): IpcResponse<KeyboardMonitorState> {
    try {
      // #DEBUG: Getting keyboard status
      return {
        success: true,
        data: { ...this.state },
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('KEYBOARD', 'Failed to get status', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  }

  // 🔥 최근 이벤트 조회
  public getRecentEvents(count: number = 10): ProcessedKeyboardEvent[] {
    // #DEBUG: Getting recent events
    Logger.debug('KEYBOARD', 'Getting recent events', { count });
    return this.eventBuffer.slice(-count);
  }

  // 🔥 언어 변경
  public setLanguage(language: string): boolean {
    // #DEBUG: Setting language
    if (!(language in KEYBOARD_LANGUAGES)) {
      Logger.warn('KEYBOARD', 'Unsupported language', { language });
      return false;
    }

    this.state.language = language;
    this.state.inputMethod = KEYBOARD_LANGUAGES[language].inputMethod;
    
    Logger.info('KEYBOARD', 'Language changed', {
      language,
      inputMethod: this.state.inputMethod
    });
    
    return true;
  }
}

// 🔥 기가차드 싱글톤 인스턴스
export const keyboardService = new KeyboardService();

// #DEBUG: Keyboard service exit point
Logger.debug('KEYBOARD', 'Keyboard service initialization complete');
Logger.debug('KEYBOARD', 'Keyboard service initialization complete');

export default keyboardService;
