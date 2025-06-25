/**
 * 🔥 기가차드 App 컴포넌트 - Next.js 15 + Turbopack 버전!
 */
import type { AppProps } from 'next/app';
import '../styles.css';

// 🔥 기가차드 Next.js 15 + Turbopack 호환 글로벌 폴리필!
import '../polyfills/global-turbo.js';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
