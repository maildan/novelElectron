import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Logger } from '../../shared/logger';
import { getButtonClassName } from './optimized-styles';
import { ICON_PATTERNS } from './optimized-styles';

interface PlayPauseToggleProps {
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
  startText?: string;
  stopText?: string;
  startVariant?: 'primary' | 'secondary' | 'danger' | 'purple';
  stopVariant?: 'primary' | 'secondary' | 'danger' | 'purple';
  disabled?: boolean;
  className?: string;
}

/**
 * 🔥 기가차드 PlayPauseToggle - 중복된 시작/중지 버튼 로직 통합
 * Dashboard.tsx와 TypingBox.tsx에서 중복되던 Play/Pause 패턴을 하나로 모듈화
 */
export function PlayPauseToggle({
  isActive,
  onStart,
  onStop,
  startText = '시작',
  stopText = '중지',
  startVariant = 'primary',
  stopVariant = 'danger',
  disabled = false,
  className = ''
}: PlayPauseToggleProps) {
  Logger.debug('PLAYPAUSE', `// #DEBUG: PlayPauseToggle 렌더링 - isActive: ${isActive}`);

  const handleClick = () => {
    Logger.debug('PLAYPAUSE', `// #DEBUG: PlayPauseToggle 클릭 - isActive: ${isActive}`);
    if (isActive) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${getButtonClassName({ variant: isActive ? stopVariant : startVariant })} ${className}`}
    >
      {isActive ? (
        <>
          <Pause className={ICON_PATTERNS.w4h4} />
          {stopText}
        </>
      ) : (
        <>
          <Play className={ICON_PATTERNS.w4h4} />
          {startText}
        </>
      )}
    </button>
  );
}

Logger.info('MODULE_LOADED', '🔥 PlayPauseToggle 모듈 로드 완료');