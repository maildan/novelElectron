//// 🔥 기가차드 Token Storage Service - OAuth 토큰 암호화 저장

import { safeStorage } from 'electron';
import { Logger } from '../../shared/logger';
import { getSettingsManager } from '../settings';
import type { OAuthTokens } from '../types/oauth';

/**
 * 🔥 토큰 저장 서비스 - OAuth 토큰을 암호화하여 안전하게 저장
 */
export class TokenStorageService {
  private static instance: TokenStorageService;
  private readonly componentName = 'TOKEN_STORAGE';

  private constructor() {}

  static getInstance(): TokenStorageService {
    if (!TokenStorageService.instance) {
      TokenStorageService.instance = new TokenStorageService();
    }
    return TokenStorageService.instance;
  }

  /**
   * 🔥 토큰 암호화 저장
   */
  async saveTokens(service: 'google' | 'hancom', tokens: OAuthTokens): Promise<boolean> {
    try {
      // 만료 시간 계산
      if (tokens.expires_in && !tokens.expires_at) {
        tokens.expires_at = Date.now() + (tokens.expires_in * 1000);
      }

      // 토큰 암호화
      const tokenString = JSON.stringify(tokens);
      const encrypted = safeStorage.encryptString(tokenString);

      // 설정에 저장 - app 카테고리에 저장
      const settingsManager = getSettingsManager();
      // electron-store store 접근자 메서드 사용 (deep key)
      settingsManager.setDeep(`app.oauth_${service}_tokens`, encrypted.toString('base64'));

      Logger.info(this.componentName, `✅ ${service} 토큰 저장 완료`);
      return true;

    } catch (error) {
      Logger.error(this.componentName, `❌ ${service} 토큰 저장 실패`, error);
      return false;
    }
  }

  /**
   * 🔥 토큰 복호화 조회
   */
  async getTokens(service: 'google' | 'hancom'): Promise<OAuthTokens | null> {
    try {
      const settingsManager = getSettingsManager();
      const encryptedTokens = settingsManager.getDeep(`app.oauth_${service}_tokens`) as string;
      if (!encryptedTokens) {
        Logger.warn(this.componentName, `⚠️ ${service} 토큰이 없습니다`);
        return null;
      }

      // 복호화
      const buffer = Buffer.from(encryptedTokens, 'base64');
      const decrypted = safeStorage.decryptString(buffer);
      const tokens: OAuthTokens = JSON.parse(decrypted);

      // 만료 확인
      if (tokens.expires_at && tokens.expires_at < Date.now()) {
        Logger.warn(this.componentName, `⚠️ ${service} 토큰이 만료됨`);
        return null;
      }

      Logger.info(this.componentName, `✅ ${service} 토큰 조회 완료`);
      return tokens;

    } catch (error) {
      Logger.error(this.componentName, `❌ ${service} 토큰 조회 실패`, error);
      return null;
    }
  }

  /**
   * 🔥 토큰 삭제
   */
  async deleteTokens(service: 'google' | 'hancom'): Promise<boolean> {
    try {
      const settingsManager = getSettingsManager();
      settingsManager.setDeep(`app.oauth_${service}_tokens`, undefined);

      Logger.info(this.componentName, `✅ ${service} 토큰 삭제 완료`);
      return true;

    } catch (error) {
      Logger.error(this.componentName, `❌ ${service} 토큰 삭제 실패`, error);
      return false;
    }
  }

  /**
   * 🔥 토큰 새로고침 (Google API 호출)
   */
  async refreshTokens(service: 'google'): Promise<OAuthTokens | null> {
    try {
      const currentTokens = await this.getTokens(service);
      if (!currentTokens?.refresh_token) {
        Logger.warn(this.componentName, `⚠️ ${service} refresh_token이 없습니다`);
        return null;
      }

      // Google OAuth refresh 요청
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          refresh_token: currentTokens.refresh_token,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        throw new Error(`Refresh failed: ${response.status}`);
      }

      const newTokens: OAuthTokens = await response.json();
      
      // 기존 refresh_token 유지 (새로 발급되지 않을 수 있음)
      if (!newTokens.refresh_token) {
        newTokens.refresh_token = currentTokens.refresh_token;
      }

      // 새 토큰 저장
      await this.saveTokens(service, newTokens);

      Logger.info(this.componentName, `✅ ${service} 토큰 갱신 완료`);
      return newTokens;

    } catch (error) {
      Logger.error(this.componentName, `❌ ${service} 토큰 갱신 실패`, error);
      return null;
    }
  }
}

// 🔥 싱글톤 익스포트
export const tokenStorage = TokenStorageService.getInstance();
