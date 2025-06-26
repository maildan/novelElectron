// 공통 타입 정의 (기가차드 스타일)

// IPC 응답 타입
export interface IpcResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

// 앱 상태 타입
export type AppStatus = 'idle' | 'monitoring' | 'analyzing' | 'error';

// 모니터링 상태 타입
export interface MonitoringState {
  active: boolean;
  startedAt?: Date;
  stoppedAt?: Date;
  error?: string;
}

// AI 분석 상태 타입
export interface AiAnalysisState {
  running: boolean;
  lastResult?: string;
  startedAt?: Date;
  finishedAt?: Date;
  error?: string;
} 