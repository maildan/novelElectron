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

// #DEBUG: Main index module entry point
Logger.debug('MAIN_INDEX', 'Main index module loaded');

// 🔥 기가차드 메인 애플리케이션 클래스
class LoopApplication {
  private isInitialized = false;
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    Logger.info('MAIN_INDEX', 'Loop application instance created');
    this.setupEventHandlers();
  }

  // 🔥 애플리케이션 초기화
  public async initialize(): Promise<void> {
    try {
      // #DEBUG: Initializing application
      Logger.debug('MAIN_INDEX', 'Starting application initialization');

      // 보안 관리자는 이미 초기화됨 (싱글톤)
      Logger.info('MAIN_INDEX', 'Security manager ready');

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
      if (process.platform !== 'darwin') {
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

  // 🔥 애플리케이션 종료
  private async shutdown(): Promise<void> {
    try {
      Logger.info('MAIN_INDEX', 'Starting application shutdown');

      // 키보드 서비스 정지
      await keyboardService.stopMonitoring();
      Logger.info('MAIN_INDEX', 'Keyboard service stopped');

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
