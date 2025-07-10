// 🔥 기가차드 윈도우 추적기 - 크로스플랫폼 전략 패턴

import { Logger } from '../../shared/logger';
import { EventEmitter } from 'events';
import { BaseManager } from '../common/BaseManager';
import { Result, WindowInfo, AppCategory } from '../../shared/types';
import { Platform } from '../utils/platform';
import { getAppCategory } from './appCategories';
import type { WindowDetectionStrategy } from './strategies/WindowDetectionStrategy';
import getActiveWindow from 'active-win';

// #DEBUG: Window tracker entry point
Logger.debug('WINDOW_TRACKER', 'Window tracker module loaded');

// 🔥 기가차드 윈도우 변경 이벤트
export interface WindowChangeEvent {
  previous: WindowInfo | null;
  current: WindowInfo;
  timestamp: Date;
  changeType: 'focus-changed' | 'window-created' | 'window-closed' | 'title-changed';
}

// 🔥 기가차드 윈도우 추적 상태
export interface WindowTrackerState {
  isTracking: boolean;
  currentWindow: WindowInfo | null;
  previousWindow: WindowInfo | null;
  windowChangeCount: number;
  trackingStartTime: Date | null;
  lastChangeTime: Date | null;
}

// 🔥 기가차드 윈도우 추적 설정
export interface WindowTrackerConfig {
  trackingInterval: number;
  enableMemoryTracking: boolean;
  enableTitleTracking: boolean;
  maxHistorySize: number;
  appCategoryMapping: Record<string, AppCategory>;
}

/**
 * 🔥 WindowTracker - 크로스플랫폼 윈도우 추적 시스템
 * 
 * 핵심 기능:
 * - 플랫폼별 전략 패턴으로 윈도우 감지
 * - 실시간 윈도우 변경 감지
 * - 앱별 세션 관리
 * - 타이핑 컨텍스트 제공
 */
export class WindowTracker extends BaseManager {
  private readonly componentName = 'WINDOW_TRACKER';
  private trackerState: WindowTrackerState;
  private trackerConfig: WindowTrackerConfig;
  private trackingInterval: NodeJS.Timeout | null = null;
  private windowHistory: WindowInfo[] = [];
  private hasAccessibilityPermission = false;
  
  // 🔥 전략 패턴: 플랫폼별 윈도우 감지 전략
  private detectionStrategy: WindowDetectionStrategy | null = null;

  constructor(config: Partial<WindowTrackerConfig> = {}) {
    super({
      name: 'WindowTracker',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000,
    });

    // 🔥 설정 초기화
    this.trackerConfig = {
      trackingInterval: 2000, // 2초
      enableMemoryTracking: true,
      enableTitleTracking: true,
      maxHistorySize: 100,
      appCategoryMapping: {},
      ...config,
    };

    // 🔥 상태 초기화
    this.trackerState = {
      isTracking: false,
      currentWindow: null,
      previousWindow: null,
      windowChangeCount: 0,
      trackingStartTime: null,
      lastChangeTime: null,
    };

    // 🔥 플랫폼별 전략 초기화
    this.initializeDetectionStrategy();

    Logger.info(this.componentName, 'WindowTracker 생성 완료', {
      platform: Platform.getPlatformName(),
      strategyName: this.detectionStrategy?.strategyName || 'none'
    });
  }

  /**
   * 🔥 플랫폼별 윈도우 감지 전략 초기화
   */
  private async initializeDetectionStrategy(): Promise<void> {
    try {
      if (Platform.isMacOS()) {
        Logger.info(this.componentName, 'macOS 감지 - active-win fallback 사용');
        // macOS는 active-win fallback만 사용
        this.detectionStrategy = null;
      } else if (Platform.isWindows()) {
        Logger.info(this.componentName, 'Windows 감지 - WindowsWindowStrategy 로드');
        // Windows 전략 동적 로드
        const { WindowsWindowStrategy } = await import('./strategies/WindowsWindowStrategy');
        this.detectionStrategy = new WindowsWindowStrategy();
        await this.detectionStrategy.initialize();
      } else if (Platform.isLinux()) {
        Logger.warn(this.componentName, 'Linux 전략 미구현 - fallback 사용');
        this.detectionStrategy = null;
      } else {
        Logger.warn(this.componentName, '알 수 없는 플랫폼 - fallback 사용');
        this.detectionStrategy = null;
      }
    } catch (error) {
      Logger.error(this.componentName, '전략 초기화 실패', error);
      this.detectionStrategy = null;
    }
  }

  /**
   * 🔥 BaseManager 추상 메서드 구현
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'WindowTracker 초기화 시작');
    
    // 전략 초기화가 아직 안 된 경우 대기
    if (!this.detectionStrategy && Platform.isWindows()) {
      await this.initializeDetectionStrategy();
    }
  }

  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'WindowTracker 시작');
    
    // 🔥 추적 시작
    this.trackerState.isTracking = true;
    this.trackerState.trackingStartTime = new Date();
    
    // 🔥 주기적 윈도우 체크 시작
    this.startPeriodicCheck();
  }

  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'WindowTracker 중지');
    
    // 🔥 추적 중지
    this.trackerState.isTracking = false;
    
    // 🔥 주기적 체크 중지
    this.stopPeriodicCheck();
  }

  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'WindowTracker 정리');
    
    // 🔥 인터벌 정리
    this.stopPeriodicCheck();
    
    // 🔥 전략 정리
    if (this.detectionStrategy) {
      await this.detectionStrategy.cleanup();
    }
    
    // 🔥 상태 초기화
    this.windowHistory = [];
    this.trackerState.currentWindow = null;
    this.trackerState.previousWindow = null;
  }

  /**
   * 🔥 주기적 윈도우 체크 시작
   */
  private startPeriodicCheck(): void {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
    }

    this.trackingInterval = setInterval(async () => {
      try {
        await this.checkWindowChange();
      } catch (error) {
        Logger.error(this.componentName, '윈도우 체크 실패', error);
      }
    }, this.trackerConfig.trackingInterval);

    Logger.info(this.componentName, `주기적 체크 시작: ${this.trackerConfig.trackingInterval}ms`);
  }

  /**
   * 🔥 주기적 윈도우 체크 중지
   */
  private stopPeriodicCheck(): void {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
      Logger.info(this.componentName, '주기적 체크 중지');
    }
  }

  /**
   * 🔥 윈도우 변경 체크
   */
  private async checkWindowChange(): Promise<void> {
    if (!this.trackerState.isTracking) return;

    try {
      const currentWindow = await this.getCurrentActiveWindow();
      
      if (!currentWindow) {
        Logger.debug(this.componentName, '활성 윈도우 없음');
        return;
      }

      // 🔥 윈도우 변경 감지
      if (this.hasWindowChanged(currentWindow)) {
        this.handleWindowChange(currentWindow);
      }
    } catch (error) {
      Logger.error(this.componentName, '윈도우 변경 체크 실패', error);
    }
  }

  /**
   * 🔥 현재 활성 윈도우 가져오기
   */
  private async getCurrentActiveWindow(): Promise<WindowInfo | null> {
    try {
      // 🔥 전략이 있으면 전략 사용
      if (this.detectionStrategy) {
        const result = await this.detectionStrategy.getCurrentActiveWindow();
        if (result.success && result.data) {
          return this.enhanceWindowInfo(result.data);
        } else {
          Logger.warn(this.componentName, '전략 기반 윈도우 감지 실패:', result.error);
        }
      }

      // 🔥 Fallback: active-win 사용 (macOS/Linux)
      return await this.getFallbackActiveWindow();
      
    } catch (error) {
      Logger.error(this.componentName, '활성 윈도우 가져오기 실패', error);
      return null;
    }
  }

  /**
   * 🔥 Fallback 활성 윈도우 가져오기 (active-win 사용)
   */
  private async getFallbackActiveWindow(): Promise<WindowInfo | null> {
    try {
      const activeWinResult = await getActiveWindow({
        accessibilityPermission: false,
        screenRecordingPermission: false
      });

      if (!activeWinResult) {
        return null;
      }

      // active-win 결과를 WindowInfo로 변환
      const windowInfo: WindowInfo = {
        id: activeWinResult.id || Date.now(),
        title: activeWinResult.title || 'Unknown Window',
        owner: {
          name: activeWinResult.owner?.name || 'Unknown App',
          processId: activeWinResult.owner?.processId || 0,
          bundleId: (activeWinResult.owner as any)?.bundleId,
          path: activeWinResult.owner?.path,
        },
        bounds: activeWinResult.bounds || { x: 0, y: 0, width: 0, height: 0 },
        memoryUsage: (activeWinResult as any).memoryUsage || 0,
      };

      return this.enhanceWindowInfo(windowInfo);
    } catch (error) {
      Logger.error(this.componentName, 'active-win fallback 실패', error);
      return null;
    }
  }

  /**
   * 🔥 윈도우 정보 향상
   */
  private enhanceWindowInfo(windowInfo: WindowInfo): WindowInfo {
    const enhanced = { ...windowInfo };
    
    // Loop 전용 필드 추가
    enhanced.loopTimestamp = Date.now();
    enhanced.loopAppCategory = getAppCategory(windowInfo.owner.name);
    enhanced.loopSessionId = `${windowInfo.owner.name}-${Date.now()}`;

    // 플랫폼 정보 추가
    enhanced.loopPlatformInfo = {
      platform: process.platform,
      version: process.version,
      architecture: process.arch,
    };

    return enhanced;
  }

  /**
   * 🔥 윈도우 변경 여부 확인
   */
  private hasWindowChanged(newWindow: WindowInfo): boolean {
    const current = this.trackerState.currentWindow;
    
    if (!current) return true;
    
    return (
      current.id !== newWindow.id ||
      current.title !== newWindow.title ||
      current.owner.name !== newWindow.owner.name
    );
  }

  /**
   * 🔥 윈도우 변경 처리
   */
  private handleWindowChange(newWindow: WindowInfo): void {
    const previous = this.trackerState.currentWindow;
    
    // 상태 업데이트
    this.trackerState.previousWindow = previous;
    this.trackerState.currentWindow = newWindow;
    this.trackerState.windowChangeCount++;
    this.trackerState.lastChangeTime = new Date();
    
    // 히스토리 추가
    this.addToHistory(newWindow);
    
    // 이벤트 발생
    const changeEvent: WindowChangeEvent = {
      previous,
      current: newWindow,
      timestamp: new Date(),
      changeType: this.determineChangeType(previous, newWindow),
    };
    
    this.emit('window-change', changeEvent);
    
    Logger.info(this.componentName, '윈도우 변경 감지', {
      from: previous?.title || 'none',
      to: newWindow.title,
      app: newWindow.owner.name,
      category: newWindow.loopAppCategory
    });
  }

  /**
   * 🔥 변경 타입 결정
   */
  private determineChangeType(
    previous: WindowInfo | null, 
    current: WindowInfo
  ): WindowChangeEvent['changeType'] {
    if (!previous) return 'window-created';
    if (previous.id !== current.id) return 'focus-changed';
    if (previous.title !== current.title) return 'title-changed';
    return 'focus-changed';
  }

  /**
   * 🔥 히스토리에 추가
   */
  private addToHistory(window: WindowInfo): void {
    this.windowHistory.unshift(window);
    
    // 최대 크기 유지
    if (this.windowHistory.length > this.trackerConfig.maxHistorySize) {
      this.windowHistory = this.windowHistory.slice(0, this.trackerConfig.maxHistorySize);
    }
  }

  /**
   * 🔥 현재 윈도우 정보 반환
   */
  public getCurrentWindow(): WindowInfo | null {
    return this.trackerState.currentWindow;
  }

  /**
   * 🔥 추적 상태 반환
   */
  public getTrackerState(): WindowTrackerState {
    return { ...this.trackerState };
  }

  /**
   * 🔥 윈도우 히스토리 반환
   */
  public getWindowHistory(): WindowInfo[] {
    return [...this.windowHistory];
  }

  /**
   * 🔥 접근성 권한 설정
   */
  public setAccessibilityPermission(hasPermission: boolean): void {
    const wasChanged = this.hasAccessibilityPermission !== hasPermission;
    this.hasAccessibilityPermission = hasPermission;
    
    if (wasChanged) {
      Logger.info(this.componentName, `접근성 권한 변경: ${hasPermission}`);
    }
  }

  /**
   * 🔥 앱별 통계 반환
   */
  public getAppStats(): Record<string, { count: number; totalTime: number; category: string }> {
    const stats: Record<string, { count: number; totalTime: number; category: string }> = {};
    
    this.windowHistory.forEach(window => {
      const appName = window.owner.name;
      if (!stats[appName]) {
        stats[appName] = {
          count: 0,
          totalTime: 0,
          category: window.loopAppCategory || 'other'
        };
      }
      stats[appName].count++;
    });
    
    return stats;
  }

  /**
   * 🔥 모든 열린 윈도우 가져오기
   */
  public async getAllOpenWindows(): Promise<Result<WindowInfo[]>> {
    try {
      if (this.detectionStrategy) {
        const result = await this.detectionStrategy.getAllOpenWindows();
        if (result.success && result.data) {
          const enhancedWindows = result.data.map(w => this.enhanceWindowInfo(w));
          return { success: true, data: enhancedWindows };
        }
      }

      // Fallback: 현재 윈도우만 반환
      const currentWindow = await this.getCurrentActiveWindow();
      return {
        success: true,
        data: currentWindow ? [currentWindow] : []
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get all windows: ${error}`
      };
    }
  }

  /**
   * 🔥 활성 윈도우 직접 가져오기
   */
  public async getActiveWindowDirect(): Promise<Result<WindowInfo>> {
    try {
      const window = await this.getCurrentActiveWindow();
      if (window) {
        return { success: true, data: window };
      } else {
        return { success: false, error: 'No active window found' };
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to get active window: ${error}`
      };
    }
  }
}

// 🔥 기가차드 싱글톤 윈도우 추적기
export const windowTracker = new WindowTracker();

// #DEBUG: Window tracker module exit point
Logger.debug('WINDOW_TRACKER', 'Window tracker module setup complete');

export default windowTracker;
