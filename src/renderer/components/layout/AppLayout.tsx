'use client';

import React, { ReactNode, ReactElement } from 'react';
import { Logger } from '../../shared/logger';
import { COMPONENT_STYLES } from './COMPONENT_STYLES';

const LAYOUT_STYLES = {
  container: 'flex min-h-screen bg-slate-50 dark:bg-slate-900',
  sidebar: 'hidden md:flex flex-col w-56 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 py-6 px-4 z-90',
  main: 'flex-1 flex flex-col p-6',
  navItem: 'mb-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors',
  active: 'font-bold underline',
};

export interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }): ReactElement => {
  React.useEffect(() => {
    Logger.info('AppLayout', '레이아웃 렌더링 완료');
    return () => {
      Logger.info('AppLayout', '레이아웃 언마운트');
    };
  }, []);

  return (
    <div className={LAYOUT_STYLES.container}>
      <aside className={LAYOUT_STYLES.sidebar} aria-label="사이드바 네비게이션">
        <nav>
          <a href="/" className={LAYOUT_STYLES.navItem}>대시보드</a>
          <a href="/statistics" className={LAYOUT_STYLES.navItem}>통계</a>
          <a href="/settings" className={LAYOUT_STYLES.navItem}>설정</a>
        </nav>
      </aside>
      <main className={LAYOUT_STYLES.main} role="main">
        {children}
      </main>
    </div>
  );
}; 