# Troubleshooting 가이드

> 🔥 **문제 해결 완전 가이드** - 일반적인 문제와 해결책

## 개요

loop/loop 개발 시 자주 발생하는 문제들과 체계적인 해결 방법을 제공합니다.
모든 해결책은 실전에서 검증된 방법들입니다.

## ⚡ 빠른 진단

### 1차 체크리스트
```bash
# 1. 기본 파일 존재 여부 확인
ls -la src/preload/index.ts
ls -la src/shared/common.ts  
ls -la src/shared/types.ts
ls -la src/shared/logger.ts

# 2. TypeScript 컴파일 에러 확인
npm run type-check

# 3. 의존성 설치 확인
npm install
```

## 🔧 Electron API 문제

### `window.electronAPI is undefined`

**원인**: preload 스크립트가 제대로 로드되지 않음

**해결책**:
```ts
// 1. src/preload/index.ts 파일 확인
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: <T>(channel: string, ...args: any[]) => 
    ipcRenderer.invoke(channel, ...args) as Promise<T>,
  on: (channel: string, callback: (...args: any[]) => void) => 
    ipcRenderer.on(channel, callback),
  removeAllListeners: (channel: string) => 
    ipcRenderer.removeAllListeners(channel)
});

// 2. main.ts에서 preload 경로 확인
webPreferences: {
  preload: path.join(__dirname, '../preload/index.js'), // 컴파일된 파일 경로
  nodeIntegration: false,
  contextIsolation: true
}

// 3. 타입 정의 확인 (src/types/global.d.ts)
interface Window {
  electronAPI: {
    invoke<T>(channel: string, ...args: any[]): Promise<T>
    on(channel: string, callback: (...args: any[]) => void): void
    removeAllListeners(channel: string): void
  }
}
```

### IPC 호출이 응답하지 않음

**원인**: 메인 프로세스에서 채널 핸들러가 등록되지 않음

**해결책**:
```ts
// main.ts에서 핸들러 등록 확인
import { ipcMain } from 'electron';

ipcMain.handle('app:get:version', () => {
  return app.getVersion();
});

ipcMain.handle('keyboard:start:monitoring', async () => {
  try {
    // 모니터링 시작 로직
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
```

## 🔍 TypeScript 에러

### 모듈 해석 오류

**원인**: 경로 설정이나 타입 정의 누락

**해결책**:
```json
// tsconfig.json 확인
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@shared/*": ["shared/*"],
      "@main/*": ["main/*"],
      "@renderer/*": ["renderer/*"]
    }
  }
}
```

```ts
// 올바른 import 방법
import { debugEntry, debugExit } from '@shared/common';
import type { KeyboardConfig } from '@shared/types';
```

### `Property does not exist on type 'Window'`

**해결책**:
```ts
// src/types/global.d.ts 업데이트
declare global {
  interface Window {
    electronAPI: {
      invoke<T>(channel: string, ...args: any[]): Promise<T>
      on(channel: string, callback: (...args: any[]) => void): void
      removeAllListeners(channel: string): void
      app: {
        getVersion(): Promise<string>
        // ... 기타 메소드
      }
      // ... 기타 모듈
    }
  }
}

export {};
```

## ⌨️ 키보드 모니터링 문제

### 키보드 이벤트가 캡처되지 않음

**원인**: 권한 문제 또는 시스템 설정

**해결책**:
```ts
// 1. macOS 접근성 권한 확인
async function checkAccessibilityPermission(): Promise<boolean> {
  const { systemPreferences } = require('electron');
  return systemPreferences.isTrustedAccessibilityClient(false);
}

// 2. 권한 요청
async function requestAccessibilityPermission(): Promise<void> {
  const { systemPreferences, shell } = require('electron');
  if (!systemPreferences.isTrustedAccessibilityClient(true)) {
    await shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility');
  }
}

// 3. 키보드 엔진 초기화 시 권한 체크
if (process.platform === 'darwin') {
  const hasPermission = await checkAccessibilityPermission();
  if (!hasPermission) {
    await requestAccessibilityPermission();
    throw new Error('Accessibility permission required');
  }
}
```

### 높은 CPU 사용률

**원인**: 너무 빈번한 이벤트 처리

**해결책**:
```ts
// 디바운싱 적용
class KeyboardEventManager {
  private debounceTimer: NodeJS.Timeout | null = null;
  private eventBuffer: KeyboardEvent[] = [];
  
  processKeyEvent(event: KeyboardEvent): void {
    this.eventBuffer.push(event);
    
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    this.debounceTimer = setTimeout(() => {
      this.flushEvents();
    }, KEYBOARD_CONSTANTS.DEFAULT_DEBOUNCE_MS);
  }
  
  private flushEvents(): void {
    if (this.eventBuffer.length > 0) {
      this.processBatchEvents(this.eventBuffer);
      this.eventBuffer = [];
    }
  }
}
```

## 🗄️ 데이터베이스 문제

### 세션 저장 실패

**원인**: 스키마 불일치 또는 디스크 공간 부족

**해결책**:
```ts
// 1. 입력 데이터 검증
function validateSessionData(session: Partial<SessionStats>): boolean {
  if (!session.name || session.name.trim().length === 0) {
    throw new Error('Session name is required');
  }
  
  if (session.duration && session.duration < 0) {
    throw new Error('Duration cannot be negative');
  }
  
  if (session.accuracy && (session.accuracy < 0 || session.accuracy > 100)) {
    throw new Error('Accuracy must be between 0 and 100');
  }
  
  return true;
}

// 2. 트랜잭션 사용
async function saveSessionSafely(session: Partial<SessionStats>): Promise<boolean> {
  const transaction = db.transaction();
  
  try {
    validateSessionData(session);
    
    const result = await transaction.run(`
      INSERT INTO sessions (name, duration, keyCount, accuracy, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `, [session.name, session.duration, session.keyCount, session.accuracy, new Date()]);
    
    transaction.commit();
    return true;
  } catch (error) {
    transaction.rollback();
    console.error('Session save failed:', error);
    return false;
  }
}
```

### 데이터 마이그레이션 오류

**해결책**:
```ts
// 백업 생성 후 마이그레이션
async function migrateDatabase(): Promise<void> {
  const backupPath = path.join(app.getPath('userData'), 'backup.db');
  
  try {
    // 1. 백업 생성
    await fs.copyFile(dbPath, backupPath);
    
    // 2. 스키마 버전 확인
    const currentVersion = await getCurrentSchemaVersion();
    const targetVersion = getTargetSchemaVersion();
    
    // 3. 점진적 마이그레이션
    for (let version = currentVersion + 1; version <= targetVersion; version++) {
      await runMigrationScript(version);
    }
    
    // 4. 백업 정리
    await fs.unlink(backupPath);
  } catch (error) {
    // 롤백
    await fs.copyFile(backupPath, dbPath);
    throw error;
  }
}
```

## 🔒 보안 문제

### Context Isolation 경고

**해결책**:
```ts
// main.ts 설정 확인
webPreferences: {
  nodeIntegration: false,           // Node.js 통합 비활성화
  contextIsolation: true,           // Context 격리 활성화
  enableRemoteModule: false,        // Remote 모듈 비활성화
  allowRunningInsecureContent: false,
  experimentalFeatures: false
}

// preload.ts에서 안전한 API만 노출
contextBridge.exposeInMainWorld('electronAPI', {
  // 허용된 메소드만 노출
  invoke: (channel: string, ...args: any[]) => {
    const allowedChannels = [
      'app:get:version',
      'keyboard:start:monitoring',
      // ... 허용된 채널 목록
    ];
    
    if (allowedChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    }
    
    throw new Error(`Channel ${channel} not allowed`);
  }
});
```

## 🎨 UI/렌더링 문제

### React 컴포넌트가 리렌더링되지 않음

**원인**: 상태 업데이트 누락 또는 의존성 배열 문제

**해결책**:
```ts
// useEffect 의존성 배열 확인
useEffect(() => {
  const fetchData = async () => {
    const sessions = await window.electronAPI.database.getSessions();
    setSessions(sessions);
  };
  
  fetchData();
}, []); // 빈 배열로 한 번만 실행

// 이벤트 리스너 정리
useEffect(() => {
  const handleKeyEvent = (event: KeyboardEvent) => {
    setLastKeyEvent(event);
  };
  
  window.electronAPI.keyboard.onKeyEvent(handleKeyEvent);
  
  return () => {
    window.electronAPI.keyboard.removeKeyEventListener(handleKeyEvent);
  };
}, []);
```

### 메모리 누수

**해결책**:
```ts
// 1. 이벤트 리스너 정리
class ComponentManager {
  private listeners: (() => void)[] = [];
  
  addListener(cleanup: () => void): void {
    this.listeners.push(cleanup);
  }
  
  cleanup(): void {
    this.listeners.forEach(cleanup => cleanup());
    this.listeners = [];
  }
}

// 2. React Hook 패턴
function useKeyboardEvents() {
  useEffect(() => {
    const manager = new ComponentManager();
    
    const handleKeyEvent = (event: KeyboardEvent) => {
      // 이벤트 처리
    };
    
    window.electronAPI.keyboard.onKeyEvent(handleKeyEvent);
    manager.addListener(() => {
      window.electronAPI.keyboard.removeKeyEventListener(handleKeyEvent);
    });
    
    return () => manager.cleanup();
  }, []);
}
```

## 🚀 성능 최적화

### 느린 앱 시작

**해결책**:
```ts
// 1. 지연 로딩
async function initializeApp(): Promise<void> {
  // 필수 컴포넌트만 먼저 로드
  await loadCriticalComponents();
  
  // 나머지는 백그라운드에서 로드
  setTimeout(() => {
    loadNonCriticalComponents();
  }, 100);
}

// 2. 캐싱 활용
const cache = new Map<string, any>();

async function getCachedData<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = await fetcher();
  cache.set(key, data);
  return data;
}
```

### 높은 메모리 사용량

**해결책**:
```ts
// 1. 주기적 정리
setInterval(() => {
  // 캐시 정리
  clearExpiredCache();
  
  // 가비지 컬렉션 힌트
  if (global.gc) {
    global.gc();
  }
}, 300000); // 5분마다

// 2. 대용량 데이터 스트리밍
async function processLargeDataset(data: any[]): Promise<void> {
  const chunkSize = 1000;
  
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    await processChunk(chunk);
    
    // 메모리 해제를 위한 잠시 대기
    await new Promise(resolve => setImmediate(resolve));
  }
}
```

## 🛠️ 개발 도구

### 로그 레벨 동적 변경

```ts
// 개발 중 로그 레벨 조정
if (process.env.NODE_ENV === 'development') {
  // Ctrl+Shift+D로 디버그 모드 토글
  globalShortcut.register('CommandOrControl+Shift+D', () => {
    const currentLevel = logger.getLevel();
    const newLevel = currentLevel === 'debug' ? 'info' : 'debug';
    logger.setLevel(newLevel);
    console.log(`Log level changed to: ${newLevel}`);
  });
}
```

### Hot Reload 문제

**해결책**:
```ts
// webpack.config.js 또는 vite.config.js 확인
export default {
  // ...
  server: {
    hmr: {
      port: 3001, // 다른 포트 사용
    }
  }
}

// Electron에서 개발 서버 연결
if (isDev) {
  mainWindow.loadURL('http://localhost:3000');
  mainWindow.webContents.openDevTools();
} else {
  mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
}
```

## 📋 문제 해결 체크리스트

### 기본 진단
- [ ] Node.js와 npm 버전 확인
- [ ] 의존성 설치 상태 확인
- [ ] TypeScript 컴파일 에러 해결
- [ ] preload 스크립트 로드 확인

### Electron 관련
- [ ] context isolation 설정 확인
- [ ] IPC 채널 핸들러 등록 확인
- [ ] 보안 설정 검토
- [ ] 권한 요청 구현

### 성능 관련
- [ ] 메모리 누수 체크
- [ ] 이벤트 리스너 정리
- [ ] 디바운싱 적용
- [ ] 캐싱 전략 구현

### 개발 환경
- [ ] Hot reload 설정
- [ ] 로그 레벨 조정
- [ ] 디버깅 도구 활용
- [ ] 프로덕션 빌드 테스트

---

**다음**: [Architecture](./architecture.md) - 프로젝트 구조 및 패턴 가이드
