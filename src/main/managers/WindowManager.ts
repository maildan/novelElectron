/**
 * 🔥 기가차드 윈도우 매니저 - 완전히 모듈화된 싱글톤 패턴
 * Loop Typing Analytics - Advanced Window Manager
 */

import { BrowserWindow, screen, app } from 'electron';
import { join } from 'path';
import { isDev } from '@main/utils/environment';

export class WindowManager {
  private static instance: WindowManager;
  private mainWindow: BrowserWindow | null = null;

  private constructor() {}

  static getInstance(): WindowManager {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }
    return WindowManager.instance;
  }

  /**
   * 메인 윈도우 생성
   */
  async createMainWindow(): Promise<BrowserWindow> {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.focus();
      return this.mainWindow;
    }

    console.log('🔥 기가차드 윈도우 매니저: 메인 윈도우 생성 중...');

    // 화면 크기 정보 가져오기
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

    // 윈도우 크기 계산 (화면의 85%)
    const windowWidth = Math.min(1400, Math.floor(screenWidth * 0.85));
    const windowHeight = Math.min(900, Math.floor(screenHeight * 0.85));

    // 윈도우 설정
    const windowOptions: Electron.BrowserWindowConstructorOptions = {
      width: windowWidth,
      height: windowHeight,
      minWidth: 1000,
      minHeight: 700,
      x: Math.floor((screenWidth - windowWidth) / 2),
      y: Math.floor((screenHeight - windowHeight) / 2),
      show: true, // 🔥 즉시 보이게 설정!
      
      // 웹 보안 설정
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: join(__dirname, '../preload/index.js'),
        webSecurity: true,
        allowRunningInsecureContent: false,
        experimentalFeatures: false
      },

      // UI 설정
      titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
      title: '🔥 Loop - 기가차드 타이핑 애널리틱스',
      icon: join(__dirname, '../../../public/icon.png'),
      
      // 추가 설정
      resizable: true,
      maximizable: true,
      minimizable: true,
      closable: true,
      alwaysOnTop: false,
      skipTaskbar: false,
      autoHideMenuBar: false
    };

    this.mainWindow = new BrowserWindow(windowOptions);

    // 이벤트 리스너 설정
    this.setupWindowEvents();

    // URL 로드
    await this.loadContent();

    // 🔥 개발 환경에서 DevTools 자동 열기!
    if (isDev) {
      this.mainWindow.webContents.openDevTools();
      console.log('🔥 개발 환경: DevTools 자동 열림!');
    }

    console.log('✅ 기가차드 메인 윈도우 생성 완료!');
    return this.mainWindow;
  }

  /**
   * 윈도우 이벤트 설정
   */
  private setupWindowEvents(): void {
    if (!this.mainWindow) return;

    // 윈도우가 닫힐 때
    this.mainWindow.on('closed', () => {
      console.log('🪟 메인 윈도우 닫힘');
      this.mainWindow = null;
    });

    // 윈도우가 준비될 때
    this.mainWindow.webContents.once('did-finish-load', () => {
      console.log('🌐 웹 콘텐츠 로드 완료');
      if (this.mainWindow) {
        this.mainWindow.show();
        this.mainWindow.focus();
      }
    });

    // 네비게이션 제어 (보안)
    this.mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      
      // localhost 또는 file 프로토콜만 허용
      if (parsedUrl.origin !== 'http://localhost:5500' && parsedUrl.protocol !== 'file:') {
        event.preventDefault();
        console.warn('🚫 외부 네비게이션 차단:', navigationUrl);
      }
    });

    // 새 윈도우 생성 차단
    this.mainWindow.webContents.setWindowOpenHandler(() => {
      console.warn('🚫 새 윈도우 생성 차단');
      return { action: 'deny' };
    });

    // 개발 환경에서 리로드 시 DevTools 자동 열기
    if (isDev) {
      this.mainWindow.webContents.on('dom-ready', () => {
        if (this.mainWindow && !this.mainWindow.webContents.isDevToolsOpened()) {
          this.mainWindow.webContents.openDevTools();
        }
      });
    }
  }

  /**
   * 콘텐츠 로드
   */
  private async loadContent(): Promise<void> {
    if (!this.mainWindow) return;

    // 개발 환경에서는 Next.js dev 서버, 프로덕션에서는 빌드된 파일
    const startUrl = isDev 
      ? 'http://localhost:5500' 
      : `file://${join(__dirname, '../../../out/index.html')}`;

    console.log(`🌐 로딩 URL: ${startUrl}`);

    try {
      await this.mainWindow.loadURL(startUrl);
      console.log('✅ 콘텐츠 로드 성공');
    } catch (error) {
      console.error('❌ 콘텐츠 로드 실패:', error);
      
      // 개발 환경에서 Next.js 서버가 아직 시작되지 않은 경우 재시도
      if (isDev) {
        console.log('🔄 3초 후 재시도...');
        setTimeout(async () => {
          try {
            await this.mainWindow?.loadURL(startUrl);
            console.log('✅ 재시도 성공');
          } catch (retryError) {
            console.error('❌ 재시도 실패:', retryError);
          }
        }, 3000);
      }
    }
  }

  /**
   * 메인 윈도우 가져오기
   */
  getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }

  /**
   * 윈도우 포커스
   */
  focusMainWindow(): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      if (this.mainWindow.isMinimized()) {
        this.mainWindow.restore();
      }
      this.mainWindow.focus();
    }
  }

  /**
   * 윈도우 숨기기
   */
  hideMainWindow(): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.hide();
    }
  }

  /**
   * 윈도우 보이기
   */
  showMainWindow(): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.show();
      this.mainWindow.focus();
    }
  }

  /**
   * 윈도우 닫기
   */
  closeMainWindow(): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.close();
    }
  }

  /**
   * 정리
   */
  cleanup(): void {
    console.log('🧹 윈도우 매니저 정리 중...');
    
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.removeAllListeners();
      this.mainWindow.webContents.removeAllListeners();
      this.mainWindow.close();
    }
    
    this.mainWindow = null;
    console.log('✅ 윈도우 매니저 정리 완료');
  }
}
