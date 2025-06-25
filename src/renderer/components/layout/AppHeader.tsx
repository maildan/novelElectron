/**
 * 🔥 기가차드 앱 헤더 컴포넌트 - Hydration Safe!
 * Loop Typing Analytics - App Header with Window Controls
 */

'use client';

import { Minus, Square, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AppHeaderProps {
  title?: string;
  showWindowControls?: boolean;
}

export function AppHeader({ 
  title = 'Loop Typing Analytics', 
  showWindowControls = true 
}: AppHeaderProps) {
  
  const [isMounted, setIsMounted] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // 브라우저에서만 플랫폼 확인
    const shouldShowControls = showWindowControls && 
      typeof window !== 'undefined' && 
      typeof process !== 'undefined' && 
      process.platform !== 'darwin';
    setShowControls(shouldShowControls);
  }, [showWindowControls]);

  const handleMinimize = () => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.window.minimize();
    }
  };

  const handleMaximize = () => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.window.toggleMaximize();
    }
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.window.close();
    }
  };

  return (
    <header className="app-header">
      <div className="app-header-content">
        <div className="flex items-center gap-3">
          {/* 앱 로고 */}
          <div className="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          
          {/* 앱 타이틀 */}
          <h1 className="app-title">{title}</h1>
        </div>
      </div>

      {/* 윈도우 컨트롤 버튼들 - 완전히 클라이언트에서만 렌더링 */}
      {isMounted && showControls && (
        <div className="window-controls">
          <button 
            className="window-control-btn minimize"
            onClick={handleMinimize}
            title="최소화"
          >
            <Minus size={16} />
          </button>
          
          <button 
            className="window-control-btn maximize"
            onClick={handleMaximize}
            title="최대화"
          >
            <Square size={14} />
          </button>
          
          <button 
            className="window-control-btn close"
            onClick={handleClose}
            title="닫기"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </header>
  );
}
