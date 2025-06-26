/**
 * 🔥 기가차드 Zero Cost Benchmark 실행기
 */

// 벤치마크 함수
function benchmark(fn: () => any, name: string, iterations: number = 1000000): number {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  const opsPerSec = iterations / ((end - start) / 1000);
  console.log(`${name}: ${opsPerSec.toLocaleString()} ops/sec`);
  return opsPerSec;
}

// Zero Cost 상수들
const ZERO_COST_CARD_STYLES = {
  blueHover: 'bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer',
} as const;

const CARD_BLUE_HOVER = ZERO_COST_CARD_STYLES.blueHover;

function getCardStyle(key: 'blueHover'): string {
  return ZERO_COST_CARD_STYLES[key];
}

console.log('🔥 기가차드 ZERO COST 솔루션 벤치마크\n');

// 1. 원본 하드코딩 (100% 기준)
const hardcoded = () => 'bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer';

// 2. 함수 접근 (기존 방식)
const functionAccess = () => getCardStyle('blueHover');

// 3. 직접 상수 접근 (NEW!)
const directAccess = () => CARD_BLUE_HOVER;

// 4. 상수 destructuring (ULTRA NEW!)
const { blueHover } = ZERO_COST_CARD_STYLES;
const destructured = () => blueHover;

const hardcodedOps = benchmark(hardcoded, '1. 원본 하드코딩');
const functionOps = benchmark(functionAccess, '2. 함수 접근');
const directOps = benchmark(directAccess, '3. 직접 상수');
const destructuredOps = benchmark(destructured, '4. Destructured');

console.log('\n📊 성능 비교 (vs 하드코딩):');
console.log(`함수 접근: ${(functionOps/hardcodedOps*100).toFixed(1)}%`);
console.log(`직접 상수: ${(directOps/hardcodedOps*100).toFixed(1)}%`);
console.log(`Destructured: ${(destructuredOps/hardcodedOps*100).toFixed(1)}%`);

console.log('\n🔥 기가차드 결론:');
if (destructuredOps/hardcodedOps >= 0.95) {
  console.log('✅ Destructured 방식: 하드코딩급 성능! 모듈화 + 성능 둘 다 성공!');
} else {
  console.log('⚠️ Destructured 방식: 약간의 성능 저하');
}

if (directOps/hardcodedOps >= 0.95) {
  console.log('✅ 직접 상수 방식: 하드코딩급 성능! 완벽!');
} else {
  console.log('⚠️ 직접 상수 방식: 약간의 성능 저하');
}

const results = {
  hardcoded: hardcodedOps,
  function: functionOps,
  direct: directOps,
  destructured: destructuredOps,
  efficiency: {
    function: (functionOps/hardcodedOps*100).toFixed(1) + '%',
    direct: (directOps/hardcodedOps*100).toFixed(1) + '%',
    destructured: (destructuredOps/hardcodedOps*100).toFixed(1) + '%',
  }
};

console.log('\n📊 벤치마크 결과:');
console.log(JSON.stringify(results.efficiency, null, 2));
