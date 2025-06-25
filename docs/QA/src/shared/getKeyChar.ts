// 기가차드의 다국어 키보드 문자 변환 함수
import { KOREAN_KEYBOARD_LAYOUT, JAPANESE_KEYBOARD_LAYOUT, CHINESE_KEYBOARD_LAYOUT, ENGLISH_KEYBOARD_LAYOUT } from './keyboardMap';

export type SupportedLanguage = 'korean' | 'japanese' | 'chinese' | 'english';

/**
 * 키코드를 한국어 자모로 변환
 */
export function getKoreanChar(keycode: number, isShift = false): string {
  const pair = KOREAN_KEYBOARD_LAYOUT[keycode];
  if (!pair) return getEnglishChar(keycode);
  
  // shift 쌍이 있으면 사용, 없으면 항상 normal
  return isShift && pair[1] ? pair[1] : pair[0];
}

/**
 * 키코드를 일본어 히라가나로 변환
 */
export function getJapaneseChar(keycode: number): string {
  const pair = JAPANESE_KEYBOARD_LAYOUT[keycode];
  if (!pair) return getEnglishChar(keycode);
  
  return pair[0];
}

/**
 * 키코드를 중국어 병음으로 변환
 */
export function getChineseChar(keycode: number): string {
  const pair = CHINESE_KEYBOARD_LAYOUT[keycode];
  if (!pair) return getEnglishChar(keycode);
  
  return pair[0];
}

/**
 * 키코드를 영어 문자로 변환 (기본)
 */
export function getEnglishChar(keycode: number): string {
  const char = ENGLISH_KEYBOARD_LAYOUT[keycode];
  return char || `Key${keycode}`;
}

/**
 * 언어별 키 문자 변환 통합 함수
 */
export function getCharByLanguage(
  keycode: number, 
  language: SupportedLanguage = 'english',
  isShift = false
): string {
  switch (language) {
    case 'korean':
      return getKoreanChar(keycode, isShift);
    case 'japanese':
      return getJapaneseChar(keycode);
    case 'chinese':
      return getChineseChar(keycode);
    case 'english':
    default:
      return getEnglishChar(keycode);
  }
}

// 호환성을 위한 별칭
export const getKeyChar = getCharByLanguage;
