// 🔥 기가차드 Settings 기본값 정의 - 모든 설정의 기본값!

import { SettingsSchema } from './types';

/**
 * 🎯 완벽한 기본 설정값들
 */
export const DEFAULT_SETTINGS: SettingsSchema = {
  // 🏠 앱 전반 설정
  app: {
    theme: 'system',
    language: 'ko',
    autoStart: false,
    minimizeToTray: true,
    
    windowBounds: {
      width: 1200,
      height: 800,
      x: undefined,
      y: undefined
    },
    alwaysOnTop: false,
    
    devMode: false,
    enableLogging: true,
    logLevel: 'info'
  },

  // ⌨️ 키보드 설정
  keyboard: {
    enabled: true,
    language: 'korean',
    enableIme: true,
    enableGlobalShortcuts: true,
    enableAppDetection: true,
    autoSaveInterval: 30, // 30초
    debugMode: false,
    autoStartMonitoring: false,
    sessionTimeout: 15, // 15분
    enableBatchProcessing: true,
    batchSize: 100,
    debounceDelay: 10, // 10ms
    enableHealthCheck: true,
    
    // 글로벌 단축키
    globalShortcuts: {
      startStop: 'CommandOrControl+Shift+T',
      pause: 'CommandOrControl+Shift+P',
      showStats: 'CommandOrControl+Shift+S'
    },
    
    // 앱 필터링
    ignoreApps: [
      'System Preferences',
      'Activity Monitor',
      'Console',
      'Keychain Access'
    ],
    focusOnlyApps: [],
    
    // 성능 설정
    eventBufferSize: 1000,
    processingDelay: 5 // 5ms
  },

  // 🎨 UI/테마 설정
  ui: {
    colorScheme: 'blue',
    accentColor: '#3b82f6',
    
    sidebarPosition: 'left',
    compactMode: false,
    showStatusBar: true,
    
    enableAnimations: true,
    animationSpeed: 'normal',
    
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: 14,
    fontWeight: 'normal'
  },

  // 📊 분석/통계 설정
  analytics: {
    targetWPM: 60,
    targetAccuracy: 95,
    dailyGoal: 120, // 2시간

    trackingPeriod: 'daily',
    excludeShortSessions: true,
    minSessionDuration: 30, // 30초

    enableAdvancedAnalytics: false,
    trackAppUsage: true,
    trackTimePatterns: true
  },

  // 🛡️ 보안/권한 설정
  security: {
    enableAccessibilityPermission: false,
    enableInputMonitoring: false,
    
    encryptLocalData: false,
    anonymizeData: true,
    
    allowTelemetry: false,
    allowUpdates: true,
    allowExternalLinks: false
  },

  // 🔔 알림 설정
  notifications: {
    enableNotifications: true,
    enableSounds: false,
    
    notifyGoalAchieved: true,
    notifyDailyGoal: true,
    notifyWeeklyGoal: true,
    
    notifyNewRecord: true,
    notifyMilestone: true,
    
    notifyErrors: true,
    notifyUpdates: true
  },

  // 메타데이터
  version: '1.0.0',
  lastModified: new Date(),
  userId: undefined
};

/**
 * 🔥 설정 카테고리별 기본값 추출 헬퍼
 */
export const getDefaultSettings = {
  app: () => DEFAULT_SETTINGS.app,
  keyboard: () => DEFAULT_SETTINGS.keyboard,
  ui: () => DEFAULT_SETTINGS.ui,
  analytics: () => DEFAULT_SETTINGS.analytics,
  security: () => DEFAULT_SETTINGS.security,
  notifications: () => DEFAULT_SETTINGS.notifications,
  all: () => DEFAULT_SETTINGS
};

/**
 * 🎯 설정 유효성 검사 스키마
 */
export const SETTINGS_CONSTRAINTS = {
  app: {
    theme: ['light', 'dark', 'system'],
    language: ['ko', 'en', 'ja', 'zh'],
    logLevel: ['debug', 'info', 'warn', 'error'],
    windowBounds: {
      width: { min: 800, max: 3840 },
      height: { min: 600, max: 2160 }
    }
  },
  
  keyboard: {
    language: ['korean', 'japanese', 'chinese', 'english'],
    autoSaveInterval: { min: 10, max: 300 },
    sessionTimeout: { min: 5, max: 120 },
    batchSize: { min: 10, max: 1000 },
    debounceDelay: { min: 1, max: 100 },
    eventBufferSize: { min: 100, max: 10000 },
    processingDelay: { min: 1, max: 50 }
  },
  
  ui: {
    colorScheme: ['blue', 'green', 'purple', 'orange'],
    sidebarPosition: ['left', 'right'],
    animationSpeed: ['slow', 'normal', 'fast'],
    fontWeight: ['normal', 'medium', 'bold'],
    fontSize: { min: 10, max: 24 }
  },
  
  analytics: {
    targetWPM: { min: 10, max: 200 },
    targetAccuracy: { min: 50, max: 100 },
    dailyGoal: { min: 10, max: 480 }, // 최대 8시간
    trackingPeriod: ['session', 'daily', 'weekly', 'monthly'],
    minSessionDuration: { min: 5, max: 300 }
  }
} as const;
