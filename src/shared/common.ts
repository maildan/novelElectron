/**
 * 🔥 기가차드 공통 유틸리티 - 중복 로직 모듈화
 * Loop Typing Analytics - Common Utilities
 */

// #DEBUG: 공통 유틸리티 모듈 진입
let performanceMetrics: Record<string, any> = {};

/**
 * 🔥 디버그 로그 - 진입점/종료점 자동 삽입
 */
export function debugEntry(functionName: string, ...args: unknown[]): void {
  console.log(`[🔥 ENTRY] ${functionName}:`, ...args);
  performanceMetrics[functionName] = { startTime: performance.now() };
}

export function debugExit(functionName: string, result?: unknown): void {
  const metrics = performanceMetrics[functionName];
  if (metrics) {
    const executionTime = performance.now() - metrics.startTime;
    console.log(`[🔥 EXIT] ${functionName}: ${executionTime.toFixed(2)}ms`, result);
  }
}

/**
 * 🔥 벤치마크 측정
 */
export function benchmark<T>(fn: () => T, name: string): { result: T; metrics: BenchmarkMetrics } {
  // #DEBUG: 벤치마크 시작
  const startTime = performance.now();
  const startMemory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;
  
  const result = fn();
  
  const endTime = performance.now();
  const endMemory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;
  
  const metrics: BenchmarkMetrics = {
    operationsPerSecond: 1000 / (endTime - startTime),
    memoryUsed: endMemory - startMemory,
    executionTime: endTime - startTime
  };
  
  // #DEBUG: 벤치마크 완료
  console.log(`[🔥 BENCHMARK] ${name}:`, metrics);
  return { result, metrics };
}

/**
 * 🔥 메모리 사용량 측정
 */
export function getMemoryUsage(): number {
  return (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;
}

/**
 * 🔥 async 함수 래핑 - 에러 핸들링 + 디버그 로그
 */
export function withDebug<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  name: string
): T {
  return (async (...args: unknown[]) => {
    debugEntry(name, ...args);
    try {
      const result = await fn(...args);
      debugExit(name, result);
      return result;
    } catch (error) {
      console.error(`[🔥 ERROR] ${name}:`, error);
      debugExit(name, null);
      throw error;
    }
  }) as T;
}

/**
 * 🔥 데이터 변환 공통 로직
 */
export function transformSessionToProject(session: SessionData): ProjectData {
  // #DEBUG: 세션 -> 프로젝트 변환 시작
  return {
    title: `프로젝트 ${session.id}`,
    description: session.content?.substring(0, 50) + "..." || "타이핑 세션 데이터",
    progress: Math.min((session.keyCount || 0) / 10, 100),
    status: session.wpm > 50 ? "진행중" : "초안",
    lastModified: new Date(session.timestamp).toLocaleString(),
    wordCount: Math.floor((session.keyCount || 0) / 5).toLocaleString(),
    chapters: Math.ceil((session.keyCount || 0) / 500),
    genre: session.accuracy > 90 ? "고품질" : "일반",
    starred: session.wpm > 60,
  };
  // #DEBUG: 세션 -> 프로젝트 변환 완료
}

export function transformSessionToFile(session: SessionData, index: number): FileData {
  // #DEBUG: 세션 -> 파일 변환 시작
  return {
    id: session.id,
    name: `문서 ${index + 1}`,
    path: `/sessions/${session.id}`,
    type: 'document',
    project: session.content?.substring(0, 20) + "..." || "타이핑 세션",
    time: new Date(session.timestamp).toLocaleTimeString(),
    status: getStatusFromWpm(session.wpm),
    lastModified: new Date(session.timestamp)
  };
  // #DEBUG: 세션 -> 파일 변환 완료

  function getStatusFromWpm(wpm: number): 'active' | 'completed' | 'draft' | 'archived' {
    if (wpm >= 60) return 'completed';
    if (wpm >= 40) return 'active';
    if (wpm >= 20) return 'draft';
    return 'archived';
  }
}

/**
 * 🔥 상태 색상 매핑 - 중복 제거
 */
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    "진행중": "bg-blue-100 text-blue-800",
    "초안": "bg-slate-100 text-slate-800", 
    "검토중": "bg-yellow-100 text-yellow-800",
    "완료": "bg-green-100 text-green-800",
    "계획중": "bg-purple-100 text-purple-800"
  };
  return colorMap[status] || "bg-slate-100 text-slate-800";
}

/**
 * 🔥 시간 포맷팅 - 중복 제거
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 🔥 글로벌 디버그 도구 초기화
 */
export function initGigaChadDebug(): void {
  // #DEBUG: 글로벌 디버그 도구 초기화
  if (typeof window !== 'undefined') {
    window.__GIGACHAD_DEBUG__ = {
      benchmark,
      memoryUsage: getMemoryUsage,
      logPerformance: (operation: string) => {
        console.log(`[🔥 PERF] ${operation}:`, performanceMetrics);
      }
    };
  }
  // #DEBUG: 글로벌 디버그 도구 초기화 완료
}

// #DEBUG: 공통 유틸리티 모듈 종료

// #DEBUG: 벤치마크 메트릭스 타입
interface BenchmarkMetrics {
  executionTime: number; // ms
  memoryUsed: number; // bytes
  operationsPerSecond: number;
}

// #DEBUG: 성능 메트릭스 저장소 타입
interface PerformanceMetrics {
  [functionName: string]: {
    startTime: number;
    endTime?: number;
    memoryStart?: number;
    memoryEnd?: number;
  };
}

// #DEBUG: 세션 데이터 타입 (DB에서 가져오는 데이터)
interface SessionData {
  id: string;
  content?: string;
  keyCount: number;
  typingTime: number;
  timestamp: string;
  wpm: number;
  accuracy: number;
  totalChars: number;
  duration?: number;
}

// #DEBUG: 프로젝트 변환 결과 타입
interface ProjectData {
  title: string;
  description: string;
  progress: number;
  status: string;
  lastModified: string;
  wordCount: string;
  chapters: number;
  genre: string;
  starred: boolean;
}

// #DEBUG: 파일 변환 결과 타입
interface FileData {
  id: string;
  name: string;
  path: string;
  type: string;
  project: string;
  time: string;
  status: 'active' | 'completed' | 'draft' | 'archived';
  lastModified: Date;
}
