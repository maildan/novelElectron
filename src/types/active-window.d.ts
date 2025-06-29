// 🔥 기가차드 active-win 타입 정의 - shared/types.ts와 동일한 WindowInfo 사용
declare module 'active-win' {
  import { WindowInfo } from '../shared/types';
  
  // 🔥 active-win 라이브러리 옵션
  export interface Options {
    screenRecordingPermission?: boolean;
    accessibilityPermission?: boolean;
  }
  
  // 🔥 메인 API 함수
  function getActiveWindow(options?: Options): Promise<WindowInfo | undefined>;
  export default getActiveWindow;
}

export {};
