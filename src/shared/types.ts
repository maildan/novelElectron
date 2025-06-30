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
    // 🔥 새로운 다국어 지원 메서드들
    detectLanguage: (keycode: number) => Promise<IpcResponse<string>>;
    getSupportedLanguages: () => Promise<IpcResponse<string[]>>;
    setInputMethod: (method: 'direct' | 'composition') => Promise<IpcResponse<boolean>>;
    resetComposition: () => Promise<IpcResponse<boolean>>;
    getCompositionState: () => Promise<IpcResponse<{ isComposing: boolean; composingText: string }>>;
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

// 🔥 기가차드 키보드 이벤트 인터페이스 (최종 통합 버전)
export interface KeyboardEvent {
  readonly key: string;
  readonly code: string; // 🔥 KeyboardEvent.code 표준 속성 추가
  readonly keycode: number; // 🔥 uIOhook keycode
  readonly keychar: string;
  readonly timestamp: number;
  readonly windowTitle: string;
  readonly type: 'keydown' | 'keyup' | 'input' | 'completed' | 'composing'; // 🔥 한글 조합 타입 추가
}

// 🔥 기가차드 처리된 키보드 이벤트 (keyboardService 처리 후)
export interface ProcessedKeyboardEvent {
  readonly key: string;
  readonly code: string; // 🔥 Key${keycode} 형태
  readonly keycode: number; // 🔥 uIOhook keycode 추가
  readonly keychar: string;
  readonly timestamp: number;
  readonly windowTitle: string;
  readonly type: 'keydown' | 'keyup' | 'input';
  readonly language: string; // 🔥 감지된 언어
  readonly composedChar?: string; // 🔥 조합된 문자 (한글 등)
  readonly isComposing: boolean; // 🔥 조합 중 여부
  readonly inputMethod: string; // 🔥 입력 방식
  readonly processingTime: number; // 🔥 처리 시간 (ms)
}

// 🔥 기가차드 Uiohook 키보드 이벤트 타입 (native layer) - uiohook-napi 1.5.4 호환
export interface UiohookKeyboardEvent {
  type?: number;  // EventType.EVENT_KEY_PRESSED | EventType.EVENT_KEY_RELEASED
  time?: number;  // timestamp
  keycode: number;
  keychar?: number;
  rawcode?: number;  // macOS 물리적 키코드
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
}

// 🔥 기가차드 언어 감지 결과 인터페이스
export interface LanguageDetectionResult {
  language: 'ko' | 'en' | 'ja' | 'zh';
  confidence: number; // 0.0 ~ 1.0
  method: 'fallback' | 'keycode' | 'character' | 'ime' | 'pattern' | 'switch' | 'validation' | 'special-char-mapping' | 'system' | 'macos-maintain-current' | 'macos-error-fallback' | 'windows-layout' | 'linux-input-method';
  isComposing: boolean;
  detectedChar?: string;
  metadata?: {
    keySequence?: string[];
    switchReason?: string;
    hangulChar?: string;
    detectionTime?: number;
    keycode?: number;
    keychar?: number;
    reason?: string;
    // 🔥 통합 감지기 메타데이터
    usedFallback?: boolean;
    primaryConfidence?: number;
    fallbackConfidence?: number;
    primaryError?: string;
    error?: string;
    // 🔥 macOS 전용 메타데이터
    char?: string;
    charCode?: number;
    rawcode?: number;
    source?: string;
    processingTime?: string;
    hangulKeyCount?: number;
    totalKeys?: number;
    hangulRatio?: number;
    unifiedDetector?: {
      platform: string;
      detectorType: string;
      processingTime: string;
      detectionCount: number;
      fallbackCount: number;
    };
  };
}

// 🔥 기가차드 한글 조합 결과
export interface HangulCompositionResult {
  completed: string; // 완성된 한글 (예: "가")
  composing: string; // 조합 중인 한글 (예: "ㄱ")
}

// 🔥 기가차드 키보드 상태
export interface KeyboardState {
  isActive: boolean;
  language: string; // 🔥 더 유연한 string 타입
  inputMethod: string; // 🔥 더 유연한 string 타입
  startTime?: Date;
  totalEvents: number;
  eventsPerSecond?: number; // 🔥 선택적 속성 추가
}

// 🔥 기가차드 키보드 모니터링 상태 (하위 호환성)
export interface KeyboardMonitorState {
  isActive: boolean;
  language: string;
  inputMethod: string;
  eventsPerSecond: number;
  totalEvents: number;
  startTime: Date | null;
}

// 🔥 기가차드 윈도우 정보 통합 타입 (모든 기능 포함)
export interface WindowInfo {
  // 🔥 기본 정보 (모든 플랫폼 공통)
  id: number;
  title: string;
  
  // 🔥 프로세스 정보
  owner: {
    name: string;          // processName 역할
    processId: number;     // pid 역할
    bundleId?: string;     // macOS용
    path?: string;         // 실행파일 경로
  };
  
  // 🔥 윈도우 위치/크기 정보
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  
  // 🔥 시스템 정보
  memoryUsage: number;
  
  // 🔥 Loop 전용 확장 필드 (기존 호환성 유지)
  loopTimestamp?: number;
  loopAppCategory?: AppCategory;
  loopSessionId?: string;
  loopTypingStats?: {
    wpm: number;
    accuracy: number;
    keystrokeCount: number;
    sessionDuration: number;
  };
}

// 🔥 간단한 윈도우 정보 (하위 호환성)
export interface SimpleWindowInfo {
  title: string;
  processName: string;
  pid: number;
}

// 🔥 앱 카테고리 타입 (appCategories.ts와 동일하게 유지)
export type AppCategory = 
  | 'ai-assistant'
  | 'browser'
  | 'cloud-storage'
  | 'communication'
  | 'design'
  | 'development'
  | 'e-commerce'
  | 'entertainment'
  | 'file-management'
  | 'finance'
  | 'marketing'
  | 'media-production'
  | 'office'
  | 'productivity'
  | 'project-management'
  | 'security'
  | 'system'
  | 'unknown';

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
