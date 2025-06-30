// 🔥 기가차드 macOS 전용 입력소스 감지기 - HIToolbox 네이티브 활용!
import { exec } from 'child_process';
import { Logger } from '../../../shared/logger';
import { BaseManager } from '../../common/BaseManager';
import { UiohookKeyboardEvent, LanguageDetectionResult } from '../../../shared/types';

/**
 * 🔥 macOS 전용 입력소스 감지기
 * HIToolbox TISCopyCurrentKeyboardInputSource 기반 완벽한 감지
 */
export class MacOSInputSourceDetector extends BaseManager {
  private readonly componentName = 'MACOS_INPUT_SOURCE_DETECTOR';
  
  // 🔥 상태 관리
  private currentLanguage: 'ko' | 'en' | 'ja' | 'zh' = 'en';
  private detectorInitialized = false;
  private lastSystemCheck = 0;
  private readonly SYSTEM_CHECK_INTERVAL = 1000; // 1초 간격으로 체크
  
  // 🔥 성능 캐시
  private inputSourceCache: {
    language: 'ko' | 'en' | 'ja' | 'zh';
    timestamp: number;
    inputSourceId: string;
  } | null = null;
  
  // 🔥 감지 카운터
  private detectionCount = 0;
  private systemCallCount = 0;
  
  constructor() {
    super({
      name: 'MacOSInputSourceDetector',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000,
    });
  }

  protected async doInitialize(): Promise<void> {
    try {
      // 🔥 시스템 감지 초기화
      await this.detectCurrentInputSource();
      this.detectorInitialized = true;
      
      Logger.info(this.componentName, '🔥 macOS 입력소스 감지기 초기화 완료', {
        initialLanguage: this.currentLanguage,
        cacheEnabled: true
      });
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'macOS 입력소스 감지기 초기화 실패', err);
      throw err;
    }
  }

  protected async doStart(): Promise<void> {
    try {
      await this.detectCurrentInputSource();
      Logger.info(this.componentName, '🔥 macOS 입력소스 감지기 시작됨');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'macOS 입력소스 감지기 시작 실패', err);
      throw err;
    }
  }

  protected async doStop(): Promise<void> {
    this.inputSourceCache = null;
    Logger.info(this.componentName, '🔥 macOS 입력소스 감지기 중지됨');
  }

  protected async doCleanup(): Promise<void> {
    this.inputSourceCache = null;
    this.currentLanguage = 'en';
    this.detectorInitialized = false;
    Logger.info(this.componentName, 'macOS 입력소스 감지기 정리 완료');
  }

  /**
   * 🔥 메인 언어 감지 메서드 - macOS HIToolbox 기반
   */
  public async detectLanguage(rawEvent: UiohookKeyboardEvent): Promise<LanguageDetectionResult> {
    const startTime = performance.now();
    this.detectionCount++;
    
    try {
      // 🔥 캐시된 입력소스 확인
      const cachedResult = this.getCachedInputSource();
      if (cachedResult) {
        return this.createResult(cachedResult.language, 0.98, 'system-cache', startTime);
      }
      
      // 🔥 시스템 입력소스 실시간 감지
      const detectedLanguage = await this.detectCurrentInputSource();
      
      if (detectedLanguage) {
        this.currentLanguage = detectedLanguage;
        return this.createResult(detectedLanguage, 0.98, 'system-native', startTime);
      }
      
      // 🔥 폴백: 현재 언어 유지
      return this.createResult(this.currentLanguage, 0.7, 'fallback', startTime);
      
    } catch (error) {
      Logger.error(this.componentName, 'macOS 언어 감지 오류', error);
      return this.createResult(this.currentLanguage, 0.5, 'error-fallback', startTime);
    }
  }

  /**
   * 🔥 HIToolbox 기반 현재 입력소스 감지
   */
  private async detectCurrentInputSource(): Promise<'ko' | 'en' | 'ja' | 'zh' | null> {
    const now = Date.now();
    
    // 🔥 너무 자주 호출 방지
    if (now - this.lastSystemCheck < this.SYSTEM_CHECK_INTERVAL) {
      return this.currentLanguage;
    }
    
    this.lastSystemCheck = now;
    this.systemCallCount++;
    
    try {
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          Logger.warn(this.componentName, 'HIToolbox 호출 타임아웃');
          resolve(null);
        }, 2000); // 2초 타임아웃

        // 🔥 macOS HIToolbox 입력소스 감지 명령어
        exec('defaults read com.apple.HIToolbox AppleCurrentKeyboardLayoutInputSourceID', 
          (error, stdout) => {
            clearTimeout(timeout);
            
            if (error) {
              Logger.debug(this.componentName, 'HIToolbox 명령어 실행 오류', { error: error.message });
              resolve(null);
              return;
            }

            const inputSourceId = stdout.trim();
            const detectedLanguage = this.parseInputSourceId(inputSourceId);
            
            // 🔥 캐시 업데이트
            this.inputSourceCache = {
              language: detectedLanguage,
              timestamp: now,
              inputSourceId
            };
            
            Logger.debug(this.componentName, '🔥 macOS 입력소스 감지 성공', {
              inputSourceId,
              detectedLanguage,
              systemCallCount: this.systemCallCount,
              cacheUpdated: true
            });

            resolve(detectedLanguage);
          });
      });
    } catch (error) {
      Logger.error(this.componentName, 'HIToolbox 시스템 호출 오류', error);
      return null;
    }
  }

  /**
   * 🔥 입력소스 ID를 언어로 파싱
   */
  private parseInputSourceId(inputSourceId: string): 'ko' | 'en' | 'ja' | 'zh' {
    const lowerCaseId = inputSourceId.toLowerCase();
    
    // 🔥 한국어 입력소스 감지
    if (lowerCaseId.includes('hangul') || 
        lowerCaseId.includes('korean') || 
        lowerCaseId.includes('2sethangul') ||
        lowerCaseId.includes('3sethangul') ||
        lowerCaseId.includes('390hangul')) {
      return 'ko';
    }
    
    // 🔥 일본어 입력소스 감지
    if (lowerCaseId.includes('japanese') || 
        lowerCaseId.includes('hiragana') ||
        lowerCaseId.includes('katakana') ||
        lowerCaseId.includes('romaji')) {
      return 'ja';
    }
    
    // 🔥 중국어 입력소스 감지
    if (lowerCaseId.includes('chinese') || 
        lowerCaseId.includes('pinyin') ||
        lowerCaseId.includes('traditional') ||
        lowerCaseId.includes('simplified')) {
      return 'zh';
    }
    
    // 🔥 기본값: 영어
    return 'en';
  }

  /**
   * 🔥 캐시된 입력소스 조회
   */
  private getCachedInputSource(): { language: 'ko' | 'en' | 'ja' | 'zh' } | null {
    if (!this.inputSourceCache) {
      return null;
    }
    
    const now = Date.now();
    const cacheAge = now - this.inputSourceCache.timestamp;
    
    // 🔥 캐시가 1초 이내면 사용
    if (cacheAge < this.SYSTEM_CHECK_INTERVAL) {
      return { language: this.inputSourceCache.language };
    }
    
    return null;
  }

  /**
   * 🔥 결과 객체 생성
   */
  private createResult(
    language: 'ko' | 'en' | 'ja' | 'zh',
    confidence: number,
    method: string,
    startTime: number
  ): LanguageDetectionResult {
    const processingTime = performance.now() - startTime;
    
    return {
      language,
      confidence,
      method: 'keycode' as const, // 🔥 타입 호환성을 위해 keycode 사용
      isComposing: language === 'ko', // 🔥 한국어일 때만 조합 모드
      metadata: {
        hangulChar: undefined,
        reason: `${method}-hiToolbox`,
        keycode: 0,
        keychar: 0
      }
    };
  }

  /**
   * 🔥 수동 언어 설정
   */
  public setLanguage(language: 'ko' | 'en' | 'ja' | 'zh'): void {
    this.currentLanguage = language;
    
    // 🔥 캐시도 업데이트
    this.inputSourceCache = {
      language,
      timestamp: Date.now(),
      inputSourceId: `manual.${language}`
    };
    
    Logger.info(this.componentName, '🔥 언어 수동 설정', { language });
  }

  /**
   * 🔥 현재 언어 조회
   */
  public getCurrentLanguage(): 'ko' | 'en' | 'ja' | 'zh' {
    return this.currentLanguage;
  }

  /**
   * 🔥 성능 통계 조회
   */
  public getPerformanceStats(): {
    detectionCount: number;
    systemCallCount: number;
    cacheHitRate: number;
    currentLanguage: 'ko' | 'en' | 'ja' | 'zh';
    isInitialized: boolean;
    lastCacheUpdate: number | null;
  } {
    const cacheHits = this.detectionCount - this.systemCallCount;
    const cacheHitRate = this.detectionCount > 0 ? (cacheHits / this.detectionCount) * 100 : 0;
    
    return {
      detectionCount: this.detectionCount,
      systemCallCount: this.systemCallCount,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      currentLanguage: this.currentLanguage,
      isInitialized: this.detectorInitialized,
      lastCacheUpdate: this.inputSourceCache?.timestamp || null
    };
  }

  /**
   * 🔥 헬스체크
   */
  public async healthCheck(): Promise<{
    healthy: boolean;
    uptime?: number;
    lastError?: string;
    performance: {
      detectionCount: number;
      systemCallCount: number;
      cacheHitRate: number;
      currentLanguage: 'ko' | 'en' | 'ja' | 'zh';
      isInitialized: boolean;
      lastCacheUpdate: number | null;
    };
  }> {
    try {
      // 🔥 시스템 감지 테스트
      const testResult = await this.detectCurrentInputSource();
      const isHealthy = testResult !== null && this.detectorInitialized;
      
      return {
        healthy: isHealthy,
        uptime: Date.now(),
        performance: this.getPerformanceStats()
      };
    } catch (error) {
      return {
        healthy: false,
        lastError: (error as Error).message,
        performance: this.getPerformanceStats()
      };
    }
  }

  /**
   * 🔥 강제 캐시 갱신
   */
  public async refreshCache(): Promise<void> {
    this.inputSourceCache = null;
    this.lastSystemCheck = 0;
    await this.detectCurrentInputSource();
    Logger.info(this.componentName, '🔥 입력소스 캐시 강제 갱신 완료');
  }
}

export const macOSInputSourceDetector = new MacOSInputSourceDetector();
export default macOSInputSourceDetector;
