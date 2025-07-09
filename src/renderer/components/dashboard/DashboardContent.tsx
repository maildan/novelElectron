'use client';

import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  PenTool, 
  Clock, 
  Target, 
  TrendingUp,
  Plus,
  FileText,
  Calendar,
  Zap
} from 'lucide-react';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const DASHBOARD_STYLES = {
  container: 'p-6 space-y-6',
  header: 'flex items-center justify-between',
  title: 'text-2xl font-bold text-gray-900',
  subtitle: 'text-gray-600 mt-1',
  quickStartSection: 'space-y-4',
  quickStartCard: 'text-center py-12',
  quickStartIcon: 'w-16 h-16 mx-auto text-blue-600 mb-4',
  quickStartTitle: 'text-xl font-semibold text-gray-900 mb-2',
  quickStartDescription: 'text-gray-600 mb-6 max-w-md mx-auto',
  widgetGrid: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
  kpiGrid: 'grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6',
  kpiCard: 'p-4',
  kpiIcon: 'w-8 h-8 text-blue-600 mb-2',
  kpiValue: 'text-2xl font-bold text-gray-900',
  kpiLabel: 'text-sm text-gray-600',
  kpiChange: 'text-xs font-medium',
  kpiIncrease: 'text-green-600',
  kpiDecrease: 'text-red-600',
  widgetHeader: 'flex items-center justify-between mb-4',
  widgetTitle: 'font-semibold text-gray-900',
  widgetAction: 'text-sm text-blue-600 hover:text-blue-700',
  recentItem: 'flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors',
  recentIcon: 'w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center',
  recentContent: 'flex-1 min-w-0',
  recentTitle: 'font-medium text-gray-900 truncate',
  recentMeta: 'text-sm text-gray-500'
} as const;

interface KpiData {
  readonly label: string;
  readonly value: string | number;
  readonly icon: React.ElementType;
  readonly change: {
    value: number;
    type: 'increase' | 'decrease';
  };
}

interface RecentFile {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly modifiedAt: string;
}

export function DashboardContent() {
  // 🔥 Mock 데이터 (실제로는 Electron IPC로 데이터 가져올 예정)
  const kpiData: readonly KpiData[] = [
    {
      label: '오늘 작성',
      value: '2,847',
      icon: PenTool,
      change: { value: 12, type: 'increase' }
    },
    {
      label: '이번 주',
      value: '18,392',
      icon: Calendar,
      change: { value: 8, type: 'increase' }
    },
    {
      label: '평균 속도',
      value: '67 WPM',
      icon: Zap,
      change: { value: 3, type: 'decrease' }
    },
    {
      label: '총 프로젝트',
      value: 24,
      icon: FileText,
      change: { value: 2, type: 'increase' }
    }
  ] as const;

  const recentFiles: readonly RecentFile[] = [
    {
      id: '1',
      name: '소설 초고 1장.docx',
      type: 'document',
      modifiedAt: '2시간 전'
    },
    {
      id: '2',
      name: '블로그 포스트 초안.md',
      type: 'markdown',
      modifiedAt: '1일 전'
    },
    {
      id: '3',
      name: '회의록_2025_06_28.txt',
      type: 'text',
      modifiedAt: '3일 전'
    }
  ] as const;

  const handleNewProject = (): void => {
    // TODO: 새 프로젝트 생성 로직
    console.log('Create new project');
  };

  return (
    <div className={DASHBOARD_STYLES.container}>
      {/* 헤더 */}
      <div className={DASHBOARD_STYLES.header}>
        <div>
          <h1 className={DASHBOARD_STYLES.title}>대시보드</h1>
          <p className={DASHBOARD_STYLES.subtitle}>
            오늘도 멋진 글을 써보세요!
          </p>
        </div>
        <Button onClick={handleNewProject}>
          <Plus className="w-4 h-4 mr-2" />
          새 프로젝트
        </Button>
      </div>

      {/* KPI 카드들 */}
      <div className={DASHBOARD_STYLES.kpiGrid}>
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const changeClass = kpi.change.type === 'increase' 
            ? DASHBOARD_STYLES.kpiIncrease 
            : DASHBOARD_STYLES.kpiDecrease;
          
          return (
            <Card key={index} className={DASHBOARD_STYLES.kpiCard} hoverable>
              <Icon className={DASHBOARD_STYLES.kpiIcon} />
              <div className={DASHBOARD_STYLES.kpiValue}>{kpi.value}</div>
              <div className={DASHBOARD_STYLES.kpiLabel}>{kpi.label}</div>
              <div className={`${DASHBOARD_STYLES.kpiChange} ${changeClass}`}>
                {kpi.change.type === 'increase' ? '+' : '-'}{kpi.change.value}%
              </div>
            </Card>
          );
        })}
      </div>

      {/* 위젯 그리드 */}
      <div className={DASHBOARD_STYLES.widgetGrid}>
        {/* Quick Start 카드 */}
        <Card className={DASHBOARD_STYLES.quickStartCard} variant="elevated">
          <PenTool className={DASHBOARD_STYLES.quickStartIcon} />
          <h3 className={DASHBOARD_STYLES.quickStartTitle}>
            첫 번째 프로젝트를 시작해보세요
          </h3>
          <p className={DASHBOARD_STYLES.quickStartDescription}>
            Loop과 함께 타이핑 실력을 향상시키고 
            AI 피드백으로 더 나은 글을 써보세요.
          </p>
          <Button onClick={handleNewProject} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            프로젝트 시작하기
          </Button>
        </Card>

        {/* 최근 파일 위젯 */}
        <Card>
          <div className={DASHBOARD_STYLES.widgetHeader}>
            <h3 className={DASHBOARD_STYLES.widgetTitle}>최근 파일</h3>
            <a href="#" className={DASHBOARD_STYLES.widgetAction}>
              모두 보기
            </a>
          </div>
          <div className="space-y-2">
            {recentFiles.map((file) => (
              <div key={file.id} className={DASHBOARD_STYLES.recentItem}>
                <div className={DASHBOARD_STYLES.recentIcon}>
                  <FileText className="w-4 h-4" />
                </div>
                <div className={DASHBOARD_STYLES.recentContent}>
                  <div className={DASHBOARD_STYLES.recentTitle}>{file.name}</div>
                  <div className={DASHBOARD_STYLES.recentMeta}>{file.modifiedAt}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 진행률 위젯 */}
        <Card>
          <div className={DASHBOARD_STYLES.widgetHeader}>
            <h3 className={DASHBOARD_STYLES.widgetTitle}>이번 주 목표</h3>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>일일 단어 수</span>
                <span>2,847 / 3,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>주간 목표</span>
                <span>18,392 / 21,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
