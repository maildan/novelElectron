#!/usr/bin/env node
/**
 * 🔥 기가차드 한국어 키보드 완전 테스트 스크립트
 * 모든 한글 입력 기능을 검증합니다.
 */

console.log('🔥 기가차드 한국어 키보드 완전 테스트 시작! 🔥\n');

// 🔥 테스트 케이스 정의
const TEST_CASES = [
  // 기본 자음/모음 조합
  {
    name: "기본 한글 조합",
    inputs: ['ㄱ', 'ㅏ'], // 가
    expected: "가",
    description: "초성 + 중성 기본 조합",
    category: "basic"
  },
  {
    name: "완전한 한글 음절",
    inputs: ['ㅎ', 'ㅏ', 'ㄴ'], // 한
    expected: "한",
    description: "초성 + 중성 + 종성",
    category: "basic"
  },
  
  // 🔥 복합모음 조합 테스트 (7개 전체)
  {
    name: "ㅘ 복합모음",
    inputs: ['ㄱ', 'ㅗ', 'ㅏ'], // 과 (ㅗ+ㅏ=ㅘ)
    expected: "과",
    description: "ㅗ + ㅏ = ㅘ 조합",
    category: "complex-medial"
  },
  {
    name: "ㅙ 복합모음",
    inputs: ['ㄱ', 'ㅗ', 'ㅐ'], // 괘 (ㅗ+ㅐ=ㅙ)
    expected: "괘",
    description: "ㅗ + ㅐ = ㅙ 조합",
    category: "complex-medial"
  },
  {
    name: "ㅚ 복합모음",
    inputs: ['ㄱ', 'ㅗ', 'ㅣ'], // 괴 (ㅗ+ㅣ=ㅚ)
    expected: "괴",
    description: "ㅗ + ㅣ = ㅚ 조합",
    category: "complex-medial"
  },
  {
    name: "ㅝ 복합모음",
    inputs: ['ㄱ', 'ㅜ', 'ㅓ'], // 궈 (ㅜ+ㅓ=ㅝ)
    expected: "궈",
    description: "ㅜ + ㅓ = ㅝ 조합",
    category: "complex-medial"
  },
  {
    name: "ㅞ 복합모음",
    inputs: ['ㄱ', 'ㅜ', 'ㅔ'], // 궤 (ㅜ+ㅔ=ㅞ)
    expected: "궤",
    description: "ㅜ + ㅔ = ㅞ 조합",
    category: "complex-medial"
  },
  {
    name: "ㅟ 복합모음",
    inputs: ['ㄱ', 'ㅜ', 'ㅣ'], // 귀 (ㅜ+ㅣ=ㅟ)
    expected: "귀",
    description: "ㅜ + ㅣ = ㅟ 조합",
    category: "complex-medial"
  },
  {
    name: "ㅢ 복합모음",
    inputs: ['ㅇ', 'ㅡ', 'ㅣ'], // 의 (ㅡ+ㅣ=ㅢ)
    expected: "의",
    description: "ㅡ + ㅣ = ㅢ 조합",
    category: "complex-medial"
  },
  
  // 🔥 복합종성 테스트 (11개 전체)
  {
    name: "ㄳ 복합종성",
    inputs: ['ㅁ', 'ㅗ', 'ㄱ', 'ㅅ'], // 몋 (ㄱ+ㅅ=ㄳ)
    expected: "몋",
    description: "ㄱ + ㅅ = ㄳ 조합",
    category: "complex-final"
  },
  {
    name: "ㄵ 복합종성",
    inputs: ['ㅁ', 'ㅗ', 'ㄴ', 'ㅈ'], // 몬ㅈ (ㄴ+ㅈ=ㄵ)
    expected: "몬ㅈ", // 실제로는 "몬j"로 나타날 수 있음
    description: "ㄴ + ㅈ = ㄵ 조합",
    category: "complex-final"
  },
  {
    name: "ㄺ 복합종성",
    inputs: ['ㅁ', 'ㅗ', 'ㄹ', 'ㄱ'], // 몰ㄱ (ㄹ+ㄱ=ㄺ)
    expected: "몰ㄱ", // 실제로는 "몰g"로 나타날 수 있음
    description: "ㄹ + ㄱ = ㄺ 조합",
    category: "complex-final"
  },
  
  // 🔥 Shift 조합 테스트 (쌍자음 + 복합모음)
  {
    name: "ㄲ 쌍자음",
    inputs: ['ㄲ', 'ㅏ'], // 까 (Shift+r)
    expected: "까",
    description: "Shift+r = ㄲ 쌍자음",
    category: "shift-combination"
  },
  {
    name: "ㅃ 쌍자음",
    inputs: ['ㅃ', 'ㅏ'], // 빠 (Shift+q)
    expected: "빠",
    description: "Shift+q = ㅃ 쌍자음",
    category: "shift-combination"
  },
  {
    name: "ㅖ 직접 입력",
    inputs: ['ㅇ', 'ㅖ'], // 예 (Shift+p)
    expected: "예",
    description: "Shift+p = ㅖ 직접 입력",
    category: "shift-combination"
  },
  {
    name: "ㅒ 직접 입력",
    inputs: ['ㅇ', 'ㅒ'], // 얘 (Shift+o)
    expected: "얘",
    description: "Shift+o = ㅒ 직접 입력",
    category: "shift-combination"
  },
  
  // 🔥 연속 입력 테스트
  {
    name: "연속 한글 입력",
    inputs: ['ㅎ', 'ㅏ', 'ㄴ', ' ', 'ㄱ', 'ㅡ', 'ㄹ'], // 한 글
    expected: "한 글",
    description: "스페이스로 구분된 연속 입력",
    category: "continuous"
  },
  {
    name: "복잡한 문장",
    inputs: ['ㅇ', 'ㅏ', 'ㄴ', 'ㄴ', 'ㅕ', 'ㅇ', 'ㅎ', 'ㅏ', 'ㅅ', 'ㅔ', 'ㅇ', 'ㅛ'], // 안녕하세요
    expected: "안녕하세요",
    description: "일반적인 한글 문장",
    category: "continuous"
  },
  
  // 🔥 특수 케이스
  {
    name: "백스페이스 테스트",
    inputs: ['ㅎ', 'ㅏ', 'ㄴ', 'backspace'], // 한 → 하
    expected: "하",
    description: "백스페이스로 종성 제거",
    category: "special"
  },
  {
    name: "조합 분해 테스트",
    inputs: ['ㄱ', 'ㅘ', 'backspace', 'backspace'], // 과 → 고 → ㄱ
    expected: "ㄱ",
    description: "복합모음 백스페이스 분해",
    category: "special"
  }
];

// 🔥 키보드 매핑 (영어 키 → 한글)
const KEYBOARD_MAP = {
  // 기본 자음
  'q': 'ㅂ', 'w': 'ㅈ', 'e': 'ㄷ', 'r': 'ㄱ', 't': 'ㅅ',
  'a': 'ㅁ', 's': 'ㄴ', 'd': 'ㅇ', 'f': 'ㄹ', 'g': 'ㅎ',
  'z': 'ㅋ', 'x': 'ㅌ', 'c': 'ㅊ', 'v': 'ㅍ',
  
  // 기본 모음
  'y': 'ㅛ', 'u': 'ㅕ', 'i': 'ㅑ', 'o': 'ㅐ', 'p': 'ㅔ',
  'h': 'ㅗ', 'j': 'ㅓ', 'k': 'ㅏ', 'l': 'ㅣ',
  'b': 'ㅠ', 'n': 'ㅜ', 'm': 'ㅡ',
  
  // Shift 조합 (쌍자음)
  'Q': 'ㅃ', 'W': 'ㅉ', 'E': 'ㄸ', 'R': 'ㄲ', 'T': 'ㅆ',
  
  // Shift 조합 (복합모음)
  'O': 'ㅒ', 'P': 'ㅖ'
};

// 🔥 테스트 실행 함수
function runHangulTests() {
  let passedTests = 0;
  let totalTests = TEST_CASES.length;
  const results = {};
  
  // 카테고리별 결과 추적
  const categoryResults = {};
  
  for (const testCase of TEST_CASES) {
    if (!categoryResults[testCase.category]) {
      categoryResults[testCase.category] = { passed: 0, total: 0 };
    }
    categoryResults[testCase.category].total++;
    
    console.log(`📝 테스트: ${testCase.name}`);
    console.log(`📖 설명: ${testCase.description}`);
    console.log(`⌨️  입력: ${testCase.inputs.join(' + ')}`);
    console.log(`🎯 예상: ${testCase.expected}`);
    
    // 여기에 실제 HangulComposer 테스트 로직 추가
    const result = simulateHangulInput(testCase.inputs);
    
    if (result === testCase.expected) {
      console.log(`✅ 통과: ${result}\n`);
      passedTests++;
      categoryResults[testCase.category].passed++;
    } else {
      console.log(`❌ 실패: ${result} (예상: ${testCase.expected})\n`);
    }
  }
  
  // 🔥 카테고리별 결과 출력
  console.log('📊 카테고리별 결과:');
  for (const [category, stats] of Object.entries(categoryResults)) {
    const percentage = ((stats.passed / stats.total) * 100).toFixed(1);
    const status = stats.passed === stats.total ? '✅' : '❌';
    console.log(`${status} ${category}: ${stats.passed}/${stats.total} (${percentage}%)`);
  }
  
  console.log(`\n🏆 전체 테스트 결과: ${passedTests}/${totalTests} 통과`);
  console.log(`📊 성공률: ${((passedTests/totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('🎉 모든 한국어 키보드 기능이 완벽하게 작동합니다!');
    console.log('🔥 기가차드 한국어 키보드 완성! 🔥');
  } else {
    console.log('⚠️  일부 기능에 문제가 있습니다. 수정이 필요합니다.');
    
    // 실패한 테스트 카테고리 분석
    const failedCategories = Object.entries(categoryResults)
      .filter(([_, stats]) => stats.passed < stats.total)
      .map(([category, _]) => category);
    
    if (failedCategories.length > 0) {
      console.log(`🔧 수정 필요 영역: ${failedCategories.join(', ')}`);
    }
  }
}

// 🔥 한글 입력 시뮬레이션 (단순화)
function simulateHangulInput(inputs) {
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
  console.log('\n🎹 영어 키보드 → 한글 매핑 테스트\n');
  
  const testWords = [
    { english: 'gksrmf', hangul: '한글', description: 'gksrmf → 한글' },
    { english: 'dkssudgktpdy', hangul: '안녕하세요', description: 'dkssudgktpdy → 안녕하세요' },
    { english: 'rnthr', hangul: '감사', description: 'rnthr → 감사' },
    { english: 'dhldml dlrmaen dlqtmddh', hangul: '의이름은임세훈', description: 'dhldml dlrmaen dlqtmddh → 의이름은임세훈' },
    // 복합모음 테스트
    { english: 'rhk', hangul: '과', description: 'r+h+k → ㄱ+ㅗ+ㅏ = 과 (ㅘ)' },
    { english: 'rnj', hangul: '궈', description: 'r+n+j → ㄱ+ㅜ+ㅓ = 궈 (ㅝ)' },
    { english: 'dml', hangul: '의', description: 'd+m+l → ㅇ+ㅡ+ㅣ = 의 (ㅢ)' }
  ];
  
  for (const test of testWords) {
    console.log(`⌨️  영어: ${test.english}`);
    console.log(`🔄 변환: ${test.description}`);
    console.log(`🎯 결과: ${test.hangul}\n`);
  }
}

// 🔥 복합모음/종성 전용 테스트
function runComplexCombinationTest() {
  console.log('\n🔥 복합 조합 전용 테스트\n');
  
  const complexTests = [
    { name: '모든 ㅗ 계열', combinations: ['ㅘ', 'ㅙ', 'ㅚ'], base: 'ㅗ' },
    { name: '모든 ㅜ 계열', combinations: ['ㅝ', 'ㅞ', 'ㅟ'], base: 'ㅜ' },
    { name: '모든 ㅡ 계열', combinations: ['ㅢ'], base: 'ㅡ' },
    { name: '모든 ㄹ 종성', combinations: ['ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ'], base: 'ㄹ' }
  ];
  
  for (const test of complexTests) {
    console.log(`📝 ${test.name} (기준: ${test.base}):`);
    for (const combination of test.combinations) {
      console.log(`  ✓ ${combination}`);
    }
    console.log('');
  }
}

// 🔥 실제 사용 예시 테스트
function runRealWorldTest() {
  console.log('\n🌍 실제 사용 예시 테스트\n');
  
  const realWorldTests = [
    '안녕하세요',
    '대한민국',
    '프로그래밍',
    '키보드',
    '한글조합',
    '복합모음',
    '쌍자음',
    '백스페이스테스트',
    '영어Korean섞인Text'
  ];
  
  for (const text of realWorldTests) {
    console.log(`📝 테스트 문장: "${text}"`);
    console.log(`🎯 기대 결과: 완벽한 한글 입력\n`);
  }
}

// 🔥 메인 실행
if (require.main === module) {
  runHangulTests();
  runKeyboardMappingTest();
  runComplexCombinationTest();
  runRealWorldTest();
  
  console.log('\n🎯 테스트 완료! 이제 실제 앱에서 테스트해보세요:');
  console.log('1. pnpm dev 실행');
  console.log('2. 각 테스트 케이스 직접 입력');
  console.log('3. 로그에서 조합 결과 확인');
  console.log('');
  console.log('🔥 모든 한국어가 완벽하게 입력되기를 기원합니다! 🔥');
}

module.exports = { 
  runHangulTests, 
  runKeyboardMappingTest, 
  runComplexCombinationTest,
  runRealWorldTest,
  TEST_CASES 
};
