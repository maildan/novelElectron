# IPC Channels 레퍼런스

> 🔥 **Electron IPC 채널 완전 가이드** - 프로세스 간 통신 마스터하기

## 개요

Electron의 메인 프로세스와 렌더러 프로세스 간 통신을 위한 IPC 채널 정의입니다.
모든 채널은 타입 안전하며 일관된 패턴을 따릅니다.

## 📡 채널 명명 규칙

```
{module}:{action}:{target?}
```

- **module**: app, keyboard, database, settings, window, system
- **action**: get, set, start, stop, create, update, delete
- **target**: 선택적 대상 지정

## 🖥️ App 채널

### 기본 정보
```ts
// 앱 버전 조회
'app:get:version' 
→ Promise<string>

// 플랫폼 정보 조회  
'app:get:platform'
→ Promise<string>

// 앱 전체 정보 조회
'app:get:info'
→ Promise<AppInfo>

// 앱 종료
'app:quit'
→ Promise<void>

// 앱 재시작
'app:restart' 
→ Promise<void>
```

### 사용 예제
```ts
const version = await window.electronAPI.invoke<string>('app:get:version');
const appInfo = await window.electronAPI.invoke<AppInfo>('app:get:info');
await window.electronAPI.invoke<void>('app:quit');
```

## ⌨️ Keyboard 채널

### 모니터링 제어
```ts
// 키보드 모니터링 시작
'keyboard:start:monitoring'
→ Promise<{success: boolean, message?: string}>

// 키보드 모니터링 중지
'keyboard:stop:monitoring'
→ Promise<{success: boolean}>

// 모니터링 상태 조회
'keyboard:get:status'
→ Promise<{isActive: boolean, startTime?: Date}>
```

### 설정 관리
```ts
// 키보드 설정 조회
'keyboard:get:config'
→ Promise<KeyboardConfig>

// 키보드 설정 저장
'keyboard:set:config'
→ (config: Partial<KeyboardConfig>) → Promise<boolean>

// 설정 초기화
'keyboard:reset:config'
→ Promise<boolean>
```

### 이벤트 채널
```ts
// 키 이벤트 (렌더러 → 메인)
'keyboard:event:key'
← KeyboardEvent

// 상태 변경 알림 (메인 → 렌더러)
'keyboard:status:changed'
← {isActive: boolean, reason?: string}
```

### 사용 예제
```ts
// 모니터링 시작
const result = await window.electronAPI.invoke<{success: boolean}>(
  'keyboard:start:monitoring'
);

// 키 이벤트 리스너
window.electronAPI.on('keyboard:event:key', (event: KeyboardEvent) => {
  console.log(`Key pressed: ${event.key}`);
});

// 설정 업데이트
await window.electronAPI.invoke<boolean>('keyboard:set:config', {
  debounceMs: 100,
  enabled: true
});
```

## 🗄️ Database 채널

### 세션 관리
```ts
// 세션 목록 조회
'database:get:sessions'
→ (filter?: SessionFilter) → Promise<SessionStats[]>

// 개별 세션 조회
'database:get:session'
→ (id: string) → Promise<SessionStats | null>

// 세션 저장
'database:save:session'
→ (session: Partial<SessionStats>) → Promise<boolean>

// 세션 삭제
'database:delete:session'
→ (id: string) → Promise<boolean>

// 세션 업데이트
'database:update:session'
→ (id: string, updates: Partial<SessionStats>) → Promise<boolean>
```

### 분석 데이터
```ts
// 분석 데이터 조회
'database:get:analytics'
→ (sessionId?: string) → Promise<AnalyticsData>

// 데이터 내보내기
'database:export:data'
→ (format: 'json' | 'csv', filter?: SessionFilter) → Promise<string>

// 데이터 가져오기
'database:import:data'
→ (data: string, format: 'json' | 'csv') → Promise<boolean>
```

### 사용 예제
```ts
// 최근 세션 조회
const sessions = await window.electronAPI.invoke<SessionStats[]>(
  'database:get:sessions',
  { limit: 10, sortBy: 'startTime', order: 'desc' }
);

// 새 세션 저장
const newSession: Partial<SessionStats> = {
  name: 'Practice Session',
  duration: 300000,
  keyCount: 1500
};
await window.electronAPI.invoke<boolean>('database:save:session', newSession);
```

## ⚙️ Settings 채널

### 설정 관리
```ts
// 개별 설정 조회
'settings:get:value'
→ (key: string) → Promise<unknown>

// 개별 설정 저장
'settings:set:value'
→ (key: string, value: unknown) → Promise<boolean>

// 모든 설정 조회
'settings:get:all'
→ Promise<Record<string, unknown>>

// 설정 초기화
'settings:reset:all'
→ Promise<boolean>

// 설정 내보내기
'settings:export:config'
→ Promise<string>

// 설정 가져오기
'settings:import:config'
→ (data: string) → Promise<boolean>
```

### 사용 예제
```ts
// 테마 설정 조회
const theme = await window.electronAPI.invoke<string>('settings:get:value', 'theme');

// 언어 설정 저장
await window.electronAPI.invoke<boolean>('settings:set:value', 'language', 'ko');

// 모든 설정 조회
const allSettings = await window.electronAPI.invoke<Record<string, unknown>>(
  'settings:get:all'
);
```

## 🪟 Window 채널

### 윈도우 제어
```ts
// 최소화
'window:minimize'
→ Promise<void>

// 최대화
'window:maximize'
→ Promise<void>

// 윈도우 닫기
'window:close'
→ Promise<void>

// 최대화 토글
'window:toggle:maximize'
→ Promise<void>

// 최대화 상태 조회
'window:get:maximized'
→ Promise<boolean>

// 윈도우 크기 설정
'window:set:size'
→ (width: number, height: number) → Promise<void>

// 윈도우 위치 설정
'window:set:position'
→ (x: number, y: number) → Promise<void>

// 윈도우 중앙 정렬
'window:center'
→ Promise<void>

// 포커스
'window:focus'
→ Promise<void>
```

### 이벤트 채널
```ts
// 윈도우 상태 변경 (메인 → 렌더러)
'window:state:changed'
← {
  isMaximized: boolean,
  isMinimized: boolean,
  isFocused: boolean,
  bounds: { x: number, y: number, width: number, height: number }
}
```

### 사용 예제
```ts
// 윈도우 최소화
await window.electronAPI.invoke<void>('window:minimize');

// 크기 설정 후 중앙 정렬
await window.electronAPI.invoke<void>('window:set:size', 800, 600);
await window.electronAPI.invoke<void>('window:center');

// 상태 변경 리스너
window.electronAPI.on('window:state:changed', (state) => {
  if (state.isMaximized) {
    // 최대화 상태 UI 업데이트
  }
});
```

## 🖥️ System 채널

### 시스템 정보
```ts
// 시스템 정보 조회
'system:get:info'
→ Promise<SystemInfo>

// 메모리 사용량 조회
'system:get:memory'
→ Promise<MemoryUsage>

// CPU 사용량 조회
'system:get:cpu'
→ Promise<CPUUsage>

// 디스크 공간 조회
'system:get:disk'
→ Promise<DiskSpace>

// 네트워크 상태 조회
'system:get:network'
→ Promise<NetworkInfo>
```

### 성능 모니터링
```ts
// 성능 모니터링 시작
'system:start:monitor'
→ (interval: number) → Promise<boolean>

// 성능 모니터링 중지
'system:stop:monitor'
→ Promise<boolean>

// 성능 데이터 (메인 → 렌더러)
'system:performance:data'
← {
  cpu: number,
  memory: MemoryUsage,
  timestamp: Date
}
```

### 사용 예제
```ts
// 시스템 정보 조회
const systemInfo = await window.electronAPI.invoke<SystemInfo>('system:get:info');
console.log(`OS: ${systemInfo.platform} ${systemInfo.version}`);

// 성능 모니터링 시작
await window.electronAPI.invoke<boolean>('system:start:monitor', 5000); // 5초 간격

// 성능 데이터 리스너
window.electronAPI.on('system:performance:data', (data) => {
  updatePerformanceChart(data);
});
```

## 🔧 커스텀 채널

### 개발자 도구
```ts
// 개발자 도구 토글
'dev:toggle:devtools'
→ Promise<void>

// 로그 레벨 설정
'dev:set:loglevel'
→ (level: 'error' | 'warn' | 'info' | 'debug') → Promise<void>

// 캐시 클리어
'dev:clear:cache'
→ Promise<void>

// 메모리 덤프
'dev:dump:memory'
→ Promise<string>
```

### 업데이트
```ts
// 업데이트 확인
'update:check:available'
→ Promise<{available: boolean, version?: string}>

// 업데이트 다운로드
'update:download'
→ Promise<boolean>

// 업데이트 설치 및 재시작
'update:install:restart'
→ Promise<void>

// 업데이트 진행상황 (메인 → 렌더러)
'update:progress'
← {percent: number, bytesPerSecond: number}
```

## 🛡️ 보안 및 에러 처리

### 에러 처리 패턴
```ts
// 모든 IPC 호출에 대한 에러 래퍼
async function safeIpcCall<T>(
  channel: string, 
  ...args: any[]
): Promise<T | null> {
  try {
    return await window.electronAPI.invoke<T>(channel, ...args);
  } catch (error) {
    console.error(`IPC call failed for ${channel}:`, error);
    return null;
  }
}

// 사용 예제
const version = await safeIpcCall<string>('app:get:version');
if (version) {
  setAppVersion(version);
}
```

### 타임아웃 처리
```ts
function withTimeout<T>(
  promise: Promise<T>, 
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    )
  ]);
}

// 사용 예제
try {
  const result = await withTimeout(
    window.electronAPI.invoke('heavy:operation'),
    5000 // 5초 타임아웃
  );
} catch (error) {
  if (error.message === 'Timeout') {
    showError('작업이 너무 오래 걸립니다');
  }
}
```

## 📊 성능 최적화

### 배치 처리
```ts
// 여러 설정을 한 번에 저장
'settings:set:batch'
→ (settings: Record<string, unknown>) → Promise<boolean>

// 여러 세션을 한 번에 조회
'database:get:sessions:batch'
→ (ids: string[]) → Promise<SessionStats[]>
```

### 캐싱 활용
```ts
// 캐시된 데이터 조회
'cache:get:data'
→ (key: string) → Promise<unknown | null>

// 캐시 무효화
'cache:invalidate'
→ (pattern?: string) → Promise<void>
```

## 📋 IPC 체크리스트

- [ ] 모든 채널에 일관된 명명 규칙 적용
- [ ] 요청/응답에 적절한 타입 정의
- [ ] 에러 처리와 타임아웃 구현
- [ ] 이벤트 리스너 정리 (메모리 누수 방지)
- [ ] 보안 검증 (신뢰할 수 없는 입력 차단)
- [ ] 성능 고려 (배치 처리, 캐싱)

---

**다음**: [Troubleshooting](./troubleshooting.md) - 문제 해결 가이드
