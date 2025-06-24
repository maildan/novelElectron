import { contextBridge, ipcRenderer } from 'electron';

/**
 * Electron API를 안전하게 Renderer에 노출
 * 타입 안전성을 보장하는 Preload 스크립트
 */

// API 인터페이스 정의
export interface ElectronAPI {
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
}

// API 구현
const electronAPI: ElectronAPI = {
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
  }
};

// Context Bridge로 안전하게 노출
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// 타입 정의 확장 (TypeScript용)
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

console.log('🔗 Preload script loaded - ElectronAPI exposed');
