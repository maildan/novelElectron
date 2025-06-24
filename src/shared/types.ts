// 공유 타입 정의 - Main/Preload/Renderer 모든 프로세스에서 사용
// 🔥 IPC 통신용 간단한 타입들 (내부 분석용이 아닌 프로세스 간 전송용)

// 키보드 이벤트 (DOM KeyboardEvent와 충돌 방지를 위해 커스텀 네이밍)
export interface LoopKeyboardEvent {
  keycode: number
  type: 'keydown' | 'keyup'
  timestamp: number
}

// 한글 자모 쌍 타입 정의
export type JamoPair = [normal: string, shift?: string];

// IPC용 간단한 타이핑 통계 (UI 표시용)
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
  
  // 프로젝트 관련
  PROJECT_GET_ALL: 'project:get-all',
  PROJECT_GET_ACTIVE: 'project:get-active',
  PROJECT_CREATE: 'project:create',
  PROJECT_UPDATE: 'project:update',
  PROJECT_DELETE: 'project:delete',
  
  // 파일 관련
  FILE_GET_RECENT: 'file:get-recent',
  FILE_GET_BY_PROJECT: 'file:get-by-project',
  FILE_TRACK: 'file:track',
  
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

// 프로젝트 및 파일 관련 타입
export interface ProjectData {
  id: string;
  title: string;
  progress: number;
  status: string;
  deadline: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecentFile {
  id: string;
  name: string;
  project: string;
  time: string;
  status: string;
  path?: string;
  size?: number;
  lastModified: Date;
}
