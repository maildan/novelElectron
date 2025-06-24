/**
 * 개발 환경 체크 유틸리티
 */

export const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

export const isProd = process.env.NODE_ENV === 'production';

export const isTest = process.env.NODE_ENV === 'test';

/**
 * 플랫폼 관련 유틸리티
 */
export const platform = {
  isWindows: process.platform === 'win32',
  isMacOS: process.platform === 'darwin',
  isLinux: process.platform === 'linux'
};

/**
 * 앱 정보
 */
export const appInfo = {
  name: 'Loop',
  version: process.env.npm_package_version || '0.1.0',
  description: '작가를 위한 타이핑 분석 도구'
};

console.log(`🔧 Environment: ${isDev ? 'Development' : 'Production'}`);
console.log(`💻 Platform: ${process.platform}`);
console.log(`📱 App: ${appInfo.name} v${appInfo.version}`);
