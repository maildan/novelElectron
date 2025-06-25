/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: false
  },
  // 🔥 기가차드 Turbopack stable 설정!
  turbopack: {
    resolveAlias: {
      'global': 'globalThis',
      'process': 'process/browser'
    }
  }
};

module.exports = nextConfig;
