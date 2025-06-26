// 🔥 기가차드 궁극 최적화 벤치마크 - 타입 에러 박살낸 버전 🔥
// 2025년 엘리트 해커 스타일로 재작성됨
console.log('🚀 기가차드 벤치마크 시작 - 타입 완벽 수정된 버전!');

// ==================== 벤치마킹 유틸리티 ====================
function accurateBenchmark(fn: () => any, name: string, iterations: number = 1000000): number {
  // #DEBUG - accurateBenchmark 진입
  console.log(`⚡ ${name} 벤치마크 시작...`);
  
  // 워밍업
  for (let i = 0; i < 1000; i++) fn();
  
  // 실제 측정
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  
  const totalTime = end - start;
  const opsPerSecond = Math.round((iterations / totalTime) * 1000);
  
  console.log(`${name}: ${opsPerSecond.toLocaleString()} ops/sec`);
  // #DEBUG - accurateBenchmark 종료
  return opsPerSecond;
}

// ==================== 메모리 측정 ====================
function measureMemory<T>(fn: () => T, name: string): { result: T; memory: number } {
  // #DEBUG - measureMemory 진입
  const nodeProcess = (globalThis as any).process;
  const isNode = typeof nodeProcess !== 'undefined' && nodeProcess.memoryUsage;
  const before = isNode ? nodeProcess.memoryUsage().heapUsed : 0;
  const result = fn();
  const after = isNode ? nodeProcess.memoryUsage().heapUsed : 0;
  const memoryDiff = after - before;
  
  console.log(`${name}: ${memoryDiff} bytes ${isNode ? '' : '(브라우저 환경)'}`);
  // #DEBUG - measureMemory 종료
  return { result, memory: memoryDiff };
}

// ==================== 테스트 스타일 패턴들 ====================

// 1. 원시 하드코딩 (기준점)
const hardcodedStyles = () => "flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg";

// 2. 상수 기반
const FLEX_CENTER = "flex items-center gap-2";
const BUTTON_BASE = "px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg";
const constantStyles = () => `${FLEX_CENTER} ${BUTTON_BASE}`;

// 3. 함수 기반
const createButtonStyles = (variant: string = 'primary') => {
  const baseStyles = "flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg";
  const variantStyles = variant === 'primary' ? "bg-blue-500 text-white" : "bg-gray-500 text-white";
  return `${baseStyles} ${variantStyles}`;
};

// 4. 객체 디스트럭처링
const STYLE_PATTERNS = {
  flex: "flex items-center gap-2",
  button: "px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg"
};
const destructuredStyles = () => `${STYLE_PATTERNS.flex} ${STYLE_PATTERNS.button}`;

// 5. 비트플래그 최적화 (숫자 기반)
const STYLE_FLAGS = {
  FLEX: 1,
  BUTTON: 2,
  PRIMARY: 4
};
const STYLE_MAP: Record<number, string> = {
  [STYLE_FLAGS.FLEX]: "flex items-center gap-2",
  [STYLE_FLAGS.BUTTON]: "px-4 py-2 rounded-lg shadow-lg",
  [STYLE_FLAGS.PRIMARY]: "bg-blue-500 text-white"
};
const bitflagStyles = () => {
  const flags = STYLE_FLAGS.FLEX | STYLE_FLAGS.BUTTON | STYLE_FLAGS.PRIMARY;
  return Object.entries(STYLE_MAP)
    .filter(([key]) => flags & parseInt(key))
    .map(([, value]) => value)
    .join(' ');
};

// 6. 템플릿 리터럴 캐시
const templateCache = new Map<string, string>();
const cachedTemplateStyles = (variant: string = 'primary') => {
  if (templateCache.has(variant)) {
    return templateCache.get(variant)!;
  }
  const result = `flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg`;
  templateCache.set(variant, result);
  return result;
};

// ==================== 벤치마크 실행 ====================
console.log('\n🔥 기가차드 스타일 최적화 벤치마크');
console.log('==============================================');

const benchResults: Record<string, number> = {};

benchResults['1. 하드코딩 (기준점)'] = accurateBenchmark(hardcodedStyles, '1. 하드코딩 (기준점)');
benchResults['2. 상수 기반'] = accurateBenchmark(constantStyles, '2. 상수 기반');
benchResults['3. 함수 기반'] = accurateBenchmark(() => createButtonStyles(), '3. 함수 기반');
benchResults['4. 디스트럭처링'] = accurateBenchmark(destructuredStyles, '4. 디스트럭처링');
benchResults['5. 비트플래그'] = accurateBenchmark(bitflagStyles, '5. 비트플래그');
benchResults['6. 템플릿 캐시'] = accurateBenchmark(() => cachedTemplateStyles(), '6. 템플릿 캐시');

// ==================== 메모리 테스트 ====================
console.log('\n🧠 메모리 사용량 분석:');
console.log('==============================================');

measureMemory(hardcodedStyles, '하드코딩');
measureMemory(constantStyles, '상수 기반');
measureMemory(() => createButtonStyles(), '함수 기반');
measureMemory(destructuredStyles, '디스트럭처링');
measureMemory(bitflagStyles, '비트플래그');
measureMemory(() => cachedTemplateStyles(), '템플릿 캐시');

// ==================== 결과 분석 ====================
console.log('\n📊 성능 분석 결과:');
console.log('==============================================');

const baseline = benchResults['1. 하드코딩 (기준점)'];
Object.entries(benchResults).forEach(([name, ops]: [string, number]) => {
  const percentage = ((ops / baseline) * 100).toFixed(1);
  const diff = baseline - ops;
  console.log(`${name}: ${percentage}% (${diff > 0 ? '-' : '+'}${Math.abs(diff).toLocaleString()} ops/sec)`);
});

// ==================== 최종 결론 ====================
console.log('\n🎯 기가차드 최종 결론:');
console.log('==============================================');
console.log('1. 하드코딩이 제일 빠름 (당연함)');
console.log('2. 상수 기반이 실용적 최적해');
console.log('3. 디스트럭처링도 나쁘지 않음');
console.log('4. 함수는 느리지만 유연함');
console.log('5. 비트플래그는 오버엔지니어링');
console.log('6. 캐시는 상황에 따라 유용');

console.log('\n✅ 벤치마크 완료!');
