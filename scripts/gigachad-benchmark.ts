/**
 * GigaChad 벤치마크 스크립트
 * UI 컴포넌트 성능 측정 및 비교 분석
 */

import { benchmark, PerformanceTimer, measureMemory, COMMON_STYLES, getCardClassName, getButtonClassName } from '../src/renderer/components/common/common';

// #DEBUG: 벤치마크 테스트 시작
console.log('🔥 GigaChad 벤치마크 시작! 💪');

// Before 벤치마크 (중복 코드 버전)
const beforeCardClassName = () => {
  return 'bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer';
};

const beforeButtonClassName = () => {
  return 'px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium transition-colors';
};

// After 벤치마크 (모듈화 버전)
const afterCardClassName = () => {
  return getCardClassName({ variant: 'blue', hover: true });
};

const afterButtonClassName = () => {
  return getButtonClassName({ variant: 'primary', size: 'md' });
};

// 벤치마크 실행
const results = {
  before: {
    card: benchmark(beforeCardClassName, 'Before Card ClassName', 100000),
    button: benchmark(beforeButtonClassName, 'Before Button ClassName', 100000)
  },
  after: {
    card: benchmark(afterCardClassName, 'After Card ClassName', 100000),
    button: benchmark(afterButtonClassName, 'After Button ClassName', 100000)
  }
};

// 성능 비교 결과
const improvement = {
  card: ((results.after.card - results.before.card) / results.before.card * 100).toFixed(2),
  button: ((results.after.button - results.before.button) / results.before.button * 100).toFixed(2)
};

console.log('📊 벤치마크 결과:');
console.log(`Card ClassName: ${results.before.card} -> ${results.after.card} ops/sec (${improvement.card}% 개선)`);
console.log(`Button ClassName: ${results.before.button} -> ${results.after.button} ops/sec (${improvement.button}% 개선)`);

// 메모리 사용량 측정
measureMemory('벤치마크 완료');

export const benchmarkResults = {
  before: results.before,
  after: results.after,
  improvement: improvement,
  timestamp: new Date().toISOString()
};

export default benchmarkResults;
