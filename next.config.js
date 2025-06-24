const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    // 🔥 기가차드 완전 해결: Electron 환경 설정
    if (!isServer) {
      config.target = 'electron-renderer';
    }

    // webpack 플러그인 초기화
    config.plugins = config.plugins || [];
    const webpack = require('webpack');
    
    // 🚀 Step 1: 가장 강력한 global 폴리필
    config.plugins.push(
      new webpack.DefinePlugin({
        'global': 'globalThis',
        'global.global': 'globalThis',
        'window.global': 'globalThis',
        'self.global': 'globalThis',
        'this.global': 'globalThis'
      })
    );

    // 🚀 Step 2: ProvidePlugin으로 자동 주입
    config.plugins.push(
      new webpack.ProvidePlugin({
        global: 'globalThis',
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser'
      })
    );

    // 🔥 Step 3: Node.js 모듈 폴백 설정
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
      // 🔥 global 완전 차단 - globalThis 사용 강제
      global: false
    };

    // 🔥 Step 4: alias 설정으로 확실히 교체
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@main': path.resolve(__dirname, 'src/main'),
      '@renderer': path.resolve(__dirname, 'src/renderer'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      // 🚀 global을 완전히 globalThis로 교체
      'global': 'globalThis'
    };

    // 🔥 Step 5: externals 설정
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push({
        'electron': 'commonjs electron',
        'uiohook-napi': 'commonjs uiohook-napi', 
        'get-windows': 'commonjs get-windows'
      });
    }

    // 🔥 Step 6: 실험적 기능 비활성화 및 HMR 최적화
    config.experiments = {
      ...config.experiments,
      topLevelAwait: false
    };

    // 🚀 HMR 최적화 (무한 컴파일 방지)
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
  // 🔥 실험적 기능 설정
  experimental: {
    esmExternals: false,
    // HMR 최적화 설정 추가
    optimizePackageImports: ['lucide-react'],
    optimizeCss: false,
    turbo: false  // Turbo 비활성화로 안정성 확보
  },
  // 🔥 추가 패키지 트랜스파일
  transpilePackages: ['lucide-react']
};

module.exports = nextConfig;
