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
  sessionId: string;
  startTime: number;
  endTime?: number;
  duration: number; // milliseconds
  
  // 기본 통계
  totalKeys: number;
  charactersTyped: number;
  wordsTyped: number;
  
  // 속도 통계
  wpm: number; // Words Per Minute
  cpm: number; // Characters Per Minute
  kps: number; // Keys Per Second
  
  // 정확도 통계
  accuracy: number; // 정확도 (%)
  errorCount: number;
  backspaceCount: number;
  
  // 리듬 통계
  averageKeyInterval: number; // 평균 키 간격 (ms)
  keyIntervalVariance: number; // 키 간격 분산
  burstTypingSegments: number; // 빠른 타이핑 구간 수
  pauseCount: number; // 일시정지 횟수 (500ms 이상)
  
  // 앱별 통계
  appName: string;
  windowTitle?: string;
  
  // 언어별 통계
  language: string;
  hangulCompositions?: number; // 한글 조합 횟수
  
  // 시간대별 분포
  hourlyDistribution: number[]; // 24시간 분포
  
  // 호환성을 위한 필드들
  totalTime?: number;     // duration과 동일
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

// 🔥 기가차드 추가: 데이터베이스 타입들
export interface TypingSession {
  id: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  keyCount: number;
  wpm: number;
  accuracy: number;
  errorCount: number;
  language: string;
  appName: string;
  windowTitle?: string;
  createdAt: Date;
  updatedAt: Date;
  content?: string;
  timestamp?: Date;
}

// #DEBUG: 세션 필터 타입 정의
export interface SessionFilter {
  startDate?: string;
  endDate?: string;
  appName?: string;
  minWpm?: number;
  minAccuracy?: number;
  limit?: number;
  offset?: number;
}

export interface AnalyticsData {
  sessionId: string;
  totalKeys: number;
  avgWpm: number;
  peakWpm: number;
  accuracy: number;
  errorRate: number;
  commonErrors: string[];
  improvementSuggestions: string[];
  dailyStats?: DailyStats[];
  weeklyTrend?: WeeklyTrend[];
}

export interface DailyStats {
  date: string;
  totalKeys: number;
  wpm: number;
  accuracy: number;
  duration: number;
}

export interface WeeklyTrend {
  week: string;
  avgWpm: number;
  totalSessions: number;
  totalDuration: number;
}

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
  accessibility: boolean | null;
  inputMonitoring: boolean | null;
  screenRecording: boolean | null;
  fullDiskAccess?: boolean | null;
}

// IPC 핸들러 함수 타입
export type IpcHandlerFunction<T = any, R = any> = (
  event: Electron.IpcMainInvokeEvent,
  ...args: T[]
) => Promise<R> | R;

export interface TypedIpcHandler {
  [channel: string]: IpcHandlerFunction<any, any>;
}

import { ComponentType } from 'react';

// 통계 및 차트 데이터 타입
export interface StatisticsData {
  id?: string;
  value: number | string;
  label: string;
  unit?: string;
  icon?: ComponentType<{ className?: string }>;
  color?: string;
  change?: string;
  percentage?: number;
}

export interface WeeklyChartData {
  day: string;
  sessions: number;
  wpm: number;
  accuracy: number;
  value?: number;
  label?: string;
}

export interface ProjectData {
  name: string;
  sessions: number;
  time: number;
  wpm: number;
  value?: number;
  label?: string;
  color?: string;
}

export interface ActivityPattern {
  hour: number;
  activity: number;
  sessions: number;
  time?: string;
  percentage?: number;
  color?: string;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  type: 'wpm' | 'accuracy' | 'time' | 'sessions';
  deadline?: string;
  goal?: string;
  achieved?: boolean;
}

export interface Genre {
  name: string;
  count: number;
  averageWpm: number;
  genre?: string;
  color?: string;
  percentage?: number;
}

// 데이터베이스 세션 데이터 타입
export interface DatabaseSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  totalKeys: number;
  totalWords: number;
  totalChars: number;
  wpm: number;
  cpm?: number;
  accuracy: number;
  appName: string;
  windowTitle?: string;
  platform: string;
}

// 에러 핸들링 타입
export interface ErrorContext {
  component?: string;
  function?: string;
  userId?: string;
  sessionId?: string;
  timestamp: number;
}

export interface ErrorMetadata {
  stack?: string;
  userAgent?: string;
  url?: string;
  promise?: unknown;
  exitCode?: number;
  additionalInfo?: Record<string, unknown>;
}

// 디버그 정보 타입
export interface DebugInfo {
  platform: string;
  arch: string;
  nodeVersion: string;
  electronVersion?: string;
  engineStatus: AppStatus;
  permissionStatus: PermissionStatus;
  sessionStats: TypingStats | null;
  realtimeStats: RealtimeStats;
  hangulState: HangulComposerState;
  timestamp?: number;
  // 선택적 필드들
  sessionId?: string;
  isActive?: boolean;
  startTime?: number;
  currentApp?: AppInfo;
  stats?: SessionStats;
  config?: KeyboardConfig;
  queueSize?: number;
  permissions?: PermissionStatus;
  memory?: Record<string, unknown>;
  performance?: Record<string, unknown>;
  version?: string;
}

// Realtime 통계 인터페이스
export interface RealtimeStats {
  currentWPM: number;
  currentCPM: number;
  recentKeyInterval: number;
  consecutiveKeys: number;
  lastBurstStart?: number;
  isInBurst: boolean;
  recentAccuracy: number;
}

// 한글 조합기 상태 인터페이스
export interface HangulComposerState {
  cho: string;          // 초성
  jung: string;         // 중성
  jong: string;         // 종성
  result: string;       // 조합 결과
  isComposing: boolean; // 조합 중인지 여부
  buffer: string;       // 조합 버퍼
}

// 유틸리티 함수 타입
export interface ClassNameValue {
  [key: string]: unknown;
}

// BenchmarkMetrics 타입 정의
export interface BenchmarkMetrics {
  duration: number;
  memoryBefore: number;
  memoryAfter: number;
  memorySaved: number;
}
