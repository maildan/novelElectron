/**
 * 🔥 기가차드 글로벌 폴리필 - 강력한 버전
 * Renderer Process용 전역 변수 정의
 */

console.log('🔥 기가차드 글로벌 폴리필 시작...');

// Step 1: global 변수를 완전히 globalThis로 교체
if (typeof global === 'undefined') {
  (window as any).global = globalThis;
  (globalThis as any).global = globalThis;
  (self as any).global = globalThis;
  
  console.log('✅ global 변수 설정 완료');
}

// Step 2: 추가 안전장치
if (typeof window !== 'undefined') {
  if (!(window as any).global) {
    (window as any).global = globalThis;
  }
  
  // global.global 순환 참조 방지
  if (!(globalThis as any).global) {
    (globalThis as any).global = globalThis;
  }
}

// Step 3: 모든 컨텍스트에서 global 사용 가능하도록
try {
  if (typeof self !== 'undefined' && !(self as any).global) {
    (self as any).global = globalThis;
  }
} catch (e) {
  // self 접근 불가 시 무시
}

// Step 4: 강제 설정 (웹팩이 놓친 경우를 위해)
try {
  if (typeof global === 'undefined') {
    eval('global = globalThis');
  }
} catch (e) {
  // eval 실패 시 무시
}

// process 변수가 없으면 기본값 설정
if (typeof process === 'undefined') {
  (window as any).process = {
    env: {},
    platform: 'browser',
    version: '',
    versions: {},
    browser: true
  };
}

// Buffer가 없으면 기본 구현 제공
if (typeof Buffer === 'undefined') {
  (window as any).Buffer = {
    from: (data: any) => new Uint8Array(),
    alloc: (size: number) => new Uint8Array(size),
    isBuffer: (obj: any) => false
  };
}

console.log('🔥 기가차드 글로벌 폴리필 로드 완료');

export {};
