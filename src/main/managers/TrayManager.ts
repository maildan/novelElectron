// 🔥 기가차드 시스템 트레이 관리자

import { Tray, Menu, MenuItem, MenuItemConstructorOptions, nativeImage, BrowserWindow, app } from 'electron';
import { BaseManager } from '../common/BaseManager';
import { Logger } from '../../shared/logger';
import { Platform } from '../utils/platform';
import { getSettingsManager } from '../settings';
import type { SettingsChangeEvent, UISettingsSchema, AppSettingsSchema, KeyboardSettingsSchema, NotificationSettingsSchema } from '../settings/types';
import path from 'path';

/**
 * 🔥 기가차드 트레이 매니저
 * 시스템 트레이 아이콘, 컨텍스트 메뉴, 상태 표시 관리
 */
export class TrayManager extends BaseManager {
  private readonly componentName = 'TRAY_MANAGER';
  private tray: Tray | null = null;
  private isKeyboardMonitoring = false;
  private lastStats = { wpm: 0, accuracy: 0, sessionTime: 0 };
  private settingsUnwatchers: Array<() => void> = [];

  constructor() {
    super({
      name: 'TrayManager',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000
    });
  }

  /**
   * BaseManager 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'Initializing system tray');

    try {
      // 플랫폼별 트레이 지원 확인
      if (!Platform.supportsSystemTray()) {
        Logger.warn(this.componentName, 'System tray not supported on this platform');
        return;
      }

      await this.createTrayIcon();
      await this.createTrayMenu();
      this.setupTrayEventHandlers();
      this.setupSettingsWatchers();

      Logger.info(this.componentName, 'System tray initialized successfully');

    } catch (error) {
      Logger.error(this.componentName, 'Failed to initialize system tray', error);
      throw error;
    }
  }

  /**
   * BaseManager 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'Starting tray manager');
    
    if (this.tray) {
      this.updateTrayStatus();
      this.updateTrayTooltip();
    }
  }

  /**
   * BaseManager 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'Stopping tray manager');
    // 트레이는 유지하되 상태만 업데이트
    if (this.tray) {
      this.updateTrayStatus();
    }
  }

  /**
   * BaseManager 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'Cleaning up tray manager');
    
    // 설정 감시자 정리
    this.cleanupSettingsWatchers();
    
    if (this.tray && !this.tray.isDestroyed()) {
      this.tray.destroy();
      this.tray = null;
    }
  }

  /**
   * 🔥 트레이 아이콘 생성
   */
  private async createTrayIcon(): Promise<void> {
    try {
      // 플랫폼별 아이콘 경로
      const iconPath = this.getTrayIconPath();
      
      if (!iconPath) {
        throw new Error('Tray icon path not found for current platform');
      }

      // 🔥 파일 존재 여부 확인
      const fs = await import('fs/promises');
      try {
        await fs.access(iconPath);
        Logger.debug(this.componentName, 'Tray icon file exists', { iconPath });
      } catch (fileError) {
        Logger.error(this.componentName, 'Tray icon file not found', { iconPath, error: fileError });
        throw new Error(`Tray icon file not found: ${iconPath}`);
      }

      // 아이콘 이미지 생성
      const icon = nativeImage.createFromPath(iconPath);
      
      if (icon.isEmpty()) {
        Logger.error(this.componentName, 'Failed to create image from path', { iconPath });
        throw new Error(`Failed to load tray icon from: ${iconPath}`);
      }

      // macOS 템플릿 이미지 설정
      if (Platform.isMacOS()) {
        // 🔥 Electron API: macOS에서 setTemplateImage 적용
        const templateIcon = nativeImage.createFromPath(iconPath);
        templateIcon.setTemplateImage(true);
        this.tray = new Tray(templateIcon);
        
        Logger.debug(this.componentName, 'macOS template image applied', { iconPath });
      } else {
        this.tray = new Tray(icon);
      }

      Logger.info(this.componentName, 'Tray icon created successfully', { 
        iconPath, 
        platform: process.platform,
        isEmpty: icon.isEmpty()
      });

    } catch (error) {
      Logger.error(this.componentName, 'Failed to create tray icon', error);
      throw error;
    }
  }

  /**
   * 🔥 트레이 메뉴 생성
   */
  private async createTrayMenu(): Promise<void> {
    if (!this.tray) return;

    const template: MenuItemConstructorOptions[] = [
      {
        label: '📊 Dashboard',
        click: () => this.showMainWindow()
      },
      { type: 'separator' },
      {
        label: this.isKeyboardMonitoring ? '⏸️ 모니터링 중지' : '▶️ 모니터링 시작',
        click: () => this.toggleKeyboardMonitoring()
      },
      {
        label: '📈 현재 통계',
        submenu: [
          { label: `WPM: ${this.lastStats.wpm}`, enabled: false },
          { label: `정확도: ${this.lastStats.accuracy}%`, enabled: false },
          { label: `세션 시간: ${this.formatTime(this.lastStats.sessionTime)}`, enabled: false }
        ]
      },
      { type: 'separator' },
      {
        label: '⚙️ 설정',
        click: () => this.openSettings()
      },
      {
        label: '🔄 새로고침',
        click: () => this.reloadApp(),
        visible: process.env.NODE_ENV === 'development'
      },
      { type: 'separator' },
      {
        label: '❌ 종료',
        click: () => this.quitApp()
      }
    ];

    const contextMenu = Menu.buildFromTemplate(template);
    this.tray.setContextMenu(contextMenu);

    Logger.debug(this.componentName, 'Tray context menu created');
  }

  /**
   * 🔥 트레이 이벤트 핸들러 설정
   */
  private setupTrayEventHandlers(): void {
    if (!this.tray) return;

    // 트레이 아이콘 클릭 (좌클릭)
    this.tray.on('click', () => {
      Logger.debug(this.componentName, 'Tray icon clicked');
      this.showMainWindow();
    });

    // 트레이 아이콘 더블클릭
    this.tray.on('double-click', () => {
      Logger.debug(this.componentName, 'Tray icon double-clicked');
      this.showMainWindow();
    });

    // 트레이 아이콘 우클릭 (Windows에서는 자동으로 컨텍스트 메뉴 표시)
    this.tray.on('right-click', () => {
      Logger.debug(this.componentName, 'Tray icon right-clicked');
      // Windows에서는 자동으로 처리됨
    });

    Logger.debug(this.componentName, 'Tray event handlers setup complete');
  }

  /**
   * 🔥 설정 변경 감시자 설정
   */
  private setupSettingsWatchers(): void {
    try {
      const settingsManager = getSettingsManager();

      // 🎨 UI 설정 변경 감지 (테마, 색상 등)
      const uiUnwatcher = settingsManager.watch('ui', (event) => {
        Logger.debug(this.componentName, 'UI settings changed', { 
          key: event.key,
          newValue: event.newValue
        });
        this.updateTrayStatus();
      });

      // 🏠 앱 설정 변경 감지 (트레이 표시 등)
      const appUnwatcher = settingsManager.watch('app', (event) => {
        Logger.debug(this.componentName, 'App settings changed', { 
          key: event.key,
          minimizeToTray: event.newValue?.minimizeToTray 
        });
        
        // 트레이 표시/숨기기 설정이 변경되면 자동으로 토글
        if (event.oldValue?.minimizeToTray !== event.newValue?.minimizeToTray) {
          this.toggleTrayVisibility();
        }
      });

      // ⌨️ 키보드 설정 변경 감지 (모니터링 상태 등)
      const keyboardUnwatcher = settingsManager.watch('keyboard', (event) => {
        Logger.debug(this.componentName, 'Keyboard settings changed', { 
          key: event.key,
          enabled: event.newValue?.enabled 
        });
        
        // 키보드 모니터링 상태가 변경되면 트레이 업데이트
        if (event.oldValue?.enabled !== event.newValue?.enabled) {
          this.setKeyboardMonitoringStatus(event.newValue?.enabled || false);
        }
      });

      // 🔔 알림 설정은 SimpleSettingsSchema에 없으므로 제거
      // const notificationsUnwatcher = settingsManager.watch('notifications', ...);

      // unwatcher 함수들 저장 (notifications 제외)
      this.settingsUnwatchers = [uiUnwatcher, appUnwatcher, keyboardUnwatcher];

      Logger.debug(this.componentName, 'Settings watchers setup complete');

    } catch (error) {
      Logger.error(this.componentName, 'Failed to setup settings watchers', error);
    }
  }

  /**
   * 🔥 설정 감시자 정리
   */
  private cleanupSettingsWatchers(): void {
    try {
      // 모든 설정 감시자 해제
      this.settingsUnwatchers.forEach(unwatcher => {
        if (typeof unwatcher === 'function') {
          unwatcher();
        }
      });
      
      this.settingsUnwatchers = [];
      Logger.debug(this.componentName, 'Settings watchers cleaned up');

    } catch (error) {
      Logger.error(this.componentName, 'Failed to cleanup settings watchers', error);
    }
  }

  /**
   * 🔥 플랫폼별 트레이 아이콘 경로 반환
   */
  private getTrayIconPath(): string | null {
    try {
      // 🔥 개발 환경과 프로덕션 환경 구분
      const isDev = process.env.NODE_ENV === 'development';
      
      let iconsDir: string;
      if (isDev) {
        // 개발 환경: 프로젝트 루트의 public/icon
        iconsDir = path.join(process.cwd(), 'public', 'icon');
      } else {
        // 프로덕션 환경: 패키지된 앱의 resources 폴더
        const appPath = app.getAppPath();
        iconsDir = path.join(appPath, '..', 'public', 'icon');
      }
      
      Logger.debug(this.componentName, 'Icon directory paths', {
        iconsDir,
        isDev,
        platform: process.platform
      });
      
      if (Platform.isMacOS()) {
        // 🔥 macOS - iconTemplate.png (자동 다크/라이트 모드 변경)
        const iconPath = path.join(iconsDir, 'iconTemplate.png');
        Logger.debug(this.componentName, 'macOS icon path resolved', { iconPath });
        return iconPath;
      } else if (Platform.isWindows()) {
        // Windows - ICO 파일 권장
        const iconPath = path.join(iconsDir, 'tray.ico');
        Logger.debug(this.componentName, 'Windows icon path resolved', { iconPath });
        return iconPath;
      } else if (Platform.isLinux()) {
        // Linux - PNG 파일
        const iconPath = path.join(iconsDir, 'tray.png');
        Logger.debug(this.componentName, 'Linux icon path resolved', { iconPath });
        return iconPath;
      }
      
      return null;
    } catch (error) {
      Logger.error(this.componentName, 'Failed to get tray icon path', error);
      return null;
    }
  }

  /**
   * 🔥 트레이 상태 업데이트
   */
  public updateTrayStatus(): void {
    if (!this.tray) return;

    try {
      // 상태에 따른 아이콘 업데이트
      this.updateTrayIcon();
      this.updateTrayTooltip();
      this.createTrayMenu(); // 메뉴 업데이트

      Logger.debug(this.componentName, 'Tray status updated', {
        isMonitoring: this.isKeyboardMonitoring
      });

    } catch (error) {
      Logger.error(this.componentName, 'Failed to update tray status', error);
    }
  }

  /**
   * 🔥 트레이 아이콘 업데이트 (상태별)
   */
  private updateTrayIcon(): void {
    if (!this.tray) return;

    try {
      // 기본 아이콘 경로 (항상 동일)
      const iconPath = this.getTrayIconPath();
      if (!iconPath) {
        Logger.warn(this.componentName, 'Icon path not available for update');
        return;
      }

      // 아이콘 이미지 생성
      const icon = nativeImage.createFromPath(iconPath);
      if (icon.isEmpty()) {
        Logger.warn(this.componentName, 'Failed to create icon for update', { iconPath });
        return;
      }

      // macOS에서는 템플릿 이미지 설정
      if (Platform.isMacOS()) {
        const templateIcon = nativeImage.createFromPath(iconPath);
        templateIcon.setTemplateImage(true);
        this.tray.setImage(templateIcon);
        
        Logger.debug(this.componentName, 'macOS template icon updated', { iconPath });
      } else {
        this.tray.setImage(icon);
        Logger.debug(this.componentName, 'Standard icon updated', { iconPath });
      }

      Logger.debug(this.componentName, 'Tray icon updated', { 
        iconPath,
        isMonitoring: this.isKeyboardMonitoring 
      });

    } catch (error) {
      Logger.error(this.componentName, 'Failed to update tray icon', error);
    }
  }

  /**
   * 🔥 트레이 툴팁 업데이트
   */
  private updateTrayTooltip(): void {
    if (!this.tray) return;

    const status = this.isKeyboardMonitoring ? '모니터링 중' : '대기 중';
    const tooltip = `Loop Typing Analytics - ${status}`;
    
    this.tray.setToolTip(tooltip);
    Logger.debug(this.componentName, 'Tray tooltip updated', { tooltip });
  }

  /**
   * 🔥 통계 업데이트
   */
  public updateStats(stats: { wpm: number; accuracy: number; sessionTime: number }): void {
    this.lastStats = { ...stats };
    this.updateTrayStatus();
    
    Logger.debug(this.componentName, 'Stats updated', stats);
  }

  /**
   * 🔥 키보드 모니터링 상태 업데이트
   */
  public setKeyboardMonitoringStatus(isMonitoring: boolean): void {
    this.isKeyboardMonitoring = isMonitoring;
    this.updateTrayStatus();
    
    Logger.info(this.componentName, 'Keyboard monitoring status updated', { isMonitoring });
  }

  /**
   * 🔥 에러 상태 표시
   */
  public showErrorStatus(errorMessage: string): void {
    if (!this.tray) return;

    try {
      // 에러 툴팁 설정
      this.tray.setToolTip(`Loop Typing Analytics - 오류: ${errorMessage}`);
      
      // 에러 알림 (Windows/Linux에서만 지원)
      if (!Platform.isMacOS()) {
        this.tray.displayBalloon({
          title: 'Loop Typing Analytics',
          content: `오류가 발생했습니다: ${errorMessage}`,
          icon: this.getTrayIconPath() || ''
        });
      }
      
      Logger.warn(this.componentName, 'Error status displayed in tray', { errorMessage });
      
    } catch (error) {
      Logger.error(this.componentName, 'Failed to show error status', error);
    }
  }

  /**
   * 🔥 성공 알림 표시
   */
  public showSuccessNotification(message: string): void {
    if (!this.tray) return;

    try {
      if (!Platform.isMacOS()) {
        this.tray.displayBalloon({
          title: 'Loop Typing Analytics',
          content: message,
          icon: this.getTrayIconPath() || ''
        });
      }
      
      Logger.info(this.componentName, 'Success notification displayed', { message });
      
    } catch (error) {
      Logger.error(this.componentName, 'Failed to show success notification', error);
    }
  }

  /**
   * 🔥 메인 윈도우 표시
   */
  private showMainWindow(): void {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        mainWindow.show();
        mainWindow.focus();
        
        Logger.debug(this.componentName, 'Main window shown from tray');
      }
    } catch (error) {
      Logger.error(this.componentName, 'Failed to show main window', error);
    }
  }

  /**
   * 🔥 키보드 모니터링 토글
   */
  private async toggleKeyboardMonitoring(): Promise<void> {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('tray-action', {
          action: 'toggle-keyboard-monitoring',
          timestamp: Date.now()
        });
      }
      
      Logger.info(this.componentName, 'Keyboard monitoring toggle requested from tray');
      
    } catch (error) {
      Logger.error(this.componentName, 'Failed to toggle keyboard monitoring', error);
    }
  }

  /**
   * 🔥 설정 페이지 열기
   */
  private openSettings(): void {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('tray-action', {
          action: 'open-settings',
          timestamp: Date.now()
        });
        this.showMainWindow();
      }
      
      Logger.info(this.componentName, 'Settings page requested from tray');
      
    } catch (error) {
      Logger.error(this.componentName, 'Failed to open settings', error);
    }
  }

  /**
   * 🔥 앱 새로고침 (개발용)
   */
  private reloadApp(): void {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.reload();
      }
      
      Logger.info(this.componentName, 'App reload requested from tray');
      
    } catch (error) {
      Logger.error(this.componentName, 'Failed to reload app', error);
    }
  }

  /**
   * 🔥 앱 종료
   */
  private quitApp(): void {
    Logger.info(this.componentName, 'App quit requested from tray');
    app.quit();
  }

  /**
   * 🔥 메인 윈도우 가져오기
   */
  private getMainWindow(): BrowserWindow | null {
    try {
      return (global as unknown as { mainWindow?: BrowserWindow }).mainWindow || null;
    } catch (error) {
      Logger.error(this.componentName, 'Failed to get main window', error);
      return null;
    }
  }

  /**
   * 🔥 시간 포맷팅 (초 -> MM:SS)
   */
  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * 🔥 트레이 표시/숨기기 (설정 기반)
   */
  public async toggleTrayVisibility(): Promise<void> {
    try {
      const settingsManager = getSettingsManager();
      const appSettings = settingsManager.get('app');
      
      if (appSettings.minimizeToTray) {
        if (!this.tray) {
          await this.initialize();
          await this.start();
        }
      } else {
        if (this.tray) {
          await this.cleanup();
        }
      }
      
      Logger.info(this.componentName, 'Tray visibility toggled', { 
        visible: appSettings.minimizeToTray 
      });
      
    } catch (error) {
      Logger.error(this.componentName, 'Failed to toggle tray visibility', error);
    }
  }

  /**
   * 🔥 트레이 상태 정보 가져오기 (디버깅용)
   */
  public getTrayInfo(): { 
    isVisible: boolean; 
    isMonitoring: boolean; 
    lastStats: { wpm: number; accuracy: number; sessionTime: number };
    iconPath: string | null;
  } {
    return {
      isVisible: this.tray !== null && !this.tray.isDestroyed(),
      isMonitoring: this.isKeyboardMonitoring,
      lastStats: { ...this.lastStats },
      iconPath: this.getTrayIconPath()
    };
  }

  /**
   * 🔥 트레이 테스트 (개발용)
   */
  public async testTray(): Promise<void> {
    try {
      Logger.info(this.componentName, 'Testing tray functionality');
      
      // 상태 업데이트 테스트
      this.updateStats({ wpm: 75, accuracy: 98, sessionTime: 300 });
      this.setKeyboardMonitoringStatus(true);
      
      // 성공 알림 테스트
      this.showSuccessNotification('트레이 테스트가 성공적으로 완료되었습니다!');
      
      Logger.info(this.componentName, 'Tray test completed', this.getTrayInfo());
      
    } catch (error) {
      Logger.error(this.componentName, 'Tray test failed', error);
      this.showErrorStatus('트레이 테스트 실패');
    }
  }
}

// 🔥 기가차드 전역 트레이 매니저
let trayManagerInstance: TrayManager | null = null;

export const getTrayManager = (): TrayManager => {
  if (!trayManagerInstance) {
    trayManagerInstance = new TrayManager();
  }
  return trayManagerInstance;
};

export const trayManager = getTrayManager();
