import { Logger } from "../shared/logger";
const log = Logger;/**
 * 🔥 기가차드 글로벌 폴리필 - 렌더러 전용
 * Global 변수 문제를 완전히 해결하는 마지막 수단
 */

// � 타입 정의 - any 박살내기
interface GlobalExtended {
  global?: typeof globalThis;
}

interface WindowExtended {
  global?: typeof globalThis;
  process?: {
    env: Record<string, string>;
    browser: boolean;
    version: string;
    versions: Record<string, string>;
    platform: string;
  };
  Buffer?: unknown;
}

// �🚀 Step 1: 즉시 실행으로 global 정의
if (typeof globalThis !== 'undefined' && typeof (globalThis as GlobalExtended).global === 'undefined') {
  (globalThis as GlobalExtended).global = globalThis;
}

if (typeof window !== 'undefined') {
  // 🚀 Step 2: window에도 global 정의
  (window as unknown as WindowExtended).global = globalThis;
  
  // 🚀 Step 3: 추가 폴리필
  if (typeof (window as unknown as WindowExtended).process === 'undefined') {
    (window as unknown as WindowExtended).process = {
      env: {},
      browser: true,
      version: '',
      versions: {},
      platform: 'browser'
    };
  }
  
  if (typeof (window as unknown as WindowExtended).Buffer === 'undefined') {
    (window as unknown as WindowExtended).Buffer = {};
  }
}

// 🔥 Step 4: 모듈 시스템에서도 접근 가능하도록
if (typeof module !== 'undefined' && module.exports) {
  module.exports = globalThis;
}

log.info("Console", '🔥 기가차드 글로벌 폴리필 로드 완료');
export default globalThis;
