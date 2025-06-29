// 🔥 기가차드 keycode 기반 LanguageDetector - macOS IME 완전 우회!

import { Logger } from '../../../shared/logger';
import { BaseManager } from '../../common/BaseManager';
import { KEYBOARD_LANGUAGES } from '../../../shared/common';
import type { UiohookKeyboardEvent } from 'uiohook-napi';

// 🔥 언어 감지 결과 인터페이스
export interface LanguageDetectionResult {
  language: 'ko' | 'en' | 'ja' | 'zh';
  confidence: number;
  method: 'keycode' | 'pattern' | 'fallback';
  isComposing: boolean;
  metadata?: Record<string, unknown>;
}

// 🔥 키 버퍼 이벤트
interface KeyBufferEvent {
  keycode: number;
  timestamp: number;
  language?: 'ko' | 'en' | 'ja' | 'zh';
}

/**
 * 🔥 기가차드 keycode 기반 LanguageDetector - IME 우회 버전!
 */
export class LanguageDetector extends BaseManager {
  private readonly componentName = 'LANGUAGE_DETECTOR';
  
  // 🔥 상태 관리
  private currentLanguage: 'ko' | 'en' | 'ja' | 'zh' = 'en';
  private keyBuffer: KeyBufferEvent[] = [];
  private readonly BUFFER_SIZE = 5;
  
  // 🔥 성능 카운터
  private detectionCount = 0;
  private totalProcessingTime = 0;
  
  // 🔥 기가차드 물리적 keycode → 한글자모 매핑 (OS 무관!)
  private readonly KEYCODE_TO_HANGUL: Map<number, string> = new Map([
    // 자음 (상단 행)
    [81, 'ㅂ'],   // Q
    [87, 'ㅈ'],   // W  
    [69, 'ㄷ'],   // E
    [82, 'ㄱ'],   // R
    [84, 'ㅅ'],   // T
    [89, 'ㅛ'],   // Y
    [85, 'ㅕ'],   // U
    [73, 'ㅑ'],   // I
    [79, 'ㅐ'],   // O
    [80, 'ㅔ'],   // P
    
    // 자음 (중단 행)
    [65, 'ㅁ'],   // A
    [83, 'ㄴ'],   // S
    [68, 'ㅇ'],   // D
    [70, 'ㄹ'],   // F ⭐ 이게 ㄹ이다!
    [71, 'ㅎ'],   // G
    [72, 'ㅗ'],   // H
    [74, 'ㅓ'],   // J
    [75, 'ㅏ'],   // K
    [76, 'ㅣ'],   // L
    
    // 자음 (하단 행)  
    [90, 'ㅋ'],   // Z
    [88, 'ㅌ'],   // X
    [67, 'ㅊ'],   // C
    [86, 'ㅍ'],   // V
    [66, 'ㅠ'],   // B
    [78, 'ㅜ'],   // N
    [77, 'ㅡ'],   // M
  ]);
  
  // 🔥 영어 키코드 범위 (A-Z, 숫자, 특수문자)
  private readonly ENGLISH_KEYCODES = new Set([
    // A-Z (65-90)
    ...Array.from({length: 26}, (_, i) => 65 + i),
    // 숫자 (48-57) 
    ...Array.from({length: 10}, (_, i) => 48 + i),
    // 특수문자 (자주 사용되는 것들)
    32, 188, 190, 191, 186, 222, 219, 221, 220, 192, 189, 187
  ]);

  constructor() {
    super({
      name: 'LanguageDetector',
      autoStart: false,
      retryOnError: false,
      maxRetries: 1,
      retryDelay: 100,
    });
    
    Logger.info(this.componentName, '🔥 keycode 기반 언어 감지기 생성됨');
  }

  protected async doInitialize(): Promise<void> {
    this.resetState();
    Logger.info(this.componentName, '🔥 keycode 기반 언어 감지기 초기화됨');
  }

  protected async doStart(): Promise<void> {
    this.resetState();
    Logger.info(this.componentName, '🔥 keycode 기반 언어 감지기 시작됨');
  }

  protected async doStop(): Promise<void> {
    this.resetState();
    Logger.info(this.componentName, '🔥 keycode 기반 언어 감지기 중지됨');
  }

  protected async doCleanup(): Promise<void> {
    this.keyBuffer = [];
    Logger.info(this.componentName, '🔥 keycode 기반 언어 감지기 정리됨');
  }

  /**
   * 🔥 메인 언어 감지 메서드 - keycode 기반 3단계 알고리즘
   */
  public detectLanguage(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    const startTime = performance.now();
    
    try {
      // 극한 디버깅
      Logger.debug(this.componentName, '🔥🔥🔥 RAW INPUT DATA 🔥🔥🔥', {
        keycode: rawEvent.keycode,
        keychar: rawEvent.keychar,
        keycodeHex: `0x${rawEvent.keycode.toString(16)}`,
        keycharHex: rawEvent.keychar ? `0x${rawEvent.keychar.toString(16)}` : 'null',
        keycharString: rawEvent.keychar ? String.fromCharCode(rawEvent.keychar) : 'null',
        keycharUnicode: rawEvent.keychar ? `U+${rawEvent.keychar.toString(16).padStart(4, '0')}` : 'null',
        isShift: rawEvent.shiftKey,
        currentLanguage: this.currentLanguage
      });
      
      // keychar 없으면 keycode만으로 처리 (macOS IME 우회!)
      if (!rawEvent.keychar || rawEvent.keychar === 0) {
        Logger.debug(this.componentName, '❌ NO KEYCHAR - keycode 기반 처리', { keycode: rawEvent.keycode });
        return this.detectByKeycodeOnly(rawEvent, startTime);
      }
      
      // 키 버퍼에 추가
      this.addToBuffer(rawEvent);
      
      // 🔥 1단계: keycode 기반 즉시 감지
      const keycodeResult = this.detectByKeycode(rawEvent);
      if (keycodeResult.confidence >= 0.8) {
        return this.finalizeResult(keycodeResult, startTime);
      }
      
      // 🔥 2단계: 패턴 분석 기반 감지
      const patternResult = this.detectByPattern();
      if (patternResult.confidence >= 0.6) {
        return this.finalizeResult(patternResult, startTime);
      }
      
      // 🔥 3단계: 스마트 fallback
      const fallbackResult = this.detectByFallback(rawEvent);
      return this.finalizeResult(fallbackResult, startTime);
      
    } catch (error) {
      Logger.error(this.componentName, 'Error in language detection', error);
      return this.createFallbackResult(startTime);
    }
  }

  /**
   * 🔥 keycode만으로 감지 (macOS IME 우회)
   */
  private detectByKeycodeOnly(rawEvent: UiohookKeyboardEvent, startTime: number): LanguageDetectionResult {
    const { keycode } = rawEvent;
    
    // 한글 키매핑 확인
    if (this.KEYCODE_TO_HANGUL.has(keycode)) {
      const hangulChar = this.KEYCODE_TO_HANGUL.get(keycode);
      this.currentLanguage = 'ko';
      
      Logger.debug(this.componentName, '🔥 keycode 기반 한글 감지!', {
        keycode,
        hangulChar,
        keycodeHex: `0x${keycode.toString(16)}`
      });
      
      return this.finalizeResult({
        language: 'ko',
        confidence: 0.95, // 높은 신뢰도
        method: 'keycode',
        isComposing: true,
        metadata: { 
          keycode,
          hangulChar,
          reason: 'keycode-hangul-mapping'
        }
      }, startTime);
    }
    
    // 영어 키 확인
    if (this.ENGLISH_KEYCODES.has(keycode)) {
      return this.finalizeResult({
        language: 'en',
        confidence: 0.8,
        method: 'keycode',
        isComposing: false,
        metadata: { 
          keycode,
          reason: 'keycode-english-key'
        }
      }, startTime);
    }
    
    // 특수 키들 (현재 언어 유지)
    return this.finalizeResult({
      language: this.currentLanguage,
      confidence: 0.7,
      method: 'fallback',
      isComposing: false,
      metadata: { 
        keycode,
        reason: 'keycode-special-key-maintain'
      }
    }, startTime);
  }

  /**
   * 🔥 1단계: keycode 기반 즉시 감지
   */
  private detectByKeycode(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    const { keycode, keychar } = rawEvent;
    
    // 한글 키매핑 확인 (keycode 우선)
    if (this.KEYCODE_TO_HANGUL.has(keycode)) {
      const hangulChar = this.KEYCODE_TO_HANGUL.get(keycode);
      this.currentLanguage = 'ko';
      
      return {
        language: 'ko',
        confidence: 0.95,
        method: 'keycode',
        isComposing: true,
        metadata: { 
          keycode,
          keychar,
          hangulChar,
          reason: 'keycode-hangul-direct'
        }
      };
    }
    
    // 영어 키 확인
    if (this.ENGLISH_KEYCODES.has(keycode)) {
      return {
        language: 'en',
        confidence: 0.85,
        method: 'keycode',
        isComposing: false,
        metadata: { 
          keycode,
          keychar,
          reason: 'keycode-english-direct'
        }
      };
    }
    
    return {
      language: this.currentLanguage,
      confidence: 0.4,
      method: 'keycode',
      isComposing: false,
      metadata: { reason: 'keycode-no-match' }
    };
  }

  /**
   * 🔥 2단계: 패턴 분석 기반 감지
   */
  private detectByPattern(): LanguageDetectionResult {
    if (this.keyBuffer.length < 2) {
      return {
        language: this.currentLanguage,
        confidence: 0.3,
        method: 'pattern',
        isComposing: false,
        metadata: { reason: 'insufficient-buffer', bufferSize: this.keyBuffer.length }
      };
    }
    
    // 최근 키들의 keycode 분석
    const recentKeycodes = this.keyBuffer
      .slice(-3)
      .map(event => event.keycode);
    
    if (recentKeycodes.length === 0) {
      return {
        language: this.currentLanguage,
        confidence: 0.3,
        method: 'pattern',
        isComposing: false,
        metadata: { reason: 'no-valid-keycodes' }
      };
    }
    
    // 한글 키 패턴 분석 (keycode 기반)
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
        metadata: { 
          hangulKeyCount,
          totalKeys: recentKeycodes.length,
          hangulRatio,
          reason: 'hangul-pattern-strong'
        }
      };
    } else if (hangulRatio <= 0.3) {
      this.currentLanguage = 'en';
      return {
        language: 'en',
        confidence: 0.7,
        method: 'pattern',
        isComposing: false,
        metadata: { 
          hangulKeyCount,
          totalKeys: recentKeycodes.length,
          hangulRatio,
          reason: 'english-pattern-strong'
        }
      };
    }
    
    return {
      language: this.currentLanguage,
      confidence: 0.5,
      method: 'pattern',
      isComposing: false,
      metadata: { 
        hangulRatio,
        reason: 'pattern-mixed'
      }
    };
  }

  /**
   * 🔥 3단계: 스마트 fallback
   */
  private detectByFallback(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    const { keycode, keychar } = rawEvent;
    
    // 특수 키들 (화살표, Ctrl, Alt 등)
    if (keycode < 32 || !keychar) {
      return {
        language: this.currentLanguage,
        confidence: 0.8, // 현재 언어 유지로 높은 신뢰도
        method: 'fallback',
        isComposing: false,
        metadata: { reason: 'special-key-maintain-current', keycode }
      };
    }
    
    // 숫자 키 (48-57)
    if (keycode >= 48 && keycode <= 57) {
      return {
        language: this.currentLanguage,
        confidence: 0.7,
        method: 'fallback',
        isComposing: false,
        metadata: { reason: 'number-key-maintain-current', keycode }
      };
    }
    
    // 기본값: 영어로 fallback (confidence 낮춤)
    return {
      language: 'en',
      confidence: 0.4,
      method: 'fallback',
      isComposing: false,
      metadata: { reason: 'default-english-fallback', keycode }
    };
  }

  /**
   * 키 버퍼에 추가
   */
  private addToBuffer(rawEvent: UiohookKeyboardEvent): void {
    // keycode 기반으로 버퍼에 추가
    const keyEvent: KeyBufferEvent = {
      keycode: rawEvent.keycode,
      timestamp: Date.now()
    };
    
    this.keyBuffer.push(keyEvent);
    
    // 버퍼 크기 제한
    if (this.keyBuffer.length > this.BUFFER_SIZE) {
      this.keyBuffer.shift();
    }
  }

  /**
   * 결과 최종화 및 성능 측정
   */
  private finalizeResult(result: LanguageDetectionResult, startTime: number): LanguageDetectionResult {
    const processingTime = performance.now() - startTime;
    
    this.detectionCount++;
    this.totalProcessingTime += processingTime;
    
    // 신뢰도 임계값 (0.6 이상일 때만 언어 변경)
    if (result.confidence >= 0.6) {
      this.currentLanguage = result.language;
    }
    
    Logger.debug(this.componentName, 'Language detection completed', {
      language: result.language,
      confidence: result.confidence,
      method: result.method,
      processingTime: `${processingTime.toFixed(3)}ms`,
      averageTime: `${(this.totalProcessingTime / this.detectionCount).toFixed(3)}ms`
    });
    
    return result;
  }

  private createFallbackResult(startTime: number): LanguageDetectionResult {
    return this.finalizeResult({
      language: this.currentLanguage,
      confidence: 0.3,
      method: 'fallback',
      isComposing: false,
      metadata: { reason: 'error-fallback' }
    }, startTime);
  }

  private resetState(): void {
    this.currentLanguage = 'en';
    this.keyBuffer = [];
    this.detectionCount = 0;
    this.totalProcessingTime = 0;
    Logger.debug(this.componentName, 'State reset completed');
  }

  public getCurrentLanguage(): 'ko' | 'en' | 'ja' | 'zh' {
    return this.currentLanguage;
  }

  public setLanguage(language: 'ko' | 'en' | 'ja' | 'zh'): void {
    this.currentLanguage = language;
    Logger.info(this.componentName, 'Language manually set', { language });
  }

  public getPerformanceStats(): {
    detectionCount: number;
    averageProcessingTime: number;
    bufferSize: number;
    currentLanguage: 'ko' | 'en' | 'ja' | 'zh';
  } {
    return {
      detectionCount: this.detectionCount,
      averageProcessingTime: this.detectionCount > 0 ? 
        this.totalProcessingTime / this.detectionCount : 0,
      bufferSize: this.keyBuffer.length,
      currentLanguage: this.currentLanguage
    };
  }
}

export const languageDetector = new LanguageDetector();
export default languageDetector;