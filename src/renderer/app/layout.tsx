'use client';

// 🔥 global 폴리필 추가 (최우선)
if (typeof global === 'undefined') {
  (globalThis as any).global = globalThis;
}

import { Inter } from 'next/font/google';
import { ReactNode, useState, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AppSidebar } from '../components/layout/AppSidebar';
import { AppHeader } from '../components/layout/AppHeader';
import { MonitoringProvider } from '../contexts/GlobalMonitoringContext';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../providers/ThemeProvider';
import { Logger } from '../../shared/logger';
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
  body: 'h-full bg-slate-50 dark:bg-slate-900 antialiased', // 🔥 테마 클래스 제거 (HTML에서만 관리)
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
  // 🔥 하이드레이션 안전한 사이드바 상태 초기화 (서버와 클라이언트 동일)
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isClientMounted, setIsClientMounted] = useState<boolean>(false);
  const pathname = usePathname();

  // 🔥 DOM 업데이트 전에 localStorage에서 사이드바 상태 즉시 복원
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedState = localStorage.getItem('sidebar-collapsed');
        if (savedState === 'true') {
          setSidebarCollapsed(true);
        }
        Logger.debug('LAYOUT', 'Sidebar state restored immediately', { collapsed: savedState === 'true' });
      } catch (error) {
        Logger.error('LAYOUT', 'Failed to restore sidebar state', error);
      }
    }
    setIsClientMounted(true);
  }, []);

  const handleNavigate = (href: string): void => {
    // Next.js App Router는 자동으로 네비게이션을 처리합니다
    window.location.href = href;
  };

  const handleToggleSidebar = (): void => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);

    // 🔥 localStorage에 상태 저장 (일관된 키 사용)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sidebar-collapsed', newState.toString());
        Logger.debug('LAYOUT', 'Sidebar state saved', { collapsed: newState });
      } catch (error) {
        Logger.error('LAYOUT', 'Failed to save sidebar state', error);
      }
    }
  };

  return (
    <html lang="ko" className={`${inter.className} ${LAYOUT_STYLES.html}`} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Loop - 당신의 AI 워드프로세서" />
        <title>Loop</title>

        {/* 🔥 하이드레이션 안전한 테마 블로킹 스크립트 (preload snapshot 우선) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var html = document.documentElement;
                  var savedTheme = 'system';

                  // 우선 preload에서 주입한 스냅샷 사용
                  try {
                    var snap = (window.loopSnapshot && typeof window.loopSnapshot.get === 'function') ? window.loopSnapshot.get() : null;
                    if (snap && snap.theme) {
                      // snap.theme은 'dark' 또는 'light'
                      savedTheme = snap.theme === 'dark' || snap.theme === 'light' ? snap.theme : 'system';
                    }
                  } catch (e) {
                    // ignore
                  }

                  // 로컬스토리지가 우선이라면 덮어쓰기 (안전하게)
                  try {
                    var stored = localStorage.getItem('loop-theme');
                    if (stored && ['light', 'dark', 'system'].includes(stored)) {
                      savedTheme = stored;
                    }
                  } catch (e) {}

                  var resolvedTheme = savedTheme;
                  if (savedTheme === 'system') {
                    try {
                      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    } catch (e) {
                      resolvedTheme = 'light';
                    }
                  }

                  html.classList.remove('light', 'dark', 'system');
                  html.classList.add(resolvedTheme);
                  html.setAttribute('data-theme', resolvedTheme);
                  html.style.setProperty('color-scheme', resolvedTheme);
                  html.style.visibility = 'visible';

                  var body = document.body;
                  if (body) {
                    body.className = 'h-full bg-slate-50 dark:bg-slate-900 antialiased';
                    body.style.visibility = 'visible';
                  }
                } catch (error) {
                  try {
                    var html = document.documentElement;
                    html.classList.remove('light', 'dark', 'system');
                    html.classList.add('light');
                    html.setAttribute('data-theme', 'light');
                    html.style.setProperty('color-scheme', 'light');
                    html.style.visibility = 'visible';
                    if (document.body) {
                      document.body.className = 'h-full bg-slate-50 dark:bg-slate-900 antialiased';
                      document.body.style.visibility = 'visible';
                    }
                  } catch (finalError) {
                    console.warn('Theme script critical error:', finalError);
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body className={LAYOUT_STYLES.body} suppressHydrationWarning>
        <ThemeProvider defaultTheme="system">
          <AuthProvider>
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
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
