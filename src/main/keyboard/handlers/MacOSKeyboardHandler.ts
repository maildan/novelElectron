// 🔥 기가차드 macOS 키보드 핸들러 - macOS 전용 IME 처리 최적화

import { Logger } from '../../../shared/logger';
import { ProcessedKeyboardEvent, UiohookKeyboardEvent } from '../../../shared/types';
import { WindowTracker } from '../WindowTracker';

/**
 * 🔥 MacOSKeyboardHandler - macOS 전용 키보드 이벤트 처리
 * 
 * macOS IME와의 충돌 방지를 위한 특별 처리:
 * - 시스템 IME 완성 문자만 처리
 * - 조합 중간 과정 무시
 * - 완성된 한글만 통계에 반영
 */
export class MacOSKeyboardHandler {
  private readonly componentName = 'MACOS_KEYBOARD_HANDLER';
  private windowTracker: WindowTracker | null = null;

  constructor(windowTracker: WindowTracker | null) {
    this.windowTracker = windowTracker;
    Logger.info(this.componentName, 'macOS 키보드 핸들러 초기화됨');
  }

  /**
   * 🔥 macOS 전용 키 이벤트 처리
   */
  public async handleMacOSKeyEvent(
    type: string, 
    rawEvent: UiohookKeyboardEvent
  ): Promise<ProcessedKeyboardEvent | null> {
    try {
      const keychar = rawEvent.keychar || 0;
      const char = String.fromCharCode(keychar);
      
      // 🔥 완성된 한글만 처리 (조합 중간 과정 무시)
      if (this.isCompletedHangul(keychar)) {
        return await this.processCompletedHangul(char, type, rawEvent);
      }
      // 🔥 영어/숫자 직접 처리
      else if (this.isDirectInputCharacter(keychar)) {
        return await this.processDirectInput(char, type, rawEvent);
      }
      // 🔥 조합 중인 자모는 무시 (시스템 IME가 완성해서 다시 들어올 때까지 기다림)
      else {
        Logger.debug(this.componentName, 'macOS IME 조합 중간 과정 무시', { 
          keychar: keychar.toString(16),
          char: char || 'none'
        });
        return null;
      }
      
    } catch (error) {
      Logger.error(this.componentName, 'macOS 키 이벤트 처리 실패', error);
      return null;
    }
  }

  /**
   * 🔥 완성된 한글 문자인지 판별
   */
  private isCompletedHangul(keychar: number): boolean {
    // 한글 완성형 범위 (가-힣): U+AC00 ~ U+D7AF
    return keychar >= 0xAC00 && keychar <= 0xD7AF;
  }

  /**
   * 🔥 영어/숫자 등 직접 입력 문자인지 판별
   */
  private isDirectInputCharacter(keychar: number): boolean {
    // ASCII 인쇄 가능 문자 (스페이스~틸드)
    return keychar >= 32 && keychar <= 126;
  }

  /**
   * 🔥 완성된 한글 처리
   */
  private async processCompletedHangul(
    char: string, 
    type: string, 
    rawEvent: UiohookKeyboardEvent
  ): Promise<ProcessedKeyboardEvent> {
    const windowInfo = this.windowTracker?.getCurrentWindow() || {
      title: 'Unknown',
      processName: 'Unknown'
    };

    const processedEvent: ProcessedKeyboardEvent = {
      key: char,
      code: `Key${rawEvent.keycode}`,
      keycode: rawEvent.keycode,
      keychar: char,
      timestamp: Date.now(),
      type: type as 'keydown' | 'keyup' | 'input',
      windowTitle: windowInfo.title || 'Unknown',
      language: 'ko',
      composedChar: char,
      isComposing: false,    // 🔥 완성된 상태
      inputMethod: 'ime',
      processingTime: 0
    };

    Logger.debug(this.componentName, 'macOS 완성된 한글 처리됨', {
      char,
      language: 'ko',
      isComposing: false
    });

    return processedEvent;
  }

  /**
   * 🔥 영어/숫자 직접 입력 처리
   */
  private async processDirectInput(
    char: string, 
    type: string, 
    rawEvent: UiohookKeyboardEvent
  ): Promise<ProcessedKeyboardEvent> {
    const windowInfo = this.windowTracker?.getCurrentWindow() || {
      title: 'Unknown',
      processName: 'Unknown'
    };

    const language = this.detectLanguageFromChar(char);

    const processedEvent: ProcessedKeyboardEvent = {
      key: char,
      code: `Key${rawEvent.keycode}`,
      keycode: rawEvent.keycode,
      keychar: char,
      timestamp: Date.now(),
      type: type as 'keydown' | 'keyup' | 'input',
      windowTitle: windowInfo.title || 'Unknown',
      language,
      composedChar: char,
      isComposing: false,    // 🔥 직접 입력은 조합 없음
      inputMethod: 'direct',
      processingTime: 0
    };

    Logger.debug(this.componentName, 'macOS 직접 입력 처리됨', {
      char,
      language,
      isComposing: false
    });

    return processedEvent;
  }

  /**
   * 🔥 문자로부터 언어 감지
   */
  private detectLanguageFromChar(char: string): string {
    if (!char || char.length !== 1) return 'en';
    
    const charCode = char.charCodeAt(0);
    
    // 한글 완성형
    if (charCode >= 0xAC00 && charCode <= 0xD7AF) return 'ko';
    
    // 한글 자모
    if ((charCode >= 0x1100 && charCode <= 0x11FF) || 
        (charCode >= 0x3130 && charCode <= 0x318F)) return 'ko';
    
    // 일본어
    if ((charCode >= 0x3040 && charCode <= 0x309F) || // 히라가나
        (charCode >= 0x30A0 && charCode <= 0x30FF)) return 'ja'; // 가타카나
    
    // 중국어 (한자)
    if (charCode >= 0x4E00 && charCode <= 0x9FFF) return 'zh';
    
    // 기본값: 영어
    return 'en';
  }
}

export default MacOSKeyboardHandler;
