/**
 * 🔥 기가차드 Document 설정
 * Next.js + Electron 최적화
 */

import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* 🚀 기가차드 폴리필 최우선 로드 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 🔥 Global 폴리필 (즉시 실행)
              if (typeof global === 'undefined') {
                if (typeof globalThis !== 'undefined') {
                  window.global = globalThis;
                  self.global = globalThis;
                } else {
                  window.global = window;
                  self.global = window;
                }
              }
              
              // Process 폴리필
              if (typeof process === 'undefined') {
                window.process = {
                  env: { NODE_ENV: '${process.env.NODE_ENV}' },
                  browser: true,
                  version: '',
                  platform: 'browser'
                };
              }
              
              console.log('🔥 기가차드 인라인 폴리필 로드 완료');
            `
          }}
        />
        
        {/* 기본 메타 태그 */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Loop - 기가차드 타이핑 애널리틱스" />
        
        {/* Electron 보안 CSP */}
        <meta httpEquiv="Content-Security-Policy" content="
          default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;
          script-src 'self' 'unsafe-inline' 'unsafe-eval';
          style-src 'self' 'unsafe-inline';
          img-src 'self' data: blob:;
          connect-src 'self' ws: wss:;
        " />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
