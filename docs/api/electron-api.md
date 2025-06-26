# Electron API 완전 가이드

> 🔥 **window.electronAPI 완전 레퍼런스** - FE 개발자를 위한 실전 가이드

## 개요

FE(React/Vue/Vanilla JS)에서 `window.electronAPI`로 Electron 메인 프로세스와 안전하게 통신할 수 있습니다.
모든 API는 TypeScript로 타입이 정의되어 있으며, `any` 타입은 사용하지 않습니다.

## 📱 App API

### `window.electronAPI.app`

앱 정보와 기본 기능을 제공합니다.

```ts
interface AppAPI {
  getVersion(): Promise<string>
  getPlatform(): Promise<string>
  getInfo(): Promise<AppInfo>
  quit(): Promise<void>
  restart(): Promise<void>
}
```

#### 사용 예제
```ts
// 앱 버전 확인
const version = await window.electronAPI.app.getVersion();
console.log(`Current version: ${version}`);

// 플랫폼 정보
const platform = await window.electronAPI.app.getPlatform();
if (platform === 'darwin') {
  // macOS 전용 로직
}

// 전체 앱 정보
const appInfo = await window.electronAPI.app.getInfo();
console.log(appInfo.name, appInfo.version, appInfo.platform);
```

## ⌨️ Keyboard API

### `window.electronAPI.keyboard`

키보드 모니터링과 설정을 관리합니다.

```ts
interface KeyboardAPI {
  startMonitoring(): Promise<{success: boolean, message?: string}>
  stopMonitoring(): Promise<{success: boolean}>
  getMonitoringStatus(): Promise<{isActive: boolean, startTime?: Date}>
  onKeyEvent(callback: (event: KeyboardEvent) => void): void
  removeKeyEventListener(callback: Function): void
  getConfig(): Promise<KeyboardConfig>
  setConfig(config: Partial<KeyboardConfig>): Promise<boolean>
  resetConfig(): Promise<boolean>
}
```

#### 실전 사용 예제
```ts
// 키보드 모니터링 시작
const startResult = await window.electronAPI.keyboard.startMonitoring();
if (startResult.success) {
  console.log('키보드 모니터링 시작됨');
} else {
  console.error('시작 실패:', startResult.message);
}

// 키 이벤트 리스너 등록
const handleKeyEvent = (event: KeyboardEvent) => {
  console.log(`Key pressed: ${event.key}`);
};
window.electronAPI.keyboard.onKeyEvent(handleKeyEvent);

// 설정 변경
const newConfig: Partial<KeyboardConfig> = {
  enabled: true,
  globalShortcuts: true,
  debounceMs: 100
};
await window.electronAPI.keyboard.setConfig(newConfig);

// 정리 (컴포넌트 언마운트 시)
window.electronAPI.keyboard.removeKeyEventListener(handleKeyEvent);
```

## 🗄️ Database API

### `window.electronAPI.database`

세션 데이터와 분석 정보를 관리합니다.

```ts
interface DatabaseAPI {
  getSessions(filter?: SessionFilter): Promise<SessionStats[]>
  getSessionById(id: string): Promise<SessionStats | null>
  saveSession(session: Partial<SessionStats>): Promise<boolean>
  deleteSession(sessionId: string): Promise<boolean>
  getAnalytics(sessionId?: string): Promise<AnalyticsData>
  exportData(format: 'json' | 'csv'): Promise<string>
}
```

#### 사용 예제
```ts
// 최근 세션 목록 가져오기
const recentSessions = await window.electronAPI.database.getSessions({
  limit: 10,
  sortBy: 'createdAt',
  order: 'desc'
});

// 세션 저장
const newSession = {
  name: 'My Typing Session',
  duration: 300000, // 5분
  keyCount: 1250,
  accuracy: 95.5
};
await window.electronAPI.database.saveSession(newSession);

// 분석 데이터 가져오기
const analytics = await window.electronAPI.database.getAnalytics();
console.log(`총 타이핑 시간: ${analytics.totalTime}ms`);
```

## ⚙️ Settings API

### `window.electronAPI.settings`

앱 설정을 관리합니다.

```ts
interface SettingsAPI {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<boolean>
  getAll(): Promise<Record<string, unknown>>
  reset(): Promise<boolean>
  export(): Promise<string>
  import(data: string): Promise<boolean>
}
```

#### 사용 예제
```ts
// 테마 설정 가져오기
const theme = await window.electronAPI.settings.get<string>('theme');
if (theme === 'dark') {
  document.body.classList.add('dark-theme');
}

// 설정 저장
await window.electronAPI.settings.set('language', 'ko');
await window.electronAPI.settings.set('autoStart', true);

// 모든 설정 가져오기
const allSettings = await window.electronAPI.settings.getAll();
console.log('Current settings:', allSettings);
```

## 🪟 Window API

### `window.electronAPI.window`

윈도우 제어 기능을 제공합니다.

```ts
interface WindowAPI {
  minimize(): Promise<void>
  maximize(): Promise<void>
  close(): Promise<void>
  toggleMaximize(): Promise<void>
  isMaximized(): Promise<boolean>
  setSize(width: number, height: number): Promise<void>
  center(): Promise<void>
  focus(): Promise<void>
}
```

#### 사용 예제
```ts
// 윈도우 최소화
await window.electronAPI.window.minimize();

// 최대화 상태 토글
await window.electronAPI.window.toggleMaximize();

// 윈도우 크기 설정
await window.electronAPI.window.setSize(800, 600);
await window.electronAPI.window.center();
```

## 🖥️ System API

### `window.electronAPI.system`

시스템 정보를 가져옵니다.

```ts
interface SystemAPI {
  getInfo(): Promise<SystemInfo>
  getMemoryUsage(): Promise<MemoryUsage>
  getCPUUsage(): Promise<CPUUsage>
  getDiskSpace(): Promise<DiskSpace>
}
```

#### 사용 예제
```ts
// 시스템 정보
const systemInfo = await window.electronAPI.system.getInfo();
console.log(`OS: ${systemInfo.platform} ${systemInfo.version}`);

// 메모리 사용량 모니터링
const memoryUsage = await window.electronAPI.system.getMemoryUsage();
const usagePercent = (memoryUsage.used / memoryUsage.total) * 100;
console.log(`Memory usage: ${usagePercent.toFixed(1)}%`);
```

## 🔧 일반 IPC API

### `window.electronAPI.invoke` & `window.electronAPI.on`

직접적인 IPC 통신을 위한 저수준 API입니다.

```ts
interface GeneralAPI {
  invoke<T>(channel: string, ...args: any[]): Promise<T>
  on(channel: string, callback: (...args: any[]) => void): void
  removeAllListeners(channel: string): void
}
```

#### 사용 예제
```ts
// 커스텀 채널로 호출
const result = await window.electronAPI.invoke<string>('custom-channel', {
  data: 'some data'
});

// 이벤트 리스너
window.electronAPI.on('status-update', (status) => {
  console.log('Status changed:', status);
});

// 리스너 정리
window.electronAPI.removeAllListeners('status-update');
```

## 🛠️ 실전 팁

### 1. React Hook 패턴
```ts
import { useEffect, useState } from 'react';

export function useKeyboardMonitoring() {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    const checkStatus = async () => {
      const status = await window.electronAPI.keyboard.getMonitoringStatus();
      setIsActive(status.isActive);
    };
    
    checkStatus();
    
    // 주기적 체크
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return { isActive };
}
```

### 2. 에러 처리 패턴
```ts
async function safeApiCall<T>(apiCall: () => Promise<T>): Promise<T | null> {
  try {
    return await apiCall();
  } catch (error) {
    console.error('API call failed:', error);
    return null;
  }
}

// 사용
const version = await safeApiCall(() => window.electronAPI.app.getVersion());
```

### 3. 타입 가드 사용
```ts
function isElectronAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.electronAPI;
}

if (isElectronAvailable()) {
  // Electron API 사용
  const version = await window.electronAPI.app.getVersion();
}
```

## 🚨 주의사항

1. **타입 안전성**: 모든 API 호출에 적절한 타입을 지정하세요
2. **에러 처리**: 네트워크나 시스템 문제로 실패할 수 있습니다
3. **리스너 정리**: 컴포넌트 언마운트 시 이벤트 리스너를 제거하세요
4. **성능**: 빈번한 API 호출은 디바운싱을 고려하세요

---

**다음**: [Utils & Common](./utils.md) - 공통 유틸리티 가이드
