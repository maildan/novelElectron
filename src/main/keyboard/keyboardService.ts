// 🔥 기가차드 키보드 모니터링 서비스 - 다국어 지원 전문!

import { Logger } from '../../shared/logger';
import { IpcResponse, KeyboardEvent } from '../../shared/types';
import { KEYBOARD_LANGUAGES, perf } from '../../shared/common';
import { EventEmitter } from 'events';
import type { UiohookKeyboardEvent, UiohookInstance } from 'uiohook-napi';
import { WindowTracker } from './WindowTracker';
import { HangulComposer } from './HangulComposer';
import { HANGUL_KEY_MAP } from './constants';

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
    language: 'ko', // 🔥 기본값을 한글로 설정
    inputMethod: 'composition', // 🔥 조합형으로 설정
    eventsPerSecond: 0,
    totalEvents: 0,
    startTime: null,
  };

  private uiohook: UiohookInstance | null = null;
  private eventBuffer: ProcessedKeyboardEvent[] = [];
  private performanceTracker = perf;
  private windowTracker: WindowTracker | null = null; // 🔥 지연 초기화로 변경
  private hasAccessibilityPermission = false; // 🔥 권한 상태 추적
  private hangulComposer: HangulComposer; // 🔥 한글 조합기 추가
  
  constructor() {
    super();
    // 🔥 HangulComposer 초기화
    this.hangulComposer = new HangulComposer();
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
      this.uiohook.on('keydown', (rawEvent: UiohookKeyboardEvent) => {
        this.handleKeyEvent('keydown', rawEvent).catch(error => {
          Logger.error('KEYBOARD', 'Failed to handle keydown event', error);
        });
      });
      this.uiohook.on('keyup', (rawEvent: UiohookKeyboardEvent) => {
        this.handleKeyEvent('keyup', rawEvent).catch(error => {
          Logger.error('KEYBOARD', 'Failed to handle keyup event', error);
        });
      });

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

  // 🔥 키보드 이벤트 처리 (다국어 지원 + HANGUL_KEY_MAP 활용)
  private async handleKeyEvent(type: 'keydown' | 'keyup', rawEvent: UiohookKeyboardEvent): Promise<void> {
    try {
      // #DEBUG: Processing keyboard event with enhanced Korean detection
      const processingStart = performance.now();
      
      // 🔥 1. 개선된 언어 감지 (HANGUL_KEY_MAP 활용)
      const detectedLanguage = this.detectLanguage(rawEvent);
      
      // 🔥 2. 한글 특별 처리
      let composedChar: string | undefined;
      let isComposing = false;
      
      if (detectedLanguage === 'ko' || this.isKoreanKeyEvent(rawEvent)) {
        Logger.debug('KEYBOARD', 'Korean input detected, processing with HangulComposer', {
          keycode: rawEvent.keycode,
          keychar: rawEvent.keychar,
          detectedLanguage
        });
        
        // 🔥 실제 눌린 키를 HANGUL_KEY_MAP으로 변환
        const pressedKey = String.fromCharCode(rawEvent.keycode).toLowerCase();
        const hangulChar = Object.entries(HANGUL_KEY_MAP).find(([_, english]) => 
          english.toLowerCase() === pressedKey
        )?.[0];
        
        // 🔥 HangulComposer로 한글 조합 처리 (실제 키 전달)
        const hangulResult = await this.hangulComposer.processKey({
          key: pressedKey, // 실제 눌린 키 (q, w, e, r 등)
          code: `Key${rawEvent.keycode}`,
          keychar: hangulChar || String.fromCharCode(rawEvent.keychar || 0), // 한글 문자 우선
          timestamp: Date.now(),
          windowTitle: '',
          type
        });
        
        // 🔥 HangulCompositionResult 처리
        composedChar = hangulResult.completed || hangulResult.composing;
        isComposing = !!hangulResult.composing; // composing 문자가 있으면 조합 중
        
        Logger.debug('KEYBOARD', 'Hangul composition result', {
          pressedKey,
          hangulChar,
          completed: hangulResult.completed,
          composing: hangulResult.composing,
          isComposing
        });
        
        // 언어를 한글로 설정
        this.state.language = 'ko';
        this.state.inputMethod = 'composition';
      }
      
      const currentLanguage = detectedLanguage;
      const languageConfig = KEYBOARD_LANGUAGES[currentLanguage];
      
      // 🔥 실제 윈도우 정보 가져오기 (권한이 있을 때만)
      const currentWindow = this.windowTracker?.getCurrentWindow();
      const windowTitle = currentWindow?.title || 'Unknown Window';
      
      const processedEvent: ProcessedKeyboardEvent = {
        key: this.mapKeyToString(rawEvent.keycode),
        code: `Key${rawEvent.keycode}`,
        keychar: composedChar || String.fromCharCode(rawEvent.keychar || 0), // 🔥 조합된 문자 우선 사용
        timestamp: Date.now(),
        windowTitle,
        type,
        language: currentLanguage,
        composedChar,
        isComposing: isComposing || (languageConfig?.composition || false),
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

  // 🔥 언어 감지 (향상된 keycode + keychar 기반 + HANGUL_KEY_MAP 활용)
  private detectLanguage(rawEvent: UiohookKeyboardEvent): string {
    // #DEBUG: Detecting input language with HANGUL_KEY_MAP
    
    try {
      const keycode = rawEvent.keycode;
      const keychar = rawEvent.keychar;
      
      Logger.debug('KEYBOARD', '🔥 Language detection started', {
        keycode,
        keychar,
        keycodeChar: String.fromCharCode(keycode),
        keycharChar: keychar ? String.fromCharCode(keychar) : 'null',
        currentLanguage: this.state.language
      });
      
      // 🔥 **1단계: 한글 자모/완성형 문자 직접 감지 (최우선)**
      if (keychar) {
        // 한글 완성형 문자 범위 (가-힣: 0xAC00-0xD7AF)
        if (keychar >= 0xAC00 && keychar <= 0xD7AF) {
          Logger.info('KEYBOARD', '🔥 Korean detected - Complete Hangul character!', {
            keychar,
            character: String.fromCharCode(keychar),
            keycode
          });
          this.state.language = 'ko';
          this.state.inputMethod = 'composition';
          return 'ko';
        }
        
        // 한글 자모 범위 (ㄱ-㆏: 0x3131-0x318F)
        if (keychar >= 0x3131 && keychar <= 0x318F) {
          Logger.info('KEYBOARD', '🔥 Korean detected - Hangul jamo!', {
            keychar,
            character: String.fromCharCode(keychar),
            keycode
          });
          this.state.language = 'ko';
          this.state.inputMethod = 'composition';
          return 'ko';
        }
      }
      
      // 🔥 **2단계: 한글 IME 활성 상태 감지**
      // 한글 자판 키를 눌렀는데 keychar가 0이거나 다른 값이면 IME 처리 중
      if (keycode >= 65 && keycode <= 90) { // A-Z 키만
        const pressedKey = String.fromCharCode(keycode).toLowerCase();
        
        // HANGUL_KEY_MAP 역매핑 생성
        const reversedHangulMap = new Map<string, string>();
        Object.entries(HANGUL_KEY_MAP).forEach(([hangul, english]) => {
          reversedHangulMap.set(english.toLowerCase(), hangul);
        });
        
        Logger.debug('KEYBOARD', '🔥 Checking HANGUL_KEY_MAP for IME', {
          pressedKey,
          hasMapping: reversedHangulMap.has(pressedKey),
          mappedHangul: reversedHangulMap.get(pressedKey),
          keychar,
          expectedKeychar: keycode,
          isIMEActive: !keychar || keychar !== keycode
        });
        
        // 현재 키가 한글 자판 키이고 IME가 처리 중이면 한글
        if (reversedHangulMap.has(pressedKey)) {
          // IME가 활성화되어 있으면 (keychar가 예상과 다름) 한글 확정
          if (!keychar || keychar !== keycode) {
            Logger.info('KEYBOARD', '🔥 Korean IME detected - Processing Hangul!', { 
              pressedKey, 
              hangulChar: reversedHangulMap.get(pressedKey),
              keychar,
              expectedKeychar: keycode
            });
            this.state.language = 'ko';
            this.state.inputMethod = 'composition';
            return 'ko';
          }
          
          // 일반 상황에서도 한글 키이면 한글로 간주
          Logger.info('KEYBOARD', '🔥 Korean key detected via HANGUL_KEY_MAP!', { 
            pressedKey, 
            hangulChar: reversedHangulMap.get(pressedKey)
          });
          this.state.language = 'ko';
          this.state.inputMethod = 'composition';
          return 'ko';
        }
      }
      
      // 🔥 **3단계: 현재 설정된 언어가 한글이면 유지**
      if (this.state.language === 'ko') {
        Logger.debug('KEYBOARD', 'Using preset Korean language');
        return 'ko';
      }

      // 🔥 **4단계: 한글 키보드 레이아웃 강제 감지**
      if (this.isKoreanKeyboardLayout(rawEvent)) {
        Logger.info('KEYBOARD', '🔥 Korean keyboard layout detected!');
        this.state.language = 'ko';
        this.state.inputMethod = 'composition';
        return 'ko';
      }
      
      // 🔥 **5단계: 다른 언어 감지**
      if (keychar) {
        // 일본어 감지 (히라가나/가타카나)
        if ((keychar >= 0x3040 && keychar <= 0x309F) || 
            (keychar >= 0x30A0 && keychar <= 0x30FF)) {
          Logger.debug('KEYBOARD', 'Japanese detected');
          this.state.language = 'ja';
          return 'ja';
        }
        
        // 중국어 감지 (한자 범위)
        if (keychar >= 0x4E00 && keychar <= 0x9FFF) {
          Logger.debug('KEYBOARD', 'Chinese detected');
          this.state.language = 'zh';
          return 'zh';
        }
      }
      
      // 🔥 **6단계: 강제 한글 설정 옵션**
      // 만약 계속 영어로 감지되면 한글로 강제 설정
      if (this.state.totalEvents > 0 && this.state.language !== 'ko') {
        Logger.warn('KEYBOARD', '🔥 Force setting to Korean for better detection');
        this.state.language = 'ko';
        this.state.inputMethod = 'composition';
        return 'ko';
      }
      
      // 🔥 **최종: 기본값 (하지만 한글 우선)**
      const finalLanguage = this.state.language || 'ko'; // 기본값을 한글로!
      Logger.warn('KEYBOARD', '🔥 Using fallback language', {
        keycode,
        keychar,
        finalLanguage,
        keycodeChar: String.fromCharCode(keycode || 0),
        keycharChar: keychar ? String.fromCharCode(keychar) : 'null'
      });
      return finalLanguage;
      
    } catch (error) {
      Logger.error('KEYBOARD', '🔥 Error in language detection', error);
      return 'en';
    }
  }
  
  // 🔥 한글 키보드 레이아웃 감지 (HANGUL_KEY_MAP 활용)
  private isKoreanKeyboardLayout(rawEvent: UiohookKeyboardEvent): boolean {
    try {
      const keycode = rawEvent.keycode;
      const keychar = rawEvent.keychar;
      
      // 🔥 1. HANGUL_KEY_MAP을 역매핑하여 한글 키 패턴 확인
      const reversedHangulMap = new Map<string, string>();
      Object.entries(HANGUL_KEY_MAP).forEach(([hangul, english]) => {
        reversedHangulMap.set(english.toLowerCase(), hangul);
      });
      
      // 🔥 2. 현재 눌린 키가 한글 자판 키인지 확인
      const pressedKey = String.fromCharCode(keycode).toLowerCase();
      const isHangulKey = reversedHangulMap.has(pressedKey);
      
      if (isHangulKey) {
        Logger.debug('KEYBOARD', 'HANGUL_KEY_MAP match found', { 
          keycode, 
          pressedKey, 
          hangulChar: reversedHangulMap.get(pressedKey),
          keychar 
        });
        
        // 🔥 3. 한글 IME 활성 상태 확인
        // keychar가 0이거나 예상 ASCII와 다르면 IME가 처리 중
        const expectedAscii = keycode;
        if (!keychar || keychar !== expectedAscii) {
          Logger.debug('KEYBOARD', 'Korean IME active detected', { 
            expected: expectedAscii, 
            actual: keychar 
          });
          return true;
        }
        
        // 🔥 4. 한글 범위 keychar 확인
        if (keychar && (
          (keychar >= 0x3131 && keychar <= 0x318F) || // 한글 자모
          (keychar >= 0xAC00 && keychar <= 0xD7AF)    // 한글 완성형
        )) {
          Logger.debug('KEYBOARD', 'Korean character detected via keychar', { keychar });
          return true;
        }
      }
      
      return false;
      
    } catch (error) {
      Logger.error('KEYBOARD', 'Error in Korean keyboard layout detection', error);
      return false;
    }
  }
  
  // 🔥 한글 키보드 이벤트 감지 헬퍼 메서드 (HANGUL_KEY_MAP 기반)
  private isKoreanKeyEvent(rawEvent: UiohookKeyboardEvent): boolean {
    try {
      // 🔥 1. 이미 한글로 설정되어 있으면 true
      if (this.state.language === 'ko') {
        return true;
      }
      
      // 🔥 2. HANGUL_KEY_MAP 역매핑 생성
      const reversedHangulMap = new Map<string, string>();
      Object.entries(HANGUL_KEY_MAP).forEach(([hangul, english]) => {
        reversedHangulMap.set(english.toLowerCase(), hangul);
      });
      
      // 🔥 3. 현재 키가 한글 자판 키인지 확인
      const keycode = rawEvent.keycode;
      const pressedKey = String.fromCharCode(keycode).toLowerCase();
      
      if (reversedHangulMap.has(pressedKey)) {
        Logger.debug('KEYBOARD', 'Korean key event detected', { 
          keycode, 
          pressedKey, 
          mappedHangul: reversedHangulMap.get(pressedKey),
          keychar: rawEvent.keychar 
        });
        return true;
      }
      
      // 🔥 4. 한글 유니코드 범위 확인
      if (rawEvent.keychar) {
        const isHangulChar = (rawEvent.keychar >= 0x3131 && rawEvent.keychar <= 0x318F) || // 자모
                            (rawEvent.keychar >= 0xAC00 && rawEvent.keychar <= 0xD7AF);   // 완성형
        
        if (isHangulChar) {
          Logger.debug('KEYBOARD', 'Korean character detected in keychar', { 
            keychar: rawEvent.keychar,
            character: String.fromCharCode(rawEvent.keychar)
          });
          return true;
        }
      }
      
      return false;
      
    } catch (error) {
      Logger.error('KEYBOARD', 'Error in Korean key event detection', error);
      return false;
    }
  }

  // 🔥 조합형 문자 처리
  private async processComposition(rawEvent: UiohookKeyboardEvent, languageConfig?: typeof KEYBOARD_LANGUAGES[keyof typeof KEYBOARD_LANGUAGES]): Promise<string | undefined> {
    // #DEBUG: Processing character composition
    
    if (!languageConfig?.composition) {
      return undefined;
    }

    // 🔥 한글 조합 처리 (초성 + 중성 + 종성)
    if (languageConfig.code === 'ko') {
      return await this.processHangulComposition(rawEvent);
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

  // 🔥 한글 조합 처리 (HangulComposer 사용)
  private async processHangulComposition(rawEvent: UiohookKeyboardEvent): Promise<string | undefined> {
    try {
      // 🔥 실제 HangulComposer를 사용하여 한글 조합 처리
      const keyboardEvent: KeyboardEvent = {
        key: this.mapKeyToString(rawEvent.keycode),
        code: `Key${rawEvent.keycode}`,
        keychar: String.fromCharCode(rawEvent.keychar || 0),
        timestamp: Date.now(),
        windowTitle: this.windowTracker?.getCurrentWindow()?.title || 'Unknown',
        type: 'keydown'
      };

      // HangulComposer 초기화 (필요시)
      if (!this.hangulComposer.isRunning()) {
        await this.hangulComposer.initialize();
        await this.hangulComposer.start();
      }

      const compositionResult = await this.hangulComposer.processKey(keyboardEvent);
      
      if (compositionResult.completed) {
        Logger.debug('KEYBOARD', 'Hangul composition completed', { 
          completed: compositionResult.completed 
        });
        return compositionResult.completed;
      }
      
      if (compositionResult.composing) {
        Logger.debug('KEYBOARD', 'Hangul composition in progress', { 
          composing: compositionResult.composing 
        });
        return compositionResult.composing;
      }

      return undefined;
    } catch (error) {
      Logger.error('KEYBOARD', 'Failed to process hangul composition', error);
      return String.fromCharCode(rawEvent.keychar || 0);
    }
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

    // 한자 범위 (일-龯)
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
  public async setLanguage(language: string): Promise<boolean> {
    // #DEBUG: Setting language
    if (!(language in KEYBOARD_LANGUAGES)) {
      Logger.warn('KEYBOARD', 'Unsupported language', { language });
      return false;
    }

    this.state.language = language;
    this.state.inputMethod = KEYBOARD_LANGUAGES[language].inputMethod;
    
    // 🔥 한글 모드일 때 HangulComposer 활성화
    if (language === 'ko' && !this.hangulComposer.isRunning()) {
      try {
        await this.hangulComposer.initialize();
        await this.hangulComposer.start();
        Logger.info('KEYBOARD', 'HangulComposer activated for Korean input');
      } catch (error) {
        Logger.error('KEYBOARD', 'Failed to activate HangulComposer', error);
      }
    }
    
    Logger.info('KEYBOARD', 'Language changed', {
      language,
      inputMethod: this.state.inputMethod,
      composition: KEYBOARD_LANGUAGES[language].composition
    });
    
    return true;
  }

  // 🔥 한글 강제 설정 (디버깅용)
  public forceKoreanLanguage(): boolean {
    try {
      Logger.info('KEYBOARD', '🔥 Force setting language to Korean');
      this.state.language = 'ko';
      this.state.inputMethod = 'composition';
      
      return true;
    } catch (error) {
      Logger.error('KEYBOARD', 'Failed to force Korean language', error);
      return false;
    }
  }

  // 🔥 언어 감지 강제 재실행
  public testLanguageDetection(testKeycode: number, testKeychar?: number): string {
    const testEvent = {
      keycode: testKeycode,
      keychar: testKeychar || 0
    } as UiohookKeyboardEvent;
    
    Logger.info('KEYBOARD', '🔥 Testing language detection', {
      testKeycode,
      testKeychar,
      testKeycodeChar: String.fromCharCode(testKeycode),
      testKeycharChar: testKeychar ? String.fromCharCode(testKeychar) : 'null'
    });
    
    const result = this.detectLanguage(testEvent);
    Logger.info('KEYBOARD', '🔥 Language detection test result', { result });
    return result;
  }
}

// 🔥 기가차드 싱글톤 인스턴스
export const keyboardService = new KeyboardService();

// #DEBUG: Keyboard service exit point
Logger.debug('KEYBOARD', 'Keyboard service initialization complete');
Logger.debug('KEYBOARD', 'Keyboard service initialization complete');

export default keyboardService;
