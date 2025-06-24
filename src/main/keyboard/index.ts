/**
 * 🔥 기가차드 키보드 시스템 - 메인 인덱스
 * Advanced Keyboard System Main Index
 * 
 * 모든 키보드 관련 모듈을 통합하여 외부에서 쉽게 사용할 수 있도록 제공
 */

// Core Engine
export { KeyboardEngine, keyboardEngine } from './KeyboardEngine';
export type { 
  KeyboardConfig, 
  KeyEvent, 
  SessionStats, 
  PermissionStatus, 
  MonitoringState, 
  HangulComposerState 
} from './KeyboardEngine';

// Hangul Composer
export { HangulComposer, hangulComposer } from './HangulComposer';
export { 
  HANGUL_CONSTANTS, 
  COMPLEX_JAMO_MAP, 
  KEYBOARD_JAMO_MAP 
} from './HangulComposer';
export type { CompositionResult } from './HangulComposer';

// Permission Manager
export { KeyboardPermissionManager, keyboardPermissionManager } from './PermissionManager';
export type { PermissionCheckResult } from './PermissionManager';

// Statistics Manager
export { KeyboardStatsManager, keyboardStatsManager } from './StatsManager';
export type { 
  TypingStats, 
  RealtimeStats, 
  GlobalStats, 
  KeyFrequency, 
  TypingPattern 
} from './StatsManager';

// Unified Handler
export { UnifiedKeyboardHandler, unifiedKeyboardHandler } from './UnifiedHandler';
export type { KeyboardSystemStatus } from './UnifiedHandler';

// Import the instances for internal use
import { keyboardEngine } from './KeyboardEngine';
import { keyboardPermissionManager } from './PermissionManager';
import { keyboardStatsManager } from './StatsManager';
import { hangulComposer } from './HangulComposer';
import { unifiedKeyboardHandler } from './UnifiedHandler';
import type { KeyboardConfig } from './KeyboardEngine';
import type { KeyboardSystemStatus } from './UnifiedHandler';

/**
 * 키보드 시스템 초기화 함수
 * 모든 키보드 모듈을 한 번에 초기화
 */
export async function initializeKeyboardSystem(
  mainWindow: import('electron').BrowserWindow,
  config?: Partial<KeyboardConfig>
): Promise<boolean> {
  try {
    console.log('🚀 기가차드 키보드 시스템 초기화 시작...');
    
    // 통합 핸들러 초기화 (내부적으로 모든 모듈 초기화)
    await unifiedKeyboardHandler.initialize(mainWindow);
    
    // 설정이 제공된 경우 적용
    if (config) {
      await keyboardEngine.updateConfig(config);
    }
    
    console.log('✅ 기가차드 키보드 시스템 초기화 완료');
    return true;
  } catch (error) {
    console.error('❌ 키보드 시스템 초기화 실패:', error);
    return false;
  }
}

/**
 * 키보드 시스템 정리 함수
 * 모든 키보드 모듈을 정리하고 리소스 해제
 */
export async function cleanupKeyboardSystem(): Promise<void> {
  try {
    console.log('🧹 기가차드 키보드 시스템 정리 시작...');
    
    // 통합 핸들러 정리 (내부적으로 모든 모듈 정리)
    await unifiedKeyboardHandler.cleanup();
    
    console.log('✅ 기가차드 키보드 시스템 정리 완료');
  } catch (error) {
    console.error('❌ 키보드 시스템 정리 실패:', error);
  }
}

/**
 * 키보드 시스템 상태 확인
 */
export async function getKeyboardSystemHealth(): Promise<{
  healthy: boolean;
  issues: string[];
  details: KeyboardSystemStatus;
}> {
  try {
    const status = await unifiedKeyboardHandler['getSystemStatus']();
    const issues: string[] = [];
    
    if (!status.engine.initialized) {
      issues.push('키보드 엔진이 초기화되지 않음');
    }
    
    if (!status.permissions.hasAllPermissions) {
      issues.push(`권한 부족: ${status.permissions.missingPermissions.join(', ')}`);
    }
    
    const healthy = issues.length === 0;
    
    return {
      healthy,
      issues,
      details: status
    };
  } catch (error) {
    return {
      healthy: false,
      issues: [`시스템 상태 확인 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`],
      details: {} as KeyboardSystemStatus
    };
  }
}

/**
 * 기본 설정 상수
 */
export const DEFAULT_KEYBOARD_CONFIG: KeyboardConfig = {
  language: 'korean',
  enableIME: true,
  enableGlobalShortcuts: true,
  enableAppDetection: true,
  autoStartMonitoring: false,
  sessionTimeout: 30,
  debugMode: process.env.NODE_ENV === 'development'
};

/**
 * 키보드 시스템 버전 정보
 */
export const KEYBOARD_SYSTEM_VERSION = {
  major: 2,
  minor: 0,
  patch: 0,
  codename: 'GigaChad',
  description: 'Advanced Keyboard Monitoring System with IME Support'
};

/**
 * 지원 언어 목록
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'korean', name: '한국어', native: '한국어' },
  { code: 'japanese', name: 'Japanese', native: '日本語' },
  { code: 'chinese', name: 'Chinese', native: '中文' },
  { code: 'english', name: 'English', native: 'English' }
] as const;

/**
 * 키보드 이벤트 타입 상수
 */
export const KEYBOARD_EVENT_TYPES = {
  KEY_DOWN: 'keydown',
  KEY_UP: 'keyup',
  COMPOSITION_START: 'composition-start',
  COMPOSITION_UPDATE: 'composition-update',
  COMPOSITION_END: 'composition-end'
} as const;

/**
 * IPC 채널 상수
 */
export const KEYBOARD_IPC_CHANNELS = {
  // 모니터링 제어
  START_MONITORING: 'keyboard:start-monitoring',
  STOP_MONITORING: 'keyboard:stop-monitoring',
  TOGGLE_MONITORING: 'keyboard:toggle-monitoring',
  
  // 상태 조회
  GET_STATUS: 'keyboard:get-status',
  GET_CONFIG: 'keyboard:get-config',
  
  // 권한 관리
  CHECK_PERMISSIONS: 'keyboard:check-permissions',
  REQUEST_PERMISSIONS: 'keyboard:request-permissions',
  
  // 세션 관리
  START_SESSION: 'keyboard:start-session',
  END_SESSION: 'keyboard:end-session',
  GET_SESSION_STATS: 'keyboard:get-session-stats',
  
  // 한글 조합
  PROCESS_HANGUL_KEY: 'keyboard:process-hangul-key',
  GET_HANGUL_STATE: 'keyboard:get-hangul-state',
  
  // 이벤트 채널
  KEY_EVENT: 'keyboard:key-event',
  MONITORING_STARTED: 'keyboard:monitoring-started',
  MONITORING_STOPPED: 'keyboard:monitoring-stopped',
  SESSION_STARTED: 'keyboard:session-started',
  SESSION_ENDED: 'keyboard:session-ended',
  HANGUL_COMPOSED: 'keyboard:hangul-composed',
  APP_CHANGED: 'keyboard:app-changed',
  PERMISSIONS_UPDATED: 'keyboard:permissions-updated',
  STATS_UPDATED: 'keyboard:stats-updated',
  ERROR: 'keyboard:error'
} as const;

/**
 * 유틸리티 함수들
 */
export const KeyboardUtils = {
  /**
   * 키코드를 키 이름으로 변환
   */
  getKeyName(keycode: number): string {
    // uIOhook 키코드 매핑
    const keyMap: Record<number, string> = {
      57: 'Space',
      28: 'Enter',
      15: 'Tab',
      14: 'Backspace',
      1: 'Escape',
      42: 'Shift',
      29: 'Ctrl',
      56: 'Alt'
      // 더 많은 매핑 추가 가능
    };
    
    return keyMap[keycode] || `Key${keycode}`;
  },

  /**
   * 문자가 한글인지 확인
   */
  isHangul(char: string): boolean {
    if (!char || char.length !== 1) return false;
    const code = char.charCodeAt(0);
    return (code >= 0xAC00 && code <= 0xD7AF) || // 한글 음절
           (code >= 0x1100 && code <= 0x11FF) || // 한글 자모
           (code >= 0x3130 && code <= 0x318F);   // 한글 호환 자모
  },

  /**
   * WPM 계산
   */
  calculateWPM(charactersTyped: number, timeInMinutes: number): number {
    if (timeInMinutes <= 0) return 0;
    return Math.round((charactersTyped / 5) / timeInMinutes);
  },

  /**
   * 정확도 계산
   */
  calculateAccuracy(correctKeys: number, totalKeys: number): number {
    if (totalKeys <= 0) return 100;
    return Math.max(0, (correctKeys / totalKeys) * 100);
  },

  /**
   * 키 간격 통계 계산
   */
  calculateKeyIntervalStats(intervals: number[]): {
    average: number;
    median: number;
    variance: number;
    standardDeviation: number;
  } {
    if (intervals.length === 0) {
      return { average: 0, median: 0, variance: 0, standardDeviation: 0 };
    }

    const sorted = [...intervals].sort((a, b) => a - b);
    const average = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const variance = intervals.reduce((acc, interval) => acc + Math.pow(interval - average, 2), 0) / intervals.length;
    const standardDeviation = Math.sqrt(variance);

    return { average, median, variance, standardDeviation };
  }
};

// 기본 export
export default {
  initializeKeyboardSystem,
  cleanupKeyboardSystem,
  getKeyboardSystemHealth,
  keyboardEngine,
  keyboardPermissionManager,
  keyboardStatsManager,
  hangulComposer,
  unifiedKeyboardHandler,
  DEFAULT_KEYBOARD_CONFIG,
  KEYBOARD_SYSTEM_VERSION,
  SUPPORTED_LANGUAGES,
  KEYBOARD_EVENT_TYPES,
  KEYBOARD_IPC_CHANNELS,
  KeyboardUtils
};
