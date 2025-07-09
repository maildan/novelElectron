'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const BUTTON_STYLES = {
  base: 'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  variants: {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  },
  sizes: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2'
  }
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: keyof typeof BUTTON_STYLES.variants;
  readonly size?: keyof typeof BUTTON_STYLES.sizes;
  readonly loading?: boolean;
  readonly loadingText?: string;
  readonly children: ReactNode;
  readonly 'aria-label'?: string;
}

// 🔥 기가차드 규칙: forwardRef와 명시적 타입
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md',
    loading = false,
    loadingText,
    disabled,
    className,
    children,
    'aria-label': ariaLabel,
    ...props 
  }, ref) => {
    
    const isDisabled = disabled || loading;
    
    const buttonClassName = cn(
      BUTTON_STYLES.base,
      BUTTON_STYLES.variants[variant],
      BUTTON_STYLES.sizes[size],
      className
    );

    return (
      <button
        ref={ref}
        className={buttonClassName}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2 
            className="w-4 h-4 mr-2 animate-spin" 
            aria-hidden="true"
          />
        )}
        {loading && loadingText ? loadingText : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
