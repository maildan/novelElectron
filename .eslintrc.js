// .eslintrc.js - 완전 수정 버전
// 🔥 기가차드 ESLint v8 설정 - Next.js 15 App Router + TypeScript + Electron 최적화
// .eslintrc.js - 최신 Next.js 15 방식
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Pages Router 관련 규칙들 모두 끔
    '@next/next/no-html-link-for-pages': 'off',
    '@next/next/no-sync-scripts': 'off',
    
    // 개발 편의를 위한 완화된 규칙들
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-console': 'off',
  },
  
  // 🔥 기가차드 무시 패턴 - 빌드된 파일들과 자동 생성 파일 제외
  ignorePatterns: [
    'out/**/*',
    'build/**/*', 
    'dist/**/*',
    '.next/**/*',
    'node_modules/**/*',
    '*.min.js',
    'coverage/**/*',
    '_next/**/*',
    'static/**/*',
    '*.tsbuildinfo',
    'vendors-*.js',
    'webpack-*.js',
    '_buildManifest.js',
    '_ssgManifest.js'
  ],

  env: {
    browser: true,
    node: true,
    es2022: true,
  },

  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  // 🔥 Next.js 15 App Router 설정
  settings: {
    next: {
      rootDir: './src/renderer', // App Router 위치 지정
    },
  },

  rules: {
    // 🔥 기가차드 개발용 완화된 ESLint 규칙 - 생산성 우선
    '@typescript-eslint/no-explicit-any': 'off', // any 타입 허용 (개발 단계)
    '@typescript-eslint/no-unused-vars': 'off', // 사용하지 않는 변수 허용
    '@typescript-eslint/no-unsafe-function-type': 'off', // Function 타입 허용
    '@typescript-eslint/no-unused-expressions': 'off', // 빌드된 파일 호환성
    '@typescript-eslint/no-this-alias': 'off', // 레거시 코드 호환성
    '@typescript-eslint/no-require-imports': 'off', // CommonJS 호환성
    '@typescript-eslint/no-namespace': 'off', // 타입 정의 호환성
    '@typescript-eslint/ban-ts-comment': 'off', // @ts-ignore 허용
    '@typescript-eslint/no-empty-object-type': 'off', // 빈 인터페이스 허용
    
    // 🔥 Next.js 특별 규칙 - App Router 호환
    '@next/next/no-html-link-for-pages': 'off', // ⭐ 핵심: Pages Router 규칙 비활성화
    '@next/next/no-assign-module-variable': 'off', // Electron 환경 호환성
    '@next/next/no-img-element': 'off', // img 태그 허용
    
    'prefer-const': 'off', // let vs const 자유롭게
    'no-console': 'off', // console.log 허용 (개발 단계)
    'no-var': 'off', // var 사용 허용
    'react-hooks/exhaustive-deps': 'off', // React 의존성 체크 끔
    'import/no-anonymous-default-export': 'off', // 익명 export 허용
  },

  overrides: [
    {
      // 🔥 타입 정의 파일 특별 규칙
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-function-type': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/ban-types': 'off',
        'no-var': 'off',
        'no-console': 'off',
      }
    },
    {
      // 🔥 설정 파일 특별 규칙
      files: ['**/*.config.{js,mjs,ts}', '**/tailwind.config.*'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off', // 설정 파일에서 사용하지 않는 변수 허용
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off',
      }
    },
    {
      // 🔥 테스트 파일 특별 규칙
      files: ['**/*.test.{js,jsx,ts,tsx}', '**/__tests__/**/*.{js,jsx,ts,tsx}', '**/test/**/*.{js,jsx,ts,tsx}'],
      env: {
        jest: true,
      },
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
      rules: {
        // 🔥 테스트 파일에서는 관대한 규칙
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-namespace': 'off',
        'no-console': 'off',
      }
    }
  ]
};