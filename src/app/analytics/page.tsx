'use client';

import { useState, useEffect } from 'react';

// 🔥 기가차드 프리컴파일된 스타일
const ANALYTICS_STYLES = {
  container: 'flex h-screen bg-gray-50',
  sidebar: 'w-64 bg-white border-r border-gray-200 flex flex-col',
  sidebarHeader: 'p-6 border-b border-gray-200',
  sidebarNav: 'flex-1 p-4',
  sidebarItem: 'flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 text-gray-700 hover:bg-gray-100 hover:text-blue-600 cursor-pointer',
  sidebarItemActive: 'flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 bg-blue-50 text-blue-600 border-r-2 border-blue-600',
  main: 'flex-1 flex flex-col',
  header: 'bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between',
  content: 'flex-1 p-6 overflow-auto',
  kpiGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8',
  kpiCard: 'bg-white rounded-lg border border-gray-200 p-6 shadow-sm',
  kpiTitle: 'text-sm font-medium text-gray-600 mb-2',
  kpiValue: 'text-3xl font-bold text-blue-600 mb-1',
  kpiChange: 'text-sm text-green-600 flex items-center',
  chartsGrid: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
  chartCard: 'bg-white rounded-lg border border-gray-200 p-6 shadow-sm',
  chartTitle: 'text-lg font-semibold text-gray-900 mb-4',
  chartPlaceholder: 'w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500',
  progressBar: 'w-full bg-gray-200 rounded-full h-2 mb-2',
  progressFill: 'bg-blue-600 h-2 rounded-full transition-all duration-300',
} as const;

// 🔥 사이드바 아이템 정의
const sidebarItems = [
  { id: 'dashboard', label: '대시보드', icon: '📊', href: '/', active: false },
  { id: 'analytics', label: '분석', icon: '📈', href: '/analytics', active: true },
  { id: 'projects', label: '프로젝트', icon: '📁', href: '/projects', active: false },
  { id: 'ai', label: 'Loop AI', icon: '✨', href: '/ai', active: false },
  { id: 'settings', label: '설정', icon: '⚙️', href: '/settings', active: false },
] as const;

interface AnalyticsData {
  totalSessions: number;
  averageWpm: number;
  topAccuracy: number;
  totalHours: number;
  weeklyProgress: Array<{ day: string; sessions: number; wpm: number }>;
  projectProgress: Array<{ name: string; progress: number; target: number }>;
}

export default function Analytics(): React.JSX.Element {
  const [data, setData] = useState<AnalyticsData>({
    totalSessions: 156,
    averageWpm: 85,
    topAccuracy: 98,
    totalHours: 42,
    weeklyProgress: [
      { day: '월', sessions: 8, wpm: 82 },
      { day: '화', sessions: 12, wpm: 85 },
      { day: '수', sessions: 10, wpm: 88 },
      { day: '목', sessions: 15, wpm: 90 },
      { day: '금', sessions: 18, wpm: 87 },
      { day: '토', sessions: 6, wpm: 84 },
      { day: '일', sessions: 4, wpm: 86 },
    ],
    projectProgress: [
      { name: 'React 프로젝트', progress: 85, target: 100 },
      { name: 'TypeScript 학습', progress: 70, target: 100 },
      { name: '블로그 작성', progress: 45, target: 100 },
      { name: '문서 작성', progress: 90, target: 100 },
    ],
  });

  useEffect(() => {
    // API 사용 가능 확인
    if (typeof window !== 'undefined' && window.electronAPI) {
      console.log('🔥 Analytics Electron API 연결 성공!');
      // 실제 분석 데이터 로드
      loadAnalyticsData();
    } else {
      console.warn('⚠️ Electron API 없음 - 더미 데이터 사용');
    }
  }, []);

  const loadAnalyticsData = async (): Promise<void> => {
    try {
      // 실제 분석 데이터 로드 로직
      const statsResult = await window.electronAPI.database.getStats();
      if (statsResult.success && statsResult.data) {
        // 데이터 처리 로직
        console.log('📊 분석 데이터 로드 완료');
      }
    } catch (error) {
      console.error('❌ 분석 데이터 로드 실패:', error);
    }
  };

  return (
    <div className={ANALYTICS_STYLES.container}>
      {/* 🔥 사이드바 */}
      <div className={ANALYTICS_STYLES.sidebar}>
        <div className={ANALYTICS_STYLES.sidebarHeader}>
          <h1 className="text-xl font-bold text-gray-900">Loop</h1>
          <p className="text-sm text-gray-600">Typing Analytics</p>
        </div>
        
        <nav className={ANALYTICS_STYLES.sidebarNav}>
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={item.active ? ANALYTICS_STYLES.sidebarItemActive : ANALYTICS_STYLES.sidebarItem}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
      </div>

      {/* 🔥 메인 컨텐츠 */}
      <div className={ANALYTICS_STYLES.main}>
        {/* 헤더 */}
        <div className={ANALYTICS_STYLES.header}>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">분석</h2>
            <p className="text-gray-600">타이핑 성능 분석 및 통계</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>최근 7일</option>
              <option>최근 30일</option>
              <option>최근 90일</option>
            </select>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className={ANALYTICS_STYLES.content}>
          {/* KPI 카드들 */}
          <div className={ANALYTICS_STYLES.kpiGrid}>
            <div className={ANALYTICS_STYLES.kpiCard}>
              <h4 className={ANALYTICS_STYLES.kpiTitle}>총 세션</h4>
              <div className={ANALYTICS_STYLES.kpiValue}>
                {data.totalSessions}
              </div>
              <div className={ANALYTICS_STYLES.kpiChange}>
                <span>↗️ +23 이번 주</span>
              </div>
            </div>

            <div className={ANALYTICS_STYLES.kpiCard}>
              <h4 className={ANALYTICS_STYLES.kpiTitle}>평균 WPM</h4>
              <div className={ANALYTICS_STYLES.kpiValue}>
                {data.averageWpm}
              </div>
              <div className={ANALYTICS_STYLES.kpiChange}>
                <span>↗️ +12% 향상</span>
              </div>
            </div>

            <div className={ANALYTICS_STYLES.kpiCard}>
              <h4 className={ANALYTICS_STYLES.kpiTitle}>최고 정확도</h4>
              <div className={ANALYTICS_STYLES.kpiValue}>
                {data.topAccuracy}%
              </div>
              <div className={ANALYTICS_STYLES.kpiChange}>
                <span>🎯 목표 달성</span>
              </div>
            </div>

            <div className={ANALYTICS_STYLES.kpiCard}>
              <h4 className={ANALYTICS_STYLES.kpiTitle}>총 시간</h4>
              <div className={ANALYTICS_STYLES.kpiValue}>
                {data.totalHours}h
              </div>
              <div className={ANALYTICS_STYLES.kpiChange}>
                <span>📈 +5.2h 이번 주</span>
              </div>
            </div>
          </div>

          {/* 차트 그리드 */}
          <div className={ANALYTICS_STYLES.chartsGrid}>
            {/* 주간 진행률 차트 */}
            <div className={`${ANALYTICS_STYLES.chartCard} lg:col-span-2`}>
              <h3 className={ANALYTICS_STYLES.chartTitle}>주간 타이핑 패턴</h3>
              <div className={ANALYTICS_STYLES.chartPlaceholder}>
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">📊 차트 영역</p>
                  <p className="text-sm">주간 WPM 및 세션 수 변화</p>
                  <div className="mt-4 flex justify-center space-x-6">
                    {data.weeklyProgress.map((day, index) => (
                      <div key={index} className="text-center">
                        <div className="text-xs text-gray-600 mb-1">{day.day}</div>
                        <div className="w-8 h-16 bg-blue-200 rounded-lg relative">
                          <div 
                            className="w-full bg-blue-600 rounded-lg absolute bottom-0"
                            style={{ height: `${(day.sessions / 20) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{day.sessions}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 프로젝트 진행률 */}
            <div className={ANALYTICS_STYLES.chartCard}>
              <h3 className={ANALYTICS_STYLES.chartTitle}>프로젝트 진행률</h3>
              <div className="space-y-4">
                {data.projectProgress.map((project, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{project.name}</span>
                      <span className="text-sm text-gray-600">{project.progress}%</span>
                    </div>
                    <div className={ANALYTICS_STYLES.progressBar}>
                      <div 
                        className={ANALYTICS_STYLES.progressFill}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 추가 분석 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className={ANALYTICS_STYLES.chartCard}>
              <h3 className={ANALYTICS_STYLES.chartTitle}>활동 패턴</h3>
              <div className={ANALYTICS_STYLES.chartPlaceholder}>
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">🕐 시간대별 활동</p>
                  <p className="text-sm">가장 생산적인 시간대 분석</p>
                </div>
              </div>
            </div>

            <div className={ANALYTICS_STYLES.chartCard}>
              <h3 className={ANALYTICS_STYLES.chartTitle}>목표 달성률</h3>
              <div className={ANALYTICS_STYLES.chartPlaceholder}>
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">🎯 목표 트래킹</p>
                  <p className="text-sm">WPM, 정확도, 시간 목표</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
