/**
 * 🔥 기가차드 렌더러 유틸리티 (브라우저 환경용)
 * Loop Typing Analytics - Renderer Utils
 */

import { Logger } from './logger';

/**
 * 디버그 진입점 로그
 */
export const debugEntry = (funcName: string, args?: unknown): void => {
  Logger.debug(`🚀 ENTER ${funcName}`, args);
};

/**
 * 디버그 종료점 로그
 */
export const debugExit = (funcName: string, result?: unknown): void => {
  Logger.debug(`🏁 EXIT ${funcName}`, result);
};

/**
 * 디버그 로그 포함 함수 래퍼
 */
export const withDebug = <T extends (...args: unknown[]) => unknown>(
  funcName: string,
  func: T
): T => {
  return ((...args: unknown[]) => {
    debugEntry(funcName, args);
    try {
      const result = func(...args);
      debugExit(funcName, result);
      return result;
    } catch (error) {
      Logger.error(`❌ ERROR in ${funcName}:`, error);
      throw error;
    }
  }) as T;
};

/**
 * 시간 포맷팅 (HH:MM:SS)
 */
export const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
};

/**
 * 세션 데이터를 파일 형식으로 변환
 */
export const transformSessionToFile = (session: unknown): unknown => {
  if (!session || typeof session !== 'object') {
    return {};
  }

  // 기본적인 변환 로직 (Node.js 없이)
  return {
    ...session,
    timestamp: new Date().toISOString(),
    type: 'session'
  };
};

/**
 * 세션 데이터를 프로젝트 형식으로 변환
 */
export const transformSessionToProject = (session: unknown): unknown => {
  if (!session || typeof session !== 'object') {
    return {};
  }

  return {
    ...session,
    timestamp: new Date().toISOString(),
    type: 'project'
  };
};

/**
 * 기가차드 디버그 초기화 (렌더러용)
 */
export const initGigaChadDebug = (): void => {
  Logger.info('🔥 기가차드 렌더러 디버그 시스템 초기화 완료');
};

/**
 * 안전한 JSON 파싱
 */
export const safeJsonParse = (jsonString: string): unknown => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    Logger.error('JSON 파싱 실패:', error);
    return null;
  }
};

/**
 * 안전한 객체 접근
 */
export const safeGet = (obj: unknown, path: string, defaultValue: unknown = undefined): unknown => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  
  const keys = path.split('.');
  let current = obj as Record<string, unknown>;
  
  for (const key of keys) {
    if (current[key] === undefined || current[key] === null) {
      return defaultValue;
    }
    current = current[key] as Record<string, unknown>;
  }
  
  return current;
};

/**
 * 상태 색상 가져오기
 */
export const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'active': return 'text-green-500';
    case 'inactive': return 'text-gray-500';
    case 'error': return 'text-red-500';
    case 'warning': return 'text-yellow-500';
    default: return 'text-blue-500';
  }
};

/**
 * 딜레이 함수 (Promise 기반)
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 객체 복사 (얕은 복사)
 */
export const shallowClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return [...obj] as T;
  return { ...obj } as T;
};

export default {
  debugEntry,
  debugExit,
  withDebug,
  formatTime,
  transformSessionToFile,
  transformSessionToProject,
  initGigaChadDebug,
  safeJsonParse,
  safeGet,
  getStatusColor,
  delay,
  shallowClone
};
