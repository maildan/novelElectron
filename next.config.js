const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔥 기가차드 Next.js + Electron 최적화 설정
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // 🔥 핫리로드 지옥 방지! - 기가차드 업그레이드
  webpack: (config, { dev }) => {
    if (dev) {
      // 파일 변경 감지 최적화
      config.watchOptions = {
        ...config.watchOptions,
        poll: 3000, // 3초마다 폴링 (더 느리게 해서 CPU 절약)
        aggregateTimeout: 1500, // 1.5초 지연 (무한 리컴파일 방지)
        ignored: [
          /node_modules/,
          /\.git/,
          /dist/,
          /out/,
          /\.next/,
          /\.vscode/,
          /logs/,
          /\.log$/,
          /\.tsbuildinfo$/,
          /prisma/,
          /userData/,
          /backup/,
          /scripts/
        ]
      };
      
      // 파일 시스템 감시 최적화
      config.snapshot = {
        ...config.snapshot,
        managedPaths: [/^(.+?[\\/]node_modules[\\/])/],
        immutablePaths: [/^(.+?[\\/]node_modules[\\/])/]
      };
      
      // 🔥 메모리 및 CPU 사용량 최적화
      config.infrastructureLogging = { level: 'error' };
      config.stats = 'errors-warnings';
    }

    // Add webpack aliases - paths relative to project root, not src/renderer
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@main': path.resolve(__dirname, 'src/main'),
      '@renderer': path.resolve(__dirname, 'src/renderer'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@preload': path.resolve(__dirname, 'src/preload'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@keyboard': path.resolve(__dirname, 'src/main/keyboard'),
      '@managers': path.resolve(__dirname, 'src/main/managers'),
      '@handlers': path.resolve(__dirname, 'src/main/handlers'),
      '@core': path.resolve(__dirname, 'src/main/core'),
      '@config': path.resolve(__dirname, 'src/main/config'),
      '@services': path.resolve(__dirname, 'src/main/services'),
      '@components': path.resolve(__dirname, 'src/renderer/components'),
      '@hooks': path.resolve(__dirname, 'src/renderer/hooks'),
      '@styles': path.resolve(__dirname, 'src/renderer/styles'),
      '@lib': path.resolve(__dirname, 'src/renderer/lib')
    };
    
    return config;
  },
  
  // 🔥 실험적 기능으로 성능 향상
  experimental: {
    turbo: {
      resolveAlias: {
        'global': 'globalThis',
        'process': 'process/browser'
      }
    }
  }
};

module.exports = nextConfig;
