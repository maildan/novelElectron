// 🔥 기가차드 키보드 권한 관리자 - 크로스 플랫폼 권한 처리

import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { Platform } from '../utils/platform';
import type { Result } from '../../shared/types';

/**
 * 🔥 KeyboardPermissionManager - 키보드 접근 권한 전문 관리
 * 
 * 책임:
 * - macOS/Windows/Linux 권한 요청
 * - 권한 상태 모니터링
 * - 권한 관련 에러 처리
 * - 사용자 가이드 제공
 */
export class KeyboardPermissionManager extends BaseManager {
  private readonly componentName = 'KEYBOARD_PERMISSION_MANAGER';
  
  private hasAccessibilityPermission = false;
  private isRequestingPermissions = false;
  private permissionCheckInterval: NodeJS.Timeout | null = null;
  private readonly checkIntervalMs = 5000; // 5초마다 권한 상태 확인

  constructor() {
    super({
      name: 'KeyboardPermissionManager',
      autoStart: false
    });
    
    Logger.info(this.componentName, '키보드 권한 관리자 초기화됨');
  }

  /**
   * BaseManager 구현
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, '키보드 권한 관리자 초기화 시작');
    
    // 초기 권한 상태 확인
    const permissionResult = await this.checkPermissions();
    if (permissionResult.success && permissionResult.data) {
      this.hasAccessibilityPermission = permissionResult.data;
    }
  }

  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, '키보드 권한 관리자 시작됨');
    
    // 권한 상태 주기적 모니터링 시작
    this.startPermissionMonitoring();
  }

  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, '키보드 권한 관리자 중지됨');
    
    // 권한 모니터링 중지
    this.stopPermissionMonitoring();
  }

  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, '키보드 권한 관리자 정리됨');
    
    this.stopPermissionMonitoring();
    this.hasAccessibilityPermission = false;
    this.isRequestingPermissions = false;
  }

  /**
   * 🔥 권한 요청 (플랫폼별 처리)
   */
  public async requestPermissions(): Promise<Result<boolean>> {
    if (this.isRequestingPermissions) {
      return {
        success: false,
        error: '이미 권한 요청이 진행 중입니다.'
      };
    }

    this.isRequestingPermissions = true;
    
    try {
      Logger.info(this.componentName, '키보드 접근 권한 요청 시작', {
        platform: Platform.getPlatformName()
      });

      let hasPermission = false;

      if (Platform.isMacOS()) {
        hasPermission = await this.requestMacOSPermissions();
      } else if (Platform.isWindows()) {
        hasPermission = await this.requestWindowsPermissions();
      } else if (Platform.isLinux()) {
        hasPermission = await this.requestLinuxPermissions();
      } else {
        Logger.warn(this.componentName, '알 수 없는 플랫폼, 권한 체크 스킵');
        hasPermission = true; // 폴백으로 허용
      }

      this.hasAccessibilityPermission = hasPermission;

      if (hasPermission) {
        Logger.info(this.componentName, '✅ 키보드 접근 권한 획득 성공');
        this.emit('permission-granted');
      } else {
        Logger.warn(this.componentName, '❌ 키보드 접근 권한 거부됨');
        this.emit('permission-denied');
      }

      return {
        success: true,
        data: hasPermission
      };

    } catch (error) {
      Logger.error(this.componentName, '권한 요청 중 오류 발생', error);
      
      return {
        success: false,
        error: `권한 요청 실패: ${String(error)}`
      };
    } finally {
      this.isRequestingPermissions = false;
    }
  }

  /**
   * 🔥 권한 상태 확인
   */
  public async checkPermissions(): Promise<Result<boolean>> {
    try {
      let hasPermission = false;

      if (Platform.isMacOS()) {
        hasPermission = await this.checkMacOSPermissions();
      } else if (Platform.isWindows()) {
        hasPermission = await this.checkWindowsPermissions();
      } else if (Platform.isLinux()) {
        hasPermission = await this.checkLinuxPermissions();
      } else {
        hasPermission = true; // 폴백으로 허용
      }

      this.hasAccessibilityPermission = hasPermission;

      return {
        success: true,
        data: hasPermission
      };

    } catch (error) {
      Logger.error(this.componentName, '권한 확인 중 오류 발생', error);
      
      return {
        success: false,
        error: `권한 확인 실패: ${String(error)}`
      };
    }
  }

  /**
   * 🔥 macOS 권한 요청
   */
  private async requestMacOSPermissions(): Promise<boolean> {
    try {
      // macOS에서는 시스템 환경설정으로 안내
      Logger.info(this.componentName, 'macOS 접근성 권한 안내 표시');
      
      // TODO: 실제 구현에서는 Electron dialog로 사용자 안내
      // const { shell } = require('electron');
      // await shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility');
      
      // 권한 확인 (실제로는 네이티브 모듈 필요)
      return await this.checkMacOSPermissions();
      
    } catch (error) {
      Logger.error(this.componentName, 'macOS 권한 요청 실패', error);
      return false;
    }
  }

  /**
   * 🔥 macOS 권한 확인
   */
  private async checkMacOSPermissions(): Promise<boolean> {
    try {
      // TODO: 실제 구현에서는 네이티브 모듈로 접근성 권한 확인
      // const nativeModule = require('./native/macos');
      // return nativeModule.checkAccessibilityPermission();
      
      // 임시: uIOhook 테스트로 권한 확인
      const testResult = await this.testKeyboardAccess();
      return testResult;
      
    } catch (error) {
      Logger.error(this.componentName, 'macOS 권한 확인 실패', error);
      return false;
    }
  }

  /**
   * 🔥 Windows 권한 요청
   */
  private async requestWindowsPermissions(): Promise<boolean> {
    try {
      // Windows에서는 보통 관리자 권한으로 실행하면 됨
      Logger.info(this.componentName, 'Windows 키보드 권한 확인');
      
      return await this.checkWindowsPermissions();
      
    } catch (error) {
      Logger.error(this.componentName, 'Windows 권한 요청 실패', error);
      return false;
    }
  }

  /**
   * 🔥 Windows 권한 확인
   */
  private async checkWindowsPermissions(): Promise<boolean> {
    try {
      // TODO: Windows 특화 권한 확인 로직
      const testResult = await this.testKeyboardAccess();
      return testResult;
      
    } catch (error) {
      Logger.error(this.componentName, 'Windows 권한 확인 실패', error);
      return false;
    }
  }

  /**
   * 🔥 Linux 권한 요청
   */
  private async requestLinuxPermissions(): Promise<boolean> {
    try {
      // Linux에서는 보통 사용자 그룹 확인
      Logger.info(this.componentName, 'Linux 키보드 권한 확인');
      
      return await this.checkLinuxPermissions();
      
    } catch (error) {
      Logger.error(this.componentName, 'Linux 권한 요청 실패', error);
      return false;
    }
  }

  /**
   * 🔥 Linux 권한 확인
   */
  private async checkLinuxPermissions(): Promise<boolean> {
    try {
      // TODO: Linux 특화 권한 확인 로직
      const testResult = await this.testKeyboardAccess();
      return testResult;
      
    } catch (error) {
      Logger.error(this.componentName, 'Linux 권한 확인 실패', error);
      return false;
    }
  }

  /**
   * 🔥 키보드 접근 테스트 (일반적인 방법)
   */
  private async testKeyboardAccess(): Promise<boolean> {
    try {
      // 🔥 uIOhook-napi 올바른 사용법 - uIOhook 객체에서 접근
      const uiohookModule = require('uiohook-napi');
      const uIOhook = uiohookModule.uIOhook;
      
      // 필수 함수 존재 확인
      if (typeof uIOhook.start !== 'function' || typeof uIOhook.stop !== 'function') {
        Logger.error(this.componentName, 'uIOhook 필수 함수가 없습니다', {
          hasStart: typeof uIOhook.start,
          hasStop: typeof uIOhook.stop,
          availableMethods: Object.getOwnPropertyNames(Object.getPrototypeOf(uIOhook))
        });
        return false;
      }
      
      return new Promise<boolean>((resolve) => {
        let testCompleted = false;
        
        const testTimeout = setTimeout(() => {
          if (!testCompleted) {
            testCompleted = true;
            try {
              uIOhook.stop();
            } catch (e) {
              // cleanup 에러 무시
            }
            Logger.warn(this.componentName, '키보드 접근 테스트 타임아웃');
            resolve(false);
          }
        }, 3000); // 3초 타임아웃
        
        try {
          // 🔥 올바른 uIOhook 사용법
          uIOhook.start();
          uIOhook.stop();
          
          if (!testCompleted) {
            testCompleted = true;
            clearTimeout(testTimeout);
            Logger.info(this.componentName, '키보드 접근 테스트 성공');
            resolve(true);
          }
        } catch (error) {
          if (!testCompleted) {
            testCompleted = true;
            clearTimeout(testTimeout);
            Logger.error(this.componentName, '키보드 접근 테스트 실패', error);
            resolve(false);
          }
        }
      });
      
    } catch (error) {
      Logger.error(this.componentName, '키보드 접근 테스트 중 오류', error);
      return false;
    }
  }

  /**
   * 🔥 권한 모니터링 시작
   */
  private startPermissionMonitoring(): void {
    if (this.permissionCheckInterval) {
      clearInterval(this.permissionCheckInterval);
    }

    this.permissionCheckInterval = setInterval(async () => {
      const result = await this.checkPermissions();
      if (result.success && result.data !== undefined) {
        const currentPermission = result.data;
        
        if (currentPermission !== this.hasAccessibilityPermission) {
          Logger.info(this.componentName, '권한 상태 변경 감지됨', {
            previous: this.hasAccessibilityPermission,
            current: currentPermission
          });
          
          this.hasAccessibilityPermission = currentPermission;
          this.emit('permission-changed', currentPermission);
        }
      }
    }, this.checkIntervalMs);

    Logger.debug(this.componentName, '권한 모니터링 시작됨');
  }

  /**
   * 🔥 권한 모니터링 중지
   */
  private stopPermissionMonitoring(): void {
    if (this.permissionCheckInterval) {
      clearInterval(this.permissionCheckInterval);
      this.permissionCheckInterval = null;
      Logger.debug(this.componentName, '권한 모니터링 중지됨');
    }
  }

  /**
   * 🔥 현재 권한 상태 조회
   */
  public hasPermission(): boolean {
    return this.hasAccessibilityPermission;
  }

  /**
   * 🔥 권한 상태 설정 (외부에서 권한 확인 후 호출)
   */
  public setPermission(hasPermission: boolean): void {
    this.hasAccessibilityPermission = hasPermission;
    Logger.info(this.componentName, '권한 상태 업데이트됨', { hasPermission });
  }

  /**
   * 🔥 권한 상태 정보 조회
   */
  public getPermissionInfo(): {
    hasPermission: boolean;
    isRequesting: boolean;
    platform: string;
    guideUrl?: string;
  } {
    let guideUrl: string | undefined;
    
    if (Platform.isMacOS()) {
      guideUrl = 'https://support.apple.com/guide/mac-help/allow-accessibility-apps-to-access-your-mac-mchlee4d087/mac';
    } else if (Platform.isWindows()) {
      guideUrl = 'https://docs.microsoft.com/en-us/windows/win32/inputdev/about-raw-input';
    }

    return {
      hasPermission: this.hasAccessibilityPermission,
      isRequesting: this.isRequestingPermissions,
      platform: Platform.getPlatformName(),
      guideUrl
    };
  }

  /**
   * 🔥 헬스 체크
   */
  public async healthCheck(): Promise<{
    healthy: boolean;
    uptime?: number;
    lastError?: string;
    hasPermission: boolean;
    isMonitoring: boolean;
  }> {
    const baseHealth = await super.healthCheck();
    
    return {
      ...baseHealth,
      hasPermission: this.hasAccessibilityPermission,
      isMonitoring: this.permissionCheckInterval !== null
    };
  }
}

export default KeyboardPermissionManager;
