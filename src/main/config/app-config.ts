import { Logger } from "../../shared/logger";
const log = Logger;/**
 * 🔥 기가차드 애플리케이션 설정 관리
 * Application Configuration Manager
 */

import { app } from 'electron';
import * as path from 'path';
import { config } from 'dotenv';

// Environment variables
export const isDev = process.env.NODE_ENV === 'development';
export const isProd = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// App configuration
export interface AppConfig {
  name: string;
  version: string;
  isDev: boolean;
  isProd: boolean;
  isTest: boolean;
  platform: NodeJS.Platform;
  arch: string;
  userDataPath: string;
  appPath: string;
  logsPath: string;
  dbPath: string;
  port: {
    dev: number;
    static: number;
  };
  window: {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
  };
  keyboard: {
    enabled: boolean;
    languages: string[];
  };
}

let appConfig: AppConfig;

/**
 * 앱 설정 초기화
 */
export function initializeAppConfig(): AppConfig {
  log.info("Console", '🔧 앱 설정 초기화 중...');

  // Load environment variables
  config();

  const userDataPath = app.getPath('userData');
  const appPath = app.getAppPath();

  appConfig = {
    name: 'Loop',
    version: '0.1.0',
    isDev,
    isProd,
    isTest,
    platform: process.platform,
    arch: process.arch,
    userDataPath,
    appPath,
    logsPath: path.join(userDataPath, 'logs'),
    dbPath: path.join(userDataPath, 'loop.db'),
    port: {
      dev: 3000,
      static: 5500
    },
    window: {
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600
    },
    keyboard: {
      enabled: true,
      languages: ['ko', 'en', 'ja', 'zh']
    }
  };

  // 환경 정보 로깅
  log.info("Console", `📱 앱: ${appConfig.name} v${appConfig.version}`);
  log.info("Console", `🔧 환경: ${isDev ? 'Development' : isProd ? 'Production' : 'Test'}`);
  log.info("Console", `💻 플랫폼: ${appConfig.platform} (${appConfig.arch})`);
  log.info("Console", `📁 사용자 데이터: ${appConfig.userDataPath}`);
  log.info("Console", `📁 앱 경로: ${appConfig.appPath}`);
  log.info("Console", `📁 로그 경로: ${appConfig.logsPath}`);
  log.info("Console", `💾 DB 경로: ${appConfig.dbPath}`);

  return appConfig;
}

/**
 * 앱 설정 반환
 */
export function getAppConfig(): AppConfig {
  if (!appConfig) {
    throw new Error('앱 설정이 초기화되지 않았습니다. initializeAppConfig()를 먼저 호출하세요.');
  }
  return appConfig;
}

/**
 * 개발 모드 여부
 */
export function isDevMode(): boolean {
  return isDev;
}

/**
 * 프로덕션 모드 여부
 */
export function isProdMode(): boolean {
  return isProd;
}

/**
 * 테스트 모드 여부
 */
export function isTestMode(): boolean {
  return isTest;
}
