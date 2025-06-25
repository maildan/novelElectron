/**
 * 🔥 기가차드 Global 타입 선언 - 병신 TypeScript 때문에!
 * .d.ts 파일에서는 타입 선언만! 실행 코드는 안 됨!
 */
declare global {
  var global: typeof globalThis;
  
  interface Window {
    global: typeof globalThis;
    electronAPI: any;
  }
}

export {};
