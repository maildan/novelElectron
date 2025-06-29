'use client';

import React, { useState, useEffect } from 'react';
import { ProjectGrid } from '../../components/projects/ProjectGrid';
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
  const [projects, setProjects] = useState<readonly ProjectData[]>(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 기가차드 규칙: 이펙트로 데이터 로딩
  useEffect(() => {
    loadProjects();
  }, []);

  /**
   * 🔥 실제 프로젝트 데이터 로딩 (BE 연동)
   */
  const loadProjects = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // 🔥 기가차드 규칙: IPC 통신으로 실제 데이터 가져오기
      const result = await window.electronAPI?.projects?.getAll?.();
      
      if (result?.success && result.data) {
        // BE 데이터를 FE 형식으로 변환
        const projectsData = convertToProjectData(result.data);
        setProjects(projectsData);
        Logger.info('PROJECTS_PAGE', `Loaded ${projectsData.length} projects`);
      } else {
        // 🔥 IPC API가 없거나 실패한 경우 기본값 사용
        Logger.warn('PROJECTS_PAGE', 'IPC API not available, showing empty projects');
        setProjects(DEFAULT_PROJECTS);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로젝트를 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      Logger.error('PROJECTS_PAGE', 'Failed to load projects', err);
      // 에러 시에도 기본값 사용
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
      updatedAt: project.lastModified ? new Date(project.lastModified) : new Date(),
      wordCount: project.wordCount || 0,
      author: project.author || '사용자',
      genre: project.genre || '기타'
    }));
  };

  const handleCreateProject = (): void => {
    Logger.info('PROJECTS_PAGE', 'Create project requested');
    // TODO: 새 프로젝트 생성 다이얼로그 또는 페이지로 이동
    alert('새 프로젝트 생성 기능을 구현 중입니다.');
  };

  const handleViewProject = (project: ProjectData): void => {
    Logger.info('PROJECTS_PAGE', `View project: ${project.id}`, { title: project.title });
    // TODO: 프로젝트 상세 페이지로 이동
    alert(`프로젝트 보기: ${project.title}`);
  };

  const handleEditProject = (project: ProjectData): void => {
    Logger.info('PROJECTS_PAGE', `Edit project: ${project.id}`, { title: project.title });
    // TODO: 프로젝트 편집 페이지로 이동
    alert(`프로젝트 편집: ${project.title}`);
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
    </div>
  );
}
