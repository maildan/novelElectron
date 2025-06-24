/**
 * 🔥 기가차드 메뉴 매니저
 * Loop Typing Analytics - Menu Manager
 * 
 * 애플리케이션 메뉴, 컨텍스트 메뉴, 시스템 트레이 메뉴 관리
 */

import { app, Menu, BrowserWindow, shell, dialog, MenuItemConstructorOptions } from 'electron';
import path from 'path';
import os from 'os';

/**
 * 메뉴 구성 옵션 인터페이스
 */
export interface MenuOptions {
  showPreferences?: boolean;
  showAbout?: boolean;
  showDevTools?: boolean;
  appName?: string;
}

/**
 * 🔥 기가차드 메뉴 매니저 클래스
 */
export class MenuManager {
  private static instance: MenuManager;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): MenuManager {
    if (!MenuManager.instance) {
      MenuManager.instance = new MenuManager();
    }
    return MenuManager.instance;
  }

  /**
   * 메뉴 초기화
   */
  initialize(options: MenuOptions = {}): void {
    if (this.isInitialized) {
      return;
    }

    try {
      this.createApplicationMenu(options);
      this.isInitialized = true;
      console.log('🔥 기가차드 메뉴 매니저 초기화 완료');
    } catch (error) {
      console.error('❌ 메뉴 매니저 초기화 실패:', error);
      throw error;
    }
  }

  /**
   * 애플리케이션 메뉴 생성
   */
  private createApplicationMenu(options: MenuOptions): void {
    const template: MenuItemConstructorOptions[] = [];

    // macOS용 앱 메뉴
    if (process.platform === 'darwin') {
      template.push({
        label: options.appName || 'Loop',
        submenu: [
          {
            label: `${options.appName || 'Loop'} 정보`,
            click: () => this.showAboutDialog()
          },
          { type: 'separator' },
          {
            label: '환경설정...',
            accelerator: 'CmdOrCtrl+,',
            click: () => this.openPreferences()
          },
          { type: 'separator' },
          {
            label: '서비스',
            role: 'services',
            submenu: []
          },
          { type: 'separator' },
          {
            label: `${options.appName || 'Loop'} 숨기기`,
            accelerator: 'Command+H',
            role: 'hide'
          },
          {
            label: '기타 숨기기',
            accelerator: 'Command+Shift+H',
            role: 'hideOthers'
          },
          {
            label: '모두 보기',
            role: 'unhide'
          },
          { type: 'separator' },
          {
            label: '종료',
            accelerator: 'Command+Q',
            click: () => app.quit()
          }
        ]
      });
    }

    // 파일 메뉴
    template.push({
      label: '파일',
      submenu: [
        {
          label: '새 세션',
          accelerator: 'CmdOrCtrl+N',
          click: () => this.createNewSession()
        },
        { type: 'separator' },
        {
          label: '데이터 내보내기',
          accelerator: 'CmdOrCtrl+E',
          click: () => this.exportData()
        },
        {
          label: '데이터 가져오기',
          accelerator: 'CmdOrCtrl+I',
          click: () => this.importData()
        },
        { type: 'separator' },
        ...(process.platform !== 'darwin' ? [
          {
            label: '종료',
            accelerator: 'CmdOrCtrl+Q',
            click: () => app.quit()
          }
        ] : [])
      ]
    });

    // 편집 메뉴
    template.push({
      label: '편집',
      submenu: [
        { label: '실행 취소', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: '다시 실행', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: '잘라내기', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: '복사', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: '붙여넣기', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: '모두 선택', accelerator: 'CmdOrCtrl+A', role: 'selectAll' }
      ]
    });

    // 보기 메뉴
    template.push({
      label: '보기',
      submenu: [
        {
          label: '키보드 모니터링 시작/중지',
          accelerator: 'CmdOrCtrl+K',
          click: () => this.toggleKeyboardMonitoring()
        },
        { type: 'separator' },
        { label: '새로고침', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: '강제 새로고침', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: '개발자 도구', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: '실제 크기', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: '확대', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: '축소', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: '전체 화면', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    });

    // 윈도우 메뉴
    template.push({
      label: '윈도우',
      submenu: [
        { label: '최소화', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: '닫기', accelerator: 'CmdOrCtrl+W', role: 'close' },
        ...(process.platform === 'darwin' ? [
          { type: 'separator' as const },
          { label: '앞으로 가져오기', role: 'front' as const }
        ] : [])
      ]
    });

    // 도움말 메뉴
    template.push({
      label: '도움말',
      submenu: [
        {
          label: '사용법',
          click: () => shell.openExternal('https://github.com/your-repo/wiki')
        },
        {
          label: '키보드 단축키',
          click: () => this.showShortcuts()
        },
        { type: 'separator' },
        {
          label: '문제 신고',
          click: () => shell.openExternal('https://github.com/your-repo/issues')
        },
        ...(process.platform !== 'darwin' ? [
          { type: 'separator' as const },
          {
            label: '정보',
            click: () => this.showAboutDialog()
          }
        ] : [])
      ]
    });

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  /**
   * 새 세션 생성
   */
  private createNewSession(): void {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      focusedWindow.webContents.send('menu-action', 'create-new-session');
    }
  }

  /**
   * 키보드 모니터링 토글
   */
  private toggleKeyboardMonitoring(): void {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      focusedWindow.webContents.send('menu-action', 'toggle-keyboard-monitoring');
    }
  }

  /**
   * 데이터 내보내기
   */
  private async exportData(): Promise<void> {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (!focusedWindow) return;

    const result = await dialog.showSaveDialog(focusedWindow, {
      title: '타이핑 데이터 내보내기',
      defaultPath: `typing-data-${new Date().toISOString().split('T')[0]}.json`,
      filters: [
        { name: 'JSON 파일', extensions: ['json'] },
        { name: '모든 파일', extensions: ['*'] }
      ]
    });

    if (!result.canceled && result.filePath) {
      focusedWindow.webContents.send('menu-action', 'export-data', { filePath: result.filePath });
    }
  }

  /**
   * 데이터 가져오기
   */
  private async importData(): Promise<void> {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (!focusedWindow) return;

    const result = await dialog.showOpenDialog(focusedWindow, {
      title: '타이핑 데이터 가져오기',
      filters: [
        { name: 'JSON 파일', extensions: ['json'] },
        { name: '모든 파일', extensions: ['*'] }
      ],
      properties: ['openFile']
    });

    if (!result.canceled && result.filePaths.length > 0) {
      focusedWindow.webContents.send('menu-action', 'import-data', { filePath: result.filePaths[0] });
    }
  }

  /**
   * 환경설정 열기
   */
  private openPreferences(): void {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      focusedWindow.webContents.send('menu-action', 'open-preferences');
    }
  }

  /**
   * 정보 대화상자 표시
   */
  private showAboutDialog(): void {
    dialog.showMessageBox({
      type: 'info',
      title: '🔥 Loop - 기가차드 타이핑 애널리틱스',
      message: 'Loop Typing Analytics',
      detail: `
버전: ${app.getVersion()}
Electron: ${process.versions.electron}
Node.js: ${process.versions.node}
Chrome: ${process.versions.chrome}
플랫폼: ${process.platform} ${process.arch}

🔥 기가차드가 만든 최강의 타이핑 분석 도구

© 2024 Loop Analytics. All rights reserved.
      `.trim(),
      buttons: ['확인']
    });
  }

  /**
   * 단축키 안내 표시
   */
  private showShortcuts(): void {
    dialog.showMessageBox({
      type: 'info',
      title: '🔥 기가차드 키보드 단축키',
      message: '키보드 단축키',
      detail: `
🔥 기가차드 핵심 단축키:

일반:
• Ctrl/Cmd + K    키보드 모니터링 시작/중지
• Ctrl/Cmd + N    새 세션 생성
• Ctrl/Cmd + E    데이터 내보내기
• Ctrl/Cmd + I    데이터 가져오기
• Ctrl/Cmd + ,    환경설정

개발자:
• F12             개발자 도구
• Ctrl/Cmd + R    새로고침
• F11             전체 화면

기가차드는 단축키로 더 빨라진다! 🚀
      `.trim(),
      buttons: ['확인']
    });
  }

  /**
   * 컨텍스트 메뉴 생성
   */
  createContextMenu(options: { x?: number; y?: number } = {}): Menu {
    const template: MenuItemConstructorOptions[] = [
      {
        label: '잘라내기',
        role: 'cut'
      },
      {
        label: '복사',
        role: 'copy'
      },
      {
        label: '붙여넣기',
        role: 'paste'
      },
      { type: 'separator' },
      {
        label: '모두 선택',
        role: 'selectAll'
      },
      { type: 'separator' },
      {
        label: '개발자 도구',
        role: 'toggleDevTools'
      }
    ];

    return Menu.buildFromTemplate(template);
  }

  /**
   * 정리
   */
  cleanup(): void {
    this.isInitialized = false;
    console.log('🧹 기가차드 메뉴 매니저 정리 완료');
  }
}

export default MenuManager;
