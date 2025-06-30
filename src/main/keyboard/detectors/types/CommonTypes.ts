// 🔥 기가차드 언어 감지기 공통 타입 정의

/**
 * 🔥 지원하는 언어 타입
 */
export type SupportedLanguage = 'ko' | 'en' | 'ja' | 'zh';

/**
 * 🔥 언어 감지 방법
 */
export type DetectionMethod = 
  | 'keycode' 
  | 'pattern' 
  | 'fallback' 
  | 'system' 
  | 'character' 
  | 'ime' 
  | 'switch' 
  | 'validation' 
  | 'special-char-mapping'
  | 'native';

/**
 * 🔥 플랫폼 타입
 */
export type PlatformType = 'macos' | 'windows' | 'linux' | 'fallback';

/**
 * 🔥 한글 키코드 매핑 타입
 */
export type HangulKeycodeMap = Map<number, string>;

/**
 * 🔥 입력소스 매핑 타입
 */
export type InputSourceMap = Record<string, SupportedLanguage>;

/**
 * 🔥 키보드 레이아웃 매핑 타입
 */
export type KeyboardLayoutMap = Record<number, SupportedLanguage>;

/**
 * 🔥 언어 감지 결과 메타데이터
 */
export interface DetectionMetadata {
  keycode?: number;
  keychar?: number;
  char?: string;
  reason?: string;
  source?: string;
  processingTime?: string;
  hangulChar?: string;
  rawcode?: number;
  physicalKeycode?: number;
  error?: string;
  confidence?: number;
  inputSourceId?: string;
  detectedLanguage?: SupportedLanguage;
  systemCallDuration?: number;
  cacheHit?: boolean;
  fallbackReason?: string;
  layoutId?: number;
  threadId?: number;
  windowHandle?: string;
  engineName?: string;
  xkbLayout?: string;
  environmentLang?: string;
}

/**
 * 🔥 언어 감지 결과 인터페이스
 */
export interface LanguageDetectionResult {
  language: SupportedLanguage;
  confidence: number;
  method: DetectionMethod;
  isComposing: boolean;
  detectedChar?: string;
  metadata?: DetectionMetadata;
}

/**
 * 🔥 성능 통계 인터페이스
 */
export interface PerformanceStats {
  detectionCount: number;
  averageProcessingTime: number;
  currentLanguage: SupportedLanguage;
  platform?: string;
  detectorType?: PlatformType;
  fallbackCount?: number;
  fallbackRate?: number;
  systemCallCount?: number;
  cacheHitRate?: number;
  lastError?: string;
  uptime?: number;
}

/**
 * 🔥 헬스체크 결과 인터페이스
 */
export interface HealthCheckResult {
  healthy: boolean;
  uptime?: number;
  lastError?: string;
  performance: PerformanceStats;
  platform?: string;
  detectorType?: PlatformType;
}
