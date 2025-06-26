// TODO: Loop strict 규칙에 맞게 상수/더미데이터/네이밍/공유 구조 리팩터링 필요
import { PenTool, Calendar, Zap, FolderOpen, BarChart3, Lightbulb, Users, Home, Bot, Settings } from "lucide-react"

export const NAVIGATION_ITEMS = [
  { id: "dashboard", icon: Home, label: "대시보드" },
  { id: "projects", icon: FolderOpen, label: "프로젝트" },
  { id: "stats", icon: BarChart3, label: "통계" },
  { id: "ai", icon: Bot, label: "Loop AI" },
]

export const SETTINGS_NAV = { id: "settings", icon: Settings, label: "설정" }

export const MOCK_PROJECTS = [
  {
    title: "시간의 강",
    description: "SF 소설 - 시간 여행을 다룬 장편 소설",
    progress: 67,
    status: "진행중",
    lastModified: "2분 전",
    wordCount: "45,230",
    chapters: 12,
    genre: "SF",
    starred: true,
  },
  {
    title: "일상의 철학",
    description: "에세이 - 일상에서 찾는 철학적 사유",
    progress: 30,
    status: "초안",
    lastModified: "1시간 전",
    wordCount: "12,450",
    chapters: 8,
    genre: "에세이",
    starred: false,
  },
  {
    title: "도시 이야기",
    description: "단편집 - 도시를 배경으로 한 단편들",
    progress: 85,
    status: "검토중",
    lastModified: "3시간 전",
    wordCount: "28,900",
    chapters: 15,
    genre: "단편",
    starred: true,
  },
  {
    title: "미래의 기억",
    description: "SF 단편 - 기억을 조작하는 기술에 대한 이야기",
    progress: 15,
    status: "계획중",
    lastModified: "1일 전",
    wordCount: "3,200",
    chapters: 3,
    genre: "SF",
    starred: false,
  },
  {
    title: "요리하는 철학자",
    description: "요리 에세이 - 요리를 통해 본 삶의 철학",
    progress: 92,
    status: "완료",
    lastModified: "2일 전",
    wordCount: "52,100",
    chapters: 20,
    genre: "에세이",
    starred: true,
  },
]

export const MOCK_FILES = [
  { name: "chapter-12.md", project: "시간의 강", time: "2분 전", status: "수정됨" },
  { name: "intro.md", project: "일상의 철학", time: "1시간 전", status: "저장됨" },
  { name: "outline.md", project: "도시 이야기", time: "3시간 전", status: "동기화됨" },
]

export const STATS_DATA = [
  { label: "오늘 작성", value: "1,234", unit: "단어", icon: PenTool, color: "blue", change: "+12%" },
  { label: "이번 주", value: "8,567", unit: "단어", icon: Calendar, color: "green", change: "+8%" },
  { label: "평균 속도", value: "68", unit: "WPM", icon: Zap, color: "purple", change: "+5%" },
  { label: "총 프로젝트", value: "12", unit: "개", icon: FolderOpen, color: "orange", change: "+2" },
]

export const WEEKLY_CHART_DATA = [
  { label: "월", value: 1200 },
  { label: "화", value: 1800 },
  { label: "수", value: 1400 },
  { label: "목", value: 2200 },
  { label: "금", value: 1900 },
  { label: "토", value: 2800 },
  { label: "일", value: 2100 },
]

export const PROJECT_PROGRESS_DATA = [
  { label: "시간의 강", value: 67, color: "bg-blue-600" },
  { label: "일상의 철학", value: 30, color: "bg-slate-600" },
  { label: "도시 이야기", value: 85, color: "bg-green-600" },
  { label: "미래의 기억", value: 15, color: "bg-purple-600" },
]

export const AI_FEATURES = [
  {
    title: "아이디어 생성",
    description: "새로운 스토리 아이디어나 주제를 제안받으세요",
    icon: Lightbulb,
    color: "purple",
    count: "24회 사용",
  },
  {
    title: "문체 개선",
    description: "더 매력적이고 읽기 쉬운 문장으로 다듬어보세요",
    icon: PenTool,
    color: "blue",
    count: "18회 사용",
  },
  {
    title: "구조 분석",
    description: "글의 구조와 흐름을 분석하고 개선점을 찾아보세요",
    icon: BarChart3,
    color: "green",
    count: "12회 사용",
  },
  {
    title: "캐릭터 개발",
    description: "생동감 있는 캐릭터 설정과 대화를 만들어보세요",
    icon: Users,
    color: "orange",
    count: "8회 사용",
  },
]

export const QUICK_QUESTIONS = [
  "오늘 쓸 내용 아이디어 줘",
  "이 문단을 더 생동감 있게 써줘",
  "캐릭터 설정 도움 필요해",
  "글의 구조를 분석해줘",
  "대화 장면을 개선해줘",
  "배경 묘사를 풍부하게 해줘",
] 