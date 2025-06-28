import { BaseManager } from '../common/BaseManager';
import { Logger } from '../../shared/logger';
import { WindowInfo } from '../../shared/types';
import { EventEmitter } from 'events';
import { Platform } from '../utils/platform';
import { APP_CATEGORIES } from '../settings/defaults';
import * as path from 'path';

// macOS용 네이티브 모듈 (실제로는 addon이나 exec 사용)
declare const process: NodeJS.Process;

/**
 * 🔥 AppDetector - 활성 애플리케이션 감지 및 윈도우 정보 추적
 * 현재 활성화된 애플리케이션을 감지하고 윈도우 변경사항을 모니터링
 */
export class AppDetector extends BaseManager {
  private readonly componentName = 'APP_DETECTOR';
  private currentActiveWindow: WindowInfo | null = null;
  private windowCheckInterval: NodeJS.Timeout | null = null;
  private readonly windowCheckIntervalMs = 1000; // 1초마다 체크
  private lastWindowTitle = '';
  private windowChangeCount = 0;

  // 🔥 Settings와 통합된 앱 카테고리 (중앙화됨)
  private readonly appCategories = APP_CATEGORIES;

  constructor() {
    super({
      name: 'AppDetector',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 2000
    });
    Logger.info(this.componentName, 'AppDetector initialized');
  }

  /**
   * BaseManager 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'Initializing AppDetector');
    
    // 초기 활성 윈도우 감지
    try {
      const window = await this.detectActiveWindow();
      if (window) {
        this.currentActiveWindow = window;
        Logger.info(this.componentName, 'Initial active window detected', {
          title: window.title,
          processName: window.processName,
          pid: window.pid
        });
      }
    } catch (error) {
      Logger.warn(this.componentName, 'Failed to detect initial active window', error);
    }
  }

  /**
   * BaseManager 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'Starting window monitoring');
    
    // 주기적 윈도우 체크 시작
    this.windowCheckInterval = setInterval(async () => {
      try {
        await this.checkWindowChange();
      } catch (error) {
        Logger.error(this.componentName, 'Window check failed', error);
      }
    }, this.windowCheckIntervalMs);

    Logger.info(this.componentName, 'Window monitoring started', {
      intervalMs: this.windowCheckIntervalMs
    });
  }

  /**
   * BaseManager 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'Stopping window monitoring');
    
    if (this.windowCheckInterval) {
      clearInterval(this.windowCheckInterval);
      this.windowCheckInterval = null;
    }
    
    Logger.info(this.componentName, 'Window monitoring stopped');
  }

  /**
   * BaseManager 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'Cleaning up AppDetector');
    await this.doStop();
    this.currentActiveWindow = null;
    this.lastWindowTitle = '';
    this.windowChangeCount = 0;
    Logger.info(this.componentName, 'AppDetector cleanup completed');
  }

  /**
   * 윈도우 변경 체크
   */
  private async checkWindowChange(): Promise<void> {
    try {
      const activeWindow = await this.detectActiveWindow();
      
      if (!activeWindow) {
        return;
      }

      // 윈도우 변경 감지
      const hasChanged = this.hasWindowChanged(activeWindow);
      
      if (hasChanged) {
        const previousWindow = this.currentActiveWindow;
        this.currentActiveWindow = activeWindow;
        this.lastWindowTitle = activeWindow.title;
        this.windowChangeCount++;

        Logger.info(this.componentName, 'Window changed', {
          from: previousWindow ? {
            title: previousWindow.title,
            processName: previousWindow.processName
          } : null,
          to: {
            title: activeWindow.title,
            processName: activeWindow.processName,
            category: this.categorizeApp(activeWindow.processName)
          },
          changeCount: this.windowChangeCount
        });

        // 윈도우 변경 이벤트 발생
        this.emit('windowChanged', {
          previousWindow,
          currentWindow: activeWindow,
          timestamp: new Date(),
          category: this.categorizeApp(activeWindow.processName)
        });
      }

    } catch (error) {
      Logger.error(this.componentName, 'Failed to check window change', error);
    }
  }

  /**
   * 활성 윈도우 감지
   */
  private async detectActiveWindow(): Promise<WindowInfo | null> {
    try {
      // 플랫폼별 구현
      if (Platform.isMacOS()) {
        return await this.detectActiveWindowMacOS();
      } else if (Platform.isWindows()) {
        return await this.detectActiveWindowWindows();
      } else if (Platform.isLinux()) {
        return await this.detectActiveWindowLinux();
      } else {
        throw new Error(`Unsupported platform: ${Platform.current().platform}`);
      }
    } catch (error) {
      Logger.error(this.componentName, 'Failed to detect active window', error);
      return null;
    }
  }

  /**
   * macOS 활성 윈도우 감지
   */
  private async detectActiveWindowMacOS(): Promise<WindowInfo | null> {
    try {
      // AppleScript를 사용한 활성 윈도우 감지
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      const script = `
        tell application "System Events"
          set frontApp to first application process whose frontmost is true
          set windowTitle to ""
          try
            set windowTitle to name of front window of frontApp
          end try
          return (name of frontApp) & "|||" & windowTitle & "|||" & (unix id of frontApp)
        end tell
      `;

      const { stdout } = await execAsync(`osascript -e '${script}'`);
      const [processName, windowTitle, pidStr] = stdout.trim().split('|||');

      if (!processName) {
        return null;
      }

      return {
        title: windowTitle || processName,
        processName: processName,
        pid: parseInt(pidStr) || 0
      };

    } catch (error) {
      Logger.error(this.componentName, 'macOS window detection failed', error);
      return null;
    }
  }

  /**
   * Windows 활성 윈도우 감지
   */
  private async detectActiveWindowWindows(): Promise<WindowInfo | null> {
    try {
      // PowerShell을 사용한 활성 윈도우 감지
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      const script = `
        Add-Type @"
        using System;
        using System.Runtime.InteropServices;
        using System.Text;
        public class Win32 {
          [DllImport("user32.dll")]
          public static extern IntPtr GetForegroundWindow();
          [DllImport("user32.dll")]
          public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
          [DllImport("user32.dll")]
          public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);
        }
"@
        $hwnd = [Win32]::GetForegroundWindow()
        $title = New-Object StringBuilder 256
        [Win32]::GetWindowText($hwnd, $title, 256)
        $processId = 0
        [Win32]::GetWindowThreadProcessId($hwnd, [ref]$processId)
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        Write-Output "$($process.ProcessName)|||$($title.ToString())|||$processId"
      `;

      const { stdout } = await execAsync(`powershell -Command "${script}"`);
      const [processName, windowTitle, pidStr] = stdout.trim().split('|||');

      if (!processName) {
        return null;
      }

      return {
        title: windowTitle || processName,
        processName: processName,
        pid: parseInt(pidStr) || 0
      };

    } catch (error) {
      Logger.error(this.componentName, 'Windows window detection failed', error);
      return null;
    }
  }

  /**
   * Linux 활성 윈도우 감지
   */
  private async detectActiveWindowLinux(): Promise<WindowInfo | null> {
    try {
      // xdotool을 사용한 활성 윈도우 감지
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      // 활성 윈도우 ID 가져오기
      const { stdout: windowId } = await execAsync('xdotool getactivewindow');
      
      // 윈도우 제목 가져오기
      const { stdout: windowTitle } = await execAsync(`xdotool getwindowname ${windowId.trim()}`);
      
      // 프로세스 ID 가져오기
      const { stdout: pidStr } = await execAsync(`xdotool getwindowpid ${windowId.trim()}`);
      const pid = parseInt(pidStr.trim());
      
      // 프로세스 이름 가져오기
      const { stdout: processName } = await execAsync(`ps -p ${pid} -o comm=`);

      return {
        title: windowTitle.trim(),
        processName: processName.trim(),
        pid: pid
      };

    } catch (error) {
      Logger.error(this.componentName, 'Linux window detection failed', error);
      return null;
    }
  }

  /**
   * 윈도우 변경 여부 확인
   */
  private hasWindowChanged(newWindow: WindowInfo): boolean {
    if (!this.currentActiveWindow) {
      return true;
    }

    return (
      this.currentActiveWindow.title !== newWindow.title ||
      this.currentActiveWindow.processName !== newWindow.processName ||
      this.currentActiveWindow.pid !== newWindow.pid
    );
  }

  /**
   * 애플리케이션 카테고리 분류
   */
  private categorizeApp(processName: string): string {
    // 🔥 Settings defaults.ts와 완벽 호환되도록 수정
    for (const [categoryKey, apps] of Object.entries(this.appCategories)) {
      if (apps.some(app => processName.toLowerCase().includes(app.toLowerCase()))) {
        return categoryKey.toLowerCase(); // DEVELOPMENT -> development
      }
    }
    return 'other';
  }

  /**
   * 현재 활성 윈도우 반환
   */
  public getCurrentActiveWindow(): WindowInfo | null {
    return this.currentActiveWindow;
  }

  /**
   * 윈도우 변경 횟수 반환
   */
  public getWindowChangeCount(): number {
    return this.windowChangeCount;
  }

  /**
   * 애플리케이션 카테고리 반환
   */
  public getAppCategory(processName: string): string {
    return this.categorizeApp(processName);
  }

  /**
   * 강제 윈도우 감지 (즉시 실행)
   */
  public async forceDetection(): Promise<WindowInfo | null> {
    Logger.debug(this.componentName, 'Force detecting active window');
    
    try {
      const window = await this.detectActiveWindow();
      if (window && this.hasWindowChanged(window)) {
        await this.checkWindowChange();
      }
      return window;
    } catch (error) {
      Logger.error(this.componentName, 'Force detection failed', error);
      return null;
    }
  }
}
