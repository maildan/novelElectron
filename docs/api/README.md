# Loop Typing Analytics - API Documentation

## 🔥 기가차드 API 문서 모음

이 디렉토리는 Loop 프로젝트의 모든 핵심 모듈에 대한 상세한 API 문서를 포함합니다.

## 📚 문서 목록

### 핵심 모듈
- **[WindowTracker](./window-tracker.md)** - 실시간 윈도우 추적 및 이벤트 감지
- **[UnifiedHandler](./unified-handler.md)** - 키보드 도메인 통합 관리 Facade
- **[StatsManager](./stats-manager.md)** - 실시간 타이핑 통계 계산
- **[HangulComposer](./hangul-composer.md)** - 한글 조합형 처리 로직
- **[DatabaseManager](./database-manager.md)** - 데이터베이스 백업 및 관리

### 고급 기능 모듈
- **[BrowserDetector](./browser-detector.md)** - 브라우저 및 웹사이트 감지, 생산성 분석
- **[MemoryManager](./memory-manager.md)** - 실시간 메모리 모니터링 및 최적화
- **[DataSyncManager](./data-sync-manager.md)** - 클라우드 동기화 및 백업 관리

### 기타 모듈
- **[Types](./types.md)** - 공유 타입 정의
- **[IPC Channels](./ipc-channels.md)** - IPC 통신 채널 정의
- **[Utils](./utils.md)** - 공통 유틸리티 함수들

## 🏗️ 아키텍처 개요

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Renderer      │◄──►│   IPC Layer     │◄──►│   Main Process  │
│   (Next.js)     │    │                 │    │   (Electron)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                        ┌─────────────────────────────────┤
                        │                                 │
                ┌───────▼────────┐                ┌──────▼───────┐
                │ UnifiedHandler │                │ WindowTracker│
                │   (Facade)     │                │ (Event-based)│
                └────────┬───────┘                └─────────────-┘
                         │
            ┌────────────┼────────────┐
            │            │            │
    ┌───────▼───┐ ┌──────▼──────┐ ┌───▼────────┐
    │StatsManager│ │HangulComposer│ │ Database │
    │           │ │             │ │ Manager    │
    └───────────┘ └─────────────┘ └───────────-┘
```

## 🎯 주요 특징

### 타입 안전성
- **절대 `any` 타입 사용 금지** - 모든 타입이 명시적으로 정의됨
- **Generic 타입 활용** - `Result<T>`, `IpcResponse<T>` 등
- **인터페이스 우선** - camelCase 네이밍 규칙 준수

### 이벤트 기반 아키텍처
- **EventEmitter 패턴** - 실시간 상태 변경 감지
- **옵저버 패턴** - 윈도우 변경 이벤트 구독
- **Facade 패턴** - UnifiedHandler를 통한 통합 인터페이스

### 성능 최적화
- **배치 처리** - 키보드 이벤트 버퍼링
- **메모리 효율성** - 순환 버퍼를 통한 메모리 제한
- **백그라운드 처리** - 통계 계산 및 데이터베이스 작업

## 🔧 개발 가이드

### 새로운 모듈 추가 시
1. **BaseManager 확장** - 일관된 라이프사이클 관리
2. **타입 정의 먼저** - shared/types.ts에 인터페이스 정의
3. **로그 구조화** - Logger 시스템 활용
4. **에러 처리** - Result<T> 타입으로 일관된 에러 핸들링

### 테스트 가이드
- **단위 테스트** - 각 모듈의 핵심 로직
- **통합 테스트** - IPC 통신 및 이벤트 흐름
- **성능 테스트** - 키보드 이벤트 처리 속도

## 📋 체크리스트

### 코드 리뷰 전
- [ ] TypeScript 컴파일 에러 0개
- [ ] ESLint 에러 0개 (경고는 허용)
- [ ] 모든 public 메소드에 JSDoc 주석
- [ ] 타입 안전성 보장 (any 타입 사용 금지)
- [ ] 로그 구조화 (Logger 시스템 사용)

### 성능 체크
- [ ] 메모리 누수 없음
- [ ] 이벤트 리스너 정리
- [ ] 배치 처리 최적화
- [ ] 데이터베이스 인덱스 활용

---

**🔥 기가차드 원칙**: 타입 안전성 > 성능 > 가독성 > 편의성

모든 API는 이 원칙을 따라 설계되었으며, Loop 프로젝트의 최고 품질을 보장합니다.
