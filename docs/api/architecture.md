# Loop Typing Analytics - 아키텍처 문서

## 🏗️ 시스템 아키텍처 개요

Loop는 Electron + Next.js 기반의 하이브리드 데스크탑 애플리케이션으로, 실시간 키보드 모니터링과 타이핑 분석을 제공합니다.

## 📊 전체 아키텍처 다이어그램
┌────────────────────────────────────────────────────────────┐
│                      🖋️ Loop Application                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌────────────────────┐     ┌──────────────────────────┐   │
│  │   🖥 Renderer       │◄───►│    ⚙ Main Process        │   │
│  │   (Next.js)        │     │    (Electron)            │   │
│  │                    │     │                          │   │
│  │ ┌────────────────┐ │     │ ┌──────────────────────┐ │   │
│  │ │ Dashboard UI   │ │     │ │ IPC Channel Layer    │ │   │
│  │ └────────────────┘ │     │ └──────────────────────┘ │   │
│  │                    │     │                          │   │
│  │ ┌────────────────┐ │     │ ┌──────────────────────┐ │   │
│  │ │ Stats Viewer   │ │     │ │ UnifiedHandler.ts     │ │   │
│  │ │ (WPM 등)       │ │     │ │ (Facade 역할)         │ │   │
│  │ └────────────────┘ │     │ └──────────────────────┘ │   │
│  └────────────────────┘     │                          │   │
│                              │ ┌──────────────────────┐ │   │
│                              │ │ WindowTracker.ts     │ │   │
│                              │ └──────────────────────┘ │   │
│                              │ ┌──────────────────────┐ │   │
│                              │ │ KeyboardEngine.ts    │ │   │
│                              │ └──────────────────────┘ │   │
│                              │ ┌──────────────────────┐ │   │
│                              │ │ DB Manager           │ │   │
│                              │ └──────────────────────┘ │   │
│                              └──────────────────────────┘   │
└────────────────────────────────────────────────────────────┘

```

## 🔧 핵심 컴포넌트

### 1. Main Process (Electron)

#### 📱 UnifiedHandler
- **역할**: 키보드 도메인의 Facade 패턴 구현
- **책임**: 모든 키보드 관련 기능의 통합 인터페이스 제공
- **패턴**: Facade, Singleton

#### 🖥️ WindowTracker
- **역할**: 실시간 윈도우 변경 감지 및 추적
- **책임**: 윈도우 포커스 변경, 세션 관리, 이벤트 발생
- **패턴**: Observer, Event Emitter

#### ⌨️ KeyboardEngine
- **역할**: 저수준 키보드 이벤트 처리
- **책임**: uiohook-napi 연동, 이벤트 필터링
- **패턴**: Adapter, Strategy

#### 📊 StatsManager
- **역할**: 실시간 타이핑 통계 계산
- **책임**: WPM, 정확도, 키스트로크 집계
- **패턴**: Strategy, Observer

#### 🇰🇷 HangulComposer
- **역할**: 한글 조합형 처리 로직
- **책임**: 초성, 중성, 종성 조합 및 완성
- **패턴**: State Machine, Strategy

#### 💾 DatabaseManager
- **역할**: 데이터베이스 백업 및 관리
- **책임**: 세션 저장, 백업 생성, 무결성 검증
- **패턴**: Repository, Command

### 2. Renderer Process (Next.js)

#### 🎨 Dashboard Components
- **역할**: 사용자 인터페이스 렌더링
- **책임**: 실시간 데이터 표시, 사용자 상호작용
- **패턴**: Component, Observer

#### 📡 IPC Communication
- **역할**: Main-Renderer 간 통신
- **책임**: 타입 안전한 메시지 전달
- **패턴**: Message Passing, Observer

## 🔄 데이터 흐름

### 키보드 이벤트 처리 흐름

```
1. 사용자 키 입력
   ↓
2. uiohook-napi → KeyboardEngine
   ↓
3. KeyboardEngine → UnifiedHandler
   ↓ (이벤트 분기)
4a. HangulComposer (한글 처리)
4b. StatsManager (통계 계산)
4c. WindowTracker (윈도우 정보)
   ↓
5. DatabaseManager (세션 저장)
   ↓
6. IPC → Renderer (실시간 업데이트)
   ↓
7. Dashboard UI 업데이트
```

### 세션 관리 흐름

```
1. WindowTracker: 윈도우 변경 감지
   ↓
2. UnifiedHandler: 세션 상태 관리
   ↓
3. StatsManager: 통계 집계
   ↓
4. DatabaseManager: 세션 저장
   ↓
5. IPC 알림 → Dashboard 업데이트
```

## 🎯 설계 원칙

### 1. 타입 안전성 (Type Safety)
- **절대 `any` 타입 사용 금지**
- **Generic 타입 적극 활용**: `Result<T>`, `IpcResponse<T>`
- **명시적 인터페이스 정의**: 모든 public API

### 2. 성능 최적화 (Performance)
- **이벤트 기반 아키텍처**: 불필요한 폴링 제거
- **배치 처리**: 키보드 이벤트 버퍼링
- **메모리 효율성**: 순환 버퍼, 가비지 컬렉션 최적화

### 3. 모듈화 (Modularity)
- **단일 책임 원칙**: 각 클래스는 하나의 명확한 역할
- **의존성 주입**: 테스트 가능한 설계
- **Facade 패턴**: 복잡성 캡슐화

### 4. 확장성 (Extensibility)
- **Plugin 아키텍처**: 새로운 언어/앱 지원 확장
- **Event-driven**: 새로운 기능 추가 용이
- **Strategy 패턴**: 알고리즘 교체 가능

## 🔐 보안 아키텍처

### Electron 보안 모델

```
┌─────────────────────────────────────┐
│          Renderer Process           │
│     (contextIsolation: true)        │
│  ┌─────────────────────────────────┐ │
│  │       Next.js App               │ │
│  │   (No Node.js Access)           │ │
│  └─────────────────────────────────┘ │
└─────────────────┬───────────────────┘
                  │ IPC (Type-safe)
┌─────────────────▼───────────────────┐
│         Preload Script              │
│    (contextBridge API only)         │
└─────────────────┬───────────────────┘
                  │ Secure Bridge
┌─────────────────▼───────────────────┐
│          Main Process               │
│   (Full Node.js + System Access)    │
│  ┌─────────────────────────────────┐ │
│  │    Keyboard Monitoring          │ │
│  │    Database Operations          │ │
│  │    File System Access          │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 보안 정책
1. **contextIsolation**: 렌더러와 메인 프로세스 완전 분리
2. **nodeIntegration**: false로 설정하여 렌더러에서 Node.js 접근 차단
3. **preload 스크립트**: contextBridge로만 안전한 API 노출
4. **권한 최소화**: 필요한 시스템 권한만 요청

## 📁 디렉토리 구조

```
src/
├── main/                   # Electron 메인 프로세스
│   ├── core/              # 핵심 시스템 (window, security, error)
│   ├── keyboard/          # 키보드 도메인 모듈
│   │   ├── UnifiedHandler.ts      # Facade 패턴
│   │   ├── WindowTracker.ts       # 윈도우 추적
│   │   ├── KeyboardEngine.ts      # 키보드 엔진
│   │   ├── StatsManager.ts        # 통계 관리
│   │   └── HangulComposer.ts      # 한글 조합
│   ├── managers/          # 시스템 관리자들
│   ├── handlers/          # IPC 핸들러들
│   └── services/          # 비즈니스 서비스
├── renderer/              # Next.js 렌더러 프로세스
├── shared/                # 공유 타입 및 유틸리티
├── preload/               # Preload 스크립트
└── types/                 # TypeScript 타입 정의
```

## 🔄 라이프사이클 관리

### 애플리케이션 시작 흐름

```
1. Electron app.ready
   ↓
2. Security Manager 초기화
   ↓
3. Window Manager 생성
   ↓
4. IPC Handlers 등록
   ↓
5. UnifiedHandler 초기화
   ↓
6. KeyboardEngine 시작
   ↓
7. WindowTracker 활성화
   ↓
8. Database 연결
   ↓
9. Renderer 프로세스 로드
   ↓
10. Dashboard UI 렌더링
```

### 종료 흐름

```
1. app.before-quit 이벤트
   ↓
2. KeyboardEngine 정지
   ↓
3. WindowTracker 정리
   ↓
4. 활성 세션 저장
   ↓
5. Database 연결 종료
   ↓
6. 모든 윈도우 닫기
   ↓
7. 애플리케이션 종료
```

## 📊 성능 메트릭

### 목표 성능 지표

| 메트릭 | 목표 값 | 측정 방법 |
|--------|---------|-----------|
| 키 이벤트 지연시간 | < 10ms | uiohook → UnifiedHandler |
| 메모리 사용량 | < 100MB | Electron 프로세스 전체 |
| CPU 사용률 | < 5% | 키보드 모니터링 시 |
| 윈도우 전환 감지 | < 100ms | WindowTracker 이벤트 |
| 데이터베이스 쓰기 | < 50ms | 세션 저장 시간 |
| UI 업데이트 | < 16ms | 60fps 실시간 차트 |

### 병목 지점 및 최적화

1. **키보드 이벤트 처리**
   - 배치 처리로 CPU 부하 감소
   - 이벤트 필터링으로 불필요한 처리 제거

2. **통계 계산**
   - 증분 계산으로 전체 재계산 방지
   - 슬라이딩 윈도우 알고리즘 사용

3. **데이터베이스 작업**
   - 트랜잭션 배치 처리
   - 인덱스 최적화

4. **UI 렌더링**
   - React.memo 및 useCallback 활용
   - 가상화를 통한 대용량 데이터 처리

## 🧪 테스트 전략

### 단위 테스트
- **대상**: 각 클래스의 핵심 로직
- **도구**: Jest + TypeScript
- **커버리지**: 90% 이상

### 통합 테스트
- **대상**: IPC 통신, 데이터베이스 연동
- **시나리오**: 실제 사용자 워크플로우

### 성능 테스트
- **도구**: 내장 벤치마크 시스템
- **지표**: 응답시간, 메모리, CPU 사용률

### E2E 테스트
- **도구**: Playwright + Electron
- **시나리오**: 전체 사용자 여정

---

**🔥 Loop 아키텍처는 타입 안전성, 성능, 확장성을 모두 만족하는 현대적인 Electron 애플리케이션의 모범 사례입니다.**
