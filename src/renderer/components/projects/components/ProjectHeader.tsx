'use client';

import React from 'react';
import { 
  ChevronLeft,
  Save,
  Share2,
  Download,
  Sun,
  Moon,
  Sidebar,
  Eye,
  EyeOff
} from 'lucide-react';

// 🔥 프리컴파일된 스타일 (기가차드 원칙)
const PROJECT_HEADER_STYLES = {
  header: 'flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200',
  headerLeft: 'flex items-center gap-3',
  headerCenter: 'flex-1 max-w-md mx-auto',
  headerRight: 'flex items-center gap-2',
  
  backButton: 'flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors',
  titleInput: 'border-none bg-transparent focus:outline-none focus:ring-0 text-lg font-medium w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100',
  iconButton: 'flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400',
  iconButtonActive: 'flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
} as const;

// 🔥 HeaderAction 타입 정의
interface HeaderAction {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

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
  
  // 🔥 다크모드 컨트롤
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  
  // 🔥 프로젝트 액션들
  onSave: () => void;
  onShare: () => void;
  onDownload: () => void;
}

export function ProjectHeader({
  title,
  onTitleChange,
  onBack,
  sidebarCollapsed,
  onToggleSidebar,
  isFocusMode,
  onToggleFocusMode,
  isDarkMode,
  onToggleDarkMode,
  onSave,
  onShare,
  onDownload
}: ProjectHeaderProps): React.ReactElement {
  
  // 🔥 헤더 액션 정의 (모듈화된 방식)
  const headerActions: HeaderAction[] = [
    { icon: Save, label: '저장', onClick: onSave },
    { icon: Share2, label: '공유', onClick: onShare },
    { icon: Download, label: '다운로드', onClick: onDownload },
    { 
      icon: isDarkMode ? Sun : Moon, 
      label: '테마', 
      onClick: onToggleDarkMode 
    },
  ];

  return (
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
            title={action.label}
          >
            <action.icon size={16} />
          </button>
        ))}
        
        {/* 구분선 */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        
        {/* UI 컨트롤들 */}
        <button 
          className={sidebarCollapsed ? PROJECT_HEADER_STYLES.iconButton : PROJECT_HEADER_STYLES.iconButtonActive}
          onClick={onToggleSidebar}
          title="사이드바 토글"
        >
          <Sidebar size={16} />
        </button>
        
        <button 
          className={isFocusMode ? PROJECT_HEADER_STYLES.iconButtonActive : PROJECT_HEADER_STYLES.iconButton}
          onClick={onToggleFocusMode}
          title={isFocusMode ? '포커스 모드 해제' : '포커스 모드'}
        >
          {isFocusMode ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
