'use client';

import { memo } from 'react';

// 🔥 기가차드 WPM Display 컴포넌트 - 실시간 타이핑 속도 표시

export interface WPMDisplayProps {
  currentWPM: number;
  averageWPM: number;
  peakWPM?: number;
  accuracy?: number;
  variant?: 'compact' | 'detailed';
  className?: string;
}

// 🔥 프리컴파일된 스타일 - 동적 생성 금지
const WPM_DISPLAY_STYLES = {
  container: 'bg-white rounded-lg border border-gray-200 p-6 shadow-sm',
  compactContainer: 'bg-white rounded-lg border border-gray-200 p-4 shadow-sm',
  
  header: 'text-lg font-semibold text-gray-900 mb-4',
  compactHeader: 'text-sm font-medium text-gray-700 mb-2',
  
  mainValue: 'text-4xl font-bold text-blue-600 mb-2',
  compactMainValue: 'text-2xl font-bold text-blue-600 mb-1',
  
  label: 'text-sm text-gray-600 mb-4',
  compactLabel: 'text-xs text-gray-600 mb-2',
  
  statsGrid: 'grid grid-cols-2 gap-4',
  compactStatsGrid: 'grid grid-cols-2 gap-2',
  
  statItem: 'text-center',
  statValue: 'text-xl font-semibold text-gray-900',
  compactStatValue: 'text-base font-semibold text-gray-900',
  
  statLabel: 'text-xs text-gray-500',
  
  // 성능 지표 색상
  excellent: 'text-green-600',
  good: 'text-blue-600', 
  average: 'text-yellow-600',
  poor: 'text-red-600',
} as const;

/**
 * WPM 성능 등급 계산
 */
function getWPMGrade(wpm: number): keyof typeof WPM_DISPLAY_STYLES {
  if (wpm >= 80) return 'excellent';
  if (wpm >= 60) return 'good';
  if (wpm >= 40) return 'average';
  return 'poor';
}

/**
 * 🔥 기가차드 WPM Display 컴포넌트
 * 메모이제이션으로 불필요한 리렌더링 방지
 */
export const WPMDisplay = memo<WPMDisplayProps>(({
  currentWPM,
  averageWPM,
  peakWPM,
  accuracy,
  variant = 'detailed',
  className = '',
}) => {
  const isCompact = variant === 'compact';
  const wpmGrade = getWPMGrade(currentWPM);
  
  const containerClass = [
    isCompact ? WPM_DISPLAY_STYLES.compactContainer : WPM_DISPLAY_STYLES.container,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClass}>
      {/* 헤더 */}
      <h3 className={isCompact ? WPM_DISPLAY_STYLES.compactHeader : WPM_DISPLAY_STYLES.header}>
        타이핑 속도
      </h3>

      {/* 메인 WPM 표시 */}
      <div className="text-center mb-4">
        <div className={`${isCompact ? WPM_DISPLAY_STYLES.compactMainValue : WPM_DISPLAY_STYLES.mainValue} ${WPM_DISPLAY_STYLES[wpmGrade]}`}>
          {currentWPM}
        </div>
        <div className={isCompact ? WPM_DISPLAY_STYLES.compactLabel : WPM_DISPLAY_STYLES.label}>
          단어/분 (WPM)
        </div>
      </div>

      {/* 상세 통계 (detailed 모드만) */}
      {!isCompact && (
        <div className={WPM_DISPLAY_STYLES.statsGrid}>
          <div className={WPM_DISPLAY_STYLES.statItem}>
            <div className={WPM_DISPLAY_STYLES.statValue}>
              {averageWPM}
            </div>
            <div className={WPM_DISPLAY_STYLES.statLabel}>
              평균
            </div>
          </div>
          
          {peakWPM && (
            <div className={WPM_DISPLAY_STYLES.statItem}>
              <div className={WPM_DISPLAY_STYLES.statValue}>
                {peakWPM}
              </div>
              <div className={WPM_DISPLAY_STYLES.statLabel}>
                최고
              </div>
            </div>
          )}
          
          {accuracy && (
            <div className={WPM_DISPLAY_STYLES.statItem}>
              <div className={`${WPM_DISPLAY_STYLES.statValue} ${accuracy >= 95 ? WPM_DISPLAY_STYLES.excellent : WPM_DISPLAY_STYLES.good}`}>
                {accuracy.toFixed(1)}%
              </div>
              <div className={WPM_DISPLAY_STYLES.statLabel}>
                정확도
              </div>
            </div>
          )}
        </div>
      )}

      {/* 컴팩트 모드 통계 */}
      {isCompact && (
        <div className={WPM_DISPLAY_STYLES.compactStatsGrid}>
          <div className={WPM_DISPLAY_STYLES.statItem}>
            <div className={WPM_DISPLAY_STYLES.compactStatValue}>
              {averageWPM}
            </div>
            <div className={WPM_DISPLAY_STYLES.statLabel}>평균</div>
          </div>
          
          {accuracy && (
            <div className={WPM_DISPLAY_STYLES.statItem}>
              <div className={WPM_DISPLAY_STYLES.compactStatValue}>
                {accuracy.toFixed(1)}%
              </div>
              <div className={WPM_DISPLAY_STYLES.statLabel}>정확도</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

WPMDisplay.displayName = 'WPMDisplay';

export default WPMDisplay;
