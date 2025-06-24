/**
 * 🔥 기가차드 플랫폼 매니저 - 간단 버전
 * Loop Typing Analytics - Platform Manager
 */

import { app } from 'electron';
import * as os from 'os';
import * as path from 'path';

export enum Platform {
  WINDOWS = 'win32',
  MACOS = 'darwin',
  LINUX = 'linux'
}

export class PlatformManager {
  private static instance: PlatformManager;

  private constructor() {}

  static getInstance(): PlatformManager {
    if (!PlatformManager.instance) {
      PlatformManager.instance = new PlatformManager();
    }
    return PlatformManager.instance;
  }

  /**
   * 현재 플랫폼 가져오기
   */
  getPlatform(): Platform {
    return process.platform as Platform;
  }

  /**
   * 플랫폼별 설정 가져오기
   */
  getPlatformConfig() {
    const platform = this.getPlatform();
    
    return {
      platform,
      arch: process.arch,
      isWindows: platform === Platform.WINDOWS,
      isMacOS: platform === Platform.MACOS,
      isLinux: platform === Platform.LINUX,
      homeDir: os.homedir(),
      tmpDir: os.tmpdir(),
      userDataPath: app.getPath('userData'),
      logsPath: app.getPath('logs'),
      appPath: app.getAppPath()
    };
  }

  /**
   * 시스템 정보 가져오기
   */
  getSystemInfo() {
    return {
      platform: process.platform,
      arch: process.arch,
      version: process.version,
      appVersion: app.getVersion(),
      electronVersion: process.versions.electron,
      nodeVersion: process.versions.node,
      memory: {
        total: Math.round(os.totalmem() / 1024 / 1024 / 1024) + 'GB',
        free: Math.round(os.freemem() / 1024 / 1024 / 1024) + 'GB'
      },
      cpus: os.cpus().length,
      hostname: os.hostname(),
      uptime: Math.round(os.uptime() / 60) + ' minutes'
    };
  }

  /**
   * 플랫폼별 경로 가져오기
   */
  getPaths() {
    const config = this.getPlatformConfig();
    
    return {
      home: config.homeDir,
      userData: config.userDataPath,
      logs: config.logsPath,
      app: config.appPath,
      temp: config.tmpDir,
      desktop: app.getPath('desktop'),
      documents: app.getPath('documents'),
      downloads: app.getPath('downloads')
    };
  }

  /**
   * 정리
   */
  cleanup(): void {
    console.log('🧹 플랫폼 매니저 정리 완료');
  }
}
