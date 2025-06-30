// 🔥 기가차드 macOS 전용 언어 감지기 - 기존 LanguageDetector를 macOS 특화로 개선!

import { BaseManager } from '../../common/BaseManager';
import { Logger } from '../../../shared/logger';
import { Platform } from '../../utils/platform';
import type { UiohookKeyboardEvent, LanguageDetectionResult } from '../../../shared/types';
import { exec } from 'child_process';

// 🔥 키 버퍼 이벤트
interface KeyBufferEvent {
  keycode: number;
  timestamp: number;
}

/**
 * 🔥 macOS 전용 언어 감지기 (기존 LanguageDetector 개선)
 * HIToolbox + keycode 패턴 분석 + macOS IME 협력 기반
 */
export class MacOSLanguageDetector extends BaseManager {
  private readonly componentName = 'MACOS_LANGUAGE_DETECTOR';
  
  // 🔥 언어 상태
  private currentLanguage: 'ko' | 'en' | 'ja' | 'zh' = 'en';
  
  // 🔥 키 버퍼 (패턴 분석용)
  private keyBuffer: KeyBufferEvent[] = [];
  private readonly BUFFER_SIZE = 5;
  
  // 🔥 성능 추적
  private detectionCount = 0;
  private totalProcessingTime = 0;
  
  // 🔥 시스템 입력소스 캐시
  private systemInputSourceCache: 'ko' | 'en' | null = null;
  private lastSystemCheck = 0;
  private readonly SYSTEM_CHECK_INTERVAL = 5000; // 5초
  private systemCheckInProgress = false;

  // 🔥 macOS 최적화된 한글 키코드 매핑
  private readonly KEYCODE_TO_HANGUL: Map<number, string> = new Map([
    // 🔥 물리적 키코드 (macOS uIOhook 기준)
    [12, 'ㅂ'], [13, 'ㅈ'], [14, 'ㄷ'], [15, 'ㄱ'], [17, 'ㅅ'],
    [16, 'ㅛ'], [32, 'ㅇ'], [33, 'ㄹ'], [34, 'ㅎ'], [35, 'ㅗ'],
    [38, 'ㅣ'], [37, 'ㅏ'], [31, 'ㄴ'], [0, 'ㅁ'], [46, 'ㅊ'], [50, 'ㅡ'],
    
    // 🔥 ASCII 키코드 매핑 (소문자)
    [113, 'ㅂ'], [119, 'ㅈ'], [101, 'ㄷ'], [114, 'ㄱ'], [116, 'ㅅ'],
    [121, 'ㅛ'], [117, 'ㅕ'], [105, 'ㅑ'], [111, 'ㅐ'], [112, 'ㅔ'],
    [97, 'ㅁ'], [115, 'ㄴ'], [100, 'ㅇ'], [102, 'ㄹ'], [103, 'ㅎ'],
    [104, 'ㅗ'], [106, 'ㅓ'], [107, 'ㅏ'], [108, 'ㅣ'],
    [122, 'ㅋ'], [120, 'ㅌ'], [99, 'ㅊ'], [118, 'ㅍ'],
    [98, 'ㅠ'], [110, 'ㅜ'], [109, 'ㅡ'],
    
    // 🔥 대문자 키코드 매핑 (Shift 조합)
    [81, 'ㅃ'], [87, 'ㅉ'], [69, 'ㄸ'], [82, 'ㄲ'], [84, 'ㅆ'],
    [89, 'ㅛ'], [85, 'ㅕ'], [73, 'ㅑ'], [79, 'ㅒ'], [80, 'ㅖ'],
    [65, 'ㅁ'], [83, 'ㄴ'], [68, 'ㅇ'], [70, 'ㄹ'], [71, 'ㅎ'],
    [72, 'ㅗ'], [74, 'ㅓ'], [75, 'ㅏ'], [76, 'ㅣ'],
    [90, 'ㅋ'], [88, 'ㅌ'], [67, 'ㅊ'], [86, 'ㅍ'],
    [66, 'ㅠ'], [78, 'ㅜ'], [77, 'ㅡ']
  ]);

  // 🔥 영어 키코드 범위
  private readonly ENGLISH_KEYCODES = new Set([
    // A-Z (65-90), a-z (97-122), 0-9 (48-57)
    ...Array.from({length: 26}, (_, i) => 65 + i),
    ...Array.from({length: 26}, (_, i) => 97 + i),
    ...Array.from({length: 10}, (_, i) => 48 + i),
    // 특수 문자들
    32, 188, 190, 191, 186, 222, 219, 221, 220, 192, 189, 187
  ]);

  // 🔥 제외 키 목록 (언어 감지에서 제외)
  private readonly EXCLUDED_KEYS = new Set([
    8, 9, 13, 16, 17, 18, 27, 20, 91, 92, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
    37, 38, 39, 40, 33, 34, 35, 36, 45, 46, 144, 145, 19, 21, 25, 28, 29
  ]);

  constructor() {
    super({
      name: 'MacOSLanguageDetector',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000,
    });
  }

  protected async doInitialize(): Promise<void> {
    try {
      if (!Platform.isMacOS()) {
        throw new Error('MacOSLanguageDetector는 macOS에서만 사용 가능합니다');
      }
      
      Logger.info(this.componentName, '🔥 macOS 언어 감지기 초기화 시작');
      
      // 🔥 초기 시스템 입력소스 감지
      const systemLanguage = await this.getCurrentInputSourceFromSystem();
      if (systemLanguage) {
        this.currentLanguage = systemLanguage;
        Logger.info(this.componentName, '초기 시스템 언어 감지 완료', { language: systemLanguage });
      }
      
      Logger.info(this.componentName, '🔥 macOS 언어 감지기 초기화 완료');
      
    } catch (error) {
      Logger.error(this.componentName, 'macOS 언어 감지기 초기화 실패', error);
      throw error;
    }
  }

  protected async doStart(): Promise<void> {
    try {
      Logger.info(this.componentName, '🔥 macOS 언어 감지기 시작');
      Logger.info(this.componentName, '🔥 HIToolbox + keycode 기반 언어 감지 활성화됨');
    } catch (error) {
      Logger.error(this.componentName, 'macOS 언어 감지기 시작 실패', error);
      throw error;
    }
  }

  protected async doStop(): Promise<void> {
    try {
      Logger.info(this.componentName, '🔥 macOS 언어 감지기 중지');
      this.resetState();
    } catch (error) {
      Logger.error(this.componentName, 'macOS 언어 감지기 중지 실패', error);
      throw error;
    }
  }

  protected async doCleanup(): Promise<void> {
    try {
      this.resetState();
      Logger.info(this.componentName, 'macOS 언어 감지기 정리 완료');
    } catch (error) {
      Logger.error(this.componentName, 'macOS 언어 감지기 정리 실패', error);
      throw error;
    }
  }

  /**
   * 🔥 메인 언어 감지 엔트리포인트
   */
  public async detectLanguage(rawEvent: UiohookKeyboardEvent): Promise<LanguageDetectionResult> {
    const startTime = performance.now();
    this.detectionCount++;
    
    try {
      Logger.debug(this.componentName, '🔥🔥🔥 macOS RAW INPUT DATA 🔥🔥🔥', {
        keycode: rawEvent.keycode,
        keychar: rawEvent.keychar,
        rawcode: (rawEvent as any).rawcode,
        keycodeHex: `0x${rawEvent.keycode.toString(16)}`,
        keycharHex: rawEvent.keychar ? `0x${rawEvent.keychar.toString(16)}` : 'null',
        keycharString: rawEvent.keychar ? String.fromCharCode(rawEvent.keychar) : 'null',
        isShift: rawEvent.shiftKey,
        currentLanguage: this.currentLanguage
      });

      // 🔥 1단계: 제어문자와 특수키 처리
      const specialResult = this.handleSpecialKeys(rawEvent);
      if (specialResult) return this.finalizeResult(specialResult, startTime);

      // 🔥 2단계: macOS IME 조합 결과 확인
      const imeResult = this.detectMacOSIMEResult(rawEvent);
      if (imeResult) return this.finalizeResult(imeResult, startTime);

      // 🔥 3단계: 키코드 없으면 시스템 입력소스 기반 감지
      if (!rawEvent.keychar || rawEvent.keychar === 0) {
        const systemResult = await this.detectBySystemInputSource(startTime);
        if (systemResult && systemResult.confidence >= 0.9) {
          return systemResult;
        }
        return this.finalizeResult(this.detectByKeycodeOnly(rawEvent), startTime);
      }

      // 🔥 4단계: 키 버퍼에 추가
      this.addToBuffer(rawEvent);

      // 🔥 5단계: 언어 컨텍스트를 고려한 키코드 감지
      const contextResult = this.detectByKeycodeWithLanguageContext(rawEvent);
      if (contextResult.confidence >= 0.8) {
        return this.finalizeResult(contextResult, startTime);
      }

      // 🔥 6단계: 시스템 입력소스 기반 감지
      const systemResult = await this.detectBySystemInputSource(startTime);
      if (systemResult && systemResult.confidence >= 0.9) {
        return systemResult;
      }

      // 🔥 7단계: 패턴 분석
      const patternResult = this.detectByPattern();
      if (patternResult.confidence >= 0.7) {
        return this.finalizeResult(patternResult, startTime);
      }

      // 🔥 최종: Fallback
      return this.finalizeResult(this.detectByFallback(rawEvent), startTime);

    } catch (error) {
      Logger.error(this.componentName, 'macOS 언어 감지 실패', error);
      return this.createErrorResult(error, startTime);
    }
  }

  /**
   * 🔥 특수키 처리
   */
  private handleSpecialKeys(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult | null {
    const { keycode } = rawEvent;
    
    // 제어문자는 영어로 강제 분류
    if (keycode <= 31 || keycode === 127) {
      Logger.debug(this.componentName, '🔥 제어문자 감지 - 영어로 강제 분류', {
        keycode, keycodeHex: `0x${keycode.toString(16)}`
      });
      
      return {
        language: 'en',
        confidence: 0.95,
        method: 'special-char-mapping',
        isComposing: false,
        metadata: { 
          keycode, reason: 'control-character-forced-english'
        }
      };
    }

    // 제외 키 목록
    if (this.EXCLUDED_KEYS.has(keycode)) {
      return {
        language: this.currentLanguage,
        confidence: 0.8,
        method: 'special-char-mapping',
        isComposing: false,
        metadata: { keycode, reason: 'excluded-key-maintain-current' }
      };
    }

    return null;
  }

  /**
   * 🔥 macOS IME 조합 결과 감지
   */
  private detectMacOSIMEResult(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult | null {
    if (rawEvent.keychar) {
      const char = String.fromCharCode(rawEvent.keychar);
      
      // 한글 완성형 문자 감지
      if (char.charCodeAt(0) >= 0xAC00 && char.charCodeAt(0) <= 0xD7AF) {
        Logger.debug(this.componentName, '🔥 macOS IME 한글 조합 감지', { 
          char, charCode: char.charCodeAt(0).toString(16) 
        });
        
        return {
          language: 'ko',
          confidence: 0.98, // 시스템이 조합했으니 확실함
          method: 'ime',
          isComposing: false, // 이미 완성됨
          detectedChar: char,
          metadata: { charCode: char.charCodeAt(0), reason: 'macos-ime-hangul' }
        };
      }
    }
    
    return null;
  }

  /**
   * 🔥 키코드만으로 감지 (keychar 없을 때)
   */
  private detectByKeycodeOnly(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    const { keycode } = rawEvent;
    const rawcode = (rawEvent as any).rawcode;
    const physicalKeycode = rawcode || keycode;

    // 물리적 키코드로 한글 매핑 확인
    if (this.KEYCODE_TO_HANGUL.has(physicalKeycode)) {
      const hangulChar = this.KEYCODE_TO_HANGUL.get(physicalKeycode);
      this.currentLanguage = 'ko';
      
      Logger.debug(this.componentName, '🔥 물리적 키코드로 한글 감지', {
        keycode, rawcode, physicalKeycode, hangulChar
      });
      
      return {
        language: 'ko',
        confidence: 0.85,
        method: 'keycode',
        isComposing: true,
        detectedChar: hangulChar,
        metadata: { 
          keycode, rawcode, hangulChar, 
          reason: 'physical-keycode-hangul-mapping' 
        }
      };
    }

    // 영어 키 확인
    if (this.ENGLISH_KEYCODES.has(keycode)) {
      this.currentLanguage = 'en';
      return {
        language: 'en',
        confidence: 0.8,
        method: 'keycode',
        isComposing: false,
        metadata: { keycode, reason: 'english-keycode-mapping' }
      };
    }

    // 현재 언어 유지
    return {
      language: this.currentLanguage,
      confidence: 0.5,
      method: 'fallback',
      isComposing: false,
      metadata: { keycode, reason: 'maintain-current-language' }
    };
  }

  /**
   * 🔥 언어 컨텍스트를 고려한 키코드 감지
   */
  private detectByKeycodeWithLanguageContext(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    const { keycode, keychar } = rawEvent;
    
    // 현재 언어가 영어이고 keychar가 영어 알파벳이면 영어 강제 유지
    if (this.currentLanguage === 'en' && keychar) {
      const char = String.fromCharCode(keychar);
      const isEnglishAlphabet = /^[a-zA-Z]$/.test(char);
      
      if (isEnglishAlphabet) {
        Logger.debug(this.componentName, '🔥 영어 모드에서 영어 문자 감지 - 영어 강제 유지!', {
          keycode, keychar, char, currentLanguage: this.currentLanguage
        });
        
        return {
          language: 'en',
          confidence: 0.99,
          method: 'character',
          isComposing: false,
          detectedChar: char,
          metadata: { keycode, keychar, char, reason: 'english-mode-locked' }
        };
      }
    }

    // 현재 언어가 한국어이고 한글 매핑이 있으면 한국어 유지
    if (this.currentLanguage === 'ko') {
      const hangulChar = this.KEYCODE_TO_HANGUL.get(keycode);
      if (hangulChar) {
        Logger.debug(this.componentName, '🔥 한국어 모드에서 한글 매핑 키 감지', {
          keycode, hangulChar, currentLanguage: this.currentLanguage
        });
        
        return {
          language: 'ko',
          confidence: 0.95,
          method: 'keycode',
          isComposing: true,
          detectedChar: hangulChar,
          metadata: { keycode, hangulChar, reason: 'korean-mode-hangul-mapping' }
        };
      }
    }

    // 기본 키코드 감지
    return this.detectByKeycodeOnly(rawEvent);
  }

  /**
   * 🔥 HIToolbox 기반 시스템 입력소스 감지
   */
  private async getCurrentInputSourceFromSystem(): Promise<'ko' | 'en' | null> {
    try {
      const now = Date.now();
      if (this.systemInputSourceCache && 
          now - this.lastSystemCheck < this.SYSTEM_CHECK_INTERVAL) {
        return this.systemInputSourceCache;
      }

      if (this.systemCheckInProgress) {
        return this.systemInputSourceCache;
      }

      this.systemCheckInProgress = true;

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          this.systemCheckInProgress = false;
          resolve(this.systemInputSourceCache);
        }, 1000);

        exec('defaults read com.apple.HIToolbox AppleCurrentKeyboardLayoutInputSourceID', 
          (error, stdout) => {
            clearTimeout(timeout);
            this.systemCheckInProgress = false;
            this.lastSystemCheck = now;

            if (error) {
              Logger.debug(this.componentName, 'HIToolbox 명령 실패 - 캐시된 값 사용', { error: error.message });
              resolve(this.systemInputSourceCache);
              return;
            }

            const inputSourceId = stdout.trim();
            let detectedLanguage: 'ko' | 'en' = 'en';

            if (inputSourceId.includes('hangul') || inputSourceId.includes('korean') || inputSourceId.includes('2set')) {
              detectedLanguage = 'ko';
            } else {
              detectedLanguage = 'en';
            }

            this.systemInputSourceCache = detectedLanguage;

            Logger.debug(this.componentName, '🔥🔥🔥 시스템 입력소스 감지 성공! 🔥🔥🔥', {
              inputSourceId, detectedLanguage, confidence: 0.95
            });

            resolve(detectedLanguage);
          });
      });
    } catch (error) {
      Logger.error(this.componentName, 'System input source detection error', error);
      this.systemCheckInProgress = false;
      return null;
    }
  }

  /**
   * 🔥 시스템 기반 언어 감지
   */
  private async detectBySystemInputSource(startTime: number): Promise<LanguageDetectionResult | null> {
    const systemLanguage = await this.getCurrentInputSourceFromSystem();
    
    if (systemLanguage) {
      this.currentLanguage = systemLanguage;
      
      return {
        language: systemLanguage,
        confidence: 0.95,
        method: 'system',
        isComposing: systemLanguage === 'ko',
        metadata: {
          source: 'HIToolbox',
          processingTime: `${(Date.now() - startTime).toFixed(3)}ms`
        }
      };
    }
    
    return null;
  }

  /**
   * 🔥 패턴 분석 기반 감지
   */
  private detectByPattern(): LanguageDetectionResult {
    if (this.keyBuffer.length < 2) {
      return {
        language: this.currentLanguage,
        confidence: 0.5,
        method: 'pattern',
        isComposing: false,
        metadata: { reason: 'insufficient-buffer' }
      };
    }

    const recentKeycodes = this.keyBuffer.slice(-3).map(event => event.keycode);
    let hangulKeyCount = 0;
    
    for (const keycode of recentKeycodes) {
      if (this.KEYCODE_TO_HANGUL.has(keycode)) {
        hangulKeyCount++;
      }
    }

    const hangulRatio = hangulKeyCount / recentKeycodes.length;

    if (hangulRatio >= 0.6) {
      this.currentLanguage = 'ko';
      return {
        language: 'ko',
        confidence: 0.8,
        method: 'pattern',
        isComposing: true,
        metadata: { hangulKeyCount, totalKeys: recentKeycodes.length, hangulRatio }
      };
    } else if (hangulRatio <= 0.3) {
      this.currentLanguage = 'en';
      return {
        language: 'en',
        confidence: 0.7,
        method: 'pattern',
        isComposing: false,
        metadata: { hangulKeyCount, totalKeys: recentKeycodes.length, hangulRatio }
      };
    }

    return {
      language: this.currentLanguage,
      confidence: 0.5,
      method: 'pattern',
      isComposing: false,
      metadata: { hangulRatio, reason: 'pattern-mixed' }
    };
  }

  /**
   * 🔥 Fallback 감지
   */
  private detectByFallback(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    const { keycode } = rawEvent;

    // 숫자 키는 현재 언어 유지
    if (keycode >= 48 && keycode <= 57) {
      return {
        language: this.currentLanguage,
        confidence: 0.7,
        method: 'fallback',
        isComposing: false,
        metadata: { reason: 'number-key-maintain-current', keycode }
      };
    }

    // 기본값: 영어로 fallback
    return {
      language: 'en',
      confidence: 0.4,
      method: 'fallback',
      isComposing: false,
      metadata: { reason: 'default-english-fallback', keycode }
    };
  }

  /**
   * 🔥 키 버퍼에 추가
   */
  private addToBuffer(rawEvent: UiohookKeyboardEvent): void {
    const keyEvent: KeyBufferEvent = {
      keycode: rawEvent.keycode,
      timestamp: Date.now()
    };
    
    this.keyBuffer.push(keyEvent);
    
    if (this.keyBuffer.length > this.BUFFER_SIZE) {
      this.keyBuffer.shift();
    }
  }

  /**
   * 🔥 결과 최종화
   */
  private finalizeResult(result: LanguageDetectionResult, startTime: number): LanguageDetectionResult {
    const processingTime = performance.now() - startTime;
    this.totalProcessingTime += processingTime;
    
    if (result.confidence >= 0.6) {
      this.currentLanguage = result.language;
    }
    
    Logger.debug(this.componentName, 'macOS 언어 감지 완료', {
      language: result.language,
      confidence: result.confidence,
      method: result.method,
      processingTime: `${processingTime.toFixed(3)}ms`,
      averageTime: `${(this.totalProcessingTime / this.detectionCount).toFixed(3)}ms`
    });
    
    return result;
  }

  /**
   * 🔥 에러 결과 생성
   */
  private createErrorResult(error: unknown, startTime: number): LanguageDetectionResult {
    return this.finalizeResult({
      language: this.currentLanguage,
      confidence: 0.3,
      method: 'fallback',
      isComposing: false,
      metadata: { 
        error: String(error),
        reason: 'error-fallback'
      }
    }, startTime);
  }

  /**
   * 🔥 상태 초기화
   */
  private resetState(): void {
    this.currentLanguage = 'en';
    this.keyBuffer = [];
    this.detectionCount = 0;
    this.totalProcessingTime = 0;
    this.systemInputSourceCache = null;
    this.lastSystemCheck = 0;
    this.systemCheckInProgress = false;
    Logger.debug(this.componentName, 'macOS 언어 감지기 상태 초기화 완료');
  }

  // 🔥 공개 메서드들
  public getCurrentLanguage(): 'ko' | 'en' | 'ja' | 'zh' {
    return this.currentLanguage;
  }

  public setLanguage(language: 'ko' | 'en' | 'ja' | 'zh'): void {
    this.currentLanguage = language;
    Logger.info(this.componentName, 'macOS 언어 수동 설정', { language });
  }

  public getPerformanceStats(): {
    platform: 'macOS';
    detectionCount: number;
    averageProcessingTime: number;
    bufferSize: number;
    currentLanguage: 'ko' | 'en' | 'ja' | 'zh';
    systemCacheValid: boolean;
  } {
    return {
      platform: 'macOS',
      detectionCount: this.detectionCount,
      averageProcessingTime: this.detectionCount > 0 ? 
        this.totalProcessingTime / this.detectionCount : 0,
      bufferSize: this.keyBuffer.length,
      currentLanguage: this.currentLanguage,
      systemCacheValid: this.systemInputSourceCache !== null && 
        Date.now() - this.lastSystemCheck < this.SYSTEM_CHECK_INTERVAL
    };
  }

  public async healthCheck(): Promise<{
    healthy: boolean;
    lastError?: string;
    performance: ReturnType<MacOSLanguageDetector['getPerformanceStats']>;
  }> {
    try {
      // 시스템 입력소스 테스트
      await this.getCurrentInputSourceFromSystem();
      
      return {
        healthy: true,
        performance: this.getPerformanceStats()
      };
    } catch (error) {
      return {
        healthy: false,
        lastError: String(error),
        performance: this.getPerformanceStats()
      };
    }
  }
}

export const macOSLanguageDetector = new MacOSLanguageDetector();
export default macOSLanguageDetector;
