# Utils & Common 가이드

> 🔥 **공통 유틸리티 & 디버깅 도구** - 생산성 극대화 도구들

## 개요

`@shared/common`에서 제공하는 유틸리티 함수들은 디버깅, 벤치마킹, 상태 관리 등을 위한 강력한 도구들입니다.
모든 함수는 타입 안전하며 실전에서 바로 사용할 수 있습니다.

```ts
import { 
  debugEntry, 
  debugExit, 
  gigaBenchmark, 
  getStatusColor,
  KEYBOARD_CONSTANTS,
  ERROR_MESSAGES 
} from '@shared/common';
```

## 🐛 디버깅 도구

### `debugEntry()` & `debugExit()`

함수의 진입/종료를 자동으로 로깅합니다.

```ts
function debugEntry(functionName: string, params?: Record<string, any>): void
function debugExit(functionName: string, result?: any): void
```

#### 사용 예제
```ts
function processUserData(userId: string, data: UserData) {
  debugEntry('processUserData', { userId, dataSize: data.length });
  
  try {
    // 실제 로직
    const result = transformData(data);
    debugExit('processUserData', { success: true, resultSize: result.length });
    return result;
  } catch (error) {
    debugExit('processUserData', { success: false, error: error.message });
    throw error;
  }
}
```

### `withDebug()`

함수를 자동으로 디버그 래퍼로 감쌉니다.

```ts
function withDebug<T extends (...args: any[]) => any>(
  fn: T, 
  name?: string
): T
```

#### 사용 예제
```ts
const originalFunction = (x: number, y: number) => x + y;
const debuggedFunction = withDebug(originalFunction, 'addNumbers');

// 자동으로 진입/종료 로그가 생성됨
const result = debuggedFunction(5, 3);
```

## ⚡ 벤치마킹 도구

### `gigaBenchmark()`

함수 실행 시간과 성능 메트릭을 측정합니다.

```ts
async function gigaBenchmark<T>(
  name: string,
  fn: () => Promise<T> | T
): Promise<{ result: T; metrics: BenchmarkMetrics }>

interface BenchmarkMetrics {
  executionTime: number    // 실행 시간 (ms)
  memoryUsed: number      // 메모리 사용량 (bytes)
  timestamp: Date         // 실행 시각
  name: string           // 벤치마크 이름
}
```

#### 실전 사용 예제
```ts
// 비동기 함수 벤치마킹
const { result, metrics } = await gigaBenchmark('fetchUserData', async () => {
  const users = await fetch('/api/users').then(r => r.json());
  return processUsers(users);
});

console.log(`${metrics.name} 완료: ${metrics.executionTime}ms`);
console.log(`메모리 사용: ${(metrics.memoryUsed / 1024 / 1024).toFixed(2)}MB`);

// 동기 함수 벤치마킹
const { result: sortedArray, metrics: sortMetrics } = await gigaBenchmark(
  'arraySort',
  () => largeArray.sort((a, b) => a - b)
);
```

### 벤치마크 결과 수집 패턴
```ts
const benchmarkResults: BenchmarkMetrics[] = [];

async function benchmarkAndCollect<T>(name: string, fn: () => Promise<T> | T) {
  const { result, metrics } = await gigaBenchmark(name, fn);
  benchmarkResults.push(metrics);
  return result;
}

// 여러 함수 벤치마킹
await benchmarkAndCollect('dataProcessing', () => processData());
await benchmarkAndCollect('dataValidation', () => validateData());
await benchmarkAndCollect('dataSaving', () => saveData());

// 결과 분석
const totalTime = benchmarkResults.reduce((sum, m) => sum + m.executionTime, 0);
console.log(`총 실행 시간: ${totalTime}ms`);
```

## 🎨 UI 유틸리티

### `getStatusColor()` & `StatusColorEnum`

상태에 따른 색상을 관리합니다.

```ts
enum StatusColorEnum {
  SUCCESS = '#22c55e',
  ERROR = '#ef4444',
  WARNING = '#f59e0b',
  INFO = '#3b82f6',
  IDLE = '#6b7280'
}

function getStatusColor(status: keyof typeof StatusColorEnum): string
```

#### 사용 예제
```ts
// React 컴포넌트에서
function StatusIndicator({ status }: { status: 'SUCCESS' | 'ERROR' | 'WARNING' }) {
  const color = getStatusColor(status);
  
  return (
    <div style={{ backgroundColor: color, padding: '8px', borderRadius: '4px' }}>
      Status: {status}
    </div>
  );
}

// CSS 클래스 생성
function getStatusClass(status: string) {
  return `status-${status.toLowerCase()}`;
}
```

## 📐 상수 모음

### `KEYBOARD_CONSTANTS`

키보드 관련 설정값들입니다.

```ts
export const KEYBOARD_CONSTANTS = {
  DEFAULT_DEBOUNCE_MS: 50,
  MAX_DEBOUNCE_MS: 1000,
  DEFAULT_BUFFER_SIZE: 1000,
  MONITORING_INTERVAL_MS: 100,
  AUTO_SAVE_INTERVAL_MS: 30000,
  
  // 키 코드
  SPECIAL_KEYS: {
    ESCAPE: 'Escape',
    ENTER: 'Enter',
    SPACE: ' ',
    TAB: 'Tab',
    BACKSPACE: 'Backspace'
  },
  
  // 단축키
  SHORTCUTS: {
    TOGGLE_MONITORING: 'Ctrl+Shift+M',
    QUICK_SAVE: 'Ctrl+S',
    RESET_SESSION: 'Ctrl+R'
  }
} as const;
```

#### 사용 예제
```ts
import { KEYBOARD_CONSTANTS } from '@shared/common';

// 디바운스 설정
const debounceMs = KEYBOARD_CONSTANTS.DEFAULT_DEBOUNCE_MS;

// 특수 키 체크
if (event.key === KEYBOARD_CONSTANTS.SPECIAL_KEYS.ESCAPE) {
  handleEscape();
}

// 단축키 체크
if (event.ctrlKey && event.shiftKey && event.key === 'M') {
  toggleMonitoring();
}
```

### 메시지 상수들

```ts
// 에러 메시지
export const ERROR_MESSAGES = {
  KEYBOARD_START_FAILED: '키보드 모니터링 시작에 실패했습니다',
  CONFIG_LOAD_FAILED: '설정 로드에 실패했습니다',
  DATABASE_ERROR: '데이터베이스 오류가 발생했습니다',
  INVALID_INPUT: '유효하지 않은 입력값입니다',
  PERMISSION_DENIED: '권한이 거부되었습니다'
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  KEYBOARD_STARTED: '키보드 모니터링이 시작되었습니다',
  CONFIG_SAVED: '설정이 저장되었습니다',
  SESSION_SAVED: '세션이 저장되었습니다',
  DATA_EXPORTED: '데이터가 내보내기되었습니다'
} as const;

// 정보 메시지
export const INFO_MESSAGES = {
  KEYBOARD_STOPPED: '키보드 모니터링이 중지되었습니다',
  CONFIG_RESET: '설정이 초기화되었습니다',
  LOADING: '로딩 중...',
  PROCESSING: '처리 중...'
} as const;
```

#### 사용 예제
```ts
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@shared/common';

async function startKeyboardMonitoring() {
  try {
    const result = await window.electronAPI.keyboard.startMonitoring();
    if (result.success) {
      showNotification(SUCCESS_MESSAGES.KEYBOARD_STARTED);
    } else {
      showError(result.message || ERROR_MESSAGES.KEYBOARD_START_FAILED);
    }
  } catch (error) {
    showError(ERROR_MESSAGES.KEYBOARD_START_FAILED);
  }
}
```

## 🔧 고급 유틸리티

### 타이머 관리

```ts
class TimerManager {
  private timers = new Map<string, NodeJS.Timeout>();
  
  set(name: string, callback: () => void, delay: number): void {
    this.clear(name);
    const timer = setTimeout(callback, delay);
    this.timers.set(name, timer);
  }
  
  clear(name: string): void {
    const timer = this.timers.get(name);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(name);
    }
  }
  
  clearAll(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }
}

// 전역 인스턴스
export const timerManager = new TimerManager();
```

### 캐시 유틸리티

```ts
class SimpleCache<T> {
  private cache = new Map<string, { value: T; expiry: number }>();
  
  set(key: string, value: T, ttlMs = 300000): void { // 5분 기본
    const expiry = Date.now() + ttlMs;
    this.cache.set(key, { value, expiry });
  }
  
  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  clear(): void {
    this.cache.clear();
  }
}

export const apiCache = new SimpleCache();
```

## 🎯 실전 패턴

### 1. 함수 래퍼 패턴
```ts
import { debugEntry, debugExit, gigaBenchmark } from '@shared/common';

function createInstrumentedFunction<T extends (...args: any[]) => any>(
  fn: T,
  name: string,
  shouldBenchmark = false
): T {
  return ((...args: Parameters<T>) => {
    debugEntry(name, { args });
    
    if (shouldBenchmark) {
      return gigaBenchmark(name, () => fn(...args)).then(({ result, metrics }) => {
        debugExit(name, { result, metrics });
        return result;
      });
    } else {
      const result = fn(...args);
      debugExit(name, { result });
      return result;
    }
  }) as T;
}
```

### 2. 상태 기반 색상 관리
```ts
import { getStatusColor, StatusColorEnum } from '@shared/common';

function useStatusColor(isLoading: boolean, hasError: boolean, isSuccess: boolean) {
  if (isLoading) return getStatusColor('INFO');
  if (hasError) return getStatusColor('ERROR');
  if (isSuccess) return getStatusColor('SUCCESS');
  return getStatusColor('IDLE');
}
```

### 3. 성능 모니터링 대시보드
```ts
import { gigaBenchmark } from '@shared/common';

class PerformanceDashboard {
  private metrics: BenchmarkMetrics[] = [];
  
  async trackOperation<T>(name: string, operation: () => Promise<T> | T): Promise<T> {
    const { result, metrics } = await gigaBenchmark(name, operation);
    this.metrics.push(metrics);
    this.updateDashboard();
    return result;
  }
  
  private updateDashboard(): void {
    // 최근 10개 메트릭만 유지
    if (this.metrics.length > 10) {
      this.metrics = this.metrics.slice(-10);
    }
    
    // UI 업데이트
    this.renderMetrics();
  }
  
  getAverageExecutionTime(): number {
    if (this.metrics.length === 0) return 0;
    return this.metrics.reduce((sum, m) => sum + m.executionTime, 0) / this.metrics.length;
  }
}
```

## 📋 체크리스트

- [ ] 모든 중요 함수에 `debugEntry`/`debugExit` 추가
- [ ] 성능이 중요한 함수에 `gigaBenchmark` 적용
- [ ] 상태 표시에 `getStatusColor` 사용
- [ ] 하드코딩된 문자열을 상수로 교체
- [ ] 타이머와 캐시 적절히 활용
- [ ] 에러 처리에 표준 메시지 사용

---

**다음**: [Types & Interfaces](./types.md) - TypeScript 타입 정의 가이드
