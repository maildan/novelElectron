# Architecture 가이드

> 🔥 **프로젝트 구조 및 패턴 완전 가이드** - 확장 가능한 아키텍처 설계

## 개요

loop/loop 프로젝트의 아키텍처 원칙, 디자인 패턴, 코드 구조를 상세히 설명합니다.
모든 패턴은 확장성, 유지보수성, 타입 안전성을 고려하여 설계되었습니다.

## 🏗️ 전체 아키텍처

### Electron 멀티프로세스 구조
```
┌─────────────────────────────────────────┐
│               Main Process              │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │ App Manager │  │ Keyboard Engine │   │
│  └─────────────┘  └─────────────────┘   │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │ IPC Manager │  │ Database Layer  │   │
│  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────┘
                    │
                    │ IPC Bridge
                    │
┌─────────────────────────────────────────┐
│            Renderer Process            │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │ React App   │  │ State Manager   │   │
│  └─────────────┘  └─────────────────┘   │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │ UI Components│  │ API Adapters   │   │
│  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────┘
```

### 프로젝트 구조
```
loop/
├── src/
│   ├── main/                    # Main Process
│   │   ├── app/                # App 생명주기 관리
│   │   ├── keyboard/           # 키보드 모니터링
│   │   ├── managers/           # 각종 매니저들
│   │   └── database/           # 데이터베이스 레이어
│   │
│   ├── renderer/               # Renderer Process  
│   │   ├── components/         # React 컴포넌트
│   │   ├── hooks/              # Custom Hooks
│   │   ├── store/              # 상태 관리
│   │   └── utils/              # UI 유틸리티
│   │
│   ├── preload/                # Preload Scripts
│   │   └── index.ts            # electronAPI 노출
│   │
│   ├── shared/                 # 공통 모듈
│   │   ├── common.ts           # 공통 유틸리티
│   │   ├── types.ts            # 타입 정의
│   │   └── logger.ts           # 로깅 시스템
│   │
│   └── types/                  # 글로벌 타입
│       └── global.d.ts         # Window 인터페이스 확장
│
├── docs/api/                   # API 문서
└── scripts/                    # 빌드/배포 스크립트
```

## 🎯 설계 원칙

### 1. 단일 책임 원칙 (SRP)
각 모듈은 하나의 명확한 책임만 가집니다.

```ts
// ❌ Bad - 여러 책임이 섞임
class KeyboardManager {
  startMonitoring() { /* ... */ }
  saveSession() { /* ... */ }
  sendNotification() { /* ... */ }
  updateUI() { /* ... */ }
}

// ✅ Good - 책임 분리
class KeyboardEngine {
  startMonitoring() { /* 키보드 모니터링만 */ }
}

class SessionManager {
  saveSession() { /* 세션 관리만 */ }
}

class NotificationService {
  sendNotification() { /* 알림만 */ }
}
```

### 2. 의존성 역전 원칙 (DIP)
구체적인 구현이 아닌 추상화에 의존합니다.

```ts
// 추상화 정의
interface IKeyboardEngine {
  start(): Promise<boolean>
  stop(): Promise<boolean>
  getStatus(): Promise<MonitoringStatus>
}

interface IDatabase {
  save<T>(data: T): Promise<boolean>
  find<T>(query: Query): Promise<T[]>
}

// 구현체
class KeyboardManager {
  constructor(
    private keyboardEngine: IKeyboardEngine,
    private database: IDatabase
  ) {}
  
  async startSession(): Promise<void> {
    await this.keyboardEngine.start();
    // 데이터베이스 구현체를 몰라도 됨
    await this.database.save(newSession);
  }
}
```

### 3. 타입 안전성
모든 데이터 흐름에 강타입을 적용합니다.

```ts
// 런타임 타입 검증과 컴파일타임 타입 체크
function validateAndProcess<T>(
  data: unknown,
  validator: (data: unknown) => data is T,
  processor: (data: T) => void
): void {
  if (validator(data)) {
    processor(data); // T로 타입 안전 보장
  } else {
    throw new Error('Invalid data format');
  }
}

// 사용 예제
validateAndProcess(
  receivedData,
  isKeyboardEvent,
  (event: KeyboardEvent) => processKeyEvent(event)
);
```

## 🔧 핵심 패턴

### 1. Singleton 패턴 (개선된 버전)

```ts
// 타입 안전한 싱글톤
abstract class Singleton {
  private static instances = new Map<string, Singleton>();
  
  protected constructor() {}
  
  static getInstance<T extends Singleton>(this: new() => T): T {
    const name = this.name;
    
    if (!Singleton.instances.has(name)) {
      Singleton.instances.set(name, new this());
    }
    
    return Singleton.instances.get(name) as T;
  }
}

// 사용
class Logger extends Singleton {
  log(message: string): void {
    console.log(message);
  }
}

const logger = Logger.getInstance(); // 타입 안전
```

### 2. Observer 패턴 (이벤트 시스템)

```ts
// 타입 안전한 이벤트 시스템
class TypedEventEmitter<Events extends Record<string, any[]>> {
  private listeners = new Map<keyof Events, Function[]>();
  
  on<K extends keyof Events>(
    event: K, 
    listener: (...args: Events[K]) => void
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }
  
  emit<K extends keyof Events>(event: K, ...args: Events[K]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => listener(...args));
    }
  }
  
  off<K extends keyof Events>(
    event: K, 
    listener: (...args: Events[K]) => void
  ): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }
}

// 이벤트 타입 정의
interface KeyboardEvents {
  'key-pressed': [KeyboardEvent]
  'session-started': [SessionStats]
  'error-occurred': [Error, string]
}

// 사용
class KeyboardEngine extends TypedEventEmitter<KeyboardEvents> {
  private processKeyEvent(event: KeyboardEvent): void {
    this.emit('key-pressed', event); // 타입 체크됨
  }
}
```

### 3. Factory 패턴 (매니저 생성)

```ts
// 매니저 팩토리
interface ManagerConfig {
  type: 'keyboard' | 'session' | 'settings'
  options?: Record<string, any>
}

class ManagerFactory {
  private static instances = new Map<string, any>();
  
  static create<T>(config: ManagerConfig): T {
    const key = `${config.type}-${JSON.stringify(config.options)}`;
    
    if (this.instances.has(key)) {
      return this.instances.get(key);
    }
    
    let manager: T;
    
    switch (config.type) {
      case 'keyboard':
        manager = new KeyboardManager(config.options) as T;
        break;
      case 'session':
        manager = new SessionManager(config.options) as T;
        break;
      case 'settings':
        manager = new SettingsManager(config.options) as T;
        break;
      default:
        throw new Error(`Unknown manager type: ${config.type}`);
    }
    
    this.instances.set(key, manager);
    return manager;
  }
}
```

### 4. Strategy 패턴 (알고리즘 선택)

```ts
// 키 처리 전략
interface KeyProcessingStrategy {
  process(event: KeyboardEvent): ProcessedKeyEvent
}

class DebounceStrategy implements KeyProcessingStrategy {
  private lastEventTime = 0;
  
  constructor(private debounceMs: number) {}
  
  process(event: KeyboardEvent): ProcessedKeyEvent {
    const now = Date.now();
    if (now - this.lastEventTime < this.debounceMs) {
      return { ...event, ignored: true };
    }
    
    this.lastEventTime = now;
    return { ...event, ignored: false };
  }
}

class ThrottleStrategy implements KeyProcessingStrategy {
  private eventBuffer: KeyboardEvent[] = [];
  private timer: NodeJS.Timeout | null = null;
  
  constructor(private throttleMs: number) {}
  
  process(event: KeyboardEvent): ProcessedKeyEvent {
    this.eventBuffer.push(event);
    
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.flushBuffer();
        this.timer = null;
      }, this.throttleMs);
    }
    
    return { ...event, buffered: true };
  }
}

// 컨텍스트
class KeyboardProcessor {
  constructor(private strategy: KeyProcessingStrategy) {}
  
  setStrategy(strategy: KeyProcessingStrategy): void {
    this.strategy = strategy;
  }
  
  processKey(event: KeyboardEvent): ProcessedKeyEvent {
    return this.strategy.process(event);
  }
}
```

## 📦 모듈 시스템

### 1. 의존성 주입

```ts
// 의존성 컨테이너
class Container {
  private services = new Map<string, any>();
  private factories = new Map<string, () => any>();
  
  register<T>(name: string, factory: () => T): void {
    this.factories.set(name, factory);
  }
  
  resolve<T>(name: string): T {
    if (this.services.has(name)) {
      return this.services.get(name);
    }
    
    const factory = this.factories.get(name);
    if (!factory) {
      throw new Error(`Service ${name} not found`);
    }
    
    const service = factory();
    this.services.set(name, service);
    return service;
  }
}

// 서비스 등록
const container = new Container();

container.register('logger', () => Logger.getInstance());
container.register('database', () => new DatabaseService());
container.register('keyboardEngine', () => 
  new KeyboardEngine(
    container.resolve('logger'),
    container.resolve('database')
  )
);

// 사용
const keyboardEngine = container.resolve<KeyboardEngine>('keyboardEngine');
```

### 2. 모듈 인터페이스

```ts
// 모듈 정의
interface Module {
  name: string
  version: string
  initialize(): Promise<void>
  shutdown(): Promise<void>
  getAPI(): Record<string, Function>
}

// 키보드 모듈 구현
class KeyboardModule implements Module {
  name = 'keyboard'
  version = '1.0.0'
  
  private engine: KeyboardEngine
  
  async initialize(): Promise<void> {
    this.engine = container.resolve('keyboardEngine');
    await this.engine.initialize();
  }
  
  async shutdown(): Promise<void> {
    await this.engine.shutdown();
  }
  
  getAPI(): Record<string, Function> {
    return {
      start: () => this.engine.start(),
      stop: () => this.engine.stop(),
      getStatus: () => this.engine.getStatus()
    };
  }
}

// 모듈 매니저
class ModuleManager {
  private modules = new Map<string, Module>();
  
  async registerModule(module: Module): Promise<void> {
    await module.initialize();
    this.modules.set(module.name, module);
  }
  
  getModuleAPI(name: string): Record<string, Function> {
    const module = this.modules.get(name);
    if (!module) {
      throw new Error(`Module ${name} not found`);
    }
    return module.getAPI();
  }
  
  async shutdown(): Promise<void> {
    for (const module of this.modules.values()) {
      await module.shutdown();
    }
  }
}
```

## 🔄 상태 관리

### 1. Redux 패턴 (간소화 버전)

```ts
// 액션 타입
interface Action<T = any> {
  type: string
  payload?: T
}

// 리듀서
type Reducer<State> = (state: State, action: Action) => State

// 스토어
class Store<State> {
  private state: State
  private listeners: ((state: State) => void)[] = []
  
  constructor(
    private reducer: Reducer<State>,
    initialState: State
  ) {
    this.state = initialState
  }
  
  getState(): State {
    return this.state
  }
  
  dispatch(action: Action): void {
    this.state = this.reducer(this.state, action)
    this.listeners.forEach(listener => listener(this.state))
  }
  
  subscribe(listener: (state: State) => void): () => void {
    this.listeners.push(listener)
    
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }
}

// 앱 상태
interface AppState {
  keyboard: {
    isMonitoring: boolean
    currentSession: SessionStats | null
    config: KeyboardConfig
  }
  ui: {
    theme: 'light' | 'dark'
    isLoading: boolean
  }
}

// 리듀서 구현
const appReducer: Reducer<AppState> = (state, action) => {
  switch (action.type) {
    case 'KEYBOARD_START':
      return {
        ...state,
        keyboard: { ...state.keyboard, isMonitoring: true }
      }
    
    case 'SESSION_UPDATE':
      return {
        ...state,
        keyboard: { ...state.keyboard, currentSession: action.payload }
      }
    
    default:
      return state
  }
}
```

### 2. React 상태 관리

```ts
// 커스텀 훅
function useKeyboardState() {
  const [state, setState] = useState({
    isMonitoring: false,
    currentSession: null as SessionStats | null,
    config: null as KeyboardConfig | null
  })
  
  const startMonitoring = useCallback(async () => {
    const result = await window.electronAPI.keyboard.startMonitoring()
    if (result.success) {
      setState(prev => ({ ...prev, isMonitoring: true }))
    }
  }, [])
  
  const stopMonitoring = useCallback(async () => {
    await window.electronAPI.keyboard.stopMonitoring()
    setState(prev => ({ ...prev, isMonitoring: false }))
  }, [])
  
  // 키보드 이벤트 리스너
  useEffect(() => {
    const handleKeyEvent = (event: KeyboardEvent) => {
      setState(prev => ({
        ...prev,
        currentSession: updateSessionWithKeyEvent(prev.currentSession, event)
      }))
    }
    
    window.electronAPI.keyboard.onKeyEvent(handleKeyEvent)
    
    return () => {
      window.electronAPI.keyboard.removeKeyEventListener(handleKeyEvent)
    }
  }, [])
  
  return {
    ...state,
    startMonitoring,
    stopMonitoring
  }
}
```

## 🔍 테스트 아키텍처

### 1. 테스트 구조

```ts
// 테스트 유틸리티
class TestContainer extends Container {
  setupTestEnvironment(): void {
    // Mock 서비스 등록
    this.register('logger', () => new MockLogger())
    this.register('database', () => new MockDatabase())
  }
}

// 통합 테스트
describe('KeyboardEngine Integration', () => {
  let container: TestContainer
  let keyboardEngine: KeyboardEngine
  
  beforeEach(() => {
    container = new TestContainer()
    container.setupTestEnvironment()
    keyboardEngine = container.resolve('keyboardEngine')
  })
  
  test('should start monitoring successfully', async () => {
    const result = await keyboardEngine.start()
    expect(result).toBe(true)
    
    const status = await keyboardEngine.getStatus()
    expect(status.isActive).toBe(true)
  })
})
```

## 📊 성능 최적화 패턴

### 1. 객체 풀링

```ts
// 이벤트 객체 풀링
class KeyboardEventPool {
  private pool: KeyboardEvent[] = []
  private maxSize = 100
  
  acquire(): KeyboardEvent {
    return this.pool.pop() || this.createNew()
  }
  
  release(event: KeyboardEvent): void {
    if (this.pool.length < this.maxSize) {
      this.reset(event)
      this.pool.push(event)
    }
  }
  
  private createNew(): KeyboardEvent {
    return {
      key: '',
      code: '',
      timestamp: 0,
      type: 'keydown',
      modifiers: { ctrl: false, shift: false, alt: false, meta: false }
    }
  }
  
  private reset(event: KeyboardEvent): void {
    event.key = ''
    event.code = ''
    event.timestamp = 0
    // ... 기타 속성 초기화
  }
}
```

### 2. 지연 로딩

```ts
// 모듈 지연 로딩
class LazyModule<T> {
  private instance: T | null = null
  private loading = false
  private loadPromise: Promise<T> | null = null
  
  constructor(private loader: () => Promise<T>) {}
  
  async get(): Promise<T> {
    if (this.instance) {
      return this.instance
    }
    
    if (this.loading) {
      return this.loadPromise!
    }
    
    this.loading = true
    this.loadPromise = this.loader()
    this.instance = await this.loadPromise
    this.loading = false
    
    return this.instance
  }
}

// 사용
const keyboardModule = new LazyModule(() => import('./KeyboardModule'))
```

## 📋 아키텍처 체크리스트

### 설계 원칙
- [ ] 단일 책임 원칙 적용
- [ ] 의존성 역전 구현
- [ ] 인터페이스 기반 설계
- [ ] 타입 안전성 보장

### 패턴 적용
- [ ] 적절한 싱글톤 사용
- [ ] 이벤트 기반 통신
- [ ] 팩토리 패턴 활용
- [ ] 전략 패턴 구현

### 모듈 구조
- [ ] 의존성 주입 설정
- [ ] 모듈 인터페이스 정의
- [ ] 적절한 상태 관리
- [ ] 테스트 가능한 구조

### 성능 고려
- [ ] 객체 풀링 적용
- [ ] 지연 로딩 구현
- [ ] 메모리 누수 방지
- [ ] 효율적인 이벤트 처리

---

이제 loop/loop의 모든 API 문서가 모듈별로 체계적으로 정리되었습니다! 🔥

각 문서는 500줄 이하로 유지되면서도 실전에서 바로 사용할 수 있는 구체적인 예제와 패턴들을 포함하고 있습니다.
