/**
 * 보안 관련 유틸리티
 */

import { app } from 'electron';

/**
 * 보안 설정 초기화
 */
export const initializeSecurity = () => {
  // 새 창 방지
  app.on('web-contents-created', (event, contents) => {
    contents.setWindowOpenHandler(() => {
      return { action: 'deny' };
    });
  });
};

/**
 * 보안 헤더 설정
 */
export const setSecurityHeaders = (webContents: Electron.WebContents) => {
  webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          // #DEBUG: 기가차드 보안 강화 - unsafe-eval 제거
          "default-src 'self' data: blob: http://localhost:* ws://localhost:*; " +
          "script-src 'self' 'unsafe-inline' http://localhost:*; " + // unsafe-eval 제거
          "style-src 'self' 'unsafe-inline' http://localhost:*; " +
          "img-src 'self' data: blob: http://localhost:*; " +
          "connect-src 'self' ws: wss: http://localhost:* ws://localhost:*; " +
          "font-src 'self' data:; " +
          "media-src 'self' data: blob:; " +
          "worker-src 'self' blob:; " +
          "frame-src 'none'; " +
          "object-src 'none'; " +
          "base-uri 'self';"
        ]
      }
    });
  });
};

/**
 * 개발 도구 비활성화 (프로덕션)
 */
export const disableDevTools = () => {
  if (!app.isPackaged) return;
  
  app.on('web-contents-created', (event, contents) => {
    contents.on('before-input-event', (event, input) => {
      if (input.control && input.shift && input.key.toLowerCase() === 'i') {
        event.preventDefault();
      }
    });
  });
};
