/**
 * 🔥 기가차드 렌더러 유틸리티 모듈
 * 모든 렌더러 전용 유틸리티 함수들을 모듈화
 * 중복 제거 + 타입 안전성 + 최적화
 */

import logger, { LogMeta } from './logger';

// ==================== 타입 정의 ====================

export interface FormattedTimeOptions {
  includeMs?: boolean;
  shortFormat?: boolean;
}

export interface WpmColorOptions {
  excellent: number;
  good: number;
  average: number;
}

export interface StatusColorMapping {
  [key: string]: string;
}

// ==================== 시간 포맷팅 ====================

/**
 * 🔥 통합 시간 포맷팅 (중복 제거)
 * Dashboard와 TypingPanel에서 사용하던 중복 로직 통합
 */
export function formatTime(seconds: number, options: FormattedTimeOptions = {}): string {
  const { includeMs = false, shortFormat = false } = options;
  
  if (includeMs && seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  if (shortFormat) {
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 🔥 밀리초를 읽기 쉬운 형태로 변환
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`;
}

// ==================== 색상 유틸리티 ====================

/**
 * 🔥 WPM 색상 계산 (TypingPanel에서 사용)
 */
export function getWpmColor(wpm: number, options: WpmColorOptions = { excellent: 60, good: 40, average: 20 }): string {
  const { excellent, good, average } = options;
  
  if (wpm >= excellent) return 'text-green-600';
  if (wpm >= good) return 'text-blue-600';
  if (wpm >= average) return 'text-yellow-600';
  return 'text-red-600';
}

/**
 * 🔥 정확도 색상 계산 (TypingPanel에서 사용)
 */
export function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 95) return 'text-green-600';
  if (accuracy >= 90) return 'text-blue-600';
  if (accuracy >= 80) return 'text-yellow-600';
  return 'text-red-600';
}

/**
 * 🔥 프로젝트 상태 색상 (Projects에서 사용하던 중복 제거)
 */
export function getProjectStatusColor(status: string): string {
  const statusMap: StatusColorMapping = {
    '진행중': 'bg-blue-100 text-blue-800',
    '초안': 'bg-slate-100 text-slate-800',
    '검토중': 'bg-yellow-100 text-yellow-800',
    '완료': 'bg-green-100 text-green-800',
    '계획중': 'bg-purple-100 text-purple-800',
    'active': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-blue-100 text-blue-800',
    'draft': 'bg-slate-100 text-slate-800'
  };
  
  return statusMap[status] || statusMap['초안'];
}

/**
 * 🔥 일반적인 상태 색상 (공통 사용)
 */
export function getStatusColor(status: string): string {
  const normalizedStatus = status.toLowerCase();
  
  switch (normalizedStatus) {
    case 'success':
    case 'completed':
    case 'active':
    case '완료':
      return 'text-green-600 bg-green-50';
    case 'warning':
    case 'pending':
    case '대기':
      return 'text-yellow-600 bg-yellow-50';
    case 'error':
    case 'failed':
    case '오류':
      return 'text-red-600 bg-red-50';
    case 'info':
    case 'draft':
    case '초안':
      return 'text-blue-600 bg-blue-50';
    default:
      return 'text-slate-600 bg-slate-50';
  }
}

// ==================== 숫자 포맷팅 ====================

/**
 * 🔥 숫자를 읽기 쉬운 형태로 포맷팅
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

/**
 * 🔥 바이트 크기 포맷팅
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 🔥 퍼센트 포맷팅
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}

// ==================== 클립보드 유틸리티 ====================

/**
 * 🔥 클립보드 복사 (브라우저 환경)
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      logger.info('Clipboard', `텍스트 복사 성공: ${text.substring(0, 50)}...`);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (result) {
        logger.info('Clipboard', `텍스트 복사 성공 (fallback): ${text.substring(0, 50)}...`);
      } else {
        logger.error('Clipboard', '텍스트 복사 실패 (fallback)');
      }
      
      return result;
    }
  } catch (error) {
    logger.error('Clipboard', `클립보드 복사 중 오류: ${error}`);
    return false;
  }
}

// ==================== DOM 유틸리티 ====================

/**
 * 🔥 요소가 뷰포트에 보이는지 확인
 */
export function isElementVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 🔥 스크롤을 부드럽게 특정 요소로 이동
 */
export function scrollToElement(element: HTMLElement, offset: number = 0): void {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// ==================== 디바운스/쓰로틀 ====================

/**
 * 🔥 디바운스 함수
 */
export function debounce<T extends unknown[]>(
  func: (...args: T) => void,
  wait: number
): (...args: T) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: T) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
}

/**
 * 🔥 쓰로틀 함수
 */
export function throttle<T extends unknown[]>(
  func: (...args: T) => void,
  limit: number
): (...args: T) => void {
  let inThrottle = false;
  
  return (...args: T) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// ==================== 검색/필터링 ====================

/**
 * 🔥 텍스트 기반 검색 필터
 */
export function createSearchFilter<T>(
  items: T[],
  searchQuery: string,
  searchFields: (keyof T)[]
): T[] {
  if (!searchQuery.trim()) return items;
  
  const query = searchQuery.toLowerCase();
  
  return items.filter(item =>
    searchFields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(query);
      }
      if (typeof value === 'number') {
        return value.toString().includes(query);
      }
      return false;
    })
  );
}

// ==================== 로컬 스토리지 ====================

/**
 * 🔥 타입 안전한 로컬 스토리지 헬퍼
 */
export class SafeStorage {
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      logger.error('Storage', `로컬 스토리지 읽기 실패 (${key}): ${error}`);
      return defaultValue;
    }
  }
  
  static set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Storage', `로컬 스토리지 쓰기 실패 (${key}): ${error}`);
      return false;
    }
  }
  
  static remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      logger.error('Storage', `로컬 스토리지 삭제 실패 (${key}): ${error}`);
      return false;
    }
  }
  
  static clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      logger.error('Storage', `로컬 스토리지 초기화 실패: ${error}`);
      return false;
    }
  }
}

// ==================== 에러 처리 ====================

/**
 * 🔥 안전한 비동기 함수 실행
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  fallback: T,
  errorMessage?: string
): Promise<T> {
  try {
    return await asyncFn();
  } catch (error) {
    logger.error('SafeAsync', `${errorMessage || '비동기 함수 실행 실패'}: ${error}`);
    return fallback;
  }
}

/**
 * 🔥 안전한 JSON 파싱
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    logger.error('SafeJsonParse', `JSON 파싱 실패: ${error}`);
    return fallback;
  }
}

// ==================== 모듈 초기화 ====================

logger.info('RendererUtils', '🔥 기가차드 렌더러 유틸리티 모듈 로딩 완료!');

// 기가차드 렌더러 유틸리티 기본 export
const RendererUtils = {
  formatTime,
  formatDuration,
  getWpmColor,
  getAccuracyColor,
  getProjectStatusColor,
  copyToClipboard,
  SafeStorage,
  safeAsync,
  safeJsonParse
};

export default RendererUtils;
