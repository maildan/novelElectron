// 공통 스타일 유틸리티 (기가차드 스타일)

// classNames: 조건부 Tailwind className 조합
export function classNames(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// 예시: 프리컴파일 스타일 시스템 확장
export const SHARED_STYLES = {
  errorText: 'text-red-600 dark:text-red-400 font-semibold',
  successText: 'text-green-600 dark:text-green-400 font-semibold',
  infoText: 'text-blue-600 dark:text-blue-400',
}; 