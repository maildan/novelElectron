'use client';

import React, { useEffect } from 'react';
import { Logger } from '../../../shared/logger';

// 🔥 모듈화된 컴포넌트들
import { EditorProvider } from './editor/EditorProvider';
import { MarkdownEditor } from './editor/MarkdownEditor';
import { WriterToolbar } from './editor/WriterToolbar';
import { WriterSidebar } from './editor/WriterSidebar';
import { WriterStatsPanel } from './editor/WriterStatsPanel';

// 🔥 커스텀 hooks
import { useProjectData } from './hooks/useProjectData';
import { useUIState } from './hooks/useUIState';
import { useKeyboardShortcuts, useProjectActions } from './hooks/useProjectActions';

// EasyMDE CSS는 별도로 로드
import 'easymde/dist/easymde.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export interface ProjectEditorProps {
  projectId: string;
}

// 작가용 Ulysses/Scrivener 스타일 테마
const WRITER_EDITOR_STYLES = {
  // 전체 레이아웃
  container: 'h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200',
  
  // 작가 중심 메인 영역
  main: 'flex flex-1 overflow-hidden',
  
  // 에디터 영역 (Google Docs 스타일)
  editorContainer: 'flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-900',
} as const;

export function ProjectEditor({ projectId }: ProjectEditorProps): React.ReactElement {
  // 🔥 커스텀 hooks 사용
  const projectData = useProjectData(projectId);
  const uiState = useUIState();
  const projectActions = useProjectActions({
    projectId,
    saveProject: projectData.saveProject,
    title: projectData.title,
    content: projectData.content
  });

  // 🔥 키보드 단축키 설정
  useKeyboardShortcuts({
    saveProject: projectData.saveProject,
    toggleFocusMode: uiState.toggleFocusMode,
    setShowHeader: uiState.setShowHeader,
    isFocusMode: uiState.isFocusMode
  });

  // 🔥 프로젝트 로드 (기가차드 수정: dependency 정리)
  useEffect(() => {
    projectData.loadProject();
    return () => {
      // 정리 작업 없음 (다른 hooks에서 처리)
    };
  }, [projectId, projectData.loadProject]); // 🔥 dependency 추가

  Logger.debug('PROJECT_EDITOR', 'Rendering with state', {
    projectId,
    titleLength: projectData.title.length,
    contentLength: projectData.content.length,
    showLeftSidebar: uiState.showLeftSidebar,
    showRightSidebar: uiState.showRightSidebar,
    isFocusMode: uiState.isFocusMode
  });

  return (
    <EditorProvider>
      <div className={WRITER_EDITOR_STYLES.container}>
        {/* 헤더 (포커스 모드에서 숨김) */}
        <WriterToolbar
          title={projectData.title}
          onTitleChange={projectData.setTitle}
          onBack={projectActions.handleBack}
          onSave={projectData.saveProject}
          onShare={projectActions.handleShare}
          onDownload={projectActions.handleDownload}
          toggleDarkMode={uiState.toggleDarkMode}
          toggleFocusMode={uiState.toggleFocusMode}
          toggleLeftSidebar={uiState.toggleLeftSidebar}
          toggleRightSidebar={uiState.toggleRightSidebar}
          isDarkMode={uiState.isDarkMode}
          isFocusMode={uiState.isFocusMode}
          showLeftSidebar={uiState.showLeftSidebar}
          showRightSidebar={uiState.showRightSidebar}
          showHeader={uiState.showHeader}
          saveStatus={projectData.saveStatus}
          lastSaved={projectData.lastSaved}
        />
        
        {/* 메인 컨텐츠 영역 */}
        <div className={WRITER_EDITOR_STYLES.main}>
          {/* 좌측 사이드바 (작가 도구) */}
          <WriterSidebar
            showLeftSidebar={uiState.showLeftSidebar}
            toggleLeftSidebar={uiState.toggleLeftSidebar}
            structure={projectData.structure}
            characters={projectData.characters}
            onAddStructure={() => {
              Logger.info('PROJECT_EDITOR', 'Add structure requested');
              // TODO: 구조 추가 모달 구현
            }}
            onAddCharacter={() => {
              Logger.info('PROJECT_EDITOR', 'Add character requested');
              // TODO: 캐릭터 추가 모달 구현
            }}
            onAddNote={() => {
              Logger.info('PROJECT_EDITOR', 'Add note requested');
              // TODO: 메모 추가 모달 구현
            }}
          />
          
          {/* 에디터 영역 */}
          <div className={WRITER_EDITOR_STYLES.editorContainer}>
            <MarkdownEditor
              content={projectData.content}
              onChange={projectData.setContent}
              isFocusMode={uiState.isFocusMode}
            />
          </div>
          
          {/* 우측 사이드바 (통계 & AI) */}
          <WriterStatsPanel
            showRightSidebar={uiState.showRightSidebar}
            toggleRightSidebar={uiState.toggleRightSidebar}
            writerStats={projectData.writerStats}
            setWordGoal={projectData.setWordGoal}
          />
        </div>
      </div>
    </EditorProvider>
  );
}

export default ProjectEditor;
