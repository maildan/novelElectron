# 🔥 Loop Electron 아키텍처 설계서 - 기가차드 Edition

## 🏗️ **시스템 아키텍처**

```
┌─────────────────────────────────────────────────────────────┐
│                    Loop Desktop App                         │
├─────────────────────────────────────────────────────────────┤
│  Renderer Process (Next.js 15 + React 19)                  │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Dashboard     │ │   Analytics     │ │   Settings      ││
│  │   (Real-time)   │ │   (Charts)      │ │   (Config)      ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  Preload Script (contextBridge + IPC)                      │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  electronAPI: {                                        ││
│  │    onKeyboard, onMouse, onWindow,                      ││
│  │    getStats, saveData, getSettings                     ││
│  │  }                                                     ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  Main Process (Node.js + Native Modules)                   │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │  uiohook-napi   │ │   active-win    │ │  Prisma + DB    ││
│  │  (Global Keys)  │ │  (App Context)  │ │  (SQLite)       ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 **핵심 구성요소**

### **1. Main Process (Electron 메인)**
```typescript
// src/main/index.ts
- BrowserWindow 생성 (contextIsolation: true)
- uiohook-napi 전역 키보드 리스너
- active-win 활성 앱 감지
- Prisma + SQLite 데이터 관리
- IPC 채널 관리
```

### **2. Preload Script (보안 브릿지)**
```typescript
// src/preload/index.ts
- contextBridge.exposeInMainWorld()
- Type-safe IPC 인터페이스
- 보안 샌드박스 유지
```

### **3. Renderer Process (Next.js UI)**
```typescript
// src/renderer/app/
- App Router 구조
- Real-time 데이터 시각화
- Tailwind CSS 스타일링
- TypeScript 전체 적용
```

---

## 🗂️ **프로젝트 구조**

```
loop/
├── package.json                 # 의존성 관리
├── tsconfig.json               # TypeScript 설정
├── next.config.js              # Next.js 설정
├── tailwind.config.js          # Tailwind 설정
├── prisma/
│   └── schema.prisma           # 데이터베이스 스키마
├── src/
│   ├── main/                   # Electron 메인 프로세스
│   │   ├── index.ts           # 앱 엔트리포인트
│   │   ├── window.ts          # 윈도우 관리
│   │   ├── keyboard.ts        # 키보드 리스너
│   │   ├── database.ts        # DB 관리
│   │   └── ipc/               # IPC 핸들러
│   ├── preload/               # Preload 스크립트
│   │   ├── index.ts           # 메인 preload
│   │   └── types.ts           # 타입 정의
│   ├── renderer/              # Next.js UI
│   │   ├── app/               # App Router
│   │   │   ├── layout.tsx     # 루트 레이아웃
│   │   │   ├── page.tsx       # 홈페이지
│   │   │   ├── dashboard/     # 대시보드
│   │   │   ├── analytics/     # 분석 페이지
│   │   │   └── settings/      # 설정 페이지
│   │   ├── components/        # 공통 컴포넌트
│   │   └── lib/              # 유틸리티
│   └── shared/               # 공통 타입/유틸
├── docs/                     # 문서
└── dist/                     # 빌드 출력
```

---

## 🔐 **보안 설계**

### **Context Isolation**
```typescript
// Main Process
webPreferences: {
  contextIsolation: true,        // ✅ 필수
  nodeIntegration: false,        // ✅ 필수
  preload: path.join(__dirname, 'preload.js')
}
```

### **Safe IPC Communication**
```typescript
// Preload
contextBridge.exposeInMainWorld('electronAPI', {
  // ✅ 허용된 함수만 노출
  onKeyboard: (callback) => ipcRenderer.on('keyboard', callback),
  getStats: () => ipcRenderer.invoke('get-stats'),
  // ❌ 직접 ipcRenderer 노출 금지
})
```

---

## 📊 **데이터 흐름**

### **키보드 이벤트 처리**
```
1. uiohook-napi → Main Process
2. Main Process → Prisma → SQLite
3. Main Process → IPC → Renderer
4. Renderer → React State → UI Update
```

### **사용자 액션 처리**
```
1. UI Interaction → Renderer
2. Renderer → electronAPI → Preload
3. Preload → IPC → Main Process
4. Main Process → Database/Logic
```

---

## 🚀 **개발 스케줄 (6일)**

### **Day 1: 프로젝트 셋업**
- [x] 프로젝트 구조 생성
- [x] 의존성 설치
- [ ] TypeScript 설정
- [ ] Electron 기본 윈도우

### **Day 2: 코어 시스템**
- [ ] uiohook-napi 통합
- [ ] Prisma 스키마 설계
- [ ] IPC 채널 구현

### **Day 3: Preload & Security**
- [ ] contextBridge 구현
- [ ] Type-safe IPC
- [ ] 보안 테스트

### **Day 4: UI 개발**
- [ ] Next.js 라우터 설정
- [ ] 대시보드 컴포넌트
- [ ] Real-time 데이터 연동

### **Day 5: 기능 완성**
- [ ] 분석 알고리즘
- [ ] 설정 관리
- [ ] 에러 핸들링

### **Day 6: 최적화 & 배포**
- [ ] 성능 최적화
- [ ] 빌드 설정
- [ ] 테스트 & 배포

---

## 🎯 **핵심 기술 스택**

### **Frontend**
- **Next.js 15**: App Router + Server Components
- **React 19**: 최신 훅 + 성능 최적화
- **Tailwind CSS**: 유틸리티 퍼스트 스타일링
- **TypeScript**: 전체 타입 안정성

### **Backend**
- **Electron 36**: 메인 프로세스 + 보안
- **uiohook-napi**: 전역 키보드 모니터링
- **active-win**: 활성 윈도우 감지
- **Prisma**: ORM + 타입 안전 쿼리

### **Database**
- **SQLite**: 로컬 고성능 DB
- **Prisma Schema**: 타입 안전 모델링

---

**결론**: **보안 우선** 아키텍처로 **전역 모니터링 + 실시간 UI**를 6일 내 구현 가능.
