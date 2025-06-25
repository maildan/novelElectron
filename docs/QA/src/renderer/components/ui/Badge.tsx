import React from 'react';
import { cn } from '@renderer/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'primary' | 'secondary' | 'ghost' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  pulse?: boolean;
  children: React.ReactNode;
}

const badgeVariants = {
  variant: {
    default: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
    warning: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
    error: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
    primary: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
    secondary: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
    ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
    outline: 'border-2 border-slate-300 text-slate-700 bg-transparent dark:border-slate-600 dark:text-slate-300',
    gradient: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg'
  },
  size: {
    sm: 'px-2 py-0.5 text-xs h-5',
    md: 'px-2.5 py-1 text-xs h-6',
    lg: 'px-3 py-1.5 text-sm h-7'
  }
};

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', icon, pulse = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-full font-medium border transition-all duration-200',
          'whitespace-nowrap select-none',
          badgeVariants.variant[variant],
          badgeVariants.size[size],
          pulse && 'animate-pulse',
          className
        )}
        {...props}
      >
        {icon && (
          <span className="flex-shrink-0">
            {icon}
          </span>
        )}
        <span>{children}</span>
        {pulse && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
          </span>
        )}
      </div>
    );
  }
);

Badge.displayName = 'Badge';
