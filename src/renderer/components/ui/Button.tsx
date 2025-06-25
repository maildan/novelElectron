import React from 'react';
import { cn } from '@renderer/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'glass' | 'neon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const buttonVariants = {
  variant: {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transform hover:-translate-y-0.5',
    outline: 'border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950',
    ghost: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100',
    destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    glass: 'glass-effect text-slate-700 dark:text-slate-300 hover:backdrop-blur-md',
    neon: 'bg-purple-600 text-white shadow-neon hover:shadow-neon animate-pulse-slow'
  },
  size: {
    sm: 'px-3 py-1.5 text-xs h-8',
    md: 'px-4 py-2 text-sm h-10',
    lg: 'px-6 py-3 text-base h-12',
    icon: 'p-2 w-10 h-10'
  }
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500/50',
          'disabled:opacity-50 disabled:pointer-events-none disabled:transform-none',
          'overflow-hidden group',
          // Variant styles
          buttonVariants.variant[variant],
          // Size styles
          buttonVariants.size[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Content */}
        <div className="relative flex items-center gap-2">
          {loading ? (
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          ) : leftIcon ? (
            <span className="flex-shrink-0">{leftIcon}</span>
          ) : null}
          
          <span className={cn(loading && "opacity-70")}>{children}</span>
          
          {!loading && rightIcon && (
            <span className="flex-shrink-0">{rightIcon}</span>
          )}
        </div>
      </button>
    );
  }
);

Button.displayName = 'Button';
