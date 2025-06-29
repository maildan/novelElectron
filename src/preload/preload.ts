import { contextBridge, ipcRenderer } from 'electron';
import { 
  IPC_CHANNELS, 
  IpcResponse, 
  TypingSession, 
  TypingStats, 
  UserPreferences, 
  WindowInfo 
} from '../shared/types';
import type { 
  SettingsSchema, 
  SettingsResult,
  AppSettingsSchema,
  KeyboardSettingsSchema,
  UISettingsSchema,
  AnalyticsSettingsSchema,
  SecuritySettingsSchema,
  NotificationSettingsSchema,
  AISettingsSchema,
  ClipboardSettingsSchema,
  ScreenshotSettingsSchema,
  AccountSettingsSchema,
  DataRetentionSettingsSchema
} from '../main/settings/types';

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

  // 설정 API - 새로운 타입 안전한 Settings 시스템
  settings: {
    // 전체 설정 조회
    getAll: () => Promise<SettingsResult<SettingsSchema>>;
    
    // 카테고리별 설정 조회
    getCategory: <K extends keyof SettingsSchema>(category: K) => Promise<SettingsResult<SettingsSchema[K]>>;
    
    // 특정 값 조회
    getValue: <K extends keyof SettingsSchema, V extends keyof SettingsSchema[K]>(
      category: K, 
      key: V
    ) => Promise<SettingsResult<SettingsSchema[K][V]>>;
    
    // 카테고리별 설정 저장
    setCategory: <K extends keyof SettingsSchema>(
      category: K, 
      value: SettingsSchema[K]
    ) => Promise<SettingsResult<void>>;
    
    // 특정 값 저장
    setValue: <K extends keyof SettingsSchema, V extends keyof SettingsSchema[K]>(
      category: K, 
      key: V, 
      value: SettingsSchema[K][V]
    ) => Promise<SettingsResult<void>>;
    
    // 전체 초기화
    reset: () => Promise<SettingsResult<void>>;
    
    // 백업/복원
    backup: () => Promise<SettingsResult<string>>;
    restore: (backupData: string) => Promise<SettingsResult<void>>;
    
    // 변경 감지
    watch: <K extends keyof SettingsSchema>(
      category: K, 
      callback: (value: SettingsSchema[K]) => void
    ) => () => void;
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
      ipcRenderer.on(IPC_CHANNELS.KEYBOARD.EVENT, (_event: any, data: any) => callback(data));
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
    // 🔥 새로운 Settings 시스템 API - 타입 안전!
    getAll: () => ipcRenderer.invoke('settings:get-all'),
    getCategory: <K extends keyof SettingsSchema>(category: K) => 
      ipcRenderer.invoke('settings:get-category', category as string),
    getValue: <K extends keyof SettingsSchema, V extends keyof SettingsSchema[K]>(
      category: K, 
      key: V
    ) => ipcRenderer.invoke('settings:get-value', category as string, key as string),
    setCategory: <K extends keyof SettingsSchema>(category: K, value: SettingsSchema[K]) => 
      ipcRenderer.invoke('settings:set-category', category as string, value),
    setValue: <K extends keyof SettingsSchema, V extends keyof SettingsSchema[K]>(
      category: K, 
      key: V, 
      value: SettingsSchema[K][V]
    ) => ipcRenderer.invoke('settings:set-value', category as string, key as string, value),
    reset: () => ipcRenderer.invoke('settings:reset'),
    backup: () => ipcRenderer.invoke('settings:backup'),
    restore: (backupData: string) => ipcRenderer.invoke('settings:restore', backupData),
    watch: <K extends keyof SettingsSchema>(
      category: K, 
      callback: (value: SettingsSchema[K]) => void
    ) => {
      const channel = `settings:watch:${category as string}`;
      const handler = (_event: unknown, data: SettingsSchema[K]) => callback(data);
      ipcRenderer.on(channel, handler);
      
      // Cleanup 함수 반환
      return () => {
        ipcRenderer.removeListener(channel, handler);
      };
    },
  },
};

// 🔥 안전한 API 노출
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Window 글로벌 타입은 shared/types.ts에서 이미 선언됨
