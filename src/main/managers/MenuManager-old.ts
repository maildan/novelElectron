import { app, Menu, BrowserWindow, shell, dialog, MenuItemConstructorOptions, WebContents } from 'electron';
import path from 'path';
import os from 'os';

/**
 * 메뉴 구성 옵션 인터페이스
 */
export interface MenuOptions {
  showPreferences?: boolean;
  showAbout?: boolean;
  showQuit?: boolean;
  showDevTools?: boolean;
  enableAutoUpdates?: boolean;
  appName?: string;
  recentFiles?: string[];
  items?: MenuItemConstructorOptions[];
}

/**
 * 컨텍스트 메뉴 구성 옵션 인터페이스
 */
export interface ContextMenuOptions {
  x?: number;
  y?: number;
  showInspect?: boolean;
  items?: MenuItemConstructorOptions[];
}

/**
 * 시스템 정보 인터페이스
 */
interface SystemInfo {
  platform: string;
  release: string;
  arch: string;
  totalMemory: string;
  freeMemory: string;
  cpus: number;
  uptime: string;
  appVersion: string;
  electronVersion: string;
  chromeVersion: string;
  nodeVersion: string;
  v8Version: string;
}

/**
 * 메뉴 액션 타입
 */
export type MenuAction = 
  | 'open-settings'
  | 'file-opened'
  | 'save'
  | 'save-as'
  | 'toggle-mini-view'
  | 'check-updates'
  | 'show-about'
  | 'reload-app';

/**
 * 메뉴 액션 페이로드 인터페이스
 */
export interface MenuActionPayload {
  action: MenuAction;
  filePath?: string;
  data?: any;
}

/**
 * Electron 애플리케이션 메뉴 관리 클래스
 */
export class MenuManager {
  private static instance: MenuManager;
  private isInitialized = false;

  private constructor() {}

  /**
   * 싱글톤 인스턴스 반환
   */
  static getInstance(): MenuManager {
    if (!MenuManager.instance) {
      MenuManager.instance = new MenuManager();
    }
    return MenuManager.instance;
  }

  /**
   * 메뉴 매니저 초기화
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    console.log('[MenuManager] 메뉴 매니저 초기화 시작');

    try {
      // 전역 컨텍스트 메뉴 이벤트 설정
      this.setupContextMenuEvents();
      
      // 기본 애플리케이션 메뉴 설정
      this.setupDefaultMenu();

      this.isInitialized = true;
      console.log('[MenuManager] 메뉴 매니저 초기화 완료');
    } catch (error) {
      console.error('[MenuManager] 메뉴 매니저 초기화 실패:', error);
      throw error;
    }
  }

  /**
   * 플랫폼 정보 헬퍼
   */
  private get platformInfo() {
    return {
      isMac: process.platform === 'darwin',
      isWindows: process.platform === 'win32',
      isLinux: process.platform === 'linux',
      isDev: process.env.NODE_ENV === 'development'
    };
  }

  /**
   * 기본 메뉴 설정
   */
  setupDefaultMenu(): void {
    const menu = this.createApplicationMenu();
    Menu.setApplicationMenu(menu);
  }

  /**
   * 메인 애플리케이션 메뉴 생성
   */
  createApplicationMenu(options: MenuOptions = {}): Menu {
    const { isMac, isDev } = this.platformInfo;

    // 기본 옵션
    const defaultOptions: Required<MenuOptions> = {
      showPreferences: true,
      showAbout: true,
      showQuit: true,
      showDevTools: isDev,
      enableAutoUpdates: true,
      appName: app.getName(),
      recentFiles: [],
      items: []
    };

    // 옵션 병합
    const menuOptions = { ...defaultOptions, ...options };

    // 애플리케이션 메뉴 템플릿
    const template: MenuItemConstructorOptions[] = [];

    // 앱 메뉴 (macOS에서만 앱 이름 표시)
    if (isMac) {
      template.push(this.createAppMenu(menuOptions));
    }

    // 파일 메뉴
    template.push(this.createFileMenu(menuOptions));

    // 편집 메뉴
    template.push(this.createEditMenu(isMac));

    // 보기 메뉴
    template.push(this.createViewMenu(menuOptions.showDevTools));

    // 창 메뉴
    template.push(this.createWindowMenu(isMac));

    // 도움말 메뉴
    template.push(this.createHelpMenu(menuOptions, isMac));

    return Menu.buildFromTemplate(template);
  }

  /**
   * 앱 메뉴 생성 (macOS 전용)
   */
  private createAppMenu(options: Required<MenuOptions>): MenuItemConstructorOptions {
    const submenu: MenuItemConstructorOptions[] = [];

    if (options.showAbout) {
      submenu.push({
        label: `${options.appName} 정보`,
        click: () => this.sendMenuAction({ action: 'show-about' })
      });
    }

    submenu.push({ type: 'separator' });

    if (options.showPreferences) {
      submenu.push({
        label: '환경설정...',
        accelerator: 'Command+,',
        click: () => this.sendMenuAction({ action: 'open-settings' })
      });
    }

    submenu.push(
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' }
    );

    if (options.showQuit) {
      submenu.push({ role: 'quit' });
    }

    return {
      label: options.appName,
      submenu
    };
  }

  /**
   * 파일 메뉴 생성
   */
  private createFileMenu(options: Required<MenuOptions>): MenuItemConstructorOptions {
    const { isMac, isWindows } = this.platformInfo;
    const submenu: MenuItemConstructorOptions[] = [
      {
        label: '새 창',
        accelerator: 'CmdOrCtrl+N',
        click: () => this.createNewWindow()
      },
      { type: 'separator' },
      {
        label: '열기',
        accelerator: 'CmdOrCtrl+O',
        click: () => this.openFile()
      }
    ];

    // 최근 파일 하위 메뉴
    if (options.recentFiles.length > 0) {
      submenu.push({
        label: '최근 파일',
        submenu: options.recentFiles.map(file => ({
          label: path.basename(file),
          click: () => this.sendMenuAction({ 
            action: 'file-opened', 
            filePath: file 
          })
        }))
      });
    }

    submenu.push(
      { type: 'separator' },
      {
        label: '저장',
        accelerator: 'CmdOrCtrl+S',
        click: () => this.sendMenuAction({ action: 'save' })
      },
      {
        label: '다른 이름으로 저장...',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: () => this.sendMenuAction({ action: 'save-as' })
      },
      { type: 'separator' }
    );

    // Windows 환경설정 메뉴
    if (isWindows && options.showPreferences) {
      submenu.push(
        {
          label: '환경설정',
          accelerator: 'Ctrl+,',
          click: () => this.sendMenuAction({ action: 'open-settings' })
        },
        { type: 'separator' }
      );
    }

    // 종료 메뉴 (macOS 제외)
    if (!isMac && options.showQuit) {
      submenu.push({
        role: 'quit',
        accelerator: process.platform === 'win32' ? 'Alt+F4' : 'Ctrl+Q'
      });
    }

    return {
      label: '파일',
      submenu: submenu.filter(Boolean)
    };
  }

  /**
   * 편집 메뉴 생성
   */
  private createEditMenu(isMac: boolean): MenuItemConstructorOptions {
    const submenu: MenuItemConstructorOptions[] = [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ];

    if (isMac) {
      submenu.push(
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: '음성',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      );
    } else {
      submenu.push(
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      );
    }

    return {
      label: '편집',
      submenu
    };
  }

  /**
   * 보기 메뉴 생성
   */
  private createViewMenu(showDevTools: boolean): MenuItemConstructorOptions {
    const submenu: MenuItemConstructorOptions[] = [
      {
        label: '새로고침',
        accelerator: 'CmdOrCtrl+R',
        click: () => this.sendMenuAction({ action: 'reload-app' })
      },
      { role: 'forceReload' }
    ];

    if (showDevTools) {
      submenu.push({ role: 'toggleDevTools' });
    }

    submenu.push(
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    );

    return {
      label: '보기',
      submenu
    };
  }

  /**
   * 창 메뉴 생성
   */
  private createWindowMenu(isMac: boolean): MenuItemConstructorOptions {
    const submenu: MenuItemConstructorOptions[] = [
      { role: 'minimize' }
    ];

    if (isMac) {
      submenu.push(
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      );
    } else {
      submenu.push({ role: 'close' });
    }

    return {
      label: '창',
      submenu
    };
  }

  /**
   * 도움말 메뉴 생성
   */
  private createHelpMenu(options: Required<MenuOptions>, isMac: boolean): MenuItemConstructorOptions {
    const submenu: MenuItemConstructorOptions[] = [
      {
        label: '온라인 도움말',
        click: async () => {
          await shell.openExternal('https://github.com/your-repo/loop');
        }
      },
      {
        label: '피드백 보내기',
        click: async () => {
          await shell.openExternal('https://github.com/your-repo/loop/issues');
        }
      },
      { type: 'separator' }
    ];

    if (options.enableAutoUpdates) {
      submenu.push({
        label: '업데이트 확인',
        click: () => this.sendMenuAction({ action: 'check-updates' })
      });
    }

    submenu.push(
      {
        label: '시스템 정보',
        click: () => this.showSystemInfo()
      },
      { type: 'separator' }
    );

    // About 메뉴 (Windows/Linux)
    if (!isMac && options.showAbout) {
      submenu.push({
        label: `${options.appName} 정보`,
        click: () => this.sendMenuAction({ action: 'show-about' })
      });
    }

    return {
      role: 'help',
      submenu: submenu.filter(Boolean)
    };
  }

  /**
   * 컨텍스트 메뉴 생성 (우클릭 메뉴)
   */
  createContextMenu(options: ContextMenuOptions = {}): Menu {
    const template: MenuItemConstructorOptions[] = [
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { type: 'separator' },
      { role: 'selectAll' }
    ];

    // 추가 메뉴 항목
    if (options.items && Array.isArray(options.items)) {
      template.push({ type: 'separator' }, ...options.items);
    }

    // 개발자 도구 (개발 모드에서만)
    if (options.showInspect !== false && this.platformInfo.isDev) {
      template.push(
        { type: 'separator' },
        {
          label: '요소 검사',
          click: (menuItem, browserWindow) => {
            if (browserWindow && 'webContents' in browserWindow) {
              (browserWindow as BrowserWindow).webContents.inspectElement(options.x || 0, options.y || 0);
            }
          }
        }
      );
    }

    return Menu.buildFromTemplate(template);
  }

  /**
   * 트레이 메뉴 생성
   */
  createTrayMenu(options: MenuOptions = {}): Menu {
    const appName = options.appName || app.getName();
    const template: MenuItemConstructorOptions[] = [
      {
        label: appName,
        enabled: false
      },
      { type: 'separator' },
      {
        label: '창 열기',
        click: () => this.showAllWindows()
      },
      { type: 'separator' },
      {
        label: '설정',
        click: () => {
          this.showAllWindows();
          this.sendMenuAction({ action: 'open-settings' });
        }
      },
      { type: 'separator' },
      {
        label: '종료',
        click: () => app.quit()
      }
    ];

    // 사용자 정의 메뉴 항목 추가
    if (options.items && Array.isArray(options.items)) {
      template.splice(template.length - 1, 0, ...options.items);
    }

    return Menu.buildFromTemplate(template);
  }

  /**
   * 애플리케이션 메뉴 설정
   */
  setupApplicationMenu(options: MenuOptions = {}): void {
    const menu = this.createApplicationMenu(options);
    Menu.setApplicationMenu(menu);
  }

  /**
   * 전역 컨텍스트 메뉴 이벤트 설정
   */
  private setupContextMenuEvents(): void {
    app.on('web-contents-created', (event, contents) => {
      contents.on('context-menu', (event, params) => {
        this.handleContextMenu(contents, params);
      });
    });
  }

  /**
   * 컨텍스트 메뉴 처리
   */
  private handleContextMenu(contents: WebContents, params: Electron.ContextMenuParams): void {
    const { x, y, isEditable, selectionText, editFlags, linkURL } = params;
    const menuItems: MenuItemConstructorOptions[] = [];

    // 링크 항목
    if (linkURL) {
      menuItems.push(
        {
          label: '링크 열기',
          click: () => shell.openExternal(linkURL)
        },
        {
          label: '링크 복사',
          click: () => require('electron').clipboard.writeText(linkURL)
        },
        { type: 'separator' }
      );
    }

    // 선택된 텍스트 항목
    if (selectionText) {
      menuItems.push({
        label: '복사',
        click: () => contents.copy()
      });

      // 검색 기능
      if (selectionText.length < 50) {
        menuItems.push({
          label: `"${selectionText}" 검색`,
          click: () => {
            shell.openExternal(
              `https://www.google.com/search?q=${encodeURIComponent(selectionText)}`
            );
          }
        });
      }

      menuItems.push({ type: 'separator' });
    }

    // 편집 가능한 항목
    if (isEditable) {
      menuItems.push(
        {
          label: '잘라내기',
          enabled: editFlags.canCut,
          click: () => contents.cut()
        },
        {
          label: '복사',
          enabled: editFlags.canCopy,
          click: () => contents.copy()
        },
        {
          label: '붙여넣기',
          enabled: editFlags.canPaste,
          click: () => contents.paste()
        },
        { type: 'separator' }
      );
    }

    // 개발자 도구
    if (this.platformInfo.isDev) {
      menuItems.push({
        label: '요소 검사',
        click: () => contents.inspectElement(x, y)
      });
    }

    // 메뉴 표시
    if (menuItems.length > 0) {
      const contextMenu = Menu.buildFromTemplate(menuItems);
      const window = BrowserWindow.fromWebContents(contents);
      if (window) {
        contextMenu.popup({ window });
      }
    }
  }

  /**
   * 새 창 생성
   */
  private createNewWindow(): void {
    // WindowManager를 통해 새 창을 생성하는 것이 좋지만,
    // 순환 의존성을 피하기 위해 간단한 구현을 사용
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../../preload/index.js')
      }
    });

    const port = process.env.PORT || 3000;
    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev) {
      win.loadURL(`http://localhost:${port}`);
    } else {
      win.loadFile(path.join(__dirname, '../../../out/index.html'));
    }
  }

  /**
   * 파일 열기 대화상자
   */
  private async openFile(): Promise<void> {
    const mainWindow = BrowserWindow.getFocusedWindow();
    if (!mainWindow) return;

    try {
      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
          { name: '모든 파일', extensions: ['*'] },
          { name: '텍스트 파일', extensions: ['txt', 'md'] },
          { name: 'JSON 파일', extensions: ['json'] }
        ]
      });

      if (!canceled && filePaths.length > 0) {
        this.sendMenuAction({
          action: 'file-opened',
          filePath: filePaths[0]
        });
      }
    } catch (error) {
      console.error('[MenuManager] 파일 열기 오류:', error);
    }
  }

  /**
   * 모든 윈도우 표시
   */
  private showAllWindows(): void {
    for (const win of BrowserWindow.getAllWindows()) {
      if (!win.isDestroyed()) {
        win.show();
        if (win.isMinimized()) {
          win.restore();
        }
      }
    }
  }

  /**
   * 메뉴 액션 전송
   */
  private sendMenuAction(payload: MenuActionPayload): void {
    for (const win of BrowserWindow.getAllWindows()) {
      if (!win.isDestroyed()) {
        win.webContents.send('menu-action', payload);
      }
    }
  }

  /**
   * 시스템 정보 표시
   */
  private showSystemInfo(): void {
    const systemInfo: SystemInfo = {
      platform: os.platform(),
      release: os.release(),
      arch: os.arch(),
      totalMemory: Math.round(os.totalmem() / (1024 * 1024)) + ' MB',
      freeMemory: Math.round(os.freemem() / (1024 * 1024)) + ' MB',
      cpus: os.cpus().length,
      uptime: Math.round(os.uptime() / 60) + ' 분',
      appVersion: app.getVersion(),
      electronVersion: process.versions.electron || 'N/A',
      chromeVersion: process.versions.chrome || 'N/A',
      nodeVersion: process.versions.node || 'N/A',
      v8Version: process.versions.v8 || 'N/A'
    };

    const mainWindow = BrowserWindow.getFocusedWindow();
    if (mainWindow) {
      dialog.showMessageBox(mainWindow, {
        title: '시스템 정보',
        message: '시스템 정보',
        detail: Object.entries(systemInfo)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n'),
        buttons: ['확인'],
        type: 'info'
      });
    }
  }

  /**
   * About 대화상자 표시
   */
  showAboutDialog(appName?: string): void {
    const name = appName || app.getName();
    const mainWindow = BrowserWindow.getFocusedWindow();
    
    if (mainWindow) {
      dialog.showMessageBox(mainWindow, {
        title: `${name} 정보`,
        message: name,
        detail: `버전: ${app.getVersion()}\n${name} - 현대적인 타이핑 분석 도구\n\nElectron을 기반으로 한 크로스플랫폼 데스크톱 애플리케이션`,
        buttons: ['확인'],
        type: 'info',
        icon: undefined // 기본 아이콘 사용
      });
    }
  }

  /**
   * 메뉴 업데이트
   */
  updateMenu(options: MenuOptions = {}): void {
    this.setupApplicationMenu(options);
  }

  /**
   * Cleanup 작업
   */
  async cleanup(): Promise<void> {
    console.log('[MenuManager] 메뉴 매니저 정리 시작');
    
    // 애플리케이션 메뉴 제거
    Menu.setApplicationMenu(null);
    
    this.isInitialized = false;
    console.log('[MenuManager] 메뉴 매니저 정리 완료');
  }
}

// 싱글톤 인스턴스 내보내기
export const menuManager = MenuManager.getInstance();
export default menuManager;