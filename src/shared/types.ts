// 🔥 기가차드 공유 타입 정의 - Electron API 통합

// 🔥 Result 타입 - 함수 결과 래핑
export interface Result<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: string;
}

// 🔥 IPC 응답 타입 - Main ↔ Renderer 공통
export interface IpcResponse<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: string;
  timestamp: Date;
}

// 🎯 키보드 모니터링 상태 - Main ↔ Renderer 공통
export interface MonitoringStatus {
  isActive: boolean;
  startTime?: Date;
  sessionDuration: number;
  language: string;
}

// 🎯 실시간 타이핑 통계 - Main ↔ Renderer 공통
export interface RealtimeStats {
  currentWpm: number;
  accuracy: number;
  sessionTime: number;
  charactersTyped: number;
  errorsCount: number;
}

// 🎯 대시보드 통계 - Main ↔ Renderer 공통
export interface DashboardStats {
  todayWords: number;
  weekWords: number;
  monthWords: number;
  avgWpm: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  accuracy: number;
  streakDays: number;
}

// 🎯 세션 데이터 - Main ↔ Renderer 공통
export interface TypingSession {
  id: string;
  userId: string;
  content: string;
  startTime: Date;
  endTime: Date | null;
  keyCount: number;
  wpm: number;
  accuracy: number;
  windowTitle: string | null;
  appName: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 🎯 프로젝트 데이터 - Main ↔ Renderer 공통
export interface Project {
  id: string;
  title: string;
  description: string;
  content: string;
  progress: number;
  wordCount: number;
  lastModified: Date;
  createdAt: Date;
  genre: string;
  status: 'active' | 'completed' | 'paused';
}

// 🔥 메인 Electron API 인터페이스 - Main ↔ Renderer 공통
export interface ElectronAPI {
  // ⌨️ 키보드 API
  keyboard: {
    startMonitoring: () => Promise<IpcResponse<boolean>>;
    stopMonitoring: () => Promise<IpcResponse<boolean>>;
    getStatus: () => Promise<IpcResponse<MonitoringStatus>>;
    getRealtimeStats: () => Promise<IpcResponse<RealtimeStats>>;
    setLanguage: (language: string) => Promise<IpcResponse<boolean>>;
    // 🔥 기가차드 한글 입력 강화 API
    forceKorean: () => Promise<IpcResponse<boolean>>;
    testLanguageDetection: (keycode: number, keychar?: number) => Promise<IpcResponse<string>>;
  };

  // 📊 대시보드 API
  dashboard: {
    getStats: () => Promise<IpcResponse<DashboardStats>>;
    getRecentSessions: () => Promise<IpcResponse<TypingSession[]>>;
  };

  // 📁 프로젝트 API
  projects: {
    getAll: () => Promise<IpcResponse<Project[]>>;
    getById: (id: string) => Promise<IpcResponse<Project>>;
    create: (project: Omit<Project, 'id' | 'createdAt' | 'lastModified'>) => Promise<IpcResponse<Project>>;
    update: (id: string, updates: Partial<Project>) => Promise<IpcResponse<Project>>;
    delete: (id: string) => Promise<IpcResponse<boolean>>;
    createSample: () => Promise<IpcResponse<Project>>;
    importFile: () => Promise<IpcResponse<{ success: boolean; message: string }>>;
  };

  // ⚙️ 설정 API
  settings: {
    get: (key: string) => Promise<IpcResponse<unknown>>;
    set: (key: string, value: unknown) => Promise<IpcResponse<unknown>>;
    getAll: () => Promise<IpcResponse<Record<string, unknown>>>;
    reset: () => Promise<IpcResponse<boolean>>;
  };

  // 🖥️ 앱 API
  app: {
    getVersion: () => Promise<IpcResponse<string>>;
    quit: () => Promise<IpcResponse<boolean>>;
    minimize: () => Promise<IpcResponse<boolean>>;
    maximize: () => Promise<IpcResponse<boolean>>;
    isMaximized: () => Promise<IpcResponse<boolean>>;
  };

  // 💾 데이터베이스 API
  database: {
    saveSession: (session: Omit<TypingSession, 'id'>) => Promise<IpcResponse<TypingSession>>;
    getSessions: (options?: { limit?: number; offset?: number }) => Promise<IpcResponse<TypingSession[]>>;
    getStats: (dateRange?: { from: Date; to: Date }) => Promise<IpcResponse<DashboardStats>>;
  };

  // 🤖 AI API
  ai: {
    analyzeText: (text: string) => Promise<IpcResponse<{ suggestions: string[]; score: number }>>;
    generateSuggestions: (prompt: string) => Promise<IpcResponse<string[]>>;
    getUsageStats: () => Promise<IpcResponse<{ totalRequests: number; monthlyRequests: number }>>;
  };

  // 🔔 알림 API
  notifications: {
    show: (title: string, message: string) => Promise<IpcResponse<boolean>>;
    showTypingGoal: (progress: number) => Promise<IpcResponse<boolean>>;
  };

  // 🎨 테마 API
  theme: {
    get: () => Promise<IpcResponse<'light' | 'dark' | 'system'>>;
    set: (theme: 'light' | 'dark' | 'system') => Promise<IpcResponse<boolean>>;
  };
}

export interface KeyboardEvent {
  key: string;
  code: string;
  keychar: string;
  timestamp: number;
  windowTitle: string;
  type: 'keydown' | 'keyup';
}

export interface WindowInfo {
  title: string;
  processName: string;
  pid: number;
}

export interface TypingStats {
  totalKeystrokes: number;
  wpm: number;
  accuracy: number;
  sessionDuration: number;
  charactersTyped: number;
  wordsTyped: number;
  errorsCount: number;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'system';
  enableNotifications: boolean;
  enableSounds: boolean;
  autoStartMonitoring: boolean;
  privacyMode: boolean;
  notifications: boolean;
  autoStart: boolean;
  trackingEnabled: boolean;
}

export interface AppSettings {
  version: string;
  lastUpdated: Date;
  dataDirectory: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// 🔥 IPC 채널 상수
export const IPC_CHANNELS = {
  KEYBOARD: {
    START_MONITORING: 'keyboard:start-monitoring',
    STOP_MONITORING: 'keyboard:stop-monitoring',
    GET_STATUS: 'keyboard:get-status',
    EVENT: 'keyboard:event',
  },
  WINDOW: {
    GET_ACTIVE: 'window:get-active',
    GET_LIST: 'window:get-list',
  },
  DATABASE: {
    SAVE_SESSION: 'database:save-session',
    GET_SESSIONS: 'database:get-sessions',
    GET_STATS: 'database:get-stats',
  },
  SETTINGS: {
    GET: 'settings:get',
    SET: 'settings:set',
    RESET: 'settings:reset',
  },
  APP: {
    GET_VERSION: 'app:get-version',
    QUIT: 'app:quit',
    MINIMIZE: 'app:minimize',
    MAXIMIZE: 'app:maximize',
    IS_MAXIMIZED: 'app:is-maximized',
  },
} as const;

export type IpcChannels = typeof IPC_CHANNELS;

// 🔥 Health Check 관련 타입들
export enum HealthStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning', 
  ERROR = 'error'
}

export interface HealthCheckResult {
  status: HealthStatus;
  message: string;
  details: Record<string, unknown>;
  issues: string[];
  lastChecked: Date;
}

export interface SystemHealth {
  timestamp: Date;
  overallStatus: HealthStatus;
  system: HealthCheckResult;
  keyboard: HealthCheckResult;
  permissions: HealthCheckResult;
  storage: HealthCheckResult;
  uptime: number;
  version: string;
}

// 🔥 이 파일을 모듈로 만들기 위한 export
export {};
