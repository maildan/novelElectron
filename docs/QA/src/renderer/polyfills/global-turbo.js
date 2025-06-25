/**
 * 🔥 기가차드 Next.js 15 + Turbopack 호환 Global 폴리필
 * Simple and effective - 병신 복잡한 코드 없이!
 */

// 🔥 기가차드식 간단하고 확실한 global 폴리필
if (typeof window !== 'undefined') {
  // 브라우저 환경에서 global = globalThis
  if (typeof global === 'undefined') {
    window.global = globalThis;
  }
  
  // 추가 방어
  window.global = window.global || globalThis;
  window.GLOBAL = window.GLOBAL || globalThis;
  window.root = window.root || globalThis;
  
  console.log('🔥 기가차드 글로벌 폴리필 완료! global:', typeof global);
} else {
  // SSR 환경
  if (typeof globalThis !== 'undefined') {
    globalThis.global = globalThis.global || globalThis;
    console.log('🔥 기가차드 SSR 환경에서 실행 중');
  }
}
