import { contextBridge, ipcRenderer } from 'electron';
import { 
  IPC_CHANNELS, 
  IpcResponse, 
  TypingSession, 
  TypingStats, 
  UserPreferences, 
  WindowInfo 
} from '../shared/types';

// 🔥 기가차드 Preload 스크립트 - 타입 안전한 API 브릿지

interface ElectronAPI {
  // 앱 관련 API
  app: {
    getVersion: () => Promise<IpcResponse<string>>;
    quit: () => Promise<IpcResponse<void>>;
    minimize: () => Promise<IpcResponse<void>>;
    maximize: () => Promise<IpcResponse<void>>;
  };

  // 키보드 모니터링 API
  keyboard: {
    startMonitoring: () => Promise<IpcResponse<boolean>>;
    stopMonitoring: () => Promise<IpcResponse<boolean>>;
    getStatus: () => Promise<IpcResponse<boolean>>;
    onEvent: (callback: (event: unknown) => void) => void;
    removeEventListener: () => void;
  };

  // 윈도우 관련 API
  window: {
    getActive: () => Promise<IpcResponse<WindowInfo>>;
    getList: () => Promise<IpcResponse<WindowInfo[]>>;
  };

  // 데이터베이스 API
  database: {
    saveSession: (session: Omit<TypingSession, 'id'>) => Promise<IpcResponse<string>>;
    getSessions: (limit?: number) => Promise<IpcResponse<TypingSession[]>>;
    getStats: (startDate?: Date, endDate?: Date) => Promise<IpcResponse<TypingStats>>;
  };

  // 설정 API
  settings: {
    get: () => Promise<IpcResponse<UserPreferences>>;
    set: (settings: Partial<UserPreferences>) => Promise<IpcResponse<void>>;
    reset: () => Promise<IpcResponse<void>>;
  };
}

// 🔥 타입 안전한 API 구현
const electronAPI: ElectronAPI = {
  app: {
    getVersion: () => ipcRenderer.invoke(IPC_CHANNELS.APP.GET_VERSION),
    quit: () => ipcRenderer.invoke(IPC_CHANNELS.APP.QUIT),
    minimize: () => ipcRenderer.invoke(IPC_CHANNELS.APP.MINIMIZE),
    maximize: () => ipcRenderer.invoke(IPC_CHANNELS.APP.MAXIMIZE),
  },

  keyboard: {
    startMonitoring: () => ipcRenderer.invoke(IPC_CHANNELS.KEYBOARD.START_MONITORING),
    stopMonitoring: () => ipcRenderer.invoke(IPC_CHANNELS.KEYBOARD.STOP_MONITORING),
    getStatus: () => ipcRenderer.invoke(IPC_CHANNELS.KEYBOARD.GET_STATUS),
    onEvent: (callback: (event: unknown) => void) => {
      ipcRenderer.on(IPC_CHANNELS.KEYBOARD.EVENT, (_event, data) => callback(data));
    },
    removeEventListener: () => {
      ipcRenderer.removeAllListeners(IPC_CHANNELS.KEYBOARD.EVENT);
    },
  },

  window: {
    getActive: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW.GET_ACTIVE),
    getList: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW.GET_LIST),
  },

  database: {
    saveSession: (session: Omit<TypingSession, 'id'>) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.SAVE_SESSION, session),
    getSessions: (limit?: number) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.GET_SESSIONS, limit),
    getStats: (startDate?: Date, endDate?: Date) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.GET_STATS, startDate, endDate),
  },

  settings: {
    get: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.GET),
    set: (settings: Partial<UserPreferences>) => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.SET, settings),
    reset: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.RESET),
  },
};

// 🔥 안전한 API 노출
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// 타입 확장을 위한 글로벌 선언
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
