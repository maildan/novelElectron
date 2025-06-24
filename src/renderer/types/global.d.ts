/**
 * 🔥 기가차드 전역 타입 정의
 * Loop Typing Analytics - Global Type Definitions
 */

import { ElectronAPI } from '../../preload/index';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
