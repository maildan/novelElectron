// 🔥 기가차드 Settings 타입 정의 - 완전 타입 안전!

/**
 * 🔥 기본 키보드 설정 인터페이스
 */
interface BaseKeyboardConfig {
  enabled: boolean;
  language: 'korean' | 'japanese' | 'chinese' | 'english';
  enableIme: boolean;
  enableGlobalShortcuts: boolean;
  enableAppDetection: boolean;
  autoSaveInterval: number;
  debugMode: boolean;
  autoStartMonitoring?: boolean;
  sessionTimeout?: number; // minutes
  enableBatchProcessing?: boolean;
  batchSize?: number;
  debounceDelay?: number;
  enableHealthCheck?: boolean;
}

/**
 * 🎯 앱 전반 설정
 */
export interface AppSettingsSchema {
  // 기본 설정
  theme: 'light' | 'dark' | 'system';
  language: 'ko' | 'en' | 'ja' | 'zh';
  autoStart: boolean;
  minimizeToTray: boolean;
  
  // 윈도우 설정
  windowBounds: {
    width: number;
    height: number;
    x?: number;
    y?: number;
  };
  alwaysOnTop: boolean;
  
  // 개발 설정
  devMode: boolean;
  enableLogging: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * ⌨️ 키보드 관련 설정
 */
export interface KeyboardSettingsSchema extends BaseKeyboardConfig {
  // 추가 키보드 설정
  globalShortcuts: {
    startStop: string;
    pause: string;
    showStats: string;
  };
  
  // 감지 설정
  ignoreApps: string[];
  focusOnlyApps: string[];
  
  // 성능 설정
  eventBufferSize: number;
  processingDelay: number;
}

/**
 * 🎨 UI/테마 설정
 */
export interface UISettingsSchema {
  // 테마
  colorScheme: 'blue' | 'green' | 'purple' | 'orange';
  accentColor: string;
  
  // 레이아웃
  sidebarPosition: 'left' | 'right';
  compactMode: boolean;
  showStatusBar: boolean;
  
  // 애니메이션
  enableAnimations: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  
  // 글꼴
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'medium' | 'bold';
}

/**
 * 📊 분석/통계 설정
 */
export interface AnalyticsSettingsSchema {
  // 목표 설정
  targetWPM: number;
  targetAccuracy: number;
  dailyGoal: number; // 분 단위
  
  // 통계 설정
  trackingPeriod: 'session' | 'daily' | 'weekly' | 'monthly';
  excludeShortSessions: boolean;
  minSessionDuration: number; // 초 단위
  
  // 분석 옵션
  enableAdvancedAnalytics: boolean;
  trackAppUsage: boolean;
  trackTimePatterns: boolean;
}

/**
 * 🛡️ 보안/권한 설정
 */
export interface SecuritySettingsSchema {
  // 권한
  enableAccessibilityPermission: boolean;
  enableInputMonitoring: boolean;
  
  // 데이터 보호
  encryptLocalData: boolean;
  anonymizeData: boolean;
  
  // 네트워크
  allowTelemetry: boolean;
  allowUpdates: boolean;
  allowExternalLinks: boolean;
}

/**
 * 🔔 알림 설정
 */
export interface NotificationSettingsSchema {
  // 알림 활성화
  enableNotifications: boolean;
  enableSounds: boolean;
  
  // 목표 달성 알림
  notifyGoalAchieved: boolean;
  notifyDailyGoal: boolean;
  notifyWeeklyGoal: boolean;
  
  // 성과 알림
  notifyNewRecord: boolean;
  notifyMilestone: boolean;
  
  // 시스템 알림
  notifyErrors: boolean;
  notifyUpdates: boolean;
}

/**
 * 🔥 통합 Settings 스키마
 */
export interface SettingsSchema {
  app: AppSettingsSchema;
  keyboard: KeyboardSettingsSchema;
  ui: UISettingsSchema;
  analytics: AnalyticsSettingsSchema;
  security: SecuritySettingsSchema;
  notifications: NotificationSettingsSchema;
  
  // 메타데이터
  version: string;
  lastModified: Date;
  userId?: string;
}

/**
 * 🎯 Settings 결과 타입
 */
export interface SettingsResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 🔄 Settings 변경 이벤트
 */
export interface SettingsChangeEvent<T = unknown> {
  key: string;
  oldValue: T;
  newValue: T;
  timestamp: Date;
}

/**
 * 💾 Settings 저장소 인터페이스
 */
export interface SettingsStorage {
  load(): Promise<Partial<SettingsSchema>>;
  save(settings: Partial<SettingsSchema>): Promise<void>;
  get<K extends keyof SettingsSchema>(key: K): Promise<SettingsSchema[K] | undefined>;
  set<K extends keyof SettingsSchema>(key: K, value: SettingsSchema[K]): Promise<void>;
  delete(key: keyof SettingsSchema): Promise<void>;
  clear(): Promise<void>;
  backup(): Promise<string>;
  restore(backupData: string): Promise<void>;
}
