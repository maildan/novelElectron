/**
 * 🔥 기가차드 Global Polyfills
 * Next.js + Electron 호환성을 위한 필수 폴리필
 */

// 🚀 1. global 변수 정의 (최우선)
if (typeof global === 'undefined') {
  if (typeof globalThis !== 'undefined') {
    window.global = globalThis;
    self.global = globalThis;
  } else if (typeof window !== 'undefined') {
    window.global = window;
    self.global = window;
  } else if (typeof self !== 'undefined') {
    self.global = self;
  }
}

// 🚀 2. Node.js process 폴리필
if (typeof process === 'undefined') {
  window.process = {
    env: { NODE_ENV: 'development' },
    browser: true,
    version: '',
    platform: 'browser',
    nextTick: (fn) => Promise.resolve().then(fn)
  };
}

// 🚀 3. Buffer 폴리필 (필요한 경우)
if (typeof Buffer === 'undefined' && typeof require !== 'undefined') {
  try {
    window.Buffer = require('buffer').Buffer;
  } catch (e) {
    // Buffer 없으면 무시
  }
}

// 🚀 4. 추가 Node.js 환경 변수들
window.__dirname = '/';
window.__filename = '/polyfills.js';

console.log('🔥 기가차드 폴리필 로드 완료');
