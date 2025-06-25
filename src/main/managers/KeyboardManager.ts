/**
 * 🔥 기가차드 키보드 매니저
 * Loop Typing Analytics - Keyboard Manager
 */

import { BrowserWindow } from 'electron';
import { uIOhook, UiohookKey } from 'uiohook-napi';
import { DatabaseManager } from './DatabaseManager';
import { getKeyChar } from '../../shared/getKeyChar';
import { getKeyName } from '../../shared/getKeyName';

interface ActiveSession {
  id: string;
  appName: string;
  windowTitle?: string;
  startTime: Date;
  keyCount: number;
}

export class KeyboardManager {
  private static instance: KeyboardManager;
  private isListening: boolean = false;
  private mainWindow: BrowserWindow | null = null;
  private databaseManager: DatabaseManager | null = null;
  private currentSession: ActiveSession | null = null;
  private sessionTimeout: NodeJS.Timeout | null = null;
  private hasWarnedAboutPermissions: boolean = false; // 🔥 기가차드 권한 경고 플래그

  private constructor() {}

  static getInstance(): KeyboardManager {
    if (!KeyboardManager.instance) {
      KeyboardManager.instance = new KeyboardManager();
    }
    return KeyboardManager.instance;
  }

  /**
   * 키보드 매니저 초기화
   */
  initialize(mainWindow: BrowserWindow): void {
    console.log('⌨️ 기가차드 키보드 매니저: 초기화 시작...');

    this.mainWindow = mainWindow;
    this.databaseManager = DatabaseManager.getInstance();

    this.startListening();
    console.log('✅ 키보드 매니저 초기화 완료');
  }

  /**
   * 키보드 리스닝 시작
   */
  private startListening(): void {
    if (this.isListening) {
      console.log('⚠️ 키보드 리스닝이 이미 활성화되어 있습니다.');
      return;
    }

    try {
      // 키 다운 이벤트 핸들러
      uIOhook.on('keydown', this.handleKeyDown.bind(this));

      // uIOhook 시작
      uIOhook.start();
      this.isListening = true;

      console.log('🎧 키보드 리스닝 시작됨');
    } catch (error) {
      console.error('❌ 키보드 리스닝 시작 실패:', error);
      throw error;
    }
  }

  /**
   * 키 다운 이벤트 처리
   */
  private async handleKeyDown(event: any): Promise<void> {
    try {
      // 활성 윈도우 정보 가져오기
      const activeWindow = await this.getActiveWindow();
      
      // 키 정보 추출
      const keyCode = event.keycode;
      const keyName = getKeyName(keyCode);
      const keyChar = getKeyChar(keyCode, 'korean'); // 기본 한국어

      // 세션 관리
      await this.manageSession(activeWindow);

      // 키 이벤트 저장
      if (this.currentSession && this.databaseManager) {
        await this.databaseManager.createKeyEvent({
          sessionId: this.currentSession.id,
          keyCode,
          keyName,
          eventType: 'keydown',
          appName: activeWindow.appName,
          windowTitle: activeWindow.windowTitle
        });

        // 세션 키 카운트 증가
        this.currentSession.keyCount++;

        // UI에 실시간 업데이트 전송
        this.sendRealtimeUpdate({
          sessionId: this.currentSession.id,
          keyCount: this.currentSession.keyCount,
          lastKey: keyChar || keyName,
          appName: activeWindow.appName
        });
      }

      // 세션 타임아웃 재설정
      this.resetSessionTimeout();

    } catch (error) {
      console.error('❌ 키 이벤트 처리 실패:', error);
    }
  }

  /**
   * 활성 윈도우 정보 가져오기
   */
  private async getActiveWindow(): Promise<{ appName: string; windowTitle?: string }> {
    try {
      // get-windows 모듈을 동적으로 import
      const getWindows = await import('get-windows');
      const activeWindow = await getWindows.activeWindow();
      
      if (activeWindow) {
        return {
          appName: activeWindow.owner?.name || 'Unknown',
          windowTitle: activeWindow.title || undefined
        };
      }
    } catch (error) {
      // 🔥 기가차드 스타일: 권한 에러는 조용히 처리
      const errorMessage = (error as Error).message || '';
      
      if (errorMessage.includes('screen recording permission') || 
          errorMessage.includes('Privacy & Security') ||
          errorMessage.includes('permission') ||
          errorMessage.includes('denied')) {
        // 권한 에러는 한 번만 알리고 조용히
        if (!this.hasWarnedAboutPermissions) {
          console.warn('⚠️ 기가차드: macOS Screen Recording 권한이 필요합니다. 시스템 설정 > 개인정보 보호 및 보안 > 화면 녹화에서 허용해주세요.');
          this.hasWarnedAboutPermissions = true;
          
          // 🔥 기가차드식 대안: 메인 윈도우를 통해 알림
          if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send('screen-permission-needed', {
              message: 'Screen Recording 권한이 필요합니다.',
              action: 'open-privacy-settings'
            });
          }
        }
      } else {
        console.error('❌ 활성 윈도우 정보 가져오기 실패:', error);
      }
    }

    return {
      appName: 'Unknown'
    };
  }

  /**
   * 세션 관리
   */
  private async manageSession(activeWindow: { appName: string; windowTitle?: string }): Promise<void> {
    const now = new Date();

    // 새 세션이 필요한 경우
    if (!this.currentSession || 
        this.currentSession.appName !== activeWindow.appName ||
        (now.getTime() - this.currentSession.startTime.getTime()) > 30 * 60 * 1000) { // 30분 타임아웃
      
      // 기존 세션 종료
      if (this.currentSession) {
        await this.endCurrentSession();
      }

      // 새 세션 시작
      await this.startNewSession(activeWindow);
    }
  }

  /**
   * 새 세션 시작
   */
  private async startNewSession(activeWindow: { appName: string; windowTitle?: string }): Promise<void> {
    if (!this.databaseManager) return;

    try {
      const session = await this.databaseManager.createTypingSession({
        appName: activeWindow.appName,
        windowTitle: activeWindow.windowTitle,
        platform: process.platform
      });

      this.currentSession = {
        id: session.id,
        appName: activeWindow.appName,
        windowTitle: activeWindow.windowTitle,
        startTime: new Date(),
        keyCount: 0
      };

      console.log(`🆕 새 타이핑 세션 시작: ${session.id} (${activeWindow.appName})`);
    } catch (error) {
      console.error('❌ 새 세션 시작 실패:', error);
    }
  }

  /**
   * 현재 세션 종료
   */
  private async endCurrentSession(): Promise<void> {
    if (!this.currentSession || !this.databaseManager) return;

    try {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - this.currentSession.startTime.getTime()) / 1000);

      await this.databaseManager.updateTypingSession(this.currentSession.id, {
        endTime,
        duration,
        totalKeys: this.currentSession.keyCount
      });

      console.log(`✅ 타이핑 세션 종료: ${this.currentSession.id} (${duration}초, ${this.currentSession.keyCount}키)`);
      this.currentSession = null;
    } catch (error) {
      console.error('❌ 세션 종료 실패:', error);
    }
  }

  /**
   * 실시간 업데이트 전송
   */
  private sendRealtimeUpdate(data: {
    sessionId: string;
    keyCount: number;
    lastKey: string;
    appName: string;
  }): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send('keyboard-realtime-update', data);
    }
  }

  /**
   * 세션 타임아웃 재설정
   */
  private resetSessionTimeout(): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }

    // 5분 비활성 시 세션 종료
    this.sessionTimeout = setTimeout(async () => {
      if (this.currentSession) {
        console.log('⏰ 세션 타임아웃으로 인한 종료');
        await this.endCurrentSession();
      }
    }, 5 * 60 * 1000);
  }

  /**
   * 키보드 리스닝 중지
   */
  stopListening(): void {
    if (!this.isListening) {
      return;
    }

    try {
      uIOhook.stop();
      this.isListening = false;
      console.log('🛑 키보드 리스닝 중지됨');
    } catch (error) {
      console.error('❌ 키보드 리스닝 중지 실패:', error);
    }
  }

  /**
   * 현재 세션 정보 가져오기
   */
  getCurrentSession(): ActiveSession | null {
    return this.currentSession;
  }

  /**
   * 리스닝 상태 확인
   */
  isKeyboardListening(): boolean {
    return this.isListening;
  }

  /**
   * 정리
   */
  cleanup(): void {
    console.log('🧹 키보드 매니저 정리 중...');

    // 세션 타임아웃 정리
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }

    // 현재 세션 종료
    if (this.currentSession) {
      this.endCurrentSession().catch(console.error);
    }

    // 키보드 리스닝 중지
    this.stopListening();

    // 참조 정리
    this.mainWindow = null;
    this.databaseManager = null;

    console.log('✅ 키보드 매니저 정리 완료');
  }
}
