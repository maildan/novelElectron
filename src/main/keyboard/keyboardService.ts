// 🔥 기가차드 키보드 모니터링 서비스 - 다국어 지원 전문!

import { Logger } from '../../shared/logger';
import { IpcResponse, KeyboardEvent } from '../../shared/types';
import { KEYBOARD_LANGUAGES, perf } from '../../shared/common';
import { EventEmitter } from 'events';
import type { UiohookKeyboardEvent, UiohookInstance } from 'uiohook-napi';
import { WindowTracker } from './WindowTracker';
import { HangulComposer } from './HangulComposer';
import { LanguageDetector, LanguageDetectionResult } from './detectors/LanguageDetector';
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
  private languageDetector: LanguageDetector; // 🔥 새로운 언어 감지 시스템
  
  // 🔥 영어 키 시퀀스 감지를 위한 배열
  private englishKeySequence: string[] = [];
  private readonly englishSwitchThreshold = 5; // 연속 5개 영어 키
  
  constructor() {
    super();
    // 🔥 HangulComposer 초기화
    this.hangulComposer = new HangulComposer();
    // 🔥 LanguageDetector 초기화
    this.languageDetector = new LanguageDetector();
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

      // 🔥 LanguageDetector 초기화 및 시작
      if (!this.languageDetector.isRunning()) {
        await this.languageDetector.initialize();
        await this.languageDetector.start();
        Logger.info('KEYBOARD', 'LanguageDetector initialized and started with monitoring');
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

      // 🔥 LanguageDetector 중지
      if (this.languageDetector && this.languageDetector.isRunning()) {
        await this.languageDetector.stop();
        Logger.info('KEYBOARD', 'LanguageDetector stopped with monitoring');
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
      // 🔥 rawEvent를 enhanced event로 변환 (정확한 keychar 포함)
      const enhancedEvent = this.enhanceRawEvent(rawEvent);
      
      // #DEBUG: Processing keyboard event with enhanced Korean detection
      const processingStart = performance.now();
      
      // 🔥 1. 개선된 언어 감지 (enhanced event 사용)
      const detectionResult = await this.languageDetector.detectLanguage(enhancedEvent);
      const detectedLanguage = detectionResult.language;
      
      // 🔥 2. 한글 특별 처리
      let composedChar: string | undefined;
      let isComposing = false;
      let hangulResult: any = null; // 🔥 스코프 확장
      
      if (detectedLanguage === 'ko' || this.isKoreanKeyEvent(enhancedEvent)) {
        Logger.debug('KEYBOARD', 'Korean input detected, processing with HangulComposer', {
          keycode: enhancedEvent.keycode,
          keychar: enhancedEvent.keychar,
          detectedLanguage
        });
        
        // 🔥 LanguageDetector에서 감지된 한글 문자 우선 사용
        let pressedKey: string;
        let hangulChar: string | undefined;
        
        if (detectionResult.detectedChar) {
          // ✅ LanguageDetector에서 이미 한글로 매핑한 경우
          hangulChar = detectionResult.detectedChar;
          pressedKey = hangulChar;
          
          Logger.debug('KEYBOARD', '🔥 LanguageDetector에서 감지된 한글 문자 사용', {
            keycode: enhancedEvent.keycode,
            detectedChar: detectionResult.detectedChar,
            usingHangul: hangulChar
          });
        } else {
          // 🔥 한글 감지됐지만 detectedChar가 없는 경우: keycode로 직접 매핑
          const keycode = enhancedEvent.keycode;
          
          // 🔥 LanguageDetector와 동일한 SPECIAL_CHAR_TO_HANGUL 매핑 사용
          const specialCharMap = new Map([
            // 성공 확인된 키들 ✅
            [33, 'ㄹ'], [35, 'ㅈ'], [37, 'ㄱ'], [38, 'ㅅ'],
            
            // 기존 매핑들
            [34, 'ㅂ'], [18, 'ㅁ'], [17, 'ㄴ'], [19, 'ㅇ'], 
            [20, 'ㄷ'], [32, 'ㅣ'], [40, 'ㅐ'], [41, 'ㅔ'],
            [36, 'ㄷ'], [94, 'ㅛ'], [42, 'ㅕ'], [95, 'ㅑ'],
            
            // 🔥 새로 추가된 누락 키들
            [25, 'ㅋ'], [29, 'ㅌ'], [21, 'ㅊ'], [22, 'ㅍ'],
            [23, 'ㅠ'], [24, 'ㅜ'], [26, 'ㅡ'], [39, 'ㅓ'],
            [59, 'ㅏ'], [58, 'ㅣ'], [44, 'ㅜ'], [46, 'ㅡ'], [47, 'ㅗ']
          ]);
          
          hangulChar = specialCharMap.get(keycode);
          
          if (hangulChar) {
            pressedKey = hangulChar;
            Logger.debug('KEYBOARD', '🔥 KeyboardService에서 특수문자 역매핑 성공', {
              keycode,
              mappedHangul: hangulChar
            });
          } else {
            // ❌ 기존 방식으로 폴백
            pressedKey = String.fromCharCode(this.keycodeToKeychar(enhancedEvent.keycode || 0));
            hangulChar = Object.entries(HANGUL_KEY_MAP).find(([_, english]) => 
              english.toLowerCase() === pressedKey
            )?.[0];
            
            Logger.debug('KEYBOARD', '⚠️ 폴백: 기존 매핑 방식 사용', {
              keycode: enhancedEvent.keycode,
              pressedKey,
              hangulChar
            });
          }
        }
        
        // 🔥 HangulComposer로 한글 조합 처리 (감지된 한글 문자 전달)
        hangulResult = await this.hangulComposer.processKey({
          key: hangulChar || pressedKey, // 한글 문자 우선 사용
          code: `Key${enhancedEvent.keycode}`,
          keychar: hangulChar || String.fromCharCode(enhancedEvent.keychar), // 한글 문자 우선, 아니면 유니코드 변환
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
        key: this.getDisplayKey(enhancedEvent, currentLanguage, composedChar, hangulResult), // 🔥 enhanced event 사용
        code: `Key${enhancedEvent.keycode}`,
        keychar: composedChar || hangulResult?.completed || String.fromCharCode(enhancedEvent.keychar), // 🔥 유니코드를 문자로 변환
        timestamp: Date.now(),
        windowTitle,
        type: type === 'keydown' && (composedChar || hangulResult?.completed) ? 'input' : type, // 🔥 실제 입력 시 'input' 타입
        language: currentLanguage,
        composedChar: hangulResult?.completed || composedChar,
        isComposing: isComposing || !!hangulResult?.composing || (languageConfig?.composition || false),
        inputMethod: languageConfig?.inputMethod || 'composition',
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
  
  // 🔥 기가차드 keycode를 유니코드 숫자로 변환하는 함수
  private keycodeToKeychar(keycode: number): number {
    // 🔥 QWERTY 키보드 레이아웃 기준 keycode → 유니코드 매핑
    const KEYCODE_TO_UNICODE_MAP: Record<number, number> = {
      // 숫자 키 (0-9)
      48: 48, 49: 49, 50: 50, 51: 51, 52: 52,  // '0'-'9'
      53: 53, 54: 54, 55: 55, 56: 56, 57: 57,
      
      // 영문자 키 (A-Z) -> 소문자 유니코드
      65: 97,  66: 98,  67: 99,  68: 100, 69: 101, 70: 102, // a-f
      71: 103, 72: 104, 73: 105, 74: 106, 75: 107, 76: 108, // g-l
      77: 109, 78: 110, 79: 111, 80: 112, 81: 113, 82: 114, // m-r
      83: 115, 84: 116, 85: 117, 86: 118, 87: 119, 88: 120, // s-x
      89: 121, 90: 122, // y-z
      
      // 특수문자 키
      32: 32,   // Space
      188: 44,  // Comma ','
      190: 46,  // Period '.'
      191: 47,  // Slash '/'
      186: 59,  // Semicolon ';'
      222: 39,  // Apostrophe "'"
      219: 91,  // Left bracket '['
      221: 93,  // Right bracket ']'
      220: 92,  // Backslash '\'
      189: 45,  // Minus '-'
      187: 61,  // Equals '='
    };
    
    return KEYCODE_TO_UNICODE_MAP[keycode] || keycode;
  }

  // 🔥 기가차드 rawEvent에 정확한 keychar 추가하는 함수
  private enhanceRawEvent(rawEvent: UiohookKeyboardEvent): any {
    // 🔥 keycode를 유니코드 숫자로 변환 (LanguageDetector 호환)
    const keychar = this.keycodeToKeychar(rawEvent.keycode || 0);
    
    return {
      ...rawEvent,
      keychar
    };
  }

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

  // 🔥 정확한 키 표시 메서드 (기가차드 정확성 원칙!)
  private getDisplayKey(
    rawEvent: UiohookKeyboardEvent, 
    language: string, 
    composedChar?: string, 
    hangulResult?: { completed?: string; composing?: string }
  ): string {
    try {
      const { keycode, keychar } = rawEvent;
      
      // 🔥 1. 조합된 문자가 있으면 최우선 표시
      if (composedChar) {
        Logger.debug('KEYBOARD', 'Using composed character', { composedChar });
        return composedChar;
      }
      
      // 🔥 2. 한글 조합 결과가 있으면 표시
      if (hangulResult?.completed) {
        Logger.debug('KEYBOARD', 'Using hangul completed character', { completed: hangulResult.completed });
        return hangulResult.completed;
      }
      
      // 🔥 3. 한글 조합 중인 문자가 있으면 표시
      if (hangulResult?.composing) {
        Logger.debug('KEYBOARD', 'Using hangul composing character', { composing: hangulResult.composing });
        return hangulResult.composing;
      }
      
      // 🔥 4. keychar가 있고 출력 가능한 문자면 표시
      if (keychar && keychar >= 32 && keychar <= 126) {
        const displayChar = String.fromCharCode(keychar);
        Logger.debug('KEYBOARD', 'Using keychar', { keychar, displayChar });
        return displayChar;
      }
      
      // 🔥 5. 한글 언어일 때 HANGUL_KEY_MAP 활용
      if (language === 'ko' && keycode >= 65 && keycode <= 90) {
        const englishKey = String.fromCharCode(keycode).toLowerCase();
        const hangulChar = HANGUL_KEY_MAP[englishKey as keyof typeof HANGUL_KEY_MAP];
        
        if (hangulChar) {
          Logger.debug('KEYBOARD', 'Using hangul mapping', { englishKey, hangulChar });
          return hangulChar;
        }
      }
      
      // 🔥 6. 특수 키 처리
      const specialKeys: Record<number, string> = {
        8: 'Backspace',
        9: 'Tab',
        13: 'Enter',
        16: 'Shift',
        17: 'Ctrl',
        18: 'Alt',
        27: 'Escape',
        32: 'Space',
        37: 'ArrowLeft',
        38: 'ArrowUp',
        39: 'ArrowRight',
        40: 'ArrowDown',
        46: 'Delete',
      };
      
      if (specialKeys[keycode]) {
        return specialKeys[keycode];
      }
      
      // 🔥 7. 일반 알파벳 키 (A-Z)
      if (keycode >= 65 && keycode <= 90) {
        return String.fromCharCode(keycode).toLowerCase();
      }
      
      // 🔥 8. 숫자 키 (0-9)
      if (keycode >= 48 && keycode <= 57) {
        return String.fromCharCode(keycode);
      }
      
      // 🔥 9. 기타 키는 keycode 표시
      const fallbackKey = `Key${keycode}`;
      Logger.debug('KEYBOARD', 'Using fallback key', { keycode, fallbackKey });
      return fallbackKey;
      
    } catch (error) {
      Logger.error('KEYBOARD', 'Failed to get display key', error);
      return `Key${rawEvent.keycode}`;
    }
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
  public async testLanguageDetection(testKeycode: number, testKeychar?: number): Promise<string> {
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
    
    const result = await this.languageDetector.detectLanguage(testEvent);
    Logger.info('KEYBOARD', '🔥 Language detection test result', { result });
    return result.language;
  }

  /**
   * 🔥 영어 키 시퀀스 감지 메서드
   */
  private isEnglishKeySequence(rawEvent: UiohookKeyboardEvent): boolean {
    try {
      const { keycode, keychar } = rawEvent;
      
      // 영어 알파벳 키만 확인 (A-Z)
      if (keycode >= 65 && keycode <= 90) {
        const pressedKey = String.fromCharCode(keycode).toLowerCase();
        
        // keychar가 예상 ASCII와 일치하면 영어 키
        if (keychar && keychar === keycode) {
          this.englishKeySequence.push(pressedKey);
          
          // 배열 크기 제한 (메모리 최적화)
          if (this.englishKeySequence.length > 10) {
            this.englishKeySequence.shift();
          }
          
          // 연속 영어 키 임계값 확인
          if (this.englishKeySequence.length >= this.englishSwitchThreshold) {
            Logger.debug('KEYBOARD', '🔥 English key sequence detected', {
              sequence: this.englishKeySequence.slice(-5),
              count: this.englishKeySequence.length
            });
            return true;
          }
        } else {
          // IME 활성 상태이면 시퀀스 리셋
          this.englishKeySequence = [];
        }
      }
      
      return false;
      
    } catch (error) {
      Logger.error('KEYBOARD', 'Error in English sequence detection', error);
      return false;
    }
  }
}

// 🔥 기가차드 싱글톤 인스턴스
export const keyboardService = new KeyboardService();

// #DEBUG: Keyboard service exit point
Logger.debug('KEYBOARD', 'Keyboard service initialization complete');
Logger.debug('KEYBOARD', 'Keyboard service initialization complete');

export default keyboardService;
