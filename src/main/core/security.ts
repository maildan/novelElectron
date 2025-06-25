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
          "default-src 'self' 'unsafe-inline' data: blob:; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
          "connect-src 'self' ws: wss: http: https:; " +
          "img-src 'self' data: blob: https:; " +
          "style-src 'self' 'unsafe-inline';"
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
