// 🔥 기가차드 OAuth IPC 핸들러 - Google Docs 연동 통신

import { ipcMain } from 'electron';
import { Logger } from '../../shared/logger';
import { createSafeAsyncIpcHandler, createSafeIpcHandler } from '../../shared/ipc-utils';
import { googleOAuthService } from '../services/googleOAuthService';

// #DEBUG: OAuth IPC handlers entry point
Logger.debug('OAUTH_IPC', 'Setting up OAuth IPC handlers');

/**
 * 🔥 OAuth IPC 핸들러 설정
 */
export function setupOAuthIpcHandlers(): void {
  try {
    // 🔥 Google OAuth 인증 시작
    ipcMain.handle(
      'oauth:google:start',
      createSafeAsyncIpcHandler(
        async () => {
          Logger.debug('OAUTH_IPC', 'IPC: Start Google OAuth requested');
          
          const result = await googleOAuthService.startAuthentication();
          if (!result.success) {
            throw new Error(result.error);
          }
          
          return { authUrl: result.data };
        },
        'OAUTH_IPC',
        'Start Google OAuth'
      )
    );

    // 🔥 Google OAuth 콜백 처리
    ipcMain.handle(
      'oauth:google:callback',
      createSafeAsyncIpcHandler(
        async (...args: unknown[]) => {
          const [, code, state] = args;
          Logger.debug('OAUTH_IPC', 'IPC: Google OAuth callback requested', { code, state });
          
          if (typeof code !== 'string' || typeof state !== 'string') {
            throw new Error('Invalid callback parameters');
          }
          
          const result = await googleOAuthService.handleCallback(code, state);
          if (!result.success) {
            throw new Error(result.error);
          }
          
          return result.data;
        },
        'OAUTH_IPC',
        'Handle Google OAuth callback'
      )
    );

    // 🔥 Google 연결 상태 확인
    ipcMain.handle(
      'oauth:google:status',
      createSafeAsyncIpcHandler(
        async () => {
          Logger.debug('OAUTH_IPC', 'IPC: Get Google connection status requested');
          
          const result = await googleOAuthService.getConnectionStatus();
          if (!result.success) {
            throw new Error(result.error);
          }
          
          return { connected: result.data };
        },
        'OAUTH_IPC',
        'Get Google connection status'
      )
    );

    // 🔥 Google Docs 문서 생성
    ipcMain.handle(
      'oauth:google:create-document',
      createSafeAsyncIpcHandler(
        async (...args: unknown[]) => {
          const [, title, content] = args;
          Logger.debug('OAUTH_IPC', 'IPC: Create Google Docs document requested', { title, content });
          
          if (typeof title !== 'string') {
            throw new Error('Invalid document title');
          }
          
          const documentContent = typeof content === 'string' ? content : '';
          
          const result = await googleOAuthService.createDocument(title, documentContent);
          if (!result.success) {
            throw new Error(result.error);
          }
          
          return result.data;
        },
        'OAUTH_IPC',
        'Create Google Docs document'
      )
    );

    // 🔥 Google 연결 해제
    ipcMain.handle(
      'oauth:google:disconnect',
      createSafeAsyncIpcHandler(
        async () => {
          Logger.debug('OAUTH_IPC', 'IPC: Disconnect Google requested');
          
          const result = await googleOAuthService.disconnect();
          if (!result.success) {
            throw new Error(result.error);
          }
          
          return { success: result.data };
        },
        'OAUTH_IPC',
        'Disconnect Google'
      )
    );

    // 🔥 OAuth 설정 정보 조회 (클라이언트 ID만)
    ipcMain.handle(
      'oauth:config',
      createSafeIpcHandler(
        () => {
          Logger.debug('OAUTH_IPC', 'IPC: Get OAuth config requested');
          
          return {
            google: {
              clientId: process.env.GOOGLE_CLIENT_ID || '',
              redirectUri: 'http://localhost:3000/oauth/callback',
              scopes: [
                'https://www.googleapis.com/auth/documents',
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
              ]
            }
          };
        },
        'OAUTH_IPC',
        'Get OAuth config'
      )
    );

    Logger.info('OAUTH_IPC', '✅ OAuth IPC handlers setup complete');

  } catch (error) {
    Logger.error('OAUTH_IPC', '❌ Failed to setup OAuth IPC handlers', error);
    throw error;
  }
}

// #DEBUG: OAuth IPC handlers exit point
Logger.debug('OAUTH_IPC', 'OAuth IPC handlers module setup complete');
