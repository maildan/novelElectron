// 🔥 기가차드 OAuth IPC 핸들러 - Google Docs 연동 통신

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { IpcResponse } from '../../shared/types';
import { OAuthService } from '../services/OAuthService';

// #DEBUG: OAuth IPC handlers entry point
Logger.debug('OAUTH_IPC', 'OAuth IPC handlers module loaded');

// 🔥 OAuth 서비스 인스턴스
let oauthService: OAuthService | null = null;

/**
 * 🔥 OAuth 서비스 초기화
 */
export async function initializeOAuthService(): Promise<void> {
  try {
    if (!oauthService) {
      oauthService = new OAuthService();
      await oauthService.initialize();
      Logger.info('OAUTH_IPC', 'OAuth service initialized');
    }
  } catch (error) {
    Logger.error('OAUTH_IPC', 'Failed to initialize OAuth service', error);
    throw error;
  }
}

/**
 * 🔥 OAuth IPC 핸들러 설정
 */
export function setupOAuthIpcHandlers(): void {
  Logger.info('OAUTH_IPC', 'Setting up OAuth IPC handlers');

  // 🔥 Google OAuth 인증 시작
  ipcMain.handle('oauth:start-google-auth', async (_event: IpcMainInvokeEvent, loginHint?: string): Promise<IpcResponse<{ authUrl: string }>> => {
    try {
      Logger.debug('OAUTH_IPC', 'OAuth start-google-auth request received');

      if (!oauthService) {
        await initializeOAuthService();
      }

      // startGoogleAuth will open browser itself; support optional login hint
      if (typeof loginHint === 'string' && loginHint.length > 0) {
        const authUrl = oauthService!.buildAuthUrlWithHint(loginHint);
        try {
          // open with login hint
          await (oauthService as any).openAuthUrlInBrowser?.(authUrl);
        } catch (e) {
          // fallback: shell.openExternal
          const { shell } = require('electron');
          await shell.openExternal(authUrl);
        }
        return { success: true, data: { authUrl }, timestamp: new Date() };
      }

      const result = await oauthService!.startGoogleAuth();
      Logger.debug('OAUTH_IPC', 'OAuth start-google-auth completed', { success: result.success });
      return result;
    } catch (error) {
      Logger.error('OAUTH_IPC', 'OAuth start-google-auth failed', error);
      return {
        success: false,
        error: 'OAuth 인증을 시작할 수 없습니다',
        timestamp: new Date()
      };
    }
  });

  // 🔥 OAuth 콜백 처리
  ipcMain.handle('oauth:handle-callback', async (_event: IpcMainInvokeEvent, code: string): Promise<IpcResponse<{ accessToken: string; refreshToken: string }>> => {
    try {
      Logger.debug('OAUTH_IPC', 'OAuth handle-callback request received');

      if (!oauthService) {
        await initializeOAuthService();
      }

      const result = await oauthService!.handleCallback(code);
      Logger.debug('OAUTH_IPC', 'OAuth handle-callback completed', { success: result.success });
      return result;
    } catch (error) {
      Logger.error('OAUTH_IPC', 'OAuth handle-callback failed', error);
      return {
        success: false,
        error: 'OAuth 콜백 처리에 실패했습니다',
        timestamp: new Date()
      };
    }
  });

  // 🔥 Google 문서 목록 가져오기
  ipcMain.handle('oauth:get-google-documents', async (_event: IpcMainInvokeEvent): Promise<IpcResponse<Array<{ id: string; title: string; modifiedTime: string }>>> => {
    try {
      Logger.debug('OAUTH_IPC', 'OAuth get-google-documents request received');

      if (!oauthService) {
        await initializeOAuthService();
      }

      const result = await oauthService!.getGoogleDocuments();
      Logger.debug('OAUTH_IPC', 'OAuth get-google-documents completed', {
        success: result.success,
        documentCount: result.data?.length || 0
      });
      return result;
    } catch (error) {
      Logger.error('OAUTH_IPC', 'OAuth get-google-documents failed', error);
      return {
        success: false,
        error: 'Google 문서 목록을 가져올 수 없습니다',
        timestamp: new Date()
      };
    }
  });

  // 🔥 Google 문서 가져오기
  ipcMain.handle('oauth:import-google-doc', async (_event: IpcMainInvokeEvent, documentId: string): Promise<IpcResponse<{ title: string; content: string }>> => {
    try {
      Logger.debug('OAUTH_IPC', 'OAuth import-google-doc request received', { documentId });

      if (!oauthService) {
        await initializeOAuthService();
      }

      const result = await oauthService!.importGoogleDoc(documentId);
      Logger.debug('OAUTH_IPC', 'OAuth import-google-doc completed', {
        success: result.success,
        contentLength: result.data?.content?.length || 0
      });
      return result;
    } catch (error) {
      Logger.error('OAUTH_IPC', 'OAuth import-google-doc failed', error);
      return {
        success: false,
        error: 'Google 문서를 가져올 수 없습니다',
        timestamp: new Date()
      };
    }
  });

  // 🔥 인증 상태 확인
  ipcMain.handle('oauth:get-auth-status', async (_event: IpcMainInvokeEvent): Promise<IpcResponse<{ isAuthenticated: boolean; userEmail?: string }>> => {
    try {
      Logger.debug('OAUTH_IPC', 'OAuth get-auth-status request received');

      if (!oauthService) {
        await initializeOAuthService();
      }

      const result = await oauthService!.getAuthStatus();
      Logger.debug('OAUTH_IPC', 'OAuth get-auth-status completed', {
        success: result.success,
        isAuthenticated: result.data?.isAuthenticated || false
      });
      return result;
    } catch (error) {
      Logger.error('OAUTH_IPC', 'OAuth get-auth-status failed', error);
      return {
        success: false,
        error: '인증 상태를 확인할 수 없습니다',
        timestamp: new Date()
      };
    }
  });

  // 🔥 인증 취소
  ipcMain.handle('oauth:revoke-auth', async (_event: IpcMainInvokeEvent): Promise<IpcResponse<boolean>> => {
    try {
      Logger.debug('OAUTH_IPC', 'OAuth revoke-auth request received');

      if (!oauthService) {
        await initializeOAuthService();
      }

      const result = await oauthService!.revokeAuth();
      Logger.debug('OAUTH_IPC', 'OAuth revoke-auth completed', { success: result.success });
      return result;
    } catch (error) {
      Logger.error('OAUTH_IPC', 'OAuth revoke-auth failed', error);
      return {
        success: false,
        error: '인증 취소에 실패했습니다',
        timestamp: new Date()
      };
    }
  });

  Logger.info('OAUTH_IPC', 'OAuth IPC handlers setup completed');
}

/**
 * Directly handle callback from code (used by StaticServer to call into main flow without IPC)
 */
export async function handleCallbackDirect(code: string): Promise<IpcResponse<{ accessToken: string; refreshToken: string }>> {
  try {
    if (!oauthService) {
      await initializeOAuthService();
    }

    const result = await oauthService!.handleCallback(code);
    Logger.debug('OAUTH_IPC', 'handleCallbackDirect result', { success: result.success, error: result.error });
    return result;
  } catch (error) {
    Logger.error('OAUTH_IPC', 'Direct handleCallback failed', error);
    return { success: false, error: 'Direct callback handling failed', timestamp: new Date() };
  }
}

/**
 * 🔥 OAuth IPC 핸들러 정리
 */
export function cleanupOAuthIpcHandlers(): void {
  Logger.info('OAUTH_IPC', 'Cleaning up OAuth IPC handlers');

  const handlersToClean = [
    'oauth:start-google-auth',
    'oauth:handle-callback',
    'oauth:get-google-documents',
    'oauth:import-google-doc',
    'oauth:get-auth-status',
    'oauth:revoke-auth',
  ];

  handlersToClean.forEach(channel => {
    ipcMain.removeAllListeners(channel);
  });

  // OAuth 서비스 정리
  if (oauthService) {
    oauthService.cleanup();
    oauthService = null;
  }

  Logger.info('OAUTH_IPC', 'OAuth IPC handlers cleanup completed');
}
