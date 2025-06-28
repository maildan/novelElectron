# 🔥 Loop UI 설계 가이드 - Figma급 Deep Dive

## 📊 이미지 분석 & UI 컴포넌트 해체

### **이미지 1: 대시보드 분석**

### **레이아웃 구조**

```
├── Sidebar (240px 고정)
│   ├── Logo Section (60px)
│   ├── Navigation Items (48px each)
│   └── Bottom Section (Settings)
├── Main Content (flex-1)
│   ├── Header (64px)
│   ├── Quick Start Section (200px)
│   └── Widgets Grid (2fr 1fr)
└── Right Panel (320px)
    ├── Integration Cards
    ├── Recent Files
    └── Active Projects

```

### **컴포넌트 분해**

- **Sidebar**: 아이콘(20px) + 텍스트, hover 시 bg-gray-50 전환
- **Quick Start Card**: 중앙 정렬, 240px 너비, drop-shadow-sm
- **Widget Cards**: 16px radius, border-gray-200, padding 24px
- **Progress Bar**: height 8px, bg-blue-500, rounded-full

### **이미지 2: 프로젝트 그리드 분석**

### **그리드 시스템**

```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
gap: 24px;

```

### **프로젝트 카드 해체**

- **Card Container**: 320×280px, border-radius 12px
- **Header**: 타이틀(font-semibold) + 액션 버튼(더보기)
- **Content**: 설명 텍스트 + 메타데이터
- **Progress Section**: 진행률 바 + 퍼센트 표시
- **Footer**: 액션 버튼들 (보기, 편집, 공유, 삭제)

### **이미지 3: 통계 대시보드 분석**

### **KPI 카드 레이아웃**

```
Grid: 4 columns, gap-6
Card: 240×120px
├── Icon Section (40×40px)
├── Value (text-3xl, font-bold)
├── Label (text-sm, text-gray-600)
└── Change Indicator (+12%, green)

```

### **차트 섹션**

- **좌측 차트**: 2fr, min-height 300px
- **우측 프로젝트 바**: 1fr, 진행률 막대들
- **하단 3열**: 각각 1fr, 카드 형태

### **이미지 4: Loop AI 분석**

### **기능 카드 그리드**

```
Grid: 4 columns, gap-4
Card: 280×140px
├── Icon (purple/blue theme)
├── Title (font-semibold)
├── Description (text-sm)
└── Usage Count (bottom right)

```

### **AI 채팅 인터페이스**

- **Message Container**: max-width 800px, center aligned
- **User Message**: 우측 정렬, bg-blue-100
- **AI Message**: 좌측 정렬, bg-gray-100
- **Input Area**: sticky bottom, shadow-lg

### **이미지 5: 설정 화면 분석**

### **설정 섹션 구조**

```
├── Section Header (font-semibold, margin-bottom 16px)
├── Setting Items (space-y-4)
│   ├── Label + Description
│   └── Control (Toggle/Slider/Select)
└── Divider (border-gray-200, margin 32px)

```

---

## 🎨 디자인 시스템 & 토큰

### **컬러 팔레트**

```tsx
const colors = {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb'
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    900: '#111827'
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444'
}

```

### **타이포그래피 스케일**

```css
.text-xs { font-size: 12px; line-height: 16px; }
.text-sm { font-size: 14px; line-height: 20px; }
.text-base { font-size: 16px; line-height: 24px; }
.text-lg { font-size: 18px; line-height: 28px; }
.text-3xl { font-size: 30px; line-height: 36px; }

```

### **스페이싱 시스템**

```css
.space-1 { 4px }   /* 아이콘 여백 */
.space-2 { 8px }   /* 텍스트 간격 */
.space-4 { 16px }  /* 컴포넌트 내부 */
.space-6 { 24px }  /* 카드 패딩 */
.space-8 { 32px }  /* 섹션 간격 */

```

---

## 🏗️ Next.js App Router 구조

### **디렉터리 구조**

```
src/renderer/
├── app/
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx               # 대시보드 (/)
│   ├── projects/
│   │   └── page.tsx           # 프로젝트 (/projects)
│   ├── analytics/
│   │   └── page.tsx           # 통계 (/analytics)
│   ├── ai/
│   │   └── page.tsx           # Loop AI (/ai)
│   └── settings/
│       └── page.tsx           # 설정 (/settings)
├── components/
│   ├── layout/
│   │   ├── AppSidebar.tsx     # 사이드바
│   │   ├── AppHeader.tsx      # 헤더
│   │   └── AppContainer.tsx   # 메인 컨테이너
│   ├── ui/                    # 기본 UI 컴포넌트
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── KpiCard.tsx
│   │   └── Toggle.tsx
│   ├── dashboard/
│   │   ├── QuickStartCard.tsx
│   │   ├── IntegrationWidget.tsx
│   │   ├── RecentFilesWidget.tsx
│   │   └── ActiveProjectsWidget.tsx
│   ├── projects/
│   │   ├── ProjectGrid.tsx
│   │   ├── ProjectCard.tsx
│   │   └── CreateProjectButton.tsx
│   ├── analytics/
│   │   ├── KpiSection.tsx
│   │   ├── WeeklyChart.tsx
│   │   ├── ProjectProgressChart.tsx
│   │   ├── ActivityPattern.tsx
│   │   ├── GoalTracker.tsx
│   │   └── GenreDistribution.tsx
│   ├── ai/
│   │   ├── FeatureGrid.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   └── QuickActions.tsx
│   └── settings/
│       ├── SettingSection.tsx
│       ├── SettingItem.tsx
│       ├── ToggleControl.tsx
│       ├── SliderControl.tsx
│       └── SelectControl.tsx

```

---

## 🧩 핵심 컴포넌트 설계

### **1. AppSidebar.tsx**

```tsx
interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: '대시보드', icon: Home, href: '/' },
  { id: 'projects', label: '프로젝트', icon: FolderOpen, href: '/projects' },
  { id: 'analytics', label: '통계', icon: BarChart3, href: '/analytics' },
  { id: 'ai', label: 'Loop AI', icon: Sparkles, href: '/ai' }
];

```

**스타일링 가이드**:

- 너비: 240px 고정
- 아이템 높이: 48px
- 호버: bg-gray-50, 텍스트 전환 150ms
- 액티브: bg-blue-50, border-right-2 border-blue-500

### **2. Card.tsx (재사용 컴포넌트)**

```tsx
interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

const cardVariants = {
  default: 'bg-white border border-gray-200',
  elevated: 'bg-white shadow-lg border-0',
  outlined: 'bg-transparent border-2 border-gray-300'
};

```

### **3. KpiCard.tsx**

```tsx
interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

```

**레이아웃**:

- 크기: 240×120px
- 아이콘: 40×40px, 좌상단
- 값: text-3xl, font-bold, 중앙
- 변화율: 우하단, 조건부 컬러

### **4. ProjectCard.tsx**

```tsx
interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  progress: number;
  wordCount: number;
  lastModified: Date;
  genre: string;
  onView: () => void;
  onEdit: () => void;
  onShare: () => void;
  onDelete: () => void;
}

```

**인터랙션**:

- 호버: scale-105, shadow-lg 전환
- 진행률 바: 애니메이션 (0→progress%)
- 액션 버튼: opacity-0 → opacity-100 on hover

### **5. ProgressBar.tsx**

```tsx
interface ProgressBarProps {
  value: number; // 0-100
  color?: 'blue' | 'green' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

```

**애니메이션**:

```css
.progress-bar {
  transition: width 0.5s ease-in-out;
}

.progress-bar.animated {
  background: linear-gradient(90deg,
    rgba(59,130,246,0.5) 0%,
    rgba(59,130,246,1) 50%,
    rgba(59,130,246,0.5) 100%);
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
}

```

---

## 📱 반응형 브레이크포인트

### **화면 크기 대응**

```css
/* 기본: 1440px+ (데스크톱) */
.grid-cols-4 { /* 4열 그리드 */ }

/* 1024px-1439px (작은 데스크톱) */
@media (max-width: 1439px) {
  .grid-cols-4 { grid-template-columns: repeat(3, 1fr); }
  .sidebar { width: 200px; }
}

/* 768px-1023px (태블릿) */
@media (max-width: 1023px) {
  .grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
  .sidebar { width: 60px; } /* 아이콘만 */
  .sidebar .text { display: none; }
}

/* ~767px (모바일) */
@media (max-width: 767px) {
  .grid-cols-4 { grid-template-columns: 1fr; }
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
    transition: transform 0.3s;
  }
  .sidebar.open { transform: translateX(0); }
}

```

---

## 🎭 상태 관리 패턴

### **Zustand Store 구조**

```tsx
interface AppStore {
  // UI 상태
  sidebarOpen: boolean;
  currentRoute: string;

  // 데이터 상태
  projects: Project[];
  analytics: AnalyticsData;
  aiUsage: AIUsageStats;

  // 액션
  toggleSidebar: () => void;
  setCurrentRoute: (route: string) => void;
  fetchProjects: () => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => void;
}

```

### **커스텀 훅 패턴**

```tsx
// useProjects.ts
export const useProjects = () => {
  const { projects, fetchProjects, updateProject } = useAppStore();

  return {
    projects,
    loading: projects.length === 0,
    refetch: fetchProjects,
    update: updateProject
  };
};

// useAnalytics.ts
export const useAnalytics = () => {
  const analytics = useAppStore(state => state.analytics);

  const kpis = useMemo(() => [
    { title: '오늘 작성', value: analytics.todayWords, icon: PenTool },
    { title: '이번 주', value: analytics.weekWords, icon: Calendar },
    { title: '평균 속도', value: `${analytics.avgWpm}WPM`, icon: Zap },
    { title: '총 프로젝트', value: analytics.totalProjects, icon: FolderOpen }
  ], [analytics]);

  return { analytics, kpis };
};

```

---

## ⚡ 성능 최적화 전략

### **컴포넌트 최적화**

```tsx
// React.memo for expensive components
export const ProjectCard = React.memo<ProjectCardProps>(({
  project,
  onUpdate
}) => {
  // 메모이제이션된 값들
  const formattedDate = useMemo(() =>
    format(project.lastModified, 'MM/dd/yyyy'),
    [project.lastModified]
  );

  // 안정적인 콜백
  const handleEdit = useCallback(() =>
    onUpdate(project.id),
    [project.id, onUpdate]
  );

  return (/* JSX */);
});

// 무거운 리스트 가상화
import { FixedSizeList as List } from 'react-window';

export const ProjectGrid = ({ projects }: { projects: Project[] }) => {
  if (projects.length > 50) {
    return (
      <List
        height={600}
        itemCount={projects.length}
        itemSize={300}
        itemData={projects}
      >
        {ProjectCardRow}
      </List>
    );
  }

  return <RegularGrid projects={projects} />;
};

```

### **이미지 최적화**

```tsx
// Next.js Image 컴포넌트 활용
import Image from 'next/image';

export const ProjectThumbnail = ({ src, alt }: ImageProps) => (
  <Image
    src={src}
    alt={alt}
    width={280}
    height={160}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,..."
    className="rounded-lg object-cover"
  />
);

```

---

## 🔧 개발 워크플로

### **컴포넌트 개발 순서**

1. **UI 컴포넌트 먼저** (Card, Button, ProgressBar)
2. **레이아웃 컴포넌트** (Sidebar, Header, Container)
3. **페이지별 컴포넌트** (Dashboard → Projects → Analytics → AI → Settings)
4. **데이터 연동** (Zustand + Electron IPC)
5. **최적화 & 테스트**

### **스타일링 접근법**

```tsx
// 1. Tailwind 클래스 조합
const buttonStyles = cn(
  'px-4 py-2 rounded-lg font-medium transition-colors',
  {
    'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
    'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary'
  }
);

// 2. CSS Modules (복잡한 애니메이션용)
import styles from './ProjectCard.module.css';

// 3. CSS-in-JS (동적 스타일용)
const progressBarStyle = {
  width: `${progress}%`,
  backgroundColor: getColorByProgress(progress)
};

```

---

## 🎯 결론 & 실행 계획

### **우선순위 개발 순서**

1. **Day 1-2**: 기본 UI 컴포넌트 + 레이아웃
2. **Day 3-4**: 대시보드 + 프로젝트 페이지
3. **Day 5-6**: 통계 + AI 페이지
4. **Day 7**: 설정 + 최적화

### **품질 체크리스트**

- [ ]  모든 컴포넌트 TypeScript 타입 안전성
- [ ]  접근성 (ARIA 라벨, 키보드 네비게이션)
- [ ]  반응형 디자인 (768px ~ 1920px)
- [ ]  다크모드 대응
- [ ]  성능 최적화 (React.memo, useMemo)
- [ ]  애니메이션 60fps 유지

이 가이드대로 구현하면 **Figma 디자인과 100% 동일한** 품질의 Electron 앱을 만들 수 있다. 각 컴포넌트는 완전히 모듈화되어 있어 유지보수와 확장이 용이하다.