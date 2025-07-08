'use client';

import React, { useState, useRef, useCallback, memo, useEffect } from 'react';
import { MarkdownEditor } from './editor/MarkdownEditor';
import { EditorProvider } from './editor/EditorProvider';
import { ShortcutHelp } from './editor/ShortcutHelp';
import { WriterSidebar } from './components/WriterSidebar';
import { ProjectHeader } from './components/ProjectHeader'; // 🔥 새로운 모듈화된 헤더
import { ConfirmDeleteDialog } from './components/ConfirmDeleteDialog';
import { ShareDialog } from './components/ShareDialog';
import { WriteView } from './views/WriteView';
import { StructureView } from './views/StructureView';
import { CharactersView } from './views/CharactersView';
import { NotesView } from './views/NotesView';
import { Logger } from '../../../shared/logger';

// 🔥 실제 hooks import (기가차드 수정)
import { useProjectData } from './hooks/useProjectData';
import { useUIState } from './hooks/useUIState';

// 🔥 기가차드 UI 문제점 해결된 스타일
const WRITER_EDITOR_STYLES = {
  // 전체 레이아웃
  container: 'h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200',
  
  // 헤더 (🔥 nav 중첩 문제 해결)
  header: 'flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700',
  headerLeft: 'flex items-center gap-3',
  headerCenter: 'flex-1 max-w-md mx-auto',
  headerRight: 'flex items-center gap-2',
  
  // 메인 레이아웃
  main: 'flex flex-1 overflow-hidden',
  
  // 🔥 에디터 영역 수정 (한줄 문제, 스크롤 제한 해결)
  editorContainer: 'flex-1 flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-200',
  editorContent: 'flex-1 min-h-0 overflow-hidden', // 🔥 min-h-0 추가로 flex 영역 제대로 잡힘
  
  // UI 컨트롤
  iconButton: 'flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400',
  iconButtonActive: 'flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  titleInput: 'border-none bg-transparent focus:outline-none focus:ring-0 text-lg font-medium w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100',
  
  // 🔥 백 버튼 개선 (중첩 문제 해결)
  backButton: 'flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors',
} as const;

export interface ProjectEditorProps {
  projectId: string;
}

// 🔥 React.memo로 무한 리렌더링 방지 (11원칙: 성능 최적화)
export const ProjectEditor = memo(function ProjectEditor({ projectId }: ProjectEditorProps): React.ReactElement {
  console.log('🔥 ProjectEditor render started', { projectId }); // 🔥 디버그 로그
  
  // 🔥 커스텀 hooks 사용
  const { isLoading, error, ...projectData } = useProjectData(projectId);
  const uiState = useUIState();
  const [currentView, setCurrentView] = useState<string>('write'); // 🔥 실제 뷰 상태 관리
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
  const editorRef = useRef<any>(null);
  const [isEditorReady, setIsEditorReady] = useState<boolean>(false); // 🔥 에디터 준비 상태 추가
  
  // 🔥 에디터 준비 완료 핸들러 (fallback 에디터용)
  const handleEditorReady = useCallback((editor?: any) => {
    if (editor) {
      editorRef.current = editor;
    }
    setIsEditorReady(true); // 🔥 에디터 준비 완료 표시
    Logger.info('PROJECT_EDITOR', 'Editor ready (fallback mode)');
  }, []);

  const handleBack = useCallback(() => window.history.back(), []);
  const handleToggleSidebar = useCallback(() => setCollapsed((prev) => !prev), []);
  
  // 🔥 공유 기능 핸들러
  const handleShare = useCallback(() => {
    setShowShareDialog(true);
    Logger.info('PROJECT_EDITOR', 'Share dialog opened');
  }, []);
  
  // 🔥 삭제 기능 핸들러
  const handleDelete = useCallback(() => {
    setShowDeleteDialog(true);
    Logger.info('PROJECT_EDITOR', 'Delete confirmation dialog opened');
  }, []);
  
  // 🔥 삭제 확인 핸들러
  const handleConfirmDelete = useCallback(async () => {
    try {
      Logger.info('PROJECT_EDITOR', 'Deleting project', { projectId });
      
      const result = await window.electronAPI.projects.delete(projectId);
      
      if (result.success) {
        Logger.info('PROJECT_EDITOR', 'Project deleted successfully');
        setShowDeleteDialog(false);
        // 🔥 삭제 후 대시보드로 이동
        window.history.back();
      } else {
        throw new Error(result.error || 'Failed to delete project');
      }
    } catch (error) {
      Logger.error('PROJECT_EDITOR', 'Failed to delete project', error);
      // TODO: 에러 토스트 표시
    }
  }, [projectId]);
  
  const handleDownload = useCallback(() => Logger.info('PROJECT_EDITOR', 'Download action'), []);
  // 🔥 뷰 변경 핸들러 (실제 구현)
  const handleViewChange = useCallback((view: string) => {
    Logger.info('PROJECT_EDITOR', 'View changed:', view);
    setCurrentView(view);
  }, []);
  const handleToolbarAction = useCallback((action: string) => Logger.info('PROJECT_EDITOR', 'Toolbar action:', action), []);
  
  // 🔥 작가 친화적 키보드 단축키 핸들러
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
    const modKey = ctrlKey || metaKey; // Windows: Ctrl, Mac: Cmd
    
    // 🔥 기본 저장 단축키 (Ctrl+S / Cmd+S)
    if (modKey && key === 's') {
      event.preventDefault();
      projectData.forceSave();
      Logger.info('PROJECT_EDITOR', 'Save shortcut triggered');
      return;
    }
    
    // 🔥 포커스 모드 토글 (Ctrl+F / Cmd+F)
    if (modKey && key === 'f') {
      event.preventDefault();
      uiState.toggleFocusMode();
      Logger.info('PROJECT_EDITOR', 'Focus mode shortcut triggered');
      return;
    }
    
    // 🔥 사이드바 토글 (Ctrl+B / Cmd+B)
    if (modKey && key === 'b') {
      event.preventDefault();
      setCollapsed(prev => !prev);
      Logger.info('PROJECT_EDITOR', 'Sidebar shortcut triggered');
      return;
    }
    
    // 🔥 다크모드 토글 (Ctrl+D / Cmd+D)
    if (modKey && key === 'd') {
      event.preventDefault();
      uiState.toggleDarkMode();
      Logger.info('PROJECT_EDITOR', 'Dark mode shortcut triggered');
      return;
    }
    
    // 🔥 뒤로가기 (Esc)
    if (key === 'Escape') {
      handleBack();
      Logger.info('PROJECT_EDITOR', 'Back shortcut triggered');
      return;
    }
    
    // 🔥 단축키 도움말 (F1)
    if (key === 'F1') {
      event.preventDefault();
      const helpEvent = new CustomEvent('shortcut:help');
      window.dispatchEvent(helpEvent);
      Logger.info('PROJECT_EDITOR', 'Help shortcut triggered');
      return;
    }
  }, [projectData.forceSave, uiState.toggleFocusMode, uiState.toggleDarkMode, handleBack]);
  
  // 🔥 키보드 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  // 🔥 에디터 저장 이벤트 리스너 (Ctrl+S에서 발생)
  useEffect(() => {
    const handleProjectSave = () => {
      projectData.forceSave();
      Logger.info('PROJECT_EDITOR', 'Project save triggered from editor');
    };
    
    window.addEventListener('project:save', handleProjectSave);
    return () => window.removeEventListener('project:save', handleProjectSave);
  }, [projectData.forceSave]);
  
  // 🔥 데이터 로딩 상태를 기준으로 로딩 화면 표시 (무한 로딩 문제 해결)
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">프로젝트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="h-screen flex items-center justify-center text-red-500">오류: {error}</div>;
  }

  return (
    <EditorProvider>
      <div className={WRITER_EDITOR_STYLES.container}>
        {/* 🔥 모듈화된 ProjectHeader 사용 */}
        <ProjectHeader
          title={projectData.title}
          onTitleChange={projectData.setTitle}
          onBack={handleBack}
          sidebarCollapsed={collapsed}
          onToggleSidebar={handleToggleSidebar}
          isFocusMode={uiState.isFocusMode}
          onToggleFocusMode={uiState.toggleFocusMode}
          onSave={projectData.forceSave}
          onShare={handleShare}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />

        {/* 🔥 메인 영역 */}
        <div className={WRITER_EDITOR_STYLES.main}>
          {/* 🔥 모듈화된 WriterSidebar 사용 */}
          {!collapsed && (
            <WriterSidebar
              currentView={currentView}
              onViewChange={handleViewChange}
              structure={projectData.structure}
              characters={projectData.characters}
              stats={projectData.writerStats}
              collapsed={false}
            />
          )}

          {/* 🔥 뷰 전환 영역 - WriterSidebar와 연동 */}
          <div className={WRITER_EDITOR_STYLES.editorContainer}>
            {currentView === 'write' && (
              <WriteView
                content={projectData.content}
                onChange={projectData.setContent}
                isFocusMode={uiState.isFocusMode}
              />
            )}
            {currentView === 'structure' && (
              <StructureView
                structure={projectData.structure}
                onStructureChange={projectData.setStructure}
              />
            )}
            {currentView === 'characters' && (
              <CharactersView
                projectId={projectId}
                characters={projectData.characters}
                onCharactersChange={projectData.setCharacters}
              />
            )}
            {currentView === 'notes' && (
              <NotesView
                projectId={projectId}
                notes={projectData.notes || []}
                onNotesChange={projectData.setNotes}
              />
            )}
          </div>
        </div>
      </div>

      {/* 🔥 단축키 도움말 (우측 하단 고정) */}
      <ShortcutHelp />

      {/* 🔥 삭제 확인 다이얼로그 */}
      <ConfirmDeleteDialog
        isOpen={showDeleteDialog}
        projectTitle={projectData.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />

      {/* 🔥 공유 다이얼로그 */}
      <ShareDialog
        isOpen={showShareDialog}
        projectTitle={projectData.title}
        projectId={projectId}
        onClose={() => setShowShareDialog(false)}
      />
    </EditorProvider>
  );
});
