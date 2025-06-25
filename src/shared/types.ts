// 공유 타입 정의 - Main/Preload/Renderer 모든 프로세스에서 사용

// 키보드 이벤트 (DOM KeyboardEvent와 충돌 방지를 위해 커스텀 네이밍)
export interface LoopKeyboardEvent {
  keycode: number
  key: string
  type: 'keydown' | 'keyup'
  timestamp: number
  char?: string
  appName?: string
  windowTitle?: string
  modifiers?: {
    shift?: boolean;
    ctrl?: boolean;
    alt?: boolean;
    meta?: boolean;
  };
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
  name: string;
  title: string;
  id: number;
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

// IPC 응답 래퍼
export interface IpcResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

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

// 프로젝트 관련 타입들
export interface ProjectData {
  id: string;
  name?: string;         // optional로 변경
  title?: string;        // title 속성 추가
  description?: string;
  progress?: number;     // 진행률 (0-100)
  status?: string;       // 상태 (진행중, 완료 등)
  deadline?: string;     // 마감일
  createdAt: Date;
  updatedAt: Date;
  totalSessions?: number;
  totalTypingTime?: number;
  averageWpm?: number;
}

export interface RecentFile {
  id: string;
  name: string;
  path: string;
  type: string;
  project?: string;      // 프로젝트명
  time?: string;         // 상대적 시간 (예: "2분 전")
  status?: string;       // 파일 상태 (예: "수정됨")
  lastModified: Date;
  size?: number;
}
