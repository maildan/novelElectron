'use client';

// 🔥 global 폴리필 추가 (최우선)
if (typeof global === 'undefined') {
  (globalThis as any).global = globalThis;
}

import { Inter } from 'next/font/google';
import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AppSidebar } from '../components/layout/AppSidebar';
import { AppHeader } from '../components/layout/AppHeader';
import { MonitoringProvider } from '../contexts/GlobalMonitoringContext';
import './globals.css';

// 🔥 기가차드 규칙: Inter 폰트 최적화
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
});

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const LAYOUT_STYLES = {
  html: 'h-full',
  body: 'h-full bg-slate-50 dark:bg-slate-900 antialiased',
  container: 'h-screen flex',
  sidebar: 'flex-shrink-0',
  main: 'flex-1 flex flex-col overflow-hidden',
  header: 'flex-shrink-0',
  content: 'flex-1 overflow-auto',
} as const;

// 🔥 기가차드 규칙: 메타데이터 타입 정의
interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.ReactElement {
  // 🔥 localStorage를 사용한 사이드바 상태 지속성
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedState = localStorage.getItem('sidebar-collapsed');
        return savedState ? JSON.parse(savedState) : false;
      } catch (error) {
        console.error('Failed to load sidebar state from localStorage', error);
        return false;
      }
    }
    return false;
  });
  
  const pathname = usePathname();

  // 🔥 사이드바 상태 변경 시 localStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sidebar-collapsed', JSON.stringify(sidebarCollapsed));
      } catch (error) {
        console.error('Failed to save sidebar state to localStorage', error);
      }
    }
  }, [sidebarCollapsed]);

  // 🔥 localStorage에서 사이드바 상태 복원
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  const handleNavigate = (href: string): void => {
    // Next.js App Router는 자동으로 네비게이션을 처리합니다
    window.location.href = href;
  };

  const handleToggleSidebar = (): void => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    // 🔥 localStorage에 상태 저장
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  return (
    <html lang="ko" className={`${inter.className} ${LAYOUT_STYLES.html}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Loop - AI 기반 타이핑 분석 도구" />
        <title>Loop</title>
      </head>
      <body className={LAYOUT_STYLES.body}>
        <MonitoringProvider>
          <div className={LAYOUT_STYLES.container}>
            {/* 사이드바 */}
            <aside className={LAYOUT_STYLES.sidebar}>
              <AppSidebar 
                activeRoute={pathname}
                onNavigate={handleNavigate}
                collapsed={sidebarCollapsed}
                onToggleCollapse={handleToggleSidebar}
              />
            </aside>

            {/* 메인 콘텐츠 */}
            <main className={LAYOUT_STYLES.main}>
              {/* 헤더 */}
              <header className={LAYOUT_STYLES.header}>
                <AppHeader />
              </header>

              {/* 페이지 콘텐츠 */}
              <div className={LAYOUT_STYLES.content}>
                {children}
              </div>
            </main>
          </div>
        </MonitoringProvider>
      </body>
    </html>
  );
}
