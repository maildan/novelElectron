// 🔥 기가차드 키보드 상수 정의 - 다국어 지원 전문!

import { Logger } from '../../shared/logger';

// #DEBUG: Keyboard constants entry point
Logger.debug('KEYBOARD_CONSTANTS', 'Keyboard constants module loaded');

// 🔥 기가차드 키 코드 매핑 상수
export const KEY_CODES = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  PAUSE: 19,
  CAPS_LOCK: 20,
  ESCAPE: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT_ARROW: 37,
  UP_ARROW: 38,
  RIGHT_ARROW: 39,
  DOWN_ARROW: 40,
  DELETE: 46,
  // 숫자 키
  DIGIT_0: 48,
  DIGIT_1: 49,
  DIGIT_2: 50,
  DIGIT_3: 51,
  DIGIT_4: 52,
  DIGIT_5: 53,
  DIGIT_6: 54,
  DIGIT_7: 55,
  DIGIT_8: 56,
  DIGIT_9: 57,
  // 알파벳 키
  KEY_A: 65,
  KEY_B: 66,
  KEY_C: 67,
  KEY_D: 68,
  KEY_E: 69,
  KEY_F: 70,
  KEY_G: 71,
  KEY_H: 72,
  KEY_I: 73,
  KEY_J: 74,
  KEY_K: 75,
  KEY_L: 76,
  KEY_M: 77,
  KEY_N: 78,
  KEY_O: 79,
  KEY_P: 80,
  KEY_Q: 81,
  KEY_R: 82,
  KEY_S: 83,
  KEY_T: 84,
  KEY_U: 85,
  KEY_V: 86,
  KEY_W: 87,
  KEY_X: 88,
  KEY_Y: 89,
  KEY_Z: 90,
} as const;

// 🔥 기가차드 한글 키 매핑
export const HANGUL_KEY_MAP = {
  // 자음 (영어 키 → 한글)
  'r': 'ㄱ',
  's': 'ㄴ', 
  'e': 'ㄷ',
  'f': 'ㄹ',
  'a': 'ㅁ',
  'q': 'ㅂ',
  't': 'ㅅ',
  'd': 'ㅇ',
  'w': 'ㅈ',
  'c': 'ㅊ',
  'z': 'ㅋ',
  'x': 'ㅌ',
  'v': 'ㅍ',
  'g': 'ㅎ',
  // 쌍자음
  'R': 'ㄲ',
  'E': 'ㄸ',
  'Q': 'ㅃ',
  'T': 'ㅆ',
  'W': 'ㅉ',
  // 모음
  'k': 'ㅏ',
  'i': 'ㅑ',
  'j': 'ㅓ',
  'u': 'ㅕ',
  'h': 'ㅗ',
  'y': 'ㅛ',
  'n': 'ㅜ',
  'b': 'ㅠ',
  'm': 'ㅡ',
  'l': 'ㅣ',
  // 복합모음
  'o': 'ㅐ',
  'O': 'ㅒ',
  'p': 'ㅔ',
  'P': 'ㅖ',
} as const;

// 🔥 기가차드 일본어 히라가나 키 매핑
export const HIRAGANA_KEY_MAP = {
  あ: 'a',
  い: 'i',
  う: 'u',
  え: 'e',
  お: 'o',
  か: 'ka',
  き: 'ki',
  く: 'ku',
  け: 'ke',
  こ: 'ko',
  が: 'ga',
  ぎ: 'gi',
  ぐ: 'gu',
  げ: 'ge',
  ご: 'go',
  さ: 'sa',
  し: 'shi',
  す: 'su',
  せ: 'se',
  そ: 'so',
  ざ: 'za',
  じ: 'ji',
  ず: 'zu',
  ぜ: 'ze',
  ぞ: 'zo',
  た: 'ta',
  ち: 'chi',
  つ: 'tsu',
  て: 'te',
  と: 'to',
  だ: 'da',
  ぢ: 'di',
  づ: 'du',
  で: 'de',
  ど: 'do',
  な: 'na',
  に: 'ni',
  ぬ: 'nu',
  ね: 'ne',
  の: 'no',
  は: 'ha',
  ひ: 'hi',
  ふ: 'fu',
  へ: 'he',
  ほ: 'ho',
  ば: 'ba',
  び: 'bi',
  ぶ: 'bu',
  べ: 'be',
  ぼ: 'bo',
  ぱ: 'pa',
  ぴ: 'pi',
  ぷ: 'pu',
  ぺ: 'pe',
  ぽ: 'po',
  ま: 'ma',
  み: 'mi',
  む: 'mu',
  め: 'me',
  も: 'mo',
  や: 'ya',
  ゆ: 'yu',
  よ: 'yo',
  ら: 'ra',
  り: 'ri',
  る: 'ru',
  れ: 're',
  ろ: 'ro',
  わ: 'wa',
  ゐ: 'wi',
  ゑ: 'we',
  を: 'wo',
  ん: 'n',
} as const;

// 🔥 기가차드 중국어 핀인 매핑 (간소화)
export const PINYIN_KEY_MAP = {
  // 기본 성모
  b: 'b',
  p: 'p',
  m: 'm',
  f: 'f',
  d: 'd',
  t: 't',
  n: 'n',
  l: 'l',
  g: 'g',
  k: 'k',
  h: 'h',
  j: 'j',
  q: 'q',
  x: 'x',
  z: 'z',
  c: 'c',
  s: 's',
  zh: 'zh',
  ch: 'ch',
  sh: 'sh',
  r: 'r',
  // 기본 운모
  a: 'a',
  o: 'o',
  e: 'e',
  i: 'i',
  u: 'u',
  ü: 'v',
} as const;

// 🔥 기가차드 언어별 특수 키 패턴
export const LANGUAGE_PATTERNS = {
  korean: {
    compositionKeys: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'],
    vowelKeys: ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'],
    spaceChar: ' ',
    wordBoundary: /[\s\.,!?\-]/,
  },
  japanese: {
    hiraganaRange: [0x3040, 0x309F],
    katakanaRange: [0x30A0, 0x30FF],
    kanjiRange: [0x4E00, 0x9FAF],
    spaceChar: '　', // 전각 스페이스
    wordBoundary: /[\s\。\、\！\？]/,
  },
  chinese: {
    hanziRange: [0x4E00, 0x9FFF],
    punctuation: ['，', '。', '！', '？', '；', '：'],
    spaceChar: '　', // 전각 스페이스
    wordBoundary: /[\s\，\。\！\？\；\：]/,
  },
  english: {
    alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    punctuation: '.,!?;:\'"()-',
    spaceChar: ' ',
    wordBoundary: /[\s\.,!?\-\(\)]/,
  },
} as const;

// 🔥 기가차드 키보드 이벤트 타입
export const KEYBOARD_EVENT_TYPES = {
  KEY_DOWN: 'keydown',
  KEY_UP: 'keyup',
  KEY_PRESS: 'keypress',
  COMPOSITION_START: 'compositionstart',
  COMPOSITION_UPDATE: 'compositionupdate',
  COMPOSITION_END: 'compositionend',
} as const;

// 🔥 기가차드 WPM 계산 상수
export const WPM_CONSTANTS = {
  AVERAGE_WORD_LENGTH: 5, // 평균 단어 길이
  MINUTE_IN_MS: 60000, // 1분 = 60000ms
  MIN_CHARS_FOR_WPM: 10, // WPM 계산 최소 글자 수
  CALCULATION_INTERVAL: 1000, // 1초마다 계산
  TYPING_TIMEOUT: 5000, // 5초 이상 입력 없으면 세션 종료
} as const;

// 🔥 기가차드 성능 임계값
export const PERFORMANCE_LIMITS = {
  MAX_EVENTS_PER_SECOND: 100,
  MAX_BUFFER_SIZE: 1000,
  BUFFER_FLUSH_INTERVAL: 5000, // 5초
  EVENT_DEBOUNCE_MS: 10,
  MEMORY_WARNING_MB: 50,
  MEMORY_CRITICAL_MB: 100,
} as const;

// 🔥 기가차드 키보드 상수 통합 객체
const KEYBOARD_CONSTANTS = {
  KEY_CODES,
  HANGUL_KEY_MAP,
  HIRAGANA_KEY_MAP,
  PINYIN_KEY_MAP,
  LANGUAGE_PATTERNS,
  KEYBOARD_EVENT_TYPES,
  WPM_CONSTANTS,
  PERFORMANCE_LIMITS,
} as const;

// #DEBUG: Keyboard constants exit point
Logger.debug('KEYBOARD_CONSTANTS', 'Keyboard constants module setup complete', {
  totalConstants: Object.keys(KEYBOARD_CONSTANTS).length
});

export default KEYBOARD_CONSTANTS;
