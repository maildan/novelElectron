// 🔥 기가차드 플랫폼별 키코드 매핑 중앙화

import type { HangulKeycodeMap, InputSourceMap, KeyboardLayoutMap, SupportedLanguage } from './CommonTypes';

// =============================================================================
// 🔥 macOS 전용 매핑
// =============================================================================

/**
 * 🔥 macOS 한글 키코드 매핑 (두벌식 기준)
 * - 소문자 keycode → 기본 자음/모음
 * - 대문자 keycode → 쌍자음/복합모음
 */
export const MACOS_HANGUL_KEYCODES: HangulKeycodeMap = new Map([
  // 자음 (소문자)
  [113, 'ㅂ'], [119, 'ㅈ'], [101, 'ㄷ'], [114, 'ㄱ'], [116, 'ㅅ'],
  [97, 'ㅁ'], [115, 'ㄴ'], [100, 'ㅇ'], [102, 'ㄹ'], [103, 'ㅎ'],
  [122, 'ㅋ'], [120, 'ㅌ'], [99, 'ㅊ'], [118, 'ㅍ'],
  
  // 모음 (소문자)
  [121, 'ㅛ'], [117, 'ㅕ'], [105, 'ㅑ'], [111, 'ㅐ'], [112, 'ㅔ'],
  [104, 'ㅗ'], [106, 'ㅓ'], [107, 'ㅏ'], [108, 'ㅣ'],
  [98, 'ㅠ'], [110, 'ㅜ'], [109, 'ㅡ'],
  
  // 쌍자음 (대문자)
  [81, 'ㅃ'], [87, 'ㅉ'], [69, 'ㄸ'], [82, 'ㄲ'], [84, 'ㅆ'],
  
  // 복합모음 (대문자)
  [79, 'ㅒ'], [80, 'ㅖ']
]);

/**
 * 🔥 macOS 입력소스 식별자 매핑
 */
export const MACOS_INPUT_SOURCES: InputSourceMap = {
  'com.apple.keylayout.ABC': 'en',
  'com.apple.keylayout.US': 'en', 
  'com.apple.keylayout.British': 'en',
  'com.apple.keylayout.2sethangul': 'ko',
  'org.youknowone.inputmethod.Gureum.han2': 'ko',
  'org.youknowone.inputmethod.Gureum.han3final': 'ko',
  'com.apple.keylayout.Japanese': 'ja',
  'com.apple.keylayout.Japanese-Hiragana': 'ja',
  'com.apple.keylayout.Chinese-Traditional': 'zh',
  'com.apple.keylayout.Chinese-Simplified': 'zh'
} as const;

// =============================================================================
// 🔥 Windows 전용 매핑
// =============================================================================

/**
 * 🔥 Windows 한글 키코드 매핑 (Virtual Key Code 기준)
 */
export const WINDOWS_HANGUL_KEYCODES: HangulKeycodeMap = new Map([
  // 자음 (Virtual Key Code)
  [0x51, 'ㅂ'], [0x57, 'ㅈ'], [0x45, 'ㄷ'], [0x52, 'ㄱ'], [0x54, 'ㅅ'],
  [0x41, 'ㅁ'], [0x53, 'ㄴ'], [0x44, 'ㅇ'], [0x46, 'ㄹ'], [0x47, 'ㅎ'],
  [0x5A, 'ㅋ'], [0x58, 'ㅌ'], [0x43, 'ㅊ'], [0x56, 'ㅍ'],
  
  // 모음 (Virtual Key Code)
  [0x59, 'ㅛ'], [0x55, 'ㅕ'], [0x49, 'ㅑ'], [0x4F, 'ㅐ'], [0x50, 'ㅔ'],
  [0x48, 'ㅗ'], [0x4A, 'ㅓ'], [0x4B, 'ㅏ'], [0x4C, 'ㅣ'],
  [0x42, 'ㅠ'], [0x4E, 'ㅜ'], [0x4D, 'ㅡ']
]);

/**
 * 🔥 Windows 키보드 레이아웃 매핑
 */
export const WINDOWS_KEYBOARD_LAYOUTS: KeyboardLayoutMap = {
  0x00000409: 'en',  // US English
  0x00000412: 'ko',  // Korean
  0x00000411: 'ja',  // Japanese  
  0x00000804: 'zh',  // Chinese (Simplified)
  0x00000404: 'zh'   // Chinese (Traditional)
} as const;

// =============================================================================
// 🔥 Linux 전용 매핑
// =============================================================================

/**
 * 🔥 Linux 한글 키코드 매핑 (X11 KeySym 기준)
 */
export const LINUX_HANGUL_KEYCODES: HangulKeycodeMap = new Map([
  // 자음 (X11 KeySym)
  [113, 'ㅂ'], [119, 'ㅈ'], [101, 'ㄷ'], [114, 'ㄱ'], [116, 'ㅅ'],
  [97, 'ㅁ'], [115, 'ㄴ'], [100, 'ㅇ'], [102, 'ㄹ'], [103, 'ㅎ'],
  [122, 'ㅋ'], [120, 'ㅌ'], [99, 'ㅊ'], [118, 'ㅍ'],
  
  // 모음 (X11 KeySym)
  [121, 'ㅛ'], [117, 'ㅕ'], [105, 'ㅑ'], [111, 'ㅐ'], [112, 'ㅔ'],
  [104, 'ㅗ'], [106, 'ㅓ'], [107, 'ㅏ'], [108, 'ㅣ'],
  [98, 'ㅠ'], [110, 'ㅜ'], [109, 'ㅡ']
]);

/**
 * 🔥 Linux 입력 메서드 매핑
 */
export const LINUX_INPUT_METHODS: InputSourceMap = {
  'hangul': 'ko',
  'korean': 'ko',
  'ibus-hangul': 'ko',
  'fcitx-hangul': 'ko',
  'nabi': 'ko',
  'english': 'en',
  'us': 'en',
  'anthy': 'ja',
  'ibus-anthy': 'ja',
  'mozc': 'ja',
  'ibus-mozc': 'ja',
  'pinyin': 'zh',
  'ibus-pinyin': 'zh',
  'chewing': 'zh',
  'ibus-chewing': 'zh'
} as const;

// =============================================================================
// 🔥 공통 (Fallback) 매핑
// =============================================================================

/**
 * 🔥 범용 한글 키코드 (영어 키보드 기준)
 */
export const FALLBACK_HANGUL_KEYCODES = new Set([
  // QWERTY 영어 키보드에서 한글 입력에 사용되는 키들
  81, 87, 69, 82, 84,    // Q W E R T
  65, 83, 68, 70, 71,    // A S D F G
  90, 88, 67, 86,        // Z X C V
  89, 85, 73, 79, 80,    // Y U I O P
  72, 74, 75, 76,        // H J K L
  66, 78, 77             // B N M
]);

/**
 * 🔥 영어 키코드 범위
 */
export const ENGLISH_KEYCODES = new Set([
  65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77,  // A-M
  78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90   // N-Z
]);

/**
 * 🔥 숫자 키코드 범위 (0-9)
 */
export const NUMBER_KEYCODES = new Set([
  48, 49, 50, 51, 52, 53, 54, 55, 56, 57
]);

/**
 * 🔥 특수문자 키코드 (플랫폼 공통)
 */
export const SPECIAL_KEYCODES = new Set([
  8, 9, 13, 16, 17, 18, 19, 20, 27,      // Backspace, Tab, Enter, Shift, Ctrl, Alt, Pause, CapsLock, Escape
  33, 34, 35, 36, 37, 38, 39, 40,        // PageUp, PageDown, End, Home, Left, Up, Right, Down
  45, 46,                                 // Insert, Delete
  91, 92, 93,                            // Left Win, Right Win, Menu
  112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, // F1-F12
  144, 145,                              // NumLock, ScrollLock
  21, 25, 28, 29                         // Hangul, Hanja keys
]);

// =============================================================================
// 🔥 유틸리티 함수들
// =============================================================================

/**
 * 🔥 플랫폼별 한글 키코드 매핑 가져오기
 */
export function getHangulKeycodes(platform: 'macos' | 'windows' | 'linux' | 'fallback'): HangulKeycodeMap {
  switch (platform) {
    case 'macos':
      return MACOS_HANGUL_KEYCODES;
    case 'windows':
      return WINDOWS_HANGUL_KEYCODES;
    case 'linux':
      return LINUX_HANGUL_KEYCODES;
    case 'fallback':
    default:
      // Fallback은 Set을 Map으로 변환
      const fallbackMap = new Map<number, string>();
      FALLBACK_HANGUL_KEYCODES.forEach(keycode => {
        // 기본적으로 한글 키로 표시 (실제 매핑은 각 플랫폼에서 처리)
        fallbackMap.set(keycode, '한');
      });
      return fallbackMap;
  }
}

/**
 * 🔥 플랫폼별 입력소스 매핑 가져오기
 */
export function getInputSources(platform: 'macos' | 'windows' | 'linux'): InputSourceMap {
  switch (platform) {
    case 'macos':
      return MACOS_INPUT_SOURCES;
    case 'windows':
      // Windows는 keyboard layout을 string으로 변환
      const winMap: InputSourceMap = {};
      Object.entries(WINDOWS_KEYBOARD_LAYOUTS).forEach(([key, value]) => {
        winMap[key] = value;
      });
      return winMap;
    case 'linux':
      return LINUX_INPUT_METHODS;
    default:
      return {};
  }
}

/**
 * 🔥 키코드가 한글 키인지 확인
 */
export function isHangulKeycode(keycode: number, platform: 'macos' | 'windows' | 'linux' | 'fallback'): boolean {
  const hangulKeycodes = getHangulKeycodes(platform);
  return hangulKeycodes.has(keycode);
}

/**
 * 🔥 키코드가 영어 키인지 확인
 */
export function isEnglishKeycode(keycode: number): boolean {
  return ENGLISH_KEYCODES.has(keycode);
}
