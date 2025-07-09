'use client';

import React, { useState } from 'react';
import { 
  ChevronLeft,
  Save,
  Share2,
  Download,
  Trash2,
  Sidebar,
  Eye,
  EyeOff,
  Palette,
  MessageCircle,
  Sun,
  Moon,
  Copy,
  FileDown,
  Focus
} from 'lucide-react';
import { Logger } from '../../../../shared/logger';

// 🔥 프리컴파일된 스타일 (기가차드 원칙)
const PROJECT_HEADER_STYLES = {
  header: 'flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200',
  headerLeft: 'flex items-center gap-3',
  headerCenter: 'flex-1 max-w-md mx-auto',
  headerRight: 'flex items-center gap-2 relative',
  
  backButton: 'flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors',
  titleInput: 'border-none bg-transparent focus:outline-none focus:ring-0 text-lg font-medium w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100',
  iconButton: 'flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 relative group',
  iconButtonActive: 'flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 relative group',
  
  // 툴팁 스타일
  tooltip: 'absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50',
  tooltipWithShortcut: 'absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50',
  shortcut: 'block text-gray-400 text-xs mt-1',
  
  // 슬라이드바 스타일
  slidebar: 'fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl transform transition-transform duration-300 ease-in-out z-40',
  slidebarOpen: 'translate-x-0',
  slidebarClosed: 'translate-x-full',
  slidebarHeader: 'flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700',
  slidebarTitle: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
  slidebarContent: 'p-4 overflow-y-auto h-full',
  slidebarOverlay: 'fixed inset-0 bg-black/50 z-30',
} as const;

// 🔥 HeaderAction 타입 정의
interface HeaderAction {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  shortcut?: string;
  onClick: () => void;
  isActive?: boolean;
}

// 슬라이드바 타입 (테마 제거)
type SlidebarType = 'ai' | null;

interface ProjectHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onBack: () => void;
  
  // 🔥 사이드바 컨트롤
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  
  // 🔥 포커스 모드 컨트롤
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  
  // 🔥 프로젝트 액션들
  onSave: () => void;
  onShare: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export function ProjectHeader({
  title,
  onTitleChange,
  onBack,
  sidebarCollapsed,
  onToggleSidebar,
  isFocusMode,
  onToggleFocusMode,
  onSave,
  onShare,
  onDownload,
  onDelete
}: ProjectHeaderProps): React.ReactElement {
  
  const [activeSlideBar, setActiveSlideBar] = useState<SlidebarType>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    document.documentElement.classList.contains('dark')
  );
  
  // 🔥 슬라이드바 토글 함수
  const toggleSlideBar = (type: SlidebarType): void => {
    setActiveSlideBar(activeSlideBar === type ? null : type);
  };
  
  // 🔥 테마 원클릭 토글
  const toggleTheme = (): void => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    Logger.info('PROJECT_HEADER', `Theme changed to ${newDarkMode ? 'dark' : 'light'}`);
};
  
  // 🔥 복사 기능 (현재 텍스트 클립보드에 복사)
  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(title);
      Logger.info('PROJECT_HEADER', 'Project title copied to clipboard');
      // TODO: 토스트 알림 추가
    } catch (error) {
      Logger.error('PROJECT_HEADER', 'Failed to copy to clipboard', error);
    }
  };

  // 🔥 에디터 전용모드 토글
  const handleEditorOnlyMode = (): void => {
    const isEditorOnly = document.body.classList.contains('editor-only-mode');
    
    if (isEditorOnly) {
      document.body.classList.remove('editor-only-mode');
      Logger.info('PROJECT_HEADER', 'Editor-only mode disabled');
    } else {
      document.body.classList.add('editor-only-mode');
      Logger.info('PROJECT_HEADER', 'Editor-only mode enabled');
    }
  };

  // 🔥 헤더 액션 정의 (CRUD + 복사, 공유 개선)
  const headerActions: HeaderAction[] = [
    { icon: Save, label: '저장', shortcut: 'Cmd+S', onClick: onSave },
    { icon: Copy, label: '복사', shortcut: 'Cmd+C', onClick: handleCopy },
    { icon: Share2, label: '공유', shortcut: 'Cmd+Shift+S', onClick: onShare },
    { icon: FileDown, label: '내보내기', shortcut: 'Cmd+E', onClick: onDownload },
    { icon: Trash2, label: '삭제', shortcut: 'Cmd+Del', onClick: onDelete },
  ];

  // 🔥 툴바 확장 액션들 (AI 채팅, 테마 원클릭, 에디터 전용모드)
  const toolbarActions: HeaderAction[] = [
    { icon: MessageCircle, label: 'AI 채팅', onClick: () => toggleSlideBar('ai') },
    { 
      icon: isDarkMode ? Sun : Moon, 
      label: isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경', 
      onClick: toggleTheme 
    },
    { icon: Focus, label: '에디터 전용모드', onClick: handleEditorOnlyMode },
  ];

  return (
    <> 
      <div className={PROJECT_HEADER_STYLES.header}>
        {/* 🔥 왼쪽: 뒤로가기 + 네비게이션 */}
        <div className={PROJECT_HEADER_STYLES.headerLeft}>
          <button 
            className={PROJECT_HEADER_STYLES.backButton}
            onClick={onBack}
          >
            <ChevronLeft size={16} />
            <span>프로젝트 목록</span>
          </button>
        </div>

        {/* 🔥 중앙: 프로젝트 제목 */}
        <div className={PROJECT_HEADER_STYLES.headerCenter}>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="프로젝트 제목을 입력하세요"
            className={PROJECT_HEADER_STYLES.titleInput}
          />
        </div>

        {/* 🔥 오른쪽: 액션 버튼들 */}
        <div className={PROJECT_HEADER_STYLES.headerRight}>
          {/* 프로젝트 액션들 */}
          {headerActions.map((action, index) => (
            <button
              key={`action-${index}`}
              className={PROJECT_HEADER_STYLES.iconButton}
              onClick={action.onClick}
            >
              <action.icon size={16} />
              <div className={PROJECT_HEADER_STYLES.tooltipWithShortcut}>
                <div>{action.label}</div>
                {action.shortcut && <div className={PROJECT_HEADER_STYLES.shortcut}>{action.shortcut}</div>}
              </div>
            </button>
          ))}
          
          {/* 구분선 */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          
          {/* 툴바 확장 액션들 */}
          {toolbarActions.map((action, index) => (
            <button
              key={`toolbar-${index}`}
              className={PROJECT_HEADER_STYLES.iconButton}
              onClick={action.onClick}
            >
              <action.icon size={16} />
              <div className={PROJECT_HEADER_STYLES.tooltip}>
                {action.label}
              </div>
            </button>
          ))}
          
          {/* 구분선 */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          
          {/* UI 컨트롤들 */}
          <button 
            className={sidebarCollapsed ? PROJECT_HEADER_STYLES.iconButton : PROJECT_HEADER_STYLES.iconButtonActive}
            onClick={onToggleSidebar}
          >
            <Sidebar size={16} />
            <div className={PROJECT_HEADER_STYLES.tooltip}>
              사이드바 토글
            </div>
          </button>
          
          <button 
            className={isFocusMode ? PROJECT_HEADER_STYLES.iconButtonActive : PROJECT_HEADER_STYLES.iconButton}
            onClick={onToggleFocusMode}
          >
            {isFocusMode ? <EyeOff size={16} /> : <Eye size={16} />}
            <div className={PROJECT_HEADER_STYLES.tooltip}>
              {isFocusMode ? '포커스 모드 해제' : '포커스 모드'}
            </div>
          </button>
        </div>
      </div>

      {/* 🔥 슬라이드바 오버레이 */}
      {activeSlideBar && (
        <div 
          className={PROJECT_HEADER_STYLES.slidebarOverlay}
          onClick={() => setActiveSlideBar(null)}
        />
      )}

      {/* 🔥 AI 채팅 슬라이드바 */}
      <div className={`${PROJECT_HEADER_STYLES.slidebar} ${
        activeSlideBar === 'ai' ? PROJECT_HEADER_STYLES.slidebarOpen : PROJECT_HEADER_STYLES.slidebarClosed
      }`}>
        <div className={PROJECT_HEADER_STYLES.slidebarHeader}>
          <h3 className={PROJECT_HEADER_STYLES.slidebarTitle}>AI 어시스턴트</h3>
          <button 
            className={PROJECT_HEADER_STYLES.iconButton}
            onClick={() => setActiveSlideBar(null)}
          >
            ✕
          </button>
        </div>
        <div className={PROJECT_HEADER_STYLES.slidebarContent}>
          {/* 채팅 인터페이스 */}
          <div className="flex flex-col h-full">
            {/* 채팅 메시지 영역 */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  안녕하세요! 글쓰기를 도와드릴 AI 어시스턴트입니다. 어떻게 도와드릴까요?
                </p>
              </div>
            </div>
            
            {/* 빠른 액션 버튼들 */}
            <div className="space-y-2 mb-4">
              <button 
                className="w-full p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={async () => {
                  try {
                    const result = await window.electronAPI.ai.improveText('선택된 텍스트 샘플');
                    Logger.info('PROJECT_HEADER', 'Text improvement result', result);
                  } catch (error) {
                    Logger.error('PROJECT_HEADER', 'Text improvement failed', error);
                  }
                }}
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">✨ 문장 개선</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">선택한 텍스트를 더 자연스럽게 개선합니다</div>
              </button>
              <button 
                className="w-full p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={async () => {
                  try {
                    const result = await window.electronAPI.ai.analyzeText('캐릭터 분석을 위한 텍스트');
                    Logger.info('PROJECT_HEADER', 'Character analysis result', result);
                  } catch (error) {
                    Logger.error('PROJECT_HEADER', 'Character analysis failed', error);
                  }
                }}
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">🎭 등장인물 분석</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">캐릭터의 일관성을 검토합니다</div>
              </button>
              <button 
                className="w-full p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={async () => {
                  try {
                    const result = await window.electronAPI.ai.getWritingHelp('플롯 구성에 대한 조언을 주세요');
                    Logger.info('PROJECT_HEADER', 'Plot analysis result', result);
                  } catch (error) {
                    Logger.error('PROJECT_HEADER', 'Plot analysis failed', error);
                  }
                }}
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">📖 플롯 체크</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">스토리 흐름을 분석합니다</div>
              </button>
            </div>
            
            {/* 채팅 입력 영역 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="AI에게 질문하거나 도움을 요청하세요..."
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  전송
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
