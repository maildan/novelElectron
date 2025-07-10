// 🔥 기가차드 Windows 윈도우 감지 전략 - 개선된 PowerShell 방식

import { BaseWindowDetectionStrategy } from './WindowDetectionStrategy';
import { WindowInfo, Result, AppCategory } from '../../../shared/types';
import { Logger } from '../../../shared/logger';
import { Platform } from '../../utils/platform';
import { 
  getAppCategory, 
  APP_CATEGORIES, 
  APP_CATEGORY_MAPPING,
  getCategoryStats,
  getAppsByCategory 
} from '../appCategories';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// 간소화된 Windows API 타입
interface User32API {
  GetForegroundWindow?: () => number;
  GetWindowTextW?: (hwnd: number, lpString: Buffer, nMaxCount: number) => number;
  GetWindowThreadProcessId?: (hwnd: number, lpdwProcessId: Buffer) => number;
  IsWindow?: (hwnd: number) => boolean;
  EnumWindows?: (lpEnumFunc: Function, lParam: number) => boolean;
}

/**
 * 🔥 Windows 윈도우 감지 전략
 * PowerShell과 ffi-napi를 활용한 안정적인 윈도우 감지
 */
export class WindowsWindowStrategy extends BaseWindowDetectionStrategy {
  public readonly strategyName = 'WindowsWindowStrategy';
  public readonly supportedPlatforms: NodeJS.Platform[] = ['win32'];
  
  private user32: User32API | null = null;
  private ffi: any = null;

  constructor() {
    super('WINDOWS_WINDOW_STRATEGY');
  }

  /**
   * 🔥 전략 초기화 - Windows 플랫폼 체크
   */
  async initialize(): Promise<Result<boolean>> {
    try {
      if (!Platform.isWindows()) {
        return { success: false, error: 'Windows platform required' };
      }

      // ffi-napi 동적 로드 시도
      try {
        this.ffi = require('ffi-napi');
        
        // user32.dll 함수들 로드
        this.user32 = this.ffi.Library('user32', {
          'GetForegroundWindow': ['pointer', []],
          'GetWindowTextW': ['int', ['pointer', 'pointer', 'int']],
          'GetWindowThreadProcessId': ['int', ['pointer', 'pointer']],
          'IsWindow': ['bool', ['pointer']],
          'EnumWindows': ['bool', ['pointer', 'int']],
        });

        Logger.info(this.componentName, '✅ ffi-napi 로드 성공');
      } catch (error) {
        Logger.warn(this.componentName, 'ffi-napi 사용 불가, PowerShell 방식 사용', error);
        this.user32 = null;
        this.ffi = null;
      }

      this.isInitialized = true;
      Logger.info(this.componentName, '✅ Windows 전략 초기화 완료');
      return { success: true, data: true };

    } catch (error) {
      Logger.error(this.componentName, '❌ 초기화 실패', error);
      return { success: false, error: `Initialization failed: ${error}` };
    }
  }

  /**
   * 🔥 현재 활성 윈도우 가져오기
   */
  async getCurrentActiveWindow(): Promise<Result<WindowInfo>> {
    const initCheck = this.ensureInitialized();
    if (!initCheck.success) {
      return { success: false, error: initCheck.error } as Result<WindowInfo>;
    }

    try {
      if (this.user32 && this.ffi) {
        // ffi-napi 방식
        return await this.getActiveWindowViaFFI();
      } else {
        // PowerShell 방식 (fallback)
        return await this.getActiveWindowViaPowerShell();
      }
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
      return { success: false, error: initCheck.error } as Result<WindowInfo[]>;
    }

    try {
      if (this.user32 && this.ffi) {
        // ffi-napi 방식
        return await this.getAllWindowsViaFFI();
      } else {
        // PowerShell 방식 (fallback)
        return await this.getAllWindowsViaPowerShell();
      }
    } catch (error) {
      return this.handleError(error, 'Get all open windows');
    }
  }

  /**
   * 🔥 ffi-napi를 통한 활성 윈도우 가져오기
   */
  private async getActiveWindowViaFFI(): Promise<Result<WindowInfo>> {
    if (!this.user32 || !this.ffi) {
      return { success: false, error: 'FFI not available' };
    }

    try {
      // 포그라운드 윈도우 핸들 가져오기
      const hwnd = this.user32.GetForegroundWindow?.();
      if (!hwnd || !this.user32.IsWindow?.(hwnd)) {
        return { success: false, error: 'No active window found' };
      }

      // 윈도우 정보 수집
      const windowInfo = await this.getWindowInfoByHandle(hwnd);
      if (!windowInfo.success) {
        return { success: false, error: windowInfo.error || 'Failed to get window info' };
      }

      // 🔥 IME 상태로 윈도우 정보 향상
      const enhancedWindowInfo = await this.enhanceWindowInfoWithIME(windowInfo.data!);

      // 검증 후 완전한 WindowInfo 반환
      const validationResult = this.validateWindowInfo(enhancedWindowInfo);
      if (!validationResult.success) {
        return { success: false, error: validationResult.error || 'Validation failed' };
      }

      return { success: true, data: validationResult.data! };

    } catch (error) {
      return this.handleError(error, 'FFI get active window');
    }
  }

  /**
   * 🔥 윈도우 핸들로부터 정보 수집
   */
  private async getWindowInfoByHandle(hwnd: number): Promise<Result<Partial<WindowInfo>>> {
    if (!this.user32 || !this.ffi) {
      return { success: false, error: 'FFI not available' };
    }

    try {
      // 윈도우 제목 가져오기 (안전한 호출)
      let title = 'Unknown';
      try {
        const titleBuffer = Buffer.alloc(512); // 256자 UTF-16
        const titleLength = this.user32.GetWindowTextW?.(hwnd, titleBuffer, 256);
        if (titleLength && titleLength > 0) {
          title = titleBuffer.toString('utf16le', 0, titleLength * 2).replace(/\0/g, '');
        }
      } catch (titleError) {
        Logger.warn(this.componentName, 'Failed to get window title', titleError);
      }

      // 프로세스 ID 가져오기 (안전한 호출)
      let processId = 0;
      try {
        const pidBuffer = Buffer.alloc(4);
        this.user32.GetWindowThreadProcessId?.(hwnd, pidBuffer);
        processId = pidBuffer.readUInt32LE(0);
      } catch (pidError) {
        Logger.warn(this.componentName, 'Failed to get process ID', pidError);
      }

      // 프로세스 이름 가져오기 (PowerShell 사용)
      const processName = await this.getProcessNameById(processId);

      const windowInfo: Partial<WindowInfo> = {
        id: hwnd,
        title: title || 'Unknown',
        owner: {
          name: processName || 'Unknown',
          processId,
          path: undefined, // TODO: 프로세스 경로 가져오기
        },
        bounds: { x: 0, y: 0, width: 0, height: 0 }, // TODO: 실제 윈도우 크기 가져오기
        memoryUsage: 0, // TODO: 메모리 사용량 가져오기
        
        // 🔥 Loop 전용 필드들 추가
        loopTimestamp: Date.now(),
        loopAppCategory: getAppCategory(processName || 'Unknown'),
        loopSessionId: `${processName}-${Date.now()}`,
        loopLanguageDetected: 'unknown', // IME 감지로 업데이트 예정
        loopIMEState: 'unknown',
        loopPlatformInfo: {
          platform: 'win32' as NodeJS.Platform,
          version: process.platform === 'win32' ? require('os').release() : 'unknown',
          architecture: process.arch
        },
        loopPermissions: {
          accessibility: true, // Windows는 특별한 권한 불필요
          screenRecording: true,
          inputMonitoring: true
        },
        loopSessionMetadata: {
          startTime: Date.now(),
          totalKeystrokes: 0,
          activeTime: 0,
          idleTime: 0
        }
      };

      return { success: true, data: windowInfo };

    } catch (error) {
      return this.handleError(error, 'Get window info by handle');
    }
  }

  /**
   * 🔥 PowerShell을 통한 활성 윈도우 가져오기 (fallback)
   */
  private async getActiveWindowViaPowerShell(): Promise<Result<WindowInfo>> {
    try {
      // PowerShell 명령 준비
      const powershellCmd = `
        Add-Type @"
          using System;
          using System.Runtime.InteropServices;
          using System.Text;
          
          public class WindowAPI {
            [DllImport("user32.dll")]
            public static extern IntPtr GetForegroundWindow();
            
            [DllImport("user32.dll")]
            public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
            
            [DllImport("user32.dll")]
            public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
          }
"@

        $hwnd = [WindowAPI]::GetForegroundWindow()
        $pid = 0
        [void][WindowAPI]::GetWindowThreadProcessId($hwnd, [ref]$pid)
        
        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
        $title = ""
        
        if ($process) {
          $sb = New-Object System.Text.StringBuilder(256)
          [void][WindowAPI]::GetWindowText($hwnd, $sb, $sb.Capacity)
          $title = $sb.ToString()
          
          # 결과를 JSON으로 출력
          $result = @{
            id = $hwnd.ToInt64()
            title = $title
            processId = $pid
            processName = $process.ProcessName
          }
          
          $result | ConvertTo-Json -Compress
        } else {
          # 프로세스를 찾을 수 없는 경우 기본값 반환
          @{
            id = 0
            title = "Unknown Window"
            processId = 0
            processName = "Unknown"
          } | ConvertTo-Json -Compress
        }
      `;

      // PowerShell 명령 실행
      Logger.debug(this.componentName, '🚀 PowerShell 명령 실행');
      const { stdout, stderr } = await execAsync(`powershell -Command "${powershellCmd}"`, {
        maxBuffer: 1024 * 1024, // 1MB 버퍼 증가
        timeout: 5000 // 5초 타임아웃
      });
      
      // 에러 로그
      if (stderr) {
        Logger.warn(this.componentName, '⚠️ PowerShell stderr 출력', { stderr });
      }

      // 출력값 확인 및 기본값 처리
      if (!stdout || stdout.trim() === '') {
        Logger.warn(this.componentName, '⚠️ 빈 PowerShell 출력');
        
        // 기본값 제공
        return {
          success: true,
          data: {
            id: 0,
            title: '🔄 Window Detection (Empty Output)',
            owner: {
              name: 'System',
              processId: 0
            },
            bounds: { x: 0, y: 0, width: 0, height: 0 },
            isMinimized: false,
            isMaximized: false,
            appCategory: APP_CATEGORIES.SYSTEM
          }
        };
      }

      // 결과 파싱
      let result: any = {};
      let jsonStr = stdout;
      
      // PowerShell 출력 디버그 로깅
      Logger.debug(this.componentName, '👉 PowerShell 출력 변환 전', {
        rawOutput: stdout?.substring(0, 200),
        length: stdout?.length || 0
      });
      
      try {
        // PowerShell 출력 정리 (앞뒤 줄바꿈 및 공백 제거)
        jsonStr = jsonStr.replace(/^\s*[\r\n]+/, '').trim();
        
        // 첫 번째 { 위치와 마지막 } 위치 찾기
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');
        
        if (firstBrace >= 0 && lastBrace > firstBrace) {
          // JSON 객체 부분만 추출
          jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }
        
        // 빈 출력 검사 및 기본값 제공
        if (!jsonStr || jsonStr.length === 0) {
          throw new Error('빈 PowerShell 출력');
        }
        
        // 디버깅을 위한 정제된 JSON 로깅
        Logger.debug(this.componentName, '🔄 정제된 JSON 문자열', { 
          jsonStr: jsonStr.substring(0, 200),
          length: jsonStr.length
        });
        
        // 추가 안전장치: JSON 파싱 시도 전 유효성 확인
        if (!jsonStr.startsWith('{') || !jsonStr.endsWith('}')) {
          throw new Error('유효하지 않은 JSON 형식');
        }
        
        result = JSON.parse(jsonStr);
      } catch (jsonError) {
        Logger.error(this.componentName, '❌ PowerShell JSON 파싱 실패', { 
          stdout: stdout?.substring(0, 200), 
          error: jsonError,
          errorType: jsonError instanceof Error ? jsonError.name : 'Unknown'
        });
        // 기본값 제공 - 오류 안전성 향상
        result = {
          id: 0,
          title: '⚠️ Window Detection Error',
          processId: 0,
          processName: 'PowerShell Error'
        };
        
        // 오류 발생 시 재시도 계획 로그
        Logger.info(this.componentName, '⚠️ PowerShell 감지 실패, 다음 주기에 재시도');
      }

      // 프로세스 이름에서 불필요한 문자 제거 및 정규화
      const normalizedProcessName = (result.processName || 'Unknown')
        .replace(/\.exe$/i, '')  // .exe 확장자 제거
        .toLowerCase();            // 소문자로 통일
      
      // 앱 카테고리 할당 (기본값 방지)
      const processTitle = result.title || 'Unknown';
      const appCategory = getAppCategory(normalizedProcessName);
      
      // 🔥 앱 카테고리 매핑 향상된 로깅
      Logger.debug(this.componentName, '🔍 앱 카테고리 매핑', { 
        processName: normalizedProcessName,
        processTitle: processTitle?.substring(0, 30),
        category: appCategory
      });
      
      // 🔥 생산성 통계를 위한 추가 로깅 (유용한 통계 정보)
      const isProductivityApp = [
        APP_CATEGORIES.DEVELOPMENT, 
        APP_CATEGORIES.CREATIVE_WRITING,
        APP_CATEGORIES.OFFICE,
        APP_CATEGORIES.NOTE_TAKING,
        APP_CATEGORIES.WRITING_TOOLS
      ].includes(appCategory as any);
      
      if (isProductivityApp) {
        Logger.info(this.componentName, '📊 생산성 앱 감지됨', {
          app: normalizedProcessName,
          title: processTitle?.substring(0, 30),
          category: appCategory,
          timestamp: new Date().toISOString()
        });
      }

      const windowInfo: Partial<WindowInfo> = {
        id: result.id || 0,
        title: result.title || 'Unknown',
        owner: {
          name: result.processName || 'Unknown',
          processId: result.processId || 0,
        },
        bounds: { x: 0, y: 0, width: 0, height: 0 },
        memoryUsage: 0,
        
        // 🔥 Loop 전용 필드들 추가 (PowerShell 방식)
        loopTimestamp: Date.now(),
        loopAppCategory: appCategory,
        loopSessionId: `${normalizedProcessName}-${Date.now()}`,
        loopLanguageDetected: 'unknown',
        loopIMEState: 'unknown',
        loopPlatformInfo: {
          platform: 'win32' as NodeJS.Platform,
          version: require('os').release(),
          architecture: process.arch
        },
        loopPermissions: {
          accessibility: true,
          screenRecording: true,
          inputMonitoring: true
        },
        loopSessionMetadata: {
          startTime: Date.now(),
          totalKeystrokes: 0,
          activeTime: 0,
          idleTime: 0
        }
      };

      // 🔥 IME 상태로 윈도우 정보 향상
      const enhancedWindowInfo = await this.enhanceWindowInfoWithIME(windowInfo);

      return this.validateWindowInfo(enhancedWindowInfo);

    } catch (error) {
      return this.handleError(error, 'PowerShell get active window');
    }
  }

  /**
   * 🔥 프로세스 ID로 프로세스 이름 가져오기
   */
  private async getProcessNameById(processId: number): Promise<string> {
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);

      const { stdout } = await execAsync(`powershell -Command "Get-Process -Id ${processId} | Select-Object -ExpandProperty ProcessName"`);
      return stdout.trim() || 'Unknown';
    } catch {
      return 'Unknown';
    }
  }

  /**
   * 🔥 ffi-napi를 통한 모든 윈도우 가져오기
   */
  private async getAllWindowsViaFFI(): Promise<Result<WindowInfo[]>> {
    // TODO: EnumWindows API 사용하여 모든 윈도우 수집
    return { success: false, error: 'Not implemented yet' };
  }

  /**
   * 🔥 PowerShell을 통한 모든 윈도우 가져오기
   */
  private async getAllWindowsViaPowerShell(): Promise<Result<WindowInfo[]>> {
    // TODO: PowerShell을 사용하여 모든 윈도우 수집
    return { success: false, error: 'Not implemented yet' };
  }

  /**
   * 🔥 윈도우 변경 감지 지원 여부
   */
  supportsWindowChangeDetection(): boolean {
    return false; // Windows API는 폴링 방식 사용
  }

  /**
   * 🔥 권한 확인
   */
  async checkPermissions(): Promise<Result<boolean>> {
    // Windows에서는 특별한 권한이 필요하지 않음
    return { success: true, data: true };
  }

  /**
   * 🔥 리소스 정리
   */
  async cleanup(): Promise<void> {
    this.user32 = null;
    this.ffi = null;
    this.isInitialized = false;
    Logger.info(this.componentName, 'Windows strategy cleaned up');
  }

  /**
   * 🔥 윈도우 정보에 IME 상태 추가
   */
  private async enhanceWindowInfoWithIME(windowInfo: Partial<WindowInfo>): Promise<Partial<WindowInfo>> {
    try {
      // Windows에서만 동적으로 언어 감지기 로드
      let imeState: 'enabled' | 'disabled' | 'unknown' = 'unknown';
      let languageDetected = 'unknown';
      
      // 앱 카테고리 로깅
      Logger.debug(this.componentName, '🔍 앱 카테고리 세부 정보', {
        processName: windowInfo.owner?.name,
        category: windowInfo.loopAppCategory,
        title: windowInfo.title?.substring(0, 50)
      });
      
      if (Platform.isWindows()) {
        try {
          // 동적 import로 Windows 전용 모듈 로드
          const { windowsLanguageDetector } = await import('../detectors/windows/WindowsLanguageDetector');
          
          if (windowsLanguageDetector) {
            const detectedIME = await windowsLanguageDetector.detectIMEState();
            const hangulMode = await windowsLanguageDetector.detectHangulInputMode();
            
            imeState = detectedIME.isIMEActive ? 'enabled' : 'disabled';
            languageDetected = hangulMode.isHangulMode ? 'hangul' : 'english';
          } else {
            Logger.warn(this.componentName, 'Windows 언어 감지기가 null임');
          }
        } catch (dynamicImportError) {
          Logger.warn(this.componentName, 'Windows 언어 감지기 동적 로드 실패', dynamicImportError);
        }
      }
      
      const baseMetadata = {
        startTime: Date.now(),
        totalKeystrokes: 0,
        activeTime: 0,
        idleTime: 0,
        ...windowInfo.loopSessionMetadata
      };
      
      return {
        ...windowInfo,
        loopLanguageDetected: languageDetected,
        loopIMEState: imeState,
        loopSessionMetadata: baseMetadata
      };
    } catch (error) {
      Logger.warn(this.componentName, 'IME 상태 감지 실패', error);
      return windowInfo;
    }
  }
}
