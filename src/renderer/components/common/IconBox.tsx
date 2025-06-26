import React from 'react';
import { Logger } from '../../shared/logger';

interface IconBoxProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * 🔥 기가차드 IconBox - Statistics.tsx의 중복된 아이콘 박스 패턴 통합
 * w-10 h-10 rounded-lg flex items-center justify-center bg-{color}-100 text-{color}-600 패턴을 모듈화
 */
export function IconBox({ 
  icon: Icon, 
  color, 
  size = 'md', 
  className = '' 
}: IconBoxProps) {
  Logger.debug('ICONBOX', `// #DEBUG: IconBox 렌더링 - color: ${color}, size: ${size}`);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  const iconClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-lg 
        flex items-center justify-center 
        ${colorClasses[color]}
        ${className}
      `}
    >
      <Icon className={iconClasses[size]} />
    </div>
  );
}

Logger.info('MODULE_LOADED', '🔥 IconBox 모듈 로드 완료');
