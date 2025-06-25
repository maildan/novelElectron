/**
 * 🔥 기가차드 키보드 시스템 상수들
 * Loop Typing Analytics - Keyboard System Constants
 */

export const KEYBOARD_CONSTANTS = {
  // 🔥 메모리 관리
  MAX_QUEUE_SIZE: 1000,
  QUEUE_CLEANUP_THRESHOLD: 0.8,
  BATCH_PROCESS_SIZE: 50,
  HANGUL_CACHE_MAX_SIZE: 1000,
  
  // 🔥 타이밍 관리
  BATCH_INTERVAL_MS: 16, // ~60fps
  SESSION_TIMEOUT_MS: 30 * 60 * 1000, // 30분
  CONNECTION_TIMEOUT_MS: 5000,
  PERMISSION_CHECK_INTERVAL: 30000, // 30초
  RETRY_DELAY_MS: 3000,
  UIOHOOK_START_TIMEOUT: 10000, // 10초
  
  // 🔥 성능 최적화
  DEBOUNCE_DELAY_MS: 100,
  THROTTLE_DELAY_MS: 50,
  MAX_CONCURRENT_OPERATIONS: 5,
  
  // 🔥 보안
  MAX_ALLOWED_INPUT_LENGTH: 10000,
  SUSPICIOUS_ACTIVITY_THRESHOLD: 1000, // 초당 키 입력 수
  
  // 🔥 디버깅
  LOG_BUFFER_SIZE: 500,
  ENABLE_VERBOSE_LOGGING: process.env.NODE_ENV === 'development',
  
  // 🔥 한글 처리 유니코드 범위
  HANGUL_RANGES: {
    JAMO_START: 0x1100,
    JAMO_END: 0x11FF,
    COMPAT_JAMO_START: 0x3130,
    COMPAT_JAMO_END: 0x318F,
    SYLLABLES_START: 0xAC00,
    SYLLABLES_END: 0xD7AF,
    CHO_START: 0x1100,
    CHO_END: 0x1112,
    CHO_BASE: 0x1100
  },
  
  // 🔥 키코드 매핑
  KEYCODE_RANGES: {
    Q_TO_P_START: 30,
    Q_TO_P_END: 38,
    Q_CHAR_CODE: 81
  },
  
  // 🔥 성능 기본값
  DEFAULT_ACCURACY: 100,
  SESSION_CHECK_INTERVAL: 1000, // 1초마다 확인
  
  // 🔥 플랫폼별 설정
  PLATFORM_SPECIFIC: {
    darwin: {
      PERMISSION_CHECK_INTERVAL: 60000, // macOS는 1분마다
      REQUIRED_PERMISSIONS: ['accessibility', 'inputMonitoring', 'screenRecording']
    },
    win32: {
      PERMISSION_CHECK_INTERVAL: 30000,
      REQUIRED_PERMISSIONS: ['inputMonitoring']
    },
    linux: {
      PERMISSION_CHECK_INTERVAL: 30000,
      REQUIRED_PERMISSIONS: ['accessibility']
    }
  }
} as const;

export const ERROR_MESSAGES = {
  PERMISSION_DENIED: '필요한 시스템 권한이 없습니다',
  UIOHOOK_START_FAILED: 'uIOhook 시작에 실패했습니다',
  DATABASE_NOT_INITIALIZED: '데이터베이스가 초기화되지 않았습니다',
  SESSION_TIMEOUT: '세션이 타임아웃되었습니다',
  MEMORY_LIMIT_EXCEEDED: '메모리 사용량이 한계를 초과했습니다',
  INVALID_CONFIGURATION: '잘못된 설정입니다',
  KEYBOARD_ENGINE_NOT_READY: '키보드 엔진이 준비되지 않았습니다',
  ENGINE_INIT_FAILED: '키보드 엔진 초기화 실패',
  ENGINE_NOT_INITIALIZED: '키보드 엔진이 초기화되지 않았습니다',
  MONITORING_START_FAILED: '키보드 모니터링 시작 실패',
  MONITORING_STOP_FAILED: '키보드 모니터링 중지 실패',
  MONITORING_ALREADY_RUNNING: '키보드 모니터링이 이미 실행 중입니다',
  MONITORING_NOT_RUNNING: '키보드 모니터링이 실행 중이 아닙니다',
  PERMISSION_SETTINGS_FAILED: '권한 설정 열기 실패',
  PERMISSION_CHECK_FAILED: '시스템 권한 확인 실패',
  ENGINE_CLEANUP_FAILED: '키보드 엔진 정리 실패',
  KEY_EVENT_PROCESS_FAILED: '키 이벤트 처리 실패'
} as const;

export const SUCCESS_MESSAGES = {
  ENGINE_CREATED: '🔥 기가차드 키보드 엔진 생성됨',
  ENGINE_INITIALIZED: '✅ 기가차드 키보드 엔진 초기화 완료',
  ENGINE_CLEANUP: '✅ 기가차드 키보드 엔진 정리 완료',
  MONITORING_STARTED: '✅ 키보드 모니터링 시작됨',
  MONITORING_STOPPED: '✅ 키보드 모니터링 중지됨',
  HANDLERS_REGISTERED: '📡 키보드 엔진 IPC 핸들러 등록 완료',
  KEYBOARD_ENGINE_STARTED: '🔥 기가차드 키보드 엔진 시작됨!',
  PERMISSIONS_GRANTED: '✅ 모든 권한이 허용되었습니다',
  PERMISSIONS_CHECKED: '✅ 시스템 권한 확인 완료',
  SESSION_CREATED: '🆕 새 타이핑 세션이 시작되었습니다',
  MEMORY_OPTIMIZED: '🧹 기가차드 메모리 정리 완료',
  UIOHOOK_READY: '🔌 uIOhook 연결 완료',
  DATABASE_CONNECTED: '🗄️ 데이터베이스 연결 성공',
  EVENT_HANDLERS_SETUP: '✅ 키보드 이벤트 핸들러 설정 완료'
} as const;

export const INFO_MESSAGES = {
  ENGINE_INITIALIZING: '⚡ 기가차드 키보드 엔진 초기화 시작...',
  MONITORING_STARTING: '🎯 키보드 모니터링 시작...',
  MONITORING_STOPPING: '🛑 키보드 모니터링 중지...',
  PERMISSIONS_CHECKING: '🔒 시스템 권한 확인 중...',
  HANDLERS_SETUP: '🔗 키보드 이벤트 핸들러 설정...',
  CONFIG_UPDATING: '⚙️ 키보드 엔진 설정 업데이트',
  ENGINE_CLEANUP_START: '🧹 기가차드 키보드 엔진 정리 시작...',
  QUEUE_CLEANUP: '🧹 키 이벤트 큐 정리'
} as const;

export const WARN_MESSAGES = {
  MONITORING_ALREADY_RUNNING: '⚠️ 키보드 모니터링이 이미 실행 중입니다',
  MONITORING_NOT_RUNNING: '⚠️ 키보드 모니터링이 실행 중이 아닙니다'
} as const;

export type PlatformType = keyof typeof KEYBOARD_CONSTANTS.PLATFORM_SPECIFIC;
export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
export type SuccessMessageKey = keyof typeof SUCCESS_MESSAGES;
export type InfoMessageKey = keyof typeof INFO_MESSAGES;
export type WarnMessageKey = keyof typeof WARN_MESSAGES;
