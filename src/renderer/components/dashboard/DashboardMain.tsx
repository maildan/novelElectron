'use client';

import React, { useState, useMemo, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Crosshair as Target, 
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
  PenTool,
  type LucideIcon
} from 'lucide-react';
import { 
  Card, 
  Button, 
  Badge, 
  ProgressBar, 
  KpiCard 
} from '../ui';
import { QuickStartCard } from './QuickStartCard';
import { MonitoringControlPanel } from './MonitoringControlPanel';
import { DashboardSkeleton } from './DashboardSkeleton';
import { HydrationGuard } from '../ui/HydrationGuard';
import { Logger } from '../../../shared/logger';
import { useMonitoring } from '../../contexts/GlobalMonitoringContext';

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

// 🔥 기가차드 수정: 빈 인터페이스 대신 구체적 타입 정의
export interface DashboardMainProps {
  readonly className?: string; // 선택적 스타일링 지원
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function DashboardMain(): React.ReactElement {
  const router = useRouter(); // 🔥 Navigation 훅 추가
  // 🔥 글로벌 모니터링 상태 사용
  const { state, startMonitoring, stopMonitoring, toggleAI, updateSessionData } = useMonitoring();
  const { isMonitoring, isAIOpen, sessionData } = state;
  
  // 🔥 기가차드 규칙: 실제 데이터 상태 관리 - 더미 데이터 제거
  const [monitoringData, setMonitoringData] = useState<MonitoringData>({
    wpm: 0,
    words: 0,
    time: 0,
  });
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  
  // 🔥 로딩 상태 최적화 - 개별 로딩 상태 관리
  const [loadingStates, setLoadingStates] = useState({
    kpi: true,
    projects: true,
    recentFiles: true,
  });
  // 🔥 기가차드 규칙: 타입 안전성 - KPI 데이터 타입 정의
  interface KpiDataItem {
    readonly title: string;
    readonly value: string;
    readonly icon: LucideIcon;
    readonly color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    readonly change: {
      readonly value: number;
      readonly type: 'increase' | 'decrease' | 'neutral';
      readonly period: string;
    };
  }

  const [loading, setLoading] = useState<boolean>(true);
  const [kpiData, setKpiData] = useState<KpiDataItem[]>([
    {
      title: '오늘 작성',
      value: '0',
      icon: PenTool,
      color: 'blue' as const,
      change: { value: 0, type: 'neutral' as const, period: '%' },
    },
    {
      title: '이번 주',
      value: '0', 
      icon: Calendar,
      color: 'green' as const,
      change: { value: 0, type: 'neutral' as const, period: '%' },
    },
    {
      title: '평균 속도',
      value: '0 WPM',
      icon: Zap,
      color: 'purple' as const,
      change: { value: 0, type: 'neutral' as const, period: '%' },
    },
    {
      title: '활성 프로젝트',
      value: '0',
      icon: FolderOpen,
      color: 'orange' as const,
      change: { value: 0, type: 'neutral' as const, period: '개' },
    },
  ]);

  // 🔥 대시보드 데이터 로딩 - 메모화로 성능 최적화
  const loadDashboardData = useCallback(async (): Promise<void> => {
    try {
      // 🔥 기가차드 규칙: 타입 안전한 IPC 통신 - 병렬 처리
      const [dashboardStatsResult, projectsResult, recentSessionsResult] = await Promise.allSettled([
        window.electronAPI.dashboard.getStats(),
        window.electronAPI.projects.getAll(),
        window.electronAPI.dashboard.getRecentSessions()
      ]);

      // 🔥 대시보드 통계 업데이트
      if (dashboardStatsResult.status === 'fulfilled' && dashboardStatsResult.value.success) {
        const stats = dashboardStatsResult.value.data;
        updateKpiData(stats);
        setLoadingStates(prev => ({ ...prev, kpi: false }));
        Logger.debug('DASHBOARD', '✅ Dashboard stats loaded', stats);
      }

      // 🔥 프로젝트 데이터 업데이트
      if (projectsResult.status === 'fulfilled' && projectsResult.value.success) {
        const projectsData = projectsResult.value.data || [];
        setProjects(projectsData.map((p: any) => ({
          id: p.id || '',
          title: p.title || '제목 없음',
          status: p.status || 'draft',
          progress: p.progress || 0,
          goal: p.dueDate ? new Date(p.dueDate).toLocaleDateString() : '목표 미설정',
        })));
        setLoadingStates(prev => ({ ...prev, projects: false }));
        Logger.debug('DASHBOARD', '✅ Projects loaded', { count: projectsData.length });
      }

      // 🔥 최근 세션 데이터를 파일 형태로 변환
      if (recentSessionsResult.status === 'fulfilled' && recentSessionsResult.value.success) {
        const sessions = recentSessionsResult.value.data || [];
        setRecentFiles(sessions.slice(0, 3).map((session: any, index: number) => ({
          id: session.id || `session-${index}`,
          name: `session-${new Date(session.startTime).toLocaleDateString()}.md`,
          project: session.windowTitle || '알 수 없는 앱',
          time: formatTimeAgo(session.endTime || session.startTime),
          status: '완료',
        })));
        setLoadingStates(prev => ({ ...prev, recentFiles: false }));
        Logger.debug('DASHBOARD', '✅ Recent sessions loaded', { count: sessions.length });
      }

    } catch (error) {
      Logger.error('DASHBOARD', '❌ Failed to load dashboard data', error);
    }
  }, []);

  // 🔥 대시보드 데이터 로딩 - 성능 최적화
  React.useEffect(() => {
    loadDashboardData();
    
    // 🔥 실시간 업데이트 (30초마다로 변경 - 성능 최적화)
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  /**
   * 🔥 변화율 타입 결정 헬퍼 함수
   */
  const getChangeType = (value: number): 'increase' | 'decrease' | 'neutral' => {
    if (value > 0) return 'increase';
    if (value < 0) return 'decrease';
    return 'neutral';
  };

  /**
   * 🔥 KPI 데이터 업데이트
   */
  const updateKpiData = (stats: any): void => {
    setKpiData([
      {
        title: '오늘 작성',
        value: (stats?.todayWords || 0).toLocaleString(),
        icon: PenTool,
        color: 'blue' as const,
        change: {
          value: Math.max(0, stats?.dailyGrowth || 0),
          type: getChangeType(stats?.dailyGrowth || 0),
          period: '%',
        },
      },
      {
        title: '이번 주',
        value: (stats?.weekWords || 0).toLocaleString(),
        icon: Calendar,
        color: 'green' as const,
        change: {
          value: Math.max(0, stats?.weeklyGrowth || 0),
          type: getChangeType(stats?.weeklyGrowth || 0),
          period: '%',
        },
      },
      {
        title: '평균 속도',
        value: `${Math.round(stats?.avgWpm || 0)} WPM`,
        icon: Zap,
        color: 'purple' as const,
        change: {
          value: Math.max(0, stats?.wpmImprovement || 0),
          type: getChangeType(stats?.wpmImprovement || 0),
          period: '%',
        },
      },
      {
        title: '활성 프로젝트',
        value: (stats?.activeProjects || 0).toString(),
        icon: FolderOpen,
        color: 'orange' as const,
        change: {
          value: Math.max(0, stats?.projectGrowth || 0),
          type: getChangeType(stats?.projectGrowth || 0),
          period: '개',
        },
      },
    ]);
  };

  /**
   * 🔥 시간 경과 표시 헬퍼
   */
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전`;
  };

  const handleToggleMonitoring = async (): Promise<void> => {
    try {
      Logger.info('DASHBOARD', `Monitoring ${!isMonitoring ? 'start' : 'stop'} requested`);
      
      if (!isMonitoring) {
        // 모니터링 시작
        await startMonitoring();
      } else {
        // 모니터링 중지
        await stopMonitoring();
      }
    } catch (error) {
      Logger.error('DASHBOARD', 'Error toggling monitoring', error);
    }
  };

  const handleAIToggle = (): void => {
    Logger.info('DASHBOARD', `AI Panel ${!isAIOpen ? 'opened' : 'closed'}`);
    toggleAI();
  };

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
            <HydrationGuard fallback={
              <Button
                variant="outline"
                className="gap-2"
              >
                <Target className="w-4 h-4" />
                Loop AI
              </Button>
            }>
              <Button
                onClick={handleAIToggle}
                variant={isAIOpen ? 'primary' : 'outline'}
                className="gap-2"
                aria-pressed={isAIOpen}
              >
                <Target className="w-4 h-4" />
                Loop AI
              </Button>
            </HydrationGuard>

            <HydrationGuard fallback={
              <Button
                variant="primary"
                className="gap-2 min-w-[120px]"
                size="md"
              >
                <Play className="w-4 h-4" />
                타이핑 시작
              </Button>
            }>
              <Button
                onClick={handleToggleMonitoring}
                variant={isMonitoring ? 'destructive' : 'primary'}
                className={`gap-2 min-w-[120px] transition-all duration-200 ${
                  isMonitoring 
                    ? 'animate-pulse bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                }`}
                size="md"
              >
                {isMonitoring ? (
                  <>
                    <Pause className="w-4 h-4" />
                    모니터링 중지
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    타이핑 시작
                  </>
                )}
              </Button>
            </HydrationGuard>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={DASHBOARD_STYLES.content}>
        {/* 🔥 모니터링 컨트롤 패널 - 항상 표시 */}
        <MonitoringControlPanel />

        {/* KPI 카드 */}
        {loadingStates.kpi ? (
          <DashboardSkeleton showKpi showProjects={false} showRecentFiles={false} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, index) => (
              <KpiCard key={index} {...kpi} />
            ))}
          </div>
        )}

        {/* 빠른 시작 */}
        <QuickStartCard
          onCreateProject={async () => {
            try {
              Logger.info('DASHBOARD', '🚀 Creating new project from dashboard');
              // 🔥 프로젝트 페이지로 이동하여 새 프로젝트 생성 플로우 시작
              router.push('/projects?create=true');
            } catch (error) {
              Logger.error('DASHBOARD', 'Failed to navigate to project creation', error);
            }
          }}
          onImportProject={async () => {
            try {
              Logger.info('DASHBOARD', 'Importing project from quick start');
              const result = await window.electronAPI.projects.importFile();
              if (result.success) {
                Logger.info('DASHBOARD', 'Project import initiated');
              }
            } catch (error) {
              Logger.error('DASHBOARD', 'Failed to import project', error);
            }
          }}
          onOpenSample={async () => {
            try {
              Logger.info('DASHBOARD', 'Opening sample project');
              const result = await window.electronAPI.projects.createSample();
              if (result.success) {
                Logger.info('DASHBOARD', 'Sample project opened');
                // 프로젝트 목록 새로고침
                loadDashboardData();
              }
            } catch (error) {
              Logger.error('DASHBOARD', 'Failed to open sample project', error);
            }
          }}
          onViewDocs={() => {
            Logger.info('DASHBOARD', 'View documentation');
            // TODO: 문서 페이지로 이동 또는 외부 링크 열기
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

            {loadingStates.projects ? (
              <DashboardSkeleton showKpi={false} showProjects showRecentFiles={false} />
            ) : (
              <div className={DASHBOARD_STYLES.projectList}>
                {projects.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>아직 프로젝트가 없습니다</p>
                    <p className="text-sm">새 프로젝트를 만들어보세요!</p>
                  </div>
                ) : (
                  projects.map((project) => (
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
                  ))
                )}
              </div>
            )}
          </Card>

          {/* 최근 파일 */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">최근 파일</h3>
            </div>

            {loadingStates.recentFiles ? (
              <DashboardSkeleton showKpi={false} showProjects={false} showRecentFiles />
            ) : (
              <div className={DASHBOARD_STYLES.recentFiles}>
                {recentFiles.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>최근 작업한 파일이 없습니다</p>
                    <p className="text-sm">작업을 시작해보세요!</p>
                  </div>
                ) : (
                  recentFiles.map((file) => (
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
                  ))
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
