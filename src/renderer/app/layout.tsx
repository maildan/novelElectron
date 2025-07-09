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
    <html lang="ko" className={`${inter.className} ${LAYOUT_STYLES.html}`}>
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
                  // 🔥 하이드레이션 에러 방지: 서버와 클라이언트 초기 상태 완전 동기화
                  
                  // 1. localStorage에서 저장된 테마 확인 (서버에선 없으므로 system이 기본값)
                  var savedTheme = 'system'; // 🔥 서버 기본값과 동일
                  try {
                    savedTheme = localStorage.getItem('loop-theme') || 'system';
                  } catch (e) {
                    // localStorage 접근 실패 시 기본값 유지
                  }
                  
                  // 2. system 테마인 경우 실제 시스템 테마 감지
                  var resolvedTheme = savedTheme;
                  if (savedTheme === 'system') {
                    resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  
                  // 3. HTML 요소 안전하게 참조
                  var html = document.documentElement;
                  var body = document.body;
                  
                  // 4. 기존 테마 클래스 완전 제거 (하이드레이션 에러 방지)
                  html.classList.remove('light', 'dark', 'system');
                  
                  // 5. 해결된 테마만 적용 (중복 방지)
                  html.classList.add(resolvedTheme);
                  
                  // 6. 일관된 속성 설정
                  html.setAttribute('data-theme', resolvedTheme);
                  html.style.setProperty('color-scheme', resolvedTheme);
                  
                  // 7. body 클래스도 동기화 (하이드레이션 에러 방지)
                  if (body) {
                    // 🔥 body에는 테마 관련 클래스를 추가하지 않음 (Tailwind CSS가 html.dark로 처리)
                    // body 클래스는 서버/클라이언트 모두 동일하게 유지
                    var expectedBodyClass = 'h-full bg-slate-50 dark:bg-slate-900 antialiased';
                    if (body.className !== expectedBodyClass) {
                      body.className = expectedBodyClass;
                    }
                  }
                  
                  // 8. 디버그 정보 (개발 환경에서만)
                  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
                    console.log('🎨 Theme initialized for hydration:', {
                      saved: savedTheme,
                      resolved: resolvedTheme,
                      htmlClass: html.className
                    });
                  }
                } catch (error) {
                  // 🔥 폴백: 안전한 라이트 테마 (하이드레이션 에러 방지)
                  document.documentElement.classList.remove('light', 'dark', 'system');
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.style.setProperty('color-scheme', 'light');
                  console.warn('🚨 Theme script error, using safe light theme:', error);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={LAYOUT_STYLES.body}>
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
