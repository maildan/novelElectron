'use client';

import { useState, useRef, useEffect } from 'react';
import { CommonComponentProps } from '../../../shared/types';
import { Play, Pause, RotateCcw } from 'lucide-react';

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
    <div className={`bg-white border border-slate-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900">타이핑 연습</h3>
        <div className="flex items-center gap-2">
          {!isTyping ? (
            <button
              onClick={startTyping}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Play className="w-4 h-4" />
              시작
            </button>
          ) : (
            <button
              onClick={stopTyping}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
            >
              <Pause className="w-4 h-4" />
              완료
            </button>
          )}
          <button
            onClick={resetTyping}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-500 text-white rounded-md hover:bg-slate-600 transition-colors text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            리셋
          </button>
        </div>
      </div>

      {/* 통계 표시 */}
      {isTyping && (
        <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{keyCount}</div>
            <div className="text-xs text-blue-600">키 입력</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{duration}</div>
            <div className="text-xs text-green-600">초</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{wpm}</div>
            <div className="text-xs text-purple-600">타/분</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{content.length}</div>
            <div className="text-xs text-orange-600">글자</div>
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
