const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js config for Electron renderer
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  webpack: (config) => {
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
  }
};

module.exports = nextConfig;
