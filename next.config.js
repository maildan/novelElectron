/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    appDir: true
  },
  webpack: (config, { isServer }) => {
    // Electron 환경에서는 서버 사이드 렌더링 비활성화
    if (isServer) {
      config.target = 'electron-renderer';
    }

    // Node.js 모듈 사용 설정
    config.externals = config.externals || [];
    config.externals.push({
      'electron': 'commonjs electron',
      'uiohook-napi': 'commonjs uiohook-napi',
      'active-win': 'commonjs active-win'
    });

    return config;
  }
};

module.exports = nextConfig;
