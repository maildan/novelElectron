'use client';

import React, { useState } from 'react';
import { 
  Target, 
  Clock, 
  CheckCircle, 
  FileText, 
  Cloud, 
  Play, 
  Pause,
  TrendingUp,
  Calendar,
  Zap,
  FolderOpen,
  PenTool
} from 'lucide-react';
import { 
  Card, 
  Button, 
  Badge, 
  ProgressBar, 
  KpiCard 
} from '../ui';
import { QuickStartCard } from './QuickStartCard';
import { Logger } from '../../../shared/logger';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const DASHBOARD_STYLES = {
  container: 'flex-1 flex flex-col bg-slate-50 dark:bg-slate-950',
  header: 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6',
  headerContent: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4',
  headerTitle: 'text-2xl font-bold text-slate-900 dark:text-slate-100',
  headerSubtitle: 'text-slate-600 dark:text-slate-400 mt-1',
  headerActions: 'flex items-center gap-3',
  content: 'flex-1 overflow-y-auto p-6 space-y-6',
  monitoringPanel: 'bg-blue-600 text-white p-6 rounded-lg shadow-lg',
  monitoringHeader: 'flex items-center justify-between mb-4',
  monitoringStatus: 'flex items-center gap-2',
  monitoringPulse: 'w-2 h-2 bg-green-400 rounded-full animate-pulse',
  monitoringTitle: 'text-lg font-semibold',
  monitoringTime: 'font-mono text-lg',
  monitoringStats: 'grid grid-cols-3 gap-6 text-center',
  statValue: 'text-2xl font-bold',
  statLabel: 'text-blue-200 text-sm',
  quickActions: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
  quickActionCard: 'h-[120px] flex flex-col justify-between transition-colors hover:shadow-md',
  quickActionIcon: 'w-5 h-5',
  quickActionTitle: 'font-semibold text-slate-900 dark:text-slate-100 mb-1',
  quickActionDesc: 'text-sm text-slate-600 dark:text-slate-400 mb-2',
  quickActionStatus: 'text-xs font-medium',
  mainGrid: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  projectList: 'space-y-4',
  projectItem: 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-lg',
  projectHeader: 'flex items-center justify-between mb-3',
  projectTitle: 'font-semibold text-slate-900 dark:text-slate-100',
  projectProgress: 'mb-2',
  projectStats: 'flex justify-between items-center',
  progressText: 'text-sm font-medium text-slate-700 dark:text-slate-300',
  progressGoal: 'text-xs text-slate-500 dark:text-slate-400',
  recentFiles: 'space-y-2',
  fileItem: 'flex items-center p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors',
  fileIcon: 'w-4 h-4 text-slate-600 dark:text-slate-400 mr-3 flex-shrink-0',
  fileInfo: 'flex-1 min-w-0',
  fileName: 'font-medium text-slate-900 dark:text-slate-100 text-sm truncate',
  fileProject: 'text-xs text-slate-500 dark:text-slate-400',
  fileMeta: 'text-right flex-shrink-0',
  fileTime: 'text-xs font-medium text-slate-700 dark:text-slate-300',
  fileStatus: 'text-xs text-green-600 dark:text-green-400',
} as const;

// 🔥 기가차드 규칙: 명시적 타입 정의
interface MonitoringData {
  readonly wpm: number;
  readonly words: number;
  readonly time: number;
}

interface Project {
  readonly id: string;
  readonly title: string;
  readonly status: 'active' | 'draft' | 'completed';
  readonly progress: number;
  readonly goal: string;
}

interface RecentFile {
  readonly id: string;
  readonly name: string;
  readonly project: string;
  readonly time: string;
  readonly status: string;
}

export interface DashboardMainProps {
  readonly isMonitoring?: boolean;
  readonly onToggleMonitoring?: () => void;
  readonly onAIToggle?: () => void;
  readonly isAIOpen?: boolean;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function DashboardMain({
  isMonitoring = false,
  onToggleMonitoring,
  onAIToggle,
  isAIOpen = false,
}: DashboardMainProps): React.ReactElement {
  
  const [monitoringData] = useState<MonitoringData>({
    wpm: 68,
    words: 1234,
    time: 1847,
  });

  // 🔥 기가차드 규칙: 메모이제이션으로 성능 최적화
  const projects: Project[] = React.useMemo(() => [
    {
      id: '1',
      title: '시간의 강',
      status: 'active',
      progress: 67,
      goal: '12월 31일',
    },
    {
      id: '2', 
      title: '일상의 철학',
      status: 'draft',
      progress: 30,
      goal: '1월 15일',
    },
  ], []);

  const recentFiles: RecentFile[] = React.useMemo(() => [
    {
      id: '1',
      name: 'chapter-12.md',
      project: '시간의 강',
      time: '2분 전',
      status: '수정됨',
    },
    {
      id: '2',
      name: 'intro.md', 
      project: '일상의 철학',
      time: '1시간 전',
      status: '저장됨',
    },
    {
      id: '3',
      name: 'outline.md',
      project: '도시 이야기', 
      time: '3시간 전',
      status: '동기화됨',
    },
  ], []);

  const handleToggleMonitoring = (): void => {
    Logger.info('DASHBOARD', `Monitoring ${!isMonitoring ? 'started' : 'stopped'}`);
    onToggleMonitoring?.();
  };

  const handleAIToggle = (): void => {
    Logger.info('DASHBOARD', `AI Panel ${!isAIOpen ? 'opened' : 'closed'}`);
    onAIToggle?.();
  };

  const kpiData = [
    {
      title: '오늘 작성',
      value: '1,234',
      icon: PenTool,
      color: 'blue' as const,
      change: {
        value: 12,
        type: 'increase' as const,
        period: '%',
      },
    },
    {
      title: '이번 주',
      value: '8,567', 
      icon: Calendar,
      color: 'green' as const,
      change: {
        value: 8,
        type: 'increase' as const,
        period: '%',
      },
    },
    {
      title: '평균 속도',
      value: '68 WPM',
      icon: Zap,
      color: 'purple' as const,
      change: {
        value: 5,
        type: 'increase' as const,
        period: '%',
      },
    },
    {
      title: '총 프로젝트',
      value: '12',
      icon: FolderOpen,
      color: 'orange' as const,
      change: {
        value: 2,
        type: 'increase' as const,
        period: '개',
      },
    },
  ];

  return (
    <div className={DASHBOARD_STYLES.container}>
      {/* 헤더 */}
      <div className={DASHBOARD_STYLES.header}>
        <div className={DASHBOARD_STYLES.headerContent}>
          <div>
            <h1 className={DASHBOARD_STYLES.headerTitle}>대시보드</h1>
            <p className={DASHBOARD_STYLES.headerSubtitle}>오늘의 창작을 시작하세요</p>
          </div>

          <div className={DASHBOARD_STYLES.headerActions}>
            <Button
              onClick={handleAIToggle}
              variant={isAIOpen ? 'primary' : 'outline'}
              className="gap-2"
              aria-pressed={isAIOpen}
            >
              <Target className="w-4 h-4" />
              Loop AI
            </Button>

            <Button
              onClick={handleToggleMonitoring}
              variant={isMonitoring ? 'destructive' : 'primary'}
              className="gap-2"
            >
              {isMonitoring ? (
                <>
                  <Pause className="w-4 h-4" />
                  중지
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  시작
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={DASHBOARD_STYLES.content}>
        {/* 실시간 모니터링 패널 */}
        {isMonitoring && (
          <div className={DASHBOARD_STYLES.monitoringPanel}>
            <div className={DASHBOARD_STYLES.monitoringHeader}>
              <div className={DASHBOARD_STYLES.monitoringStatus}>
                <div className={DASHBOARD_STYLES.monitoringPulse} />
                <h2 className={DASHBOARD_STYLES.monitoringTitle}>실시간 모니터링</h2>
              </div>
              <div className={DASHBOARD_STYLES.monitoringTime}>
                {formatTime(monitoringData.time)}
              </div>
            </div>
            <div className={DASHBOARD_STYLES.monitoringStats}>
              <div>
                <div className={DASHBOARD_STYLES.statValue}>{monitoringData.wpm}</div>
                <div className={DASHBOARD_STYLES.statLabel}>분당 단어</div>
              </div>
              <div>
                <div className={DASHBOARD_STYLES.statValue}>{monitoringData.words.toLocaleString()}</div>
                <div className={DASHBOARD_STYLES.statLabel}>총 단어</div>
              </div>
              <div>
                <div className={DASHBOARD_STYLES.statValue}>{Math.round(monitoringData.wpm * 0.85)}</div>
                <div className={DASHBOARD_STYLES.statLabel}>정확도</div>
              </div>
            </div>
          </div>
        )}

        {/* KPI 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <KpiCard key={index} {...kpi} />
          ))}
        </div>

        {/* 빠른 시작 */}
        <QuickStartCard
          onCreateProject={() => {
            Logger.info('DASHBOARD', 'Create project from quick start');
            // TODO: 새 프로젝트 생성 다이얼로그 또는 페이지로 이동
          }}
          onImportProject={() => {
            Logger.info('DASHBOARD', 'Import project from quick start');
            // TODO: 프로젝트 가져오기 다이얼로그
          }}
          onOpenSample={() => {
            Logger.info('DASHBOARD', 'Open sample project');
            // TODO: 샘플 프로젝트 열기
          }}
          onViewDocs={() => {
            Logger.info('DASHBOARD', 'View documentation');
            // TODO: 문서 페이지로 이동
          }}
        />

        {/* 메인 그리드 */}
        <div className={DASHBOARD_STYLES.mainGrid}>
          {/* 활성 프로젝트 */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">활성 프로젝트</h3>
            </div>

            <div className={DASHBOARD_STYLES.projectList}>
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className={`${DASHBOARD_STYLES.projectItem} ${
                    project.status === 'active' 
                      ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' 
                      : ''
                  }`}
                >
                  <div className={DASHBOARD_STYLES.projectHeader}>
                    <h4 className={DASHBOARD_STYLES.projectTitle}>{project.title}</h4>
                    <Badge 
                      variant={project.status === 'active' ? 'primary' : 'default'}
                      size="sm"
                    >
                      {project.status === 'active' ? '진행중' : '초안'}
                    </Badge>
                  </div>
                  <div className={DASHBOARD_STYLES.projectProgress}>
                    <ProgressBar 
                      value={project.progress} 
                      color={project.status === 'active' ? 'blue' : 'purple'} 
                      size="md"
                    />
                  </div>
                  <div className={DASHBOARD_STYLES.projectStats}>
                    <span className={DASHBOARD_STYLES.progressText}>
                      {project.progress}% 완료
                    </span>
                    <span className={DASHBOARD_STYLES.progressGoal}>
                      목표: {project.goal}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 최근 파일 */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">최근 파일</h3>
            </div>

            <div className={DASHBOARD_STYLES.recentFiles}>
              {recentFiles.map((file) => (
                <div 
                  key={file.id}
                  className={DASHBOARD_STYLES.fileItem}
                  role="button"
                  tabIndex={0}
                  onClick={() => Logger.info('DASHBOARD', 'File clicked', { file: file.name })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      Logger.info('DASHBOARD', 'File selected', { file: file.name });
                    }
                  }}
                >
                  <FileText className={DASHBOARD_STYLES.fileIcon} />
                  <div className={DASHBOARD_STYLES.fileInfo}>
                    <div className={DASHBOARD_STYLES.fileName}>{file.name}</div>
                    <div className={DASHBOARD_STYLES.fileProject}>{file.project}</div>
                  </div>
                  <div className={DASHBOARD_STYLES.fileMeta}>
                    <div className={DASHBOARD_STYLES.fileTime}>{file.time}</div>
                    <div className={DASHBOARD_STYLES.fileStatus}>{file.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
