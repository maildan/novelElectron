// 🔥 기가차드 Application Bootstrapper - 메인 오케스트레이터

import { app } from 'electron';
import { Logger } from '../../shared/logger';
import { ManagerCoordinator } from './ManagerCoordinator';
import { EventController } from './EventController';
import { SettingsWatcher } from './SettingsWatcher';
import { ShutdownManager } from './ShutdownManager';
import { unifiedPermissionManager } from '../utils/UnifiedPermissionManager';
import { windowManager } from '../core/window';

/**
 * 🔥 ApplicationBootstrapper - 978줄을 50줄로 축소한 메인 오케스트레이터
 * 
 * 책임:
 * - 앱 부트스트래핑 프로세스 조정
 * - 기존 매니저들과 유틸리티들의 통합 관리
 * - 단계별 초기화 순서 보장
 */
export class ApplicationBootstrapper {
  private managerCoordinator: ManagerCoordinator;
  private eventController: EventController;
  private settingsWatcher: SettingsWatcher;
  private shutdownManager: ShutdownManager;
  private hasAccessibilityPermission = false;

  constructor() {
    // 🔥 의존성 주입으로 깔끔하게 구성
    this.managerCoordinator = new ManagerCoordinator();
    this.eventController = new EventController();
    this.settingsWatcher = new SettingsWatcher();
    this.shutdownManager = new ShutdownManager(this.managerCoordinator);

    Logger.info('BOOTSTRAPPER', '🚀 Application bootstrapper created');
  }

  /**
   * 🔥 메인 부트스트래핑 프로세스
   */
  public async bootstrap(): Promise<void> {
    try {
      Logger.info('BOOTSTRAPPER', 'Starting bootstrap process...');

      // 1. Electron 이벤트 설정
      this.setupElectronEvents();

      // 2. 앱 아이콘 설정
      this.setupAppIcons();

      // 3. 핵심 시스템 초기화 (Database, Settings)
      await this.initializeCore();

      // 4. 권한 체크 (1회만, UnifiedPermissionManager 활용)
      await this.checkPermissions();

      // 5. 매니저들 초기화 (CPU 부하 분산)
      await this.initializeManagers();

      // 6. 설정 감시 시작
      this.startWatchers();

      Logger.info('BOOTSTRAPPER', '✅ Bootstrap process completed successfully');

    } catch (error) {
      Logger.error('BOOTSTRAPPER', '💥 Bootstrap process failed', error);
      throw error;
    }
  }

  /**
   * 🔥 Electron 이벤트 설정 (EventController 활용)
   */
  private setupElectronEvents(): void {
    this.eventController.setupAppEvents({
      onReady: () => this.handleAppReady(),
      onShutdown: () => this.shutdownManager.shutdown(),
      onActivate: () => this.handleAppActivate(),
      onWindowAllClosed: () => this.handleWindowAllClosed()
    });

    Logger.info('BOOTSTRAPPER', 'Electron events configured');
  }

  /**
   * 🔥 핵심 시스템 초기화
   */
  private async initializeCore(): Promise<void> {
    await this.managerCoordinator.initializeCore();
    Logger.info('BOOTSTRAPPER', 'Core systems initialized');
  }

  /**
   * 🔥 권한 체크 (기존 UnifiedPermissionManager 활용)
   */
  private async checkPermissions(): Promise<void> {
    try {
      // 🔥 1회만 체크 (무인루프 완전 제거)
      this.hasAccessibilityPermission = await unifiedPermissionManager.checkAccessibilityPermission();
      this.managerCoordinator.setPermissionState(this.hasAccessibilityPermission);
      
      Logger.info('BOOTSTRAPPER', '🔐 Permissions checked', {
        hasAccessibility: this.hasAccessibilityPermission
      });
    } catch (error) {
      Logger.warn('BOOTSTRAPPER', 'Permission check failed, continuing without', error);
      this.hasAccessibilityPermission = false;
    }
  }

  /**
   * 🔥 매니저들 초기화 (ManagerCoordinator에 위임)
   */
  private async initializeManagers(): Promise<void> {
    await this.managerCoordinator.initializeAll();
    Logger.info('BOOTSTRAPPER', 'All managers initialized');
  }

  /**
   * 🔥 설정 감시 시작
   */
  private startWatchers(): void {
    this.settingsWatcher.startWatching();
    Logger.info('BOOTSTRAPPER', 'Settings watchers started');
  }

  /**
   * 🔥 앱 Ready 이벤트 핸들러
   */
  private async handleAppReady(): Promise<void> {
    try {
      // 기존 windowManager 활용 (중복 방지)
      const mainWindow = windowManager.createMainWindow('main');
      
      // 🔥 URL 로딩 추가 (빈 화면 문제 해결)
      await windowManager.loadUrl('main');
      
      Logger.info('BOOTSTRAPPER', '🪟 Main window created and URL loaded');
    } catch (error) {
      Logger.error('BOOTSTRAPPER', 'Failed to create main window', error);
      throw error;
    }
  }

  /**
   * 🔥 앱 Activate 이벤트 핸들러
   */
  private async handleAppActivate(): Promise<void> {
    const windows = require('electron').BrowserWindow.getAllWindows();
    if (windows.length === 0) {
      await this.handleAppReady();
    }
  }

  /**
   * 🔥 윈도우 모두 닫힘 이벤트 핸들러
   */
  private handleWindowAllClosed(): void {
    const { platform } = process;
    if (platform !== 'darwin') {
      this.shutdownManager.shutdown();
    }
  }

  /**
   * 🔥 권한 상태 조회
   */
  public hasPermissions(): boolean {
    return this.hasAccessibilityPermission;
  }

  /**
   * 🔥 앱 아이콘 설정 (플랫폼별)
   */
  private setupAppIcons(): void {
    try {
      const path = require('path');
      const { nativeImage } = require('electron');
      
      // 🔥 개발 환경과 프로덕션 환경 구분
      const isDev = process.env.NODE_ENV === 'development';
      
      let iconsDir: string;
      if (isDev) {
        iconsDir = path.join(process.cwd(), 'public', 'icon');
      } else {
        const appPath = app.getAppPath();
        iconsDir = path.join(appPath, '..', 'public', 'icon');
      }
      
      if (process.platform === 'darwin') {
        // 🔥 macOS - ICNS 파일 사용
        const iconPath = path.join(iconsDir, 'app.icns');
        try {
          const icon = nativeImage.createFromPath(iconPath);
          if (!icon.isEmpty() && app.dock) {
            app.dock.setIcon(icon);
            Logger.info('BOOTSTRAPPER', '🍎 macOS app icon set', { iconPath });
          }
        } catch (error) {
          Logger.warn('BOOTSTRAPPER', 'Failed to set macOS app icon', { iconPath, error });
        }
      } else if (process.platform === 'win32') {
        // 🔥 Windows - ICO 파일 사용 (Electron 자동 처리)
        Logger.info('BOOTSTRAPPER', '🪟 Windows app icon will be set via electron-builder');
      }
      
    } catch (error) {
      Logger.error('BOOTSTRAPPER', 'Failed to setup app icons', error);
    }
  }
}

export default ApplicationBootstrapper;
