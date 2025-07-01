// 🔥 기가차드 메인 진입점 - 통합 Electron 앱 부트스트래퍼

// 🔥 환경변수 로딩 (최우선)
import { config } from 'dotenv';
import { join } from 'path';

// 환경에 따른 .env 파일 로딩
const envPath = join(__dirname, '../..', `.env.${process.env.NODE_ENV || 'development'}`);
config({ path: envPath });

// 기본 .env 파일도 로딩 (백업)
config({ path: join(__dirname, '../..', '.env') });

import { app, BrowserWindow } from 'electron';
import { Logger } from '../shared/logger';

// 로거 초기화 후 환경 정보 출력
Logger.info('MAIN_INDEX', `🔥 Environment loaded: ${process.env.NODE_ENV}, LOG_LEVEL: ${process.env.LOG_LEVEL}, DEBUG: ${process.env.DEBUG}`);

import { windowManager } from './core/window';
import { securityManager } from './core/security';
import { autoLaunchManager } from './core/autoLaunch';
import { errorHandler } from './core/error-handler';
import { keyboardService } from './keyboard/keyboardService';
import { setupAllIpcHandlers } from './ipc-handlers';
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
import { dialogManager } from './dialog-manager';
import { WindowTracker } from './keyboard/WindowTracker';

// #DEBUG: Main index module entry point
Logger.debug('MAIN_INDEX', 'Main index module loaded');

// 🔥 기가차드 메인 애플리케이션 클래스
class LoopApplication {
  private isInitialized = false;
  private mainWindow: BrowserWindow | null = null;
  private hasAccessibilityPermission = false; // 🔥 권한 상태 저장
  private isRequestingPermissions = false; // 🔥 중복 요청 방지 플래그
  private permissionMonitorInterval: NodeJS.Timeout | null = null; // 🔥 권한 모니터링 인터벌
  private browserDetector: BrowserDetector | null = null;
  private windowTracker: WindowTracker | null = null; // 🔥 WindowTracker 추가
  private memoryManager: MemoryManager | null = null;
  private dataSyncManager: DataSyncManager | null = null;
  private menuManager: import('./managers/MenuManager').MenuManager | null = null;
  private shortcutsManager: import('./managers/ShortcutsManager').ShortcutsManager | null = null;
  private trayManager: import('./managers/TrayManager').TrayManager | null = null;

  
  constructor() {
    Logger.info('MAIN_INDEX', 'Loop application instance created');
    this.setupEventHandlers();
  }

  // 🔥 새로운 매니저들 초기화 (권한 기반)
  private async initializeNewManagers(hasAccessibilityPermission: boolean): Promise<void> {
    try {
      Logger.debug('MAIN_INDEX', 'Initializing new managers', { hasAccessibilityPermission });

      // 🔥 권한 독립적인 매니저들 먼저 초기화
      
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
      Logger.info('MAIN_INDEX', '🚀 Starting Menu Manager initialization...');
      this.menuManager = getMenuManager();
      await this.menuManager.initialize();
      await this.menuManager.start();
      Logger.info('MAIN_INDEX', '✅ Menu manager initialized and started successfully');

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

      // 🔥 권한 의존적인 매니저들 - 초기화만 하고 시작은 하지 않음
      if (hasAccessibilityPermission) {
        Logger.info('MAIN_INDEX', '🔐 Initializing accessibility-dependent managers...');
        
        // 브라우저 감지기 초기화만 (시작은 키보드 모니터링시)
        this.browserDetector = new BrowserDetector({}, hasAccessibilityPermission);
        await this.browserDetector.initialize();
        // await this.browserDetector.start(); // 제거됨 - 키보드 모니터링시 시작
        Logger.info('MAIN_INDEX', 'Browser detector initialized (not started)');
        
      } else {
        Logger.warn('MAIN_INDEX', '⚠️ Skipping accessibility-dependent managers (no permission)');
        Logger.warn('MAIN_INDEX', 'WindowTracker and BrowserDetector will not be available');
      }

      // 🔥 설정 변경 감시자 설정
      this.setupSettingsWatchers();

      Logger.info('MAIN_INDEX', 'All new managers initialized successfully');
    } catch (error) {
      Logger.error('MAIN_INDEX', 'Failed to initialize new managers', error);
      throw error;
    }
  }

  // 🔥 통합 권한 체크 및 요청 - UnifiedPermissionManager 사용
  private async checkAndRequestPermissions(): Promise<boolean> {
    try {
      Logger.debug('MAIN_INDEX', 'Checking macOS permissions with UnifiedPermissionManager');

      // 🔥 통합 권한 관리자 사용
      const { unifiedPermissionManager } = await import('./utils/UnifiedPermissionManager');
      
      // 🔥 중복 요청 방지
      if (this.isRequestingPermissions) {
        Logger.debug('MAIN_INDEX', '권한 요청이 이미 진행 중 - 건너뛰기');
        return false;
      }

      // 🔥 현재 권한 상태 확인
      const permissions = await unifiedPermissionManager.checkAllPermissions();
      
      Logger.info('MAIN_INDEX', '� 권한 상태 체크', {
        accessibility: permissions.accessibility ? '✅ 허용됨' : '❌ 거부됨',
        screenRecording: permissions.screenRecording ? '✅ 허용됨' : '❌ 거부됨'
      });
      
      // 🔥 권한 상태 저장
      this.hasAccessibilityPermission = permissions.accessibility;

      // 🔥 접근성 권한이 없으면 자동 요청
      if (!permissions.accessibility) {
        this.isRequestingPermissions = true;
        Logger.info('MAIN_INDEX', '� 접근성 권한 자동 요청 시작');

        const accessibilityResult = await unifiedPermissionManager.requestAccessibilityPermission();
        this.isRequestingPermissions = false;

        if (accessibilityResult.success && accessibilityResult.data) {
          this.hasAccessibilityPermission = true;
          Logger.info('MAIN_INDEX', '✅ 접근성 권한 허용됨!');
          
          // 권한 허용 후 재확인
          const updatedPermissions = await unifiedPermissionManager.checkAllPermissions();
          return updatedPermissions.accessibility;
        } else {
          Logger.warn('MAIN_INDEX', '⚠️ 접근성 권한 거부됨');
          return false;
        }
      }

      // 🔥 화면 기록 권한도 체크 (필요한 경우)
      if (!permissions.screenRecording) {
        Logger.info('MAIN_INDEX', '� 화면 기록 권한 요청');
        await unifiedPermissionManager.requestScreenRecordingPermission();
      }

      return permissions.accessibility;

    } catch (error) {
      Logger.error('MAIN_INDEX', 'Permission check/request failed', error);
      this.isRequestingPermissions = false;
      return false;
    }
  }



  // 🔥 애플리케이션 초기화
  public async initialize(): Promise<void> {
    try {
      // #DEBUG: Initializing application
      Logger.debug('MAIN_INDEX', 'Starting application initialization');

      // 🔥 권한은 모니터링 시작 시에만 체크하도록 변경
      Logger.info('MAIN_INDEX', 'Permissions will be checked when monitoring starts');

      // 보안 관리자는 이미 초기화됨 (싱글톤)
      Logger.info('MAIN_INDEX', 'Security manager ready');

      // Settings 시스템 초기화
      await initializeSettings();
      Logger.info('MAIN_INDEX', 'Settings system initialized');

      // 새로운 매니저들 초기화 - 권한 없이도 초기화
      await this.initializeNewManagers(false);
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
      await this.setupIpcHandlers();
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

      this.mainWindow = windowManager.createMainWindow();
      
      // 🔥 URL 로딩 추가 (필수!)
      await windowManager.loadUrl('main');
      
      // 글로벌 윈도우 참조 설정 (keyboardService에서 사용)
      (global as typeof global & { mainWindow: BrowserWindow }).mainWindow = this.mainWindow;
      
      // 🔥 글로벌 앱 참조 설정 (IPC 핸들러에서 사용)
      (global as any).loopApp = this;

      Logger.info('MAIN_INDEX', 'Main window created and URL loaded successfully');

    } catch (error) {
      Logger.error('MAIN_INDEX', 'Failed to create main window', error);
      throw error;
    }
  }

  // 🔥 키보드 서비스 시작 (권한 기반)
  public async startKeyboardService(): Promise<void> {
    try {
      // #DEBUG: Starting keyboard service
      Logger.debug('MAIN_INDEX', 'Starting keyboard service', { hasAccessibilityPermission: this.hasAccessibilityPermission });

      // 🔥 접근성 권한 상태를 키보드 서비스에 전달
      keyboardService.setAccessibilityPermission(this.hasAccessibilityPermission);

      // 키보드 서비스는 이미 초기화됨 (싱글톤)
      // 모니터링은 사용자가 수동으로 시작
      Logger.info('MAIN_INDEX', 'Keyboard service ready', { 
        windowTracking: this.hasAccessibilityPermission ? 'enabled' : 'disabled' 
      });

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
        // 🔥 키보드 서비스는 사용자가 시작 버튼을 눌렀을 때만 시작
        // await this.startKeyboardService(); // 제거됨
        
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
    app.on('before-quit', (event: any) => {
      Logger.debug('MAIN_INDEX', 'Application before quit');
      
      if (this.isInitialized) {
        event.preventDefault();
        this.shutdown();
      }
    });

    // 보안 경고 (WebContents 핸들러는 보안 매니저에서 자동 처리됨)
    app.on('web-contents-created', (_: any, contents: any) => {
      // 보안 매니저가 자동으로 처리
      Logger.debug('MAIN_INDEX', 'Web contents created with security protection');
    });

    Logger.info('MAIN_INDEX', 'Event handlers setup complete');
  }

  // 🔥 IPC 핸들러 설정
  private async setupIpcHandlers(): Promise<void> {
    // #DEBUG: Setting up IPC handlers
    Logger.debug('MAIN_INDEX', 'Setting up IPC handlers');

    try {
      // 🔥 모든 IPC 핸들러 통합 설정
      await setupAllIpcHandlers();
      Logger.info('MAIN_INDEX', 'All IPC handlers registered successfully');

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

  // 🔥 macOS 권한 다이얼로그 (Apple 가이드라인 준수)
  private async showSinglePermissionDialog(
    permissionsToRequest: Array<{type: string, name: string, hasPermission: boolean}>
  ): Promise<boolean> {
    try {
      Logger.debug('MAIN_INDEX', 'macOS 권한 다이얼로그 표시', { permissionsToRequest });

      const { dialog } = await import('electron');
      
      // 🔥 macOS 가이드라인에 맞는 메시지 구성
      const hasAccessibility = permissionsToRequest.some(p => p.type === 'accessibility');
      const hasScreenRecording = permissionsToRequest.some(p => p.type === 'screenRecording');
      
      const message = 'Loop에서 다음 기능을 사용하기 위해 시스템 권한이 필요합니다:';
      let detail = '';
      
      if (hasAccessibility && hasScreenRecording) {
        detail = `• 키보드 입력 패턴 분석을 위한 접근성 권한
• 활성 앱과 창 감지를 위한 화면 기록 권한

이 권한들은 타이핑 통계와 생산성 분석에만 사용되며,
실제 화면 내용이나 개인정보는 저장되지 않습니다.

"시스템 환경설정 열기"를 클릭하면 설정 페이지로 이동합니다.
각 권한을 허용한 후 Loop가 자동으로 감지하여 기능이 활성화됩니다.`;
      } else if (hasAccessibility) {
        detail = `• 키보드 입력 패턴 분석을 위한 접근성 권한

이 권한은 타이핑 통계 생성에만 사용되며,
실제 입력 내용은 저장되지 않습니다.

"시스템 환경설정 열기"를 클릭하면 설정 페이지로 이동합니다.`;
      } else if (hasScreenRecording) {
        detail = `• 활성 앱과 창 감지를 위한 화면 기록 권한

이 권한은 생산성 분석에만 사용되며,
실제 화면 내용은 기록되지 않습니다.

"시스템 환경설정 열기"를 클릭하면 설정 페이지로 이동합니다.`;
      }
      
      const response = await dialog.showMessageBox({
        type: 'question',
        title: 'Loop - 시스템 권한 요청',
        message,
        detail,
        buttons: ['시스템 환경설정 열기', '나중에 설정'],
        defaultId: 0,
        cancelId: 1,
        icon: undefined // macOS 기본 아이콘 사용
      });
      
      if (response.response === 0) {
        Logger.info('MAIN_INDEX', '사용자가 시스템 환경설정 열기를 선택함');
        
        // 🔥 권한 종류에 따라 적절한 설정 페이지 열기
        if (hasAccessibility && hasScreenRecording) {
          await this.openAccessibilitySettings();
          // 2초 후 Screen Recording 설정도 열기
          setTimeout(async () => {
            await this.openScreenRecordingSettings();
          }, 2000);
        } else if (hasAccessibility) {
          await this.openAccessibilitySettings();
        } else if (hasScreenRecording) {
          await this.openScreenRecordingSettings();
        }
        
        return true;
      } else {
        Logger.info('MAIN_INDEX', '사용자가 권한 설정을 연기함');
        return false;
      }
      
    } catch (error) {
      Logger.error('MAIN_INDEX', 'Failed to show macOS permission dialog', error);
      return false;
    }
  }

  // 🔥 단일 통합 권한 다이얼로그 (간단하고 효과적)
  private async showSimplePermissionDialog(
    permissionsToRequest: Array<{type: string, name: string, hasPermission: boolean}>
  ): Promise<boolean> {
    try {
      // 중복 요청 방지
      if (this.isRequestingPermissions) {
        Logger.debug('MAIN_INDEX', '권한 요청이 이미 진행 중입니다');
        return false;
      }

      this.isRequestingPermissions = true;

      const { dialog } = await import('electron');
      
      const permissionList = permissionsToRequest
        .map(p => `• ${p.name}`)
        .join('\n');
      
      const response = await dialog.showMessageBox({
        type: 'question',
        title: 'Loop - 권한 설정 필요',
        message: 'Loop가 제대로 작동하려면 시스템 권한이 필요합니다',
        detail: `다음 권한들을 허용해주세요:

${permissionList}

"권한 설정하기"를 클릭하면 시스템 환경설정이 열립니다.
각 권한을 허용한 후 Loop를 다시 시작해주세요.

※ 이 권한들은 타이핑 분석 목적으로만 사용됩니다.`,
        buttons: ['🔧 권한 설정하기', '⏭️ 나중에'],
        defaultId: 0,
        cancelId: 1
      });
      
      if (response.response === 0) {
        Logger.info('MAIN_INDEX', '사용자가 권한 설정을 선택함');
        await this.openSystemPreferences();
        return true;
      } else {
        Logger.info('MAIN_INDEX', '사용자가 권한 설정을 연기함');
        return false;
      }
      
    } catch (error) {
      Logger.error('MAIN_INDEX', 'Failed to show simple permission dialog', error);
      return false;
    } finally {
      this.isRequestingPermissions = false;
    }
  }

  // 🔥 접근성 설정 직접 열기 (macOS 가이드라인)
  private async openAccessibilitySettings(): Promise<void> {
    try {
      const { shell } = await import('electron');
      
      // macOS 시스템 환경설정의 접근성 섹션으로 직접 이동
      await shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility');
      
      Logger.info('MAIN_INDEX', '🔧 시스템 환경설정 > 개인정보보호 > 접근성으로 이동됨');
      
    } catch (error) {
      Logger.error('MAIN_INDEX', 'Failed to open Accessibility settings', error);
      // 대안: 일반 개인정보보호 설정 열기
      await this.openSystemPreferences();
    }
  }

  // 🔥 Screen Recording 설정 직접 열기 (macOS 가이드라인)
  private async openScreenRecordingSettings(): Promise<void> {
    try {
      const { shell } = await import('electron');
      
      // macOS 시스템 환경설정의 Screen Recording 섹션으로 직접 이동
      await shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture');
      
      Logger.info('MAIN_INDEX', '🔧 시스템 환경설정 > 개인정보보호 > 화면 기록으로 이동됨');
      
    } catch (error) {
      Logger.error('MAIN_INDEX', 'Failed to open Screen Recording settings', error);
      // 대안: 일반 개인정보보호 설정 열기  
      await this.openSystemPreferences();
    }
  }

  // 🔥 시스템 환경설정 열기 (정확한 위치)
  private async openSystemPreferences(): Promise<void> {
    try {
      const { shell } = await import('electron');
      
      // macOS 버전에 따른 정확한 URL 사용
      const macOSVersion = parseFloat(require('os').release());
      let prefsUrl: string;
      
      if (macOSVersion >= 23.0) { // macOS 14 Sonoma+
        prefsUrl = 'x-apple.systempreferences:com.apple.settings.PrivacySecurity.extension';
      } else { // macOS 13 이하
        prefsUrl = 'x-apple.systempreferences:com.apple.preference.security?Privacy';
      }
      
      await shell.openExternal(prefsUrl);
      Logger.info('MAIN_INDEX', '시스템 환경설정이 열렸습니다');
      
    } catch (error) {
      Logger.error('MAIN_INDEX', 'Failed to open system preferences', error);
      
      // 대안: 일반 시스템 환경설정 열기
      try {
        const { shell } = await import('electron');
        await shell.openExternal('x-apple.systempreferences:');
      } catch (fallbackError) {
        Logger.error('MAIN_INDEX', 'Failed to open system preferences (fallback)', fallbackError);
      }
    }
  }

  // 🔥 조용한 권한 상태 모니터링 (백그라운드) - Electron 내장 API 사용
  private startQuietPermissionMonitoring(): void {
    Logger.info('MAIN_INDEX', '🔍 백그라운드 권한 모니터링 시작');
    
    // 기존 모니터링 정리
    if (this.permissionMonitorInterval) {
      clearInterval(this.permissionMonitorInterval);
    }
    
    // 3초마다 권한 상태 체크 (조용히)
    this.permissionMonitorInterval = setInterval(async () => {
      try {
        const { systemPreferences } = await import('electron');
        
        const currentAccessibilityPermission = systemPreferences.isTrustedAccessibilityClient(false);
        let currentScreenRecordingPermission = false;
        
        try {
          currentScreenRecordingPermission = systemPreferences.getMediaAccessStatus('screen') === 'granted';
        } catch (error) {
          Logger.debug('MAIN_INDEX', 'Screen recording permission check failed in monitoring', error);
        }
        
        // 🔥 접근성 권한 상태 변경 감지
        if (currentAccessibilityPermission !== this.hasAccessibilityPermission) {
          Logger.info('MAIN_INDEX', '🔄 접근성 권한 상태 변경 감지됨', {
            previous: this.hasAccessibilityPermission,
            current: currentAccessibilityPermission
          });
          
          this.hasAccessibilityPermission = currentAccessibilityPermission;
          
          // 🔥 매니저들에게 권한 상태 업데이트 전달
          await this.updateManagersPermissionState(currentAccessibilityPermission);
          
          if (currentAccessibilityPermission) {
            Logger.info('MAIN_INDEX', '✅ 접근성 권한이 새로 허용됨');
            
            // 매니저들이 없으면 새로 초기화
            if (!this.windowTracker && !this.browserDetector) {
              await this.initializeAccessibilityDependentManagers(true);
            }
            
            // 조용한 성공 알림
            this.showQuietSuccessNotification();
          } else {
            Logger.warn('MAIN_INDEX', '⚠️ 접근성 권한이 제거됨');
          }
        }
        
        // 🔥 모든 권한이 허용되면 모니터링 중단
        if (currentAccessibilityPermission && currentScreenRecordingPermission) {
          Logger.info('MAIN_INDEX', '🎉 모든 권한이 허용됨 - 주기적 모니터링 중단');
          if (this.permissionMonitorInterval) {
            clearInterval(this.permissionMonitorInterval);
            this.permissionMonitorInterval = null;
          }
        }
        
      } catch (error) {
        Logger.debug('MAIN_INDEX', '권한 모니터링 중 미미한 오류 (무시됨)', error);
      }
    }, 3000); // 3초 간격
    
    // 5분 후 모니터링 자동 중단
    setTimeout(() => {
      if (this.permissionMonitorInterval) {
        clearInterval(this.permissionMonitorInterval);
        this.permissionMonitorInterval = null;
        Logger.debug('MAIN_INDEX', '권한 모니터링 시간 초과로 중단 (5분)');
      }
    }, 300000);
  }

  // 🔥 매니저들의 권한 상태 업데이트
  private async updateManagersPermissionState(hasAccessibilityPermission: boolean): Promise<void> {
    try {
      // keyboardService 권한 업데이트
      keyboardService.setAccessibilityPermission(hasAccessibilityPermission);
      Logger.debug('MAIN_INDEX', 'keyboardService 권한 상태 업데이트됨');

      // WindowTracker 권한 상태 업데이트
      if (this.windowTracker) {
        this.windowTracker.setAccessibilityPermission(hasAccessibilityPermission);
        Logger.debug('MAIN_INDEX', 'WindowTracker 권한 상태 업데이트됨');
      }

      // BrowserDetector 권한 상태 업데이트
      if (this.browserDetector) {
        this.browserDetector.setAccessibilityPermission(hasAccessibilityPermission);
        Logger.debug('MAIN_INDEX', 'BrowserDetector 권한 상태 업데이트됨');
      }

      Logger.info('MAIN_INDEX', '🔄 모든 매니저의 권한 상태가 업데이트됨', {
        hasAccessibilityPermission
      });

    } catch (error) {
      Logger.error('MAIN_INDEX', '매니저 권한 상태 업데이트 실패', error);
    }
  }

  // 🔥 접근성 의존 매니저들 초기화 (분리된 메서드)
  private async initializeAccessibilityDependentManagers(hasAccessibilityPermission: boolean): Promise<void> {
    try {
      if (hasAccessibilityPermission) {
        Logger.info('MAIN_INDEX', '🚀 접근성 의존 매니저들 초기화 시작');

        // WindowTracker 초기화만 (시작은 키보드 모니터링시)
        if (!this.windowTracker) {
          this.windowTracker = new WindowTracker({}, hasAccessibilityPermission);
          await this.windowTracker.initialize();
          // await this.windowTracker.start(); // 제거됨 - 키보드 모니터링시 시작
          Logger.info('MAIN_INDEX', 'WindowTracker initialized (not started)');
        }

        // BrowserDetector 초기화만 (시작은 키보드 모니터링시)
        if (!this.browserDetector) {
          this.browserDetector = new BrowserDetector({}, hasAccessibilityPermission);
          await this.browserDetector.initialize();
          await this.browserDetector.start();
          Logger.info('MAIN_INDEX', 'BrowserDetector initialized and started');
        }

        Logger.info('MAIN_INDEX', '✅ 모든 접근성 의존 매니저들이 성공적으로 초기화됨');
      } else {
        Logger.warn('MAIN_INDEX', '⚠️ 접근성 권한이 없어 관련 매니저들을 건너뛰기');
      }
    } catch (error) {
      Logger.error('MAIN_INDEX', '접근성 의존 매니저 초기화 실패', error);
      throw error;
    }
  }

  // 🔥 조용한 성공 알림
  private showQuietSuccessNotification(): void {
    try {
      const { Notification } = require('electron');
      if (Notification.isSupported()) {
        new Notification({
          title: 'Loop 권한 설정 완료',
          body: '모든 기능을 사용할 수 있습니다! 🎉',
          silent: true
        }).show();
      }
    } catch (error) {
      Logger.debug('MAIN_INDEX', '조용한 알림 표시 실패 (무시됨)', error);
    }
  }

  // 🔥 앱 재시작 안내 (선택적)
  private async suggestAppRestart(): Promise<void> {
    try {
      const { dialog } = await import('electron');
      
      const response = await dialog.showMessageBox({
        type: 'info',
        title: 'Loop - 권한 설정 완료',
        message: '모든 권한이 허용되었습니다! 🎉',
        detail: '모든 기능을 활성화하려면 앱을 재시작하는 것이 좋습니다.\n\n지금 재시작하시겠습니까?',
        buttons: ['🔄 지금 재시작', '⏭️ 나중에'],
        defaultId: 0,
        cancelId: 1
      });
      
      if (response.response === 0) {
        Logger.info('MAIN_INDEX', '사용자가 앱 재시작을 선택함');
        app.relaunch();
        app.exit(0);
      }
      
    } catch (error) {
      Logger.error('MAIN_INDEX', 'Failed to suggest app restart', error);
    }
  }

}

// 🔥 기가차드 애플리케이션 인스턴스 생성 및 실행
const loopApp = new LoopApplication();

// #DEBUG: Main index module exit point
Logger.debug('MAIN_INDEX', 'Main index module setup complete');

export default loopApp;
