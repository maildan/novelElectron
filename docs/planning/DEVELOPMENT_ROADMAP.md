# 🚀 Loop 개발 실행 계획 - 3개월 MVP 로드맵

## 📋 **프로젝트 목표**

**3개월 내 Loop MVP 완성**하여 한국 웹소설 작가들을 대상으로 베타 테스트 시작

### **MVP 핵심 기능**
- ✅ 전역 키보드 모니터링 (모든 앱)
- ✅ 실시간 타이핑 통계 (WPM, 정확도)
- ✅ 기본 분석 대시보드
- ✅ SQLite 로컬 데이터 저장
- ✅ 시스템 트레이 UI
- ✅ Windows, macOS 지원

---

## 📅 **3개월 스프린트 계획**

### **Sprint 1: 기반 구축 (Week 1-2)**

#### **Week 1: 프로젝트 셋업**
- [ ] **Day 1-2**: Electron + Next.js 프로젝트 초기화
  - pnpm workspace 설정
  - TypeScript 설정
  - ESLint, Prettier 구성
  - 기본 폴더 구조 생성

- [ ] **Day 3-4**: 네이티브 모듈 통합
  - uiohook-napi 설치 및 테스트
  - active-win 설치 및 테스트
  - 권한 처리 로직 구현

- [ ] **Day 5-7**: 기본 IPC 통신
  - Main ↔ Renderer IPC 채널 설정
  - Type-safe API 인터페이스 구축
  - Preload 스크립트 구현

#### **Week 2: 핵심 로직 구현**
- [ ] **Day 8-10**: 키보드 리스너 구현
  - 글로벌 키 이벤트 캡처
  - 키 코드 매핑 및 필터링
  - 앱별 컨텍스트 감지

- [ ] **Day 11-12**: 데이터 모델링
  - Prisma 스키마 설계
  - SQLite 데이터베이스 초기화
  - 기본 CRUD 작업

- [ ] **Day 13-14**: 기본 분석 알고리즘
  - WPM 계산 로직
  - 타이핑 정확도 측정
  - 세션 관리

---

### **Sprint 2: UI 개발 (Week 3-4)**

#### **Week 3: 대시보드 UI**
- [ ] **Day 15-17**: 메인 대시보드
  - Next.js App Router 설정
  - Tailwind CSS + shadcn/ui 통합
  - 실시간 통계 표시 컴포넌트

- [ ] **Day 18-19**: 차트 및 시각화
  - Recharts 통합
  - WPM 트렌드 차트
  - 앱별 사용 시간 파이 차트

- [ ] **Day 20-21**: 반응형 레이아웃
  - 모바일 대응
  - 다크/라이트 테마
  - 접근성 개선

#### **Week 4: 설정 및 상태 관리**
- [ ] **Day 22-24**: 설정 페이지
  - 모니터링 on/off 토글
  - 목표 WPM 설정
  - 알림 설정

- [ ] **Day 25-26**: 상태 관리
  - Zustand 스토어 구성
  - React Query 데이터 페칭
  - 실시간 업데이트

- [ ] **Day 27-28**: 시스템 트레이
  - 트레이 아이콘 및 메뉴
  - 백그라운드 실행
  - 퀵 스탯 팝업

---

### **Sprint 3: 고급 기능 (Week 5-6)**

#### **Week 5: 분석 강화**
- [ ] **Day 29-31**: 세션 분석
  - 타이핑 세션 자동 감지
  - 앱별 생산성 분석
  - 시간대별 성과 분석

- [ ] **Day 32-33**: 패턴 인식
  - 타이핑 리듬 분석
  - 오타 패턴 감지
  - 개선 제안 로직

- [ ] **Day 34-35**: 리포트 기능
  - 일/주/월 리포트 생성
  - PDF 내보내기
  - 통계 요약

#### **Week 6: 안정성 및 최적화**
- [ ] **Day 36-38**: 성능 최적화
  - 메모리 사용량 최적화
  - 백그라운드 프로세스 최적화
  - 데이터베이스 인덱싱

- [ ] **Day 39-40**: 에러 핸들링
  - 글로벌 에러 핸들러
  - 크래시 리포팅
  - 복구 메커니즘

- [ ] **Day 41-42**: 보안 강화
  - 데이터 암호화
  - 권한 재확인
  - 프라이버시 모드

---

### **Sprint 4: 테스팅 & 배포 (Week 7-8)**

#### **Week 7: 테스팅**
- [ ] **Day 43-45**: 단위 테스트
  - Jest 테스트 환경 구성
  - 핵심 로직 테스트 작성
  - 커버리지 80% 이상

- [ ] **Day 46-47**: 통합 테스트
  - Playwright E2E 테스트
  - IPC 통신 테스트
  - 네이티브 모듈 테스트

- [ ] **Day 48-49**: 수동 테스트
  - macOS/Windows 크로스 플랫폼 테스트
  - 권한 시나리오 테스트
  - 사용자 시나리오 테스트

#### **Week 8: 빌드 & 배포**
- [ ] **Day 50-52**: 빌드 시스템
  - Electron Builder 설정
  - 코드 사이닝 설정
  - 자동 업데이트 구성

- [ ] **Day 53-54**: 배포 준비
  - 설치 프로그램 생성
  - 문서 작성
  - 베타 테스터 모집

- [ ] **Day 55-56**: MVP 출시
  - GitHub Releases 배포
  - 베타 테스트 시작
  - 초기 피드백 수집

---

### **Sprint 5: 피드백 & 개선 (Week 9-12)**

#### **Week 9-10: 베타 테스트**
- [ ] 50명 베타 테스터 모집 (웹소설 작가 중심)
- [ ] 피드백 수집 시스템 구축
- [ ] 주요 버그 수정
- [ ] 사용성 개선

#### **Week 11-12: 안정화**
- [ ] 성능 이슈 해결
- [ ] UI/UX 개선
- [ ] 추가 기능 우선순위 결정
- [ ] v1.0 출시 준비

---

## 🛠️ **기술적 구현 계획**

### **개발 환경 세팅**
```bash
# 프로젝트 초기화
cd /Users/user/loop
pnpm init
pnpm add -D electron electron-builder
pnpm add -D next react react-dom typescript
pnpm add -D @types/node @types/react @types/react-dom
pnpm add -D tailwindcss postcss autoprefixer
pnpm add -D eslint prettier

# 네이티브 모듈
pnpm add uiohook-napi@1.5.4
pnpm add active-win@8.1.0
pnpm add node-machine-id@1.1.12

# 데이터베이스
pnpm add prisma @prisma/client
pnpm add sqlite3

# UI 라이브러리
pnpm add @radix-ui/react-slot class-variance-authority
pnpm add lucide-react recharts
pnpm add zustand @tanstack/react-query

# 빌드 도구
pnpm add -D webpack ts-loader
pnpm add -D jest @types/jest
pnpm add -D playwright
```

### **핵심 컴포넌트 구현 순서**

#### **1. Main Process (주 1-2)**
```typescript
// src/main/index.ts - 앱 엔트리 포인트
// src/main/window.ts - BrowserWindow 관리
// src/main/keyboard/listener.ts - 글로벌 키보드 리스너
// src/main/database/client.ts - Prisma 클라이언트
```

#### **2. Preload Scripts (주 2)**
```typescript
// src/preload/index.ts - 안전한 API 노출
// src/preload/api.ts - 타입 안전 API 정의
```

#### **3. Frontend Core (주 3-4)**
```typescript
// src/renderer/app/layout.tsx - 루트 레이아웃
// src/renderer/app/dashboard/page.tsx - 메인 대시보드
// src/renderer/components/ui/ - 기본 UI 컴포넌트
// src/renderer/stores/ - Zustand 상태 관리
```

#### **4. 분석 엔진 (주 5)**
```typescript
// src/main/analytics/engine.ts - 분석 알고리즘
// src/main/analytics/wpm.ts - WPM 계산
// src/main/analytics/accuracy.ts - 정확도 측정
```

### **데이터베이스 마이그레이션 계획**
```prisma
// Week 2: 기본 스키마
model Session {
  id        String   @id @default(cuid())
  startTime DateTime
  endTime   DateTime?
  appName   String
  totalKeys Int      @default(0)
}

// Week 3: 키 이벤트 추가
model KeyEvent {
  id        String   @id @default(cuid())
  sessionId String
  timestamp DateTime
  keyCode   Int
}

// Week 5: 분석 데이터 추가
model SessionAnalytics {
  id       String @id @default(cuid())
  avgWPM   Float
  accuracy Float
  flowScore Float
}
```

---

## 📊 **진행도 추적**

### **Daily Standup 포맷**
```
## 날짜: YYYY-MM-DD

### ✅ 어제 완료한 작업
- 작업 1
- 작업 2

### 🔄 오늘 계획한 작업  
- 작업 1
- 작업 2

### ⚠️ 블로커 및 이슈
- 이슈 1
- 이슈 2

### 📈 전체 진행도: X%
```

### **Weekly Review 포맷**
```
## Week X Review (YYYY-MM-DD)

### 🎯 목표 대비 달성도
- [ ] 목표 1 (완료/진행중/미시작)
- [ ] 목표 2
- [ ] 목표 3

### 📊 주요 지표
- 커밋 수: X개
- 코드 커버리지: X%
- 버그 수: X개

### 🔄 다음 주 계획
- 우선순위 1
- 우선순위 2
- 우선순위 3
```

---

## 🎯 **성공 지표 (KPIs)**

### **개발 지표**
- **코드 커버리지**: 80% 이상
- **빌드 성공률**: 95% 이상
- **크래시율**: 1% 미만
- **메모리 사용량**: 200MB 미만

### **사용자 지표**
- **베타 사용자**: 50명 모집
- **일일 활성 사용자**: 30명 이상
- **세션 지속 시간**: 평균 2시간 이상
- **사용자 만족도**: 4.0/5.0 이상

### **비즈니스 지표**
- **베타 신청률**: 지원자 대비 80% 참여
- **리텐션**: 1주일 후 60% 유지
- **추천률**: NPS 50 이상
- **피드백 수집**: 주당 평균 10개 이상

---

## ⚠️ **리스크 관리**

### **기술적 리스크**

#### **High Risk**
- **네이티브 모듈 호환성**: uiohook-napi macOS 권한 이슈
  - **완화 방안**: 대체 라이브러리 (robotjs) 준비
  - **대응 시간**: 2주

- **메모리 누수**: 장시간 실행시 메모리 증가
  - **완화 방안**: 주기적 가비지 컬렉션, 메모리 모니터링
  - **대응 시간**: 1주

#### **Medium Risk**
- **크로스 플랫폼 이슈**: Windows/macOS 동작 차이
  - **완화 방안**: 플랫폼별 CI/CD 테스트
  - **대응 시간**: 3일

- **권한 처리**: 사용자가 권한 거부시 기능 제한
  - **완화 방안**: 폴백 모드 (앱 내 타이핑만) 구현
  - **대응 시간**: 1주

### **비즈니스 리스크**

#### **Medium Risk**
- **베타 사용자 모집 실패**: 목표 50명 미달
  - **완화 방안**: 웹소설 커뮤니티 적극 활용, 인센티브 제공
  - **대응 시간**: 2주

- **경쟁사 등장**: 유사 제품 출시
  - **완화 방안**: 차별화 기능 강화, 빠른 MVP 출시
  - **대응 시간**: 즉시

---

## 🎉 **성공 시나리오**

### **3개월 후 목표 상태**
- ✅ **안정적인 MVP**: 크래시율 1% 미만
- ✅ **활발한 사용자**: 50명 베타 사용자, 일일 활성 30명
- ✅ **긍정적 피드백**: 평균 평점 4.0/5.0 이상
- ✅ **기술적 검증**: 모든 핵심 기능 정상 작동
- ✅ **시장 검증**: 유료 전환 의사 20% 이상

### **6개월 후 확장 계획**
- 🚀 **Pro 버전 출시**: 유료 구독 모델 시작
- 🌏 **영문 시장 진출**: 영어권 작가 타겟
- 🤖 **AI 기능 추가**: GPT 연동 창작 분석
- 📱 **모바일 앱**: 동기화 기능 포함

### **1년 후 비전**
- 💰 **수익 달성**: 월 $10K ARR
- 👥 **팀 확장**: 개발자 2명, 마케터 1명 추가
- 🏢 **기업 고객**: B2B 버전 출시
- 🌐 **글로벌 서비스**: 5개국 언어 지원

음. 이제 **완벽한 실행 계획**도 완료했다. 기가차드의 문서화 작업이 ㅈㄴ 체계적으로 끝났다!
