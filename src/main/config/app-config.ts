// 🔥 기가차드 앱 설정 관리자

import { Logger } from '../../shared/logger';

// #DEBUG: App config entry point
Logger.debug('APP_CONFIG', 'App config module loaded');

// 🔥 기가차드 앱 설정 인터페이스
export interface AppConfig {
  version: string;
  environment: 'development' | 'production' | 'test';
  dataDirectory: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableAnalytics: boolean;
  enableCrashReporting: boolean;
  updateCheckInterval: number;
}

// 🔥 기가차드 기본 설정
export const DEFAULT_APP_CONFIG: AppConfig = {
  version: '1.0.0',
  environment: 'development',
  dataDirectory: './data',
  logLevel: 'info',
  enableAnalytics: false,
  enableCrashReporting: false,
  updateCheckInterval: 86400000, // 24시간
};

// 🔥 기가차드 앱 설정 관리자
export class AppConfigManager {
  private static instance: AppConfigManager | null = null;
  private config: AppConfig = { ...DEFAULT_APP_CONFIG };

  private constructor() {
    this.loadConfig();
  }

  public static getInstance(): AppConfigManager {
    if (!AppConfigManager.instance) {
      AppConfigManager.instance = new AppConfigManager();
    }
    return AppConfigManager.instance;
  }

  private loadConfig(): void {
    // TODO: 설정 파일에서 로드
    Logger.info('APP_CONFIG', 'Config loaded', this.config);
  }

  public getConfig(): Readonly<AppConfig> {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates };
    Logger.info('APP_CONFIG', 'Config updated', updates);
  }
}

export const appConfig = AppConfigManager.getInstance();
export default appConfig;
