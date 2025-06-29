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

// 🔥 기가차드 규칙: 임시 목 데이터 (실제 구현 시 IPC 통신으로 대체)
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

const MOCK_ANALYTICS: AnalyticsData = {
  kpis: {
    dailyWords: 2847,
    totalWords: 156230,
    avgWpm: 87.5,
    activeProjects: 5,
    sessionTime: 4.2,
    accuracy: 96.8,
    weeklyGoal: 85.3,
    improvementRate: 12.4
  },
  weeklyData: [2100, 2850, 1950, 3200, 2700, 2400, 2847],
  projectProgress: [
    { name: 'Loop 개발 문서', progress: 75.5, color: 'blue' },
    { name: '소설: 디지털 세상의 모험', progress: 100, color: 'green' },
    { name: '마케팅 기획서', progress: 45.2, color: 'orange' },
    { name: '개인 일기', progress: 30.8, color: 'purple' },
    { name: '프레젠테이션 스크립트', progress: 15.0, color: 'red' }
  ],
  goals: [
    { label: '일일 목표 (3000자)', current: 2847, target: 3000 },
    { label: '주간 목표 (20000자)', current: 17085, target: 20000 },
    { label: '정확도 목표 (95%)', current: 96.8, target: 95 },
    { label: 'WPM 목표 (90)', current: 87.5, target: 90 }
  ]
} as const;

export default function AnalyticsPage(): React.ReactElement {
  
  React.useEffect(() => {
    Logger.info('ANALYTICS_PAGE', 'Analytics page loaded');
  }, []);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const formatDecimal = (num: number, decimals = 1): string => {
    return num.toFixed(decimals);
  };

  return (
    <div className={ANALYTICS_PAGE_STYLES.container}>
      <h1 className={ANALYTICS_PAGE_STYLES.pageTitle}>분석 및 통계</h1>

      {/* KPI 카드 그리드 */}
      <div className={ANALYTICS_PAGE_STYLES.kpiGrid}>
        <KpiCard
          title="오늘 작성한 글자"
          value={formatNumber(MOCK_ANALYTICS.kpis.dailyWords)}
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
          value={formatNumber(MOCK_ANALYTICS.kpis.totalWords)}
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
          value={`${formatDecimal(MOCK_ANALYTICS.kpis.avgWpm)} WPM`}
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
          value={MOCK_ANALYTICS.kpis.activeProjects}
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
                이번 주 평균: {formatNumber(MOCK_ANALYTICS.weeklyData.reduce((a, b) => a + b, 0) / 7)}자/일
              </p>
            </div>
          </div>
        </Card>

        {/* 프로젝트 진행률 */}
        <Card className={ANALYTICS_PAGE_STYLES.chartCard}>
          <h3 className={ANALYTICS_PAGE_STYLES.chartTitle}>프로젝트 진행률</h3>
          <div className="space-y-4">
            {MOCK_ANALYTICS.projectProgress.map((project, index) => (
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
            value={`${formatDecimal(MOCK_ANALYTICS.kpis.sessionTime)}h`}
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
            value={`${formatDecimal(MOCK_ANALYTICS.kpis.accuracy)}%`}
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
            이번 주 전체 목표 달성률: {formatDecimal(MOCK_ANALYTICS.kpis.weeklyGoal)}%
          </p>
          <div className={ANALYTICS_PAGE_STYLES.goalProgress}>
            {MOCK_ANALYTICS.goals.map((goal, index) => {
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
