// 🔥 기가차드 윈도우 추적기 - 실시간 윈도우 변경 감지 및 세션 관리

import { Logger } from '../../shared/logger';
import { EventEmitter } from 'events';
import { BaseManager } from '../common/BaseManager';
import { activeWindow, openWindows, WindowInfo } from 'get-windows';
import { Result } from '../../shared/types';
import { Platform } from '../utils/platform';
import { getAppCategory, AppCategory, APP_CATEGORY_MAPPING } from './appCategories';

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
  private hasAccessibilityPermission = false; // 🔥 권한 상태 추적

  // 🔥 앱 카테고리 매핑 (Loop 특화) - 중복 제거 및 확장된 버전


  constructor(config: Partial<WindowTrackerConfig> = {}, hasAccessibilityPermission = false) {
    super({
      name: 'WindowTracker',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000,
    });

    this.hasAccessibilityPermission = hasAccessibilityPermission;

    this.trackerConfig = {
      trackingInterval: 500, // 0.5초마다 체크
      enableMemoryTracking: true,
      enableTitleTracking: true,
      maxHistorySize: 100,
      appCategoryMapping: APP_CATEGORY_MAPPING,
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

    Logger.info(this.componentName, 'Window tracker instance created', {
      hasAccessibilityPermission: this.hasAccessibilityPermission
    });
  }

  /**
   * 🔥 접근성 권한 상태 설정
   */
  public setAccessibilityPermission(hasPermission: boolean): void {
    const wasChanged = this.hasAccessibilityPermission !== hasPermission;
    this.hasAccessibilityPermission = hasPermission;
    
    if (wasChanged) {
      Logger.info(this.componentName, '🔐 접근성 권한 상태 변경됨', { 
        hasPermission,
        canUseGetWindows: hasPermission 
      });
    }
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
   * 현재 활성 윈도우 가져오기 (권한 기반)
   */
  private async getCurrentActiveWindow(): Promise<WindowInfo | null> {
    try {
      // 🔥 접근성 권한이 없으면 대체 방법 사용
      if (!this.hasAccessibilityPermission) {
        Logger.debug(this.componentName, '⚠️ 접근성 권한이 없음 - 대체 방법 사용');
        return this.fallbackWindowDetection();
      }
      
      // 🔥 접근성 권한이 있으면 더 정확한 정보 가져오기
      let activeWindowFunc;
      
      try {
        // 동적 import로 get-windows 모듈 로드
        const getWindowsModule = await import('get-windows');
        
        // 🔥 정확한 export 이름 사용: activeWindow
        activeWindowFunc = getWindowsModule.activeWindow;
                             
        if (typeof activeWindowFunc !== 'function') {
          throw new Error('activeWindow function not found in get-windows module');
        }
        
      } catch (moduleError) {
        Logger.warn(this.componentName, '⚠️ get-windows 모듈 로드 실패 - 대체 방법 사용:', moduleError);
        return this.fallbackWindowDetection();
      }

      // 🔥 get-windows v9.2.0에서는 옵션 없이 호출 (권한 있을 때만)
      const activeWindowResult = await activeWindowFunc();

      // 🔥 윈도우 정보 유효성 검증 및 보완
      if (activeWindowResult) {
        return this.validateAndEnhanceWindowInfo(activeWindowResult);
      }

      return null;
      
    } catch (error) {
      Logger.warn(this.componentName, '⚠️ 활성 윈도우 가져오기 실패 - 대체 방법 시도:', error);
      
      // 🔥 대체 방법 시도 (항상 안전)
      return this.fallbackWindowDetection();
    }
  }

  /**
   * 윈도우 정보 유효성 검증 및 보완
   */
  private validateAndEnhanceWindowInfo(windowInfo: WindowInfo): WindowInfo | null {
    try {
      // 🔥 기본 필드 검증
      if (!windowInfo) {
        Logger.debug(this.componentName, '⚠️ 윈도우 정보가 null/undefined');
        return null;
      }

      // 🔥 owner 정보 검증 및 보완
      if (!windowInfo.owner) {
        Logger.debug(this.componentName, '⚠️ owner 정보 없음 - 기본값으로 보완');
        windowInfo.owner = {
          name: 'Unknown App',
          processId: 0
        };
      }

      // 🔥 owner.name 검증 및 보완
      if (!windowInfo.owner.name || windowInfo.owner.name.trim() === '') {
        Logger.debug(this.componentName, '⚠️ owner.name 없음 - 기본값으로 보완');
        windowInfo.owner.name = 'Unknown App';
      }

      // 🔥 title 검증 및 보완
      if (!windowInfo.title || windowInfo.title.trim() === '') {
        Logger.debug(this.componentName, '⚠️ title 없음 - 앱 이름으로 보완');
        windowInfo.title = windowInfo.owner.name;
      }

      // 🔥 processId 검증 및 보완
      if (typeof windowInfo.owner.processId !== 'number' || windowInfo.owner.processId <= 0) {
        Logger.debug(this.componentName, '⚠️ processId 유효하지 않음 - 기본값으로 보완');
        windowInfo.owner.processId = Math.floor(Math.random() * 100000); // 임시 ID
      }

      // 🔥 bounds 검증 및 보완
      if (!windowInfo.bounds) {
        Logger.debug(this.componentName, '⚠️ bounds 정보 없음 - 기본값으로 보완');
        windowInfo.bounds = { x: 0, y: 0, width: 0, height: 0 };
      }

      // 🔥 id 검증 및 보완
      if (typeof windowInfo.id !== 'number' || windowInfo.id <= 0) {
        Logger.debug(this.componentName, '⚠️ window id 유효하지 않음 - 생성');
        windowInfo.id = Date.now() + Math.floor(Math.random() * 1000);
      }

      // 🔥 memoryUsage 검증 및 보완
      if (typeof windowInfo.memoryUsage !== 'number') {
        windowInfo.memoryUsage = 0;
      }

      Logger.debug(this.componentName, '✅ 윈도우 정보 검증 완료', {
        app: windowInfo.owner.name,
        title: windowInfo.title,
        processId: windowInfo.owner.processId,
        id: windowInfo.id
      });

      return windowInfo;

    } catch (error) {
      Logger.error(this.componentName, '❌ 윈도우 정보 검증 중 오류', error);
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
    
    // 🔥 owner와 name의 안전성 확인
    const ownerName = window?.owner?.name || 'Unknown';
    
    // Loop 전용 필드 추가
    enhanced.loopTimestamp = Date.now();
    enhanced.loopAppCategory = getAppCategory(ownerName) as WindowInfo['loopAppCategory'];
    enhanced.loopSessionId = `${ownerName}-${Date.now()}`;

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
      from: previousWindow?.owner?.name || 'none',
      to: newWindow?.owner?.name || 'Unknown',
      title: newWindow?.title || 'Untitled',
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
          category: window.loopAppCategory || 'unknown',
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

  /**
   * 🔥 대체 윈도우 감지 (AppleScript 사용) - 강화 버전
   */
  private async fallbackWindowDetection(): Promise<WindowInfo | null> {
    if (!Platform.isMacOS()) {
      Logger.debug(this.componentName, '⚠️ macOS가 아님 - fallback 불가');
      return null;
    }
    
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      // 🔥 더 정확한 AppleScript로 프로세스 정보까지 가져오기
      const script = `
        tell application "System Events"
          set frontApp to first application process whose frontmost is true
          set windowTitle to ""
          set bundleId to ""
          set processName to name of frontApp
          
          try
            set windowTitle to name of front window of frontApp
          end try
          
          try
            set bundleId to bundle identifier of frontApp
          end try
          
          return processName & "|||" & windowTitle & "|||" & bundleId
        end tell
      `;

      const { stdout } = await execAsync(`osascript -e '${script}'`);
      const [processName, windowTitle, bundleId] = stdout.trim().split('|||');

      if (!processName || processName.trim() === '') {
        Logger.debug(this.componentName, '⚠️ AppleScript에서 프로세스명 가져오기 실패');
        return null;
      }

      // 🔥 프로세스 ID 가져오기 (별도 명령어)
      let processId = 0;
      try {
        const pidScript = `
          tell application "System Events"
            set frontApp to first application process whose frontmost is true
            return unix id of frontApp
          end tell
        `;
        const { stdout: pidStdout } = await execAsync(`osascript -e '${pidScript}'`);
        processId = parseInt(pidStdout.trim()) || 0;
      } catch (pidError) {
        Logger.debug(this.componentName, '⚠️ 프로세스 ID 가져오기 실패, 기본값 사용:', pidError);
      }

      const fallbackWindow: WindowInfo = {
        title: windowTitle && windowTitle.trim() !== '' ? windowTitle.trim() : processName.trim(),
        owner: {
          name: processName.trim(),
          processId: processId || Math.floor(Math.random() * 100000),
          bundleId: bundleId && bundleId.trim() !== '' ? bundleId.trim() : undefined
        },
        bounds: { x: 0, y: 0, width: 0, height: 0 },
        id: Date.now() + Math.floor(Math.random() * 1000),
        memoryUsage: 0
      };

      Logger.info(this.componentName, '✅ AppleScript로 윈도우 정보 감지 성공', {
        app: fallbackWindow.owner.name,
        title: fallbackWindow.title,
        bundleId: bundleId || 'unknown',
        processId: processId || 'unknown'
      });

      return fallbackWindow;

    } catch (error) {
      Logger.error(this.componentName, '❌ AppleScript 대체 방법도 실패:', error);
      
      // 🔥 최후의 수단: 시스템 정보라도 제공
      try {
        return {
          title: 'System Window',
          owner: {
            name: 'System',
            processId: 1
          },
          bounds: { x: 0, y: 0, width: 0, height: 0 },
          id: Date.now(),
          memoryUsage: 0
        };
      } catch (finalError) {
        Logger.error(this.componentName, '❌ 최후 수단도 실패:', finalError);
        return null;
      }
    }
  }
}

// 🔥 기가차드 싱글톤 윈도우 추적기
export const windowTracker = new WindowTracker();

// #DEBUG: Window tracker module exit point
Logger.debug('WINDOW_TRACKER', 'Window tracker module setup complete');

export default windowTracker;
