'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3, Clock, Target, BookOpen, Zap } from 'lucide-react';
import { KpiCard } from '../ui/KpiCard';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Logger } from '../../../shared/logger';
import type { ElectronAPI } from '../../../shared/types';

// 🔥 Window 타입 확장
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

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
} as const;

// 🔥 분리된 Analytics 페이지 클라이언트 컴포넌트
export function AnalyticsPageClient(): React.ReactElement {
  // 🔥 기존 Analytics 페이지 로직을 여기로 이동
  const [dashboardData, setDashboardData] = React.useState({
    todayWords: 0,
    weekWords: 0,
    monthWords: 0,
    avgWpm: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    accuracy: 0,
    streakDays: 0
  });

  React.useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        if (typeof window !== 'undefined' && window.electronAPI) {
          const response = await window.electronAPI.dashboard.getStats();
          if (response.success && response.data) {
            setDashboardData(response.data);
          }
        }
      } catch (error) {
        Logger.error('ANALYTICS_PAGE', '대시보드 데이터 로드 실패', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className={ANALYTICS_PAGE_STYLES.container}>
      <h1 className={ANALYTICS_PAGE_STYLES.pageTitle}>
        분석 및 통계
      </h1>

      {/* KPI Cards Grid */}
      <div className={ANALYTICS_PAGE_STYLES.kpiGrid}>
        <KpiCard
          title="오늘 입력한 단어"
          value={dashboardData.todayWords.toLocaleString()}
          change={{ value: 12.5, type: 'increase', period: '어제 대비' }}
          icon={BookOpen}
        />
        <KpiCard
          title="이번 주 단어"
          value={dashboardData.weekWords.toLocaleString()}
          change={{ value: 8.2, type: 'increase', period: '지난주 대비' }}
          icon={Target}
        />
        <KpiCard
          title="평균 WPM"
          value={dashboardData.avgWpm}
          change={{ value: -2.1, type: 'decrease', period: '지난주 대비' }}
          icon={Zap}
        />
        <KpiCard
          title="정확도"
          value={`${dashboardData.accuracy}%`}
          change={{ value: 1.3, type: 'increase', period: '지난주 대비' }}
          icon={Target}
        />
      </div>

      {/* Charts Grid */}
      <div className={ANALYTICS_PAGE_STYLES.chartsGrid}>
        <Card className={ANALYTICS_PAGE_STYLES.chartCard}>
          <h3 className={ANALYTICS_PAGE_STYLES.chartTitle}>
            <Activity className="w-5 h-5 inline mr-2" />
            일간 활동
          </h3>
          <div className={ANALYTICS_PAGE_STYLES.chartPlaceholder}>
            차트 준비 중...
          </div>
        </Card>

        <Card className={ANALYTICS_PAGE_STYLES.chartCard}>
          <h3 className={ANALYTICS_PAGE_STYLES.chartTitle}>
            <TrendingUp className="w-5 h-5 inline mr-2" />
            WPM 추이
          </h3>
          <div className={ANALYTICS_PAGE_STYLES.chartPlaceholder}>
            차트 준비 중...
          </div>
        </Card>

        <Card className={ANALYTICS_PAGE_STYLES.chartCard}>
          <h3 className={ANALYTICS_PAGE_STYLES.chartTitle}>
            <BarChart3 className="w-5 h-5 inline mr-2" />
            정확도 분석
          </h3>
          <div className={ANALYTICS_PAGE_STYLES.chartPlaceholder}>
            차트 준비 중...
          </div>
        </Card>
      </div>

      {/* Progress Bars */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          <Clock className="w-5 h-5 inline mr-2" />
          진행 상황
        </h3>
        <div className={ANALYTICS_PAGE_STYLES.progressGrid}>
          <div className={ANALYTICS_PAGE_STYLES.progressItem}>
            <div>
              <div className={ANALYTICS_PAGE_STYLES.progressLabel}>일일 목표</div>
              <ProgressBar value={75} />
            </div>
            <span className={ANALYTICS_PAGE_STYLES.progressValue}>75%</span>
          </div>
          <div className={ANALYTICS_PAGE_STYLES.progressItem}>
            <div>
              <div className={ANALYTICS_PAGE_STYLES.progressLabel}>주간 목표</div>
              <ProgressBar value={60} />
            </div>
            <span className={ANALYTICS_PAGE_STYLES.progressValue}>60%</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AnalyticsPageClient;
