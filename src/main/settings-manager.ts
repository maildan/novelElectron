/**
 * 🔥 기가차드 설정 매니저
 * Loop Typing Analytics - Settings Manager
 */
import { app, ipcMain } from 'electron';
import { join } from 'path';
import { promises as fs } from 'fs';

export interface AppSettings {
  // 일반 설정
  autoLaunch: boolean;
  startMinimized: boolean;
  closeToTray: boolean;
  
  // 키보드 모니터링 설정
  enableKeyboardMonitoring: boolean;
  monitorAllApps: boolean;
  excludedApps: string[];
  
  // 알림 설정
  enableNotifications: boolean;
  notificationInterval: number; // 분 단위
  
  // 데이터 설정
  autoSaveInterval: number; // 분 단위
  maxSessionDuration: number; // 분 단위
  dataRetentionDays: number;
  
  // UI 설정
  theme: 'light' | 'dark' | 'system';
  language: 'ko' | 'en';
  showDetailedStats: boolean;
  
  // 개발자 설정
  enableDevTools: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

const DEFAULT_SETTINGS: AppSettings = {
  autoLaunch: false,
  startMinimized: false,
  closeToTray: true,
  
  enableKeyboardMonitoring: true,
  monitorAllApps: true,
  excludedApps: [],
  
  enableNotifications: true,
  notificationInterval: 60,
  
  autoSaveInterval: 5,
  maxSessionDuration: 240,
  dataRetentionDays: 30,
  
  theme: 'system',
  language: 'ko',
  showDetailedStats: true,
  
  enableDevTools: false,
  logLevel: 'info'
};

export class SettingsManager {
  private static instance: SettingsManager;
  private settings: AppSettings;
  private settingsPath: string;
  private isInitialized = false;

  private constructor() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.settingsPath = join(app.getPath('userData'), 'settings.json');
  }

  static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }

  /**
   * 설정 매니저 초기화
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      await this.loadSettings();
      this.setupIpcHandlers();
      
      this.isInitialized = true;
      console.log('🔧 기가차드 설정 매니저 초기화 완료');
    } catch (error) {
      console.error('❌ 설정 매니저 초기화 실패:', error);
      throw error;
    }
  }

  /**
   * 설정 로드
   */
  private async loadSettings(): Promise<void> {
    try {
      const settingsData = await fs.readFile(this.settingsPath, 'utf-8');
      const loadedSettings = JSON.parse(settingsData);
      
      // 기본 설정과 병합 (누락된 설정은 기본값으로)
      this.settings = { ...DEFAULT_SETTINGS, ...loadedSettings };
      
      console.log('✅ 설정 로드 완료');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log('ℹ️ 설정 파일이 없습니다. 기본 설정을 생성합니다.');
        await this.saveSettings();
      } else {
        console.error('❌ 설정 로드 실패:', error);
        throw error;
      }
    }
  }

  /**
   * 설정 저장
   */
  async saveSettings(): Promise<void> {
    try {
      const settingsData = JSON.stringify(this.settings, null, 2);
      await fs.writeFile(this.settingsPath, settingsData, 'utf-8');
      console.log('✅ 설정 저장 완료');
    } catch (error) {
      console.error('❌ 설정 저장 실패:', error);
      throw error;
    }
  }

  /**
   * 설정 가져오기
   */
  getSettings(): AppSettings {
    return { ...this.settings };
  }

  /**
   * 특정 설정 가져오기
   */
  getSetting<K extends keyof AppSettings>(key: K): AppSettings[K] {
    return this.settings[key];
  }

  /**
   * 설정 업데이트
   */
  async updateSettings(updates: Partial<AppSettings>): Promise<void> {
    try {
      this.settings = { ...this.settings, ...updates };
      await this.saveSettings();
      
      // 다른 프로세스에 설정 변경 알림
      this.notifySettingsChanged();
      
      console.log('✅ 설정 업데이트 완료');
    } catch (error) {
      console.error('❌ 설정 업데이트 실패:', error);
      throw error;
    }
  }

  /**
   * 특정 설정 업데이트
   */
  async updateSetting<K extends keyof AppSettings>(
    key: K, 
    value: AppSettings[K]
  ): Promise<void> {
    await this.updateSettings({ [key]: value } as Partial<AppSettings>);
  }

  /**
   * 설정 초기화
   */
  async resetSettings(): Promise<void> {
    try {
      this.settings = { ...DEFAULT_SETTINGS };
      await this.saveSettings();
      
      this.notifySettingsChanged();
      
      console.log('✅ 설정 초기화 완료');
    } catch (error) {
      console.error('❌ 설정 초기화 실패:', error);
      throw error;
    }
  }

  /**
   * 설정 변경 알림
   */
  private notifySettingsChanged(): void {
    // 렌더러 프로세스에 설정 변경 알림
    try {
      const { BrowserWindow } = require('electron');
      const mainWindow = BrowserWindow.getAllWindows()[0];
      
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('settings-changed', this.settings);
      }
    } catch (error) {
      console.warn('⚠️ 설정 변경 알림 전송 실패:', error);
    }
  }

  /**
   * IPC 핸들러 설정
   */
  private setupIpcHandlers(): void {
    // 설정 조회
    ipcMain.handle('get-settings', () => {
      return this.getSettings();
    });

    // 특정 설정 조회
    ipcMain.handle('get-setting', (event, key: keyof AppSettings) => {
      return this.getSetting(key);
    });

    // 설정 업데이트
    ipcMain.handle('update-settings', async (event, updates: Partial<AppSettings>) => {
      return await this.updateSettings(updates);
    });

    // 특정 설정 업데이트
    ipcMain.handle('update-setting', async (event, key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => {
      return await this.updateSetting(key, value);
    });

    // 설정 초기화
    ipcMain.handle('reset-settings', async () => {
      return await this.resetSettings();
    });

    // 설정 내보내기
    ipcMain.handle('export-settings', () => {
      return {
        settings: this.getSettings(),
        timestamp: new Date().toISOString(),
        version: app.getVersion()
      };
    });

    // 설정 가져오기
    ipcMain.handle('import-settings', async (event, importData: { settings?: Partial<AppSettings>; timestamp?: string; version?: string }) => {
      try {
        if (importData && importData.settings) {
          await this.updateSettings(importData.settings);
          return true;
        }
        throw new Error('잘못된 설정 데이터입니다');
      } catch (error) {
        console.error('❌ 설정 가져오기 실패:', error);
        throw error;
      }
    });

    console.log('✅ 설정 IPC 핸들러 설정 완료');
  }

  /**
   * 정리
   */
  async cleanup(): Promise<void> {
    try {
      await this.saveSettings();
      
      // IPC 핸들러 정리
      ipcMain.removeHandler('get-settings');
      ipcMain.removeHandler('get-setting');
      ipcMain.removeHandler('update-settings');
      ipcMain.removeHandler('update-setting');
      ipcMain.removeHandler('reset-settings');
      ipcMain.removeHandler('export-settings');
      ipcMain.removeHandler('import-settings');
      
      this.isInitialized = false;
      console.log('✅ 설정 매니저 정리 완료');
    } catch (error) {
      console.error('❌ 설정 매니저 정리 실패:', error);
    }
  }
}

export default SettingsManager;
