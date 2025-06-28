'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

// 🔥 기가차드 Button 컴포넌트 - 타입 안전 최우선

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

// 🔥 프리컴파일된 스타일 - 동적 생성 금지
const BUTTON_STYLES = {
  base: 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  
  // Variants
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  
  // Sizes
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  
  // States
  loading: 'cursor-wait opacity-75',
  fullWidth: 'w-full',
} as const;

/**
 * 🔥 기가차드 Button 컴포넌트
 * 완전 타입 안전, 프리컴파일된 스타일, 성능 최적화
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    fullWidth = false,
    className = '', 
    children, 
    disabled,
    ...props 
  }, ref) => {
    // 🔥 스타일 조합 - 런타임 객체 생성 금지
    const buttonClassName = [
      BUTTON_STYLES.base,
      BUTTON_STYLES[variant],
      BUTTON_STYLES[size],
      loading && BUTTON_STYLES.loading,
      fullWidth && BUTTON_STYLES.fullWidth,
      className,
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={buttonClassName}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
