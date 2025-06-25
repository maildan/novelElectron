import { Logger } from "@shared/logger";
const log = Logger;/**
 * 🔥 기가차드 트레이 매니저
 * Loop Typing Analytics - Tray Manager
 */
import { app, Tray, Menu, BrowserWindow, nativeImage } from 'electron';
import { join } from 'path';

export class TrayManager {
  private static instance: TrayManager;
  private tray: Tray | null = null;
  private mainWindow: BrowserWindow | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): TrayManager {
    if (!TrayManager.instance) {
      TrayManager.instance = new TrayManager();
    }
    return TrayManager.instance;
  }

  /**
   * 트레이 초기화
   */
  initialize(mainWindow: BrowserWindow): void {
    if (this.isInitialized) {
      return;
    }

    try {
      this.mainWindow = mainWindow;
      this.createTray();
      this.setupEventHandlers();
      
      this.isInitialized = true;
      log.info("Console", '🔔 기가차드 트레이 매니저 초기화 완료');
    } catch (error) {
      log.error("Console", '❌ 트레이 매니저 초기화 실패:', error);
    }
  }

  /**
   * 트레이 생성
   */
  private createTray(): void {
    try {
      // 트레이 아이콘 경로 설정
      const iconPath = this.getTrayIconPath();
      
      // 트레이 생성
      this.tray = new Tray(iconPath);
      
      // 기본 설정
      this.tray.setToolTip('Loop Typing Analytics');
      this.tray.setTitle('Loop');
      
      // 컨텍스트 메뉴 생성
      this.createContextMenu();
      
      log.info("Console", '✅ 트레이 생성 완료');
    } catch (error) {
      log.error("Console", '❌ 트레이 생성 실패:', error);
      throw error;
    }
  }

  /**
   * 트레이 아이콘 경로 가져오기
   */
  private getTrayIconPath(): string {
    const isDev = process.env.NODE_ENV === 'development';
    const basePath = isDev ? process.cwd() : process.resourcesPath;
    
    // macOS용 템플릿 아이콘
    if (process.platform === 'darwin') {
      return join(basePath, 'assets', 'tray-icon-Template.png');
    }
    
    // Windows/Linux용 아이콘
    return join(basePath, 'assets', 'tray-icon.png');
  }

  /**
   * 컨텍스트 메뉴 생성
   */
  private createContextMenu(): void {
    if (!this.tray) return;

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Loop 보기',
        click: () => this.showMainWindow()
      },
      {
        type: 'separator'
      },
      {
        label: '새 세션 시작',
        click: () => this.startNewSession()
      },
      {
        label: '현재 세션 종료',
        click: () => this.endCurrentSession(),
        enabled: this.isSessionActive()
      },
      {
        type: 'separator'
      },
      {
        label: '통계 보기',
        click: () => this.showStats()
      },
      {
        label: '설정',
        click: () => this.showSettings()
      },
      {
        type: 'separator'
      },
      {
        label: '정보',
        click: () => this.showAbout()
      },
      {
        label: '종료',
        click: () => this.quitApp()
      }
    ]);

    this.tray.setContextMenu(contextMenu);
  }

  /**
   * 이벤트 핸들러 설정
   */
  private setupEventHandlers(): void {
    if (!this.tray) return;

    // 더블 클릭 시 메인 윈도우 표시
    this.tray.on('double-click', () => {
      this.showMainWindow();
    });

    // 클릭 시 메인 윈도우 토글 (Windows/Linux)
    if (process.platform !== 'darwin') {
      this.tray.on('click', () => {
        this.toggleMainWindow();
      });
    }

    log.info("Console", '✅ 트레이 이벤트 핸들러 설정 완료');
  }

  /**
   * 메인 윈도우 표시
   */
  private showMainWindow(): void {
    if (!this.mainWindow) return;

    if (this.mainWindow.isMinimized()) {
      this.mainWindow.restore();
    }
    
    this.mainWindow.show();
    this.mainWindow.focus();
    
    // 🔥 기가차드식 macOS 독 처리!
    if (process.platform === 'darwin' && app.dock) {
      app.dock.show();
    }
  }

  /**
   * 메인 윈도우 토글
   */
  private toggleMainWindow(): void {
    if (!this.mainWindow) return;

    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      this.showMainWindow();
    }
  }

  /**
   * 새 세션 시작
   */
  private startNewSession(): void {
    if (!this.mainWindow) return;

    this.mainWindow.webContents.send('tray-action', {
      action: 'start-new-session'
    });
    
    this.showMainWindow();
  }

  /**
   * 현재 세션 종료
   */
  private endCurrentSession(): void {
    if (!this.mainWindow) return;

    this.mainWindow.webContents.send('tray-action', {
      action: 'end-current-session'
    });
  }

  /**
   * 통계 보기
   */
  private showStats(): void {
    if (!this.mainWindow) return;

    this.mainWindow.webContents.send('tray-action', {
      action: 'show-stats'
    });
    
    this.showMainWindow();
  }

  /**
   * 설정 보기
   */
  private showSettings(): void {
    if (!this.mainWindow) return;

    this.mainWindow.webContents.send('tray-action', {
      action: 'show-settings'
    });
    
    this.showMainWindow();
  }

  /**
   * 정보 표시
   */
  private showAbout(): void {
    if (!this.mainWindow) return;

    this.mainWindow.webContents.send('tray-action', {
      action: 'show-about'
    });
    
    this.showMainWindow();
  }

  /**
   * 앱 종료
   */
  private quitApp(): void {
    app.quit();
  }

  /**
   * 세션 활성 상태 확인
   */
  private isSessionActive(): boolean {
    // 실제 구현에서는 KeyboardManager에서 상태를 가져와야 함
    return true;
  }

  /**
   * 트레이 상태 업데이트
   */
  updateTrayStatus(status: {
    sessionActive?: boolean;
    keyCount?: number;
    sessionDuration?: number;
  }): void {
    if (!this.tray) return;

    try {
      // 툴팁 업데이트
      let tooltip = 'Loop Typing Analytics';
      
      if (status.sessionActive) {
        tooltip += `\n활성 세션: ${status.keyCount || 0}키`;
        
        if (status.sessionDuration) {
          const minutes = Math.floor(status.sessionDuration / 60);
          const seconds = status.sessionDuration % 60;
          tooltip += ` | ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
      } else {
        tooltip += '\n세션 비활성';
      }
      
      this.tray.setToolTip(tooltip);
      
      // 컨텍스트 메뉴 업데이트
      this.createContextMenu();
      
    } catch (error) {
      log.error("Console", '❌ 트레이 상태 업데이트 실패:', error);
    }
  }

  /**
   * 트레이 알림 표시
   */
  showNotification(title: string, body: string): void {
    if (!this.tray) return;

    try {
      this.tray.displayBalloon({
        title,
        content: body,
        icon: nativeImage.createFromPath(this.getTrayIconPath())
      });
    } catch (error) {
      log.error("Console", '❌ 트레이 알림 표시 실패:', error);
    }
  }

  /**
   * 트레이 깜빡임 효과
   */
  flashTray(duration: number = 3000): void {
    if (!this.tray) return;

    try {
      // 원래 아이콘 저장
      const originalIcon = this.getTrayIconPath();
      
      // 깜빡임 효과 (빈 아이콘과 원래 아이콘 교체)
      const flashInterval = setInterval(() => {
        if (this.tray) {
          this.tray.setImage(nativeImage.createEmpty());
          
          setTimeout(() => {
            if (this.tray) {
              this.tray.setImage(originalIcon);
            }
          }, 200);
        }
      }, 400);

      // 지정된 시간 후 깜빡임 중지
      setTimeout(() => {
        clearInterval(flashInterval);
        if (this.tray) {
          this.tray.setImage(originalIcon);
        }
      }, duration);
      
    } catch (error) {
      log.error("Console", '❌ 트레이 깜빡임 효과 실패:', error);
    }
  }

  /**
   * 정리
   */
  cleanup(): void {
    try {
      if (this.tray) {
        this.tray.destroy();
        this.tray = null;
      }
      
      this.mainWindow = null;
      this.isInitialized = false;
      
      log.info("Console", '✅ 트레이 매니저 정리 완료');
    } catch (error) {
      log.error("Console", '❌ 트레이 매니저 정리 실패:', error);
    }
  }
}

export default TrayManager;
