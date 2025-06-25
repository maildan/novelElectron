import React from 'react';
import { cn } from '@renderer/lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'modern' | 'glass' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  label?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

const inputVariants = {
  default: 'border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 focus:border-purple-500 focus:ring-purple-500/20',
  modern: 'border-2 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 focus:border-purple-500 focus:ring-purple-500/30 shadow-sm',
  glass: 'border border-white/20 bg-white/10 backdrop-blur-md focus:border-purple-400 focus:ring-purple-400/30',
  minimal: 'border-0 border-b-2 border-slate-200 bg-transparent rounded-none focus:border-purple-500 focus:ring-0'
};

const inputSizes = {
  sm: 'px-3 py-1.5 text-sm h-8',
  md: 'px-3 py-2 text-sm h-10',
  lg: 'px-4 py-3 text-base h-12'
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md',
    error, 
    label, 
    hint, 
    leftIcon,
    rightIcon,
    loading,
    disabled,
    ...props 
  }, ref) => {
    const inputClasses = cn(
      'w-full rounded-lg transition-all duration-200',
      'placeholder:text-slate-400 dark:placeholder:text-slate-500',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'text-slate-900 dark:text-slate-100',
      inputVariants[variant],
      inputSizes[size],
      {
        'border-red-500 focus:border-red-500 focus:ring-red-500/20': error,
        'pl-10': !!leftIcon,
        'pr-10': !!(rightIcon || loading),
      },
      className
    );

    const InputElement = (
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            {leftIcon}
          </div>
        )}
        
        {/* Input */}
        <input
          ref={ref}
          className={inputClasses}
          disabled={disabled || loading}
          {...props}
        />
        
        {/* Right Icon or Loading */}
        {(rightIcon || loading) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              rightIcon
            )}
          </div>
        )}
        
        {/* Focus Ring Enhancement */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
      </div>
    );

    if (label) {
      return (
        <div className="group space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {InputElement}
          {hint && (
            <p className={cn(
              'text-xs transition-colors duration-200',
              error ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'
            )}>
              {hint}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="group">
        {InputElement}
      </div>
    );
  }
);

Input.displayName = 'Input';
