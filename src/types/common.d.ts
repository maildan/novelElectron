/**
 * 🔥 기가차드 공통 타입 정의 - 중복 코드 모듈화
 * Loop Typing Analytics - Common Type Definitions
 */

declare module '@shared/common' {
  // 데이터베이스 관련 타입
  export interface SessionData {
    id: string;
    content: string;
    keyCount: number;
    wpm: number;
    accuracy: number;
    timestamp: string;
    typingTime: number;
    totalChars: number;
  }

  // 프로젝트 관련 타입  
  export interface ProjectData {
    title: string;
    description: string;
    progress: number;
    status: 'progress' | 'draft' | 'review' | 'complete' | 'planned';
    lastModified: string;
    wordCount: string;
    chapters: number;
    genre: string;
    starred: boolean;
  }

  // 파일 관련 타입
  export interface FileData {
    id: string;
    name: string;
    path: string;
    type: string;
    project: string;
    time: string;
    status: string;
    lastModified: Date;
  }

  // 통계 차트 타입
  export interface ChartDataPoint {
    time: number;
    wpm: number;
    value?: number;
    label?: string;
  }

  // 실시간 모니터링 타입
  export interface MonitoringData {
    wpm: number;
    words: number;
    time: number;
    isActive: boolean;
  }

  // 에러 핸들링 타입
  export interface ErrorData {
    code: string;
    message: string;
    stack?: string;
    timestamp: number;
  }

  // 공통 유틸리티 타입
  export type StatusColor = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'slate';
  export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
  
  // 벤치마크 관련 타입
  export interface BenchmarkResult {
    operationsPerSecond: number;
    memoryUsage: number;
    executionTime: number;
    functionName: string;
  }

  // 벤치마크 메트릭 타입
  export interface BenchmarkMetrics {
    operationsPerSecond: number;
    memoryUsage: number;
    executionTime: number;
    functionName: string;
  }
}

// 전역 윈도우 타입 확장
declare global {
  interface Window {
    // 디버그용 전역 함수
    __GIGACHAD_DEBUG__?: {
      benchmark: <T>(fn: () => T, name: string) => { result: T; metrics: BenchmarkMetrics };
      memoryUsage: () => number;
      logPerformance: (operation: string) => void;
    };
  }
}

export {};
