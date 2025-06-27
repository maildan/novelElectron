// src/types/electron.d.ts
declare module 'electron' {
  interface BrowserWindow {
    // 커스텀 속성 추가
    loopWindowId?: string;
    loopMetadata?: Record<string, unknown>;
  }

  interface WebContents {
    // 커스텀 메서드 추가
    sendToLoop?: (channel: string, data: unknown) => void;
  }

  interface IpcMainInvokeEvent {
    // 커스텀 속성
    loopRequestId?: string;
    loopTimestamp?: number;
  }

  interface IpcRendererEvent {
    // 커스텀 속성
    loopEventId?: string;
  }

  // 메인 프로세스 글로벌 확장
  namespace NodeJS {
    interface Global {
      mainWindow?: BrowserWindow;
      keyboardEngine?: import('../main/keyboard/KeyboardEngine').KeyboardEngine;
      loopApp?: import('../main/index').default;
    }
  }
}

// Electron Builder 타입 확장
declare module 'electron-builder' {
  interface Configuration {
    // 커스텀 빌드 설정
    loopConfig?: {
      enableAutoUpdater?: boolean;
      crashReportUrl?: string;
    };
  }
}

export {};
