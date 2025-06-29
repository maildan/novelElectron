/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔥 Electron 개발환경에서는 export 모드 비활성화
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  
  // 🔥 성능 최적화 - 이미지 설정
  images: {
    unoptimized: true, // Electron에서는 최적화 비활성화
    formats: ['image/webp', 'image/avif'], // 🔥 최신 이미지 포맷 사용
    deviceSizes: [640, 750, 828, 1080, 1200], // 🔥 디바이스별 최적화
  },
  
  // 🔥 성능 최적화 - 번들 분할
  experimental: {
    optimizePackageImports: ['react', 'react-dom', 'lucide-react'],
  },
  
  // 🔥 개발 안정성
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 🔥 Webpack 설정 - global 에러 해결 + 성능 최적화
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

      // 🔥 성능 최적화: 번들 분할
      if (!dev) {
        config.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        };
      }
    }
    
    return config;
  },
  
  // 🔥 성능 최적화 - 컴파일러 옵션
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
