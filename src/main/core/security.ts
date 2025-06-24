/**
 * 🔥 기가차드 보안 관리자
 * Loop Typing Analytics - Security Manager
 */

import { app, session } from 'electron';
import { isDev } from '../utils/environment';

/**
 * 보안 설정 초기화
 */
export async function setupSecurity(): Promise<void> {
  console.log('🔒 기가차드 보안 설정 시작...');

  // CSP 설정
  setupContentSecurityPolicy();

  // 권한 설정
  setupPermissions();

  // 네트워크 보안
  setupNetworkSecurity();

  // 개발 환경 보안 설정
  if (isDev) {
    setupDevelopmentSecurity();
  }

  console.log('✅ 보안 설정 완료');
}

/**
 * Content Security Policy 설정
 */
function setupContentSecurityPolicy(): void {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          isDev 
            ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5500 ws://localhost:5500"
            : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        ]
      }
    });
  });
}

/**
 * 권한 설정
 */
function setupPermissions(): void {
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    console.log(`🔐 권한 요청: ${permission}`);
    
    // 허용할 권한 목록
    const allowedPermissions = [
      'notifications',
      'clipboard-read',
      'clipboard-write'
    ];

    const allowed = allowedPermissions.includes(permission);
    console.log(`${allowed ? '✅' : '❌'} 권한 ${permission}: ${allowed ? '허용' : '거부'}`);
    
    callback(allowed);
  });

  // 외부 링크 차단
  session.defaultSession.webRequest.onBeforeRequest({ urls: ['*://*/*'] }, (details, callback) => {
    const url = new URL(details.url);
    
    // 로컬 개발 서버만 허용
    if (isDev && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
      callback({});
      return;
    }
    
    // 프로덕션에서는 모든 외부 요청 차단
    if (!isDev && !url.protocol.startsWith('file:')) {
      console.warn(`🚫 외부 요청 차단: ${details.url}`);
      callback({ cancel: true });
      return;
    }
    
    callback({});
  });
}

/**
 * 네트워크 보안 설정
 */
function setupNetworkSecurity(): void {
  // HTTPS 강제 (프로덕션)
  if (!isDev) {
    app.commandLine.appendSwitch('force-https');
  }

  // 안전하지 않은 HTTP 차단
  session.defaultSession.webRequest.onBeforeRequest({ urls: ['http://*/*'] }, (details, callback) => {
    if (!isDev) {
      console.warn(`🚫 HTTP 요청 차단: ${details.url}`);
      callback({ cancel: true });
    } else {
      callback({});
    }
  });
}

/**
 * 개발 환경 보안 설정
 */
function setupDevelopmentSecurity(): void {
  console.log('🔧 개발 환경 보안 설정 적용');
  
  // DevTools 접근 허용
  session.defaultSession.setPermissionCheckHandler(() => true);
  
  // 개발 서버 CORS 허용
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    if (details.url.includes('localhost:5500')) {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Access-Control-Allow-Origin': ['*'],
          'Access-Control-Allow-Methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          'Access-Control-Allow-Headers': ['Content-Type', 'Authorization']
        }
      });
    } else {
      callback({});
    }
  });
}

/**
 * 런타임 보안 체크
 */
export function validateSecuritySettings(): boolean {
  console.log('🔍 보안 설정 검증 중...');
  
  try {
    // 기본 보안 설정 확인
    const hasDefaultSession = !!session.defaultSession;
    const webSecurity = app.commandLine.hasSwitch('disable-web-security') === false;
    
    const isSecure = hasDefaultSession && webSecurity;
    
    console.log(`${isSecure ? '✅' : '❌'} 보안 설정 검증: ${isSecure ? '통과' : '실패'}`);
    
    return isSecure;
  } catch (error) {
    console.error('❌ 보안 설정 검증 실패:', error);
    return false;
  }
}
