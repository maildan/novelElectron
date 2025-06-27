// 🔥 기가차드 공유 타입 정의

// 🔥 Result 타입 - 함수 결과 래핑
export interface Result<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: string;
}

export interface TypingSession {
  id: string;
  content: string;
  startTime: Date;
  endTime: Date;
  keyCount: number;
  wpm: number;
  accuracy: number;
  language: string;
  windowTitle: string;
  errors?: number;
}

export interface IpcResponse<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: string;
  timestamp: Date;
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
