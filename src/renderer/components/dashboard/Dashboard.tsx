'use client';

import { useState, useEffect } from 'react';
import { CommonComponentProps, ProjectData, RecentFile } from '../../../shared/types';
import { TypingBox } from './TypingBox';
import { useDashboardIpc } from '../../hooks/useDashboardIpc';
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
} from 'lucide-react';

interface MonitoringData {
  wpm: number;
  words: number;
  time: number;
}

export function Dashboard({ logs, loading, onTypingComplete }: CommonComponentProps) {
  const [monitoringData, setMonitoringData] = useState<MonitoringData>({
    wpm: 0,
    words: 0,
    time: 0,
  });
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [recentLogs, setRecentLogs] = useState(logs);
  const [activeProjects, setActiveProjects] = useState<ProjectData[]>([]);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);

  // 🔥 실제 IPC 백엔드 연결
  const {
    isMonitoringActive,
    loading: ipcLoading,
    startMonitoring,
    stopMonitoring,
    getRecentLogs,
    getStats,
    saveTypingLog,
  } = useDashboardIpc();

  // 실시간 모니터링 데이터 업데이트 (TODO: IPC 이벤트 리스너로 교체)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMonitoringActive) {
      interval = setInterval(() => {
        setMonitoringData((prev) => ({
          wpm: Math.floor(Math.random() * 20) + 50,
          words: prev.words + Math.floor(Math.random() * 3),
          time: prev.time + 1,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMonitoringActive]);

  // 최근 데이터 로드 (프로젝트, 파일, 로그)
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // 최근 로그 로드
        const logsResponse = await getRecentLogs(5);
        if (logsResponse.success && logsResponse.data) {
          setRecentLogs(logsResponse.data);
        }

        // TODO: 실제 프로젝트 데이터 로드 (현재는 임시 데이터)
        setActiveProjects([
          { 
            id: '1', 
            title: '시간의 강', 
            progress: 67, 
            status: '진행중', 
            deadline: '12월 31일',
            description: '시간과 기억에 대한 소설',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date()
          },
          { 
            id: '2', 
            title: '일상의 철학', 
            progress: 30, 
            status: '초안', 
            deadline: '1월 15일',
            description: '일상 속에서 찾는 철학적 사유',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date()
          },
        ]);

        // TODO: 실제 최근 파일 데이터 로드 (현재는 임시 데이터)
        setRecentFiles([
          { 
            id: '1', 
            name: "chapter-12.md", 
            project: "시간의 강", 
            time: "2분 전", 
            status: "수정됨",
            path: "/Users/user/Documents/시간의강/chapter-12.md",
            lastModified: new Date(Date.now() - 2 * 60 * 1000)
          },
          { 
            id: '2', 
            name: "intro.md", 
            project: "일상의 철학", 
            time: "1시간 전", 
            status: "저장됨",
            path: "/Users/user/Documents/일상의철학/intro.md",
            lastModified: new Date(Date.now() - 60 * 60 * 1000)
          },
          { 
            id: '3', 
            name: "outline.md", 
            project: "도시 이야기", 
            time: "3시간 전", 
            status: "동기화됨",
            path: "/Users/user/Documents/도시이야기/outline.md",
            lastModified: new Date(Date.now() - 3 * 60 * 60 * 1000)
          },
        ]);

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [getRecentLogs]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      {/* AI 패널 */}
      {aiPanelOpen && (
        <div className="fixed top-4 right-4 w-80 bg-white shadow-xl border border-slate-200 z-50 max-h-[80vh] overflow-hidden rounded-lg">
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
              <br />• &quot;오늘 작성할 내용 아이디어 줘&quot;
              <br />• &quot;이 문단을 더 매력적으로 써줘&quot;
              <br />• &quot;캐릭터 설정 도움이 필요해&quot;
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
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                aiPanelOpen 
                  ? "bg-purple-700 text-white hover:bg-purple-800" 
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Loop AI
            </button>

            <button
              onClick={() => isMonitoringActive ? stopMonitoring() : startMonitoring()}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isMonitoringActive 
                  ? "bg-red-600 text-white hover:bg-red-700" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isMonitoringActive ? (
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
        {isMonitoringActive && (
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

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-300 rounded-lg p-6 h-[120px] flex items-center justify-center cursor-pointer transition-colors">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">새 프로젝트 시작</h3>
              <p className="text-sm text-slate-600">새로운 창작을 시작하세요</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 hover:border-green-300 rounded-lg p-4 h-[120px] flex flex-col justify-between cursor-pointer transition-colors">
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

            <div className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg p-4 h-[120px] flex flex-col justify-between cursor-pointer transition-colors">
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

            <div className="bg-purple-50 border border-purple-200 hover:border-purple-300 rounded-lg p-4 h-[120px] flex flex-col justify-between cursor-pointer transition-colors">
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
              {activeProjects.map((project: ProjectData, index: number) => (
                <div key={project.id} className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
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
              {recentFiles.map((file: RecentFile, index: number) => (
                <div
                  key={file.id}
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

        {/* 🔥 실제 로그 데이터 섹션 - 기가차드 */}
        {logs.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-900">최근 타이핑 기록</h3>
              </div>
              <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors">
                전체 보기
              </button>
            </div>
            <div className="space-y-3">
              {logs.slice(0, 5).map((log, index) => (
                <div key={log.id || index} className="group flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate mb-1">
                      {log.content.substring(0, 50)}...
                    </p>
                    <div className="flex items-center gap-6 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>타자: {log.keyCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>시간: {log.typingTime}초</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>타수: {log.typingTime > 0 ? Math.round((log.keyCount / log.typingTime) * 60) : 0}타/분</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                    <div className="text-xs text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for New Users */}
        {logs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-10 w-10 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              타이핑을 시작해보세요!
            </h3>
            <p className="text-gray-600 mb-4">
              첫 번째 타이핑 세션을 시작하면 여기에 기록이 표시됩니다.
            </p>
            <button 
              onClick={() => startMonitoring()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play className="w-4 h-4 mr-2 inline" />
              모니터링 시작
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
