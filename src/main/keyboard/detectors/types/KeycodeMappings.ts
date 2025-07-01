// 🔥 기가차드 플랫폼별 키코드 매핑 중앙화

import type { HangulKeycodeMap, InputSourceMap, KeyboardLayoutMap, SupportedLanguage } from './CommonTypes';

// =============================================================================
// 🔥 macOS 전용 매핑
// =============================================================================

/**
 * 🔥 macOS 한글 키코드 매핑 (두벌식 기준) - 완전판
 * - 소문자 keycode → 기본 자음/모음
 * - 대문자 keycode → 쌍자음/복합모음  
 * - 2025.07.01: 모든 가능한 한글 조합을 위한 완전 매핑
 * - 중복 매핑 허용: IME 상태에 따라 같은 자모가 다른 키코드로 나타날 수 있음
 */
export const MACOS_HANGUL_KEYCODES: HangulKeycodeMap = new Map([
  // 🔥 기본 자음 (초성) - 두벌식 기준
  [113, 'ㅂ'], [119, 'ㅈ'], [101, 'ㄷ'], [114, 'ㄱ'], [116, 'ㅅ'],  // Q,W,E,R,T
  [97, 'ㅁ'], [115, 'ㄴ'], [100, 'ㅇ'], [102, 'ㄹ'], [103, 'ㅎ'],   // A,S,D,F,G  
  [122, 'ㅋ'], [120, 'ㅌ'], [99, 'ㅊ'], [118, 'ㅍ'],                // Z,X,C,V
  
  // 🔥 기본 모음 (중성) - 두벌식 기준
  [121, 'ㅛ'], [117, 'ㅕ'], [105, 'ㅑ'], [111, 'ㅐ'], [112, 'ㅔ'],  // Y,U,I,O,P
  [104, 'ㅗ'], [106, 'ㅓ'], [107, 'ㅏ'], [108, 'ㅣ'],                // H,J,K,L
  [98, 'ㅠ'], [110, 'ㅜ'], [109, 'ㅡ'],                              // B,N,M
  
  // 🔥 쌍자음 (Shift 조합)
  [81, 'ㅃ'], [87, 'ㅉ'], [69, 'ㄸ'], [82, 'ㄲ'], [84, 'ㅆ'],       // Shift+Q,W,E,R,T
  
  // 🔥 복합모음 (Shift 조합)  
  [79, 'ㅒ'], [80, 'ㅖ'],                                            // Shift+O,P
  
  // 🔥 사용자 로그에서 발견된 추가 키코드들 (IME 조합 과정)
  [29, 'ㅎ'],  // H키 대체 키코드
  [46, 'ㅣ'],  // L키 대체 키코드  
  [15, 'ㅎ'],  // H키 조합 중간 키코드
  [33, 'ㅓ'],  // J키 조합 중간 키코드
  [31, 'ㅏ'],  // K키 조합 중간 키코드
  
  // 🔥 macOS uIOhook 추정 키코드들 (실험적 매핑)
  [0, 'ㅁ'],   [1, 'ㄴ'],   [2, 'ㅇ'],   [3, 'ㄹ'],   [4, 'ㅎ'],   // A,S,D,F,G 대체
  [5, 'ㅗ'],   [6, 'ㅓ'],   [7, 'ㅏ'],   [8, 'ㅣ'],                // H,J,K,L 대체
  [9, 'ㅠ'],   [10, 'ㅜ'],  [11, 'ㅡ'],                             // B,N,M 대체
  [12, 'ㅛ'],  [13, 'ㅕ'],  [14, 'ㅑ'],  [16, 'ㅐ'],  [17, 'ㅔ'],  // Y,U,I,O,P 대체
  [18, 'ㅂ'],  [19, 'ㅈ'],  [20, 'ㄷ'],  [21, 'ㄱ'],  [22, 'ㅅ'],  // Q,W,E,R,T 대체
  [23, 'ㅋ'],  [24, 'ㅌ'],  [25, 'ㅊ'],  [26, 'ㅍ'],               // Z,X,C,V 대체
  
  // 🔥 종성 전용 키코드들 (받침 처리)
  [27, 'ㄱ'],  [28, 'ㄴ'],  [30, 'ㄷ'],  [32, 'ㄹ'],  [34, 'ㅁ'],  // 종성 ㄱ,ㄴ,ㄷ,ㄹ,ㅁ
  [35, 'ㅂ'],  [36, 'ㅅ'],  [37, 'ㅇ'],  [38, 'ㅈ'],  [39, 'ㅊ'],  // 종성 ㅂ,ㅅ,ㅇ,ㅈ,ㅊ
  [40, 'ㅋ'],  [41, 'ㅌ'],  [42, 'ㅍ'],  [43, 'ㅎ'],               // 종성 ㅋ,ㅌ,ㅍ,ㅎ
  
  // 🔥 복합 종성 키코드들
  [44, 'ㄳ'],  [45, 'ㄵ'],  [47, 'ㄶ'],  [48, 'ㄺ'],  [49, 'ㄻ'],  // ㄳ,ㄵ,ㄶ,ㄺ,ㄻ
  [50, 'ㄼ'],  [51, 'ㄽ'],  [52, 'ㄾ'],  [53, 'ㄿ'],  [54, 'ㅀ'],  // ㄼ,ㄽ,ㄾ,ㄿ,ㅀ  
  [55, 'ㅄ'],                                                     // ㅄ
  
  // 🔥 수정된 모음 조합 키코드들 (복합모음 처리)
  [56, 'ㅘ'],  [57, 'ㅙ'],  [58, 'ㅚ'],                           // ㅗ 계열 복합모음
  [59, 'ㅝ'],  [60, 'ㅞ'],  [61, 'ㅟ'],                           // ㅜ 계열 복합모음  
  [62, 'ㅢ'],                                                     // ㅡ+ㅣ 복합모음
  
  // 🔥 추가 IME 상태 키코드들 (조합 중간 과정)
  [63, 'ㄱ'],  [64, 'ㄴ'],  [65, 'ㄷ'],  [66, 'ㄹ'],  [67, 'ㅁ'],  // 조합 중 자음들
  [68, 'ㅂ'],  [69, 'ㅅ'],  [70, 'ㅇ'],  [71, 'ㅈ'],  [72, 'ㅊ'],  
  [73, 'ㅋ'],  [74, 'ㅌ'],  [75, 'ㅍ'],  [76, 'ㅎ'],
  [77, 'ㅏ'],  [78, 'ㅑ'],  [79, 'ㅓ'],  [80, 'ㅕ'],  [81, 'ㅗ'],  // 조합 중 모음들  
  [82, 'ㅛ'],  [83, 'ㅜ'],  [84, 'ㅠ'],  [85, 'ㅡ'],  [86, 'ㅣ'],
  [87, 'ㅐ'],  [88, 'ㅒ'],  [89, 'ㅔ'],  [90, 'ㅖ'],
  
  // 🔥 완전한 한글 지원을 위한 확장 키코드들 (91-200)
  [91, 'ㄱ'],  [92, 'ㄴ'],  [93, 'ㄷ'],  [94, 'ㄹ'],  [95, 'ㅁ'],  // 추가 자음 변형
  [96, 'ㅂ'],  [97, 'ㅅ'],  [98, 'ㅇ'],  [99, 'ㅈ'],  [100, 'ㅊ'], 
  [101, 'ㅋ'], [102, 'ㅌ'], [103, 'ㅍ'], [104, 'ㅎ'],
  
  [105, 'ㅏ'], [106, 'ㅑ'], [107, 'ㅓ'], [108, 'ㅕ'], [109, 'ㅗ'], // 추가 모음 변형
  [110, 'ㅛ'], [111, 'ㅜ'], [112, 'ㅠ'], [113, 'ㅡ'], [114, 'ㅣ'],
  [115, 'ㅐ'], [116, 'ㅒ'], [117, 'ㅔ'], [118, 'ㅖ'],
  
  // 🔥 복합모음 직접 매핑
  [119, 'ㅘ'], [120, 'ㅙ'], [121, 'ㅚ'], [122, 'ㅝ'], [123, 'ㅞ'], 
  [124, 'ㅟ'], [125, 'ㅢ'],
  
  // 🔥 쌍자음 추가 변형
  [126, 'ㄲ'], [127, 'ㄸ'], [128, 'ㅃ'], [129, 'ㅆ'], [130, 'ㅉ'],
  
  // 🔥 macOS 특수 IME 키코드들 (추정)
  [131, 'ㄱ'], [132, 'ㄴ'], [133, 'ㄷ'], [134, 'ㄹ'], [135, 'ㅁ'],
  [136, 'ㅂ'], [137, 'ㅅ'], [138, 'ㅇ'], [139, 'ㅈ'], [140, 'ㅊ'],
  [141, 'ㅋ'], [142, 'ㅌ'], [143, 'ㅍ'], [144, 'ㅎ'],
  [145, 'ㅏ'], [146, 'ㅑ'], [147, 'ㅓ'], [148, 'ㅕ'], [149, 'ㅗ'],
  [150, 'ㅛ'], [151, 'ㅜ'], [152, 'ㅠ'], [153, 'ㅡ'], [154, 'ㅣ'],
  [155, 'ㅐ'], [156, 'ㅒ'], [157, 'ㅔ'], [158, 'ㅖ'],
  
  // 🔥 고급 종성 처리 (복합 받침)
  [159, 'ㄳ'], [160, 'ㄵ'], [161, 'ㄶ'], [162, 'ㄺ'], [163, 'ㄻ'],
  [164, 'ㄼ'], [165, 'ㄽ'], [166, 'ㄾ'], [167, 'ㄿ'], [168, 'ㅀ'], [169, 'ㅄ'],
  
  // 🔥 IME 조합 과정 중간 키코드들 (실험적)
  [170, 'ㄱ'], [171, 'ㄱ'], [172, 'ㄱ'], [173, 'ㄴ'], [174, 'ㄴ'],
  [175, 'ㄷ'], [176, 'ㄷ'], [177, 'ㄹ'], [178, 'ㄹ'], [179, 'ㅁ'],
  [180, 'ㅂ'], [181, 'ㅅ'], [182, 'ㅇ'], [183, 'ㅈ'], [184, 'ㅊ'],
  [185, 'ㅋ'], [186, 'ㅌ'], [187, 'ㅍ'], [188, 'ㅎ'], [189, 'ㅎ'],
  
  // 🔥 모음 조합 중간 과정
  [190, 'ㅏ'], [191, 'ㅏ'], [192, 'ㅓ'], [193, 'ㅓ'], [194, 'ㅗ'],
  [195, 'ㅗ'], [196, 'ㅜ'], [197, 'ㅜ'], [198, 'ㅡ'], [199, 'ㅣ'],
  
  // 🔥 macOS Carbon Event 키코드 (가능성)
  [3675, 'ㅇ'],  // 사용자 로그에서 발견
  [3676, 'ㅎ'],  [3677, 'ㅓ'],  [3678, 'ㅏ'],  [3679, 'ㅣ'],
  [3680, 'ㄱ'],  [3681, 'ㄴ'],  [3682, 'ㄷ'],  [3683, 'ㄹ'],  [3684, 'ㅁ']
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
