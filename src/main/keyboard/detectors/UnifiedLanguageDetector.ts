// 🔥 기가차드 통합 언어 감지기 - 플랫폼 자동 감지 및 최적 감지기 선택!

import { BaseManager } from '../../common/BaseManager';
import { Logger } from '../../../shared/logger';
import { Platform } from '../../utils/platform';
import type { UiohookKeyboardEvent, LanguageDetectionResult } from '../../../shared/types';

// 🔥 플랫폼별 감지기들 import
import { LanguageDetectorFactory } from './factory/LanguageDetectorFactory';
import { BaseLanguageDetector } from './base/BaseLanguageDetector';

// 🔥 플랫폼별 구체적 감지기들 import
import { MacOSLanguageDetector } from './macos/MacOSLanguageDetector';
import { WindowsLanguageDetector } from './windows/WindowsLanguageDetector';
import { LinuxLanguageDetector } from './linux/LinuxLanguageDetector';
import { FallbackLanguageDetector } from './FallbackLanguageDetector';

/**
 * 🔥 기가차드 통합 언어 감지기 - Smart Platform Detection!
 * 
 * 플랫폼 자동 감지 후 최적의 언어 감지기를 선택하여 사용
 * - macOS: HIToolbox 기반 네이티브 감지
 * - Windows: Win32 API 기반 키보드 레이아웃 감지  
 * - Linux: IBus/XIM 기반 입력 메서드 감지
 * - 기타: 키코드 패턴 분석 기반 Fallback 감지
 */
export class UnifiedLanguageDetector extends BaseManager {
  private readonly componentName = 'UNIFIED_LANGUAGE_DETECTOR';
  
  // 🔥 플랫폼별 감지기 인스턴스 (팩토리에서 생성)
  private languageDetector: BaseLanguageDetector;
  
  // 🔥 Primary & Fallback 감지기
  private primaryDetector: BaseLanguageDetector;
  private fallbackDetector: BaseLanguageDetector;
  
  // 🔥 현재 플랫폼 정보
  private readonly currentPlatform: string;
  private readonly detectorType: 'macos' | 'windows' | 'linux' | 'fallback';
  
  // 🔥 통합 성능 추적
  private detectionCount = 0;
  private fallbackCount = 0;
  private totalProcessingTime = 0;
  private lastError: string | null = null;
  
  constructor() {
    super();
    
    // 🔥 플랫폼 감지 및 최적 감지기 선택 (팩토리 패턴)
    this.currentPlatform = Platform.getPlatformName();
    
    if (Platform.isMacOS()) {
      this.detectorType = 'macos';
      this.primaryDetector = new MacOSLanguageDetector();
      Logger.info(this.componentName, '🔥 macOS 전용 HIToolbox 감지기 선택됨');
    } else if (Platform.isWindows()) {
      this.detectorType = 'windows';  
      this.primaryDetector = new WindowsLanguageDetector();
      Logger.info(this.componentName, '🔥 Windows 전용 Win32 API 감지기 선택됨');
    } else if (Platform.isLinux()) {
      this.detectorType = 'linux';
      this.primaryDetector = new LinuxLanguageDetector();
      Logger.info(this.componentName, '🔥 Linux 전용 IBus/XIM 감지기 선택됨');
    } else {
      this.detectorType = 'fallback';
      this.primaryDetector = new FallbackLanguageDetector();
      Logger.info(this.componentName, '🔥 범용 Fallback 감지기 선택됨', { 
        platform: this.currentPlatform 
      });
    }
    
    // 🔥 Fallback 감지기는 항상 준비
    this.fallbackDetector = new FallbackLanguageDetector();
    
    // 🔥 언어 감지기는 primary detector로 설정
    this.languageDetector = this.primaryDetector;
  }

  protected async doInitialize(): Promise<void> {
    try {
      Logger.info(this.componentName, '🔥 통합 언어 감지기 초기화 시작', {
        platform: this.currentPlatform,
        detectorType: this.detectorType
      });
      
      // 🔥 Primary 감지기 초기화
      await this.primaryDetector.initialize();
      Logger.info(this.componentName, 'Primary 감지기 초기화 완료');
      
      // 🔥 Fallback 감지기 초기화
      await this.fallbackDetector.initialize();
      Logger.info(this.componentName, 'Fallback 감지기 초기화 완료');
      
      Logger.info(this.componentName, '🔥 통합 언어 감지기 초기화 완료!');
      
    } catch (error) {
      this.lastError = `Initialize failed: ${error}`;
      Logger.error(this.componentName, '통합 언어 감지기 초기화 실패', error);
      throw error;
    }
  }

  protected async doStart(): Promise<void> {
    try {
      Logger.info(this.componentName, '🔥 통합 언어 감지기 시작');
      
      // 🔥 Primary 감지기 시작
      await this.primaryDetector.start();
      Logger.info(this.componentName, 'Primary 감지기 시작됨');
      
      // 🔥 Fallback 감지기 시작  
      await this.fallbackDetector.start();
      Logger.info(this.componentName, 'Fallback 감지기 시작됨');
      
      Logger.info(this.componentName, '🔥 통합 언어 감지기 시작 완료!', {
        platform: this.currentPlatform,
        primaryDetector: this.detectorType
      });
      
    } catch (error) {
      this.lastError = `Start failed: ${error}`;
      Logger.error(this.componentName, '통합 언어 감지기 시작 실패', error);
      throw error;
    }
  }

  protected async doStop(): Promise<void> {
    try {
      Logger.info(this.componentName, '🔥 통합 언어 감지기 중지 시작');
      
      // 🔥 Primary 감지기 중지
      await this.primaryDetector.stop();
      Logger.info(this.componentName, 'Primary 감지기 중지됨');
      
      // 🔥 Fallback 감지기 중지
      await this.fallbackDetector.stop();
      Logger.info(this.componentName, 'Fallback 감지기 중지됨');
      
      Logger.info(this.componentName, '🔥 통합 언어 감지기 중지 완료');
      
    } catch (error) {
      this.lastError = `Stop failed: ${error}`;
      Logger.error(this.componentName, '통합 언어 감지기 중지 실패', error);
      throw error;
    }
  }

  protected async doCleanup(): Promise<void> {
    try {
      Logger.info(this.componentName, '🔥 통합 언어 감지기 정리 시작');
      
      // 🔥 Primary 감지기 정리
      await this.primaryDetector.cleanup();
      Logger.info(this.componentName, 'Primary 감지기 정리됨');
      
      // 🔥 Fallback 감지기 정리
      await this.fallbackDetector.cleanup();
      Logger.info(this.componentName, 'Fallback 감지기 정리됨');
      
      // 🔥 통계 초기화
      this.detectionCount = 0;
      this.fallbackCount = 0;
      this.totalProcessingTime = 0;
      this.lastError = null;
      
      Logger.info(this.componentName, '🔥 통합 언어 감지기 정리 완료');
      
    } catch (error) {
      this.lastError = `Cleanup failed: ${error}`;
      Logger.error(this.componentName, '통합 언어 감지기 정리 실패', error);
      throw error;
    }
  }

  /**
   * 🔥 메인 언어 감지 엔트리포인트 - Smart Detection!
   */
  public async detectLanguage(rawEvent: UiohookKeyboardEvent): Promise<LanguageDetectionResult> {
    const startTime = performance.now();
    this.detectionCount++;
    
    try {
      // 🔥 Primary 감지기로 시도
      let result = await this.primaryDetector.detectLanguage(rawEvent);
      
      // 🔥 Primary 감지기 결과가 불안정하면 Fallback 사용
      if (result.confidence < 0.7 && this.detectorType !== 'fallback') {
        Logger.debug(this.componentName, '🔥 Primary 감지기 신뢰도 낮음 - Fallback 사용', {
          primaryConfidence: result.confidence,
          primaryLanguage: result.language
        });
        
        const fallbackResult = await this.fallbackDetector.detectLanguage(rawEvent);
        this.fallbackCount++;
        
        // 🔥 더 높은 신뢰도 결과 선택
        if (fallbackResult.confidence > result.confidence) {
          result = {
            ...fallbackResult,
            metadata: {
              ...fallbackResult.metadata,
              usedFallback: true,
              primaryConfidence: result.confidence,
              fallbackConfidence: fallbackResult.confidence
            }
          };
        }
      }
      
      // 🔥 성능 추적
      const processingTime = performance.now() - startTime;
      this.totalProcessingTime += processingTime;
      
      // 🔥 결과에 통합 정보 추가
      return {
        ...result,
        metadata: {
          ...result.metadata,
          unifiedDetector: {
            platform: this.currentPlatform,
            detectorType: this.detectorType,
            processingTime: `${processingTime.toFixed(3)}ms`,
            detectionCount: this.detectionCount,
            fallbackCount: this.fallbackCount
          }
        }
      };
      
    } catch (error) {
      this.lastError = `Detection failed: ${error}`;
      Logger.error(this.componentName, '언어 감지 실패 - Fallback으로 전환', error);
      
      // 🔥 에러 시 Fallback 감지기 사용
      try {
        const fallbackResult = await this.fallbackDetector.detectLanguage(rawEvent);
        this.fallbackCount++;
        
        return {
          ...fallbackResult,
          metadata: {
            ...fallbackResult.metadata,
            usedFallback: true,
            primaryError: String(error),
            unifiedDetector: {
              platform: this.currentPlatform,
              detectorType: 'fallback-error',
              processingTime: `${(performance.now() - startTime).toFixed(3)}ms`,
              detectionCount: this.detectionCount,
              fallbackCount: this.fallbackCount
            }
          }
        };
        
      } catch (fallbackError) {
        this.lastError = `Both detectors failed: ${fallbackError}`;
        Logger.error(this.componentName, 'Fallback 감지기도 실패', fallbackError);
        
        // 🔥 최종 에러 결과
        return {
          language: 'en',
          confidence: 0.1,
          method: 'fallback',
          isComposing: false,
          metadata: {
            error: String(fallbackError),
            primaryError: String(error),
            unifiedDetector: {
              platform: this.currentPlatform,
              detectorType: 'error',
              processingTime: `${(performance.now() - startTime).toFixed(3)}ms`,
              detectionCount: this.detectionCount,
              fallbackCount: this.fallbackCount
            }
          }
        };
      }
    }
  }

  /**
   * 🔥 현재 언어 조회 - Primary 감지기 기준
   */
  public getCurrentLanguage(): 'ko' | 'en' | 'ja' | 'zh' {
    return this.primaryDetector.getCurrentLanguage();
  }

  /**
   * 🔥 언어 수동 설정 - 모든 감지기에 적용
   */
  public setLanguage(language: 'ko' | 'en' | 'ja' | 'zh'): void {
    this.primaryDetector.setLanguage(language);
    this.fallbackDetector.setLanguage(language);
    Logger.info(this.componentName, '🔥 통합 언어 설정 완료', { language });
  }

  /**
   * 🔥 통합 성능 통계 조회
   */
  public getPerformanceStats(): {
    platform: string;
    detectorType: 'macos' | 'windows' | 'linux' | 'fallback';
    detectionCount: number;
    fallbackCount: number;
    fallbackRate: number;
    averageProcessingTime: number;
    currentLanguage: 'ko' | 'en' | 'ja' | 'zh';
    primaryStats: any;
    fallbackStats: any;
  } {
    return {
      platform: this.currentPlatform,
      detectorType: this.detectorType,
      detectionCount: this.detectionCount,
      fallbackCount: this.fallbackCount,
      fallbackRate: this.detectionCount > 0 ? (this.fallbackCount / this.detectionCount) * 100 : 0,
      averageProcessingTime: this.detectionCount > 0 ? 
        this.totalProcessingTime / this.detectionCount : 0,
      currentLanguage: this.getCurrentLanguage(),
      primaryStats: this.primaryDetector.getPerformanceStats(),
      fallbackStats: this.fallbackDetector.getPerformanceStats()
    };
  }

  /**
   * 🔥 통합 헬스체크
   */
  public async healthCheck(): Promise<{
    healthy: boolean;
    uptime?: number;
    lastError?: string;
    platform: string;
    detectorType: 'macos' | 'windows' | 'linux' | 'fallback';
    primaryHealth: any;
    fallbackHealth: any;
    performance: ReturnType<UnifiedLanguageDetector['getPerformanceStats']>;
  }> {
    try {
      const [primaryHealth, fallbackHealth] = await Promise.all([
        this.primaryDetector.healthCheck(),
        this.fallbackDetector.healthCheck()
      ]);
      
      const healthy = primaryHealth.healthy && fallbackHealth.healthy;
      
      return {
        healthy,
        lastError: this.lastError || undefined,
        platform: this.currentPlatform,
        detectorType: this.detectorType,
        primaryHealth,
        fallbackHealth,
        performance: this.getPerformanceStats()
      };
      
    } catch (error) {
      this.lastError = `Health check failed: ${error}`;
      return {
        healthy: false,
        lastError: this.lastError || undefined,
        platform: this.currentPlatform,
        detectorType: this.detectorType,
        primaryHealth: { healthy: false, lastError: String(error) },
        fallbackHealth: { healthy: false, lastError: String(error) },
        performance: this.getPerformanceStats()
      };
    }
  }

  /**
   * 🔥 Primary 감지기 강제 재시작
   */
  public async restartPrimaryDetector(): Promise<void> {
    try {
      Logger.info(this.componentName, '🔥 Primary 감지기 재시작 시작');
      
      await this.primaryDetector.stop();
      await this.primaryDetector.cleanup();
      await this.primaryDetector.initialize();
      await this.primaryDetector.start();
      
      Logger.info(this.componentName, '🔥 Primary 감지기 재시작 완료');
      
    } catch (error) {
      this.lastError = `Primary detector restart failed: ${error}`;
      Logger.error(this.componentName, 'Primary 감지기 재시작 실패', error);
      throw error;
    }
  }

  /**
   * 🔥 감지기 유형 정보 조회
   */
  public getDetectorInfo(): {
    platform: string;
    detectorType: 'macos' | 'windows' | 'linux' | 'fallback';
    primaryDetectorName: string;
    fallbackDetectorName: string;
    isNativeDetection: boolean;
  } {
    return {
      platform: this.currentPlatform,
      detectorType: this.detectorType,
      primaryDetectorName: this.primaryDetector.constructor.name,
      fallbackDetectorName: this.fallbackDetector.constructor.name,
      isNativeDetection: this.detectorType === 'macos' || this.detectorType === 'windows' || this.detectorType === 'linux'
    };
  }
}

export const unifiedLanguageDetector = new UnifiedLanguageDetector();
export default unifiedLanguageDetector;
