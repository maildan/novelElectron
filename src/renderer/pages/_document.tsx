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
              // 🔥 기가차드식 최강 Global 폴리필 (HTML 레벨)
              (function() {
                console.log('🔥 [Document] HTML level global polyfill 시작');
                
                // Step 1: globalThis 확보
                if (typeof globalThis === 'undefined') {
                  window.globalThis = window;
                }
                
                // Step 2: 모든 형태의 global을 globalThis로 박살내기
                if (typeof global === 'undefined') {
                  window.global = globalThis;
                  globalThis.global = globalThis;
                  self.global = globalThis;
                }
                
                // Step 3: 추가 aliases들도 박살내기
                window.GLOBAL = globalThis;
                window.root = globalThis;
                globalThis.GLOBAL = globalThis;
                globalThis.root = globalThis;
                
                // Step 4: eval로 강제 할당 (webpack 우회)
                try {
                  eval('global = globalThis');
                  eval('GLOBAL = globalThis');
                  eval('root = globalThis');
                } catch (e) {}
                
                console.log('🔥 [Document] HTML level global polyfill 완료!', {
                  global: typeof global,
                  globalThis: typeof globalThis,
                  'global===globalThis': typeof global !== 'undefined' && global === globalThis
                });
              })();
              
              // Process 폴리필
              if (typeof process === 'undefined') {
                window.process = {
                  env: { NODE_ENV: '${process.env.NODE_ENV}' },
                  browser: true,
                  version: '',
                  platform: 'browser'
                };
              }
            `
          }}
        />
        
        {/* 기본 메타 태그 */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Loop - 기가차드 타이핑 애널리틱스" />
        
        {/* 🔥 기가차드 개발용 CSP - 인라인 스크립트 허용! */}
        <meta httpEquiv="Content-Security-Policy" content="
          default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: http://localhost:* ws://localhost:*;
          script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:*;
          style-src 'self' 'unsafe-inline' http://localhost:*;
          img-src 'self' data: blob: http://localhost:*;
          connect-src 'self' ws: wss: http://localhost:* ws://localhost:*;
        " />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
