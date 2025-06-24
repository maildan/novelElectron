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

    // 🔥 강력한 Global 변수 정의 (Node.js 환경 호환성)
    config.plugins = config.plugins || [];
    const webpack = require('webpack');
    
    // DefinePlugin과 ProvidePlugin 모두 사용하여 global 문제 완전 해결
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'global': 'globalThis',
        'window.global': 'globalThis'
      }),
      new webpack.ProvidePlugin({
        global: 'globalThis',
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser'
      })
    );

    // 🔥 강력한 글로벌 폴리필 추가
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      crypto: false,
      stream: false,
      buffer: require.resolve('buffer'),
      util: require.resolve('util'),
      process: require.resolve('process/browser'),
      global: false // global을 false로 설정하여 globalThis 사용 강제
    };

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

    // Native 모듈 fallback 설정은 이미 위에서 처리됨

    return config;
  },
  // 최신 Next.js 버전에서는 experimental.esmExternals 제거됨
  transpilePackages: ['lucide-react']
};

module.exports = nextConfig;
