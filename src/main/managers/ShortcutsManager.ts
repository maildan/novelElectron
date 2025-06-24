/**
 * 🔥 기가차드 글로벌 단축키 매니저
 * Loop Typing Analytics - Global Shortcuts Manager
 * 
 * 시스템 전역에서 작동하는 키보드 단축키 관리
 */

import { globalShortcut, BrowserWindow, app } from 'electron';

/**
 * 단축키 정의 인터페이스
 */
interface ShortcutDefinition {
  accelerator: string;
  description: string;
  action: () => void;
}

/**
 * 🔥 기가차드 단축키 매니저
 */
export class ShortcutsManager {
  private static instance: ShortcutsManager;
  private registeredShortcuts: Map<string, ShortcutDefinition> = new Map();
  private isInitialized = false;

  private constructor() {}

  static getInstance(): ShortcutsManager {
    if (!ShortcutsManager.instance) {
      ShortcutsManager.instance = new ShortcutsManager();
    }
    return ShortcutsManager.instance;
  }

  /**
   * 단축키 시스템 초기화
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    try {
      this.registerDefaultShortcuts();
      this.isInitialized = true;
      console.log('🔥 기가차드 글로벌 단축키 초기화 완료');
    } catch (error) {
      console.error('❌ 단축키 매니저 초기화 실패:', error);
      throw error;
    }
  }

  /**
   * 기본 단축키들 등록
   */
  private registerDefaultShortcuts(): void {
    // 🔥 기가차드 핵심 단축키들
    const shortcuts: { [key: string]: ShortcutDefinition } = {
      'CommandOrControl+Shift+K': {
        accelerator: 'CommandOrControl+Shift+K',
        description: '키보드 모니터링 토글',
        action: () => this.toggleKeyboardMonitoring()
      },
      'CommandOrControl+Shift+L': {
        accelerator: 'CommandOrControl+Shift+L',
        description: 'Loop 앱 포커스',
        action: () => this.focusMainWindow()
      },
      'CommandOrControl+Shift+S': {
        accelerator: 'CommandOrControl+Shift+S',
        description: '현재 세션 통계 보기',
        action: () => this.showSessionStats()
      },
      'CommandOrControl+Shift+Q': {
        accelerator: 'CommandOrControl+Shift+Q',
        description: '빠른 세션 시작',
        action: () => this.quickStartSession()
      }
    };

    // 각 단축키 등록
    for (const [key, shortcut] of Object.entries(shortcuts)) {
      this.registerShortcut(key, shortcut);
    }
  }

  /**
   * 개별 단축키 등록
   */
  registerShortcut(key: string, shortcut: ShortcutDefinition): boolean {
    try {
      const success = globalShortcut.register(shortcut.accelerator, () => {
        console.log(`🔥 글로벌 단축키 실행: ${shortcut.description} (${shortcut.accelerator})`);
        shortcut.action();
      });

      if (success) {
        this.registeredShortcuts.set(key, shortcut);
        console.log(`✅ 글로벌 단축키 등록: ${shortcut.accelerator} - ${shortcut.description}`);
        return true;
      } else {
        console.warn(`⚠️ 글로벌 단축키 등록 실패: ${shortcut.accelerator} (이미 사용 중)`);
        return false;
      }
    } catch (error) {
      console.error(`❌ 글로벌 단축키 등록 에러: ${shortcut.accelerator}`, error);
      return false;
    }
  }

  /**
   * 단축키 해제
   */
  unregisterShortcut(key: string): boolean {
    const shortcut = this.registeredShortcuts.get(key);
    if (!shortcut) {
      return false;
    }

    try {
      globalShortcut.unregister(shortcut.accelerator);
      this.registeredShortcuts.delete(key);
      console.log(`🗑️ 글로벌 단축키 해제: ${shortcut.accelerator}`);
      return true;
    } catch (error) {
      console.error(`❌ 글로벌 단축키 해제 에러: ${shortcut.accelerator}`, error);
      return false;
    }
  }

  /**
   * 키보드 모니터링 토글
   */
  private toggleKeyboardMonitoring(): void {
    const mainWindow = this.getMainWindow();
    if (mainWindow) {
      mainWindow.webContents.send('global-shortcut', {
        action: 'toggle-keyboard-monitoring',
        timestamp: Date.now()
      });
    }
  }

  /**
   * 메인 윈도우 포커스
   */
  private focusMainWindow(): void {
    const mainWindow = this.getMainWindow();
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      
      mainWindow.show();
      mainWindow.focus();
      
      // macOS에서 앱을 활성화
      if (process.platform === 'darwin') {
        app.focus();
      }
      
      console.log('🔥 메인 윈도우 포커스됨');
    }
  }

  /**
   * 현재 세션 통계 보기
   */
  private showSessionStats(): void {
    const mainWindow = this.getMainWindow();
    if (mainWindow) {
      mainWindow.webContents.send('global-shortcut', {
        action: 'show-session-stats',
        timestamp: Date.now()
      });
      
      // 윈도우도 포커스
      this.focusMainWindow();
    }
  }

  /**
   * 빠른 세션 시작
   */
  private quickStartSession(): void {
    const mainWindow = this.getMainWindow();
    if (mainWindow) {
      mainWindow.webContents.send('global-shortcut', {
        action: 'quick-start-session',
        timestamp: Date.now()
      });
      
      console.log('🚀 빠른 세션 시작됨');
    }
  }

  /**
   * 메인 윈도우 가져오기
   */
  private getMainWindow(): BrowserWindow | null {
    const windows = BrowserWindow.getAllWindows();
    return windows.find(window => !window.isDestroyed()) || null;
  }

  /**
   * 등록된 단축키 목록 가져오기
   */
  getRegisteredShortcuts(): Array<{key: string, shortcut: ShortcutDefinition}> {
    return Array.from(this.registeredShortcuts.entries()).map(([key, shortcut]) => ({
      key,
      shortcut
    }));
  }

  /**
   * 단축키 등록 상태 확인
   */
  isRegistered(accelerator: string): boolean {
    return globalShortcut.isRegistered(accelerator);
  }

  /**
   * 정리 (앱 종료 시 호출)
   */
  cleanup(): void {
    console.log('🧹 글로벌 단축키 정리 시작...');
    
    try {
      // 모든 글로벌 단축키 해제
      globalShortcut.unregisterAll();
      this.registeredShortcuts.clear();
      this.isInitialized = false;
      
      console.log('✅ 글로벌 단축키 정리 완료');
    } catch (error) {
      console.error('❌ 글로벌 단축키 정리 실패:', error);
    }
  }
}

export default ShortcutsManager;
