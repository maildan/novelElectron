# 🏗️ Loop 타이핑 분석 시스템 - 기술 아키텍처 설계

## 📋 **프로젝트 개요**

**Loop**는 작가와 콘텐츠 크리에이터를 위한 **전역 타이핑 분석 시스템**이다.
모든 앱과 웹사이트에서 실시간으로 타이핑 패턴을 모니터링하고, 창작 생산성을 극대화하는 인사이트를 제공한다.

### **핵심 기능**
- 🎯 **전역 키보드 모니터링**: 모든 앱에서 타이핑 감지
- 📊 **실시간 분석**: 타이핑 속도, 리듬, 패턴 분석  
- 🧠 **AI 기반 인사이트**: 창작 몰입도, 최적 작업 시간 분석
- 📱 **크로스 플랫폼**: Windows, macOS, Linux 지원
- ☁️ **클라우드 동기화**: 멀티 디바이스 데이터 연동

---

## 🎯 **기술 스택 선택 근거**

### **Why Electron over Tauri?**

#### **Electron 장점**
- ✅ **검증된 네이티브 모듈 지원**: `uiohook-napi` 완벽 호환
- ✅ **글로벌 키보드 리스닝**: 별도 사이드카 프로세스 불필요  
- ✅ **빠른 개발**: 풍부한 생태계, 예제 코드
- ✅ **TypeScript 완벽 지원**: 타입 안전성 보장
- ✅ **pnpm 호환**: 모든 npm 패키지 즉시 사용 가능

#### **Tauri의 한계**
- ❌ **네이티브 모듈**: Rust 재작성 필요 (개발 시간 3-5배 증가)
- ❌ **권한 복잡성**: macOS Accessibility 권한 처리 복잡
- ❌ **생태계**: 키보드 모니터링 라이브러리 부족

#### **트레이드오프 수용**
- 📦 **앱 크기**: ~200MB (수용 가능한 수준)
- 🧠 **메모리**: ~130-170MB (생산성 도구로 적절)
- ⚡ **성능**: 백그라운드 실행으로 사용자 체감 없음

---

## 🏗️ **시스템 아키텍처**

### **전체 구조도**
```
┌─────────────────────────────────────────────────────────────┐
│                    Loop Desktop App                        │
├─────────────────────────────────────────────────────────────┤
│  Main Process (Node.js)          │  Renderer (React)        │
│  ├── Global Keyboard Listener    │  ├── Dashboard UI        │
│  ├── Data Processing Engine      │  ├── Analytics Charts    │
│  ├── SQLite Database            │  ├── Settings Panel      │
│  ├── Cloud Sync Manager         │  └── Real-time Stats     │
│  └── System Tray Controller     │                           │
├─────────────────────────────────────────────────────────────┤
│  Preload Script (Secure Bridge)                            │
│  ├── IPC Channel Management                                │
│  ├── API Exposure Control                                  │
│  └── Security Layer                                        │
├─────────────────────────────────────────────────────────────┤
│  Native Modules                                            │
│  ├── uiohook-napi (Global Keyboard)                       │
│  ├── active-win (Window Detection)                        │
│  └── node-machine-id (Device ID)                          │
└─────────────────────────────────────────────────────────────┘
```

### **프로세스 통신 구조**
```
Main Process ←─IPC Channels─→ Renderer Process
     ↓                              ↑
Native Modules              Preload Script
     ↓                              ↑
System APIs ←────────────────────────┘
```

---

## 🔧 **Core Technologies**

### **Frontend Stack**
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand + React Query
- **Charts**: Recharts + Chart.js
- **Icons**: Lucide React

### **Backend (Main Process)**
- **Runtime**: Node.js 20+
- **Database**: SQLite + Prisma ORM
- **Analytics**: Custom algorithms
- **File System**: Node.js fs APIs
- **Networking**: Fetch API + Socket.io

### **Native Modules**
```json
{
  "uiohook-napi": "1.5.4",     // 글로벌 키보드 후킹
  "active-win": "8.1.0",       // 활성 윈도우 감지
  "node-machine-id": "1.1.12", // 디바이스 고유 ID
  "systeminformation": "5.21.22" // 시스템 정보
}
```

### **Build & Development**
- **Package Manager**: pnpm 9+
- **Build Tool**: Electron Builder
- **Development**: Electron + Next.js dev server
- **Testing**: Jest + Playwright
- **Linting**: ESLint + Prettier

---

## 📁 **프로젝트 구조**

```
loop/
├── docs/                           # 문서화
│   ├── market-research/            # 시장 분석
│   ├── architecture/               # 기술 설계
│   ├── planning/                   # 개발 계획
│   └── technical/                  # 기술 스펙
├── src/                           # 소스 코드
│   ├── main/                      # Electron Main Process
│   │   ├── index.ts               # 앱 엔트리 포인트
│   │   ├── window.ts              # 윈도우 관리
│   │   ├── tray.ts                # 시스템 트레이
│   │   ├── keyboard/              # 키보드 모니터링
│   │   │   ├── listener.ts        # 글로벌 리스너
│   │   │   ├── processor.ts       # 데이터 처리
│   │   │   └── analyzer.ts        # 패턴 분석
│   │   ├── database/              # 데이터베이스
│   │   │   ├── schema.prisma      # DB 스키마
│   │   │   ├── client.ts          # Prisma 클라이언트
│   │   │   └── migrations/        # DB 마이그레이션
│   │   ├── sync/                  # 클라우드 동기화
│   │   │   ├── manager.ts         # 동기화 관리
│   │   │   └── api.ts             # API 클라이언트
│   │   └── utils/                 # 유틸리티
│   ├── renderer/                  # React Frontend
│   │   ├── app/                   # Next.js App Router
│   │   │   ├── dashboard/         # 메인 대시보드
│   │   │   ├── analytics/         # 분석 페이지
│   │   │   ├── settings/          # 설정 페이지
│   │   │   └── layout.tsx         # 루트 레이아웃
│   │   ├── components/            # React 컴포넌트
│   │   │   ├── ui/                # shadcn/ui 컴포넌트
│   │   │   ├── charts/            # 차트 컴포넌트
│   │   │   ├── typing/            # 타이핑 관련 UI
│   │   │   └── common/            # 공통 컴포넌트
│   │   ├── hooks/                 # React Hooks
│   │   ├── stores/                # Zustand 스토어
│   │   ├── utils/                 # 프론트엔드 유틸
│   │   └── styles/                # CSS 파일
│   ├── preload/                   # Preload Scripts
│   │   ├── index.ts               # 메인 preload
│   │   └── api.ts                 # API 노출
│   └── shared/                    # 공유 코드
│       ├── types/                 # TypeScript 타입
│       ├── constants/             # 상수 정의
│       └── utils/                 # 공통 유틸리티
├── prisma/                        # Prisma 설정
│   ├── schema.prisma              # DB 스키마
│   └── migrations/                # 마이그레이션 파일
├── public/                        # 정적 파일
├── dist/                          # 빌드 결과물
├── release/                       # 배포 파일
├── package.json                   # 패키지 설정
├── electron.config.js             # Electron 설정
├── next.config.js                 # Next.js 설정
├── tailwind.config.js             # Tailwind 설정
└── tsconfig.json                  # TypeScript 설정
```

---

## 🔌 **IPC Channel 설계**

### **Channel 정의**
```typescript
// src/shared/types/ipc.ts
export const IPC_CHANNELS = {
  // 키보드 모니터링
  KEYBOARD: {
    START_MONITORING: 'keyboard:start-monitoring',
    STOP_MONITORING: 'keyboard:stop-monitoring',
    GET_STATS: 'keyboard:get-stats',
    KEY_EVENT: 'keyboard:key-event'
  },
  
  // 데이터베이스
  DATABASE: {
    GET_SESSIONS: 'db:get-sessions',
    GET_ANALYTICS: 'db:get-analytics',
    EXPORT_DATA: 'db:export-data'
  },
  
  // 설정
  SETTINGS: {
    GET_CONFIG: 'settings:get-config',
    UPDATE_CONFIG: 'settings:update-config',
    RESET_CONFIG: 'settings:reset-config'
  },
  
  // 시스템
  SYSTEM: {
    GET_INFO: 'system:get-info',
    MINIMIZE_WINDOW: 'system:minimize',
    CLOSE_APP: 'system:close'
  }
} as const;
```

### **Type-Safe IPC**
```typescript
// src/shared/types/api.ts
export interface ElectronAPI {
  keyboard: {
    startMonitoring(): Promise<boolean>;
    stopMonitoring(): Promise<boolean>;
    getStats(): Promise<TypingStats>;
    onKeyEvent(callback: (event: KeyEvent) => void): void;
  };
  
  database: {
    getSessions(filter: SessionFilter): Promise<Session[]>;
    getAnalytics(range: DateRange): Promise<Analytics>;
    exportData(format: ExportFormat): Promise<string>;
  };
  
  settings: {
    getConfig(): Promise<AppConfig>;
    updateConfig(config: Partial<AppConfig>): Promise<boolean>;
    resetConfig(): Promise<boolean>;
  };
  
  system: {
    getInfo(): Promise<SystemInfo>;
    minimizeWindow(): void;
    closeApp(): void;
  };
}
```

---

## 🗄️ **데이터베이스 설계**

### **Prisma Schema**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./loop.db"
}

model Session {
  id        String   @id @default(cuid())
  deviceId  String
  startTime DateTime
  endTime   DateTime?
  appName   String
  windowTitle String?
  totalKeys Int      @default(0)
  totalTime Int      @default(0) // milliseconds
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  keyEvents KeyEvent[]
  analytics SessionAnalytics?
  
  @@map("sessions")
}

model KeyEvent {
  id        String   @id @default(cuid())
  sessionId String
  timestamp DateTime
  keyCode   Int
  keyChar   String?
  isSpecial Boolean  @default(false)
  duration  Int?     // key press duration in ms
  
  session Session @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  @@map("key_events")
}

model SessionAnalytics {
  id              String @id @default(cuid())
  sessionId       String @unique
  avgWPM          Float
  peakWPM         Float
  accuracy        Float
  keystrokesCount Int
  wordsCount      Int
  errorsCount     Int
  flowScore       Float  // 창작 몰입도 점수
  rhythmScore     Float  // 타이핑 리듬 점수
  
  session Session @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  @@map("session_analytics")
}

model AppUsage {
  id       String @id @default(cuid())
  appName  String
  totalTime Int   // milliseconds
  sessions Int
  avgWPM   Float?
  lastUsed DateTime
  
  @@unique([appName])
  @@map("app_usage")
}

model UserSettings {
  id                String  @id @default("default")
  monitoringEnabled Boolean @default(true)
  autoStart         Boolean @default(true)
  showNotifications Boolean @default(true)
  targetWPM         Int     @default(60)
  theme             String  @default("system")
  language          String  @default("ko")
  privacyMode       Boolean @default(false)
  
  @@map("user_settings")
}
```

---

## 🧠 **분석 알고리즘**

### **1. WPM (Words Per Minute) 계산**
```typescript
export function calculateWPM(keyEvents: KeyEvent[], timeSpanMs: number): number {
  const characters = keyEvents.filter(e => !e.isSpecial).length;
  const words = characters / 5; // 표준: 5글자 = 1단어
  const minutes = timeSpanMs / (1000 * 60);
  return words / minutes;
}
```

### **2. 타이핑 정확도 측정**
```typescript
export function calculateAccuracy(keyEvents: KeyEvent[]): number {
  const totalKeys = keyEvents.length;
  const corrections = keyEvents.filter(e => 
    e.keyCode === 8 || e.keyCode === 46 // Backspace, Delete
  ).length;
  
  return ((totalKeys - corrections) / totalKeys) * 100;
}
```

### **3. 창작 몰입도 분석**
```typescript
export function calculateFlowScore(session: Session): number {
  const { keyEvents } = session;
  const intervals = calculateKeyIntervals(keyEvents);
  
  // 일정한 타이핑 리듬 = 높은 몰입도
  const rhythmConsistency = calculateRhythmConsistency(intervals);
  
  // 수정 빈도가 낮음 = 높은 몰입도  
  const correctionRate = calculateCorrectionRate(keyEvents);
  
  // 긴 연속 타이핑 구간 = 높은 몰입도
  const continuousTyping = calculateContinuousSegments(keyEvents);
  
  return (rhythmConsistency * 0.4) + 
         ((1 - correctionRate) * 0.3) + 
         (continuousTyping * 0.3);
}
```

### **4. 최적 작업 시간 분석**
```typescript
export function findOptimalWorkingHours(sessions: Session[]): HourRange[] {
  const hourlyPerformance = new Map<number, PerformanceMetrics>();
  
  sessions.forEach(session => {
    const hour = session.startTime.getHours();
    const metrics = calculateSessionMetrics(session);
    
    if (!hourlyPerformance.has(hour)) {
      hourlyPerformance.set(hour, []);
    }
    hourlyPerformance.get(hour)!.push(metrics);
  });
  
  return Array.from(hourlyPerformance.entries())
    .map(([hour, metrics]) => ({
      hour,
      avgWPM: average(metrics.map(m => m.wpm)),
      avgFlow: average(metrics.map(m => m.flowScore))
    }))
    .sort((a, b) => b.avgFlow - a.avgFlow);
}
```

---

## 🔐 **보안 & 프라이버시**

### **데이터 보호**
- 🔒 **로컬 우선**: 모든 데이터는 로컬 SQLite에 저장
- 🔐 **암호화**: 민감한 데이터는 AES-256으로 암호화
- 🚫 **키로깅 금지**: 실제 타이핑 내용은 저장하지 않음
- 🔍 **메타데이터만**: 키 코드, 타이밍, 앱 이름만 수집

### **사용자 제어**
- ⚙️ **프라이버시 모드**: 특정 앱 모니터링 제외
- 🗑️ **데이터 삭제**: 언제든 로컬 데이터 완전 삭제
- 🔄 **동기화 선택**: 클라우드 동기화 선택적 활성화
- 📋 **투명성**: 수집되는 데이터 항목 명시

### **권한 관리**
```typescript
// macOS Accessibility 권한 체크
export async function checkAccessibilityPermission(): Promise<boolean> {
  try {
    const hasPermission = await systemPreferences.isTrustedAccessibilityClient(false);
    if (!hasPermission) {
      const result = await dialog.showMessageBox({
        type: 'info',
        title: '접근성 권한 필요',
        message: 'Loop이 타이핑을 모니터링하려면 접근성 권한이 필요합니다.',
        buttons: ['시스템 설정 열기', '나중에'],
        defaultId: 0
      });
      
      if (result.response === 0) {
        shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility');
      }
    }
    return hasPermission;
  } catch (error) {
    console.error('권한 확인 실패:', error);
    return false;
  }
}
```

---

## ⚡ **성능 최적화**

### **메모리 관리**
- 📊 **데이터 스트리밍**: 대용량 세션 데이터 청크 단위 처리
- 🗑️ **가비지 컬렉션**: 주기적 메모리 정리
- 💾 **지연 로딩**: 필요시에만 데이터 로드
- 🎯 **리소스 풀링**: 객체 재사용으로 메모리 절약

### **CPU 최적화**
- 🔄 **Worker Threads**: 무거운 분석 작업 분리
- ⏱️ **디바운싱**: 과도한 이벤트 처리 방지
- 📦 **배치 처리**: 키 이벤트 배치 단위 처리
- 🎛️ **우선순위 큐**: 중요한 작업 우선 처리

### **디스크 I/O**
- 📝 **Write-Ahead Logging**: SQLite WAL 모드 활용
- 🗜️ **압축**: 오래된 데이터 자동 압축
- 🔄 **백그라운드 동기화**: 사용자 작업에 영향 없는 동기화
- 📈 **인덱싱**: 쿼리 성능 최적화

---

## 📈 **확장성 설계**

### **모듈러 아키텍처**
```typescript
// 플러그인 시스템
interface AnalysisPlugin {
  name: string;
  version: string;
  analyze(session: Session): AnalysisResult;
}

// 확장 가능한 분석기
class AnalysisEngine {
  private plugins: AnalysisPlugin[] = [];
  
  registerPlugin(plugin: AnalysisPlugin): void {
    this.plugins.push(plugin);
  }
  
  analyzeSession(session: Session): CombinedAnalysis {
    return this.plugins.reduce((result, plugin) => {
      result[plugin.name] = plugin.analyze(session);
      return result;
    }, {} as CombinedAnalysis);
  }
}
```

### **API 우선 설계**
- 🔌 **RESTful API**: 외부 툴 연동 지원
- 📡 **WebSocket**: 실시간 데이터 스트리밍
- 🔗 **Webhook**: 이벤트 기반 통합
- 📚 **SDK**: 타사 앱 통합 라이브러리

### **다국어 지원**
- 🌍 **i18n**: React i18next 기반 다국어
- 🔤 **폰트**: 다양한 언어 폰트 지원
- ⌨️ **키보드 레이아웃**: 언어별 키보드 매핑
- 📊 **지역별 분석**: 언어별 타이핑 패턴 차이

---

## 🚀 **배포 & 업데이트**

### **빌드 파이프라인**
```yaml
# .github/workflows/build.yml
name: Build and Release

on:
  push:
    tags: ['v*']

jobs:
  build:
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
        
    steps:
      - name: Build Electron App
        run: |
          pnpm install
          pnpm build
          pnpm dist
          
      - name: Upload Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: loop-${{ matrix.os }}
          path: dist/
```

### **자동 업데이트**
- 🔄 **Electron Updater**: 자동 업데이트 시스템
- 🔐 **코드 사이닝**: 앱 무결성 검증
- 📦 **점진적 배포**: 단계별 업데이트 롤아웃
- 🔙 **롤백**: 문제 발생시 자동 롤백

### **배포 채널**
- 🚀 **Stable**: 안정 버전 (일반 사용자)
- 🧪 **Beta**: 베타 버전 (얼리 어답터)
- 🛠️ **Dev**: 개발 버전 (내부 테스트)

---

## 🎯 **개발 로드맵**

### **Phase 1: MVP (0-3개월)**
- ✅ 기본 키보드 모니터링
- ✅ SQLite 데이터 저장
- ✅ 기본 통계 (WPM, 정확도)
- ✅ 시스템 트레이 UI

### **Phase 2: 분석 강화 (3-6개월)**
- 📊 고급 분석 알고리즘
- 📈 시각화 차트
- 🎯 개인화된 목표 설정
- 🔔 알림 시스템

### **Phase 3: 클라우드 & AI (6-12개월)**
- ☁️ 클라우드 동기화
- 🤖 AI 기반 인사이트
- 📱 모바일 컴패니언 앱
- 🔗 써드파티 통합 (Notion, Obsidian)

### **Phase 4: 엔터프라이즈 (12-18개월)**
- 👥 팀 협업 기능
- 📊 관리자 대시보드
- 🔐 SSO 통합
- 📈 팀 생산성 분석

음. 이제 기술 아키텍처도 완료했다. 다음은 **실행 계획**이다.
