'use client';

import { useState, useEffect, useCallback } from 'react';
import { Logger } from '../../../../shared/logger';

interface UseUIStateReturn {
  // UI 상태
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
  showHeader: boolean;
  isDarkMode: boolean;
  isFocusMode: boolean;
  
  // 액션
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  toggleDarkMode: () => void;
  toggleFocusMode: () => void;
  setShowHeader: (show: boolean) => void;
}

export function useUIState(): UseUIStateReturn {
  // 🔥 UI 상태
  const [showLeftSidebar, setShowLeftSidebar] = useState<boolean>(true);
  const [showRightSidebar, setShowRightSidebar] = useState<boolean>(false);
  const [showHeader, setShowHeader] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  // 🔥 다크 모드 토글
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 🔥 핸들러 함수들
  const toggleLeftSidebar = useCallback((): void => {
    setShowLeftSidebar(prev => !prev);
    Logger.debug('UI_STATE', 'Left sidebar toggled');
  }, []);
  
  const toggleRightSidebar = useCallback((): void => {
    setShowRightSidebar(prev => !prev);
    Logger.debug('UI_STATE', 'Right sidebar toggled');
  }, []);
  
  const toggleDarkMode = useCallback((): void => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      Logger.info('UI_STATE', `Dark mode ${newValue ? 'enabled' : 'disabled'}`);
      return newValue;
    });
  }, []); // 🔥 dependency 제거로 무한루프 해결
  
  const toggleFocusMode = useCallback((): void => {
    setIsFocusMode(prev => {
      const newValue = !prev;
      if (newValue) {
        setShowLeftSidebar(false);
        setShowRightSidebar(false);
      }
      Logger.info('UI_STATE', `Focus mode ${newValue ? 'enabled' : 'disabled'}`);
      return newValue;
    });
  }, []); // 🔥 dependency 제거로 무한루프 해결

  return {
    showLeftSidebar,
    showRightSidebar,
    showHeader,
    isDarkMode,
    isFocusMode,
    toggleLeftSidebar,
    toggleRightSidebar,
    toggleDarkMode,
    toggleFocusMode,
    setShowHeader
  };
}
