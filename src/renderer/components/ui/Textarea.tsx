import React from 'react';
import { cn } from '@renderer/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'modern' | 'glass' | 'minimal';
  error?: boolean;
  label?: string;
  hint?: string;
  autoResize?: boolean;
}

const textareaVariants = {
  default: 'border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 focus:border-purple-500 focus:ring-purple-500/20',
  modern: 'border-2 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 focus:border-purple-500 focus:ring-purple-500/30 shadow-sm',
  glass: 'border border-white/20 bg-white/10 backdrop-blur-md focus:border-purple-400 focus:ring-purple-400/30',
  minimal: 'border-0 border-b-2 border-slate-200 bg-transparent rounded-none focus:border-purple-500 focus:ring-0'
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant = 'default',
    error, 
    label, 
    hint, 
    autoResize = false,
    disabled,
    ...props 
  }, ref) => {
    const textareaClasses = cn(
      'w-full rounded-lg px-3 py-2 text-sm transition-all duration-200',
      'placeholder:text-slate-400 dark:placeholder:text-slate-500',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'text-slate-900 dark:text-slate-100',
      'resize-none',
      textareaVariants[variant],
      {
        'border-red-500 focus:border-red-500 focus:ring-red-500/20': error,
        'resize-y': !autoResize,
        'min-h-[80px]': true,
      },
      className
    );

    const TextareaElement = (
      <div className="relative">
        <textarea
          ref={ref}
          className={textareaClasses}
          disabled={disabled}
          {...props}
        />
        
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
          {TextareaElement}
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
        {TextareaElement}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
