import { contextBridge, ipcRenderer } from 'electron';

/**
 * Electron API를 안전하게 Renderer에 노출
 * 타입 안전성을 보장하는 Preload 스크립트
 */

// API 인터페이스 정의
export interface ElectronAPI {
  // 직접 IPC 호출
  invoke: (channel: string, ...args: any[]) => Promise<any>;
  on: (channel: string, callback: Function) => void;
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
    onKeyEvent(callback: (event: any) => void): void;
    removeKeyEventListener(callback: (event: any) => void): void;
  };

  // 데이터베이스 (추후 구현)
  database: {
    getSessions(filter?: any): Promise<any[]>;
    getAnalytics(sessionId: string): Promise<any>;
  };

  // 설정 (추후 구현)
  settings: {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<boolean>;
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
  on: (channel, callback) => ipcRenderer.on(channel, callback as any),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),

  app: {
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
    getPlatform: () => ipcRenderer.invoke('app:getPlatform')
  },

  keyboard: {
    startMonitoring: () => ipcRenderer.invoke('keyboard:start-monitoring'),
    stopMonitoring: () => ipcRenderer.invoke('keyboard:stop-monitoring'),
    onKeyEvent: (callback) => {
      ipcRenderer.on('keyboard:key-event', (_, data) => callback(data));
    },
    removeKeyEventListener: (callback) => {
      ipcRenderer.removeListener('keyboard:key-event', callback);
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
