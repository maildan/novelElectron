// 🔥 기가차드 OAuth 서비스 - Google Docs 연동 전문가!

import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { Result, IpcResponse } from '../../shared/types';
import { GOOGLE_OAUTH_CONFIG } from '../types/oauth';
import { shell } from 'electron';
import { createHash, randomBytes } from 'crypto';
import axios from 'axios';

// 🔥 OAuth 상태 인터페이스
interface OAuthState {
  isAuthenticated: boolean;
  accessToken?: string;
  refreshToken?: string;
  userEmail?: string;
  expiresAt?: Date;
  scopes?: string[];
}

// 🔥 Google 문서 인터페이스
interface GoogleDocument {
  id: string;
  title: string;
  modifiedTime: string;
  webViewLink?: string;
}

/**
 * 🔥 OAuthService - Google OAuth 2.0 인증 및 문서 가져오기
 * PKCE (Proof Key for Code Exchange) 보안 강화 적용
 */
export class OAuthService extends BaseManager {
  private readonly componentName = 'OAUTH_SERVICE';
  private oauthState: OAuthState = { isAuthenticated: false };
  private codeVerifier: string = '';
  private codeChallenge: string = '';
  private readonly redirectUri = 'http://localhost:3000/oauth/callback';

  constructor() {
    super({
      name: 'OAuthService',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000,
    });
  }

  /**
   * BaseManager 추상 메서드 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'OAuth service initialized');
    // 저장된 토큰 로드 시도
    await this.loadStoredTokens();
  }

  /**
   * BaseManager 추상 메서드 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'OAuth service started');
  }

  /**
   * BaseManager 추상 메서드 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'OAuth service stopped');
  }

  /**
   * BaseManager 추상 메서드 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'OAuth service cleaned up');
    // 토큰 정리는 명시적 revokeAuth 호출에서만 수행
  }

  /**
   * 🔥 Google OAuth 인증 시작
   */
  public async startGoogleAuth(): Promise<IpcResponse<{ authUrl: string }>> {
    try {
      Logger.info(this.componentName, 'Starting Google OAuth authentication');

      // PKCE 코드 생성
      this.codeVerifier = this.generateCodeVerifier();
      this.codeChallenge = await this.generateCodeChallenge(this.codeVerifier);

      // OAuth URL 생성
      const authUrl = this.buildAuthUrl();

      Logger.info(this.componentName, 'OAuth URL generated', { url: authUrl });

      return {
        success: true,
        data: { authUrl },
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to start Google auth', error);
      return {
        success: false,
        error: 'OAuth 인증을 시작할 수 없습니다',
        timestamp: new Date(),
      };
    }
  }

  /**
   * 🔥 OAuth 콜백 처리 (인증 코드 → 액세스 토큰)
   */
  public async handleCallback(code: string): Promise<IpcResponse<{ accessToken: string; refreshToken: string }>> {
    try {
      Logger.info(this.componentName, 'Handling OAuth callback');

      const tokenResponse = await this.exchangeCodeForTokens(code);
      
      if (!tokenResponse.access_token) {
        throw new Error('No access token received');
      }

      // 사용자 정보 가져오기
      const userInfo = await this.getUserInfo(tokenResponse.access_token);

      // 상태 업데이트
      this.oauthState = {
        isAuthenticated: true,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        userEmail: userInfo.email,
        expiresAt: new Date(Date.now() + (tokenResponse.expires_in * 1000)),
        scopes: tokenResponse.scope?.split(' '),
      };

      // 토큰 저장
      await this.saveTokens();

      Logger.info(this.componentName, 'OAuth authentication successful', { 
        email: userInfo.email 
      });

      return {
        success: true,
        data: {
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token,
        },
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to handle OAuth callback', error);
      return {
        success: false,
        error: 'OAuth 인증에 실패했습니다',
        timestamp: new Date(),
      };
    }
  }

  /**
   * 🔥 Google 문서 목록 가져오기
   */
  public async getGoogleDocuments(): Promise<IpcResponse<GoogleDocument[]>> {
    try {
      if (!this.oauthState.isAuthenticated || !this.oauthState.accessToken) {
        return {
          success: false,
          error: '인증이 필요합니다',
          timestamp: new Date(),
        };
      }

      // 토큰 만료 확인 및 갱신
      await this.ensureValidToken();

      const response = await axios.get('https://www.googleapis.com/drive/v3/files', {
        headers: {
          Authorization: `Bearer ${this.oauthState.accessToken}`,
        },
        params: {
          q: "mimeType='application/vnd.google-apps.document'",
          fields: 'files(id,name,modifiedTime,webViewLink)',
          orderBy: 'modifiedTime desc',
          pageSize: 50,
        },
      });

      const documents: GoogleDocument[] = response.data.files.map((file: any) => ({
        id: file.id,
        title: file.name,
        modifiedTime: file.modifiedTime,
        webViewLink: file.webViewLink,
      }));

      Logger.info(this.componentName, 'Google documents retrieved', { 
        count: documents.length 
      });

      return {
        success: true,
        data: documents,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to get Google documents', error);
      return {
        success: false,
        error: 'Google 문서를 가져올 수 없습니다',
        timestamp: new Date(),
      };
    }
  }

  /**
   * 🔥 Google 문서 내용 가져오기
   */
  public async importGoogleDoc(documentId: string): Promise<IpcResponse<{ title: string; content: string }>> {
    try {
      if (!this.oauthState.isAuthenticated || !this.oauthState.accessToken) {
        return {
          success: false,
          error: '인증이 필요합니다',
          timestamp: new Date(),
        };
      }

      await this.ensureValidToken();

      // 문서 메타데이터 가져오기
      const metaResponse = await axios.get(`https://www.googleapis.com/drive/v3/files/${documentId}`, {
        headers: {
          Authorization: `Bearer ${this.oauthState.accessToken}`,
        },
        params: {
          fields: 'name',
        },
      });

      // 문서 내용 가져오기 (텍스트 형태로)
      const contentResponse = await axios.get(`https://docs.googleapis.com/v1/documents/${documentId}`, {
        headers: {
          Authorization: `Bearer ${this.oauthState.accessToken}`,
        },
      });

      // Google Docs API 응답에서 텍스트 추출
      const content = this.extractTextFromGoogleDoc(contentResponse.data);

      Logger.info(this.componentName, 'Google document imported', { 
        documentId,
        title: metaResponse.data.name,
        contentLength: content.length 
      });

      return {
        success: true,
        data: {
          title: metaResponse.data.name,
          content,
        },
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to import Google document', error);
      return {
        success: false,
        error: 'Google 문서를 가져올 수 없습니다',
        timestamp: new Date(),
      };
    }
  }

  /**
   * 🔥 인증 상태 확인
   */
  public async getAuthStatus(): Promise<IpcResponse<{ isAuthenticated: boolean; userEmail?: string }>> {
    return {
      success: true,
      data: {
        isAuthenticated: this.oauthState.isAuthenticated,
        userEmail: this.oauthState.userEmail,
      },
      timestamp: new Date(),
    };
  }

  /**
   * 🔥 인증 취소
   */
  public async revokeAuth(): Promise<IpcResponse<boolean>> {
    try {
      if (this.oauthState.accessToken) {
        // Google에서 토큰 취소
        await axios.post('https://oauth2.googleapis.com/revoke', null, {
          params: {
            token: this.oauthState.accessToken,
          },
        });
      }

      // 로컬 상태 초기화
      this.oauthState = { isAuthenticated: false };
      await this.clearStoredTokens();

      Logger.info(this.componentName, 'OAuth authentication revoked');

      return {
        success: true,
        data: true,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to revoke auth', error);
      return {
        success: false,
        error: '인증 취소에 실패했습니다',
        timestamp: new Date(),
      };
    }
  }

  // 🔥 Private Helper Methods

  private generateCodeVerifier(): string {
    return randomBytes(32).toString('base64url');
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const hash = createHash('sha256').update(verifier).digest();
    return hash.toString('base64url');
  }

  private buildAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: GOOGLE_OAUTH_CONFIG.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: GOOGLE_OAUTH_CONFIG.scopes.join(' '),
      code_challenge: this.codeChallenge,
      code_challenge_method: 'S256',
      access_type: 'offline',
      prompt: 'consent',
    });

    return `${GOOGLE_OAUTH_CONFIG.authUrl}?${params.toString()}`;
  }

  private async exchangeCodeForTokens(code: string): Promise<any> {
    const response = await axios.post(GOOGLE_OAUTH_CONFIG.tokenUrl, {
      client_id: GOOGLE_OAUTH_CONFIG.clientId,
      client_secret: GOOGLE_OAUTH_CONFIG.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
      code,
      code_verifier: this.codeVerifier,
    });

    return response.data;
  }

  private async getUserInfo(accessToken: string): Promise<any> {
    const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }

  private async ensureValidToken(): Promise<void> {
    if (!this.oauthState.expiresAt || this.oauthState.expiresAt <= new Date()) {
      if (this.oauthState.refreshToken) {
        await this.refreshAccessToken();
      } else {
        throw new Error('Token expired and no refresh token available');
      }
    }
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.oauthState.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(GOOGLE_OAUTH_CONFIG.tokenUrl, {
      client_id: GOOGLE_OAUTH_CONFIG.clientId,
      client_secret: GOOGLE_OAUTH_CONFIG.clientSecret,
      refresh_token: this.oauthState.refreshToken,
      grant_type: 'refresh_token',
    });

    this.oauthState.accessToken = response.data.access_token;
    this.oauthState.expiresAt = new Date(Date.now() + (response.data.expires_in * 1000));

    await this.saveTokens();
  }

  private extractTextFromGoogleDoc(docData: any): string {
    // Google Docs API 응답에서 텍스트 추출
    let text = '';
    
    if (docData.body && docData.body.content) {
      for (const element of docData.body.content) {
        if (element.paragraph) {
          for (const textElement of element.paragraph.elements || []) {
            if (textElement.textRun) {
              text += textElement.textRun.content;
            }
          }
        }
      }
    }

    return text;
  }

  private async loadStoredTokens(): Promise<void> {
    // TODO: 안전한 토큰 저장소에서 로드 (keytar 등 사용)
    Logger.debug(this.componentName, 'Loading stored tokens (not implemented yet)');
  }

  private async saveTokens(): Promise<void> {
    // TODO: 안전한 토큰 저장소에 저장 (keytar 등 사용)
    Logger.debug(this.componentName, 'Saving tokens (not implemented yet)');
  }

  private async clearStoredTokens(): Promise<void> {
    // TODO: 저장된 토큰 삭제
    Logger.debug(this.componentName, 'Clearing stored tokens (not implemented yet)');
  }
}
