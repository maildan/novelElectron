/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔥 기가차드 Electron + Next.js 15 + Turbopack 통합!
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // 🔥 Turbopack stable 설정!
  turbopack: {
    resolveAlias: {
      'global': 'globalThis',
      'process': 'process/browser'
    }
  }
}

module.exports = nextConfig
