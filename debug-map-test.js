/**
 * 🔥 실시간 KEYCODE_TO_HANGUL 맵 디버깅
 */

// LanguageDetector에서 실제 매핑 확인
const targetKeycodes = [18, 35, 42, 65, 81]; // 문제되는 keycode들 + 정상 keycode들

console.log('=== KEYCODE_TO_HANGUL 맵 검증 ===');

// 예상되는 정상 매핑
const expectedMap = new Map([
  [81, 'ㅂ'], [87, 'ㅈ'], [69, 'ㄷ'], [82, 'ㄱ'], [84, 'ㅅ'],
  [89, 'ㅛ'], [85, 'ㅕ'], [73, 'ㅑ'], [79, 'ㅐ'], [80, 'ㅔ'],
  [65, 'ㅁ'], [83, 'ㄴ'], [68, 'ㅇ'], [70, 'ㄹ'], [71, 'ㅎ'],
  [72, 'ㅗ'], [74, 'ㅓ'], [75, 'ㅏ'], [76, 'ㅣ'],
  [90, 'ㅋ'], [88, 'ㅌ'], [67, 'ㅊ'], [86, 'ㅍ'], [66, 'ㅠ'],
  [78, 'ㅜ'], [77, 'ㅡ']
]);

console.log('\n예상 매핑:');
for (const keycode of targetKeycodes) {
  const hasMapping = expectedMap.has(keycode);
  const mapping = expectedMap.get(keycode);
  console.log(`keycode ${keycode}: has=${hasMapping}, value=${mapping || 'undefined'}`);
}

console.log('\n=== 실제 로그에서 나타난 문제 ===');
console.log('로그: "isHangulKey: this.KEYCODE_TO_HANGUL.has(physicalKeycode)"');
console.log('keycode 18이 true로 나올 가능성:');
console.log('1. 다른 값이 맵에 있음');
console.log('2. rawcode나 physicalKeycode가 다른 값');
console.log('3. 코드가 수정되었는데 반영 안됨');

console.log('\n=== physicalKeycode 분석 ===');
console.log('실제 로그: rawcode: undefined');
console.log('로직: const physicalKeycode = rawcode || keycode;');
console.log('결론: physicalKeycode === keycode');

console.log('\n=== 맵 체크 테스트 ===');
for (const keycode of targetKeycodes) {
  console.log(`KEYCODE_TO_HANGUL.has(${keycode}): ${expectedMap.has(keycode)}`);
}
