'use client';

import { forwardRef, ReactNode } from 'react';
import { cn } from '../../lib/utils';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const CARD_STYLES = {
  base: 'rounded-lg transition-shadow duration-200',
  variants: {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg border-0',
    outlined: 'bg-transparent border-2 border-gray-300'
  },
  padding: {
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8'
  },
  hover: {
    default: 'hover:shadow-sm',
    elevated: 'hover:shadow-xl',
    outlined: 'hover:border-gray-400'
  }
} as const;

export interface CardProps {
  readonly variant?: keyof typeof CARD_STYLES.variants;
  readonly padding?: keyof typeof CARD_STYLES.padding;
  readonly hoverable?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
  readonly onClick?: () => void;
  readonly role?: string;
  readonly 'aria-label'?: string;
}

// 🔥 기가차드 규칙: forwardRef로 ref 전달 지원
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    variant = 'default', 
    padding = 'md', 
    hoverable = false,
    className, 
    children, 
    onClick,
    role,
    'aria-label': ariaLabel,
    ...props 
  }, ref) => {
    
    const cardClassName = cn(
      CARD_STYLES.base,
      CARD_STYLES.variants[variant],
      CARD_STYLES.padding[padding],
      hoverable && CARD_STYLES.hover[variant],
      onClick && 'cursor-pointer',
      className
    );

    return (
      <div
        ref={ref}
        className={cardClassName}
        onClick={onClick}
        role={role}
        aria-label={ariaLabel}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        } : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
