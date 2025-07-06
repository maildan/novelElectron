'use client';

import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { getShortcutHelp } from './EditorShortcuts';

// 🔥 단축키 도움말 스타일
const HELP_STYLES = {
  trigger: 'fixed bottom-4 right-4 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer',
  modal: 'fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50',
  panel: 'bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden',
  header: 'flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700',
  title: 'text-xl font-bold text-slate-900 dark:text-slate-100',
  closeButton: 'w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors',
  content: 'p-6 overflow-y-auto',
  helpText: 'prose prose-slate dark:prose-invert max-w-none text-sm',
} as const;

interface ShortcutHelpProps {
  className?: string;
}

export function ShortcutHelp({ className = '' }: ShortcutHelpProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggle = (): void => {
    setIsOpen(prev => !prev);
  };

  const handleClose = (): void => {
    setIsOpen(false);
  };

  const handleBackdropClick = (event: React.MouseEvent): void => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  // 🔥 Escape 키로 닫기 및 F1 키로 열기
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    const handleHelpShortcut = (): void => {
      setIsOpen(prev => !prev);
    };

    document.addEventListener('keydown', handleEscape);
    window.addEventListener('shortcut:help', handleHelpShortcut);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('shortcut:help', handleHelpShortcut);
    };
  }, [isOpen]);

  return (
    <>
      {/* 🔥 도움말 트리거 버튼 */}
      <button
        className={`${HELP_STYLES.trigger} ${className}`}
        onClick={handleToggle}
        title="단축키 도움말 (F1)"
        aria-label="단축키 도움말"
      >
        <HelpCircle size={24} />
      </button>

      {/* 🔥 도움말 모달 */}
      {isOpen && (
        <div className={HELP_STYLES.modal} onClick={handleBackdropClick}>
          <div className={HELP_STYLES.panel}>
            {/* 🔥 헤더 */}
            <div className={HELP_STYLES.header}>
              <h2 className={HELP_STYLES.title}>키보드 단축키</h2>
              <button
                className={HELP_STYLES.closeButton}
                onClick={handleClose}
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            </div>

            {/* 🔥 도움말 내용 */}
            <div className={HELP_STYLES.content}>
              <div className={HELP_STYLES.helpText}>
                <div dangerouslySetInnerHTML={{ 
                  __html: getShortcutHelp().replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                }} />
                
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">📖 마크다운 단축키</h3>
                  <div className="space-y-1 text-sm">
                    <div><code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded"># 스페이스</code> → 제목 1</div>
                    <div><code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">## 스페이스</code> → 제목 2</div>
                    <div><code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">### 스페이스</code> → 제목 3</div>
                    <div><code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">- 스페이스</code> → 불릿 리스트</div>
                    <div><code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">1. 스페이스</code> → 번호 리스트</div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>💡 팁:</strong> 텍스트를 선택하고 단축키를 누르면 선택된 텍스트에 포맷이 적용됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
