// 공유 타입 정의 - Main/Preload/Renderer 모든 프로세스에서 사용

// 키보드 이벤트 (DOM KeyboardEvent와 충돌 방지를 위해 커스텀 네이밍)
export interface LoopKeyboardEvent {
  keycode: number
  type: 'keydown' | 'keyup'
  timestamp: number
  key?: string           // 키 이름 (예: 'a', 'Enter', 'Shift')
  char?: string          // 실제 문자 (한글 조합 등)
  appName?: string       // 현재 활성화된 앱 이름
  modifiers?: {          // 수정키 상태
    shift: boolean
    ctrl: boolean
    alt: boolean
    meta: boolean
  }
}

// 키보드 설정 타입
export interface KeyboardConfig {
  enabled: boolean
  language: 'korean' | 'japanese' | 'chinese' | 'english'
  enableIme: boolean
  enableGlobalShortcuts: boolean
  enableAppDetection: boolean
  autoSaveInterval: number
  debugMode: boolean
  autoStartMonitoring?: boolean
  sessionTimeout?: number // minutes
  enableBatchProcessing?: boolean
  batchSize?: number
  debounceDelay?: number
  enableHealthCheck?: boolean
}

// 세션 통계 타입 - 완전한 통합 버전
export interface SessionStats {
  sessionId: string
  startTime: number
  endTime?: number
  lastActivity?: number
  duration?: number
  activeTime?: number
  totalKeys: number
  keyCount?: number        // totalKeys와 동일한 의미, 호환성 유지
  keystrokes?: number      // 키스트로크 카운트
  charactersTyped?: number // 타이핑된 문자 수
  characters?: number      // charactersTyped와 동일한 의미
  wordsTyped?: number
  wpm: number
  cpm?: number
  accuracy: number
  errorCount?: number
  hangulCount?: number     // 한글 문자 카운트
  appName: string
  windowTitle?: string
  language?: string
  applications?: Set<string> // 세션 중 사용된 앱들
}

// 앱 상태 타입
export interface AppStatus {
  isInitialized: boolean
  isListening: boolean
  currentSession?: SessionStats | null  // null도 허용
  currentApp?: AppInfo | null          // null도 허용
  queueSize?: number
  totalEvents?: number
  health: {
    isHealthy: boolean
    lastCheck: number
  }
}

// IPC 에러 타입
export interface IpcError {
  code: string
  message: string
  details?: Record<string, unknown>
  timestamp: number
}

// IPC 응답 타입
export interface IpcResponse<T = unknown> {
  success: boolean
  data?: T
  error?: IpcError
}

// 한글 자모 쌍 타입 정의
export type JamoPair = [normal: string, shift?: string];

export interface TypingStats {
  wpm: number;           // Words Per Minute
  accuracy: number;      // 정확도 (0-100)
  totalKeys: number;     // 총 키 입력 수
  totalTime: number;     // 총 시간 (밀리초)
}

export interface AppInfo {
  name?: string;        // 호환성을 위해 optional
  appName?: string;     // AppDetector에서 사용하는 필드명
  title?: string;       // 호환성을 위해 optional  
  windowTitle?: string; // AppDetector에서 사용하는 필드명
  id?: number;
  memoryUsage?: number;
}

export interface SystemInfo {
  platform: string;
  arch: string;
  version: string;
  totalMemory: number;
  freeMemory: number;
  cpuModel: string;
  cpuCores: number;
}

export interface DatabaseConfig {
  path: string;
  maxConnections?: number;
  timeout?: number;
}

// IPC 채널 상수
export const IPC_CHANNELS = {
  // 키보드 관련
  KEYBOARD_START: 'keyboard:start',
  KEYBOARD_STOP: 'keyboard:stop',
  KEYBOARD_EVENT: 'keyboard:event',
  KEYBOARD_STATUS: 'keyboard:status',
  
  // 앱 관련
  APP_GET_ACTIVE: 'app:get-active',
  APP_GET_INFO: 'app:get-info',
  
  // 시스템 관련
  SYSTEM_GET_INFO: 'system:get-info',
  SYSTEM_GET_METRICS: 'system:get-metrics',
  
  // 데이터베이스 관련
  DB_SAVE_SESSION: 'db:save-session',
  DB_GET_SESSIONS: 'db:get-sessions',
  DB_GET_STATS: 'db:get-stats',
  
  // 설정 관련
  SETTINGS_GET: 'settings:get',
  SETTINGS_SET: 'settings:set',
} as const;

export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];

// UI Component Types for Gigachad Componentization
export interface Log {
  id: string;
  content: string;
  keyCount: number;
  typingTime: number;
  timestamp: string;
  totalChars?: number;
}

export type ActiveTab = 'dashboard' | 'statistics' | 'projects' | 'ai' | 'settings';

export interface CommonComponentProps {
  logs: Log[];
  loading: boolean;
  onTypingComplete: (record: Omit<Log, 'id'>) => void;
  typingStats?: TypingStats | null;
  isMonitoring?: boolean;
  startMonitoring?: () => Promise<void>;
  stopMonitoring?: () => Promise<void>;
}

export interface NavItem {
  id: ActiveTab;
  label: string;
  icon?: string;
}

export interface TypingRecord {
  id: string;
  content: string;
  keyCount: number;
  typingTime: number;
  wpm: number;
  accuracy: number;
  timestamp: string;
  language: string;
}

// 설정 타입
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  autoStart: boolean;
  minimizeToTray: boolean;
  notifications: boolean;
  keyboardMonitoring: boolean;
  dataRetentionDays: number;
  // 언어 관련 설정
  defaultLanguage: 'korean' | 'english' | 'japanese' | 'chinese';
  keyboardLayout: string;
}

// IPC 핸들러 타입 (any 타입 제거용)
export interface KeyboardEngine {
  startMonitoring(): Promise<boolean>;
  stopMonitoring(): Promise<boolean>;
  toggleMonitoring(): Promise<boolean>;
  getMonitoringStatus(): AppStatus;
  getSessionStats(): SessionStats | null;
  getPermissionStatus(): PermissionStatus;
  updateConfig(config: Partial<KeyboardConfig>): Promise<boolean>;
  getConfig(): KeyboardConfig;
  openPermissionSettings(): Promise<void>;
  checkSystemPermissions(): Promise<PermissionStatus>;
  startNewSession(): Promise<string>;
  endCurrentSession(): Promise<SessionStats | null>;
  getHangulState(): HangulState;
  finishHangulComposition(): string;
  getHealthAlerts(): HealthAlert[];
  getPerformanceMetrics(): PerformanceMetrics;
}

export interface HealthAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: number;
  resolved: boolean;
}

export interface PerformanceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  eventProcessingTime: number;
  queueSize: number;
  errorsPerMinute: number;
}

export interface HangulState {
  isComposing: boolean;
  currentComposition: string;
  finalizedText: string;
}

export interface PermissionStatus {
  accessibility: boolean;
  screenRecording: boolean;
  all: boolean;
}

// IPC 핸들러 함수 타입
export type IpcHandlerFunction<T = any, R = any> = (
  event: Electron.IpcMainInvokeEvent,
  ...args: T[]
) => Promise<R> | R;

export interface TypedIpcHandler {
  [channel: string]: IpcHandlerFunction<any, any>;
}
