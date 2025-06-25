import { Logger } from "@shared/logger";
const log = Logger;/**
 * 🛡️ 권한 관리 유틸리티
 * macOS Screen Recording 권한 및 접근성 권한 관리
 */

import { dialog, shell } from 'electron';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class PermissionManager {
  /**
   * macOS Screen Recording 권한 확인
   */
  static async checkScreenRecordingPermission(): Promise<boolean> {
    if (process.platform !== 'darwin') {
      return true; // macOS가 아니면 권한 확인 불필요
    }

    try {
      // 권한 확인을 위한 AppleScript 실행
      const { stdout } = await execAsync(`
        osascript -e 'tell application "System Events" to return count of windows of every process'
      `);
      
      // 성공적으로 실행되면 권한이 있음
      return stdout.trim() !== '';
    } catch (error) {
      log.warn("Console", '⚠️ Screen Recording 권한 확인 실패:', error);
      return false;
    }
  }

  /**
   * 접근성 권한 확인
   */
  static async checkAccessibilityPermission(): Promise<boolean> {
    if (process.platform !== 'darwin') {
      return true; // macOS가 아니면 권한 확인 불필요
    }

    try {
      // 접근성 권한 확인을 위한 AppleScript 실행
      const { stdout } = await execAsync(`
        osascript -e 'tell application "System Events" to return UI elements enabled'
      `);
      
      return stdout.trim() === 'true';
    } catch (error) {
      log.warn("Console", '⚠️ 접근성 권한 확인 실패:', error);
      return false;
    }
  }

  /**
   * 권한 요청 다이얼로그 표시
   */
  static async showPermissionDialog(permissionType: 'screen-recording' | 'accessibility'): Promise<void> {
    const messages = {
      'screen-recording': {
        title: '🛡️ Screen Recording 권한 필요',
        message: 'Loop가 윈도우 정보를 수집하려면 Screen Recording 권한이 필요합니다.',
        detail: '시스템 환경설정 > 보안 및 개인 정보 보호 > 개인 정보 보호 > 화면 기록에서 Loop를 허용해주세요.',
        buttonLabel: '시스템 환경설정 열기'
      },
      'accessibility': {
        title: '🛡️ 접근성 권한 필요',
        message: 'Loop가 키보드 입력을 모니터링하려면 접근성 권한이 필요합니다.',
        detail: '시스템 환경설정 > 보안 및 개인 정보 보호 > 개인 정보 보호 > 접근성에서 Loop를 허용해주세요.',
        buttonLabel: '시스템 환경설정 열기'
      }
    };

    const config = messages[permissionType];

    const result = await dialog.showMessageBox({
      type: 'warning',
      title: config.title,
      message: config.message,
      detail: config.detail,
      buttons: [config.buttonLabel, '취소'],
      defaultId: 0,
      cancelId: 1,
      icon: undefined
    });

    if (result.response === 0) {
      // 시스템 환경설정 열기
      await shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy');
    }
  }

  /**
   * 모든 필요한 권한 확인
   */
  static async verifyAllPermissions(): Promise<{
    screenRecording: boolean;
    accessibility: boolean;
    allGranted: boolean;
  }> {
    const screenRecording = await this.checkScreenRecordingPermission();
    const accessibility = await this.checkAccessibilityPermission();

    return {
      screenRecording,
      accessibility,
      allGranted: screenRecording && accessibility
    };
  }

  /**
   * 권한 요청 프로세스 실행
   */
  static async requestPermissionsIfNeeded(): Promise<boolean> {
    const permissions = await this.verifyAllPermissions();

    if (permissions.allGranted) {
      log.info("Console", '✅ 모든 권한이 허용되어 있습니다.');
      return true;
    }

    // Screen Recording 권한 요청
    if (!permissions.screenRecording) {
      log.info("Console", '⚠️ Screen Recording 권한이 필요합니다.');
      await this.showPermissionDialog('screen-recording');
    }

    // 접근성 권한 요청
    if (!permissions.accessibility) {
      log.info("Console", '⚠️ 접근성 권한이 필요합니다.');
      await this.showPermissionDialog('accessibility');
    }

    // 재확인
    const recheckPermissions = await this.verifyAllPermissions();
    return recheckPermissions.allGranted;
  }
}
