'use client';

import { useState, useEffect } from 'react';
import { formatTime, safeAsync } from '../../shared/utils';
import { Log, TypingStats } from '@shared/types';
import logger from '../../shared/logger';
import { commonStyles, combineStyles } from '../../shared/styles';
import { useAsync, useToggle } from '../../shared/hooks';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Plus, 
  CheckCircle,
  Globe,
  Cloud,
  FileText,
  Clock,
  Target,
  MoreHorizontal 
} from '../../shared/icons';

// #DEBUG: 공통 모듈 import
import { 
  CommonComponentProps,
  COMMON_STYLES,
  getCardClassName,
  getButtonClassName,
  PerformanceTimer,
  measureMemory
} from '../common/common';

// #DEBUG: 타입 정의를 inline으로 임시 정의
interface MonitoringData {
  wpm: number;
  words: number;
  time: number;
}

interface RecentFile {
  id: string;
  name: string;
  path: string;
  type: string;
  project: string;
  time: string;
  status: 'completed' | 'active' | 'draft' | 'archived';
  lastModified: Date;
}

interface ActiveProject {
  id: string;
  title: string;
  progress: number;
  status: 'in-progress' | 'completed' | 'paused';
  deadline: string;
}

export function Dashboard({ logs, loading, onTypingComplete }: CommonComponentProps) {
  // #DEBUG: Dashboard 컴포넌트 진입점
  const timer = new PerformanceTimer('Dashboard 렌더링');
  measureMemory('Dashboard 시작');

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringData, setMonitoringData] = useState<MonitoringData>({
    wpm: 0,
    words: 0,
    time: 0,
  });
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  // 실시간 모니터링 시뮬레이션 (TODO: Replace with actual IPC)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMonitoring) {
      interval = setInterval(() => {
        setMonitoringData((prev) => ({
          wpm: Math.floor(Math.random() * 20) + 50,
          words: prev.words + Math.floor(Math.random() * 3),
          time: prev.time + 1,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring]);

  // 🔥 실제 데이터 상태 관리 - 더미 데이터 박멸
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>([]);

  // 🔥 실제 파일 & 프로젝트 데이터 로드
  useEffect(() => {
    const loadDashboardData = async () => {
      logger.debug('Dashboard: loadDashboardData 시작');
      try {
        if (typeof window !== 'undefined' && window.electronAPI) {
          const sessionsData = await window.electronAPI.database.getSessions();
          const analyticsData = await window.electronAPI.invoke('database:get-analytics', 'latest');

          // 공통 유틸리티로 변환 - 타입 호환성 보장
          const recentFilesData: RecentFile[] = sessionsData.slice(0, 3).map((session, index) => ({
            id: (session.id || session.sessionId || `session-${Date.now()}-${index}`) as string,
            name: `문서 ${index + 1}`,
            path: `/sessions/${session.id || session.sessionId}`,
            type: 'document',
            project: session.content?.substring(0, 20) + "..." || "타이핑 세션",
            time: session.timestamp ? new Date(session.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString(),
            status: session.wpm >= 60 ? 'completed' as const : 
                   session.wpm >= 40 ? 'active' as const : 
                   session.wpm >= 20 ? 'draft' as const : 'archived' as const,
            lastModified: session.timestamp ? new Date(session.timestamp) : new Date(),
          }));

          // 활성 프로젝트를 세션 통계로 변환
          const projectsData: ActiveProject[] = [
            { 
              id: 'typing-sessions',
              title: "타이핑 세션", 
              progress: Math.min(sessionsData.length * 10, 100), 
              status: "in-progress" as const, 
              deadline: "진행중" 
            },
            { 
              id: 'analytics-data',
              title: "분석 데이터", 
              progress: analyticsData ? 80 : 20, 
              status: "in-progress" as const, 
              deadline: "실시간" 
            }
          ];

          setRecentFiles(recentFilesData);
          setActiveProjects(projectsData);
        }
      } catch (error) {
        logger.error(`대시보드 데이터 로딩 실패: ${error}`);
        setRecentFiles([]);
        setActiveProjects([]);
      }
      logger.info('loadDashboardData 완료');
    };

    loadDashboardData();
  }, []);

  return (  
    <div className="flex-1 flex flex-col bg-slate-50">
      {/* AI 패널 */}
      {aiPanelOpen && (
        <div className={`${COMMON_STYLES.layout.fixedPanel} ${COMMON_STYLES.card.variants.panel} rounded-lg`}>
          <div className="bg-purple-600 text-white flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-semibold">Loop AI</h3>
            </div>
            <button
              onClick={() => setAiPanelOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded"
            >
              ×
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md">
              💡 <strong>추천 질문:</strong>
              <br />• &ldquo;오늘 작성할 내용 아이디어 줘&rdquo;
              <br />• &ldquo;이 문단을 더 매력적으로 써줘&rdquo;
              <br />• &ldquo;캐릭터 설정 도움이 필요해&rdquo;
            </div>
            <textarea
              placeholder="질문을 입력하세요..."
              className="w-full min-h-[80px] p-3 border border-slate-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
              질문하기
            </button>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div className="bg-white border-b border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">대시보드</h1>
            <p className="text-slate-600 mt-1">오늘의 창작을 시작하세요</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAiPanelOpen(!aiPanelOpen)}
              className={getButtonClassName({ 
                variant: aiPanelOpen ? 'purple' : 'purple',
                className: aiPanelOpen ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'
              })}
            >
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Loop AI
            </button>

            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={getButtonClassName({ 
                variant: isMonitoring ? 'danger' : 'primary'
              })}
            >
              {isMonitoring ? (
                <>
                  <Pause className="w-4 h-4 mr-2 inline" />
                  중지
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2 inline" />
                  시작
                </>
              )}
            </button>

            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-md">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* 모니터링 패널 */}
        {isMonitoring && (
          <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <h2 className="text-lg font-semibold">실시간 모니터링</h2>
              </div>
              <div className="font-mono text-lg">{formatTime(monitoringData.time)}</div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold">{monitoringData.wpm}</div>
                <div className="text-blue-200 text-sm">분당 단어</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{monitoringData.words}</div>
                <div className="text-blue-200 text-sm">총 단어</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {monitoringData.time > 0 ? Math.round(monitoringData.words / (monitoringData.time / 60)) : 0}
                </div>
                <div className="text-blue-200 text-sm">평균 속도</div>
              </div>
            </div>
          </div>
        )}

        {/* 빠른 시작 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">빠른 시작</h2>

          <div className={getCardClassName({ variant: 'blue', className: 'h-[120px] flex items-center justify-center cursor-pointer transition-colors' })}>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">새 프로젝트 시작</h3>
              <p className="text-sm text-slate-600">새로운 창작을 시작하세요</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className={getCardClassName({ variant: 'green', className: COMMON_STYLES.layout.cardGrid })}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <Globe className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Google Docs</h3>
                <p className="text-sm text-slate-600 mb-2">문서 동기화</p>
                <div className="text-xs text-green-700 font-medium">마지막 동기화: 2분 전</div>
              </div>
            </div>

            <div className={getCardClassName({ variant: 'slate', className: COMMON_STYLES.layout.cardGrid })}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-slate-600" />
                <Cloud className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Loop 클라우드</h3>
                <p className="text-sm text-slate-600 mb-2">백업 동기화</p>
                <div className="text-xs text-slate-700 font-medium">마지막 백업: 5분 전</div>
              </div>
            </div>

            <div className={getCardClassName({ variant: 'purple', className: COMMON_STYLES.layout.cardGrid })}>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">최근 파일</h3>
                <p className="text-sm text-slate-600 mb-2">작업 이어가기</p>
                <div className="text-xs text-purple-700 font-medium">3개 파일 대기 중</div>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-900">활성 프로젝트</h3>
            </div>

            <div className="space-y-4">
              {activeProjects.map((project, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-900">{project.title}</h4>
                    <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                      {project.status}
                    </span>
                  </div>
                  <div className="bg-slate-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">{project.progress}% 완료</span>
                    <span className="text-xs text-slate-500">목표: {project.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-slate-900">최근 파일</h3>
            </div>

            <div className="space-y-2">
              {recentFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-600 mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 text-sm truncate">{file.name}</div>
                    <div className="text-xs text-slate-500">{file.project}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-medium text-slate-700">{file.time}</div>
                    <div className="text-xs text-green-600">{file.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // #DEBUG: Dashboard 컴포넌트 종료점
  timer.end();
  measureMemory('Dashboard 완료');
}

// #DEBUG: 성능 최적화된 Dashboard 컴포넌트 export
// #DEBUG: Dashboard 컴포넌트 export
export default Dashboard;
