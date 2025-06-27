// src/types/uiohook.d.ts
declare module 'uiohook-napi' {
  // 기존 타입 확장
  export interface UiohookKeyEvent {
    keycode: number;
    rawcode: number;
    type: number;
    shiftKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    
    // Loop 전용 확장
    loopTimestamp?: number;
    loopProcessed?: boolean;
    loopLanguage?: 'ko' | 'en' | 'ja' | 'zh';
    loopComposed?: string; // 조합된 문자 (한글 등)
  }

  export interface UiohookMouseEvent {
    x: number;
    y: number;
    button: number;
    clicks: number;
    type: number;
    
    // Loop 전용 확장
    loopTimestamp?: number;
    loopWindowTitle?: string;
  }

  export interface UiohookWheelEvent {
    x: number;
    y: number;
    direction: number;
    rotation: number;
    type: number;
    
    // Loop 전용 확장
    loopTimestamp?: number;
  }

  // 이벤트 타입 확장
  export type UiohookEventType = 
    | 'keydown' 
    | 'keyup' 
    | 'mousedown' 
    | 'mouseup' 
    | 'mousemove'
    | 'wheel'
    | 'click'
    | 'doubleclick';

  // 인스턴스 확장
  export class UiohookInstance {
    start(): void;
    stop(): void;
    
    // 기본 이벤트 리스너
    on(event: 'keydown' | 'keyup', listener: (event: UiohookKeyEvent) => void): this;
    on(event: 'mousedown' | 'mouseup' | 'mousemove', listener: (event: UiohookMouseEvent) => void): this;
    on(event: 'wheel', listener: (event: UiohookWheelEvent) => void): this;
    
    // Loop 전용 이벤트
    on(event: 'loop:keystroke', listener: (event: UiohookKeyEvent) => void): this;
    on(event: 'loop:session-start', listener: () => void): this;
    on(event: 'loop:session-end', listener: () => void): this;
    
    // 제거 메서드
    off(event: UiohookEventType, listener?: Function): this;
    removeAllListeners(event?: UiohookEventType): this;
    
    // 상태 메서드
    isRunning(): boolean;
    getEventCount(): number;
    
    // Loop 전용 메서드
    enableLoopMode(): void;
    disableLoopMode(): void;
    setLanguage(lang: 'ko' | 'en' | 'ja' | 'zh'): void;
  }

  // 메인 인스턴스
  export const uIOhook: UiohookInstance;
  export default uIOhook;

  // 키코드 상수
  export const VC_ESCAPE: number;
  export const VC_F1: number;
  export const VC_F2: number;
  // ... 더 많은 키코드들

  // Mouse 버튼 상수  
  export const MOUSE_BUTTON1: number;
  export const MOUSE_BUTTON2: number;
  export const MOUSE_BUTTON3: number;
}

export {};
