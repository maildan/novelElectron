# Types & Interfaces 가이드

> 🔥 **TypeScript 타입 정의 완전 레퍼런스** - 타입 안전성 보장

## 개요

`@shared/types`에 정의된 모든 타입과 인터페이스를 설명합니다.
모든 타입은 strict TypeScript 설정을 준수하며 `any` 타입을 사용하지 않습니다.

```ts
import type { 
  KeyboardConfig, 
  SessionStats, 
  AppInfo, 
  SystemInfo,
  BenchmarkMetrics 
} from '@shared/types';
```

## ⌨️ 키보드 관련 타입

### `KeyboardConfig`

키보드 설정을 정의합니다.

```ts
interface KeyboardConfig {
  enabled: boolean
  globalShortcuts: boolean
  debounceMs: number
  bufferSize: number
  autoSave: boolean
  autoSaveInterval: number
  captureSpecialKeys: boolean
  ignoredKeys: string[]
  customShortcuts: Record<string, string>
  monitoringOptions: MonitoringOptions
}

interface MonitoringOptions {
  trackKeyPresses: boolean
  trackKeyReleases: boolean
  trackModifiers: boolean
  trackSpecialKeys: boolean
  maxEventsPerSecond: number
}
```

#### 사용 예제
```ts
const defaultConfig: KeyboardConfig = {
  enabled: true,
  globalShortcuts: false,
  debounceMs: 50,
  bufferSize: 1000,
  autoSave: true,
  autoSaveInterval: 30000,
  captureSpecialKeys: true,
  ignoredKeys: ['CapsLock', 'NumLock'],
  customShortcuts: {
    'toggle-monitoring': 'Ctrl+Shift+M',
    'quick-save': 'Ctrl+S'
  },
  monitoringOptions: {
    trackKeyPresses: true,
    trackKeyReleases: false,
    trackModifiers: true,
    trackSpecialKeys: true,
    maxEventsPerSecond: 100
  }
};
```

### `KeyboardEvent`

키보드 이벤트 데이터를 정의합니다.

```ts
interface KeyboardEvent {
  key: string
  code: string
  keyCode: number
  type: 'keydown' | 'keyup'
  timestamp: number
  modifiers: KeyModifiers
  location: KeyLocation
  repeat: boolean
}

interface KeyModifiers {
  ctrl: boolean
  shift: boolean
  alt: boolean
  meta: boolean
}

enum KeyLocation {
  STANDARD = 0,
  LEFT = 1,
  RIGHT = 2,
  NUMPAD = 3
}
```

#### 사용 예제
```ts
function handleKeyEvent(event: KeyboardEvent): void {
  if (event.type === 'keydown' && event.modifiers.ctrl && event.key === 's') {
    // Ctrl+S 처리
    saveCurrentSession();
  }
  
  if (event.location === KeyLocation.NUMPAD) {
    // 숫자 키패드 키 처리
    handleNumpadKey(event.key);
  }
}
```

## 📊 세션 및 분석 타입

### `SessionStats`

타이핑 세션 통계를 정의합니다.

```ts
interface SessionStats {
  id: string
  name: string
  startTime: Date
  endTime?: Date
  duration: number  // milliseconds
  keyCount: number
  accuracy: number  // percentage (0-100)
  wpm: number      // words per minute
  errors: number
  corrections: number
  keystrokes: KeystrokeData[]
  metadata: SessionMetadata
}

interface KeystrokeData {
  key: string
  timestamp: number
  isCorrection: boolean
  timeSinceLastKey: number
}

interface SessionMetadata {
  platform: string
  appVersion: string
  keyboardLayout: string
  customSettings: Record<string, unknown>
}
```

#### 사용 예제
```ts
function createNewSession(name: string): Partial<SessionStats> {
  return {
    name,
    startTime: new Date(),
    keyCount: 0,
    accuracy: 0,
    wpm: 0,
    errors: 0,
    corrections: 0,
    keystrokes: [],
    metadata: {
      platform: navigator.platform,
      appVersion: '1.0.0',
      keyboardLayout: 'us',
      customSettings: {}
    }
  };
}

function calculateWPM(session: SessionStats): number {
  const minutes = session.duration / (1000 * 60);
  const words = session.keyCount / 5; // 평균 단어 길이 5
  return Math.round(words / minutes);
}
```

### `AnalyticsData`

종합 분석 데이터를 정의합니다.

```ts
interface AnalyticsData {
  totalSessions: number
  totalTime: number
  totalKeystrokes: number
  averageWPM: number
  averageAccuracy: number
  improvementTrend: TrendData[]
  keyFrequency: Record<string, number>
  timeDistribution: TimeDistribution
  errorPatterns: ErrorPattern[]
}

interface TrendData {
  date: Date
  wpm: number
  accuracy: number
  sessionCount: number
}

interface TimeDistribution {
  hourly: number[]  // 24 elements for hours 0-23
  daily: number[]   // 7 elements for days of week
  monthly: number[] // 12 elements for months
}

interface ErrorPattern {
  keyFrom: string
  keyTo: string
  frequency: number
  context: string[]
}
```

## 🖥️ 시스템 및 앱 타입

### `AppInfo`

앱 정보를 정의합니다.

```ts
interface AppInfo {
  name: string
  version: string
  platform: string
  electronVersion: string
  nodeVersion: string
  chromeVersion: string
  buildDate: Date
  isPackaged: boolean
  userDataPath: string
}
```

### `SystemInfo`

시스템 정보를 정의합니다.

```ts
interface SystemInfo {
  platform: NodeJS.Platform
  arch: string
  version: string
  hostname: string
  cpus: CPUInfo[]
  memory: MemoryInfo
  uptime: number
}

interface CPUInfo {
  model: string
  speed: number
  cores: number
}

interface MemoryInfo {
  total: number
  free: number
  used: number
  usedPercentage: number
}

interface DiskSpace {
  total: number
  free: number
  used: number
}
```

## 🔧 유틸리티 타입

### `BenchmarkMetrics`

성능 측정 결과를 정의합니다.

```ts
interface BenchmarkMetrics {
  name: string
  executionTime: number    // milliseconds
  memoryUsed: number      // bytes
  timestamp: Date
  category?: string
  tags?: string[]
  metadata?: Record<string, unknown>
}

interface PerformanceReport {
  testName: string
  metrics: BenchmarkMetrics[]
  summary: {
    averageTime: number
    minTime: number
    maxTime: number
    totalRuns: number
  }
}
```

### `APIResponse<T>`

API 응답 형태를 정의합니다.

```ts
interface APIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: Date
  requestId?: string
}

// 사용 예제
type SessionResponse = APIResponse<SessionStats[]>
type ConfigResponse = APIResponse<KeyboardConfig>
```

### `EventCallback` 타입들

이벤트 콜백 함수 타입을 정의합니다.

```ts
type KeyboardEventCallback = (event: KeyboardEvent) => void
type SessionEventCallback = (session: SessionStats) => void
type ErrorEventCallback = (error: Error) => void
type ProgressEventCallback = (progress: number) => void

interface EventCallbacks {
  onKeyEvent?: KeyboardEventCallback
  onSessionStart?: SessionEventCallback
  onSessionEnd?: SessionEventCallback
  onError?: ErrorEventCallback
  onProgress?: ProgressEventCallback
}
```

## 🎯 필터 및 쿼리 타입

### `SessionFilter`

세션 조회 필터를 정의합니다.

```ts
interface SessionFilter {
  limit?: number
  offset?: number
  sortBy?: keyof SessionStats
  order?: 'asc' | 'desc'
  dateFrom?: Date
  dateTo?: Date
  minWPM?: number
  maxWPM?: number
  minAccuracy?: number
  maxAccuracy?: number
  searchTerm?: string
}
```

### `ConfigOptions`

설정 옵션을 정의합니다.

```ts
interface ConfigOptions {
  autoSave?: boolean
  validateInput?: boolean
  useCache?: boolean
  timeout?: number
  retryCount?: number
  fallbackToDefault?: boolean
}

interface DatabaseOptions {
  encryption?: boolean
  compression?: boolean
  backup?: boolean
  maxSize?: number
  cleanupInterval?: number
}
```

## 🔒 보안 관련 타입

### `SecuritySettings`

보안 설정을 정의합니다.

```ts
interface SecuritySettings {
  enableSandbox: boolean
  disableNodeIntegration: boolean
  enableContextIsolation: boolean
  allowRunningInsecureContent: boolean
  allowedOrigins: string[]
  blockedDomains: string[]
}

interface PermissionRequest {
  permission: 'camera' | 'microphone' | 'geolocation' | 'notifications'
  origin: string
  granted: boolean
  timestamp: Date
}
```

## 🎨 UI 관련 타입

### `ThemeConfig`

테마 설정을 정의합니다.

```ts
interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto'
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  fontSize: number
  animations: boolean
  transitions: boolean
}

interface WindowConfig {
  width: number
  height: number
  minWidth: number
  minHeight: number
  resizable: boolean
  maximizable: boolean
  minimizable: boolean
  alwaysOnTop: boolean
  fullscreen: boolean
}
```

## 🔄 상태 관리 타입

### `AppState`

앱 전체 상태를 정의합니다.

```ts
interface AppState {
  isInitialized: boolean
  currentSession?: SessionStats
  keyboardConfig: KeyboardConfig
  userSettings: UserSettings
  systemInfo: SystemInfo
  connectionStatus: ConnectionStatus
}

interface UserSettings {
  theme: ThemeConfig
  language: string
  timezone: string
  notifications: NotificationSettings
  privacy: PrivacySettings
}

interface ConnectionStatus {
  isOnline: boolean
  lastSyncTime?: Date
  syncInProgress: boolean
  errorCount: number
}
```

## 🛠️ 타입 가드 함수들

```ts
// 타입 가드 함수 예제
function isKeyboardEvent(obj: unknown): obj is KeyboardEvent {
  return typeof obj === 'object' && 
         obj !== null && 
         'key' in obj && 
         'type' in obj;
}

function isSessionStats(obj: unknown): obj is SessionStats {
  return typeof obj === 'object' && 
         obj !== null && 
         'id' in obj && 
         'name' in obj && 
         'startTime' in obj;
}

function isAPIResponse<T>(obj: unknown): obj is APIResponse<T> {
  return typeof obj === 'object' && 
         obj !== null && 
         'success' in obj;
}
```

## 📝 타입 사용 예제

### 1. React 컴포넌트에서
```ts
import type { SessionStats, KeyboardConfig } from '@shared/types';

interface SessionListProps {
  sessions: SessionStats[]
  onSessionSelect: (session: SessionStats) => void
  config: KeyboardConfig
}

function SessionList({ sessions, onSessionSelect, config }: SessionListProps) {
  // 컴포넌트 로직
}
```

### 2. API 호출에서
```ts
import type { APIResponse, SessionFilter } from '@shared/types';

async function fetchSessions(filter: SessionFilter): Promise<SessionStats[]> {
  const response = await window.electronAPI.invoke<APIResponse<SessionStats[]>>(
    'get-sessions',
    filter
  );
  
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch sessions');
  }
  
  return response.data;
}
```

### 3. 상태 관리에서
```ts
import type { AppState, KeyboardEvent } from '@shared/types';

class AppStateManager {
  private state: AppState;
  
  updateKeyboardEvent(event: KeyboardEvent): void {
    if (this.state.currentSession) {
      this.state.currentSession.keystrokes.push({
        key: event.key,
        timestamp: event.timestamp,
        isCorrection: false,
        timeSinceLastKey: this.calculateTimeSinceLastKey()
      });
    }
  }
}
```

## 📋 타입 체크리스트

- [ ] 모든 API 응답에 적절한 타입 지정
- [ ] 컴포넌트 props에 인터페이스 정의
- [ ] 이벤트 핸들러에 정확한 콜백 타입 사용
- [ ] any 타입 사용 금지
- [ ] 옵셔널 속성은 `?` 사용
- [ ] 유니온 타입으로 상태 표현
- [ ] 타입 가드로 런타임 안전성 확보

---

**다음**: [IPC Channels](./ipc-channels.md) - Electron IPC 채널 레퍼런스
