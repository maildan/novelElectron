'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Logger } from '../../shared/logger';

// 🔥 테마 타입 정의
export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark'; // 실제 적용된 테마 (system 해결됨)
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// 🔥 Context 생성
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 🔥 프리컴파일된 스타일
const THEME_STYLES = {
  root: 'transition-colors duration-200',
} as const;

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps): React.ReactElement {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // 🔥 시스템 테마 감지
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // 🔥 해결된 테마 계산
  const calculateResolvedTheme = useCallback((currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  }, [getSystemTheme]);

  // 🔥 테마 설정 함수
  const setTheme = useCallback(async (newTheme: Theme): Promise<void> => {
    try {
      Logger.info('THEME_PROVIDER', 'Theme changing', { from: theme, to: newTheme });
      
      setThemeState(newTheme);
      const resolved = calculateResolvedTheme(newTheme);
      setResolvedTheme(resolved);

      // 🔥 백엔드에 테마 저장
      try {
        const result = await window.electronAPI.settings.set('app.theme', newTheme);
        if (result.success) {
          Logger.info('THEME_PROVIDER', 'Theme saved to backend', { theme: newTheme, resolved });
        } else {
          Logger.warn('THEME_PROVIDER', 'Failed to save theme to backend', result.error);
        }
      } catch (error) {
        Logger.error('THEME_PROVIDER', 'Error saving theme to backend', error);
      }

      // 🔥 HTML 클래스 업데이트 (즉시)
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
      
      // 🔥 로컬 스토리지에도 저장 (백업)
      localStorage.setItem('loop-theme', newTheme);
      
      Logger.info('THEME_PROVIDER', 'Theme applied successfully', { 
        theme: newTheme, 
        resolved,
        htmlClass: root.className 
      });
    } catch (error) {
      Logger.error('THEME_PROVIDER', 'Error setting theme', error);
    }
  }, [theme, calculateResolvedTheme]);

  // 🔥 테마 토글 함수
  const toggleTheme = useCallback((): void => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  // 🔥 초기 테마 로드
  useEffect(() => {
    const loadInitialTheme = async (): Promise<void> => {
      try {
        // 1. 백엔드에서 테마 가져오기
        let savedTheme: Theme = defaultTheme;
        
        try {
          const result = await window.electronAPI.settings.get('app.theme');
          if (result.success && result.data) {
            const themeValue = result.data as Theme;
            if (['light', 'dark', 'system'].includes(themeValue)) {
              savedTheme = themeValue;
              Logger.info('THEME_PROVIDER', 'Theme loaded from backend', { theme: savedTheme });
            }
          }
        } catch (error) {
          Logger.warn('THEME_PROVIDER', 'Failed to load theme from backend, using fallback', error);
          
          // 2. 로컬 스토리지 폴백
          const localTheme = localStorage.getItem('loop-theme') as Theme;
          if (localTheme && ['light', 'dark', 'system'].includes(localTheme)) {
            savedTheme = localTheme;
            Logger.info('THEME_PROVIDER', 'Theme loaded from localStorage', { theme: savedTheme });
          }
        }

        // 3. 테마 적용
        setThemeState(savedTheme);
        const resolved = calculateResolvedTheme(savedTheme);
        setResolvedTheme(resolved);

        // 4. HTML 클래스 즉시 적용
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(resolved);

        Logger.info('THEME_PROVIDER', 'Initial theme applied', { 
          theme: savedTheme, 
          resolved,
          source: 'backend/localStorage'
        });
      } catch (error) {
        Logger.error('THEME_PROVIDER', 'Error loading initial theme', error);
        
        // 안전한 폴백
        const resolved = calculateResolvedTheme(defaultTheme);
        setResolvedTheme(resolved);
        document.documentElement.classList.add(resolved);
      }
    };

    loadInitialTheme();
  }, [defaultTheme, calculateResolvedTheme]);

  // 🔥 시스템 테마 변경 감지
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (): void => {
      if (theme === 'system') {
        const newResolved = getSystemTheme();
        setResolvedTheme(newResolved);
        
        // HTML 클래스 업데이트
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(newResolved);
        
        Logger.info('THEME_PROVIDER', 'System theme changed', { 
          theme: 'system', 
          resolved: newResolved 
        });
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme, getSystemTheme]);

  const contextValue: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={THEME_STYLES.root}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// 🔥 커스텀 훅
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
