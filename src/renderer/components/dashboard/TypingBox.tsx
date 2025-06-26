'use client';

import { useState, useRef, useEffect } from 'react';
import { CommonComponentProps } from '@shared/types';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { PlayPauseToggle } from '../common/PlayPauseToggle';
import { 
  FLEX_PATTERNS, 
  ICON_PATTERNS,
  TEXT_PATTERNS,
  flexBetween,
  getButtonClassName
} from '../common/optimized-styles';
import { getCardClassName } from '../common/optimized-styles';

interface TypingBoxProps extends Pick<CommonComponentProps, 'onTypingComplete'> {
  className?: string;
}

export function TypingBox({ onTypingComplete, className = '' }: TypingBoxProps) {
  const [content, setContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [keyCount, setKeyCount] = useState(0);
  const [lastKeyTime, setLastKeyTime] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const IDLE_TIMEOUT = 3000; // 3초

  // 타이핑 시작
  const startTyping = () => {
    const now = Date.now();
    setStartTime(now);
    setLastKeyTime(now);
    setIsTyping(true);
    setKeyCount(0);
    setContent('');
  };

  // 타이핑 중지
  const stopTyping = () => {
    if (isTyping && startTime) {
      const endTime = Date.now();
      const typingTime = Math.round((endTime - startTime) / 1000);
      
      // 결과 전송
      onTypingComplete({
        content: content.trim(),
        keyCount,
        typingTime,
        timestamp: new Date().toISOString(),
        totalChars: content.length
      });
    }

    setIsTyping(false);
    setStartTime(null);
    setLastKeyTime(null);
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
  };

  // 리셋
  const resetTyping = () => {
    setContent('');
    setKeyCount(0);
    setIsTyping(false);
    setStartTime(null);
    setLastKeyTime(null);
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
  };

  // 키 입력 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isTyping) return;

    const now = Date.now();
    setLastKeyTime(now);
    setKeyCount(prev => prev + 1);

    // 기존 idle timeout 클리어
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }

    // 새로운 idle timeout 설정
    idleTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, IDLE_TIMEOUT);
  };

  // 텍스트 변경 처리
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // 자동 시작
    if (!isTyping && newContent.length > 0) {
      startTyping();
    }
  };

  // 통계 계산
  const getStats = () => {
    if (!startTime || !lastKeyTime) return { wpm: 0, duration: 0 };
    
    const duration = Math.round((lastKeyTime - startTime) / 1000);
    const wpm = duration > 0 ? Math.round((keyCount / duration) * 60) : 0;
    
    return { wpm, duration };
  };

  const { wpm, duration } = getStats();

  return (
    <div className={getCardClassName({ variant: 'settings', className })}>
      <div className={`${flexBetween} mb-4`}>
        <h3 className="font-semibold text-slate-900">타이핑 연습</h3>
        <div className={FLEX_PATTERNS.itemsCenterGap2}>
          <PlayPauseToggle
            isActive={isTyping}
            onStart={startTyping}
            onStop={stopTyping}
            startText="시작"
            stopText="완료"
          />
          <button
            onClick={resetTyping}
            className={getButtonClassName({ variant: 'secondary' })}
          >
            <RotateCcw className={ICON_PATTERNS.w4h4} />
            리셋
          </button>
        </div>
      </div>

      {/* 통계 표시 */}
      {isTyping && (
        <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-blue-50 rounded-lg">
          <div className={TEXT_PATTERNS.center}>
            <div className={TEXT_PATTERNS.statValueBlue}>{keyCount}</div>
            <div className={TEXT_PATTERNS.statLabel}>키 입력</div>
          </div>
          <div className={TEXT_PATTERNS.center}>
            <div className={TEXT_PATTERNS.statValueGreen}>{duration}</div>
            <div className={TEXT_PATTERNS.statLabelGreen}>초</div>
          </div>
          <div className={TEXT_PATTERNS.center}>
            <div className={TEXT_PATTERNS.statValuePurple}>{wpm}</div>
            <div className={TEXT_PATTERNS.statLabelPurple}>타/분</div>
          </div>
          <div className={TEXT_PATTERNS.center}>
            <div className={TEXT_PATTERNS.statValueOrange}>{content.length}</div>
            <div className={TEXT_PATTERNS.statLabelOrange}>글자</div>
          </div>
        </div>
      )}

      {/* 텍스트 영역 */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder="여기에 텍스트를 입력하세요. 입력을 시작하면 자동으로 모니터링이 시작됩니다."
        className="w-full h-40 p-4 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={false}
      />

      {/* 도움말 */}
      <div className="mt-3 text-xs text-slate-500">
        💡 팁: 텍스트 입력을 시작하면 자동으로 모니터링이 시작됩니다. 3초간 입력이 없으면 자동으로 완료됩니다.
      </div>
    </div>
  );
}
