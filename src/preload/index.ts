// Logger는 preload에서 사용하지 않음 (보안상 이유)
// import { Logger } from "@shared/logger";
// const log = Logger;

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { 
  LoopKeyboardEvent, 
  SessionStats, 
  KeyboardConfig,
  AppInfo,
  SystemInfo 
} from '../shared/types';

// 🔥 기가차드 심플 글로벌 폴리필 - 타입 안전
if (typeof (globalThis as Record<string, unknown>).global === 'undefined') {
  (globalThis as Record<string, unknown>).global = globalThis;
}

/**
 * 🔥 기가차드 Electron API - 완전 타입 안전
 * 모든 any 타입 박살내고 엄격한 타입 체크
 */

// 키보드 이벤트 콜백 타입
type KeyboardEventCallback = (event: LoopKeyboardEvent) => void;

// IPC 콜백 타입
type IpcCallback = (event: IpcRendererEvent, ...args: unknown[]) => void;

// 모니터링 응답 타입
interface MonitoringResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// 모니터링 상태 타입
interface MonitoringStatus {
  isActive: boolean;
  message?: string;
}

// 세션 필터 타입
interface SessionFilter {
  startDate?: Date;
  endDate?: Date;
  appName?: string;
  limit?: number;
}

// 기가차드 ElectronAPI 인터페이스 - any 완전 제거
export interface ElectronAPI {
  // 직접 IPC 호출 - 타입 안전
  invoke: <T = unknown>(channel: string, ...args: unknown[]) => Promise<T>;
  on: (channel: string, callback: IpcCallback) => void;
  removeAllListeners: (channel: string) => void;

  // 앱 정보
  app: {
    getVersion(): Promise<string>;
    getPlatform(): Promise<string>;
    getInfo(): Promise<AppInfo>;
  };

  // 키보드 모니터링 - 완전 타입 안전
  keyboard: {
    startMonitoring(): Promise<MonitoringResponse>;
    stopMonitoring(): Promise<MonitoringResponse>;
    getMonitoringStatus(): Promise<MonitoringStatus>;
    onKeyEvent(callback: KeyboardEventCallback): void;
    removeKeyEventListener(callback: KeyboardEventCallback): void;
    getConfig(): Promise<KeyboardConfig>;
    setConfig(config: Partial<KeyboardConfig>): Promise<boolean>;
  };

  // 데이터베이스 - 타입 안전
  database: {
    getSessions(filter?: SessionFilter): Promise<SessionStats[]>;
    getAnalytics(sessionId: string): Promise<SessionStats>;
    saveSession(session: Partial<SessionStats>): Promise<boolean>;
    deleteSession(sessionId: string): Promise<boolean>;
  };

  // 설정 - 타입 안전
  settings: {
    get<T = unknown>(key: string): Promise<T>;
    set<T = unknown>(key: string, value: T): Promise<boolean>;
    getAll(): Promise<Record<string, unknown>>;
    reset(): Promise<boolean>;
  };

  // 윈도우 제어
  window: {
    minimize(): Promise<void>;
    maximize(): Promise<void>;
    close(): Promise<void>;
    toggleMaximize(): Promise<void>;
    isMaximized(): Promise<boolean>;
  };

  // 시스템 정보
  system: {
    getInfo(): Promise<SystemInfo>;
    getMemoryUsage(): Promise<{ used: number; total: number }>;
  };
}

// 🔥 기가차드 API 구현 - 완전 타입 안전
const electronAPI: ElectronAPI = {
  // 직접 IPC 호출 - 제네릭 타입으로 안전
  invoke: <T = unknown>(channel: string, ...args: unknown[]): Promise<T> => 
    ipcRenderer.invoke(channel, ...args),
  
  on: (channel: string, callback: IpcCallback): void => {
    ipcRenderer.on(channel, callback);
  },
  
  removeAllListeners: (channel: string): void => {
    ipcRenderer.removeAllListeners(channel);
  },

  app: {
    getVersion: (): Promise<string> => ipcRenderer.invoke('app:getVersion'),
    getPlatform: (): Promise<string> => ipcRenderer.invoke('app:getPlatform'),
    getInfo: (): Promise<AppInfo> => ipcRenderer.invoke('app:getInfo')
  },

  keyboard: {
    startMonitoring: (): Promise<MonitoringResponse> => 
      ipcRenderer.invoke('keyboard:start-monitoring'),
    
    stopMonitoring: (): Promise<MonitoringResponse> => 
      ipcRenderer.invoke('keyboard:stop-monitoring'),
    
    getMonitoringStatus: (): Promise<MonitoringStatus> => 
      ipcRenderer.invoke('keyboard:get-status'),
    
    onKeyEvent: (callback: KeyboardEventCallback): void => {
      const wrappedCallback = (_: IpcRendererEvent, data: LoopKeyboardEvent): void => 
        callback(data);
      ipcRenderer.on('keyboard:key-event', wrappedCallback);
    },
    
    removeKeyEventListener: (callback: KeyboardEventCallback): void => {
      // 정확한 콜백 제거를 위해 래퍼 함수 맵핑 필요
      ipcRenderer.removeAllListeners('keyboard:key-event');
    },

    getConfig: (): Promise<KeyboardConfig> => 
      ipcRenderer.invoke('keyboard:get-config'),
    
    setConfig: (config: Partial<KeyboardConfig>): Promise<boolean> => 
      ipcRenderer.invoke('keyboard:set-config', config)
  },

  database: {
    getSessions: (filter?: SessionFilter): Promise<SessionStats[]> => 
      ipcRenderer.invoke('database:get-sessions', filter),
    
    getAnalytics: (sessionId: string): Promise<SessionStats> => 
      ipcRenderer.invoke('database:get-analytics', sessionId),
    
    saveSession: (session: Partial<SessionStats>): Promise<boolean> => 
      ipcRenderer.invoke('database:save-session', session),
    
    deleteSession: (sessionId: string): Promise<boolean> => 
      ipcRenderer.invoke('database:delete-session', sessionId)
  },

  settings: {
    get: <T = unknown>(key: string): Promise<T> => 
      ipcRenderer.invoke('settings:get', key),
    
    set: <T = unknown>(key: string, value: T): Promise<boolean> => 
      ipcRenderer.invoke('settings:set', key, value),
    
    getAll: (): Promise<Record<string, unknown>> => 
      ipcRenderer.invoke('settings:get-all'),
    
    reset: (): Promise<boolean> => 
      ipcRenderer.invoke('settings:reset')
  },

  window: {
    minimize: (): Promise<void> => ipcRenderer.invoke('window:minimize'),
    maximize: (): Promise<void> => ipcRenderer.invoke('window:maximize'),
    close: (): Promise<void> => ipcRenderer.invoke('window:close'),
    toggleMaximize: (): Promise<void> => ipcRenderer.invoke('window:toggle-maximize'),
    isMaximized: (): Promise<boolean> => ipcRenderer.invoke('window:is-maximized')
  },

  system: {
    getInfo: (): Promise<SystemInfo> => ipcRenderer.invoke('system:get-info'),
    getMemoryUsage: (): Promise<{ used: number; total: number }> => 
      ipcRenderer.invoke('system:get-memory-usage')
  }
};

import { Logger } from '../shared/logger';

// Context Bridge로 안전하게 노출
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

Logger.info('PRELOAD', '🔥 기가차드 Preload script loaded - 완전 타입 안전 ElectronAPI 노출');
