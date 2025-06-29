#!/usr/bin/env node

/**
 * 🔥 기가차드 한글 테스트 스크립트
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔥 기가차드 한글 감지 테스트 시작...');

// 1. 현재 macOS 입력소스 확인
try {
  console.log('\n📋 현재 macOS 입력소스:');
  const inputSources = execSync('defaults read ~/Library/Preferences/com.apple.HIToolbox.plist AppleSelectedInputSources', { encoding: 'utf8' });
  console.log(inputSources);
} catch (e) {
  console.log('⚠️ 입력소스 확인 실패:', e.message);
}

// 2. 테스트할 키코드들
const testKeycodes = [
  { code: 33, char: '!', expected: 'ㅂ (Q+Shift)' },
  { code: 34, char: '"', expected: 'ㅈ (W+Shift)' },
  { code: 40, char: '(', expected: 'ㅐ (O+Shift)' },
  { code: 70, char: 'F', expected: 'ㄹ (F키)' },
  { code: 65, char: 'A', expected: 'ㅁ (A키)' }
];

console.log('\n🎯 테스트 대상 키코드들:');
testKeycodes.forEach(test => {
  console.log(`  keycode ${test.code} (${test.char}) → ${test.expected}`);
});

// 3. 패치 적용 여부 확인
const languageDetectorPath = './src/main/keyboard/detectors/LanguageDetector.ts';
if (fs.existsSync(languageDetectorPath)) {
  const content = fs.readFileSync(languageDetectorPath, 'utf8');
  const hasPatch = content.includes('SPECIAL_CHAR_TO_HANGUL');
  
  console.log(`\n🔧 패치 상태: ${hasPatch ? '✅ 패치 적용됨' : '❌ 패치 미적용'}`);
  
  if (!hasPatch) {
    console.log('💡 패치를 적용하려면: node debug-scripts/apply-korean-patch.js');
  }
} else {
  console.log('❌ LanguageDetector.ts 파일을 찾을 수 없습니다.');
}

// 4. 개발 서버 실행 상태 확인
try {
  const processes = execSync('ps aux | grep -E "(electron|loop)" | grep -v grep', { encoding: 'utf8' });
  if (processes.trim()) {
    console.log('\n🚀 실행 중인 Loop 프로세스:');
    console.log(processes);
  } else {
    console.log('\n💤 Loop 앱이 실행되지 않음');
    console.log('💡 실행하려면: pnpm run dev');
  }
} catch (e) {
  console.log('\n💤 Loop 앱이 실행되지 않음');
}

console.log('\n📋 테스트 순서:');
console.log('1. 패치 적용: node debug-scripts/apply-korean-patch.js');  
console.log('2. 앱 실행: pnpm run dev');
console.log('3. 한글 키보드로 전환');
console.log('4. 한글 타이핑 테스트 (ㄱㄱㄱ, ㄹㄹㄹ 등)');
console.log('5. 로그 확인: 특수문자가 한글로 감지되는지 확인');
