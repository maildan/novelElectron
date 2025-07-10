// 🔥 기가차드 macOS 윈도우 감지 전략 - active-win 기반

import { BaseWindowDetectionStrategy } from './WindowDetectionStrategy';
import { Result, WindowInfo, AppCategory } from '../../../shared/types';
import { Logger } from '../../../shared/logger';
import { Platform } from '../../utils/platform';
import { getAppCategory } from '../appCategories';
import getActiveWindow from 'active-win';

/**
 * 🔥 macOS 윈도우 감지 전략
 * active-win 라이브러리를 활용한 macOS 최적화된 윈도우 감지
 */
export class MacDetectionStrategy extends BaseWindowDetectionStrategy {
  public readonly strategyName = 'MacDetectionStrategy';
  public readonly supportedPlatforms: NodeJS.Platform[] = ['darwin'];

  constructor() {
    super('MAC_DETECTION_STRATEGY');
  }

  /**
   * 🔥 전략 초기화 - macOS 플랫폼 체크
   */
  async initialize(): Promise<Result<boolean>> {
    try {
      if (!Platform.isMacOS()) {
        return this.handleError(new Error('macOS가 아닙니다'), 'Platform check');
      }

      this.isInitialized = true;
      Logger.info(this.componentName, 'macOS 윈도우 감지 전략 초기화 완료');

      return { success: true, data: true };
    } catch (error) {
      return this.handleError(error, 'Initialize');
    }
  }

  /**
   * 🔥 현재 활성 윈도우 가져오기
   */
  async getCurrentActiveWindow(): Promise<Result<WindowInfo>> {
    const initCheck = this.ensureInitialized();
    if (!initCheck.success) {
      return { success: false, error: initCheck.error };
    }

    try {
      // active-win 8.x 호환: 옵션 객체로 권한 우회
      const activeWinResult = await getActiveWindow({
        accessibilityPermission: false,   // macOS 접근성 권한 우회
        screenRecordingPermission: false  // macOS 화면 녹화 권한 우회
      });

      if (!activeWinResult) {
        return { success: false, error: 'No active window found' };
      }

      // active-win 결과를 WindowInfo로 변환
      const windowInfo: Partial<WindowInfo> = {
        id: activeWinResult.id || Date.now(),
        title: activeWinResult.title || 'Unknown Window',
        owner: {
          name: activeWinResult.owner?.name || 'Unknown App',
          processId: activeWinResult.owner?.processId || 0,
          bundleId: (activeWinResult.owner as any)?.bundleId,
          path: (activeWinResult.owner as any)?.path,
        },
        bounds: activeWinResult.bounds || { x: 0, y: 0, width: 0, height: 0 },
        memoryUsage: activeWinResult.memoryUsage || 0,
      };

      // 윈도우 정보 검증
      const validationResult = this.validateWindowInfo(windowInfo);
      if (!validationResult.success) {
        return { success: false, error: validationResult.error };
      }

      // Loop 전용 필드 추가
      const enhancedWindow = this.enhanceWithLoopFields(validationResult.data!);

      Logger.debug(this.componentName, 'macOS 활성 윈도우 조회 성공', {
        title: enhancedWindow.title,
        app: enhancedWindow.owner.name,
        category: enhancedWindow.loopAppCategory
      });

      return { success: true, data: enhancedWindow };
    } catch (error) {
      return this.handleError(error, 'Get current active window');
    }
  }

  /**
   * 🔥 모든 열린 윈도우 가져오기
   */
  async getAllOpenWindows(): Promise<Result<WindowInfo[]>> {
    const initCheck = this.ensureInitialized();
    if (!initCheck.success) {
      return { success: false, error: initCheck.error };
    }

    try {
      // active-win은 모든 윈도우 조회를 지원하지 않음
      // 현재 활성 윈도우만 배열로 반환
      const currentWindowResult = await this.getCurrentActiveWindow();
      
      if (!currentWindowResult.success || !currentWindowResult.data) {
        return { success: true, data: [] };
      }

      Logger.debug(this.componentName, 'macOS 모든 윈도우 조회 (활성 윈도우만)', {
        count: 1
      });

      return { success: true, data: [currentWindowResult.data] };
    } catch (error) {
      return this.handleError(error, 'Get all open windows');
    }
  }

  /**
   * 🔥 윈도우 변경 감지 지원 여부
   */
  supportsWindowChangeDetection(): boolean {
    return false; // active-win은 폴링 방식 사용
  }

  /**
   * 🔥 권한 확인
   */
  async checkPermissions(): Promise<Result<boolean>> {
    try {
      // macOS에서 active-win 테스트 호출
      const testResult = await getActiveWindow({
        accessibilityPermission: false,
        screenRecordingPermission: false
      });

      const hasPermission = testResult !== undefined;
      
      Logger.debug(this.componentName, 'macOS 권한 확인 완료', { hasPermission });

      return { success: true, data: hasPermission };
    } catch (error) {
      Logger.warn(this.componentName, 'macOS 권한 확인 실패', error);
      return { success: true, data: false }; // 권한이 없어도 fallback 사용 가능
    }
  }

  /**
   * 🔥 리소스 정리
   */
  async cleanup(): Promise<void> {
    this.isInitialized = false;
    Logger.info(this.componentName, 'macOS 윈도우 감지 전략 정리 완료');
  }

  /**
   * 🔥 Loop 전용 필드로 윈도우 정보 향상
   */
  private enhanceWithLoopFields(windowInfo: WindowInfo): WindowInfo {
    const appCategory = getAppCategory(windowInfo.owner.name);
    
    return {
      ...windowInfo,
      loopTimestamp: Date.now(),
      loopAppCategory: appCategory,
      loopSessionId: `${windowInfo.owner.name}-${Date.now()}`,
      loopLanguageDetected: 'unknown',
      loopIMEState: 'unknown',
      loopPlatformInfo: {
        platform: 'darwin',
        version: process.platform,
        architecture: process.arch,
      },
      loopPermissions: {
        accessibility: true, // active-win 사용 시 가정
        screenRecording: false,
        inputMonitoring: false,
      },
      loopSessionMetadata: {
        startTime: Date.now(),
        totalKeystrokes: 0,
        activeTime: 0,
        idleTime: 0,
      },
    };
  }
}
