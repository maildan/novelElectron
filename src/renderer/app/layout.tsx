'use client';

// 🔥 global 폴리필 추가 (최우선)
if (typeof global === 'undefined') {
  (globalThis as any).global = globalThis;
}

import { Inter } from 'next/font/google';
import { ReactNode, useState, useLayoutEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppSidebar } from '../components/layout/AppSidebar';
import { AppHeader } from '../components/layout/AppHeader';
import { MonitoringProvider } from '../contexts/GlobalMonitoringContext';
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
  const router = useRouter();

  // 🔥 DOM 업데이트 전에 localStorage에서 사이드바 상태 즉시 복원
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedState = localStorage.getItem('sidebar-collapsed');
        if (savedState === 'true') {
          setSidebarCollapsed(true);
        }
        Logger.debug('LAYOUT', 'Sidebar state restored immediately', { collapsed: savedState === 'true' });
        
        // 🔥 ElectronAPI 상태 디버깅
        Logger.info('LAYOUT', '🔍 ELECTRON API STATUS CHECK', {
          hasElectronAPI: !!window.electronAPI,
          electronAPIKeys: window.electronAPI ? Object.keys(window.electronAPI) : [],
          userAgent: navigator.userAgent,
          isElectron: navigator.userAgent.toLowerCase().includes('electron')
        });
        
      } catch (error) {
        Logger.error('LAYOUT', 'Failed to restore sidebar state', error);
      }
    }
    setIsClientMounted(true);
  }, []);

  const handleNavigate = (href: string): void => {
    try {
      // 🔥 Next.js App Router의 클라이언트 사이드 라우팅 사용
      Logger.debug('LAYOUT', 'Navigating to', { href, currentPath: pathname });
      router.push(href);
    } catch (error) {
      Logger.error('LAYOUT', 'Navigation failed, falling back to window.location', { href, error });
      // 폴백: 라우터 실패 시 페이지 새로고침
      window.location.href = href;
    }
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
        <meta name="description" content="Loop - AI 기반 타이핑 분석 도구" />
        <title>Loop</title>
        
        {/* 🔥 하이드레이션 안전한 테마 블로킹 스크립트 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // 🔥 하이드레이션 에러 완전 방지: 서버와 클라이언트 완전 동기화
                  
                  var html = document.documentElement;
                  var savedTheme = 'system'; // 🔥 서버 기본값과 동일
                  
                  // 1. localStorage에서 저장된 테마 확인 (안전하게)
                  try {
                    var stored = localStorage.getItem('loop-theme');
                    if (stored && ['light', 'dark', 'system'].includes(stored)) {
                      savedTheme = stored;
                    }
                  } catch (e) {
                    // localStorage 접근 실패 시 기본값 유지
                  }
                  
                  // 2. system 테마인 경우 실제 시스템 테마 감지
                  var resolvedTheme = savedTheme;
                  if (savedTheme === 'system') {
                    try {
                      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    } catch (e) {
                      resolvedTheme = 'light'; // 폴백
                    }
                  }
                  
                  // 3. 기존 클래스 완전 제거 (하이드레이션 에러 방지)
                  html.classList.remove('light', 'dark', 'system');
                  
                  // 4. 해결된 테마만 적용
                  html.classList.add(resolvedTheme);
                  
                  // 5. 일관된 속성 설정
                  html.setAttribute('data-theme', resolvedTheme);
                  html.style.setProperty('color-scheme', resolvedTheme);
                  html.style.visibility = 'visible'; // 깜빡임 방지
                  
                  // 6. CSS 커스텀 속성도 즉시 적용
                  if (resolvedTheme === 'dark') {
                    html.style.setProperty('--bg-primary', '#0f1419');
                    html.style.setProperty('--text-primary', '#e5e7eb');
                  } else {
                    html.style.setProperty('--bg-primary', '#fefcf7');
                    html.style.setProperty('--text-primary', '#1a1a1a');
                  }
                  
                  // 7. body가 존재하면 안전하게 업데이트
                  var body = document.body;
                  if (body) {
                    // body 클래스는 고정값으로 설정 (하이드레이션 안전)
                    body.className = 'h-full bg-slate-50 dark:bg-slate-900 antialiased';
                    body.style.visibility = 'visible';
                  }
                  
                } catch (error) {
                  // 🔥 완전 폴백: 모든 에러 상황에 대비
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
                    // 마지막 안전장치
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
        </ThemeProvider>
      </body>
    </html>
  );
}
