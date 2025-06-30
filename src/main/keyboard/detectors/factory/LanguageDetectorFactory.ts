// 🔥 기가차드 언어 감지기 팩토리 - 플랫폼별 자동 선택!

import { Platform } from '../../../utils/platform';
import { Logger } from '../../../../shared/logger';
import { BaseLanguageDetector } from '../base/BaseLanguageDetector';

// 🔥 플랫폼별 언어 감지기 Import (동적 로딩)
import { MacOSLanguageDetector } from '../macos/MacOSLanguageDetector';
import { WindowsLanguageDetector } from '../windows/WindowsLanguageDetector';
import { LinuxLanguageDetector } from '../linux/LinuxLanguageDetector';
import { FallbackLanguageDetector } from '../FallbackLanguageDetector';

/**
 * 🔥 LanguageDetectorFactory - 플랫폼별 최적 언어 감지기 자동 선택
 * 
 * 단 하나의 역할: 현재 플랫폼에 최적화된 언어 감지기를 생성
 * - macOS: HIToolbox 기반 네이티브 감지
 * - Windows: Win32 API 기반 키보드 레이아웃 감지  
 * - Linux: IBus/XIM 기반 입력 메서드 감지
 * - Fallback: 키코드 패턴 분석 기반 범용 감지
 */
export class LanguageDetectorFactory {
  private static readonly componentName = 'LANGUAGE_DETECTOR_FACTORY';
  private static instance: BaseLanguageDetector | null = null;
  private static createdAt: Date | undefined;

  /**
   * 🔥 플랫폼별 최적 언어 감지기 생성 (Singleton)
   */
  public static create(): BaseLanguageDetector {
    if (this.instance) {
      return this.instance;
    }

    Logger.info(this.componentName, '🔥 플랫폼 감지 및 언어 감지기 생성 시작', {
      platform: Platform.getPlatformName(),
      arch: process.arch
    });

    try {
      // 🔥 플랫폼별 최적 감지기 선택
      if (Platform.isMacOS()) {
        this.instance = new MacOSLanguageDetector();
        Logger.info(this.componentName, '✅ macOS HIToolbox 언어 감지기 생성됨');
      } else if (Platform.isWindows()) {
        this.instance = new WindowsLanguageDetector();
        Logger.info(this.componentName, '✅ Windows Win32 API 언어 감지기 생성됨');
      } else if (Platform.isLinux()) {
        this.instance = new LinuxLanguageDetector();
        Logger.info(this.componentName, '✅ Linux IBus/XIM 언어 감지기 생성됨');
      } else {
        this.instance = new FallbackLanguageDetector();
        Logger.warn(this.componentName, '⚠️ 알 수 없는 플랫폼, Fallback 감지기 사용', {
          platform: process.platform
        });
      }

      this.createdAt = new Date();
      
      Logger.info(this.componentName, '🎯 언어 감지기 생성 완료', {
        detectorType: this.instance.constructor.name,
        platform: Platform.getPlatformName(),
        createdAt: this.createdAt
      });

      return this.instance;

    } catch (error) {
      Logger.error(this.componentName, '❌ 언어 감지기 생성 실패, Fallback 사용', {
        error: String(error)
      });
      
      // 실패 시 Fallback 감지기 사용
      this.instance = new FallbackLanguageDetector();
      this.createdAt = new Date();
      return this.instance;
    }
  }

  /**
   * 🔥 현재 언어 감지기 인스턴스 반환 (생성되지 않았으면 생성)
   */
  public static getInstance(): BaseLanguageDetector {
    return this.instance || this.create();
  }

  /**
   * 🔥 언어 감지기 강제 재생성 (플랫폼 변경 시 사용)
   */
  public static recreate(): BaseLanguageDetector {
    if (this.instance) {
      Logger.info(this.componentName, '기존 언어 감지기 정리 후 재생성');
      // 기존 인스턴스 정리
      this.instance.cleanup?.();
    }
    
    this.instance = null;
    this.createdAt = undefined;
    return this.create();
  }

  /**
   * 🔥 팩토리 정보 반환
   */
  public static getInfo(): {
    platform: string;
    detectorType: string;
    isInitialized: boolean;
    createdAt?: Date;
  } {
    return {
      platform: Platform.getPlatformName(),
      detectorType: this.instance?.constructor.name || 'Not Created',
      isInitialized: this.instance !== null,
      createdAt: this.createdAt
    };
  }

  /**
   * 🔥 팩토리 리셋 (테스트용)
   */
  public static reset(): void {
    if (this.instance) {
      this.instance.cleanup?.();
    }
    this.instance = null;
    this.createdAt = undefined;
  }
}

export default LanguageDetectorFactory;
