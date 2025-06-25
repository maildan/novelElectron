// 🔥 기가차드 글로벌 폴리필 - 강력한 버전
// renderer/globals.js

console.log('🔥 기가차드 글로벌 폴리필 시작...');

// Step 1: global 변수를 완전히 globalThis로 교체
if (typeof global === 'undefined') {
  window.global = globalThis;
  globalThis.global = globalThis;
  self.global = globalThis;
}

// Step 2: 추가 안전장치
if (typeof window !== 'undefined') {
  if (!window.global) {
    window.global = globalThis;
  }
  
  // global.global 순환 참조 방지
  if (!globalThis.global) {
    globalThis.global = globalThis;
  }
}

// Step 3: 모든 컨텍스트에서 global 사용 가능하도록
try {
  if (typeof self !== 'undefined' && !self.global) {
    self.global = globalThis;
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

console.log('🔥 기가차드 글로벌 폴리필 완료!', {
  global: typeof global,
  globalThis: typeof globalThis,
  window: typeof window,
  'window.global': typeof window?.global,
  'globalThis.global': typeof globalThis?.global
});

export {};
