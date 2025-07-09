'use client';

import React from 'react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import {
  ArrowLeft,
  Save,
  Share2,
  Download,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Menu,
  BarChart3
} from 'lucide-react';

interface WriterToolbarProps {
  title: string;
  onTitleChange: (title: string) => void;
  onBack: () => void;
  onSave: () => void;
  onShare: () => void;
  onDownload: () => void;
  toggleDarkMode: () => void;
  toggleFocusMode: () => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  isDarkMode: boolean;
  isFocusMode: boolean;
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
  showHeader: boolean;
  saveStatus: 'saved' | 'saving' | 'error' | 'unsaved';
  lastSaved: Date | null;
}

const TOOLBAR_STYLES = {
  header: 'flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out',
  headerVisible: 'opacity-100 translate-y-0',
  headerHidden: 'opacity-0 -translate-y-full',
  iconButton: 'flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400',
  iconButtonActive: 'flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  titleInput: 'border-none bg-transparent focus:outline-none focus:ring-0 text-lg font-medium flex-1 w-auto placeholder:text-slate-400 dark:placeholder:text-slate-500',
} as const;

export function WriterToolbar({
  title,
  onTitleChange,
  onBack,
  onSave,
  onShare,
  onDownload,
  toggleDarkMode,
  toggleFocusMode,
  toggleLeftSidebar,
  toggleRightSidebar,
  isDarkMode,
  isFocusMode,
  showLeftSidebar,
  showRightSidebar,
  showHeader,
  saveStatus,
  lastSaved
}: WriterToolbarProps): React.ReactElement {
  
  const formatLastSaved = (): string => {
    if (!lastSaved) return '';
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  };

  return (
    <header className={`${TOOLBAR_STYLES.header} ${showHeader ? TOOLBAR_STYLES.headerVisible : TOOLBAR_STYLES.headerHidden}`}>
      <div className="flex items-center space-x-3">
        <button 
          onClick={onBack}
          className={TOOLBAR_STYLES.iconButton}
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <button 
          onClick={toggleLeftSidebar}
          className={showLeftSidebar ? TOOLBAR_STYLES.iconButtonActive : TOOLBAR_STYLES.iconButton}
          aria-label={showLeftSidebar ? "사이드바 닫기" : "사이드바 열기"}
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="제목 없는 문서"
          className={TOOLBAR_STYLES.titleInput}
          onBlur={onSave}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        {/* 저장 상태 표시 */}
        <Badge 
          variant={saveStatus === 'saved' ? 'success' : 
                 saveStatus === 'saving' ? 'default' : 
                 saveStatus === 'error' ? 'danger' : 'outline'}
          className="font-normal text-xs"
        >
          {saveStatus === 'saved' ? '저장됨' : 
           saveStatus === 'saving' ? '저장 중...' : 
           saveStatus === 'error' ? '저장 실패' : '변경됨'}
        </Badge>
        
        {lastSaved && (
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden md:inline-block">
            {formatLastSaved()}
          </span>
        )}
        
        <button 
          onClick={toggleDarkMode}
          className={TOOLBAR_STYLES.iconButton}
          aria-label={isDarkMode ? "라이트 모드" : "다크 모드"}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <button 
          onClick={toggleFocusMode}
          className={isFocusMode ? TOOLBAR_STYLES.iconButtonActive : TOOLBAR_STYLES.iconButton}
          aria-label={isFocusMode ? "일반 모드" : "몰입 모드"}
        >
          {isFocusMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
        
        <button
          onClick={onSave}
          className={TOOLBAR_STYLES.iconButton}
          aria-label="저장"
        >
          <Save className="w-5 h-5" />
        </button>
        
        <button
          onClick={onShare}
          className={TOOLBAR_STYLES.iconButton}
          aria-label="공유"
        >
          <Share2 className="w-5 h-5" />
        </button>
        
        <button
          onClick={onDownload}
          className={TOOLBAR_STYLES.iconButton}
          aria-label="다운로드"
        >
          <Download className="w-5 h-5" />
        </button>
        
        <button
          onClick={toggleRightSidebar}
          className={showRightSidebar ? TOOLBAR_STYLES.iconButtonActive : TOOLBAR_STYLES.iconButton}
          aria-label={showRightSidebar ? "통계 닫기" : "통계 열기"}
        >
          <BarChart3 className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
