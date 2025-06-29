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

// 🔥 기가차드 규칙: 임시 목 데이터 (실제 구현 시 IPC 통신으로 대체)
const MOCK_PROJECTS: readonly ProjectData[] = [
  {
    id: '1',
    title: 'Loop 개발 문서',
    description: 'Loop 프로젝트의 기술 문서와 API 명세를 작성하는 프로젝트입니다. TypeScript, React, Electron 관련 내용을 포함합니다.',
    status: 'active',
    progress: 75.5,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    wordCount: 15420,
    author: '개발팀',
    genre: '기술문서'
  },
  {
    id: '2',
    title: '소설: 디지털 세상의 모험',
    description: '미래 사이버펑크 세계를 배경으로 한 SF 소설입니다. 인공지능과 인간의 공존을 다룹니다.',
    status: 'completed',
    progress: 100,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-10'),
    wordCount: 89500,
    author: '김작가',
    genre: 'SF소설'
  },
  {
    id: '3',
    title: '마케팅 기획서',
    description: '2024년 상반기 제품 런칭을 위한 통합 마케팅 전략 문서입니다.',
    status: 'paused',
    progress: 45.2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-18'),
    wordCount: 8750,
    author: '마케팅팀',
    genre: '기획서'
  },
  {
    id: '4',
    title: '개인 일기',
    description: '매일의 생각과 경험을 기록하는 개인 일기장입니다.',
    status: 'active',
    progress: 30.8,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-21'),
    wordCount: 12300,
    author: '사용자',
    genre: '일기'
  },
  {
    id: '5',
    title: '프레젠테이션 스크립트',
    description: '투자자 미팅을 위한 제품 소개 프레젠테이션 발표 스크립트입니다.',
    status: 'draft',
    progress: 15.0,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
    wordCount: 2100,
    author: 'CEO',
    genre: '발표자료'
  }
] as const;

export default function ProjectsPage(): React.ReactElement {
  const [projects, setProjects] = useState<readonly ProjectData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 기가차드 규칙: 이펙트로 데이터 로딩
  useEffect(() => {
    const loadProjects = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        // TODO: 실제 구현 시 IPC 통신으로 대체
        // const result = await window.electronAPI.getProjects();
        
        // 임시 로딩 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProjects(MOCK_PROJECTS);
        Logger.info('PROJECTS_PAGE', `Loaded ${MOCK_PROJECTS.length} projects`);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '프로젝트를 불러오는 중 오류가 발생했습니다.';
        setError(errorMessage);
        Logger.error('PROJECTS_PAGE', 'Failed to load projects', err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

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
