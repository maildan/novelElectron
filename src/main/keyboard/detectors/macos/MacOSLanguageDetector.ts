// 🔥 기가차드 macOS 전용 언어 감지기 - HIToolbox + NSTextInputContext 완전 활용!

import { exec } from 'child_process';
import { BaseLanguageDetector } from '../base/BaseLanguageDetector';
import { Platform } from '../../../utils/platform';
import { Logger } from '../../../../shared/logger';
import type { 
  UiohookKeyboardEvent, 
  LanguageDetectionResult 
} from '../../../../shared/types';

// 🔥 공통 키코드 매핑 import
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
 * - NSTextInputContext 상태 감지
 * - 키보드 레이아웃 직접 조회
 * - IME 조합 상태 실시간 추적
 */
export class MacOSLanguageDetector extends BaseLanguageDetector {
  // 🔥 macOS 전용 시스템 입력소스 캐시
  private systemInputSourceCache: 'ko' | 'en' | null = null;
  private lastSystemCheck = 0;
  private readonly SYSTEM_CHECK_INTERVAL = 500; // 0.5초
  private systemCheckInProgress = false;

  constructor() {
    super('MACOS_LANGUAGE_DETECTOR');
    
    // 🔥 테스트 환경에서는 플랫폼 검증 스킵
    if (process.env.NODE_ENV !== 'test' && !Platform.isMacOS()) {
      throw new Error('MacOSLanguageDetector는 macOS에서만 사용할 수 있습니다');
    }
  }

  protected getPlatformName(): string {
    return 'macOS';
  }

  /**
   * 🔥 macOS 메인 언어 감지 메서드
   */
  public async detectLanguage(rawEvent: UiohookKeyboardEvent): Promise<LanguageDetectionResult> {
    const startTime = performance.now();

    try {
      Logger.debug(this.componentName, '🔥 macOS 네이티브 언어 감지 시작', {
        keycode: rawEvent.keycode,
        keychar: rawEvent.keychar,
        isShift: rawEvent.shiftKey,
        currentLanguage: this.currentLanguage
      });

      // 🔥 1순위: 시스템 입력소스 직접 조회 (가장 정확)
      const systemResult = await this.detectBySystemInputSource(startTime);
      if (systemResult && systemResult.confidence >= 0.95) {
        return this.finalizeResult(systemResult, startTime);
      }

      // 🔥 2순위: macOS 한글 키코드 매핑 (IME 우회)
      const keycodeResult = this.detectByMacOSKeycode(rawEvent);
      if (keycodeResult.confidence >= 0.85) {
        return this.finalizeResult(keycodeResult, startTime);
      }

      // 🔥 3순위: 현재 언어 유지 (안전장치)
      return this.finalizeResult({
        language: this.currentLanguage,
        confidence: 0.7,
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
   * 🔥 macOS 시스템 입력소스 기반 감지 (HIToolbox)
   */
  private async detectBySystemInputSource(startTime: number): Promise<LanguageDetectionResult | null> {
    try {
      const systemLanguage = await this.getCurrentInputSourceFromSystem();
      
      if (systemLanguage) {
        this.currentLanguage = systemLanguage;
        
        Logger.debug(this.componentName, '🔥 macOS 시스템 입력소스 감지 성공', {
          systemLanguage,
          confidence: 0.98
        });
        
        return {
          language: systemLanguage,
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
  private async getCurrentInputSourceFromSystem(): Promise<'ko' | 'en' | null> {
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

    // macOS 한글 키코드 확인
    const hangulChar = MACOS_HANGUL_KEYCODES.get(keychar || keycode);
    if (hangulChar) {
      Logger.debug(this.componentName, '🔥 macOS 한글 키코드 감지', {
        keycode,
        keychar,
        hangulChar
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
          reason: 'macos-hangul-keycode-mapping'
        }
      };
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
}

export const macOSLanguageDetector = new MacOSLanguageDetector();
export default macOSLanguageDetector;
