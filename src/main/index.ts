// 🔥 기가차드 메인 진입점 - 통합 Electron 앱 부트스트래퍼

import { app, BrowserWindow } from 'electron';
import { Logger } from '../shared/logger';
import { windowManager } from './core/window';
import { securityManager } from './core/security';
import { autoLaunchManager } from './core/autoLaunch';
import { errorHandler } from './core/error-handler';
import { keyboardService } from './keyboard/keyboardService';
import { setupKeyboardIpcHandlers } from './handlers/keyboardIpcHandlers';
import { setupDashboardIpcHandlers } from './handlers/dashboardIpcHandlers';
import { initializeSettings, cleanupSettings } from './settings';
import { getSettingsManager } from './settings';
import type { SettingsChangeEvent, UISettingsSchema, AppSettingsSchema, KeyboardSettingsSchema, NotificationSettingsSchema, DataRetentionSettingsSchema } from './settings/types';
import { BrowserDetector } from './managers/BrowserDetector';
import { MemoryManager } from './managers/MemoryManager';
import { DataSyncManager } from './managers/DataSyncManager';
import { getMenuManager } from './managers/MenuManager';
import { getShortcutsManager } from './managers/ShortcutsManager';
import { getTrayManager } from './managers/TrayManager';
import { Platform } from './utils/platform';

// #DEBUG: Main index module entry point
Logger.debug('MAIN_INDEX', 'Main index module loaded');

// 🔥 기가차드 메인 애플리케이션 클래스
class LoopApplication {
  private isInitialized = false;
  private mainWindow: BrowserWindow | null = null;
  private browserDetector: BrowserDetector | null = null;
  private memoryManager: MemoryManager | null = null;
  private dataSyncManager: DataSyncManager | null = null;
  private menuManager: import('./managers/MenuManager').MenuManager | null = null;
  private shortcutsManager: import('./managers/ShortcutsManager').ShortcutsManager | null = null;
  private trayManager: import('./managers/TrayManager').TrayManager | null = null;

  constructor() {
    Logger.info('MAIN_INDEX', 'Loop application instance created');
    this.setupEventHandlers();
  }

  // 🔥 새로운 매니저들 초기화
  private async initializeNewManagers(): Promise<void> {
    try {
      Logger.debug('MAIN_INDEX', 'Initializing new managers');

      // 브라우저 감지기 초기화
      this.browserDetector = new BrowserDetector();
      await this.browserDetector.initialize();
      await this.browserDetector.start();
      Logger.info('MAIN_INDEX', 'Browser detector initialized');

      // 메모리 관리자 초기화
      this.memoryManager = new MemoryManager();
      await this.memoryManager.initialize();
      await this.memoryManager.start();
      Logger.info('MAIN_INDEX', 'Memory manager initialized');

      // 데이터 동기화 관리자 초기화
      this.dataSyncManager = new DataSyncManager();
      await this.dataSyncManager.initialize();
      Logger.info('MAIN_INDEX', 'Data sync manager initialized');

      // 메뉴 관리자 초기화
      this.menuManager = getMenuManager();
      await this.menuManager.initialize();
      await this.menuManager.start();
      Logger.info('MAIN_INDEX', 'Menu manager initialized');

      // 단축키 관리자 초기화
      this.shortcutsManager = getShortcutsManager();
      await this.shortcutsManager.initialize();
      await this.shortcutsManager.start();
      Logger.info('MAIN_INDEX', 'Shortcuts manager initialized');

      // 트레이 관리자 초기화 (설정에 따라)
      this.trayManager = getTrayManager();
      await this.trayManager.initialize();
      await this.trayManager.start();
      Logger.info('MAIN_INDEX', 'Tray manager initialized');

      // 🔥 설정 변경 감시자 설정
      this.setupSettingsWatchers();

      Logger.info('MAIN_INDEX', 'All new managers initialized successfully');
    } catch (error) {
      Logger.error('MAIN_INDEX', 'Failed to initialize new managers', error);
      throw error;
    }
  }

  // 🔥 애플리케이션 초기화
  public async initialize(): Promise<void> {
    try {
      // #DEBUG: Initializing application
      Logger.debug('MAIN_INDEX', 'Starting application initialization');

      // 보안 관리자는 이미 초기화됨 (싱글톤)
      Logger.info('MAIN_INDEX', 'Security manager ready');

      // Settings 시스템 초기화
      await initializeSettings();
      Logger.info('MAIN_INDEX', 'Settings system initialized');

      // 새로운 매니저들 초기화
      await this.initializeNewManagers();
      Logger.info('MAIN_INDEX', 'New managers initialized');

      // 자동 실행 설정
      if (app.isPackaged) {
        const isEnabled = autoLaunchManager.isAutoLaunchEnabled();
        if (!isEnabled) {
          await autoLaunchManager.enableAutoLaunch();
        }
        Logger.info('MAIN_INDEX', 'Auto-launch configured for packaged app');
      }

      // IPC 핸들러 설정
      this.setupIpcHandlers();
      Logger.info('MAIN_INDEX', 'IPC handlers setup complete');

      this.isInitialized = true;
      Logger.info('MAIN_INDEX', 'Application initialization complete');

    } catch (error) {
      Logger.error('MAIN_INDEX', 'Failed to initialize application', error);
      throw error;
    }
  }

  // 🔥 메인 윈도우 생성
  public async createMainWindow(): Promise<void> {
    try {
      // #DEBUG: Creating main window
      Logger.debug('MAIN_INDEX', 'Creating main window');

      this.mainWindow = await windowManager.createMainWindow();
      
      // 글로벌 윈도우 참조 설정 (keyboardService에서 사용)
      (global as typeof global & { mainWindow: BrowserWindow }).mainWindow = this.mainWindow;

      Logger.info('MAIN_INDEX', 'Main window created successfully');

    } catch (error) {
      Logger.error('MAIN_INDEX', 'Failed to create main window', error);
      throw error;
    }
  }

  // 🔥 키보드 서비스 시작
  public async startKeyboardService(): Promise<void> {
    try {
      // #DEBUG: Starting keyboard service
      Logger.debug('MAIN_INDEX', 'Starting keyboard service');

      // 키보드 서비스는 이미 초기화됨 (싱글톤)
      // 모니터링은 사용자가 수동으로 시작
      Logger.info('MAIN_INDEX', 'Keyboard service ready');

    } catch (error) {
      Logger.error('MAIN_INDEX', 'Failed to start keyboard service', error);
      // 키보드 서비스 실패는 앱을 종료하지 않음
    }
  }

  // 🔥 이벤트 핸들러 설정
  private setupEventHandlers(): void {
    // #DEBUG: Setting up event handlers
    Logger.debug('MAIN_INDEX', 'Setting up application event handlers');

    // 앱 준비 완료
    app.whenReady().then(async () => {
      try {
        await this.initialize();
        await this.createMainWindow();
        await this.startKeyboardService();
        
        Logger.info('MAIN_INDEX', 'Application ready and running');
      } catch (error) {
        Logger.error('MAIN_INDEX', 'Failed to start application', error);
        app.quit();
      }
    });

    // 모든 윈도우 닫힘
    app.on('window-all-closed', () => {
      Logger.debug('MAIN_INDEX', 'All windows closed');
      
      // macOS가 아니면 앱 종료
      if (!Platform.isMacOS()) {
        this.shutdown();
      }
    });

    // 앱 활성화 (macOS)
    app.on('activate', async () => {
      Logger.debug('MAIN_INDEX', 'Application activated');
      
      if (BrowserWindow.getAllWindows().length === 0) {
        await this.createMainWindow();
      }
    });

    // 앱 종료 전
    app.on('before-quit', (event) => {
      Logger.debug('MAIN_INDEX', 'Application before quit');
      
      if (this.isInitialized) {
        event.preventDefault();
        this.shutdown();
      }
    });

    // 보안 경고 (WebContents 핸들러는 보안 매니저에서 자동 처리됨)
    app.on('web-contents-created', (_, contents) => {
      // 보안 매니저가 자동으로 처리
      Logger.debug('MAIN_INDEX', 'Web contents created with security protection');
    });

    Logger.info('MAIN_INDEX', 'Event handlers setup complete');
  }

  // 🔥 IPC 핸들러 설정
  private setupIpcHandlers(): void {
    // #DEBUG: Setting up IPC handlers
    Logger.debug('MAIN_INDEX', 'Setting up IPC handlers');

    try {
      // 키보드 IPC 핸들러
      setupKeyboardIpcHandlers();
      Logger.info('MAIN_INDEX', 'Keyboard IPC handlers registered');

      // 대시보드 IPC 핸들러 (이미 구현됨)
      setupDashboardIpcHandlers();
      Logger.info('MAIN_INDEX', 'Dashboard IPC handlers registered');

      // 추가 IPC 핸들러들은 필요시 확장 가능
      Logger.debug('MAIN_INDEX', 'All IPC handlers setup completed');

    } catch (error) {
      Logger.error('MAIN_INDEX', 'Failed to setup IPC handlers', error);
      throw error;
    }
  }

  // 🔥 설정 변경 감시자 설정
  private setupSettingsWatchers(): void {
    try {
      Logger.debug('MAIN_INDEX', 'Setting up settings watchers');

      const settingsManager = getSettingsManager();

      // 🎨 UI 테마 변경 감지
      settingsManager.watch('ui', (event: SettingsChangeEvent<UISettingsSchema>) => {
        Logger.info('MAIN_INDEX', 'UI settings changed', {
          key: event.key,
          oldValue: event.oldValue?.colorScheme,
          newValue: event.newValue?.colorScheme
        });
        
        // 메뉴 관리자에 테마 변경 알림
        if (this.menuManager) {
          this.menuManager.updateTheme(event.newValue?.colorScheme || 'blue');
        }
      });

      // 🏠 앱 설정 변경 감지
      settingsManager.watch('app', (event: SettingsChangeEvent<AppSettingsSchema>) => {
        Logger.info('MAIN_INDEX', 'App settings changed', {
          key: event.key,
          theme: event.newValue?.theme,
          language: event.newValue?.language
        });

        // 트레이 표시/숨기기
        if (this.trayManager) {
          this.trayManager.toggleTrayVisibility();
        }

        // 언어 변경 시 메뉴 업데이트
        if (this.menuManager && event.oldValue?.language !== event.newValue?.language) {
          this.menuManager.updateLanguage(event.newValue?.language || 'ko');
        }
      });

      // ⌨️ 키보드 설정 변경 감지
      settingsManager.watch('keyboard', (event: SettingsChangeEvent<KeyboardSettingsSchema>) => {
        Logger.info('MAIN_INDEX', 'Keyboard settings changed', {
          key: event.key,
          enabled: event.newValue?.enabled,
          shortcuts: event.newValue?.globalShortcuts
        });

        // 단축키 관리자에 변경 알림
        if (this.shortcutsManager) {
          this.shortcutsManager.updateShortcuts(event.newValue?.globalShortcuts || {});
        }
      });

      // 🔔 알림 설정 변경 감지
      settingsManager.watch('notifications', (event: SettingsChangeEvent<NotificationSettingsSchema>) => {
        Logger.info('MAIN_INDEX', 'Notification settings changed', {
          key: event.key,
          enabled: event.newValue?.enableNotifications
        });
      });

      // 🗄️ 데이터 보관 설정 변경 감지
      settingsManager.watch('dataRetention', (event: SettingsChangeEvent<DataRetentionSettingsSchema>) => {
        Logger.info('MAIN_INDEX', 'Data retention settings changed', {
          key: event.key,
          retentionPeriod: event.newValue?.retentionPeriod
        });

        // 데이터 동기화 관리자에 변경 알림
        if (this.dataSyncManager) {
          this.dataSyncManager.updateRetentionPolicy(event.newValue || {
            retentionPeriod: 30,
            autoDeleteOldData: false,
            enableDataArchive: true,
            typingData: { enabled: true, retentionDays: 30, enableCompression: false },
            keystrokeData: { enabled: true, retentionDays: 7, enableAggregation: true }
          });
        }
      });

      Logger.info('MAIN_INDEX', 'Settings watchers setup complete');

    } catch (error) {
      Logger.error('MAIN_INDEX', 'Failed to setup settings watchers', error);
    }
  }

  // 🔥 새로운 매니저들 정리
  private async cleanupNewManagers(): Promise<void> {
    try {
      Logger.debug('MAIN_INDEX', 'Cleaning up new managers');

      // 트레이 관리자 정리
      if (this.trayManager) {
        await this.trayManager.stop();
        await this.trayManager.cleanup();
        this.trayManager = null;
        Logger.info('MAIN_INDEX', 'Tray manager cleaned up');
      }

      // 단축키 관리자 정리
      if (this.shortcutsManager) {
        await this.shortcutsManager.stop();
        await this.shortcutsManager.cleanup();
        this.shortcutsManager = null;
        Logger.info('MAIN_INDEX', 'Shortcuts manager cleaned up');
      }

      // 메뉴 관리자 정리
      if (this.menuManager) {
        await this.menuManager.stop();
        await this.menuManager.cleanup();
        this.menuManager = null;
        Logger.info('MAIN_INDEX', 'Menu manager cleaned up');
      }

      // 데이터 동기화 관리자 정리
      if (this.dataSyncManager) {
        await this.dataSyncManager.stop();
        await this.dataSyncManager.cleanup();
        this.dataSyncManager = null;
        Logger.info('MAIN_INDEX', 'Data sync manager cleaned up');
      }

      // 메모리 관리자 정리
      if (this.memoryManager) {
        await this.memoryManager.stop();
        await this.memoryManager.cleanup();
        this.memoryManager = null;
        Logger.info('MAIN_INDEX', 'Memory manager cleaned up');
      }

      // 브라우저 감지기 정리
      if (this.browserDetector) {
        await this.browserDetector.stop();
        await this.browserDetector.cleanup();
        this.browserDetector = null;
        Logger.info('MAIN_INDEX', 'Browser detector cleaned up');
      }

      Logger.info('MAIN_INDEX', 'All new managers cleaned up successfully');
    } catch (error) {
      Logger.error('MAIN_INDEX', 'Error cleaning up new managers', error);
      // 정리 중 에러는 로그만 남기고 계속 진행
    }
  }

  // 🔥 애플리케이션 종료
  private async shutdown(): Promise<void> {
    try {
      Logger.info('MAIN_INDEX', 'Starting application shutdown');

      // 키보드 서비스 정지
      await keyboardService.stopMonitoring();
      Logger.info('MAIN_INDEX', 'Keyboard service stopped');

      // 새로운 매니저들 정리
      await this.cleanupNewManagers();
      Logger.info('MAIN_INDEX', 'New managers cleaned up');

      // Settings 시스템 정리
      await cleanupSettings();
      Logger.info('MAIN_INDEX', 'Settings system cleaned up');

      // 윈도우 정리
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.close();
        this.mainWindow = null;
      }

      // 앱 종료
      app.quit();
      Logger.info('MAIN_INDEX', 'Application shutdown complete');

    } catch (error) {
      Logger.error('MAIN_INDEX', 'Error during shutdown', error);
      app.exit(1);
    }
  }
}

// 🔥 기가차드 애플리케이션 인스턴스 생성 및 실행
const loopApp = new LoopApplication();

// #DEBUG: Main index module exit point
Logger.debug('MAIN_INDEX', 'Main index module setup complete');

export default loopApp;
