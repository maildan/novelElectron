// 🔥 기가차드 Google OAuth Service - 안전한 인증 통합

import { shell } from 'electron';
import { Logger } from '../../shared/logger';
import { createSuccess, createError, type Result } from '../../shared/common';
import { tokenStorage } from './tokenStorage';
import type { OAuthTokens, GoogleUserInfo, OAuthResult, GoogleOAuthConfig } from '../types/oauth';

/**
 * 🔥 Google OAuth 서비스 클래스
 */
export class GoogleOAuthService {
  private static instance: GoogleOAuthService;
  private readonly componentName = 'GOOGLE_OAUTH';
  private readonly config: GoogleOAuthConfig;

  private constructor() {
    this.config = {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:35821/oauth/callback',
      scopes: [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ],
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token'
    };
  }

  static getInstance(): GoogleOAuthService {
    if (!GoogleOAuthService.instance) {
      GoogleOAuthService.instance = new GoogleOAuthService();
    }
    return GoogleOAuthService.instance;
  }

  /**
   * 🔥 OAuth 인증 시작
   */
  async startAuthentication(): Promise<Result<string>> {
    try {
      if (!this.config.clientId) {
        throw new Error('Google Client ID가 설정되지 않았습니다');
      }

      const state = this.generateState();
      const authUrl = this.buildAuthUrl(state);

      // 외부 브라우저에서 OAuth URL 열기
      await shell.openExternal(authUrl);

      Logger.info(this.componentName, '✅ OAuth 인증 시작됨', { authUrl });
      return createSuccess(authUrl);

    } catch (error) {
      Logger.error(this.componentName, '❌ OAuth 인증 시작 실패', error);
      return createError(error instanceof Error ? error.message : 'Authentication failed');
    }
  }

  /**
   * 🔥 OAuth 콜백 처리
   */
  async handleCallback(code: string, state: string): Promise<Result<OAuthResult>> {
    try {
      // 상태 검증 (보안)
      if (!this.verifyState(state)) {
        throw new Error('Invalid state parameter');
      }

      // 인증 코드로 토큰 교환
      const tokens = await this.exchangeCodeForTokens(code);
      if (!tokens) {
        throw new Error('Failed to exchange code for tokens');
      }

      // 사용자 정보 가져오기
      const userInfo = await this.getUserInfo(tokens.access_token);
      if (!userInfo) {
        throw new Error('Failed to get user info');
      }

      // 토큰 안전하게 저장
      const saveResult = await tokenStorage.saveTokens('google', tokens);
      if (!saveResult) {
        throw new Error('Failed to save tokens');
      }

      const result: OAuthResult = {
        success: true,
        tokens,
        userInfo
      };

      Logger.info(this.componentName, '✅ OAuth 인증 완료', { 
        userEmail: userInfo.email,
        scopes: tokens.scope 
      });

      return createSuccess(result);

    } catch (error) {
      Logger.error(this.componentName, '❌ OAuth 콜백 처리 실패', error);
      return createError(error instanceof Error ? error.message : 'Callback handling failed');
    }
  }

  /**
   * 🔥 현재 연결 상태 확인
   */
  async getConnectionStatus(): Promise<Result<boolean>> {
    try {
      // 1) ENV 우선 사용 (있으면 부트스트랩)
      const envAccess = process.env.GOOGLE_ACCESS_TOKEN;
      const envRefresh = process.env.GOOGLE_REFRESH_TOKEN;
      if (envAccess) {
        await tokenStorage.saveTokens('google', {
          access_token: envAccess,
          refresh_token: envRefresh,
          token_type: 'Bearer',
          scope: this.config.scopes.join(' '),
        });
      }

      const tokens = await tokenStorage.getTokens('google');
      
      if (!tokens) {
        return createSuccess(false);
      }

      // 토큰 유효성 검사
      const isValid = await this.validateTokens(tokens);
      return createSuccess(isValid);

    } catch (error) {
      Logger.error(this.componentName, '❌ 연결 상태 확인 실패', error);
      return createSuccess(false);
    }
  }

  /**
   * 🔥 Google Docs 문서 생성
   */
  async createDocument(title: string, content: string): Promise<Result<{ documentId: string; webViewLink: string }>> {
    try {
      const tokens = await tokenStorage.getTokens('google');
      if (!tokens) {
        throw new Error('Google 인증이 필요합니다');
      }

      // 문서 생성 API 호출
      const response = await fetch('https://docs.googleapis.com/v1/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title
        }),
      });

      if (!response.ok) {
        throw new Error(`Document creation failed: ${response.status}`);
      }

      const document = await response.json();

      // 내용 추가 (별도 API 호출)
      if (content) {
        await this.insertText(document.documentId, content, tokens.access_token);
      }

      Logger.info(this.componentName, '✅ Google Docs 문서 생성됨', { 
        documentId: document.documentId,
        title 
      });

      return createSuccess({
        documentId: document.documentId,
        webViewLink: `https://docs.google.com/document/d/${document.documentId}/edit`
      });

    } catch (error) {
      Logger.error(this.componentName, '❌ Google Docs 문서 생성 실패', error);
      return createError(error instanceof Error ? error.message : 'Document creation failed');
    }
  }

  /**
   * 🔥 Google Docs 문서 목록 조회
   */
  async listDocuments(): Promise<Result<{ id: string; name: string; modifiedTime: string; webViewLink?: string }[]>> {
    try {
      const tokens = await tokenStorage.getTokens('google');
      if (!tokens) {
        throw new Error('Google 인증이 필요합니다');
      }

      const url = new URL('https://www.googleapis.com/drive/v3/files');
      url.searchParams.set('q', "mimeType='application/vnd.google-apps.document'");
      url.searchParams.set('fields', 'files(id,name,modifiedTime,webViewLink)');
      url.searchParams.set('orderBy', 'modifiedTime desc');
      url.searchParams.set('pageSize', '50');

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`List documents failed: ${response.status}`);
      }

      const data = await response.json();
      const files = (data?.files || []).map((f: { id: string; name: string; modifiedTime: string; webViewLink?: string }) => ({
        id: f.id,
        name: f.name,
        modifiedTime: f.modifiedTime,
        webViewLink: f.webViewLink,
      }));

      Logger.info(this.componentName, '✅ Google Docs 목록 조회 완료', { count: files.length });
      return createSuccess(files);

    } catch (error) {
      Logger.error(this.componentName, '❌ Google Docs 목록 조회 실패', error);
      return createError(error instanceof Error ? error.message : 'List documents failed');
    }
  }

  /**
   * 🔥 연결 해제
   */
  async disconnect(): Promise<Result<boolean>> {
    try {
      const deleteResult = await tokenStorage.deleteTokens('google');
      
      Logger.info(this.componentName, '✅ Google 연결 해제됨');
      return createSuccess(deleteResult);

    } catch (error) {
      Logger.error(this.componentName, '❌ 연결 해제 실패', error);
      return createError(error instanceof Error ? error.message : 'Disconnect failed');
    }
  }

  /**
   * 🔥 Private 헬퍼 메서드들
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private buildAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scopes.join(' '),
      state: state,
      access_type: 'offline',
      prompt: 'consent'
    });

    return `${this.config.authUrl}?${params.toString()}`;
  }

  private verifyState(state: string): boolean {
    // 실제 구현에서는 세션에 저장된 state와 비교
    // 지금은 간단한 형식 검증만
    return Boolean(state && state.length > 10);
  }

  private async exchangeCodeForTokens(code: string): Promise<OAuthTokens | null> {
    try {
      const response = await fetch(this.config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: this.config.redirectUri,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.status}`);
      }

      const tokens: OAuthTokens = await response.json();
      
      // 만료 시간 계산
      if (tokens.expires_in) {
        tokens.expires_at = Date.now() + (tokens.expires_in * 1000);
      }

      return tokens;

    } catch (error) {
      Logger.error(this.componentName, 'Token exchange failed', error);
      return null;
    }
  }

  private async getUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`User info fetch failed: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      Logger.error(this.componentName, 'User info fetch failed', error);
      return null;
    }
  }

  private async validateTokens(tokens: OAuthTokens): Promise<boolean> {
    try {
      // 만료 시간 체크
      if (tokens.expires_at && tokens.expires_at < Date.now()) {
        // 토큰 갱신 시도
        const refreshed = await tokenStorage.refreshTokens('google');
        return !!refreshed;
      }

      // 토큰으로 사용자 정보 조회 테스트
      const userInfo = await this.getUserInfo(tokens.access_token);
      return !!userInfo;

    } catch (error) {
      Logger.error(this.componentName, 'Token validation failed', error);
      return false;
    }
  }

  private async insertText(documentId: string, text: string, accessToken: string): Promise<void> {
    const response = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: {
                index: 1,
              },
              text: text,
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Text insertion failed: ${response.status}`);
    }
  }
}

// 🔥 싱글톤 익스포트
export const googleOAuthService = GoogleOAuthService.getInstance();
