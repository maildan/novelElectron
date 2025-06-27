# 🔥 기가차드 Cursor 룰 - Loop Typing Analytics 프로젝트

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## 📋 프로젝트 정보
- **프로젝트명**: Loop Typing Analytics
- **기술스택**: Electron + Next.js + React + TypeScript + Tailwind CSS + Prisma + uiohook-napi
- **아키텍처**: Main Process (Electron) + Renderer Process (Next.js)
- **데이터베이스**: SQLite + Prisma ORM
- **핵심기능**: 글로벌 키보드 모니터링, 실시간 WPM 계산, AI 분석

## 🎯 코딩 스타일 & 원칙

### TypeScript 엄격 규칙
- **절대 `any` 타입 사용 금지** - `unknown` 타입과 타입 가드 사용
- **모든 함수에 명시적 반환 타입 정의** 필수
- **Interface vs Type**: Interface 우선 사용, camelCase 네이밍
- **Generic 타입**: 의미있는 이름 사용 (`T` 대신 `TData`, `TResponse`)
- **Optional chaining**: 과도한 `?.` 사용 지양, 타입 가드 선호

### React/Next.js 컴포넌트 규칙
- **'use client' 지시어**: 모든 렌더러 컴포넌트 최상단에 필수
- **컴포넌트명**: PascalCase, 파일명과 일치
- **Props 인터페이스**: 컴포넌트명 + Props 형태 (예: `DashboardProps`)
- **Hooks 순서**: useState → useEffect → custom hooks → handlers
- **이벤트 핸들러**: `handle` 접두사 사용 (예: `handleSubmit`)

### Tailwind CSS 최적화 규칙
- **중복 클래스 절대 금지**: 프리컴파일된 스타일 시스템 사용
- **조건부 스타일**: 템플릿 리터럴 대신 프리컴파일된 className 사용
- **반응형**: Tailwind 표준 브레이크포인트만 사용 (sm:640px, md:768px, lg:1024px, xl:1280px)
- **스타일 상수**: `COMPONENT_STYLES` 객체로 모든 스타일 미리 정의
- **색상**: 프로젝트 컬러 팔레트 준수 (blue-600, purple-600, green-600, red-600)

## 🏗️ 파일 구조 & 네이밍

### 디렉토리 구조
```
src/
├── main/           # Electron 메인 프로세스
├── renderer/       # Next.js 렌더러 프로세스  
├── shared/         # 공유 타입 및 유틸리티
└── preload/        # Preload 스크립트
```

### 파일 네이밍 규칙
- **컴포넌트**: PascalCase (예: `Dashboard.tsx`, `AppHeader.tsx`)
- **유틸리티**: camelCase (예: `keyboardService.ts`, `logger.ts`)
- **타입 정의**: camelCase (예: `types.ts`, `interfaces.ts`)
- **상수**: UPPER_SNAKE_CASE (예: `KEYBOARD_CONSTANTS.ts`)

## 🔧 Electron 특화 규칙

### 보안 원칙
- **contextIsolation: true** 필수 유지
- **nodeIntegration: false** 필수 유지
- **Preload 스크립트**: contextBridge만 사용하여 API 노출
- **IPC 통신**: 타입 안전한 채널 정의 필수

### 프로세스 분리
- **Main Process**: Node.js API, 시스템 접근, 데이터베이스 작업
- **Renderer Process**: React 컴포넌트, UI 로직, 브라우저 API
- **Preload**: 안전한 API 브릿지 역할만

### IPC 통신 패턴
- **채널명**: `namespace:action` 형태 (예: `keyboard:start-monitoring`)
- **응답 타입**: `IpcResponse<T>` 제네릭 사용
- **에러 처리**: 모든 IPC 호출에 try-catch 필수

## 🎨 UI/UX 최적화 규칙

### 레이아웃 시스템
- **단일 레이아웃 시스템**: Grid 기반 사용
- **Z-Index 계층**: 100 > 90 > 80 > 70 (10단위 간격)
- **사이드바**: 데스크톱 고정, 모바일 토글 방식
- **반응형**: 모바일 퍼스트 접근법

### 성능 최적화
- **조건부 className**: 프리컴파일된 스타일 사용
- **메모화**: 필요한 경우에만 useMemo/useCallback 사용
- **이벤트 리스너**: 컴포넌트 언마운트 시 정리 필수

## 🔥 기가차드 금지 사항

### 절대 하지 말 것
- **any 타입 사용** - 즉시 unknown으로 변경
- **console.log 남용** - Logger 시스템 사용
- **중복 버튼/기능** - 단일 위치에서만 구현
- **하드코딩된 스타일** - 상수로 정의 후 사용
- **더미 데이터** - 실제 IPC 통신 구현
- **unsafe 코드** - 보안 규칙 준수

### 성능 킬러 패턴
- **매 렌더링마다 객체 생성** - 컴포넌트 외부에서 정의
- **불필요한 useEffect** - 의존성 배열 최적화
- **과도한 상태 업데이트** - 배치 업데이트 고려
- **무한 루프** - 조건부 렌더링에서 주의

## 📝 코드 작성 가이드

### 컴포넌트 템플릿
```typescript
'use client';

import { useState, useEffect } from 'react';
import { ComponentProps } from '../types';
import { Logger } from '../shared/logger';

// 🔥 프리컴파일된 스타일
const COMPONENT_STYLES = {
  container: 'flex flex-col bg-white rounded-lg p-6',
  header: 'text-xl font-bold text-slate-900 mb-4',
  // ... 모든 스타일 미리 정의
} as const;

interface ExampleComponentProps {
  title: string;
  onAction: () => void;
}

export function ExampleComponent({ title, onAction }: ExampleComponentProps): JSX.Element {
  const [state, setState] = useState<string>('');

  useEffect(() => {
    // 정리 함수 필수
    return () => {
      // cleanup
    };
  }, []);

  const handleClick = (): void => {
    Logger.info('COMPONENT', 'Button clicked');
    onAction();
  };

  return (
    <div className={COMPONENT_STYLES.container}>
      <h2 className={COMPONENT_STYLES.header}>{title}</h2>
      <button onClick={handleClick}>Action</button>
    </div>
  );
}
```

### 타입 정의 패턴
```typescript
// 🔥 엄격한 타입 정의
export interface TypingSession {
  id: string;
  content: string;
  startTime: Date;
  endTime: Date;
  keyCount: number;
  wpm: number;
  accuracy: number;
}

// 🔥 IPC 응답 타입
export interface IpcResponse<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: string;
  timestamp: Date;
}

// 🔥 이벤트 타입
export interface KeyboardEvent {
  key: string;
  code: string;
  timestamp: number;
  windowTitle: string;
}
```

### 로거 사용법
```typescript
import { Logger } from '../shared/logger';

// 🔥 구조화된 로깅
Logger.info('COMPONENT_NAME', 'Operation started', { userId: 123 });
Logger.error('COMPONENT_NAME', 'Operation failed', error);
Logger.debug('COMPONENT_NAME', 'Debug info', { data });
```

## 🚀 최적화 체크리스트

### 코드 리뷰 시 확인사항
- [ ] any 타입 사용 여부
- [ ] 중복 코드/스타일 존재 여부
- [ ] 타입 안전성 보장 여부
- [ ] 메모리 누수 가능성
- [ ] IPC 통신 에러 처리
- [ ] 접근성 (aria-label) 고려
- [ ] 반응형 레이아웃 동작
- [ ] 성능 최적화 적용

### 빌드 전 체크
- [ ] TypeScript 컴파일 에러 0개
- [ ] ESLint 에러 0개 (경고는 허용)
- [ ] 사용하지 않는 import 제거
- [ ] console.log 제거 (Logger 사용)
- [ ] 프로덕션 빌드 성공

## 💡 프로젝트별 특수 규칙

### 키보드 모니터링
- **권한 확인**: 항상 사용자 권한 확인 후 실행
- **성능**: 키 이벤트 배치 처리로 최적화
- **보안**: 민감한 정보 로깅 금지

### 데이터베이스
- **Prisma**: 타입 안전한 쿼리만 사용
- **트랜잭션**: 복합 작업 시 트랜잭션 사용
- **마이그레이션**: 스키마 변경 시 백업 필수

### AI 기능
- **비동기 처리**: 모든 AI 작업 비동기로 처리
- **에러 처리**: AI 서비스 장애 대응 로직 필수
- **사용자 피드백**: 로딩 상태 표시 필수

---

**🔥 기가차드 원칙: 타입 안전성 > 성능 > 가독성 > 편의성**

이 규칙을 따르면 Loop 프로젝트가 **최고 품질**의 코드를 유지할 수 있다!
