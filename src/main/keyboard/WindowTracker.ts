// 🔥 기가차드 윈도우 추적기 - 실시간 윈도우 변경 감지 및 세션 관리

import { Logger } from '../../shared/logger';
import { EventEmitter } from 'events';
import { BaseManager } from '../common/BaseManager';
import getWindows, { getActiveWindow, WindowInfo } from 'get-windows';
import { Result } from '../../shared/types';

// 🔥 기가차드 타입 재export
export type { WindowInfo } from 'get-windows';

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
  trackingInterval: number; // ms
  enableMemoryTracking: boolean;
  enableTitleTracking: boolean;
  maxHistorySize: number;
  appCategoryMapping: Record<string, string>;
}

/**
 * 🔥 WindowTracker - 완벽한 윈도우 추적 시스템
 * 실시간 윈도우 변경 감지, 앱별 세션 관리, 타이핑 컨텍스트 제공
 */
export class WindowTracker extends BaseManager {
  private readonly componentName = 'WINDOW_TRACKER';
  private trackerState: WindowTrackerState;
  private trackerConfig: WindowTrackerConfig;
  private trackingInterval: NodeJS.Timeout | null = null;
  private windowHistory: WindowInfo[] = [];

  // 🔥 앱 카테고리 매핑 (Loop 특화)
  private readonly appCategories: Record<string, string> = {
    // Development
    'Visual Studio Code': 'development',
    'Xcode': 'development',
    'IntelliJ IDEA': 'development',
    'WebStorm': 'development',
    'Sublime Text': 'development',
    'Atom': 'development',
    'Terminal': 'development',
    'iTerm2': 'development',
    
    // Browser
    'Safari': 'browser',
    'Google Chrome': 'browser',
    'Firefox': 'browser',
    'Microsoft Edge': 'browser',
    'Arc': 'browser',
    'Brave Browser': 'browser',
    
    // Office & Productivity
    'Microsoft Word': 'office',
    'Microsoft Excel': 'office',
    'Microsoft PowerPoint': 'office',
    'Pages': 'office',
    'Numbers': 'office',
    'Keynote': 'office',
    'Notion': 'productivity',
    'Obsidian': 'productivity',
    'Roam Research': 'productivity',
    
    // Communication
    'Slack': 'communication',
    'Discord': 'communication',
    'Microsoft Teams': 'communication',
    'Zoom': 'communication',
    'Mail': 'communication',
    'Messages': 'communication',
    
    // Design
    'Adobe Photoshop': 'design',
    'Adobe Illustrator': 'design',
    'Figma': 'design',
    'Sketch': 'design',
    'Canva': 'design',
    
    // Entertainment
    'YouTube': 'entertainment',
    'Netflix': 'entertainment',
    'Spotify': 'entertainment',
    'Apple Music': 'entertainment',
    'VLC': 'entertainment',
    
    // System
    'Finder': 'system',
    'System Preferences': 'system',
    'Activity Monitor': 'system',
    'Console': 'system',
  };

  constructor(config: Partial<WindowTrackerConfig> = {}) {
    super({
      name: 'WindowTracker',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000,
    });

    this.trackerConfig = {
      trackingInterval: 500, // 0.5초마다 체크
      enableMemoryTracking: true,
      enableTitleTracking: true,
      maxHistorySize: 100,
      appCategoryMapping: this.appCategories,
      ...config,
    };

    this.trackerState = {
      isTracking: false,
      currentWindow: null,
      previousWindow: null,
      windowChangeCount: 0,
      trackingStartTime: null,
      lastChangeTime: null,
    };

    Logger.info(this.componentName, 'Window tracker instance created');
  }

  /**
   * BaseManager 추상 메서드 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    try {
      // 초기 활성 윈도우 감지
      const activeWindow = await this.getCurrentActiveWindow();
      if (activeWindow) {
        this.trackerState.currentWindow = this.enhanceWindowInfo(activeWindow);
        Logger.info(this.componentName, 'Initial active window detected', {
          title: activeWindow.title,
          app: activeWindow.owner.name,
        });
      }

      Logger.info(this.componentName, 'Window tracker initialized successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to initialize window tracker', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    try {
      // 추적 시작
      this.trackingInterval = setInterval(async () => {
        await this.checkWindowChange();
      }, this.trackerConfig.trackingInterval);

      this.trackerState.isTracking = true;
      this.trackerState.trackingStartTime = new Date();

      this.emit('tracking-started');
      Logger.info(this.componentName, 'Window tracking started', {
        interval: this.trackerConfig.trackingInterval,
      });
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to start window tracking', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    try {
      if (this.trackingInterval) {
        clearInterval(this.trackingInterval);
        this.trackingInterval = null;
      }

      this.trackerState.isTracking = false;
      this.trackerState.trackingStartTime = null;

      this.emit('tracking-stopped');
      Logger.info(this.componentName, 'Window tracking stopped');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to stop window tracking', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    try {
      await this.doStop();
      
      this.trackerState.currentWindow = null;
      this.trackerState.previousWindow = null;
      this.trackerState.windowChangeCount = 0;
      this.trackerState.lastChangeTime = null;
      this.windowHistory = [];

      Logger.info(this.componentName, 'Window tracker cleanup completed');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to cleanup window tracker', err);
      throw err;
    }
  }

  /**
   * 현재 활성 윈도우 가져오기
   */
  private async getCurrentActiveWindow(): Promise<WindowInfo | null> {
    try {
      const activeWindow = await getActiveWindow({
        screenRecordingPermission: false,
        accessibilityPermission: false,
      });

      return activeWindow || null;
    } catch (error) {
      Logger.error(this.componentName, 'Failed to get current active window', error);
      return null;
    }
  }

  /**
   * 윈도우 변경 체크
   */
  private async checkWindowChange(): Promise<void> {
    try {
      const activeWindow = await this.getCurrentActiveWindow();
      
      if (!activeWindow) {
        return;
      }

      const enhancedWindow = this.enhanceWindowInfo(activeWindow);
      const hasChanged = this.hasWindowChanged(enhancedWindow);

      if (hasChanged) {
        this.handleWindowChange(enhancedWindow);
      }
    } catch (error) {
      Logger.error(this.componentName, 'Error checking window change', error);
    }
  }

  /**
   * 윈도우 정보 향상 (Loop 전용 필드 추가)
   */
  private enhanceWindowInfo(window: WindowInfo): WindowInfo {
    const enhanced = { ...window };
    
    // Loop 전용 필드 추가
    enhanced.loopTimestamp = Date.now();
    enhanced.loopAppCategory = this.categorizeApp(window.owner.name);
    enhanced.loopSessionId = `${window.owner.name}-${Date.now()}`;

    return enhanced;
  }

  /**
   * 윈도우 변경 여부 확인
   */
  private hasWindowChanged(newWindow: WindowInfo): boolean {
    if (!this.trackerState.currentWindow) {
      return true;
    }

    const current = this.trackerState.currentWindow;
    return (
      current.id !== newWindow.id ||
      current.title !== newWindow.title ||
      current.owner.name !== newWindow.owner.name ||
      current.owner.processId !== newWindow.owner.processId
    );
  }

  /**
   * 윈도우 변경 처리
   */
  private handleWindowChange(newWindow: WindowInfo): void {
    const previousWindow = this.trackerState.currentWindow;
    
    // 상태 업데이트
    this.trackerState.previousWindow = previousWindow;
    this.trackerState.currentWindow = newWindow;
    this.trackerState.windowChangeCount++;
    this.trackerState.lastChangeTime = new Date();

    // 히스토리 관리
    this.addToHistory(newWindow);

    // 변경 이벤트 생성
    const changeEvent: WindowChangeEvent = {
      previous: previousWindow,
      current: newWindow,
      timestamp: new Date(),
      changeType: this.determineChangeType(previousWindow, newWindow),
    };

    // 이벤트 발생
    this.emit('window-changed', changeEvent);
    
    Logger.info(this.componentName, 'Window changed', {
      from: previousWindow?.owner.name || 'none',
      to: newWindow.owner.name,
      title: newWindow.title,
      category: newWindow.loopAppCategory,
    });
  }

  /**
   * 변경 타입 결정
   */
  private determineChangeType(previous: WindowInfo | null, current: WindowInfo): WindowChangeEvent['changeType'] {
    if (!previous) {
      return 'window-created';
    }

    if (previous.owner.processId !== current.owner.processId) {
      return 'focus-changed';
    }

    if (previous.title !== current.title) {
      return 'title-changed';
    }

    return 'focus-changed';
  }

  /**
   * 히스토리에 추가
   */
  private addToHistory(window: WindowInfo): void {
    this.windowHistory.push(window);
    
    // 최대 크기 제한
    if (this.windowHistory.length > this.trackerConfig.maxHistorySize) {
      this.windowHistory.shift();
    }
  }

  /**
   * 앱 카테고리 분류
   */
  private categorizeApp(appName: string): WindowInfo['loopAppCategory'] {
    const category = this.trackerConfig.appCategoryMapping[appName];
    return (category as WindowInfo['loopAppCategory']) || 'other';
  }

  /**
   * 공개 API: 현재 윈도우 반환
   */
  public getCurrentWindow(): WindowInfo | null {
    return this.trackerState.currentWindow;
  }

  /**
   * 공개 API: 추적 상태 반환
   */
  public getTrackerState(): WindowTrackerState {
    return { ...this.trackerState };
  }

  /**
   * 공개 API: 윈도우 히스토리 반환
   */
  public getWindowHistory(): WindowInfo[] {
    return [...this.windowHistory];
  }

  /**
   * 공개 API: 앱별 통계
   */
  public getAppStats(): Record<string, { count: number; totalTime: number; category: string }> {
    const stats: Record<string, { count: number; totalTime: number; category: string }> = {};
    
    this.windowHistory.forEach((window) => {
      const appName = window.owner.name;
      if (!stats[appName]) {
        stats[appName] = {
          count: 0,
          totalTime: 0,
          category: window.loopAppCategory || 'other',
        };
      }
      stats[appName].count++;
    });

    return stats;
  }

  /**
   * 공개 API: 강제 윈도우 감지
   */
  public async forceDetection(): Promise<Result<WindowInfo>> {
    try {
      const activeWindow = await this.getCurrentActiveWindow();
      
      if (!activeWindow) {
        return {
          success: false,
          error: 'No active window found',
        };
      }

      const enhancedWindow = this.enhanceWindowInfo(activeWindow);
      this.handleWindowChange(enhancedWindow);

      return {
        success: true,
        data: enhancedWindow,
      };
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to force detect window', err);
      return {
        success: false,
        error: err.message,
      };
    }
  }
}

// 🔥 기가차드 싱글톤 윈도우 추적기
export const windowTracker = new WindowTracker();

// #DEBUG: Window tracker module exit point
Logger.debug('WINDOW_TRACKER', 'Window tracker module setup complete');

export default windowTracker;
