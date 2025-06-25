/**
 * 🔥 기가차드 렌더러 타입 정의 (브라우저 환경용)
 * Loop Typing Analytics - Renderer Types
 */

export interface Log {
  id: string;
  content: string;
  keyCount: number;
  typingTime: number;
  timestamp: string;
  totalChars: number;
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  totalKeys: number;
  totalTime: number;
}

export interface SessionStats {
  id?: string;
  sessionId?: string;
  content?: string;
  totalKeys?: number;
  keyCount?: number;
  duration?: number;
  createdAt?: Date;
  timestamp?: string;
  totalChars?: number;
  charactersTyped?: number;
  characters?: number;
}

export interface IpcResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// CommonComponentProps는 shared/types.ts에서 import하여 사용
