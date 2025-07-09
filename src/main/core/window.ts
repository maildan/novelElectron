// 🔥 기가차드 윈도우 매니저 - 타입 안전한 윈도우 관리 시스템

import { BrowserWindow, screen } from 'electron';
import { join } from 'path';
import { Logger } from '../../shared/logger';
import { WindowInfo } from '../../shared/types';
import { isObject } from '../../shared/common';
import { Platform } from '../utils/platform';

// #DEBUG: Window manager entry point
Logger.debug('WINDOW', 'Window manager module loaded');

// 🔥 기가차드 윈도우 설정 인터페이스
export interface WindowSettings {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  show: boolean;
  center: boolean;
  titleBarStyle: 'default' | 'hidden' | 'hiddenInset' | 'customButtonsOnHover';
}

// 🔥 기가차드 윈도우 매니저 클래스
export class WindowManager {
  private windows: Map<string, BrowserWindow> = new Map();
  
  constructor() {
    // #DEBUG: Window manager initialized
    Logger.debug('WINDOW', 'Window manager initialized');
  }

  // 🔥 메인 윈도우 생성
  public createMainWindow(windowId: string = 'main'): BrowserWindow {
    try {
      // #DEBUG: Creating main window
      Logger.debug('WINDOW', 'Creating main window', { windowId });

      const { width, height } = screen.getPrimaryDisplay().workAreaSize;
      
      const settings: WindowSettings = {
        width: Math.min(1200, Math.floor(width * 0.8)),
        height: Math.min(800, Math.floor(height * 0.8)),
        minWidth: 800,
        minHeight: 600,
        show: false, // 🔥 성능 최적화: 준비될 때까지 숨김
        center: true,
        titleBarStyle: Platform.isMacOS() ? 'default' : 'default', // 🔥 메뉴바 표시 강제
      };

      const window = new BrowserWindow({
        ...settings,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: false,
          preload: join(__dirname, '../../preload/preload.js'),
          webSecurity: true,
        },
        icon: this.getAppIcon(),
        // 🔥 macOS 전용 설정
        ...(Platform.isMacOS() && {
          titleBarStyle: 'default', // 🔥 메뉴바 표시를 위해 default로 변경
          trafficLightPosition: { x: 20, y: 20 },
          transparent: false, // 🔥 투명도 제거로 성능 개선
          vibrancy: undefined, // 🔥 vibrancy 제거로 성능 개선
          autoHideMenuBar: false, // 🔥 메뉴바 강제 표시
        }),
        // 🔥 성능 최적화 설정
        show: false, // 🔥 준비될 때까지 숨김
        backgroundColor: '#ffffff', // 🔥 배경색 설정으로 깜빡임 방지
      });

      // 보안 설정
      this.setupWindowSecurity(window);

      // 윈도우 이벤트 설정
      this.setupWindowEvents(window, windowId);

      // 윈도우 맵에 추가
      this.windows.set(windowId, window);

      Logger.info('WINDOW', 'Main window created successfully', {
        windowId,
        settings
      });

      return window;

    } catch (error) {
      Logger.error('WINDOW', 'Failed to create main window', error);
      throw error;
    }
  }

  // 🔥 윈도우 보안 설정
  private setupWindowSecurity(window: BrowserWindow): void {
    // #DEBUG: Setting up window security
    Logger.debug('WINDOW', 'Setting up window security');

    // 새 윈도우 생성 차단
    window.webContents.setWindowOpenHandler(() => {
      Logger.warn('WINDOW', 'Blocked window open attempt');
      return { action: 'deny' };
    });

    // 네비게이션 보안
    window.webContents.on('will-navigate', (event, navigationUrl) => {
      const allowedOrigins = [
        'http://localhost:4000',
        'file://'
      ];

      const isAllowed = allowedOrigins.some(origin => 
        navigationUrl.startsWith(origin)
      );

      if (!isAllowed) {
        event.preventDefault();
        Logger.warn('WINDOW', 'Blocked navigation attempt', { 
          url: navigationUrl 
        });
      }
    });

    // 외부 링크 차단 (최신 Electron API 사용)
    window.webContents.on('will-redirect', (event, navigationUrl) => {
      const allowedOrigins = [
        'http://localhost:4000',
        'file://'
      ];

      const isAllowed = allowedOrigins.some(origin => 
        navigationUrl.startsWith(origin)
      );

      if (!isAllowed) {
        event.preventDefault();
        Logger.warn('WINDOW', 'Blocked redirect attempt', { 
          url: navigationUrl 
        });
      }
    });
  }

  // 🔥 윈도우 이벤트 설정
  private setupWindowEvents(window: BrowserWindow, windowId: string): void {
    // #DEBUG: Setting up window events
    Logger.debug('WINDOW', 'Setting up window events', { windowId });

    // 🔥 성능 최적화: 윈도우가 준비되면 표시
    window.once('ready-to-show', () => {
      window.show();
      Logger.info('WINDOW', 'Window shown', { windowId });
    });

    window.on('closed', () => {
      this.windows.delete(windowId);
      Logger.info('WINDOW', 'Window closed and removed', { windowId });
    });

    window.on('focus', () => {
      Logger.debug('WINDOW', 'Window focused', { windowId });
    });

    window.on('blur', () => {
      Logger.debug('WINDOW', 'Window blurred', { windowId });
    });

    window.on('maximize', () => {
      Logger.debug('WINDOW', 'Window maximized', { windowId });
    });

    window.on('minimize', () => {
      Logger.debug('WINDOW', 'Window minimized', { windowId });
    });
  }

  // 🔥 앱 아이콘 경로 가져오기 (Platform 모듈 사용)
  private getAppIcon(): string | undefined {
    // #DEBUG: Getting app icon
    try {
      const isDev = process.env.NODE_ENV === 'development';
      
      let iconsDir: string;
      if (isDev) {
        // 개발 환경: 프로젝트 루트의 assets 폴더
        iconsDir = join(process.cwd(), 'assets');
      } else {
        // 프로덕션 환경: 패키지된 앱의 assets 폴더
        iconsDir = join(__dirname, '../../../assets');
      }
      
      if (Platform.isWindows()) {
        return join(iconsDir, 'icon.ico');
      } else if (Platform.isMacOS()) {
        return join(iconsDir, 'icon.icns');
      } else {
        return join(iconsDir, 'icon.png');
      }
    } catch (error) {
      Logger.warn('WINDOW', 'Could not find app icon', error);
      return undefined;
    }
  }

  // 🔥 윈도우 URL 로드
  public async loadUrl(windowId: string, url?: string): Promise<void> {
    try {
      // #DEBUG: Loading URL
      const window = this.windows.get(windowId);
      if (!window) {
        throw new Error(`Window ${windowId} not found`);
      }

      const targetUrl = url || (process.env.NODE_ENV === 'development'
        ? 'http://localhost:4000'
        : `file://${join(__dirname, '../../renderer/out/index.html')}`
      );

      await window.loadURL(targetUrl);

      // 🔥 개발 도구 (개발 환경에서만) - 별창으로 열기
      if (process.env.NODE_ENV === 'development') {
        window.webContents.openDevTools({ mode: 'detach' });
      }

      Logger.info('WINDOW', 'URL loaded successfully', { 
        windowId, 
        url: targetUrl 
      });

    } catch (error) {
      Logger.error('WINDOW', 'Failed to load URL', error);
      throw error;
    }
  }

  // 🔥 윈도우 가져오기
  public getWindow(windowId: string): BrowserWindow | undefined {
    return this.windows.get(windowId);
  }

  // 🔥 모든 윈도우 가져오기
  public getAllWindows(): BrowserWindow[] {
    return Array.from(this.windows.values());
  }

  // 🔥 윈도우 닫기
  public closeWindow(windowId: string): boolean {
    try {
      const window = this.windows.get(windowId);
      if (window && !window.isDestroyed()) {
        window.close();
        Logger.info('WINDOW', 'Window closed', { windowId });
        return true;
      }
      return false;
    } catch (error) {
      Logger.error('WINDOW', 'Failed to close window', error);
      return false;
    }
  }

  // 🔥 모든 윈도우 닫기
  public closeAllWindows(): void {
    try {
      // #DEBUG: Closing all windows
      Logger.debug('WINDOW', 'Closing all windows');

      this.windows.forEach((window, windowId) => {
        if (!window.isDestroyed()) {
          window.close();
        }
      });

      this.windows.clear();
      Logger.info('WINDOW', 'All windows closed');

    } catch (error) {
      Logger.error('WINDOW', 'Failed to close all windows', error);
    }
  }

  // 🔥 활성 윈도우 정보 가져오기
  public getActiveWindowInfo(): WindowInfo | null {
    try {
      // #DEBUG: Getting active window info
      const focusedWindow = BrowserWindow.getFocusedWindow();
      
      if (!focusedWindow) {
        return null;
      }

      const bounds = focusedWindow.getBounds();
      const windowInfo: WindowInfo = {
        id: focusedWindow.id,
        title: focusedWindow.getTitle(),
        owner: {
          name: 'Loop Typing Analytics',
          processId: process.pid,
          bundleId: Platform.isMacOS() ? 'com.loop.typing-analytics' : undefined,
          path: process.execPath,
        },
        bounds: {
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
        },
        memoryUsage: process.memoryUsage().heapUsed,
        loopTimestamp: Date.now(),
        loopAppCategory: 'productivity',
      };

      Logger.debug('WINDOW', 'Active window info retrieved', windowInfo);
      return windowInfo;

    } catch (error) {
      Logger.error('WINDOW', 'Failed to get active window info', error);
      return null;
    }
  }

  // 🔥 윈도우 목록 가져오기
  public getWindowList(): WindowInfo[] {
    try {
      // #DEBUG: Getting window list
      const windowList: WindowInfo[] = [];

      this.windows.forEach((window, windowId) => {
        if (!window.isDestroyed()) {
          const bounds = window.getBounds();
          windowList.push({
            id: window.id,
            title: window.getTitle(),
            owner: {
              name: `Loop Window (${windowId})`,
              processId: process.pid,
              bundleId: Platform.isMacOS() ? 'com.loop.typing-analytics' : undefined,
              path: process.execPath,
            },
            bounds: {
              x: bounds.x,
              y: bounds.y,
              width: bounds.width,
              height: bounds.height,
            },
            memoryUsage: process.memoryUsage().heapUsed,
            loopTimestamp: Date.now(),
            loopAppCategory: 'productivity',
          });
        }
      });

      Logger.debug('WINDOW', 'Window list retrieved', { 
        count: windowList.length 
      });

      return windowList;

    } catch (error) {
      Logger.error('WINDOW', 'Failed to get window list', error);
      return [];
    }
  }
}

// 🔥 기가차드 싱글톤 윈도우 매니저
export const windowManager = new WindowManager();

// #DEBUG: Window manager module exit point
Logger.debug('WINDOW', 'Window manager module setup complete');

export default windowManager;
