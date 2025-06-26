/**
 * 🔥 기가차드 앱 감지기
 * Loop Advanced App Detector - 활성 앱 감지 & 윈도우 추적
 */

import { EventEmitter } from 'events';
import { execSync } from 'child_process';
import { KEYBOARD_CONSTANTS } from '../constants';
import { Logger } from '../../../shared/logger';

export interface AppInfo {
  appName: string;
  windowTitle?: string;
  bundleId?: string;
  processId?: number;
}

/**
 * 🔥 기가차드 앱 감지기
 */
export class AppDetector extends EventEmitter {
  private lastActiveApp = '';
  private lastWindowTitle = '';
  private activeAppCheckTimer: NodeJS.Timeout | null = null;
  private isDetectionActive = false;

  constructor() {
    super();
    Logger.info('AppDetector', '🔥 앱 감지기 생성됨');
  }

  /**
   * 앱 감지 시작
   */
  public startDetection(): void {
    if (this.isDetectionActive) return;

    this.isDetectionActive = true;
    this.activeAppCheckTimer = setInterval(() => {
      this.checkActiveApp();
    }, KEYBOARD_CONSTANTS.PERMISSION_CHECK_INTERVAL);

    Logger.info('AppDetector', '🔍 앱 감지 시작됨');
  }

  /**
   * 앱 감지 중지
   */
  public stopDetection(): void {
    if (!this.isDetectionActive) return;

    this.isDetectionActive = false;
    if (this.activeAppCheckTimer) {
      clearInterval(this.activeAppCheckTimer);
      this.activeAppCheckTimer = null;
    }

    Logger.info('AppDetector', '🛑 앱 감지 중지됨');
  }

  /**
   * 현재 활성 앱 정보 가져오기
   */
  public async getCurrentAppInfo(): Promise<AppInfo> {
    try {
      const platform = process.platform;
      
      switch (platform) {
        case 'darwin':
          return await this.getMacOSAppInfo();
        case 'win32':
          return await this.getWindowsAppInfo();
        case 'linux':
          return await this.getLinuxAppInfo();
        default:
          return { appName: 'Unknown Platform' };
      }
    } catch (error) {
      Logger.error('AppDetector', '앱 정보 가져오기 실패', error);
      return { appName: 'Unknown App' };
    }
  }

  /**
   * 활성 앱 체크
   */
  private checkActiveApp(): void {
    this.getCurrentAppInfo().then(appInfo => {
      // 앱이 변경되었는지 체크
      if (appInfo.appName !== this.lastActiveApp || appInfo.windowTitle !== this.lastWindowTitle) {
        this.lastActiveApp = appInfo.appName;
        this.lastWindowTitle = appInfo.windowTitle || '';
        
        Logger.debug('AppDetector', `📱 앱 변경 감지: ${appInfo.appName} - ${appInfo.windowTitle}`);
        this.emit('app-changed', appInfo);
      }
    }).catch(error => {
      Logger.error('AppDetector', '활성 앱 체크 실패', error);
    });
  }

  /**
   * macOS 앱 정보 가져오기
   */
  private async getMacOSAppInfo(): Promise<AppInfo> {
    try {
      const script = `
        tell application "System Events"
          set frontApp to first application process whose frontmost is true
          set appName to name of frontApp
          set windowTitle to ""
          try
            set windowTitle to name of first window of frontApp
          end try
          return appName & "|" & windowTitle
        end tell
      `;
      
      const result = execSync(`osascript -e '${script}'`, { 
        encoding: 'utf8', 
        timeout: 5000 
      }).trim();
      
      const [appName, windowTitle] = result.split('|');
      
      return {
        appName: appName || 'Unknown',
        windowTitle: windowTitle || undefined
      };
    } catch (error) {
      Logger.warn('AppDetector', 'macOS 앱 정보 가져오기 실패', error);
      return { appName: 'macOS App' };
    }
  }

  /**
   * Windows 앱 정보 가져오기
   */
  private async getWindowsAppInfo(): Promise<AppInfo> {
    try {
      // PowerShell을 사용하여 활성 윈도우 정보 가져오기
      const script = `
        Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Win32 { [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow(); [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder text, int count); [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId); }'
        $hwnd = [Win32]::GetForegroundWindow()
        $title = New-Object System.Text.StringBuilder 256
        [Win32]::GetWindowText($hwnd, $title, 256)
        $processId = 0
        [Win32]::GetWindowThreadProcessId($hwnd, [ref]$processId)
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        if ($process) { Write-Output "$($process.ProcessName)|$($title.ToString())" } else { Write-Output "Unknown|Unknown" }
      `;
      
      const result = execSync(`powershell -Command "${script}"`, { 
        encoding: 'utf8', 
        timeout: 5000 
      }).trim();
      
      const [appName, windowTitle] = result.split('|');
      
      return {
        appName: appName || 'Windows App',
        windowTitle: windowTitle || undefined
      };
    } catch (error) {
      Logger.warn('AppDetector', 'Windows 앱 정보 가져오기 실패', error);
      return { appName: 'Windows App' };
    }
  }

  /**
   * Linux 앱 정보 가져오기
   */
  private async getLinuxAppInfo(): Promise<AppInfo> {
    try {
      // xdotool을 사용하여 활성 윈도우 정보 가져오기
      const windowId = execSync('xdotool getactivewindow', { 
        encoding: 'utf8', 
        timeout: 5000 
      }).trim();
      
      const windowTitle = execSync(`xdotool getwindowname ${windowId}`, { 
        encoding: 'utf8', 
        timeout: 5000 
      }).trim();
      
      const pid = execSync(`xdotool getwindowpid ${windowId}`, { 
        encoding: 'utf8', 
        timeout: 5000 
      }).trim();
      
      const appName = execSync(`ps -p ${pid} -o comm=`, { 
        encoding: 'utf8', 
        timeout: 5000 
      }).trim();
      
      return {
        appName: appName || 'Linux App',
        windowTitle: windowTitle || undefined,
        processId: parseInt(pid)
      };
    } catch (error) {
      Logger.warn('AppDetector', 'Linux 앱 정보 가져오기 실패', error);
      return { appName: 'Linux App' };
    }
  }

  /**
   * 감지 상태 확인
   */
  public isActive(): boolean {
    return this.isDetectionActive;
  }

  /**
   * 마지막 활성 앱 정보 가져오기
   */
  public getLastAppInfo(): AppInfo {
    return {
      appName: this.lastActiveApp,
      windowTitle: this.lastWindowTitle || undefined
    };
  }

  /**
   * 정리
   */
  public cleanup(): void {
    this.stopDetection();
    this.removeAllListeners();
    Logger.info('AppDetector', '🧹 앱 감지기 정리 완료');
  }
}
