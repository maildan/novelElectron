// 🔥 기가차드 Menu 매니저 - macOS/Windows/Linux 메뉴 통합 관리

import { BaseManager } from '../common/BaseManager';
import { Logger } from '../../shared/logger';
import { Platform } from '../utils/platform';
import { app, Menu, MenuItem, BrowserWindow, MenuItemConstructorOptions } from 'electron';

// #DEBUG: Menu manager entry point
Logger.debug('MENU_MANAGER', 'Menu manager module loaded');

/**
 * 🔥 기가차드 메뉴 매니저 인터페이스
 */
export interface MenuAction {
  id: string;
  label: string;
  accelerator?: string;
  action: () => void | Promise<void>;
  submenu?: MenuAction[];
  enabled?: boolean;
  visible?: boolean;
  role?: string;
}

/**
 * 🔥 기가차드 메뉴 매니저
 * 플랫폼별 네이티브 메뉴를 중앙 관리
 */
export class MenuManager extends BaseManager {
  private readonly componentName = 'MENU_MANAGER';
  private applicationMenu: Menu | null = null;
  private contextMenu: Menu | null = null;
  private menuActions: Map<string, MenuAction> = new Map();

  constructor() {
    super({
      name: 'MenuManager',
      autoStart: false,
      retryOnError: true,
      maxRetries: 2,
      retryDelay: 1000
    });

    Logger.info(this.componentName, 'Menu manager instance created');
  }

  /**
   * BaseManager 추상 메서드 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    try {
      // 플랫폼별 기본 메뉴 작업 등록
      this.registerDefaultMenuActions();
      
      // 애플리케이션 메뉴 생성
      this.createApplicationMenu();
      
      // 컨텍스트 메뉴 생성
      this.createContextMenu();

      Logger.info(this.componentName, 'Menu manager initialized successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to initialize menu manager', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    try {
      // 애플리케이션 메뉴 설정
      if (this.applicationMenu) {
        Menu.setApplicationMenu(this.applicationMenu);
        Logger.info(this.componentName, 'Application menu set successfully');
      }

      Logger.info(this.componentName, 'Menu manager started');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to start menu manager', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    try {
      // 메뉴 해제 (필요시)
      Logger.info(this.componentName, 'Menu manager stopped');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to stop menu manager', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    try {
      this.applicationMenu = null;
      this.contextMenu = null;
      this.menuActions.clear();

      Logger.info(this.componentName, 'Menu manager cleaned up');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to cleanup menu manager', err);
      throw err;
    }
  }

  /**
   * 🔥 기본 메뉴 액션들 등록
   */
  private registerDefaultMenuActions(): void {
    // 파일 메뉴 액션들
    this.registerMenuAction({
      id: 'file.new-session',
      label: '새 타이핑 세션',
      accelerator: Platform.getModifierKey() + '+N',
      action: () => this.handleNewSession()
    });

    this.registerMenuAction({
      id: 'file.save-session',
      label: '세션 저장',
      accelerator: Platform.getModifierKey() + '+S',
      action: () => this.handleSaveSession()
    });

    this.registerMenuAction({
      id: 'file.export-data',
      label: '데이터 내보내기',
      action: () => this.handleExportData()
    });

    // 편집 메뉴 액션들
    this.registerMenuAction({
      id: 'edit.preferences',
      label: '환경설정',
      accelerator: Platform.getModifierKey() + '+,',
      action: () => this.handlePreferences()
    });

    // 보기 메뉴 액션들
    this.registerMenuAction({
      id: 'view.toggle-devtools',
      label: '개발자 도구',
      accelerator: Platform.isMacOS() ? 'Cmd+Alt+I' : 'F12',
      action: () => this.handleToggleDevTools(),
      visible: process.env.NODE_ENV === 'development'
    });

    this.registerMenuAction({
      id: 'view.reload',
      label: '새로고침',
      accelerator: Platform.getModifierKey() + '+R',
      action: () => this.handleReload(),
      visible: process.env.NODE_ENV === 'development'
    });

    // 윈도우 메뉴 액션들 (macOS)
    if (Platform.isMacOS()) {
      this.registerMenuAction({
        id: 'window.minimize',
        label: '최소화',
        accelerator: 'Cmd+M',
        action: () => this.handleMinimize()
      });

      this.registerMenuAction({
        id: 'window.close',
        label: '윈도우 닫기',
        accelerator: 'Cmd+W',
        action: () => this.handleCloseWindow()
      });
    }

    // 도움말 메뉴 액션들
    this.registerMenuAction({
      id: 'help.about',
      label: Platform.isMacOS() ? 'Loop에 관하여' : '정보',
      action: () => this.handleAbout()
    });

    this.registerMenuAction({
      id: 'help.shortcuts',
      label: '단축키 도움말',
      action: () => this.handleShortcutsHelp()
    });

    Logger.debug(this.componentName, 'Default menu actions registered');
  }

  /**
   * 🔥 메뉴 액션 등록
   */
  public registerMenuAction(action: MenuAction): void {
    this.menuActions.set(action.id, action);
    Logger.debug(this.componentName, `Menu action registered: ${action.id}`);
  }

  /**
   * 🔥 애플리케이션 메뉴 생성
   */
  private createApplicationMenu(): void {
    const template: MenuItemConstructorOptions[] = [];

    if (Platform.isMacOS()) {
      // macOS 앱 메뉴
      template.push({
        label: app.getName(),
        submenu: [
          this.createMenuItemFromAction('help.about'),
          { type: 'separator' },
          this.createMenuItemFromAction('edit.preferences'),
          { type: 'separator' },
          { role: 'services', submenu: [] },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      });
    }

    // 파일 메뉴
    template.push({
      label: '파일',
      submenu: [
        this.createMenuItemFromAction('file.new-session'),
        { type: 'separator' },
        this.createMenuItemFromAction('file.save-session'),
        this.createMenuItemFromAction('file.export-data'),
        { type: 'separator' },
        Platform.isMacOS() ? { role: 'close' } : { role: 'quit' }
      ]
    });

    // 편집 메뉴 (Windows/Linux는 환경설정 포함)
    const editSubmenu: MenuItemConstructorOptions[] = [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectAll' }
    ];

    if (!Platform.isMacOS()) {
      editSubmenu.push(
        { type: 'separator' },
        this.createMenuItemFromAction('edit.preferences')
      );
    }

    template.push({
      label: '편집',
      submenu: editSubmenu
    });

    // 보기 메뉴
    const viewSubmenu: MenuItemConstructorOptions[] = [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ];

    template.push({
      label: '보기',
      submenu: viewSubmenu
    });

    // 윈도우 메뉴 (macOS)
    if (Platform.isMacOS()) {
      template.push({
        label: '윈도우',
        submenu: [
          this.createMenuItemFromAction('window.minimize'),
          this.createMenuItemFromAction('window.close'),
          { type: 'separator' },
          { role: 'front' }
        ]
      });
    }

    // 도움말 메뉴
    const helpSubmenu: MenuItemConstructorOptions[] = [
      this.createMenuItemFromAction('help.shortcuts')
    ];

    if (!Platform.isMacOS()) {
      helpSubmenu.push(this.createMenuItemFromAction('help.about'));
    }

    template.push({
      label: '도움말',
      submenu: helpSubmenu
    });

    this.applicationMenu = Menu.buildFromTemplate(template);
    Logger.info(this.componentName, 'Application menu created');
  }

  /**
   * 🔥 컨텍스트 메뉴 생성
   */
  private createContextMenu(): void {
    const template: MenuItemConstructorOptions[] = [
      this.createMenuItemFromAction('file.new-session'),
      { type: 'separator' },
      this.createMenuItemFromAction('file.save-session'),
      { type: 'separator' },
      this.createMenuItemFromAction('edit.preferences'),
      { type: 'separator' },
      this.createMenuItemFromAction('help.shortcuts')
    ];

    this.contextMenu = Menu.buildFromTemplate(template);
    Logger.info(this.componentName, 'Context menu created');
  }

  /**
   * 🔥 메뉴 액션으로부터 메뉴 아이템 생성
   */
  private createMenuItemFromAction(actionId: string): MenuItemConstructorOptions {
    const action = this.menuActions.get(actionId);
    if (!action) {
      Logger.warn(this.componentName, `Menu action not found: ${actionId}`);
      return { label: 'Unknown Action', enabled: false };
    }

    return {
      label: action.label,
      accelerator: action.accelerator,
      enabled: action.enabled !== false,
      visible: action.visible !== false,
      click: () => {
        try {
          Logger.debug(this.componentName, `Menu action executed: ${actionId}`);
          action.action();
        } catch (error) {
          Logger.error(this.componentName, `Menu action failed: ${actionId}`, error);
        }
      }
    };
  }

  /**
   * 🔥 메뉴 액션 핸들러들
   */
  private async handleNewSession(): Promise<void> {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('menu-action', {
          action: 'new-session',
          timestamp: Date.now()
        });
      }
      Logger.info(this.componentName, 'New session action triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to handle new session', error);
    }
  }

  private async handleSaveSession(): Promise<void> {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('menu-action', {
          action: 'save-session',
          timestamp: Date.now()
        });
      }
      Logger.info(this.componentName, 'Save session action triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to handle save session', error);
    }
  }

  private async handleExportData(): Promise<void> {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('menu-action', {
          action: 'export-data',
          timestamp: Date.now()
        });
      }
      Logger.info(this.componentName, 'Export data action triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to handle export data', error);
    }
  }

  private async handlePreferences(): Promise<void> {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('menu-action', {
          action: 'preferences',
          timestamp: Date.now()
        });
      }
      Logger.info(this.componentName, 'Preferences action triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to handle preferences', error);
    }
  }

  private async handleToggleDevTools(): Promise<void> {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        if (mainWindow.webContents.isDevToolsOpened()) {
          mainWindow.webContents.closeDevTools();
        } else {
          mainWindow.webContents.openDevTools();
        }
      }
      Logger.info(this.componentName, 'Toggle dev tools action triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to toggle dev tools', error);
    }
  }

  private async handleReload(): Promise<void> {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.reload();
      }
      Logger.info(this.componentName, 'Reload action triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to handle reload', error);
    }
  }

  private async handleMinimize(): Promise<void> {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.minimize();
      }
      Logger.info(this.componentName, 'Minimize action triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to handle minimize', error);
    }
  }

  private async handleCloseWindow(): Promise<void> {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.close();
      }
      Logger.info(this.componentName, 'Close window action triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to handle close window', error);
    }
  }

  private async handleAbout(): Promise<void> {
    try {
      const { dialog } = await import('electron');
      await dialog.showMessageBox({
        type: 'info',
        title: 'Loop에 관하여',
        message: 'Loop Typing Analytics',
        detail: `
버전: 1.0.0
실시간 타이핑 분석을 위한 고급 도구

개발: Loop Development Team
기술: Electron + Next.js + TypeScript
        `.trim(),
        buttons: ['확인']
      });
      Logger.info(this.componentName, 'About dialog shown');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to show about dialog', error);
    }
  }

  private async handleShortcutsHelp(): Promise<void> {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('menu-action', {
          action: 'shortcuts-help',
          timestamp: Date.now()
        });
      }
      Logger.info(this.componentName, 'Shortcuts help action triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to handle shortcuts help', error);
    }
  }

  /**
   * 🔥 메인 윈도우 가져오기
   */
  private getMainWindow(): BrowserWindow | null {
    const windows = BrowserWindow.getAllWindows();
    return windows.find(window => !window.isDestroyed()) || null;
  }

  /**
   * 🔥 컨텍스트 메뉴 표시
   */
  public showContextMenu(): void {
    if (this.contextMenu) {
      this.contextMenu.popup();
      Logger.debug(this.componentName, 'Context menu shown');
    }
  }

  /**
   * 🔥 메뉴 액션 실행
   */
  public executeMenuAction(actionId: string): void {
    const action = this.menuActions.get(actionId);
    if (action) {
      try {
        action.action();
        Logger.debug(this.componentName, `Menu action executed: ${actionId}`);
      } catch (error) {
        Logger.error(this.componentName, `Menu action failed: ${actionId}`, error);
      }
    } else {
      Logger.warn(this.componentName, `Menu action not found: ${actionId}`);
    }
  }

  /**
   * 🔥 메뉴 액션 활성화/비활성화
   */
  public setMenuActionEnabled(actionId: string, enabled: boolean): void {
    const action = this.menuActions.get(actionId);
    if (action) {
      action.enabled = enabled;
      // 메뉴 다시 빌드 (필요시)
      Logger.debug(this.componentName, `Menu action ${actionId} ${enabled ? 'enabled' : 'disabled'}`);
    }
  }
}

// 🔥 기가차드 싱글톤 인스턴스
let menuManagerInstance: MenuManager | null = null;

export function getMenuManager(): MenuManager {
  if (!menuManagerInstance) {
    menuManagerInstance = new MenuManager();
  }
  return menuManagerInstance;
}

// #DEBUG: Menu manager exit point
Logger.debug('MENU_MANAGER', 'Menu manager module setup complete');

export default MenuManager;
