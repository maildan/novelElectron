/**
 * 🔥 한국어 문자 변환 - 기가차드 Edition
 * 키보드 입력을 한글로 변환하는 핵심 로직
 */

import { KOREAN_KEYBOARD_LAYOUT, ENGLISH_KEYBOARD_LAYOUT } from './keyboardMap';
import { JamoPair } from './types';

/**
 * 키 코드를 한글 자모로 변환
 * @param keyCode 키보드 키 코드
 * @param shiftPressed Shift 키 눌림 여부
 * @param language 입력 언어 ('ko' | 'en' | 'ja' | 'zh')
 * @returns 변환된 문자 또는 null
 */
export function getKoreanChar(
  keyCode: number, 
  shiftPressed: boolean = false,
  language: 'ko' | 'en' | 'ja' | 'zh' = 'ko'
): string | null {
  
  // 한국어 모드
  if (language === 'ko') {
    const jamoPair = KOREAN_KEYBOARD_LAYOUT[keyCode];
    if (jamoPair) {
      // Shift 눌렸고 쌍자음/복합모음이 있으면 반환
      if (shiftPressed && jamoPair[1]) {
        return jamoPair[1];
      }
      // 기본 자모 반환
      return jamoPair[0];
    }
  }
  
  // 영어 모드 (fallback)
  const englishChar = ENGLISH_KEYBOARD_LAYOUT[keyCode];
  if (englishChar) {
    return shiftPressed ? englishChar.toUpperCase() : englishChar.toLowerCase();
  }
  
  return null;
}

/**
 * 문자가 한글 자모인지 확인
 * @param char 확인할 문자
 * @returns 한글 자모 여부
 */
export function isKoreanJamo(char: string): boolean {
  const code = char.charCodeAt(0);
  // 한글 자모 유니코드 범위
  return (code >= 0x1100 && code <= 0x11FF) || // 한글 자모
         (code >= 0x3130 && code <= 0x318F) || // 한글 호환 자모
         (code >= 0xAC00 && code <= 0xD7AF);   // 한글 완성형
}

/**
 * 한글 완성형 문자를 자모로 분해
 * @param char 분해할 완성형 한글
 * @returns [초성, 중성, 종성] 배열
 */
export function decomposeKorean(char: string): [string, string, string] {
  const code = char.charCodeAt(0) - 0xAC00;
  
  if (code < 0 || code > 11171) {
    return ['', '', ''];
  }
  
  const 초성_인덱스 = Math.floor(code / 588);
  const 중성_인덱스 = Math.floor((code % 588) / 28);
  const 종성_인덱스 = code % 28;
  
  const 초성 = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'][초성_인덱스];
  const 중성 = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'][중성_인덱스];
  const 종성 = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'][종성_인덱스];
  
  return [초성, 중성, 종성];
}

/**
 * 자모를 한글 완성형으로 결합
 * @param 초성 초성 자모
 * @param 중성 중성 자모  
 * @param 종성 종성 자모 (선택적)
 * @returns 완성된 한글 문자
 */
export function composeKorean(초성: string, 중성: string, 종성: string = ''): string {
  const 초성_배열 = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  const 중성_배열 = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
  const 종성_배열 = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  
  const 초성_인덱스 = 초성_배열.indexOf(초성);
  const 중성_인덱스 = 중성_배열.indexOf(중성);
  const 종성_인덱스 = 종성_배열.indexOf(종성);
  
  if (초성_인덱스 === -1 || 중성_인덱스 === -1 || 종성_인덱스 === -1) {
    return '';
  }
  
  const code = 0xAC00 + (초성_인덱스 * 588) + (중성_인덱스 * 28) + 종성_인덱스;
  return String.fromCharCode(code);
}

/**
 * 텍스트에서 한글 문자 개수 계산
 * @param text 분석할 텍스트
 * @returns 한글 문자 개수
 */
export function countKoreanChars(text: string): number {
  return text.split('').filter(char => isKoreanJamo(char)).length;
}

/**
 * WPM 계산 (한글 특화)
 * @param text 입력된 텍스트
 * @param timeMs 소요 시간 (밀리초)
 * @returns WPM 값
 */
export function calculateKoreanWPM(text: string, timeMs: number): number {
  if (timeMs === 0) return 0;
  
  // 한글은 1글자 = 1단어로 계산
  const koreanChars = countKoreanChars(text);
  const englishWords = text.split(/\s+/).filter(word => /[a-zA-Z]/.test(word)).length;
  
  const totalWords = koreanChars + englishWords;
  const minutes = timeMs / 60000;
  
  return Math.round(totalWords / minutes);
}
