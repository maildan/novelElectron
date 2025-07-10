// 🔥 기가차드 윈도우 추적기 - 실시간 윈도우 변경 감지 및 세션 관리

import { Logger } from '../../../shared/logger';
import { EventEmitter } from 'events';
import { BaseManager } from '../../common/BaseManager';
import getActiveWindow from 'active-win';
import { Result, WindowInfo, AppCategory } from '../../../shared/types';
import { Platform } from '../../utils/platform';
import { getAppCategory, APP_CATEGORIES, APP_CATEGORY_MAPPING } from '.././appCategories';

// #DEBUG: Window tracker entry point
Logger.debug('WINDOW_TRACKER', 'Window tracker module loaded');

// 🔥 active-win 라이브러리 결과 타입
interface ActiveWinResult {
  id: number;
  title: string;
  owner?: {
    name: string;
    processId: number;
    bundleId?: string;
    path?: string;
  };
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  memoryUsage?: number;
}

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
  private loggedMissingTitles: Set<string> = new Set(); // 🔥 중복 로그 방지용

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
      trackingInterval: 2000, // 🔥 2초마다 체크로 변경 (CPU 부하 감소)
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
      // 🔥 active-win 8.x 호환: 옵션 객체로 권한 우회
      const activeWinResult = await getActiveWindow({
        accessibilityPermission: false,   // macOS 접근성 권한 우회
        screenRecordingPermission: false  // macOS 화면 녹화 권한 우회
      });
      const activeWindowResult = this.convertActiveWinToWindowInfo(activeWinResult);

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
   * 🔥 active-win 결과를 WindowInfo로 변환
   */
  private convertActiveWinToWindowInfo(activeWinResult: ActiveWinResult | undefined): WindowInfo | null {
    try {
      if (!activeWinResult) {
        return null;
      }

      // 🔥 active-win 결과 구조 적응
      const windowInfo: WindowInfo = {
        id: activeWinResult.id || 0,
        title: activeWinResult.title || '',
        owner: {
          name: activeWinResult.owner?.name || 'Unknown App',
          processId: activeWinResult.owner?.processId || 0,
          bundleId: activeWinResult.owner?.bundleId,
          path: activeWinResult.owner?.path,
        },
        bounds: {
          x: activeWinResult.bounds?.x || 0,
          y: activeWinResult.bounds?.y || 0,
          width: activeWinResult.bounds?.width || 0,
          height: activeWinResult.bounds?.height || 0,
        },
        memoryUsage: activeWinResult.memoryUsage || 0,
      };

      return windowInfo;
    } catch (error) {
      Logger.error(this.componentName, 'active-win 결과 변환 실패', error);
      return null;
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
      }        // 🔥 title 검증 및 보완 (로그 최소화)
        if (!windowInfo.title || windowInfo.title.trim() === '') {
          // 추후 activeWin 옵션 확장 시 활용 가능
          // TODO: active-win 8.x 옵션 활용하여 더 정확한 title 획득
          windowInfo.title = windowInfo.owner.name;
          
          // 🔥 중복 로그 방지: 같은 앱의 title 없음은 1회만 로그
          if (!this.loggedMissingTitles?.has(windowInfo.owner.name)) {
            if (!this.loggedMissingTitles) {
              this.loggedMissingTitles = new Set();
            }
            this.loggedMissingTitles.add(windowInfo.owner.name);
            Logger.debug(this.componentName, '✅ title 보완 완료', { 
              appName: windowInfo.owner.name
            });
          }
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

      // 🔥 윈도우 정보 검증 완료 (로그 최소화)
      // DEBUG 로그 제거하여 1초마다 반복되는 로그 방지

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
    
    // 🔥 Loop 전용 필드 추가 - getAppCategory 함수 사용
    enhanced.loopTimestamp = Date.now();
    enhanced.loopAppCategory = getAppCategory(ownerName) as WindowInfo['loopAppCategory'];
    enhanced.loopSessionId = `${ownerName}-${Date.now()}`;

    // 🔥 로그 최소화: 윈도우가 실제로 변경될 때만 로그
    // DEBUG 로그 제거하여 1초마다 반복되는 로그 방지

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
   * 🔥 모든 열린 윈도우 가져오기 (openWindows 사용)
   */
  public async getAllOpenWindows(): Promise<Result<WindowInfo[]>> {
    try {
      // 🔥 접근성 권한이 없으면 빈 배열 반환
      if (!this.hasAccessibilityPermission) {
        Logger.warn(this.componentName, '⚠️ 접근성 권한이 없어 모든 윈도우 조회 불가');
        return {
          success: true,
          data: [],
        };
      }

      // 🔥 active-win은 openWindows를 지원하지 않음 - 현재 윈도우만 반환
      Logger.warn(this.componentName, '⚠️ active-win은 모든 윈도우 조회를 지원하지 않음');
      
      // 🔥 현재 활성 윈도우만 배열로 반환 (active-win 8.x 호환)
      const activeWinResult = await getActiveWindow({
        accessibilityPermission: false,   // macOS 접근성 권한 우회
        screenRecordingPermission: false  // macOS 화면 녹화 권한 우회
      });
      const currentWindow = this.convertActiveWinToWindowInfo(activeWinResult);
      const windowsArray = currentWindow ? [currentWindow] : [];
      
      if (windowsArray.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      // 🔥 윈도우 정보 검증 및 향상
      const validWindows = windowsArray
        .map(window => this.validateAndEnhanceWindowInfo(window))
        .filter((window): window is WindowInfo => window !== null)
        .map(window => this.enhanceWindowInfo(window));

      Logger.info(this.componentName, `✅ 열린 윈도우 ${validWindows.length}개 조회 성공`);

      return {
        success: true,
        data: validWindows,
      };
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, '❌ 모든 윈도우 조회 실패', err);
      return {
        success: false,
        error: err.message,
      };
    }
  }

  /**
   * 🔥 활성 윈도우 정보 가져오기 (activeWindow 직접 사용)
   */
  public async getActiveWindowDirect(): Promise<Result<WindowInfo>> {
    try {
      // 🔥 접근성 권한이 없으면 대체 방법 사용
      if (!this.hasAccessibilityPermission) {
        Logger.warn(this.componentName, '⚠️ 접근성 권한이 없어 대체 방법 사용');
        const fallbackWindow = await this.fallbackWindowDetection();
        
        if (!fallbackWindow) {
          return {
            success: false,
            error: 'No active window found and fallback failed',
          };
        }

        return {
          success: true,
          data: this.enhanceWindowInfo(fallbackWindow),
        };
      }

      // 🔥 active-win 8.x 호환: 옵션 객체로 권한 우회
      const activeWinResult = await getActiveWindow({
        accessibilityPermission: false,   // macOS 접근성 권한 우회
        screenRecordingPermission: false  // macOS 화면 녹화 권한 우회
      });
      const activeWindowResult = this.convertActiveWinToWindowInfo(activeWinResult);
      
      if (!activeWindowResult) {
        return {
          success: false,
          error: 'No active window found',
        };
      }

      const validWindow = this.validateAndEnhanceWindowInfo(activeWindowResult);
      
      if (!validWindow) {
        return {
          success: false,
          error: 'Active window validation failed',
        };
      }

      return {
        success: true,
        data: this.enhanceWindowInfo(validWindow),
      };
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, '❌ 활성 윈도우 직접 조회 실패', err);
      return {
        success: false,
        error: err.message,
      };
    }
  }

  /**
   * 🔥 앱 카테고리별 윈도우 통계 (APP_CATEGORIES 사용)
   */
  public getCategoryStats(): Record<AppCategory, { count: number; windows: WindowInfo[] }> {
    const stats = {} as Record<AppCategory, { count: number; windows: WindowInfo[] }>;
    
    // 🔥 모든 카테고리 초기화 (APP_CATEGORIES 사용)
    Object.values(APP_CATEGORIES).forEach(category => {
      stats[category] = { count: 0, windows: [] };
    });

    // 🔥 윈도우 히스토리를 카테고리별로 분류
    this.windowHistory.forEach((window) => {
      const category = window.loopAppCategory || APP_CATEGORIES.UNKNOWN;
      stats[category].count++;
      stats[category].windows.push(window);
    });

    Logger.debug(this.componentName, '📊 카테고리별 윈도우 통계 생성', {
      totalCategories: Object.keys(stats).length,
      totalWindows: this.windowHistory.length,
    });

    return stats;
  }

  /**
   * 🔥 특정 카테고리의 윈도우만 필터링
   */
  public getWindowsByCategory(category: AppCategory): WindowInfo[] {
    return this.windowHistory.filter(window => 
      window.loopAppCategory === category
    );
  }

  /**
   * 🔥 앱 카테고리 매핑 정보 가져오기 (APP_CATEGORY_MAPPING 사용)
   */
  public getAppMappingInfo(): {
    totalMappedApps: number;
    categoriesUsed: AppCategory[];
    mappingDetails: Record<string, AppCategory>;
  } {
    // 🔥 현재 히스토리에서 사용된 카테고리 추출
    const usedCategories = new Set<AppCategory>();
    this.windowHistory.forEach(window => {
      if (window.loopAppCategory) {
        usedCategories.add(window.loopAppCategory);
      }
    });

    return {
      totalMappedApps: Object.keys(APP_CATEGORY_MAPPING).length,
      categoriesUsed: Array.from(usedCategories),
      mappingDetails: { ...APP_CATEGORY_MAPPING }, // 전체 매핑 정보 제공
    };
  }

  /**
   * 🔥 대체 윈도우 감지 (AppleScript 사용) - 강화 버전
   */
  private async fallbackWindowDetection(): Promise<WindowInfo | null> {
    if (!Platform.isMacOS()) {
      Logger.debug(this.componentName, '⚠️ macOS가 아님 - 기본 윈도우 정보 사용');
      return this.createBasicWindowInfo();
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

  /**
   * 🔥 기본 윈도우 정보 생성 (권한 없을 때 사용)
   */
  private createBasicWindowInfo(): WindowInfo {
    const appName = Platform.isMacOS() ? 'macOS App' : 
                   Platform.isWindows() ? 'Windows App' : 'Linux App';
    
    return {
      id: Date.now(),
      title: `${appName} - Active Window`,
      owner: {
        name: appName,
        processId: process.pid,
        bundleId: `com.loop.fallback.${Platform.getPlatformName().toLowerCase()}`
      },
      bounds: { x: 0, y: 0, width: 1200, height: 800 },
      memoryUsage: 0
    };
  }

  /**
   * 🔥 윈도우 카테고리별 활동 시간 분석
   */
  public getActivityTimeByCategory(): Record<AppCategory, { totalTime: number; averageSessionTime: number; sessionCount: number }> {
    const categoryStats = {} as Record<AppCategory, { totalTime: number; averageSessionTime: number; sessionCount: number }>;
    
    // 🔥 모든 카테고리 초기화
    Object.values(APP_CATEGORIES).forEach(category => {
      categoryStats[category] = { totalTime: 0, averageSessionTime: 0, sessionCount: 0 };
    });

    // 🔥 윈도우 히스토리 분석
    this.windowHistory.forEach((window, index) => {
      const category = window.loopAppCategory || APP_CATEGORIES.UNKNOWN;
      categoryStats[category].sessionCount++;
      
      // 다음 윈도우와의 시간 차이 계산
      if (index < this.windowHistory.length - 1) {
        const nextWindow = this.windowHistory[index + 1];
        if (nextWindow?.loopTimestamp && window.loopTimestamp) {
          const sessionTime = nextWindow.loopTimestamp - window.loopTimestamp;
          if (sessionTime > 0 && sessionTime < 3600000) { // 1시간 이내만 유효
            categoryStats[category].totalTime += sessionTime;
          }
        }
      }
    });

    // 평균 세션 시간 계산
    Object.keys(categoryStats).forEach(categoryKey => {
      const category = categoryKey as AppCategory;
      const stats = categoryStats[category];
      if (stats.sessionCount > 0) {
        stats.averageSessionTime = stats.totalTime / stats.sessionCount;
      }
    });

    return categoryStats;
  }

  /**
   * 🔥 생산성 점수 계산 (카테고리별 가중치 적용)
   */
  public getProductivityScore(): { 
    score: number; 
    breakdown: Record<AppCategory, { time: number; weight: number; contribution: number }>; 
  } {
    const PRODUCTIVITY_WEIGHTS: Record<AppCategory, number> = {
      [APP_CATEGORIES.DEVELOPMENT]: 1.0,
      [APP_CATEGORIES.OFFICE]: 0.9,
      [APP_CATEGORIES.PROJECT_MANAGEMENT]: 0.9,
      [APP_CATEGORIES.DESIGN]: 0.8,
      [APP_CATEGORIES.PRODUCTIVITY]: 0.8,
      [APP_CATEGORIES.AI_ASSISTANT]: 0.7,
      [APP_CATEGORIES.COMMUNICATION]: 0.6,
      [APP_CATEGORIES.BROWSER]: 0.5,
      [APP_CATEGORIES.MARKETING]: 0.5,
      [APP_CATEGORIES.FINANCE]: 0.4,
      [APP_CATEGORIES.FILE_MANAGEMENT]: 0.3,
      [APP_CATEGORIES.SYSTEM]: 0.2,
      [APP_CATEGORIES.ENTERTAINMENT]: 0.1,
      [APP_CATEGORIES.E_COMMERCE]: 0.1,
      [APP_CATEGORIES.MEDIA_PRODUCTION]: 0.7,
      [APP_CATEGORIES.CLOUD_STORAGE]: 0.3,
      [APP_CATEGORIES.SECURITY]: 0.2,
      [APP_CATEGORIES.UNKNOWN]: 0.0,
    };

    const activityTime = this.getActivityTimeByCategory();
    const breakdown = {} as Record<AppCategory, { time: number; weight: number; contribution: number }>;
    
    let totalWeightedTime = 0;
    let totalTime = 0;

    Object.entries(activityTime).forEach(([categoryKey, stats]) => {
      const category = categoryKey as AppCategory;
      const weight = PRODUCTIVITY_WEIGHTS[category] || 0;
      const contribution = stats.totalTime * weight;
      
      breakdown[category] = {
        time: stats.totalTime,
        weight: weight,
        contribution: contribution
      };
      
      totalWeightedTime += contribution;
      totalTime += stats.totalTime;
    });

    const score = totalTime > 0 ? (totalWeightedTime / totalTime) * 100 : 0;

    return {
      score: Math.round(score * 10) / 10, // 소수점 1자리까지
      breakdown
    };
  }
}

// 🔥 기가차드 싱글톤 윈도우 추적기
export const windowTracker = new WindowTracker();

// #DEBUG: Window tracker module exit point
Logger.debug('WINDOW_TRACKER', 'Window tracker module setup complete');

export default windowTracker;
