const path = require('path');
const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    // 🔥 Electron 렌더러 프로세스 타겟 설정
    if (!isServer) {
      config.target = 'electron-renderer';
    }

    // 🚀 Step 1: 강력한 DefinePlugin으로 global 완전 교체
    config.plugins.push(
      new webpack.DefinePlugin({
        'global': 'globalThis',
        'global.global': 'globalThis',
        'window.global': 'globalThis',
        'self.global': 'globalThis',
        'this.global': 'globalThis',
        // 🔥 추가: process 환경 변수도 정의
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      })
    );

    // 🚀 Step 2: ProvidePlugin으로 자동 주입
    config.plugins.push(
      new webpack.ProvidePlugin({
        global: ['globalThis'],
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      })
    );

    // 🔥 Step 3: Node.js 폴백 설정 (global 차단)
    config.resolve = config.resolve || {};
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
      assert: false,
      http: false,
      https: false,
      url: false,
      zlib: false,
      // 🔥 global을 false로 설정하여 globalThis 사용 강제
      global: false
    };

    // 🚀 Step 4: alias 설정
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@main': path.resolve(__dirname, 'src/main'),
      '@renderer': path.resolve(__dirname, 'src/renderer'),
      '@shared': path.resolve(__dirname, 'src/shared'),
    };

    // 🔥 Step 5: externals 설정
    if (!config.externals) {
      config.externals = [];
    }
    if (Array.isArray(config.externals)) {
      config.externals.push({
        'electron': 'commonjs electron',
        'uiohook-napi': 'commonjs uiohook-napi', 
        'get-windows': 'commonjs get-windows'
      });
    }

    // 🚀 Step 6: HMR 최적화 (무한 컴파일 방지)
    if (!isServer) {
      config.watchOptions = {
        poll: false,
        ignored: [
          '**/node_modules',
          '**/dist',
          '**/out',
          '**/.git',
          '**/logs',
          '**/userData',
          '**/prisma/dev.db*'
        ]
      };
      
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename]
        }
      };
    }

    return config;
  },
  experimental: {
    esmExternals: false,
    // HMR 최적화 설정 추가
    optimizePackageImports: ['lucide-react']
  },
  transpilePackages: ['lucide-react']
};

module.exports = nextConfig;
