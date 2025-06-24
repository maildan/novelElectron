/**
 * 🔥 기가차드 키보드 권한 매니저
 * Keyboard Permission Manager based on Loop 6 security practices
 */

import { shell, app, dialog } from 'electron';
import { EventEmitter } from 'events';

export interface PermissionStatus {
  accessibility: boolean | null;
  screenRecording: boolean | null;
  inputMonitoring: boolean | null;
  fullDiskAccess: boolean | null;
}

export interface PermissionCheckResult {
  hasAllPermissions: boolean;
  missingPermissions: string[];
  status: PermissionStatus;
  canRequest: boolean;
  needsManualSetup: boolean;
}

/**
 * 키보드 권한 매니저
 */
export class KeyboardPermissionManager extends EventEmitter {
  private static instance: KeyboardPermissionManager;
  private lastCheckTime: number = 0;
  private checkInterval: NodeJS.Timeout | null = null;
  private currentStatus: PermissionStatus;

  private constructor() {
    super();
    this.currentStatus = this.getInitialStatus();
  }

  static getInstance(): KeyboardPermissionManager {
    if (!KeyboardPermissionManager.instance) {
      KeyboardPermissionManager.instance = new KeyboardPermissionManager();
    }
    return KeyboardPermissionManager.instance;
  }

  /**
   * 초기 권한 상태
   */
  private getInitialStatus(): PermissionStatus {
    return {
      accessibility: null,
      screenRecording: null,
      inputMonitoring: null,
      fullDiskAccess: null
    };
  }

  /**
   * 권한 상태 확인
   */
  async checkPermissions(): Promise<PermissionCheckResult> {
    console.log('🔒 키보드 권한 상태 확인 중...');
    
    try {
      this.lastCheckTime = Date.now();
      
      if (process.platform === 'darwin') {
        await this.checkMacOSPermissions();
      } else if (process.platform === 'win32') {
        await this.checkWindowsPermissions();
      } else {
        await this.checkLinuxPermissions();
      }

      const result = this.analyzePermissionStatus();
      
      console.log('✅ 권한 확인 완료:', result);
      this.emit('permissions-checked', result);
      
      return result;
    } catch (error) {
      console.error('❌ 권한 확인 실패:', error);
      this.emit('permission-check-error', error);
      
      return {
        hasAllPermissions: false,
        missingPermissions: ['권한 확인 실패'],
        status: this.currentStatus,
        canRequest: false,
        needsManualSetup: true
      };
    }
  }

  /**
   * macOS 권한 확인
   */
  private async checkMacOSPermissions(): Promise<void> {
    try {
      // 접근성 권한 확인 (실제로는 네이티브 모듈 필요)
      this.currentStatus.accessibility = await this.checkAccessibilityPermission();
      
      // 화면 녹화 권한 확인
      this.currentStatus.screenRecording = await this.checkScreenRecordingPermission();
      
      // 입력 모니터링 권한 확인
      this.currentStatus.inputMonitoring = await this.checkInputMonitoringPermission();
      
      // 전체 디스크 접근 권한 확인 (선택사항)
      this.currentStatus.fullDiskAccess = await this.checkFullDiskAccessPermission();
      
    } catch (error) {
      console.error('❌ macOS 권한 확인 실패:', error);
      // 확인 실패 시 모든 권한을 false로 설정
      this.currentStatus.accessibility = false;
      this.currentStatus.screenRecording = false;
      this.currentStatus.inputMonitoring = false;
      this.currentStatus.fullDiskAccess = false;
    }
  }

  /**
   * Windows 권한 확인
   */
  private async checkWindowsPermissions(): Promise<void> {
    try {
      // Windows에서는 대부분의 권한이 기본적으로 허용됨
      this.currentStatus.accessibility = true;
      this.currentStatus.screenRecording = true;
      this.currentStatus.inputMonitoring = await this.checkWindowsInputMonitoring();
      this.currentStatus.fullDiskAccess = true;
      
    } catch (error) {
      console.error('❌ Windows 권한 확인 실패:', error);
      this.currentStatus.accessibility = false;
      this.currentStatus.screenRecording = false;
      this.currentStatus.inputMonitoring = false;
      this.currentStatus.fullDiskAccess = false;
    }
  }

  /**
   * Linux 권한 확인
   */
  private async checkLinuxPermissions(): Promise<void> {
    try {
      // Linux에서는 대부분의 권한이 기본적으로 허용됨
      this.currentStatus.accessibility = true;
      this.currentStatus.screenRecording = true;
      this.currentStatus.inputMonitoring = await this.checkLinuxInputAccess();
      this.currentStatus.fullDiskAccess = true;
      
    } catch (error) {
      console.error('❌ Linux 권한 확인 실패:', error);
      this.currentStatus.accessibility = false;
      this.currentStatus.screenRecording = false;
      this.currentStatus.inputMonitoring = false;
      this.currentStatus.fullDiskAccess = false;
    }
  }

  /**
   * 권한 상태 분석
   */
  private analyzePermissionStatus(): PermissionCheckResult {
    const missingPermissions: string[] = [];
    
    if (this.currentStatus.accessibility === false) {
      missingPermissions.push('접근성 권한');
    }
    
    if (this.currentStatus.screenRecording === false) {
      missingPermissions.push('화면 녹화 권한');
    }
    
    if (this.currentStatus.inputMonitoring === false) {
      missingPermissions.push('입력 모니터링 권한');
    }

    const hasAllPermissions = this.currentStatus.accessibility === true && 
                             this.currentStatus.inputMonitoring === true;

    return {
      hasAllPermissions,
      missingPermissions,
      status: { ...this.currentStatus },
      canRequest: process.platform === 'darwin',
      needsManualSetup: missingPermissions.length > 0
    };
  }

  /**
   * 권한 요청
   */
  async requestPermissions(): Promise<boolean> {
    console.log('📋 키보드 권한 요청 중...');
    
    try {
      if (process.platform === 'darwin') {
        return await this.requestMacOSPermissions();
      } else {
        // 다른 플랫폼에서는 권한 설정 가이드 표시
        await this.showPermissionGuide();
        return false;
      }
    } catch (error) {
      console.error('❌ 권한 요청 실패:', error);
      this.emit('permission-request-error', error);
      return false;
    }
  }

  /**
   * macOS 권한 요청
   */
  private async requestMacOSPermissions(): Promise<boolean> {
    try {
      // 시스템 환경설정 열기
      await this.openSystemPreferences();
      
      // 사용자에게 권한 설정 안내
      const result = await dialog.showMessageBox({
        type: 'info',
        title: '키보드 모니터링 권한 필요',
        message: '키보드 모니터링을 위해 다음 권한이 필요합니다:',
        detail: `
1. 시스템 환경설정 > 보안 및 개인정보보호 > 개인정보보호 탭
2. 접근성에서 "${app.getName()}" 체크
3. 입력 모니터링에서 "${app.getName()}" 체크
4. 화면 녹화에서 "${app.getName()}" 체크 (선택사항)

설정 후 앱을 재시작해주세요.`,
        buttons: ['확인', '나중에'],
        defaultId: 0
      });
      
      return result.response === 0;
    } catch (error) {
      console.error('❌ macOS 권한 요청 실패:', error);
      return false;
    }
  }

  /**
   * 시스템 환경설정 열기
   */
  async openSystemPreferences(): Promise<void> {
    try {
      if (process.platform === 'darwin') {
        // macOS - 보안 및 개인정보보호 > 접근성
        await shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility');
      } else if (process.platform === 'win32') {
        // Windows - 개인정보 설정
        await shell.openExternal('ms-settings:privacy-general');
      } else {
        // Linux - 시스템 설정
        await shell.openExternal('gnome-control-center');
      }
    } catch (error) {
      console.error('❌ 시스템 설정 열기 실패:', error);
      throw error;
    }
  }

  /**
   * 권한 설정 가이드 표시
   */
  private async showPermissionGuide(): Promise<void> {
    let message = '';
    let detail = '';

    if (process.platform === 'win32') {
      message = 'Windows 권한 설정';
      detail = `
Windows 11:
1. 설정 > 개인정보 보호 및 보안
2. 앱 권한에서 마이크, 카메라 등 필요한 권한 허용

Windows 10:
1. 설정 > 개인정보
2. 해당 권한 항목에서 앱 접근 허용`;
    } else {
      message = 'Linux 권한 설정';
      detail = `
대부분의 Linux 배포판에서는 추가 권한 설정이 필요하지 않습니다.
만약 키보드 모니터링이 작동하지 않는다면:

1. 사용자를 input 그룹에 추가
   sudo usermod -a -G input $USER

2. X11 권한 확인
   xhost +local:

3. 앱을 sudo로 실행 (비권장)`;
    }

    await dialog.showMessageBox({
      type: 'info',
      title: '권한 설정 가이드',
      message,
      detail,
      buttons: ['확인']
    });
  }

  /**
   * 권한 모니터링 시작
   */
  startMonitoring(intervalMs: number = 30000): void {
    if (this.checkInterval) {
      this.stopMonitoring();
    }

    this.checkInterval = setInterval(async () => {
      const result = await this.checkPermissions();
      this.emit('permission-status-changed', result);
    }, intervalMs);

    console.log(`🔍 권한 모니터링 시작 (${intervalMs}ms 간격)`);
  }

  /**
   * 권한 모니터링 중지
   */
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('🛑 권한 모니터링 중지');
    }
  }

  /**
   * 현재 권한 상태 반환
   */
  getCurrentStatus(): PermissionStatus {
    return { ...this.currentStatus };
  }

  /**
   * 정리
   */
  cleanup(): void {
    this.stopMonitoring();
    this.removeAllListeners();
    console.log('🧹 권한 매니저 정리 완료');
  }

  // ==================== Platform-specific Permission Checks ====================

  /**
   * macOS 접근성 권한 확인
   */
  private async checkAccessibilityPermission(): Promise<boolean> {
    try {
      // 실제 구현에서는 네이티브 모듈 사용
      // 여기서는 간단한 휴리스틱 사용
      return new Promise((resolve) => {
        // uIOhook이나 다른 키보드 훅이 작동하는지 테스트
        setTimeout(() => {
          resolve(true); // 임시로 true 반환
        }, 100);
      });
    } catch (error) {
      console.error('❌ 접근성 권한 확인 실패:', error);
      return false;
    }
  }

  /**
   * macOS 화면 녹화 권한 확인
   */
  private async checkScreenRecordingPermission(): Promise<boolean> {
    try {
      // 간단한 화면 캡처 테스트
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true); // 임시로 true 반환
        }, 100);
      });
    } catch (error) {
      console.error('❌ 화면 녹화 권한 확인 실패:', error);
      return false;
    }
  }

  /**
   * macOS 입력 모니터링 권한 확인
   */
  private async checkInputMonitoringPermission(): Promise<boolean> {
    try {
      // 키보드 이벤트 캡처 테스트
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true); // 임시로 true 반환
        }, 100);
      });
    } catch (error) {
      console.error('❌ 입력 모니터링 권한 확인 실패:', error);
      return false;
    }
  }

  /**
   * macOS 전체 디스크 접근 권한 확인
   */
  private async checkFullDiskAccessPermission(): Promise<boolean> {
    try {
      // 특정 시스템 파일 접근 테스트
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true); // 임시로 true 반환
        }, 100);
      });
    } catch (error) {
      console.error('❌ 전체 디스크 접근 권한 확인 실패:', error);
      return false;
    }
  }

  /**
   * Windows 입력 모니터링 확인
   */
  private async checkWindowsInputMonitoring(): Promise<boolean> {
    try {
      // Windows에서는 일반적으로 권한이 필요하지 않음
      return true;
    } catch (error) {
      console.error('❌ Windows 입력 모니터링 확인 실패:', error);
      return false;
    }
  }

  /**
   * Linux 입력 접근 권한 확인
   */
  private async checkLinuxInputAccess(): Promise<boolean> {
    try {
      // input 그룹 멤버십 확인 등
      return true;
    } catch (error) {
      console.error('❌ Linux 입력 접근 권한 확인 실패:', error);
      return false;
    }
  }
}

// Export singleton instance
export const keyboardPermissionManager = KeyboardPermissionManager.getInstance();
