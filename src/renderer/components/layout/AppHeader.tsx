'use client';

import React, { ReactElement, useState } from 'react';
import { Logger } from '../../shared/logger';

const COMPONENT_STYLES = {
  header: 'w-full flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-100',
  logo: 'flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg',
  nav: 'flex gap-4',
  navItem: 'text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors',
  actions: 'flex items-center gap-3',
  button: 'px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600',
  aiButton: 'px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-purple-500 dark:hover:bg-purple-600',
};

export interface AppHeaderProps {
  title?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title = 'Loop Typing Analytics' }): ReactElement => {
  const [monitoring, setMonitoring] = useState<boolean>(false);
  const [aiPanelOpen, setAiPanelOpen] = useState<boolean>(false);

  React.useEffect(() => {
    Logger.info('AppHeader', '헤더 렌더링 완료');
    return () => {
      Logger.info('AppHeader', '헤더 언마운트');
    };
  }, []);

  const handleMonitoringClick = () => {
    setMonitoring((prev) => {
      const next = !prev;
      Logger.info('AppHeader', `모니터링 ${next ? '시작' : '중지'}`);
      // TODO: IPC 연동
      return next;
    });
  };

  const handleAiClick = () => {
    setAiPanelOpen((prev) => {
      const next = !prev;
      Logger.info('AppHeader', `LoopAi 패널 ${next ? '열림' : '닫힘'}`);
      // TODO: AI 패널 오픈/라우팅 등
      return next;
    });
  };

  return (
    <header className={COMPONENT_STYLES.header} role="banner">
      <div className={COMPONENT_STYLES.logo} aria-label="앱 로고">
        <img src="/appIcon.png" alt="Loop Logo" width={32} height={32} className="rounded" />
        <span>{title}</span>
      </div>
      <nav className={COMPONENT_STYLES.nav} aria-label="메인 네비게이션">
        <a href="/" className={COMPONENT_STYLES.navItem}>대시보드</a>
        <a href="/projects" className={COMPONENT_STYLES.navItem}>프로젝트</a>
        <a href="/statistics" className={COMPONENT_STYLES.navItem}>통계</a>
        <a href="/ai" className={COMPONENT_STYLES.navItem}>AI</a>
      </nav>
      <div className={COMPONENT_STYLES.actions}>
        <button
          type="button"
          className={COMPONENT_STYLES.button}
          onClick={handleMonitoringClick}
          aria-pressed={monitoring}
          aria-label={monitoring ? '모니터링 중지 (활성화됨)' : '모니터링 시작 (비활성화됨)'}
        >
          {monitoring ? '모니터링 중지' : '모니터링 시작'}
        </button>
        <button
          type="button"
          className={COMPONENT_STYLES.aiButton}
          onClick={handleAiClick}
          aria-pressed={aiPanelOpen}
          aria-label={aiPanelOpen ? 'LoopAi 패널 닫기 (열림)' : 'LoopAi 패널 열기 (닫힘)'}
          aria-expanded={aiPanelOpen}
        >
          {aiPanelOpen ? 'LoopAi 닫기' : 'LoopAi 열기'}
        </button>
      </div>
    </header>
  );
}; 