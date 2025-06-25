/**
 * 키보드 엔진 모듈 진입점
 * 
 * 기가차드 표준 KeyboardEngine과 관련 타입들을 통합 제공
 */

// 메인 KeyboardEngine 클래스와 인스턴스 export
export { default as KeyboardEngine, keyboardEngine } from './KeyboardEngine';

// 유틸리티 함수들
export { getKeyboardEngine, initializeKeyboardEngine } from './KeyboardEngine';

// 모든 타입 정의들 re-export
export type {
  KeyEvent,
  SessionStats,
  KeyboardConfig,
  PermissionStatus,
  HangulComposerState,
  MonitoringState
} from './KeyboardEngine';

// 각 모듈별 세부 타입들 (필요한 경우)
export type { SessionConfig } from './managers/SessionManager';

// 기본 export는 KeyboardEngine 클래스
export { default } from './KeyboardEngine';
