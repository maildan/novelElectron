// Server RootLayout: read auth snapshot synchronously and pass to client layout
import * as fs from 'fs';
import * as path from 'path';
// 🔥 global 폴리필 추가 (최우선)
if (typeof global === 'undefined') {
  (globalThis as any).global = globalThis;
}
import ClientLayout from './ClientLayout';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
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
  // read auth snapshot synchronously on server render
  let initialAuth: any = null;
  try {
    const snapPath = path.join(process.cwd(), '.auth_snapshot.json');
    if (fs.existsSync(snapPath)) {
      const raw = fs.readFileSync(snapPath, { encoding: 'utf-8' });
      const parsed = JSON.parse(raw);
      initialAuth = parsed;
    }
  } catch (e) {
    // ignore
  }

  return (
    <html lang="ko" className={`${inter.className} ${LAYOUT_STYLES.html}`} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Loop - 당신의 AI 워드프로세서" />
        <title>Loop</title>

        {/* keep the same theme blocking script (unchanged) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var html = document.documentElement;
                  var savedTheme = 'system';

                  try {
                    var snap = (window.loopSnapshot && typeof window.loopSnapshot.get === 'function') ? window.loopSnapshot.get() : null;
                    if (snap && snap.theme) {
                      savedTheme = snap.theme === 'dark' || snap.theme === 'light' ? snap.theme : 'system';
                    }
                  } catch (e) {
                    // ignore
                  }

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
        <ClientLayout initialAuth={initialAuth}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
