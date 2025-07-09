import { contextBridge, ipcRenderer } from 'electron';
import { 
  IPC_CHANNELS, 
  IpcResponse, 
  TypingSession, 
  TypingStats, 
  UserPreferences, 
  WindowInfo,
  ElectronAPI,
  Project,
  ProjectCharacter,
  ProjectStructure,
  ProjectNote
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
    forceKorean: () => ipcRenderer.invoke('keyboard:force-korean'),
    testLanguageDetection: (keycode: number, keychar?: number) => ipcRenderer.invoke('keyboard:test-language-detection', keycode, keychar),
    // 🔥 새로운 다국어 지원 메서드들 추가
    detectLanguage: (keycode: number) => ipcRenderer.invoke('keyboard:detect-language', keycode),
    getSupportedLanguages: () => ipcRenderer.invoke('keyboard:get-supported-languages'),
    setInputMethod: (method: 'direct' | 'composition') => ipcRenderer.invoke('keyboard:set-input-method', method),
    resetComposition: () => ipcRenderer.invoke('keyboard:reset-composition'),
    getCompositionState: () => ipcRenderer.invoke('keyboard:get-composition-state'),
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
    // 🔥 새로운 캐릭터/구조/메모 API 추가
    getCharacters: (projectId: string) => ipcRenderer.invoke('projects:get-characters', projectId),
    getStructure: (projectId: string) => ipcRenderer.invoke('projects:get-structure', projectId),
    getNotes: (projectId: string) => ipcRenderer.invoke('projects:get-notes', projectId),
    updateCharacters: (projectId: string, characters: ProjectCharacter[]) => ipcRenderer.invoke('projects:update-characters', projectId, characters),
    updateNotes: (projectId: string, notes: ProjectNote[]) => ipcRenderer.invoke('projects:update-notes', projectId, notes),
    upsertCharacter: (character: Partial<ProjectCharacter>) => ipcRenderer.invoke('projects:upsert-character', character),
    upsertStructure: (structure: Partial<ProjectStructure>) => ipcRenderer.invoke('projects:upsert-structure', structure),
    upsertNote: (note: Partial<ProjectNote>) => ipcRenderer.invoke('projects:upsert-note', note),
    deleteCharacter: (id: string) => ipcRenderer.invoke('projects:delete-character', id),
    deleteStructure: (id: string) => ipcRenderer.invoke('projects:delete-structure', id),
    deleteNote: (id: string) => ipcRenderer.invoke('projects:delete-note', id),
  },

  app: {
    getVersion: () => ipcRenderer.invoke(IPC_CHANNELS.APP.GET_VERSION),
    quit: () => ipcRenderer.invoke(IPC_CHANNELS.APP.QUIT),
    minimize: () => ipcRenderer.invoke(IPC_CHANNELS.APP.MINIMIZE),
    maximize: () => ipcRenderer.invoke(IPC_CHANNELS.APP.MAXIMIZE),
    isMaximized: () => ipcRenderer.invoke(IPC_CHANNELS.APP.IS_MAXIMIZED),
  },

  database: {
    backup: () => ipcRenderer.invoke('database:backup'),
    restore: (backupPath: string) => ipcRenderer.invoke('database:restore', backupPath),
    optimize: () => ipcRenderer.invoke('database:optimize'),
    reset: () => ipcRenderer.invoke('database:reset'),
    saveSession: (session: Omit<TypingSession, 'id'>) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.SAVE_SESSION, session),
    getSessions: (options?: { limit?: number; offset?: number }) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.GET_SESSIONS, options),
    getStats: (dateRange?: { from: Date; to: Date }) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.GET_STATS, dateRange),
  },

  ai: {
    analyzeText: (text: string) => ipcRenderer.invoke('ai:analyze-text', text),
    improveText: (text: string, projectId?: string) => ipcRenderer.invoke('ai:improve-text', text, projectId),
    generateSuggestions: (prompt: string) => ipcRenderer.invoke('ai:generate-suggestions', prompt),
    getUsageStats: () => ipcRenderer.invoke('ai:get-usage-stats'),
    sendMessage: (message: string, context?: string) => ipcRenderer.invoke('ai:send-message', message, context),
    getWritingHelp: (prompt: string, context?: string) => ipcRenderer.invoke('ai:get-writing-help', prompt, context),
    getProjectContext: (projectId: string) => ipcRenderer.invoke('ai:get-project-context', projectId),
    healthCheck: () => ipcRenderer.invoke('ai:health-check'),
    continueWriting: (text: string, context?: string) => ipcRenderer.invoke('ai:continue-writing', text, context),
    summarizeText: (text: string) => ipcRenderer.invoke('ai:summarize-text', text),
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

  // 🔥 기가차드 Shell API 추가 (외부 링크 열기)
  shell: {
    openExternal: (url: string) => ipcRenderer.invoke('shell:open-external', url),
    showItemInFolder: (fullPath: string) => ipcRenderer.invoke('shell:show-item-in-folder', fullPath),
  },

  // 🔥 OAuth API (Google Docs 연동)
  oauth: {
    startGoogleAuth: () => ipcRenderer.invoke('oauth:start-google-auth'),
    handleCallback: (code: string) => ipcRenderer.invoke('oauth:handle-callback', code),
    getGoogleDocuments: () => ipcRenderer.invoke('oauth:get-google-documents'),
    importGoogleDoc: (documentId: string) => ipcRenderer.invoke('oauth:import-google-doc', documentId),
    getAuthStatus: () => ipcRenderer.invoke('oauth:get-auth-status'),
    revokeAuth: () => ipcRenderer.invoke('oauth:revoke-auth'),
  },
};

// 🔥 안전한 API 노출
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Window 글로벌 타입은 shared/types.ts에서 이미 선언됨
