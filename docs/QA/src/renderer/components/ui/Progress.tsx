import React from 'react';
import { cn } from '@renderer/lib/utils';

export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'modern';
  className?: string;
  showLabel?: boolean;
  label?: string;
}

const progressVariants = {
  size: {
    sm: 'h-2',
    md: 'h-3', 
    lg: 'h-4'
  }
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  className,
  showLabel = false,
  label
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {label || `Progress`}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div 
        className={cn(
          'bg-gray-200 rounded-full overflow-hidden',
          variant === 'modern' ? 'progress-modern' : '',
          progressVariants.size[size]
        )}
      >
        <div
          className={cn(
            'bg-blue-500 transition-all duration-500 ease-out',
            variant === 'modern' ? 'progress-modern-bar' : 'h-full'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
