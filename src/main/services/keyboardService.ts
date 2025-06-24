import { uIOhook, UiohookKey, UiohookWheelEvent, UiohookMouseEvent, UiohookKeyboardEvent } from 'uiohook-napi';
import { LoopKeyboardEvent, AppInfo } from '../../shared/types';
import { getKeyChar, getKoreanChar } from '../../shared/getKeyChar';
import { getKeyName } from '../../shared/getKeyName';
import { BrowserWindow } from 'electron';

/**
 * 키보드 모니터링 서비스
 * 전역 키보드 훅을 통해 키 입력을 감지하고 분석
 */
class KeyboardService {
  private isRunning = false;
  private window: BrowserWindow | null = null;
  private currentLanguage: 'korean' | 'japanese' | 'chinese' | 'english' = 'korean';
  private keySequence: string[] = [];
  private sessionStartTime: number = 0;
  private keyCount = 0;

  constructor() {
    this.setupEventHandlers();
  }

  /**
   * 키보드 모니터링 시작
   */
  public registerKeyboardListener(window: BrowserWindow): boolean {
    if (this.isRunning) {
      console.warn('Keyboard listener is already running');
      return false;
    }

    try {
      this.window = window;
      this.sessionStartTime = Date.now();
      this.keyCount = 0;
      this.keySequence = [];

      // uIOhook 시작
      uIOhook.start();
      this.isRunning = true;

      console.log('🎯 Keyboard listener started successfully');
      
      // 상태를 렌더러에 전송
      this.sendToRenderer('keyboard:status', { running: true });
      
      return true;
    } catch (error) {
      console.error('❌ Failed to start keyboard listener:', error);
      this.isRunning = false;
      return false;
    }
  }

  /**
   * 키보드 모니터링 중지
   */
  public stopKeyboardListener(): boolean {
    if (!this.isRunning) {
      console.warn('Keyboard listener is not running');
      return false;
    }

    try {
      uIOhook.stop();
      this.isRunning = false;
      this.window = null;

      console.log('🛑 Keyboard listener stopped successfully');
      
      // 상태를 렌더러에 전송
      this.sendToRenderer('keyboard:status', { running: false });
      
      return true;
    } catch (error) {
      console.error('❌ Failed to stop keyboard listener:', error);
      return false;
    }
  }

  /**
   * 현재 언어 설정
   */
  public setLanguage(language: 'korean' | 'japanese' | 'chinese' | 'english'): void {
    this.currentLanguage = language;
    console.log(`🌐 Language set to: ${language}`);
  }

  /**
   * 키보드 모니터링 상태 확인
   */
  public isListening(): boolean {
    return this.isRunning;
  }

  /**
   * 이벤트 핸들러 설정
   */
  private setupEventHandlers(): void {
    // 키보드 이벤트 핸들러
    uIOhook.on('keydown', (event: UiohookKeyboardEvent) => {
      this.handleKeyEvent(event, 'keydown');
    });

    uIOhook.on('keyup', (event: UiohookKeyboardEvent) => {
      this.handleKeyEvent(event, 'keyup');
    });

    // 마우스 이벤트도 필요하면 추가 가능
    // uIOhook.on('mousedown', (event: UiohookMouseEvent) => {
    //   console.log('Mouse down:', event);
    // });
  }

  /**
   * 키 이벤트 처리
   */
  private handleKeyEvent(event: UiohookKeyboardEvent, type: 'keydown' | 'keyup'): void {
    if (!this.isRunning || !this.window) return;

    try {
      const keyboardEvent: LoopKeyboardEvent = {
        keycode: event.keycode,
        type,
        timestamp: Date.now()
      };

      // keydown 이벤트에서만 카운트 및 분석
      if (type === 'keydown') {
        this.keyCount++;
        this.analyzeKeyInput(event);
      }

      // 렌더러에 이벤트 전송
      this.sendToRenderer('keyboard:event', keyboardEvent);

    } catch (error) {
      console.error('❌ Error handling key event:', error);
    }
  }

  /**
   * 키 입력 분석
   */
  private analyzeKeyInput(event: UiohookKeyboardEvent): void {
    // 키 이름 및 문자 가져오기
    const keyName = getKeyName(event.keycode);
    let keyChar = '';

    // 언어별 문자 매핑
    switch (this.currentLanguage) {
      case 'korean':
        keyChar = getKoreanChar(event.keycode, event.shiftKey || false);
        break;
      case 'japanese':
      case 'chinese':
      case 'english':
        keyChar = getKeyChar(event.keycode, this.currentLanguage, event.shiftKey || false);
        break;
    }

    // 키 시퀀스에 추가 (최대 10개까지만 유지)
    if (keyChar && keyChar.length === 1) {
      this.keySequence.push(keyChar);
      if (this.keySequence.length > 10) {
        this.keySequence.shift();
      }
    }

    // WPM 계산
    const currentTime = Date.now();
    const elapsedMinutes = (currentTime - this.sessionStartTime) / 60000;
    const wpm = elapsedMinutes > 0 ? Math.round(this.keyCount / 5 / elapsedMinutes) : 0;

    // 통계 정보 전송
    this.sendToRenderer('keyboard:stats', {
      keyName,
      keyChar,
      keyCode: event.keycode,
      sequence: this.keySequence.join(''),
      keyCount: this.keyCount,
      wpm,
      sessionTime: currentTime - this.sessionStartTime,
      language: this.currentLanguage
    });
  }

  /**
   * 렌더러 프로세스로 데이터 전송
   */
  private sendToRenderer(channel: string, data: any): void {
    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send(channel, data);
    }
  }

  /**
   * 세션 통계 가져오기
   */
  public getSessionStats(): any {
    const currentTime = Date.now();
    const elapsedMinutes = (currentTime - this.sessionStartTime) / 60000;
    const wpm = elapsedMinutes > 0 ? Math.round(this.keyCount / 5 / elapsedMinutes) : 0;

    return {
      keyCount: this.keyCount,
      wpm,
      sessionTime: currentTime - this.sessionStartTime,
      language: this.currentLanguage,
      isRunning: this.isRunning
    };
  }
}

// 싱글톤 인스턴스
const keyboardService = new KeyboardService();

// 외부에서 사용할 함수들 export
export const registerKeyboardListener = (window: BrowserWindow): boolean => {
  return keyboardService.registerKeyboardListener(window);
};

export const stopKeyboardListener = (): boolean => {
  return keyboardService.stopKeyboardListener();
};

export const setLanguage = (language: 'korean' | 'japanese' | 'chinese' | 'english'): void => {
  keyboardService.setLanguage(language);
};

export const isListening = (): boolean => {
  return keyboardService.isListening();
};

export const getSessionStats = (): any => {
  return keyboardService.getSessionStats();
};

export default keyboardService;
