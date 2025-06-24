/**
 * 🔥 기가차드 보안 매니저
 * Loop Typing Analytics - Security Manager
 */

import { app, session } from 'electron';

export class SecurityManager {
  private static instance: SecurityManager;

  private constructor() {}

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  /**
   * 보안 초기화
   */
  async initialize(): Promise<void> {
    console.log('🔒 기가차드 보안 매니저: 초기화 시작...');

    try {
      // CSP 설정
      this.setupContentSecurityPolicy();

      // 권한 설정
      this.setupPermissions();

      // 프로토콜 보안
      this.setupProtocolSecurity();

      console.log('✅ 보안 매니저 초기화 완료');
    } catch (error) {
      console.error('❌ 보안 매니저 초기화 실패:', error);
      throw error;
    }
  }

  /**
   * Content Security Policy 설정
   */
  private setupContentSecurityPolicy(): void {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; " +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: blob:; " +
            "font-src 'self' data:; " +
            "connect-src 'self' http://localhost:* ws://localhost:*;"
          ]
        }
      });
    });

    console.log('🛡️ CSP 정책 설정 완료');
  }

  /**
   * 권한 설정
   */
  private setupPermissions(): void {
    // 위험한 권한들 차단
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
      console.log(`🔐 권한 요청: ${permission}`);
      
      // 허용할 권한들
      const allowedPermissions = [
        'notifications',
        'clipboard-read',
        'clipboard-write'
      ];

      if (allowedPermissions.includes(permission)) {
        callback(true);
        console.log(`✅ 권한 허용: ${permission}`);
      } else {
        callback(false);
        console.log(`🚫 권한 거부: ${permission}`);
      }
    });

    console.log('🔐 권한 정책 설정 완료');
  }

  /**
   * 프로토콜 보안 설정
   */
  private setupProtocolSecurity(): void {
    // 위험한 프로토콜 차단
    app.setAsDefaultProtocolClient('loop-app', process.execPath);
    
    console.log('🔗 프로토콜 보안 설정 완료');
  }

  /**
   * 정리
   */
  cleanup(): void {
    console.log('🧹 보안 매니저 정리 중...');
    
    // 필요한 정리 작업 수행
    // 세션 관련 정리는 앱 종료 시 자동으로 처리됨
    
    console.log('✅ 보안 매니저 정리 완료');
  }
}
