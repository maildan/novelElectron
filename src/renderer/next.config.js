/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔥 프로덕션에서만 정적 빌드 활성화 - 오프라인 지원
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
  }),

  // 🔥 개발 환경용 설정
  ...(process.env.NODE_ENV === 'development' && {
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
  }),

  // 🔥 성능 최적화 - 이미지 설정
  images: {
    unoptimized: true, // Electron에서는 최적화 비활성화
  },

  // 🔥 성능 최적화 - 번들 분할 및 트리쉐이킹 + 기가차드 극한 최적화
  experimental: {
    optimizePackageImports: [
      'react',
      'react-dom',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
      'clsx',
      'tailwind-merge'
    ],
    // webpackBuildWorker: true, // 멀티스레드 빌드 - 일부 환경에서 불안정
    // parallelServerBuildTraces: true, // 🔥 병렬 빌드 트레이스 - invalid 옵션
    // parallelServerCompiles: true, // 🔥 병렬 컴파일 - invalid 옵션

    // 🔥 기가차드 극한 최적화 - 유효한 옵션들만
    // useWasmBinary: true, // WASM 바이너리 사용 - invalid 옵션
    // optimizeCss: true, // CSS 최적화 - critters 모듈 에러로 임시 비활성화
    // strictNextHead: true, // Head 컴포넌트 최적화 - invalid 옵션
  },

  // 🔥 Turbopack 설정 (experimental.turbo는 deprecated)
  // turbopack: {
  //   rules: {
  //     '*.svg': ['@svgr/webpack'],
  //   },
  //   // 🔥 Turbopack 메모리 최적화 - memoryLimit는 유효하지 않은 옵션
  //   // memoryLimit: 4096,
  // },

  // 🔥 개발 품질 보장 (TypeScript & ESLint 활성화)
  eslint: {
    ignoreDuringBuilds: false, // ESLint 활성화
    dirs: ['app', 'components', 'hooks', 'lib', 'utils'], // 검사할 디렉토리
  },
  typescript: {
    ignoreBuildErrors: false, // TypeScript 타입 체크 활성화
  },

  // 🔥 Webpack 설정 - global 에러 해결 + 성능 최적화 + Connection closed 방지
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        buffer: false,
        stream: false,
        util: false,
        assert: false,
        url: false,
        querystring: false,
      };

      // Global 폴리필
      config.plugins.push(
        new (require('webpack')).DefinePlugin({
          'global': 'globalThis',
        })
      );

      // 🔥 Connection closed 에러 방지: 안정적인 chunk 이름 생성
      if (!dev) {
        // 고정적인 chunk hash 사용으로 캐시 이슈 방지
        config.optimization.chunkIds = 'deterministic';
        config.optimization.moduleIds = 'deterministic';

        // 🔥 성능 최적화: 고급 번들 분할
        config.optimization.splitChunks = {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            // React 관련 라이브러리 분리
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 20,
            },
            // UI 라이브러리 분리 (Radix, Lucide 등)
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|clsx|tailwind-merge)[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 15,
            },
            // 기타 vendor 라이브러리
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              minChunks: 1,
            },
            // 공통 코드
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        };

        // 🔥 최적화: 트리쉐이킹 강화
        config.optimization.usedExports = true;
        config.optimization.sideEffects = false;
      }
    }

    // 🔥 기가차드 HEAD 요청 완전 제거 - HMR 폴링 비활성화
    if (dev) {
      config.watchOptions = {
        poll: false,           // 폴링 완전 비활성화
        aggregateTimeout: 5000, // 5초 대기로 변경
        ignored: /node_modules/
      };
    }

    return config;
  },

  // 🔥 성능 최적화 - 컴파일러 옵션 (Next.js 15 호환)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
    // 🔥 React 최적화
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // 🔥 압축 최적화
  compress: true,
  // modularizeImports 설정 제거 - lucide-react와 호환성 문제 해결
};

module.exports = nextConfig;
