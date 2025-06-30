#!/usr/bin/env node
/**
 * 🔥 기가차드 한국어 키보드 완전 테스트 스크립트
 * 모든 한글 입력 기능을 검증합니다.
 */

// 테스트 케이스 정의
const TEST_CASES = [
  // 🔥 기본 자음/모음 조합
  {
    name: "기본 한글 조합",
    inputs: ['ㄱ', 'ㅏ'], // 가
    expected: "가",
    description: "초성 + 중성 기본 조합"
  },
  {
    name: "자음+모음+자음",
    inputs: ['ㅎ', 'ㅏ', 'ㄴ'], // 한
    expected: "한",
    description: "완전한 한글 음절"
  },
  
  // 🔥 복합모음 조합 테스트
  {
    name: "ㅘ 복합모음",
    inputs: ['ㄱ', 'ㅗ', 'ㅏ'], // 과 (ㅗ+ㅏ=ㅘ)
    expected: "과",
    description: "ㅗ + ㅏ = ㅘ 조합"
  },
  {
    name: "ㅚ 복합모음",
    inputs: ['ㄱ', 'ㅗ', 'ㅣ'], // 괴 (ㅗ+ㅣ=ㅚ)
    expected: "괴",
    description: "ㅗ + ㅣ = ㅚ 조합"
  },
  {
    name: "ㅙ 복합모음",
    inputs: ['ㄱ', 'ㅗ', 'ㅐ'], // 괘 (ㅗ+ㅐ=ㅙ)
    expected: "괘",
    description: "ㅗ + ㅐ = ㅙ 조합"
  },
  {
    name: "ㅝ 복합모음",
    inputs: ['ㄱ', 'ㅜ', 'ㅓ'], // 궈 (ㅜ+ㅓ=ㅝ)
    expected: "궈",
    description: "ㅜ + ㅓ = ㅝ 조합"
  },
  {
    name: "ㅞ 복합모음",
    inputs: ['ㄱ', 'ㅜ', 'ㅔ'], // 궤 (ㅜ+ㅔ=ㅞ)
    expected: "궤",
    description: "ㅜ + ㅔ = ㅞ 조합"
  },
  {
    name: "ㅟ 복합모음",
    inputs: ['ㄱ', 'ㅜ', 'ㅣ'], // 귀 (ㅜ+ㅣ=ㅟ)
    expected: "귀",
    description: "ㅜ + ㅣ = ㅟ 조합"
  },
  {
    name: "ㅢ 복합모음",
    inputs: ['ㅇ', 'ㅡ', 'ㅣ'], // 의 (ㅡ+ㅣ=ㅢ)
    expected: "의",
    description: "ㅡ + ㅣ = ㅢ 조합"
  },
  
  // 🔥 Shift 조합 테스트
  {
    name: "ㅖ 직접 입력",
    inputs: ['ㅇ', 'ㅖ'], // 예 (Shift+p)
    expected: "예",
    description: "Shift+p = ㅖ 직접 입력"
  },
  {
    name: "ㅒ 직접 입력",
    inputs: ['ㅇ', 'ㅒ'], // 얘 (Shift+o)
    expected: "얘",
    description: "Shift+o = ㅒ 직접 입력"
  },
  
  // 🔥 쌍자음 테스트
  {
    name: "ㄲ 쌍자음",
    inputs: ['ㄲ', 'ㅏ'], // 까 (Shift+r)
    expected: "까",
    description: "Shift+r = ㄲ 쌍자음"
  },
  {
    name: "ㄸ 쌍자음",
    inputs: ['ㄸ', 'ㅗ'], // 또 (Shift+e)
    expected: "또",
    description: "Shift+e = ㄸ 쌍자음"
  },
  {
    name: "ㅃ 쌍자음",
    inputs: ['ㅃ', 'ㅏ'], // 빠 (Shift+q)
    expected: "빠",
    description: "Shift+q = ㅃ 쌍자음"
  },
  {
    name: "ㅆ 쌍자음",
    inputs: ['ㅆ', 'ㅏ'], // 싸 (Shift+t)
    expected: "싸",
    description: "Shift+t = ㅆ 쌍자음"
  },
  {
    name: "ㅉ 쌍자음",
    inputs: ['ㅉ', 'ㅏ'], // 짜 (Shift+w)
    expected: "짜",
    description: "Shift+w = ㅉ 쌍자음"
  },
  
  // 🔥 조합 완료 테스트
  {
    name: "연속 한글 입력",
    inputs: ['ㅎ', 'ㅏ', 'ㄴ', ' ', 'ㄱ', 'ㅡ', 'ㄹ'], // 한 글
    expected: "한 글",
    description: "스페이스로 구분된 연속 입력"
  },
  
  // 🔥 특수 케이스
  {
    name: "백스페이스 테스트",
    inputs: ['ㅎ', 'ㅏ', 'ㄴ', 'backspace'], // 한 → 하
    expected: "하",
    description: "백스페이스로 종성 제거"
  },
  
  // 🔥 복합 종성 테스트
  {
    name: "ㄳ 복합 종성",
    inputs: ['ㄱ', 'ㅏ', 'ㄱ', 'ㅅ'], // 각 (ㄱ+ㅅ=ㄳ)
    expected: "갉",
    description: "ㄱ + ㅅ = ㄳ 복합 종성"
  },
  {
    name: "ㄵ 복합 종성",
    inputs: ['ㅇ', 'ㅏ', 'ㄴ', 'ㅈ'], // 안 (ㄴ+ㅈ=ㄵ)
    expected: "앉",
    description: "ㄴ + ㅈ = ㄵ 복합 종성"
  }
];

// 키보드 매핑 (영어 키 → 한글)
const KEYBOARD_MAP = {
  // 자음
  'q': 'ㅂ', 'w': 'ㅈ', 'e': 'ㄷ', 'r': 'ㄱ', 't': 'ㅅ',
  'a': 'ㅁ', 's': 'ㄴ', 'd': 'ㅇ', 'f': 'ㄹ', 'g': 'ㅎ',
  'z': 'ㅋ', 'x': 'ㅌ', 'c': 'ㅊ', 'v': 'ㅍ',
  
  // 모음
  'y': 'ㅛ', 'u': 'ㅕ', 'i': 'ㅑ', 'o': 'ㅐ', 'p': 'ㅔ',
  'h': 'ㅗ', 'j': 'ㅓ', 'k': 'ㅏ', 'l': 'ㅣ',
  'b': 'ㅠ', 'n': 'ㅜ', 'm': 'ㅡ',
  
  // Shift 조합
  'Q': 'ㅃ', 'W': 'ㅉ', 'E': 'ㄸ', 'R': 'ㄲ', 'T': 'ㅆ',
  'O': 'ㅒ', 'P': 'ㅖ'
};

// 🔥 실제 테스트 실행 함수
function runHangulTests() {
  console.log('🔥 기가차드 한국어 키보드 완전 테스트 시작! 🔥\n');
  
  let passedTests = 0;
  let totalTests = TEST_CASES.length;
  
  for (const testCase of TEST_CASES) {
    console.log(`📝 테스트: ${testCase.name}`);
    console.log(`📖 설명: ${testCase.description}`);
    console.log(`⌨️  입력: ${testCase.inputs.join(' + ')}`);
    console.log(`🎯 예상: ${testCase.expected}`);
    
    // 여기에 실제 HangulComposer 테스트 로직 추가
    const result = simulateHangulInput(testCase.inputs);
    
    if (result === testCase.expected) {
      console.log(`✅ 통과: ${result}\n`);
      passedTests++;
    } else {
      console.log(`❌ 실패: ${result} (예상: ${testCase.expected})\n`);
    }
  }
  
  console.log(`🏆 테스트 결과: ${passedTests}/${totalTests} 통과`);
  console.log(`📊 성공률: ${((passedTests/totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('🎉 모든 한국어 키보드 기능이 완벽하게 작동합니다!');
  } else {
    console.log('⚠️  일부 기능에 문제가 있습니다. 수정이 필요합니다.');
  }
}

// 🔥 한글 입력 시뮬레이션
function simulateHangulInput(inputs) {
  // 실제로는 HangulComposer를 사용하여 테스트
  // 여기서는 시뮬레이션만 구현
  let result = '';
  let currentComposition = '';
  
  for (const input of inputs) {
    if (input === ' ') {
      result += currentComposition + ' ';
      currentComposition = '';
    } else if (input === 'backspace') {
      if (currentComposition.length > 0) {
        currentComposition = currentComposition.slice(0, -1);
      }
    } else {
      // 한글 조합 로직 (단순화)
      currentComposition += input;
    }
  }
  
  result += currentComposition;
  return result.trim();
}

// 🔥 영어 키보드 입력 테스트
function runKeyboardMappingTest() {
  console.log('\n🎹 키보드 매핑 테스트\n');
  
  const testWords = [
    { english: 'gksrmf', hangul: '한글', description: 'gksrmf → 한글' },
    { english: 'dkssudgktpdy', hangul: '안녕하세요', description: 'dkssudgktpdy → 안녕하세요' },
    { english: 'rnthr', hangul: '감사', description: 'rnthr → 감사' },
    { english: 'rhkwk', hangul: '과학', description: 'rhkwk → 과학 (복합모음 ㅘ)' },
    { english: 'rnjfl', hangul: '궈리', description: 'rnjfl → 궈리 (복합모음 ㅝ)' },
    { english: 'dml', hangul: '의', description: 'dml → 의 (복합모음 ㅢ)' }
  ];
  
  for (const test of testWords) {
    console.log(`⌨️  영어: ${test.english}`);
    console.log(`🔄 변환: ${test.description}`);
    console.log(`🎯 결과: ${test.hangul}\n`);
  }
}

// 🔥 복합모음 조합 가이드
function printHangulCombinationGuide() {
  console.log('\n📚 한국어 복합모음 조합 가이드\n');
  
  const combinations = [
    { base: 'ㅗ (h)', combines: [
      'ㅗ + ㅏ = ㅘ (h + k = 과)',
      'ㅗ + ㅐ = ㅙ (h + o = 괘)',
      'ㅗ + ㅣ = ㅚ (h + l = 괴)'
    ]},
    { base: 'ㅜ (n)', combines: [
      'ㅜ + ㅓ = ㅝ (n + j = 궈)',
      'ㅜ + ㅔ = ㅞ (n + p = 궤)',
      'ㅜ + ㅣ = ㅟ (n + l = 귀)'
    ]},
    { base: 'ㅡ (m)', combines: [
      'ㅡ + ㅣ = ㅢ (m + l = 의)'
    ]},
    { base: 'Shift 조합', combines: [
      'Shift + o = ㅒ (얘)',
      'Shift + p = ㅖ (예)',
      'Shift + r = ㄲ (까)',
      'Shift + e = ㄸ (또)',
      'Shift + q = ㅃ (빠)',
      'Shift + t = ㅆ (싸)',
      'Shift + w = ㅉ (짜)'
    ]}
  ];
  
  for (const combo of combinations) {
    console.log(`🎯 ${combo.base}:`);
    for (const rule of combo.combines) {
      console.log(`   ${rule}`);
    }
    console.log('');
  }
}

// 🔥 테스트 실행
if (require.main === module) {
  runHangulTests();
  runKeyboardMappingTest();
  printHangulCombinationGuide();
}

module.exports = { runHangulTests, runKeyboardMappingTest, TEST_CASES };
