import React from 'react';
import { cn } from '@renderer/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fallback?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  bordered?: boolean;
  rounded?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl'
};

const statusClasses = {
  online: 'bg-green-500',
  offline: 'bg-slate-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500'
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    className, 
    src, 
    alt, 
    size = 'md', 
    fallback, 
    status,
    bordered = false,
    rounded = true,
    ...props 
  }, ref) => {
    const initials = fallback || alt?.charAt(0).toUpperCase() || '?';

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center flex-shrink-0',
          'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
          'font-medium select-none overflow-hidden',
          sizeClasses[size],
          {
            'rounded-full': rounded,
            'rounded-lg': !rounded,
            'ring-2 ring-white dark:ring-slate-800 shadow-lg': bordered,
          },
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <span className="font-semibold">
            {initials}
          </span>
        )}

        {/* Status indicator */}
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-slate-800',
              statusClasses[status],
              {
                'w-2 h-2': size === 'xs' || size === 'sm',
                'w-3 h-3': size === 'md' || size === 'lg',
                'w-4 h-4': size === 'xl' || size === '2xl',
              }
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
