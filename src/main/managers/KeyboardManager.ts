/**
 * 🔥 기가차드 키보드 매니저
 * Loop Typing Analytics - Keyboard Manager
 */

import { keyboardEngine } from '../keyboard';

export class KeyboardManager {
  private static instance: KeyboardManager;

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
  async initialize(): Promise<void> {
    await keyboardEngine.initialize();
  }

  /**
   * 키보드 리스닝 시작
   */
  async startListening(): Promise<void> {
    await keyboardEngine.startListening();
  }

  /**
   * 키보드 리스닝 중지
   */
  async stopListening(): Promise<void> {
    await keyboardEngine.stopListening();
  }

  /**
   * 상태 확인
   */
  getStatus(): unknown {
    return keyboardEngine.getStatus();
  }

  /**
   * 정리
   */
  async cleanup(): Promise<void> {
    await keyboardEngine.cleanup();
  }

  /**
   * 현재 세션 정보 가져오기
   */
  getCurrentSession(): unknown {
    return keyboardEngine.getSessionData();
  }

  /**
   * 세션 통계 정보 가져오기
   */
  getSessionStats(): unknown {
    return keyboardEngine.getSessionData();
  }
}
