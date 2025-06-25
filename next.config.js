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
  
  // 🔥 무한 컴파일 루프 완전 박살! - 기가차드 궁극기
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // 파일 변경 감지 억제 - 폴링 완전 비활성화
      config.watchOptions = {
        poll: false,
        aggregateTimeout: 2000,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/dist/**',
          '**/out/**',
          '**/.next/**',
          '**/.vscode/**',
          '**/logs/**',
          '**/*.log',
          '**/*.tsbuildinfo',
          '**/prisma/**',
          '**/userData/**',
          '**/backup/**',
          '**/scripts/**',
          '**/.DS_Store',
          '**/docs/**',
          '**/*.md'
        ]
      };
      
      // HMR 최적화 - 불필요한 최적화 비활성화
      if (!isServer) {
        config.optimization = {
          ...config.optimization,
          removeAvailableModules: false,
          removeEmptyChunks: false,
          splitChunks: false,
        };
      }
      
      // 🔥 로깅 레벨 억제
      config.infrastructureLogging = { level: 'error' };
      config.stats = 'errors-warnings';
    }

    // Add webpack aliases - paths relative to project root
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
  
  // 🔥 실험적 기능 최소화
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
