import { contextBridge, ipcRenderer } from 'electron';
import type { LoopKeyboardEvent, TypingSession, SessionFilter, AnalyticsData } from '../shared/types';

// 🔥 기가차드 심플 글로벌 폴리필
// #DEBUG: globalThis 타입 확장을 위한 안전한 접근
if (typeof (globalThis as Record<string, unknown>).global === 'undefined') {
  (globalThis as Record<string, unknown>).global = globalThis;
}

/**
 * Electron API를 안전하게 Renderer에 노출
 * 타입 안전성을 보장하는 Preload 스크립트
 */

// API 인터페이스 정의
export interface ElectronAPI {
  // 직접 IPC 호출
  invoke: <T = unknown>(channel: string, ...args: unknown[]) => Promise<T>;
  on: (channel: string, callback: (...args: unknown[]) => void) => void;
  removeAllListeners: (channel: string) => void;

  // 앱 정보
  app: {
    getVersion(): Promise<string>;
    getPlatform(): Promise<string>;
  };

  // 키보드 모니터링
  keyboard: {
    startMonitoring(): Promise<{ success: boolean; message?: string; error?: string }>;
    stopMonitoring(): Promise<{ success: boolean; message?: string; error?: string }>;
    getMonitoringStatus(): Promise<{ isActive: boolean; message?: string }>;
    onKeyEvent(callback: (event: LoopKeyboardEvent) => void): void;
    removeKeyEventListener(callback: (event: LoopKeyboardEvent) => void): void;
  };

  // 데이터베이스 (실제 DB 연동)
  database: {
    getSessions(filter?: SessionFilter): Promise<TypingSession[]>;
    getAnalytics(sessionId: string): Promise<AnalyticsData | null>;
  };

  // 설정 (추후 구현)
  settings: {
    get(key: string): Promise<unknown>;
    set(key: string, value: unknown): Promise<boolean>;
  };

  // 윈도우 제어
  window: {
    minimize(): Promise<void>;
    maximize(): Promise<void>;
    close(): Promise<void>;
    toggleMaximize(): Promise<void>;
  };
}

// API 구현
const electronAPI: ElectronAPI = {
  // 직접 IPC 호출
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  on: (channel, callback) => ipcRenderer.on(channel, (...args) => callback(...args)),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),

  app: {
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
    getPlatform: () => ipcRenderer.invoke('app:getPlatform')
  },

  keyboard: {
    startMonitoring: () => ipcRenderer.invoke('keyboard:start-monitoring'),
    stopMonitoring: () => ipcRenderer.invoke('keyboard:stop-monitoring'),
    getMonitoringStatus: () => ipcRenderer.invoke('keyboard:get-status'),
    onKeyEvent: (callback: (event: LoopKeyboardEvent) => void) => {
      // #DEBUG: 메모리 누수 방지를 위한 콜백 래핑 개선
      const wrappedCallback = (_: unknown, data: LoopKeyboardEvent) => callback(data);
      ipcRenderer.on('keyboard:key-event', wrappedCallback);
      
      // 정리 함수 반환하여 메모리 누수 방지
      return () => {
        ipcRenderer.removeListener('keyboard:key-event', wrappedCallback);
      };
    },
    removeKeyEventListener: () => {
      // 🔥 기가차드 메모리 관리: 모든 키보드 이벤트 리스너 정리
      ipcRenderer.removeAllListeners('keyboard:key-event');
    }
  },

  database: {
    getSessions: (filter) => ipcRenderer.invoke('database:get-sessions', filter),
    getAnalytics: (sessionId) => ipcRenderer.invoke('database:get-analytics', sessionId)
  },

  settings: {
    get: (key) => ipcRenderer.invoke('settings:get', key),
    set: (key, value) => ipcRenderer.invoke('settings:set', key, value)
  },

  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    toggleMaximize: () => ipcRenderer.invoke('window:toggle-maximize')
  }
};

// Context Bridge로 안전하게 노출
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

console.log('🔗 Preload script loaded - ElectronAPI exposed');
