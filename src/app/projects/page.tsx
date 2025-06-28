'use client';

import { useState, useEffect } from 'react';

// 🔥 기가차드 프리컴파일된 스타일
const PROJECTS_STYLES = {
  container: 'flex h-screen bg-gray-50',
  sidebar: 'w-64 bg-white border-r border-gray-200 flex flex-col',
  sidebarHeader: 'p-6 border-b border-gray-200',
  sidebarNav: 'flex-1 p-4',
  sidebarItem: 'flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 text-gray-700 hover:bg-gray-100 hover:text-blue-600 cursor-pointer',
  sidebarItemActive: 'flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 bg-blue-50 text-blue-600 border-r-2 border-blue-600',
  main: 'flex-1 flex flex-col',
  header: 'bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between',
  content: 'flex-1 p-6 overflow-auto',
  projectGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  projectCard: 'bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer',
  projectHeader: 'flex justify-between items-start mb-4',
  projectTitle: 'text-lg font-semibold text-gray-900',
  projectMenu: 'text-gray-400 hover:text-gray-600 cursor-pointer',
  projectDescription: 'text-sm text-gray-600 mb-4',
  projectMeta: 'flex justify-between items-center text-sm text-gray-500 mb-3',
  projectProgress: 'w-full bg-gray-200 rounded-full h-2 mb-3',
  projectProgressFill: 'bg-blue-600 h-2 rounded-full transition-all duration-300',
  projectActions: 'flex justify-between items-center pt-3 border-t border-gray-100',
  actionButton: 'px-3 py-1 text-xs font-medium rounded-md',
  viewButton: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  editButton: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  deleteButton: 'bg-red-100 text-red-700 hover:bg-red-200',
  createButton: 'bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors',
  emptyState: 'text-center py-12',
  emptyIcon: 'text-6xl mb-4',
  emptyTitle: 'text-xl font-medium text-gray-900 mb-2',
  emptyText: 'text-gray-600 mb-6',
} as const;

// 🔥 사이드바 아이템 정의
const sidebarItems = [
  { id: 'dashboard', label: '대시보드', icon: '📊', href: '/', active: false },
  { id: 'analytics', label: '분석', icon: '📈', href: '/analytics', active: false },
  { id: 'projects', label: '프로젝트', icon: '📁', href: '/projects', active: true },
  { id: 'ai', label: 'Loop AI', icon: '✨', href: '/ai', active: false },
  { id: 'settings', label: '설정', icon: '⚙️', href: '/settings', active: false },
] as const;

interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  lastModified: string;
  sessions: number;
  wpm: number;
  timeSpent: string;
  status: 'active' | 'completed' | 'paused';
}

export default function Projects(): React.JSX.Element {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'React 대시보드 프로젝트',
      description: 'TypeScript와 React를 사용한 관리자 대시보드 개발',
      progress: 75,
      lastModified: '2024-01-15',
      sessions: 23,
      wpm: 85,
      timeSpent: '12.5h',
      status: 'active',
    },
    {
      id: '2',
      title: 'API 문서 작성',
      description: 'RESTful API 엔드포인트 문서화 및 예제 작성',
      progress: 45,
      lastModified: '2024-01-14',
      sessions: 15,
      wpm: 78,
      timeSpent: '8.2h',
      status: 'active',
    },
    {
      id: '3',
      title: '블로그 포스트 시리즈',
      description: 'JavaScript 최신 기능에 대한 기술 블로그 연재',
      progress: 90,
      lastModified: '2024-01-13',
      sessions: 18,
      wpm: 92,
      timeSpent: '15.7h',
      status: 'active',
    },
    {
      id: '4',
      title: '사용자 매뉴얼 번역',
      description: '영문 사용자 매뉴얼의 한국어 번역 작업',
      progress: 100,
      lastModified: '2024-01-10',
      sessions: 32,
      wpm: 88,
      timeSpent: '24.3h',
      status: 'completed',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('all');

  useEffect(() => {
    // API 사용 가능 확인
    if (typeof window !== 'undefined' && window.electronAPI) {
      console.log('🔥 Projects Electron API 연결 성공!');
      // 실제 프로젝트 데이터 로드
      loadProjectsData();
    } else {
      console.warn('⚠️ Electron API 없음 - 더미 데이터 사용');
    }
  }, []);

  const loadProjectsData = async (): Promise<void> => {
    try {
      // 실제 프로젝트 데이터 로드 로직
      const sessionsResult = await window.electronAPI.database.getSessions();
      if (sessionsResult.success && sessionsResult.data) {
        // 세션 데이터를 프로젝트별로 그룹화
        console.log('📁 프로젝트 데이터 로드 완료');
      }
    } catch (error) {
      console.error('❌ 프로젝트 데이터 로드 실패:', error);
    }
  };

  const filteredProjects = projects.filter(project => 
    filter === 'all' || project.status === filter
  );

  const getStatusColor = (status: Project['status']): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Project['status']): string => {
    switch (status) {
      case 'active': return '진행중';
      case 'completed': return '완료';
      case 'paused': return '일시정지';
      default: return '알 수 없음';
    }
  };

  const handleCreateProject = (): void => {
    console.log('🆕 새 프로젝트 생성');
    // 프로젝트 생성 모달 또는 페이지로 이동
  };

  const handleProjectAction = (projectId: string, action: 'view' | 'edit' | 'delete'): void => {
    console.log(`📁 프로젝트 ${action}:`, projectId);
    
    switch (action) {
      case 'view':
        // 프로젝트 상세 보기
        break;
      case 'edit':
        // 프로젝트 편집
        break;
      case 'delete':
        // 프로젝트 삭제
        setProjects(prev => prev.filter(p => p.id !== projectId));
        break;
    }
  };

  return (
    <div className={PROJECTS_STYLES.container}>
      {/* 🔥 사이드바 */}
      <div className={PROJECTS_STYLES.sidebar}>
        <div className={PROJECTS_STYLES.sidebarHeader}>
          <h1 className="text-xl font-bold text-gray-900">Loop</h1>
          <p className="text-sm text-gray-600">Typing Analytics</p>
        </div>
        
        <nav className={PROJECTS_STYLES.sidebarNav}>
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={item.active ? PROJECTS_STYLES.sidebarItemActive : PROJECTS_STYLES.sidebarItem}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
      </div>

      {/* 🔥 메인 컨텐츠 */}
      <div className={PROJECTS_STYLES.main}>
        {/* 헤더 */}
        <div className={PROJECTS_STYLES.header}>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">프로젝트</h2>
            <p className="text-gray-600">타이핑 프로젝트 관리</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">전체</option>
              <option value="active">진행중</option>
              <option value="completed">완료</option>
              <option value="paused">일시정지</option>
            </select>
            
            <button
              className={PROJECTS_STYLES.createButton}
              onClick={handleCreateProject}
            >
              + 새 프로젝트
            </button>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className={PROJECTS_STYLES.content}>
          {filteredProjects.length === 0 ? (
            // 빈 상태
            <div className={PROJECTS_STYLES.emptyState}>
              <div className={PROJECTS_STYLES.emptyIcon}>📁</div>
              <h3 className={PROJECTS_STYLES.emptyTitle}>프로젝트가 없습니다</h3>
              <p className={PROJECTS_STYLES.emptyText}>
                첫 번째 타이핑 프로젝트를 만들어보세요
              </p>
              <button
                className={PROJECTS_STYLES.createButton}
                onClick={handleCreateProject}
              >
                프로젝트 만들기
              </button>
            </div>
          ) : (
            // 프로젝트 그리드
            <div className={PROJECTS_STYLES.projectGrid}>
              {filteredProjects.map((project) => (
                <div key={project.id} className={PROJECTS_STYLES.projectCard}>
                  {/* 프로젝트 헤더 */}
                  <div className={PROJECTS_STYLES.projectHeader}>
                    <h3 className={PROJECTS_STYLES.projectTitle}>{project.title}</h3>
                    <span className={PROJECTS_STYLES.projectMenu}>⋯</span>
                  </div>

                  {/* 프로젝트 설명 */}
                  <p className={PROJECTS_STYLES.projectDescription}>
                    {project.description}
                  </p>

                  {/* 메타 정보 */}
                  <div className={PROJECTS_STYLES.projectMeta}>
                    <span>세션: {project.sessions}</span>
                    <span>WPM: {project.wpm}</span>
                    <span>{project.timeSpent}</span>
                  </div>

                  {/* 진행률 바 */}
                  <div className={PROJECTS_STYLES.projectProgress}>
                    <div 
                      className={PROJECTS_STYLES.projectProgressFill}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  {/* 상태 및 날짜 */}
                  <div className="flex justify-between items-center mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                    <span className="text-xs text-gray-500">{project.lastModified}</span>
                  </div>

                  {/* 액션 버튼들 */}
                  <div className={PROJECTS_STYLES.projectActions}>
                    <div className="flex space-x-2">
                      <button
                        className={`${PROJECTS_STYLES.actionButton} ${PROJECTS_STYLES.viewButton}`}
                        onClick={() => handleProjectAction(project.id, 'view')}
                      >
                        보기
                      </button>
                      <button
                        className={`${PROJECTS_STYLES.actionButton} ${PROJECTS_STYLES.editButton}`}
                        onClick={() => handleProjectAction(project.id, 'edit')}
                      >
                        편집
                      </button>
                    </div>
                    <button
                      className={`${PROJECTS_STYLES.actionButton} ${PROJECTS_STYLES.deleteButton}`}
                      onClick={() => handleProjectAction(project.id, 'delete')}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
