/**
 * 🔥 키 이름 변환 유틸리티 - 기가차드 Edition
 */

import { ENGLISH_KEYBOARD_LAYOUT } from './keyboardMap';

/**
 * keycode를 영어 키 이름으로 변환
 */
export function getKeyName(keycode: number): string {
  // 영어 키보드 매핑 확인
  if (ENGLISH_KEYBOARD_LAYOUT[keycode]) {
    return ENGLISH_KEYBOARD_LAYOUT[keycode];
  }

  // 숫자 키 (49-57: 1-9, 48: 0)
  if (keycode >= 48 && keycode <= 57) {
    return String.fromCharCode(keycode);
  }

  // 특수 키 매핑
  const specialKeys: Record<number, string> = {
    8: 'Backspace',
    9: 'Tab',
    13: 'Enter',
    16: 'Shift',
    17: 'Ctrl',
    18: 'Alt',
    20: 'CapsLock',
    27: 'Escape',
    32: 'Space',
    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown',
    46: 'Delete'
  };

  return specialKeys[keycode] || `Key${keycode}`;
}
