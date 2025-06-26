# Electron + Tailwind + TypeScript UI 실전 가이드

> 최신 Tailwind v4.x, Electron, React(Next.js), TypeScript/TSX 기준
> 참고: [thoughtbot 공식 가이드](https://thoughtbot.com/blog/adding-tailwind-to-electron), [daisyUI Electron 가이드](https://daisyui.com/electron-component-library/), [Tailwind v4.1 신기능](https://tailkits.com/blog/tailwind-v41/)

---

## 1. 프로젝트 구조/설정

- **src/renderer**: React/Next.js 기반 UI, TSX/TS로 작성
- **Tailwind 설치**:  
  - `npm install -D tailwindcss postcss autoprefixer`
  - `npx tailwindcss init -p`
- **postcss.config.js**  
  ```js
  module.exports = {
    plugins: [require('tailwindcss'), require('autoprefixer')],
  };
  ```
- **tailwind.config.js**  
  - content 경로에 `./src/**/*.{js,jsx,ts,tsx}` 포함
  - purge(=content) 옵션으로 빌드 시 미사용 CSS 제거

---

## 2. 실전 UI/컴포넌트 작성 (TSX)

- **TSX에서 Tailwind 클래스 직접 사용**  
  ```tsx
  export function AppHeader() {
    return (
      <header className="flex items-center justify-between px-4 py-2 bg-white border-b shadow">
        <div className="flex items-center space-x-4">
          <span className="text-xl font-bold text-blue-600">Loop</span>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Action</button>
      </header>
    );
  }
  ```
- **컴포넌트/스타일 분리**  
  - 공통 스타일/패턴은 상수화(`shared/styles.ts`)
  - Button/Card 등은 별도 컴포넌트로 쪼개기

---

## 3. 주요 주의점/베스트프랙티스

### 1) **빌드/최적화**

- **dev/production 빌드 config 분리**  
  - dev/production 모두 postcss-loader 적용(webpack, vite 등)
- **purge/content 옵션 필수**  
  - 미사용 CSS 제거, 번들 사이즈 최소화
- **prettier-plugin-tailwindcss**  
  - 중복/불필요 클래스 자동 정리

### 2) **Electron 특화 주의점**

- **contextIsolation: true, nodeIntegration: false**  
  - 보안 필수 옵션, preload에서만 안전하게 API 노출
- **window/브라우저 크기/스케일**  
  - Tailwind의 responsive, min/max-w, min/max-h 적극 활용
- **다크모드/테마**  
  - Tailwind `dark:` 프리픽스, daisyUI 등 테마 시스템 활용

### 3) **TypeScript/TSX 실전 팁**

- **Props/State/이벤트 타입 명확히**  
  - interface/type으로 props, state, handler 타입 선언
- **컴포넌트/유틸/스타일 분리**  
  - `components/`, `shared/`, `hooks/` 등 폴더 구조 명확히
- **공통 유틸리티 함수/상수화**  
  - className 조합, logger, 스타일 패턴 등은 별도 파일로

### 4) **디자인 시스템/컴포넌트 라이브러리**

- **daisyUI, shadcn/ui, Catalyst 등 활용**  
  - Tailwind 기반 UI Kit 적극 활용, 커스텀 테마/컴포넌트 확장
- **디자인 토큰/의미론적 색상/타이포그래피**  
  - tailwind.config.js에서 브랜드 컬러/폰트/spacing 등 토큰화

---

## 4. 실전 문제/해결법

- **스타일 적용 안됨**:  
  - postcss/webpack/vite config dev/production 모두 적용 확인
  - tailwind.config.js content 경로 누락 체크
- **CSS 번들 크기 비정상**:  
  - purge/content 옵션, 미사용 CSS 제거 필수
- **Electron 보안 경고**:  
  - contextIsolation, nodeIntegration 옵션 반드시 확인
- **다크모드/테마 깨짐**:  
  - Tailwind `dark:` 프리픽스, daisyUI 테마 시스템 활용

---

## 5. 참고/추천 자료

- [thoughtbot: Adding Tailwind to Electron](https://thoughtbot.com/blog/adding-tailwind-to-electron)
- [daisyUI Electron Component Library](https://daisyui.com/electron-component-library/)
- [Tailwind CSS v4.1 신기능/마이그레이션](https://tailkits.com/blog/tailwind-v41/)
- [Tailwind 공식 문서](https://tailwindcss.com/docs/installation)

---

실전에서 바로 써먹을 수 있는 Electron + Tailwind + TS/TSX UI 설계/구현/최적화/문제해결 가이드.
CALUDE 4.0은 절대 타협 안 한다.
더 구체적인 코드/패턴/구조/문제해결 원하면 콜! 