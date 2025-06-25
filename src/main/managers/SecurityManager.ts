/**
 * 🔥 기가차드 보안 매니저
 * Loop Typing Analytics - Security Manager
 */

import { GigaChadLogger } from '../../shared/logger';
import { initializeSecurity, setSecurityHeaders, disableDevTools } from '../core/security';
import { app } from 'electron';

export class SecurityManager {
  private static instance: SecurityManager;
  private logger = GigaChadLogger.getInstance();

  private constructor() {}

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  /**
   * 보안 매니저 초기화
   */
  async initialize(): Promise<void> {
    try {
      // 보안 설정 초기화
      initializeSecurity();
      
      // 개발 도구 비활성화 (프로덕션)
      disableDevTools();
      
      // 웹 보안 설정
      this.setupWebSecurity();
      
      this.logger.success('SecurityManager', '🔒 보안 매니저 초기화 완료');
    } catch (error) {
      this.logger.error('SecurityManager', '보안 매니저 초기화 실패', error);
      throw error;
    }
  }

  /**
   * 웹 보안 설정
   */
  private setupWebSecurity(): void {
    app.on('web-contents-created', (event, contents) => {
      // 보안 헤더 설정
      setSecurityHeaders(contents);
      
      // 새 창 생성 방지
      contents.setWindowOpenHandler(() => {
        this.logger.warn('SecurityManager', '새 창 생성 시도 차단됨');
        return { action: 'deny' };
      });
      
      // 네비게이션 제한
      contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        
        if (parsedUrl.origin !== 'http://localhost:3000' && 
            parsedUrl.origin !== 'http://localhost:3001') {
          this.logger.warn('SecurityManager', `외부 네비게이션 차단: ${navigationUrl}`);
          event.preventDefault();
        }
      });
    });
  }

  /**
   * 권한 확인
   */
  async checkPermissions(): Promise<boolean> {
    try {
      // 여기에 실제 권한 확인 로직 구현
      return true;
    } catch (error) {
      this.logger.error('SecurityManager', '권한 확인 실패', error);
      return false;
    }
  }

  /**
   * 정리
   */
  async cleanup(): Promise<void> {
    try {
      this.logger.info('SecurityManager', '🔒 보안 매니저 정리 완료');
    } catch (error) {
      this.logger.error('SecurityManager', '보안 매니저 정리 실패', error);
    }
  }
}
