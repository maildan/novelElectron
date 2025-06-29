// 🔥 기가차드 글로벌 타입 확장 - Electron 환경 특화
// src/types/global.d.ts

import { ElectronAPI } from '../shared/types';
import { AppCategory } from '../main/keyboard/appCategories';

// 🔥 uiohook-napi 타입 정의 (완전 타입 안전 - 모든 any 제거)
declare module 'uiohook-napi' {
  // 🔥 기가차드 키보드 이벤트 타입 (실제 사용 패턴과 100% 일치)
  export interface UiohookKeyboardEvent {
    keychar: number;
    keycode: number;
    rawcode: number;
    type: number;
    shiftKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
  }

  // 🔥 기가차드 마우스 이벤트 타입
  export interface UiohookMouseEvent {
    x: number;
    y: number;
    button: number;
    clicks: number;
    type: number;
  }

  // 🔥 기가차드 휠 이벤트 타입
  export interface UiohookWheelEvent {
    x: number;
    y: number;
    direction: number;
    rotation: number;
    type: number;
  }

  // 🔥 기가차드 uIOhook 인스턴스 (KeyboardEngine + KeyboardService 호환)
  export interface UiohookInstance {
    start(): void;
    stop(): void;
    on(event: 'keydown' | 'keyup', listener: (event: UiohookKeyboardEvent) => void): this;
    on(event: 'mousedown' | 'mouseup' | 'mousemove', listener: (event: UiohookMouseEvent) => void): this;
    on(event: 'wheel', listener: (event: UiohookWheelEvent) => void): this;
    removeAllListeners(): void;
    
    // 🔥 Loop 전용 확장 메서드들 (KeyboardEngine에서 사용)
    isRunning?(): boolean;
    getEventCount?(): number;
    enableLoopMode?(): void;
    disableLoopMode?(): void;
    setLanguage?(lang: 'ko' | 'en' | 'ja' | 'zh'): void;
  }

  // 🔥 기가차드 메인 uIOhook 익스포트 (싱글톤 패턴)
  export const uIOhook: UiohookInstance;
  export default uIOhook;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    // 🔥 추가 기가차드 글로벌 API
    __LOOP_APP_VERSION__?: string;
    __LOOP_DEBUG_MODE__?: boolean;
  }
  
  namespace NodeJS {
    interface ProcessEnv {
      ELECTRON_IS_DEV?: string;
      NODE_ENV: 'development' | 'production' | 'test';
      // 🔥 Loop 특화 환경변수
      LOOP_LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
      LOOP_DATA_DIR?: string;
      LOOP_AUTO_START?: 'true' | 'false';
    }
  }

  // 🔥 한국어/일본어/중국어 지원을 위한 타입 확장
  interface String {
    toHangul?(): string;
    toHiragana?(): string;
    toKatakana?(): string;
  }
}

// 🔥 기가차드 키보드 언어 지원 타입
export interface KeyboardLanguage {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  composition: boolean; // 조합형 언어 여부 (한글, 일본어 등)
}

// 🔥 다국어 키 매핑 타입
export interface KeyMapping {
  language: string;
  keyCode: number;
  char: string;
  composed?: string; // 조합된 문자 (한글의 경우)
  alternatives?: string[]; // 대체 입력 가능한 문자들
}

// 모듈로 만들기 위해 필요
export {};

// 🔥 GlobalThis 타입 확장 (Loop 애플리케이션 전용)
declare global {
  namespace globalThis {
    var unifiedHandler: import('../main/keyboard/UnifiedHandler').UnifiedHandler | undefined;
    var windowTracker: import('../main/keyboard/WindowTracker').WindowTracker | undefined;
    var databaseManager: import('../main/managers/DatabaseManager').DatabaseManager | undefined;
  }
}
