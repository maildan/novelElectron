# Loop/Loop API 문서 센터

> 🔥 **GigaChad-Style Documentation for FE Developers**
> 
> loop/loop 프로젝트의 모든 API, 유틸리티, 타입 정보를 체계적으로 정리한 문서입니다.

## 📚 문서 구조

### 핵심 API 문서
- **[Electron API](./electron-api.md)** - `window.electronAPI` 완전 가이드
- **[Utils & Common](./utils.md)** - 공통 유틸리티 및 디버깅 도구
- **[Types & Interfaces](./types.md)** - TypeScript 타입 정의 모음
- **[IPC Channels](./ipc-channels.md)** - Electron IPC 채널 레퍼런스

### 지원 문서
- **[Troubleshooting](./troubleshooting.md)** - 문제 해결 가이드
- **[Architecture](./architecture.md)** - 프로젝트 구조 및 패턴

## 🚀 빠른 시작

### 1. Electron API 사용 (FE에서)
```ts
// 앱 정보 가져오기
const version = await window.electronAPI.app.getVersion();

// 키보드 모니터링 시작
await window.electronAPI.keyboard.startMonitoring();

// 설정 저장
await window.electronAPI.settings.set('theme', 'dark');
```

### 2. 공통 유틸리티 사용
```ts
import { debugEntry, debugExit, gigaBenchmark } from '@shared/common';

function myFunction() {
  debugEntry('myFunction');
  // 로직...
  debugExit('myFunction');
}
```

### 3. 타입 안전성
```ts
import type { KeyboardConfig, SessionStats } from '@shared/types';

const config: KeyboardConfig = {
  enabled: true,
  globalShortcuts: true,
  // ... 타입 안전 보장
};
```

## 📁 파일 구조

```
loop/
├── src/
│   ├── preload/index.ts      # window.electronAPI 정의
│   ├── shared/
│   │   ├── common.ts         # 공통 유틸리티
│   │   ├── types.ts          # 타입 정의
│   │   └── logger.ts         # 로깅 시스템
│   └── types/global.d.ts     # 글로벌 타입 확장
└── docs/api/                 # 이 문서들
```

## ⚡ 중요 원칙

1. **타입 안전성**: 모든 API는 TypeScript로 타입이 정의됨
2. **No `any` 타입**: 명시적 타입만 사용
3. **Modular**: 기능별로 모듈화된 구조
4. **Debug-Ready**: 모든 주요 함수에 디버그 로그 내장
5. **Performance**: 벤치마킹 도구 내장

## 🛠️ 개발자 도구

- **Debug Logs**: `debugEntry()`, `debugExit()` 사용
- **Benchmarking**: `gigaBenchmark()` 활용
- **Type Checking**: strict TypeScript 설정
- **Error Handling**: 공통 에러 패턴 적용

---

**다음 단계**: 각 모듈별 상세 문서를 참고하여 구체적인 API 사용법을 확인하세요.

---

## 5. 결론
- loop/loop FE 개발자는 이 문서 하나만 보면 됨
- 구조/예시/확장/누락/유틸 모두 한눈에
- 군더더기 없이 실전 위주, 파일 분리 금지, 500줄 제한
