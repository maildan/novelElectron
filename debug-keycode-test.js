// 🔥 keycode 조건문 테스트
console.log('=== keycode 조건문 디버깅 ===');

const testKeycodes = [18, 35, 42, 50, 57, 65];

for (const keycode of testKeycodes) {
  console.log(`\nkeycode: ${keycode} (0x${keycode.toString(16)})`);
  
  // 조건 1: <= 31
  const condition1 = keycode <= 31;
  console.log(`  keycode <= 31: ${condition1}`);
  
  // 조건 2: >= 32 && <= 47
  const condition2 = keycode >= 32 && keycode <= 47;
  console.log(`  keycode >= 32 && <= 47: ${condition2}`);
  
  // 조건 3: >= 58 && <= 64
  const condition3 = keycode >= 58 && keycode <= 64;
  console.log(`  keycode >= 58 && <= 64: ${condition3}`);
  
  // 전체 조건
  const shouldBeEnglish = condition1 || condition2 || condition3;
  console.log(`  → 영어로 분류되어야 함: ${shouldBeEnglish}`);
}

console.log('\n=== 실제 범위 확인 ===');
console.log('제어문자 (0-31):', Array.from({length: 32}, (_, i) => i));
console.log('특수문자 (32-47):', Array.from({length: 16}, (_, i) => 32 + i));
console.log('숫자 (48-57):', Array.from({length: 10}, (_, i) => 48 + i));
console.log('특수문자 (58-64):', Array.from({length: 7}, (_, i) => 58 + i));
console.log('대문자 (65-90):', Array.from({length: 26}, (_, i) => 65 + i));

console.log('\n=== 문제 분석 ===');
console.log('keycode 18: 제어문자 범위 (0-31) - 영어로 분류되어야 함');
console.log('keycode 35: 특수문자 범위 (32-47) - 영어로 분류되어야 함'); 
console.log('keycode 42: 특수문자 범위 (32-47) - 영어로 분류되어야 함');
