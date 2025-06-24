/** @type {import('next').NextConfig} */
const nextConfig = {
  // Electron과 통합을 위한 설정
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // 개발 환경 설정
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer'
    }
    return config
  },

  // 실험적 기능
  experimental: {
    esmExternals: false
  }
}

module.exports = nextConfig
