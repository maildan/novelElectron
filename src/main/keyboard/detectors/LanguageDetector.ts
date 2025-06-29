// 🔥 기가차드 언어 감지기 - 스마트 다국어 감지 시스템!

import { Logger } from '../../../shared/logger';
import { BaseManager } from '../../common/BaseManager';
import { KEYBOARD_LANGUAGES } from '../../../shared/common';
import { HANGUL_KEY_MAP } from '../constants';

// 🔥 기가차드 타입 import
import type { UiohookKeyboardEvent, LanguageDetectionResult } from '../../../shared/types';

// #DEBUG: Language detector entry point
Logger.debug('LANGUAGE_DETECTOR', 'Language detector module loaded');

/**
 * 🔥 LanguageDetector - 고도화된 언어 감지 시스템
 * 키 패턴, IME 상태, 문자 범위를 종합적으로 분석하여 정확한 언어 감지
 */
export class LanguageDetector extends BaseManager {
  private readonly componentName = 'LANGUAGE_DETECTOR';
  
  // 현재 상태
  private currentLanguage = 'en'; // 기본값은 영어
  private keySequence: string[] = []; // 최근 키 시퀀스
  private englishKeyCount = 0; // 연속 영어 키 카운트
  
  // 설정
  private readonly maxSequenceLength = 20;
  private readonly englishSwitchThreshold = 5; // 영어 전환 임계값
  
  constructor() {
    super({
      name: 'LanguageDetector',
      autoStart: true,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000,
    });
  }

  /**
   * BaseManager 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'Initializing language detector');
  }

  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'Starting language detector');
  }

  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'Stopping language detector');
  }

  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'Cleaning up language detector');
    this.keySequence = [];
  }

  /**
   * 🔥 메인 언어 감지 메서드 - 완전히 새로운 로직!
   */
  public detectLanguage(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    try {
      const { keycode } = rawEvent; // 🔥 keychar 제거 - uiohook-napi에 없음
      
      Logger.debug(this.componentName, '🔍 Advanced language detection started', {
        keycode,
        currentLanguage: this.currentLanguage,
        keycodeChar: String.fromCharCode(keycode || 0)
      });
      
      // 🔥 1️⃣ 직접 문자 코드 감지 (최고 우선순위)
      const directResult = this.detectByCharacterCode(rawEvent);
      if (directResult.confidence > 0.9) {
        Logger.info(this.componentName, '✅ High confidence character detection', directResult);
        this.updateLanguageState(directResult.language);
        return directResult;
      }
      
      // 🔥 2️⃣ IME 상태 기반 감지
      const imeResult = this.detectByIMEState(rawEvent);
      if (imeResult.confidence > 0.8) {
        Logger.info(this.componentName, '✅ IME state detection', imeResult);
        this.updateLanguageState(imeResult.language);
        return imeResult;
      }
      
      // 🔥 3️⃣ 키 패턴 분석 감지
      this.updateKeySequence(keycode); // 🔥 keychar 제거
      const patternResult = this.detectByKeyPattern(rawEvent);
      if (patternResult.confidence > 0.7) {
        Logger.info(this.componentName, '✅ Pattern detection', patternResult);
        this.updateLanguageState(patternResult.language);
        return patternResult;
      }
      
      // 🔥 4️⃣ 언어 전환 감지 (영어 키 연속 입력 체크)
      const switchResult = this.detectLanguageSwitch(rawEvent);
      if (switchResult.confidence > 0.6) {
        Logger.info(this.componentName, '✅ Language switch detected', switchResult);
        this.updateLanguageState(switchResult.language);
        return switchResult;
      }
      
      // 🔥 5️⃣ 현재 언어 유지 (하지만 조건부)
      const currentResult = this.validateCurrentLanguage(rawEvent);
      if (currentResult.confidence > 0.5) {
        Logger.debug(this.componentName, '✅ Current language maintained', currentResult);
        return currentResult;
      }
      
      // 🔥 6️⃣ 최종 fallback
      const fallbackResult: LanguageDetectionResult = {
        language: 'en', // 🔥 기본값은 영어로 변경!
        confidence: 0.3,
        method: 'fallback',
        isComposing: false
      };
      
      Logger.warn(this.componentName, '⚠️ Using fallback language detection', {
        keycode,
        result: fallbackResult
      });
      
      return fallbackResult;
      
    } catch (error) {
      Logger.error(this.componentName, 'Language detection failed', error);
      return {
        language: 'en',
        confidence: 0.1,
        method: 'fallback',
        isComposing: false
      };
    }
  }

  /**
   * 🔥 1️⃣ 직접 문자 코드 감지 - uiohook-napi 한계 인정
   * 웹 검색 결과: uiohook-napi는 keychar를 제공하지 않음!
   * 따라서 keycode 기반 언어 추론으로 변경
   */
  private detectByCharacterCode(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    const { keycode } = rawEvent;
    
    if (!keycode) {
      return { 
        language: this.currentLanguage, 
        confidence: 0, 
        method: 'character', 
        isComposing: false,
        metadata: { keycodeChar: 'unknown' }
      };
    }
    
    const keycodeChar = String.fromCharCode(keycode);
    
    // 🔥 현실적 접근: keycode 범위로 언어 추론
    // A-Z 범위 (65-90): 잠재적 영어 또는 한글
    if (keycode >= 65 && keycode <= 90) {
      
      // 한글 키 매핑 확인 (QWERTY → 한글)
      const hangulMapping = this.getHangulMapping(keycodeChar.toLowerCase());
      if (hangulMapping) {
        return {
          language: 'ko',
          confidence: 0.8, // keychar 없이는 높은 신뢰도 불가
          method: 'character',
          isComposing: true,
          metadata: { 
            hangulChar: hangulMapping,
            keycodeChar,
            detectedLanguage: 'ko'
          }
        };
      }
      
      // 영어 키로 판단
      return {
        language: 'en',
        confidence: 0.7,
        method: 'character',
        isComposing: false,
        metadata: { 
          keycodeChar,
          detectedLanguage: 'en'
        }
      };
    }
    
    // 숫자 키 (48-57): 언어 중립적
    if (keycode >= 48 && keycode <= 57) {
      return { 
        language: this.currentLanguage, 
        confidence: 0.3, 
        method: 'character', 
        isComposing: false,
        metadata: { keycodeChar }
      };
    }
    
    // 공백, 특수문자 등: 언어 유지
    return { 
      language: this.currentLanguage, 
      confidence: 0.2, 
      method: 'character', 
      isComposing: false,
      metadata: { keycodeChar }
    };
  }

  /**
   * 🔥 2️⃣ IME 상태 기반 감지 - 현실적 접근법
   */
  private detectByIMEState(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    const { keycode } = rawEvent;
    
    // A-Z 키만 체크
    if (keycode < 65 || keycode > 90) {
      return { language: this.currentLanguage, confidence: 0, method: 'ime', isComposing: false };
    }
    
    const pressedKey = String.fromCharCode(keycode).toLowerCase();
    
    // 한글 키 매핑 체크
    const hangulChar = this.getHangulMapping(pressedKey);
    if (hangulChar) {
      // 🔥 실제 IME 상태는 감지 불가하므로 한글 키 매핑으로 추론
      return {
        language: 'ko',
        confidence: 0.8,
        method: 'ime',
        isComposing: true,
        metadata: {
          hangulChar,
          keycodeChar: pressedKey
        }
      };
    }
    
    return { language: this.currentLanguage, confidence: 0, method: 'ime', isComposing: false };
  }

  /**
   * 🔥 3️⃣ 키 패턴 분석 감지
   */
  private detectByKeyPattern(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    if (this.keySequence.length < 3) {
      return { language: this.currentLanguage, confidence: 0, method: 'pattern', isComposing: false };
    }
    
    const recentKeys = this.keySequence.slice(-5).join('');
    
    // 한글 패턴 분석
    let hangulScore = 0;
    for (const key of recentKeys) {
      if (this.getHangulMapping(key)) {
        hangulScore += 0.2;
      }
    }
    
    if (hangulScore > 0.6) {
      return {
        language: 'ko',
        confidence: hangulScore,
        method: 'pattern',
        isComposing: true
      };
    }
    
    return { language: this.currentLanguage, confidence: 0, method: 'pattern', isComposing: false };
  }

  /**
   * 🔥 4️⃣ 언어 전환 감지
   */
  private detectLanguageSwitch(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    const { keycode } = rawEvent;
    
    // 영어 키 체크 (A-Z)
    if (keycode >= 65 && keycode <= 90) {
      const pressedKey = String.fromCharCode(keycode).toLowerCase();
      
      // 한글 키가 아니면 영어 가능성 높음
      if (!this.getHangulMapping(pressedKey)) {
        this.englishKeyCount++;
        
        // 연속으로 영어 키를 입력하면 영어로 전환
        if (this.englishKeyCount >= this.englishSwitchThreshold && this.currentLanguage !== 'en') {
          Logger.info(this.componentName, '🔄 Language switch to English detected', {
            englishKeyCount: this.englishKeyCount,
            threshold: this.englishSwitchThreshold
          });
          
          return {
            language: 'en',
            confidence: 0.8,
            method: 'pattern',
            isComposing: false
          };
        }
      } else {
        // 한글 키이면 영어 카운트 리셋
        this.englishKeyCount = 0;
      }
    }
    
    return { language: this.currentLanguage, confidence: 0, method: 'pattern', isComposing: false };
  }

  /**
   * 🔥 5️⃣ 현재 언어 유지 검증
   */
  private validateCurrentLanguage(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    // 현재 언어가 적절한지 검증
    const isValid = this.isCurrentLanguageValid(rawEvent);
    
    if (isValid) {
      return {
        language: this.currentLanguage,
        confidence: 0.6,
        method: 'fallback',
        isComposing: this.isIMEComposing(rawEvent)
      };
    }
    
    return { language: this.currentLanguage, confidence: 0, method: 'fallback', isComposing: false };
  }

  /**
   * 🔥 유틸리티 메서드들
   */
  private updateKeySequence(keycode: number): void {
    const keyString = String.fromCharCode(keycode).toLowerCase(); // 🔥 keychar 제거, keycode만 사용
    
    this.keySequence.push(keyString);
    if (this.keySequence.length > this.maxSequenceLength) {
      this.keySequence.shift();
    }
  }

  private updateLanguageState(language: string): void {
    if (language !== this.currentLanguage) {
      Logger.info(this.componentName, '🔄 Language changed', {
        from: this.currentLanguage,
        to: language
      });
      
      this.currentLanguage = language;
      this.englishKeyCount = 0; // 언어 변경 시 영어 카운트 리셋
    }
  }

  private getHangulMapping(key: string): string | undefined {
    // 🔥 이제 HANGUL_KEY_MAP이 영어→한글 구조이므로 직접 접근
    return HANGUL_KEY_MAP[key.toLowerCase() as keyof typeof HANGUL_KEY_MAP];
  }

  private isIMEComposing(rawEvent: UiohookKeyboardEvent): boolean {
    const { keycode } = rawEvent;
    
    // 🔥 uiohook-napi는 IME 상태를 직접 감지할 수 없음
    // 한글 키 매핑이 있으면 IME 가능성 높음
    if (keycode >= 65 && keycode <= 90) {
      const pressedKey = String.fromCharCode(keycode).toLowerCase();
      return !!this.getHangulMapping(pressedKey);
    }
    
    return false;
  }

  private isCurrentLanguageValid(rawEvent: UiohookKeyboardEvent): boolean {
    // 현재 언어 설정이 입력 패턴과 일치하는지 검증
    const directResult = this.detectByCharacterCode(rawEvent);
    
    if (directResult.confidence > 0.5) {
      return directResult.language === this.currentLanguage;
    }
    
    return true; // 확실하지 않으면 현재 언어 유지
  }

  /**
   * 🔥 공개 API 메서드들
   */
  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  public setLanguage(language: string): void {
    if (this.currentLanguage !== language) {
      Logger.info(this.componentName, '🔧 Language manually set', {
        from: this.currentLanguage,
        to: language
      });
      
      this.currentLanguage = language;
      this.englishKeyCount = 0;
    }
  }

  public resetDetection(): void {
    Logger.info(this.componentName, '🔄 Detection state reset');
    
    this.currentLanguage = 'en';
    this.keySequence = [];
    this.englishKeyCount = 0;
  }

  public getDetectionStats(): any {
    return {
      currentLanguage: this.currentLanguage,
      sequenceLength: this.keySequence.length,
      englishKeyCount: this.englishKeyCount
    };
  }
}

// 🔥 기가차드 전역 언어 감지기
export const languageDetector = new LanguageDetector();

// #DEBUG: Language detector module exit point
Logger.debug('LANGUAGE_DETECTOR', 'Language detector module setup complete');

export default languageDetector;
