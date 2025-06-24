/**
 * 🔥 기가차드 글로벌 폴리필
 * Global polyfills for browser compatibility in Electron renderer
 */

// Node.js 글로벌 변수 폴리필
if (typeof global === 'undefined') {
  (window as any).global = globalThis;
}

if (typeof process === 'undefined') {
  (window as any).process = {
    env: {},
    platform: 'browser',
    version: '',
    versions: {}
  };
}

if (typeof Buffer === 'undefined') {
  (window as any).Buffer = undefined;
}

// 추가 Node.js 호환성
(window as any).__dirname = '/';
(window as any).__filename = '/index.js';
(window as any).require = undefined;
(window as any).module = undefined;
(window as any).exports = undefined;

// 🔥 기가차드 전용 디버그 정보
console.log('🔥 기가차드 글로벌 폴리필 로드됨');
console.log('✅ global:', typeof global !== 'undefined');
console.log('✅ globalThis:', typeof globalThis !== 'undefined');
console.log('✅ window.global:', typeof (window as any).global !== 'undefined');
