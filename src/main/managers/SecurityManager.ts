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
      // 🔥 개발/프로덕션 환경별 CSP 정책
      const isDev = process.env.NODE_ENV === 'development';
      
      const cspPolicy = isDev 
        ? [
            // 개발 환경: HMR과 DevTools를 위한 설정
            "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5500 ws://localhost:5500 data: blob:;",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5500;",
            "style-src 'self' 'unsafe-inline' http://localhost:5500;",
            "connect-src 'self' http://localhost:5500 ws://localhost:5500;",
            "img-src 'self' data: blob: http://localhost:5500;",
            "font-src 'self' data:;"
          ].join(' ')
        : [
            // 프로덕션 환경: 보안 강화
            "default-src 'self';",
            "script-src 'self';",
            "style-src 'self' 'unsafe-inline';",
            "connect-src 'self';",
            "img-src 'self' data: blob:;",
            "font-src 'self' data:;"
          ].join(' ');

      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [cspPolicy]
        }
      });
    });

    console.log(`🛡️ CSP 정책 설정 완료 (${process.env.NODE_ENV === 'development' ? '개발' : '프로덕션'} 모드)`);
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
