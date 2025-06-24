const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    esmExternals: false // 명시적으로 비활성화
  },
  webpack: (config, { isServer }) => {
    // Electron 환경에서는 서버 사이드 렌더링 비활성화
    if (isServer) {
      config.target = 'electron-renderer';
    }

    // TypeScript path aliases 수동 추가
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@main': path.resolve(__dirname, 'src/main'),
      '@renderer': path.resolve(__dirname, 'src/renderer'),
      '@shared': path.resolve(__dirname, 'src/shared')
    };

    // Node.js 네이티브 모듈 externals 설정
    config.externals = config.externals || [];
    config.externals.push({
      'electron': 'commonjs electron',
      'uiohook-napi': 'commonjs uiohook-napi', 
      'get-windows': 'commonjs get-windows'
    });

    // Native 모듈 fallback 설정
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false
    };

    return config;
  },
  // 최신 Next.js 버전에서는 experimental.esmExternals 제거됨
  transpilePackages: ['lucide-react']
};

module.exports = nextConfig;
