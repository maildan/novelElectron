'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProjectGrid } from '../../components/projects/ProjectGrid';
import { ProjectCreator, type ProjectCreationData } from '../../components/projects/ProjectCreator';
import { type ProjectData } from '../../components/projects/ProjectCard';
import { Logger } from '../../../shared/logger';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const PROJECTS_PAGE_STYLES = {
  container: 'container mx-auto px-4 py-6 max-w-7xl',
  loading: 'flex items-center justify-center min-h-96',
  loadingText: 'text-lg text-slate-600 dark:text-slate-400',
  error: 'flex flex-col items-center justify-center min-h-96 text-center',
  errorTitle: 'text-xl font-semibold text-red-600 dark:text-red-400 mb-2',
  errorMessage: 'text-slate-600 dark:text-slate-400 mb-4',
  retryButton: 'mt-4',
} as const;

// 🔥 기가차드 규칙: BE 연동을 위한 기본값 (로딩 중 사용)
const DEFAULT_PROJECTS: readonly ProjectData[] = [] as const;

export default function ProjectsPage(): React.ReactElement {
  const router = useRouter(); // 🔥 Navigation 훅 추가
  const searchParams = useSearchParams(); // 🔥 URL 쿼리 파라미터 감지
  const [projects, setProjects] = useState<readonly ProjectData[]>(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreator, setShowCreator] = useState<boolean>(false);

  // 🔥 URL 쿼리 파라미터에서 create=true 감지 시 자동으로 생성 다이얼로그 열기
  useEffect(() => {
    const shouldCreate = searchParams.get('create') === 'true';
    if (shouldCreate) {
      Logger.info('PROJECTS_PAGE', '🚀 Auto-opening project creator from URL parameter');
      setShowCreator(true);
      
      // URL에서 쿼리 파라미터 제거 (깔끔한 URL 유지)
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('create');
      window.history.replaceState({}, '', newUrl.pathname);
    }
  }, [searchParams]);

  // 🔥 기가차드 규칙: 이펙트로 데이터 로딩
  useEffect(() => {
    loadProjects();
  }, []);

  /**
   * 🔥 실제 프로젝트 데이터 로딩 (BE 연동) - 더미 데이터 제거
   */
  const loadProjects = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // 🔥 기가차드 규칙: 타입 안전한 IPC 통신
      const result = await window.electronAPI.projects.getAll();
      
      // 🔥 에러 처리 - IPC 응답 검증
      if (!result.success) {
        throw new Error(result.error || 'Projects API failed');
      }
      
      // 🔥 BE 데이터를 FE 형식으로 변환
      const projectsData = convertToProjectData(result.data || []);
      setProjects(projectsData);
      
      Logger.info('PROJECTS_PAGE', `✅ Loaded ${projectsData.length} projects successfully`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로젝트를 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      Logger.error('PROJECTS_PAGE', '❌ Failed to load projects', err);
      // 🔥 에러 시에도 기본값 사용
      setProjects(DEFAULT_PROJECTS);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔥 BE 데이터를 FE ProjectData 타입으로 변환
   */
  const convertToProjectData = (backendProjects: any[]): readonly ProjectData[] => {
    return backendProjects.map(project => ({
      id: project.id || '',
      title: project.title || '제목 없음',
      description: project.description || '',
      status: project.status || 'draft',
      progress: project.progress || 0,
      createdAt: project.createdAt ? new Date(project.createdAt) : new Date(),
      updatedAt: project.updatedAt ? new Date(project.updatedAt) : 
                  project.lastModified ? new Date(project.lastModified) : new Date(),
      wordCount: project.wordCount || 0,
      author: project.author || '사용자',
      genre: project.genre || '기타'
    }));
  };

  /**
   * 🔥 실제 프로젝트 생성 (더미 데이터 제거)
   */
  const handleCreateProject = (): void => {
    Logger.info('PROJECTS_PAGE', 'Opening project creator');
    setShowCreator(true);
  };

  /**
   * 🔥 프로젝트 생성 완료 처리 - 플랫폼별 로직 및 DB 연동
   */
  const handleProjectCreated = async (projectData: ProjectCreationData): Promise<void> => {
    try {
      Logger.info('PROJECTS_PAGE', '🚀 Creating new project', projectData);
      
      // 🔥 플랫폼별 처리 로직
      if (projectData.platform === 'import') {
        // 파일 불러오기 플랫폼
        Logger.info('PROJECTS_PAGE', '📁 Importing file for project creation');
        const result = await window.electronAPI.projects.importFile();
        if (result.success && result.data) {
          Logger.info('PROJECTS_PAGE', '✅ Project imported successfully', { projectId: result.data.id });
          // 생성된 프로젝트 에디터로 즉시 이동
          router.push(`/projects/${result.data.id}`);
          return;
        } else {
          throw new Error(result.error || 'Failed to import project');
        }
      } else if (projectData.platform === 'google-docs') {
        // Google Docs 연동 (외부 링크)
        Logger.info('PROJECTS_PAGE', '🌐 Opening Google Docs for external editing');
        await window.electronAPI.shell?.openExternal('https://docs.google.com/document/');
        // Google Docs는 외부이므로 Loop 내에서는 프로젝트를 생성하지 않음
        return;
      }
      
      // Loop Editor - 실제 Prisma DB에 프로젝트 생성
      const createData = {
        title: projectData.title,
        description: projectData.description,
        genre: projectData.genre,
        content: projectData.content || '새 프로젝트를 시작해보세요...\n\n',
        progress: 0,
        wordCount: 0,
        status: 'active' as const,
        author: '사용자', // TODO: 실제 사용자 정보 연동
        platform: projectData.platform,
        updatedAt: new Date(),
      };

      const result = await window.electronAPI.projects.create(createData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create project');
      }

      Logger.info('PROJECTS_PAGE', '✅ Project created successfully in DB', { id: result.data?.id });
      
      // 🔥 프로젝트 목록 새로고침
      await loadProjects();
      
      // 🔥 생성된 프로젝트 에디터로 즉시 이동 (Google Docs 스타일)
      if (result.data?.id) {
        Logger.info('PROJECTS_PAGE', '🚀 Navigating to new project editor', { id: result.data.id });
        router.push(`/projects/${result.data.id}`);
        return; // 성공적으로 이동했으므로 여기서 종료
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로젝트 생성 중 오류가 발생했습니다.';
      Logger.error('PROJECTS_PAGE', '❌ Failed to create project', err);
      alert(errorMessage);
    }
  };

  const handleViewProject = (project: ProjectData): void => {
    Logger.info('PROJECTS_PAGE', `🔍 View project: ${project.id}`, { title: project.title });
    // 🔥 프로젝트 에디터로 이동 (보기 = 편집과 동일한 페이지)
    router.push(`/projects/${project.id}`);
  };

  const handleEditProject = (project: ProjectData): void => {
    Logger.info('PROJECTS_PAGE', `✏️ Edit project: ${project.id}`, { title: project.title });
    // 🔥 프로젝트 에디터로 이동
    router.push(`/projects/${project.id}`);
  };

  const handleShareProject = (project: ProjectData): void => {
    Logger.info('PROJECTS_PAGE', `Share project: ${project.id}`, { title: project.title });
    // TODO: 프로젝트 공유 다이얼로그 열기
    alert(`프로젝트 공유: ${project.title}`);
  };

  const handleDeleteProject = (project: ProjectData): void => {
    Logger.info('PROJECTS_PAGE', `Delete project requested: ${project.id}`, { title: project.title });
    // TODO: 삭제 확인 다이얼로그 후 프로젝트 삭제
    const confirmed = confirm(`정말로 "${project.title}" 프로젝트를 삭제하시겠습니까?`);
    if (confirmed) {
      setProjects(prev => prev.filter(p => p.id !== project.id));
      Logger.info('PROJECTS_PAGE', `Project deleted: ${project.id}`);
    }
  };

  const handleRetry = (): void => {
    Logger.info('PROJECTS_PAGE', 'Retry loading projects');
    setError(null);
    // 컴포넌트 리마운트 효과로 useEffect 재실행
    setLoading(true);
  };

  if (loading) {
    return (
      <div className={PROJECTS_PAGE_STYLES.container}>
        <div className={PROJECTS_PAGE_STYLES.loading}>
          <div className={PROJECTS_PAGE_STYLES.loadingText}>
            프로젝트를 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={PROJECTS_PAGE_STYLES.container}>
        <div className={PROJECTS_PAGE_STYLES.error}>
          <h2 className={PROJECTS_PAGE_STYLES.errorTitle}>오류 발생</h2>
          <p className={PROJECTS_PAGE_STYLES.errorMessage}>{error}</p>
          <button 
            onClick={handleRetry}
            className={PROJECTS_PAGE_STYLES.retryButton}
            type="button"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={PROJECTS_PAGE_STYLES.container}>
      <ProjectGrid
        projects={projects}
        onCreateProject={handleCreateProject}
        onViewProject={handleViewProject}
        onEditProject={handleEditProject}
        onShareProject={handleShareProject}
        onDeleteProject={handleDeleteProject}
      />
      
      {/* 🔥 프로젝트 생성 모달 */}
      <ProjectCreator
        isOpen={showCreator}
        onClose={() => setShowCreator(false)}
        onCreate={handleProjectCreated}
      />
    </div>
  );
}
