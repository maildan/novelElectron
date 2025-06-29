/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔥 Electron 개발환경에서는 export 모드 비활성화
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  
  // 🔥 기본 설정
  images: {
    unoptimized: true,
  },
  
  // 🔥 개발 안정성
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 🔥 Webpack 설정 - global 에러 해결
  webpack: (config, { isServer }) => {
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
    }
    
    return config;
  },
};

module.exports = nextConfig;
