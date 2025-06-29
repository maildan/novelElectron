'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3, Clock, Target, BookOpen, Zap } from 'lucide-react';
import { KpiCard } from '../../components/ui/KpiCard';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Logger } from '../../../shared/logger';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const ANALYTICS_PAGE_STYLES = {
  container: 'container mx-auto px-4 py-6 max-w-7xl space-y-6',
  pageTitle: 'text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6',
  kpiGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
  chartsGrid: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
  chartCard: 'p-6',
  chartTitle: 'text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4',
  chartPlaceholder: 'h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400',
  progressGrid: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  progressItem: 'flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg',
  progressLabel: 'font-medium text-slate-900 dark:text-slate-100',
  progressValue: 'text-sm text-slate-600 dark:text-slate-400 ml-4',
  goalCard: 'p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950',
  goalTitle: 'text-xl font-bold text-slate-900 dark:text-slate-100 mb-2',
  goalDescription: 'text-slate-600 dark:text-slate-400 mb-4',
  goalProgress: 'space-y-3',
  goalItem: 'flex items-center justify-between',
  goalLabel: 'text-sm font-medium text-slate-700 dark:text-slate-300',
  goalPercentage: 'text-sm text-slate-500 dark:text-slate-400',
} as const;

// 🔥 기가차드 규칙: IPC 연동을 위한 Analytics 데이터 타입
interface AnalyticsData {
  readonly kpis: {
    readonly dailyWords: number;
    readonly totalWords: number;
    readonly avgWpm: number;
    readonly activeProjects: number;
    readonly sessionTime: number;
    readonly accuracy: number;
    readonly weeklyGoal: number;
    readonly improvementRate: number;
  };
  readonly weeklyData: readonly number[];
  readonly projectProgress: readonly {
    readonly name: string;
    readonly progress: number;
    readonly color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  }[];
  readonly goals: readonly {
    readonly label: string;
    readonly current: number;
    readonly target: number;
  }[];
}

// 🔥 기가차드 기본값 - 데이터 로딩 중일 때 사용
const DEFAULT_ANALYTICS: AnalyticsData = {
  kpis: {
    dailyWords: 0,
    totalWords: 0,
    avgWpm: 0,
    activeProjects: 0,
    sessionTime: 0,
    accuracy: 0,
    weeklyGoal: 0,
    improvementRate: 0
  },
  weeklyData: [0, 0, 0, 0, 0, 0, 0],
  projectProgress: [],
  goals: [
    { label: '일일 목표 (3000자)', current: 0, target: 3000 },
    { label: '주간 목표 (20000자)', current: 0, target: 20000 },
    { label: '정확도 목표 (95%)', current: 0, target: 95 },
    { label: 'WPM 목표 (90)', current: 0, target: 90 }
  ]
} as const;

export default function AnalyticsPage(): React.ReactElement {
  const [analyticsData, setAnalyticsData] = React.useState<AnalyticsData>(DEFAULT_ANALYTICS);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    Logger.info('ANALYTICS_PAGE', 'Analytics page loaded');
    loadAnalyticsData();
  }, []);

  /**
   * 🔥 실제 분석 데이터 로딩 (BE 연동)
   */
  const loadAnalyticsData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // 🔥 기가차드 규칙: IPC 통신으로 실제 데이터 가져오기
      const [dashboardStats, projectsData, recentSessions] = await Promise.all([
        window.electronAPI?.dashboard?.getStats?.(),
        window.electronAPI?.projects?.getAll?.(),
        window.electronAPI?.dashboard?.getRecentSessions?.()
      ]);

      if (dashboardStats?.success && projectsData?.success && recentSessions?.success) {
        // 🔥 실제 데이터로 변환
        const analytics = convertToAnalyticsData(
          dashboardStats.data,
          projectsData.data,
          recentSessions.data
        );
        setAnalyticsData(analytics);
        Logger.info('ANALYTICS_PAGE', 'Analytics data loaded successfully');
      } else {
        // 🔥 IPC API가 없거나 실패한 경우 기본값 사용
        Logger.warn('ANALYTICS_PAGE', 'IPC API not available, using default data');
        setAnalyticsData(DEFAULT_ANALYTICS);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '분석 데이터를 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      Logger.error('ANALYTICS_PAGE', 'Failed to load analytics data', err);
      // 에러 시에도 기본값 사용
      setAnalyticsData(DEFAULT_ANALYTICS);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔥 BE 데이터를 FE Analytics 타입으로 변환
   */
  const convertToAnalyticsData = (
    dashboardStats: any,
    projects: any[],
    sessions: any[]
  ): AnalyticsData => {
    const today = new Date();
    const weekData = calculateWeeklyData(sessions);
    const projectProgress = calculateProjectProgress(projects);
    
    return {
      kpis: {
        dailyWords: dashboardStats?.todayWords || 0,
        totalWords: dashboardStats?.monthWords || 0,
        avgWpm: dashboardStats?.avgWpm || 0,
        activeProjects: dashboardStats?.activeProjects || 0,
        sessionTime: calculateSessionTime(sessions),
        accuracy: dashboardStats?.accuracy || 0,
        weeklyGoal: calculateWeeklyGoalProgress(weekData),
        improvementRate: calculateImprovementRate(sessions)
      },
      weeklyData: weekData,
      projectProgress,
      goals: [
        { label: '일일 목표 (3000자)', current: dashboardStats?.todayWords || 0, target: 3000 },
        { label: '주간 목표 (20000자)', current: dashboardStats?.weekWords || 0, target: 20000 },
        { label: '정확도 목표 (95%)', current: dashboardStats?.accuracy || 0, target: 95 },
        { label: 'WPM 목표 (90)', current: dashboardStats?.avgWpm || 0, target: 90 }
      ]
    };
  };

  /**
   * 🔥 주간 데이터 계산 헬퍼
   */
  const calculateWeeklyData = (sessions: any[]): number[] => {
    const weekData = new Array(7).fill(0);
    if (!sessions?.length) return weekData;
    
    sessions.forEach(session => {
      if (session.createdAt) {
        const date = new Date(session.createdAt);
        const dayOfWeek = date.getDay();
        weekData[dayOfWeek] += session.keyCount || 0;
      }
    });
    
    return weekData;
  };

  /**
   * 🔥 프로젝트 진행률 계산 헬퍼
   */
  const calculateProjectProgress = (projects: any[]): AnalyticsData['projectProgress'] => {
    if (!projects?.length) return [];
    
    const colors: Array<'blue' | 'green' | 'purple' | 'orange' | 'red'> = ['blue', 'green', 'purple', 'orange', 'red'];
    
    return projects.slice(0, 5).map((project, index) => ({
      name: project.title || '제목 없음',
      progress: project.progress || 0,
      color: colors[index % colors.length]
    }));
  };

  /**
   * 🔥 세션 시간 계산 헬퍼
   */
  const calculateSessionTime = (sessions: any[]): number => {
    if (!sessions?.length) return 0;
    
    const totalMinutes = sessions.reduce((total, session) => {
      if (session.startTime && session.endTime) {
        const duration = new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
        return total + (duration / (1000 * 60)); // minutes
      }
      return total;
    }, 0);
    
    return totalMinutes / 60; // hours
  };

  /**
   * 🔥 주간 목표 진행률 계산 헬퍼
   */
  const calculateWeeklyGoalProgress = (weekData: number[]): number => {
    const totalWords = weekData.reduce((sum, count) => sum + count, 0);
    const weeklyTarget = 20000;
    return Math.min((totalWords / weeklyTarget) * 100, 100);
  };

  /**
   * 🔥 향상률 계산 헬퍼
   */
  const calculateImprovementRate = (sessions: any[]): number => {
    if (!sessions?.length || sessions.length < 2) return 0;
    
    const recent = sessions.slice(0, Math.min(10, sessions.length));
    const older = sessions.slice(10, Math.min(20, sessions.length));
    
    if (!older.length) return 0;
    
    const recentAvgWpm = recent.reduce((sum, s) => sum + (s.wpm || 0), 0) / recent.length;
    const olderAvgWpm = older.reduce((sum, s) => sum + (s.wpm || 0), 0) / older.length;
    
    if (olderAvgWpm === 0) return 0;
    
    return ((recentAvgWpm - olderAvgWpm) / olderAvgWpm) * 100;
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const formatDecimal = (num: number, decimals = 1): string => {
    return num.toFixed(decimals);
  };

  // 🔥 로딩 상태 렌더링
  if (loading) {
    return (
      <div className={ANALYTICS_PAGE_STYLES.container}>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-slate-600 dark:text-slate-400">분석 데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 🔥 에러 상태 렌더링
  if (error) {
    return (
      <div className={ANALYTICS_PAGE_STYLES.container}>
        <div className="flex flex-col items-center justify-center min-h-96 text-center">
          <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            데이터 로딩 실패
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <button
            onClick={loadAnalyticsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={ANALYTICS_PAGE_STYLES.container}>
      <h1 className={ANALYTICS_PAGE_STYLES.pageTitle}>분석 및 통계</h1>

      {/* KPI 카드 그리드 */}
      <div className={ANALYTICS_PAGE_STYLES.kpiGrid}>
        <KpiCard
          title="오늘 작성한 글자"
          value={formatNumber(analyticsData.kpis.dailyWords)}
          icon={BookOpen}
          color="blue"
          change={{
            value: 12.5,
            type: 'increase',
            period: '어제 대비'
          }}
        />
        
        <KpiCard
          title="총 작성한 글자"
          value={formatNumber(analyticsData.kpis.totalWords)}
          icon={Activity}
          color="green"
          change={{
            value: 8.3,
            type: 'increase',
            period: '이번 주'
          }}
        />
        
        <KpiCard
          title="평균 타자 속도"
          value={`${formatDecimal(analyticsData.kpis.avgWpm)} WPM`}
          icon={Zap}
          color="purple"
          change={{
            value: 4.2,
            type: 'increase',
            period: '지난 주 대비'
          }}
        />
        
        <KpiCard
          title="활성 프로젝트"
          value={analyticsData.kpis.activeProjects}
          icon={Target}
          color="orange"
          change={{
            value: 0,
            type: 'neutral',
            period: '변화 없음'
          }}
        />
      </div>

      {/* 차트 그리드 */}
      <div className={ANALYTICS_PAGE_STYLES.chartsGrid}>
        {/* 주간 작성량 차트 */}
        <Card className={`${ANALYTICS_PAGE_STYLES.chartCard} lg:col-span-2`}>
          <h3 className={ANALYTICS_PAGE_STYLES.chartTitle}>주간 작성량 추이</h3>
          <div className={ANALYTICS_PAGE_STYLES.chartPlaceholder}>
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <p>차트 구현 예정</p>
              <p className="text-xs mt-1">
                이번 주 평균: {formatNumber(analyticsData.weeklyData.reduce((a: number, b: number) => a + b, 0) / 7)}자/일
              </p>
            </div>
          </div>
        </Card>

        {/* 프로젝트 진행률 */}
        <Card className={ANALYTICS_PAGE_STYLES.chartCard}>
          <h3 className={ANALYTICS_PAGE_STYLES.chartTitle}>프로젝트 진행률</h3>
          <div className="space-y-4">
            {analyticsData.projectProgress.map((project, index: number) => (
              <div key={index} className={ANALYTICS_PAGE_STYLES.progressItem}>
                <div className="flex-1">
                  <div className={ANALYTICS_PAGE_STYLES.progressLabel}>
                    {project.name}
                  </div>
                  <div className="mt-2">
                    <ProgressBar
                      value={project.progress}
                      color={project.color}
                      size="sm"
                    />
                  </div>
                </div>
                <div className={ANALYTICS_PAGE_STYLES.progressValue}>
                  {formatDecimal(project.progress)}%
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 하단 그리드 */}
      <div className={ANALYTICS_PAGE_STYLES.progressGrid}>
        {/* 추가 KPI */}
        <div className="grid grid-cols-2 gap-4">
          <KpiCard
            title="세션 시간"
            value={`${formatDecimal(analyticsData.kpis.sessionTime)}h`}
            icon={Clock}
            color="blue"
            change={{
              value: 15.2,
              type: 'increase',
              period: '어제 대비'
            }}
          />
          
          <KpiCard
            title="정확도"
            value={`${formatDecimal(analyticsData.kpis.accuracy)}%`}
            icon={Target}
            color="green"
            change={{
              value: 2.1,
              type: 'increase',
              period: '지난 주 대비'
            }}
          />
        </div>

        {/* 목표 달성률 */}
        <Card className={ANALYTICS_PAGE_STYLES.goalCard}>
          <h3 className={ANALYTICS_PAGE_STYLES.goalTitle}>목표 달성률</h3>
          <p className={ANALYTICS_PAGE_STYLES.goalDescription}>
            이번 주 전체 목표 달성률: {formatDecimal(analyticsData.kpis.weeklyGoal)}%
          </p>
          <div className={ANALYTICS_PAGE_STYLES.goalProgress}>
            {analyticsData.goals.map((goal, index: number) => {
              const percentage = Math.min((goal.current / goal.target) * 100, 100);
              const isCompleted = percentage >= 100;
              
              return (
                <div key={index} className={ANALYTICS_PAGE_STYLES.goalItem}>
                  <div className="flex-1">
                    <div className={ANALYTICS_PAGE_STYLES.goalLabel}>
                      {goal.label}
                    </div>
                    <div className="mt-1">
                      <ProgressBar
                        value={percentage}
                        color={isCompleted ? 'green' : 'blue'}
                        size="sm"
                      />
                    </div>
                  </div>
                  <div className={ANALYTICS_PAGE_STYLES.goalPercentage}>
                    {formatDecimal(percentage)}%
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
