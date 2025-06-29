import { contextBridge, ipcRenderer } from 'electron';
import { 
  IPC_CHANNELS, 
  IpcResponse, 
  TypingSession, 
  TypingStats, 
  UserPreferences, 
  WindowInfo,
  ElectronAPI,
  Project
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

// 🔥 타입 안전한 API 구현
const electronAPI: ElectronAPI = {
  keyboard: {
    startMonitoring: () => ipcRenderer.invoke(IPC_CHANNELS.KEYBOARD.START_MONITORING),
    stopMonitoring: () => ipcRenderer.invoke(IPC_CHANNELS.KEYBOARD.STOP_MONITORING),
    getStatus: () => ipcRenderer.invoke(IPC_CHANNELS.KEYBOARD.GET_STATUS),
    getRealtimeStats: () => ipcRenderer.invoke('keyboard:get-realtime-stats'),
    setLanguage: (language: string) => ipcRenderer.invoke('keyboard:set-language', language),
  },

  dashboard: {
    getStats: () => ipcRenderer.invoke('dashboard:get-stats'),
    getRecentSessions: () => ipcRenderer.invoke('dashboard:get-recent-sessions'),
  },

  projects: {
    getAll: () => ipcRenderer.invoke('projects:get-all'),
    getById: (id: string) => ipcRenderer.invoke('projects:get-by-id', id),
    create: (project: Omit<Project, 'id' | 'createdAt' | 'lastModified'>) => ipcRenderer.invoke('projects:create', project),
    update: (id: string, updates: Partial<Project>) => ipcRenderer.invoke('projects:update', id, updates),
    delete: (id: string) => ipcRenderer.invoke('projects:delete', id),
    createSample: () => ipcRenderer.invoke('projects:create-sample'),
    importFile: () => ipcRenderer.invoke('projects:import-file'),
  },

  app: {
    getVersion: () => ipcRenderer.invoke(IPC_CHANNELS.APP.GET_VERSION),
    quit: () => ipcRenderer.invoke(IPC_CHANNELS.APP.QUIT),
    minimize: () => ipcRenderer.invoke(IPC_CHANNELS.APP.MINIMIZE),
    maximize: () => ipcRenderer.invoke(IPC_CHANNELS.APP.MAXIMIZE),
    isMaximized: () => ipcRenderer.invoke(IPC_CHANNELS.APP.IS_MAXIMIZED),
  },

  database: {
    saveSession: (session: Omit<TypingSession, 'id'>) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.SAVE_SESSION, session),
    getSessions: (options?: { limit?: number; offset?: number }) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.GET_SESSIONS, options),
    getStats: (dateRange?: { from: Date; to: Date }) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.GET_STATS, dateRange),
  },

  ai: {
    analyzeText: (text: string) => ipcRenderer.invoke('ai:analyze-text', text),
    generateSuggestions: (prompt: string) => ipcRenderer.invoke('ai:generate-suggestions', prompt),
    getUsageStats: () => ipcRenderer.invoke('ai:get-usage-stats'),
  },

  notifications: {
    show: (title: string, message: string) => ipcRenderer.invoke('notifications:show', title, message),
    showTypingGoal: (progress: number) => ipcRenderer.invoke('notifications:show-typing-goal', progress),
  },

  theme: {
    get: () => ipcRenderer.invoke('theme:get'),
    set: (theme: 'light' | 'dark' | 'system') => ipcRenderer.invoke('theme:set', theme),
  },

  settings: {
    get: (key: string) => ipcRenderer.invoke('settings:get', key),
    set: (key: string, value: unknown) => ipcRenderer.invoke('settings:set', key, value),
    getAll: () => ipcRenderer.invoke('settings:get-all'),
    reset: () => ipcRenderer.invoke('settings:reset'),
  },
};

// 🔥 안전한 API 노출
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Window 글로벌 타입은 shared/types.ts에서 이미 선언됨
