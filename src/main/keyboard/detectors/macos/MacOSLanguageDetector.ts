// 🔥 기가차드 macOS 전용 언어 감지기 - HIToolbox + 실시간 키코드 변환!

import { exec } from 'child_process';
import { BaseLanguageDetector } from '../base/BaseLanguageDetector';
import { Platform } from '../../../utils/platform';
import { Logger } from '../../../../shared/logger';
import { MacOSKeycodeTranslator } from './MacOSKeycodeTranslator';
import type { 
  UiohookKeyboardEvent, 
  LanguageDetectionResult 
} from '../../../../shared/types';
import {
  MacOSInputSourceType,
  MacOSModifiers,
  MacOSTranslationResult,
  DetectionMetadata,
  SupportedLanguage,
  HangulType
} from '../types/CommonTypes';

// 🔥 공통 키코드 매핑 import (폴백용)
import { 
  MACOS_HANGUL_KEYCODES, 
  MACOS_INPUT_SOURCES,
  isHangulKeycode,
  isEnglishKeycode 
} from '../types/KeycodeMappings';

/**
 * 🔥 MacOSLanguageDetector - macOS 네이티브 API 전용 언어 감지기
 * 
 * macOS 전용 최적화:
 * - HIToolbox AppleCurrentKeyboardLayoutInputSourceID
 * - 실시간 TIS API 키코드 변환 (MacOSKeycodeTranslator)
 * - NSTextInputContext 상태 감지
 * - IME 조합 상태 실시간 추적
 */
export class MacOSLanguageDetector extends BaseLanguageDetector {
  // 🔥 macOS 전용 시스템 입력소스 캐시 (확장된 언어 지원)
  private systemInputSourceCache: MacOSInputSourceType = null;
  private lastSystemCheck = 0;
  private readonly SYSTEM_CHECK_INTERVAL = 500; // 0.5초
  private systemCheckInProgress = false;
  
  // 🔥 실시간 키코드 변환기
  private keycodeTranslator: MacOSKeycodeTranslator;

  constructor() {
    super('MACOS_LANGUAGE_DETECTOR');
    
    // 🔥 실시간 키코드 변환기 초기화
    this.keycodeTranslator = MacOSKeycodeTranslator.getInstance();
    
    // 🔥 테스트 환경에서는 플랫폼 검증 스킵
    if (process.env.NODE_ENV !== 'test' && !Platform.isMacOS()) {
      throw new Error('MacOSLanguageDetector는 macOS에서만 사용할 수 있습니다');
    }
  }

  protected getPlatformName(): string {
    return 'macOS';
  }

  /**
   * 🔥 macOS 메인 언어 감지 메서드 - 실시간 키코드 변환 통합
   */
  public async detectLanguage(rawEvent: UiohookKeyboardEvent): Promise<LanguageDetectionResult> {
    const startTime = performance.now();

    try {
      Logger.debug(this.componentName, '🔥 macOS 네이티브 언어 감지 시작 (실시간 변환)', {
        keycode: rawEvent.keycode,
        keychar: rawEvent.keychar,
        isShift: rawEvent.shiftKey,
        currentLanguage: this.currentLanguage
      });

      // 🔥 1순위: 실시간 TIS API 키코드 변환 (가장 정확)
      const translationResult = await this.detectByRealtimeTranslation(rawEvent, startTime);
      if (translationResult && translationResult.confidence >= 0.9) {
        return this.finalizeResult(translationResult, startTime);
      }

      // 🔥 2순위: 시스템 입력소스 직접 조회 (언어만 감지)
      const systemResult = await this.detectBySystemInputSource(startTime);
      if (systemResult && systemResult.confidence >= 0.85) {
        // 실시간 변환 결과와 시스템 언어 결합
        if (translationResult && translationResult.detectedChar) {
          systemResult.detectedChar = translationResult.detectedChar;
          systemResult.confidence = Math.max(systemResult.confidence, translationResult.confidence);
        }
        return this.finalizeResult(systemResult, startTime);
      }

      // 🔥 3순위: macOS 한글 키코드 매핑 (폴백)
      const keycodeResult = this.detectByMacOSKeycode(rawEvent);
      if (keycodeResult.confidence >= 0.7) {
        return this.finalizeResult(keycodeResult, startTime);
      }

      // 🔥 4순위: 현재 언어 유지 (안전장치)
      return this.finalizeResult({
        language: this.currentLanguage,
        confidence: 0.5,
        method: 'fallback',
        isComposing: this.currentLanguage === 'ko',
        metadata: {
          keycode: rawEvent.keycode,
          keychar: rawEvent.keychar,
          reason: 'macos-fallback-maintain-current'
        }
      }, startTime);

    } catch (error) {
      Logger.error(this.componentName, 'macOS 언어 감지 오류', error);
      return this.finalizeResult({
        language: this.currentLanguage,
        confidence: 0.3,
        method: 'fallback',
        isComposing: false,
        metadata: { error: String(error) }
      }, startTime);
    }
  }

  /**
   * 🔥 실시간 TIS API 기반 키코드 변환
   */
  private async detectByRealtimeTranslation(
    rawEvent: UiohookKeyboardEvent, 
    startTime: number
  ): Promise<LanguageDetectionResult | null> {
    try {
      const translationResult = await this.keycodeTranslator.translateKeycode(
        rawEvent.keycode,
        {
          shift: rawEvent.shiftKey,
          command: rawEvent.metaKey,
          option: rawEvent.altKey,
          control: rawEvent.ctrlKey
        }
      );

      if (translationResult.isSuccess && translationResult.character) {
        Logger.debug(this.componentName, '🔥 실시간 TIS API 변환 성공', {
          keycode: rawEvent.keycode,
          character: translationResult.character,
          language: translationResult.language,
          inputSource: translationResult.inputSource,
          processingTime: translationResult.processingTime
        });

        // 언어 매핑 ('unknown' → 'en' 변환)
        const language = translationResult.language === 'unknown' ? 'en' : translationResult.language;
        
        this.currentLanguage = language;

        return {
          language,
          confidence: 0.95, // TIS API 기반이므로 높은 신뢰도
          method: 'native',
          isComposing: language === 'ko',
          detectedChar: translationResult.character || undefined,
          metadata: {
            source: 'TIS-API',
            systemInputSource: (translationResult.inputSource as MacOSInputSourceType) || undefined,
            processingTime: `${translationResult.processingTime.toFixed(3)}ms`,
            translationMethod: translationResult.method
          }
        };
      }

      return null;
    } catch (error) {
      Logger.warn(this.componentName, '실시간 TIS API 변환 실패', error);
      return null;
    }
  }

  /**
   * 🔥 macOS 시스템 입력소스 기반 감지 (HIToolbox)
   */
  private async detectBySystemInputSource(startTime: number): Promise<LanguageDetectionResult | null> {
    try {
      const systemLanguage = await this.getCurrentInputSourceFromSystem();
      
      // 🔥 유효한 언어만 설정
      if (systemLanguage && systemLanguage !== null) {
        this.currentLanguage = systemLanguage;
        
        Logger.debug(this.componentName, '🔥 macOS 시스템 입력소스 감지 성공', {
          systemLanguage,
          confidence: 0.98
        });
        
        return {
          language: systemLanguage as SupportedLanguage,
          confidence: 0.98, // macOS 시스템 레벨이므로 최고 신뢰도
          method: 'system',
          isComposing: systemLanguage === 'ko',
          metadata: {
            source: 'HIToolbox',
            processingTime: `${(performance.now() - startTime).toFixed(3)}ms`
          }
        };
      }
      
      return null;
    } catch (error) {
      Logger.error(this.componentName, 'macOS 시스템 입력소스 감지 실패', error);
      return null;
    }
  }

  /**
   * 🔥 macOS HIToolbox를 통한 현재 입력소스 조회
   */
  private async getCurrentInputSourceFromSystem(): Promise<MacOSInputSourceType> {
    // 캐시된 결과가 유효하면 반환
    const now = Date.now();
    if (this.systemInputSourceCache && 
        now - this.lastSystemCheck < this.SYSTEM_CHECK_INTERVAL) {
      return this.systemInputSourceCache;
    }

    // 이미 진행 중이면 캐시된 값 반환
    if (this.systemCheckInProgress) {
      return this.systemInputSourceCache;
    }

    this.systemCheckInProgress = true;

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        this.systemCheckInProgress = false;
        resolve(this.systemInputSourceCache);
      }, 1000); // 1초 타임아웃

      exec('defaults read com.apple.HIToolbox AppleCurrentKeyboardLayoutInputSourceID', 
        (error, stdout) => {
          clearTimeout(timeout);
          this.systemCheckInProgress = false;
          this.lastSystemCheck = now;

          if (error) {
            Logger.debug(this.componentName, 'HIToolbox 조회 실패', { error: error.message });
            resolve(null);
            return;
          }

          const inputSourceId = stdout.trim();
          
          // 입력소스 ID를 언어로 변환
          let detectedLanguage: 'ko' | 'en' | null = null;
          for (const [sourceId, lang] of Object.entries(MACOS_INPUT_SOURCES)) {
            if (inputSourceId.includes(sourceId) || inputSourceId.includes(lang)) {
              detectedLanguage = lang as 'ko' | 'en';
              break;
            }
          }

          // 특별 처리: hangul이 포함되면 무조건 한글
          if (inputSourceId.toLowerCase().includes('hangul')) {
            detectedLanguage = 'ko';
          }

          this.systemInputSourceCache = detectedLanguage;

          Logger.debug(this.componentName, '🔥 macOS HIToolbox 입력소스 감지 완료', {
            inputSourceId,
            detectedLanguage,
            confidence: 0.98
          });

          resolve(detectedLanguage);
        });
    });
  }

  /**
   * 🔥 macOS 키코드 기반 감지 (IME 우회)
   */
  private detectByMacOSKeycode(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    const { keycode, keychar } = rawEvent;

    // 제어문자는 언어 변경하지 않음
    if (keycode <= 31 || keycode === 127) {
      return {
        language: this.currentLanguage,
        confidence: 0.8,
        method: 'keycode',
        isComposing: false,
        metadata: { 
          keycode, 
          reason: 'macos-control-key-maintain-current' 
        }
      };
    }

    // 🔥 한글 키코드 확인 - keycode 우선, keychar 보조
    let hangulChar = MACOS_HANGUL_KEYCODES.get(keycode);
    if (!hangulChar && keychar) {
      hangulChar = MACOS_HANGUL_KEYCODES.get(keychar);
    }
    
    if (hangulChar) {
      Logger.debug(this.componentName, '🔥 macOS 한글 키코드 감지', {
        keycode,
        keychar,
        hangulChar,
        mappedBy: MACOS_HANGUL_KEYCODES.get(keycode) ? 'keycode' : 'keychar'
      });

      return {
        language: 'ko',
        confidence: 0.9,
        method: 'keycode',
        isComposing: true,
        detectedChar: hangulChar,
        metadata: {
          keycode,
          keychar,
          hangulChar,
          mappedBy: MACOS_HANGUL_KEYCODES.get(keycode) ? 'keycode' : 'keychar',
          reason: 'macos-hangul-keycode-mapping'
        }
      };
    }

    // 🔥 현재 입력소스가 한글인 경우 폴백 처리
    if (this.systemInputSourceCache === 'ko') {
      Logger.debug(this.componentName, '⚠️ 폴백: 기존 매핑 방식 사용', {
        keycode,
        pressedKey: keychar ? String.fromCharCode(keychar) : undefined,
        hangulChar: this.fallbackToKoreanChar(keycode, keychar)
      });
      
      const fallbackChar = this.fallbackToKoreanChar(keycode, keychar);
      if (fallbackChar) {
        return {
          language: 'ko',
          confidence: 0.7,
          method: 'fallback',
          isComposing: true,
          detectedChar: fallbackChar,
          metadata: {
            keycode,
            keychar,
            reason: 'macos-korean-fallback-mapping'
          }
        };
      }
    }

    // 영어 키코드 확인 (a-z, A-Z)
    if (keychar && ((keychar >= 97 && keychar <= 122) || (keychar >= 65 && keychar <= 90))) {
      const char = String.fromCharCode(keychar);
      
      return {
        language: 'en',
        confidence: 0.85,
        method: 'character',
        isComposing: false,
        detectedChar: char,
        metadata: {
          keycode,
          keychar,
          char,
          reason: 'macos-english-alphabet'
        }
      };
    }

    // 기타 키들은 현재 언어 유지
    return {
      language: this.currentLanguage,
      confidence: 0.7,
      method: 'fallback',
      isComposing: false,
      metadata: {
        keycode,
        keychar,
        reason: 'macos-unknown-key-maintain-current'
      }
    };
  }

  /**
   * 🔥 BaseManager 추상 메서드 구현
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'macOS 언어 감지기 초기화 시작');
    
    // macOS 플랫폼 검증
    if (!Platform.isMacOS()) {
      Logger.error(this.componentName, 'macOS가 아닌 플랫폼에서 실행 불가');
      throw new Error('macOS 플랫폼에서만 사용 가능');
    }
    
    // 초기 시스템 입력소스 캐시
    try {
      await this.getCurrentInputSourceFromSystem();
      Logger.info(this.componentName, 'macOS 언어 감지기 초기화 완료');
    } catch (error) {
      Logger.error(this.componentName, 'macOS 언어 감지기 초기화 실패', error);
      throw error;
    }
  }

  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'macOS 언어 감지기 시작');
  }

  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'macOS 언어 감지기 중지');
  }

  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'macOS 언어 감지기 정리');
    this.systemInputSourceCache = null;
    this.lastSystemCheck = 0;
    this.systemCheckInProgress = false;
  }

  /**
   * 🔥 macOS 전용 추가 메서드들
   */
  public async getInputSourceInfo(): Promise<{
    currentInputSource: string | null;
    availableInputSources: string[];
    lastCacheUpdate: number;
  }> {
    const current = await this.getCurrentInputSourceFromSystem();
    
    return {
      currentInputSource: current,
      availableInputSources: Object.keys(MACOS_INPUT_SOURCES),
      lastCacheUpdate: this.lastSystemCheck
    };
  }

  public getPerformanceStats() {
    return {
      ...super.getPerformanceStats(),
      platform: 'macOS',
      systemCallCount: this.systemCheckInProgress ? 1 : 0,
      cacheStatus: {
        cached: this.systemInputSourceCache,
        lastCheck: this.lastSystemCheck,
        interval: this.SYSTEM_CHECK_INTERVAL
      },
      hangulKeycodeCount: MACOS_HANGUL_KEYCODES.size,
      inputSourceCount: Object.keys(MACOS_INPUT_SOURCES).length
    };
  }

  /**
   * 🔥 새로운 Unicode 범위 기반 감지 시스템
   */
  private detectByUnicodeRange(keychar: number, keycode: number): LanguageDetectionResult {
    const char = String.fromCharCode(keychar);
    const charCode = keychar;

    // 🔥 한글 Unicode 범위들
    if (this.isHangulUnicode(charCode)) {
      const hangulType = this.getHangulType(charCode);
      
      Logger.debug(this.componentName, '🔥 Unicode 한글 감지', { 
        char, charCode, hangulType 
      });

      return {
        language: 'ko',
        confidence: 0.95,
        method: 'unicode',
        isComposing: hangulType !== 'syllable', // 완성형이 아니면 조합 중
        detectedChar: char,
        metadata: {
          keycode,
          keychar,
          charCode,
          hangulType,
          reason: 'unicode-hangul-range'
        }
      };
    }

    // 🔥 영어/라틴 Unicode 범위
    if (this.isLatinUnicode(charCode)) {
      return {
        language: 'en',
        confidence: 0.9,
        method: 'unicode',
        isComposing: false,
        detectedChar: char,
        metadata: {
          keycode,
          keychar,
          charCode,
          reason: 'unicode-latin-range'
        }
      };
    }

    // 🔥 기타 Unicode (일본어, 중국어 등)
    const otherLanguage = this.detectOtherLanguageByUnicode(charCode);
    if (otherLanguage) {
      return {
        language: 'en', // 현재는 한/영만 지원하므로 영어로 분류
        confidence: 0.8,
        method: 'unicode',
        isComposing: false,
        detectedChar: char,
        metadata: {
          keycode,
          keychar,
          charCode,
          detectedLanguage: otherLanguage,
          reason: 'unicode-other-language'
        }
      };
    }

    // Unicode 범위로 감지 실패
    return {
      language: this.currentLanguage,
      confidence: 0.3,
      method: 'fallback',
      isComposing: false,
      metadata: {
        keycode,
        keychar,
        charCode,
        reason: 'unicode-detection-failed'
      }
    };
  }

  /**
   * 🔥 한글 Unicode 범위 체크
   */
  private isHangulUnicode(charCode: number): boolean {
    return (
      // 한글 완성형 (가-힣)
      (charCode >= 0xAC00 && charCode <= 0xD7A3) ||
      // 한글 자모 (ㄱ-ㅎ, ㅏ-ㅣ)
      (charCode >= 0x3131 && charCode <= 0x318E) ||
      // 한글 호환 자모 (호환성)
      (charCode >= 0x3200 && charCode <= 0x321E) ||
      (charCode >= 0x3260 && charCode <= 0x327E)
    );
  }

  /**
   * 🔥 한글 타입 분류
   */
  private getHangulType(charCode: number): 'syllable' | 'consonant' | 'vowel' | 'compat' {
    if (charCode >= 0xAC00 && charCode <= 0xD7A3) {
      return 'syllable'; // 완성형 음절
    }
    if (charCode >= 0x3131 && charCode <= 0x314E) {
      return 'consonant'; // 자음
    }
    if (charCode >= 0x314F && charCode <= 0x3163) {
      return 'vowel'; // 모음
    }
    return 'compat'; // 호환 자모
  }

  /**
   * 🔥 라틴 Unicode 범위 체크
   */
  private isLatinUnicode(charCode: number): boolean {
    return (
      // Basic Latin (ASCII)
      (charCode >= 0x0020 && charCode <= 0x007F) ||
      // Latin-1 Supplement
      (charCode >= 0x00A0 && charCode <= 0x00FF) ||
      // Latin Extended-A
      (charCode >= 0x0100 && charCode <= 0x017F) ||
      // Latin Extended-B
      (charCode >= 0x0180 && charCode <= 0x024F)
    );
  }

  /**
   * 🔥 기타 언어 Unicode 감지
   */
  private detectOtherLanguageByUnicode(charCode: number): string | null {
    // 일본어 (ひらがな, カタカナ)
    if ((charCode >= 0x3040 && charCode <= 0x309F) || 
        (charCode >= 0x30A0 && charCode <= 0x30FF)) {
      return 'ja';
    }
    
    // 중국어 (CJK Unified Ideographs)
    if (charCode >= 0x4E00 && charCode <= 0x9FFF) {
      return 'zh';
    }
    
    // 아랍어
    if (charCode >= 0x0600 && charCode <= 0x06FF) {
      return 'ar';
    }
    
    // 러시아어 (키릴 문자)
    if (charCode >= 0x0400 && charCode <= 0x04FF) {
      return 'ru';
    }
    
    return null;
  }

  /**
   * 🔥 스마트 추론 시스템 (컨텍스트 기반)
   */
  private detectBySmartInference(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    const { keycode, keychar } = rawEvent;

    // 🔥 특수키들 처리
    if (this.isSpecialKey(keycode)) {
      return {
        language: this.currentLanguage, // 현재 언어 유지
        confidence: 0.8,
        method: 'inference',
        isComposing: false,
        detectedChar: undefined,
        metadata: {
          keycode,
          keychar,
          reason: 'special-key-maintain-current'
        }
      };
    }

    // 🔥 숫자키 처리 (언어 중립)
    if (this.isNumberKey(keycode)) {
      const numberChar = keychar ? String.fromCharCode(keychar) : undefined;
      return {
        language: this.currentLanguage, // 현재 언어 유지
        confidence: 0.9,
        method: 'inference',
        isComposing: false,
        detectedChar: numberChar,
        metadata: {
          keycode,
          keychar,
          reason: 'number-key-language-neutral'
        }
      };
    }

    // 🔥 기본 추론 (키코드 범위 기반)
    if (keycode >= 16 && keycode <= 50) {
      // 주요 문자 키 범위 - 현재 언어의 확신도 낮춤
      return {
        language: this.currentLanguage,
        confidence: 0.6,
        method: 'inference',
        isComposing: this.currentLanguage === 'ko',
        detectedChar: undefined,
        metadata: {
          keycode,
          keychar,
          reason: 'main-character-key-range-inference'
        }
      };
    }

    // 🔥 최종 폴백
    return {
      language: this.currentLanguage,
      confidence: 0.5,
      method: 'fallback',
      isComposing: false,
      detectedChar: undefined,
      metadata: {
        keycode,
        keychar,
        reason: 'smart-inference-fallback'
      }
    };
  }

  /**
   * 🔥 특수키 체크
   */
  private isSpecialKey(keycode: number): boolean {
    const specialKeys = [
      8,   // Backspace
      9,   // Tab
      13,  // Enter
      16,  // Shift
      17,  // Ctrl
      18,  // Alt
      20,  // Caps Lock
      27,  // Escape
      32,  // Space
      37, 38, 39, 40, // Arrow keys
      112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123 // F1-F12
    ];
    return specialKeys.includes(keycode);
  }

  /**
   * 🔥 숫자키 체크
   */
  private isNumberKey(keycode: number): boolean {
    return (keycode >= 48 && keycode <= 57) || // 0-9
           (keycode >= 96 && keycode <= 105);   // 넘패드 0-9
  }

  /**
   * 🔥 한글 폴백 매핑 (영어 키를 한글로 변환)
   */
  private fallbackToKoreanChar(keycode: number, keychar?: number): string | undefined {
    // 🔥 1순위: keycode 기반 매핑
    if (MACOS_HANGUL_KEYCODES.has(keycode)) {
      return MACOS_HANGUL_KEYCODES.get(keycode);
    }
    
    // 🔥 2순위: 영어 문자를 한글로 매핑 (QWERTY → 두벌식)
    if (keychar) {
      const char = String.fromCharCode(keychar).toLowerCase();
      const qwertyToHangul: Record<string, string> = {
        'q': 'ㅂ', 'w': 'ㅈ', 'e': 'ㄷ', 'r': 'ㄱ', 't': 'ㅅ',
        'y': 'ㅛ', 'u': 'ㅕ', 'i': 'ㅑ', 'o': 'ㅐ', 'p': 'ㅔ',
        'a': 'ㅁ', 's': 'ㄴ', 'd': 'ㅇ', 'f': 'ㄹ', 'g': 'ㅎ',
        'h': 'ㅗ', 'j': 'ㅓ', 'k': 'ㅏ', 'l': 'ㅣ',
        'z': 'ㅋ', 'x': 'ㅌ', 'c': 'ㅊ', 'v': 'ㅍ',
        'b': 'ㅠ', 'n': 'ㅜ', 'm': 'ㅡ'
      };
      
      return qwertyToHangul[char];
    }
    
    return undefined;
  }
}

export const macOSLanguageDetector = new MacOSLanguageDetector();
export default macOSLanguageDetector;
