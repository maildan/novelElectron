import { Logger } from "@shared/logger";
const log = Logger;'use client';

import React, { useState } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent, Input } from '@renderer/components/ui';
import { cn } from '@renderer/lib/utils';
import { Sparkles, X, Send } from 'lucide-react';

export interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const AIPanel: React.FC<AIPanelProps> = ({ isOpen, onClose, className }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      // TODO: AI 서비스 연동
      log.info("Console", 'AI 질문:', prompt);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 지연
      setPrompt('');
    } catch (error) {
      log.error("Console", 'AI 질문 처리 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed top-4 right-4 w-80 z-50 max-h-[80vh] overflow-hidden',
        'glass-effect shadow-lg animate-elastic-in',
        className
      )}
      role="dialog"
      aria-label="AI 도우미 패널"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <h3 className="font-semibold text-lg">Loop AI 도우미</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 bg-white/95 backdrop-blur-sm">
        {/* 추천 질문 */}
        <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <strong>추천 질문</strong>
          </div>
          <div className="space-y-1 text-xs">
            <div>&ldquo;오늘 작성할 내용 아이디어 줘&rdquo;</div>
            <div>&ldquo;이 문단을 더 매력적으로 써줘&rdquo;</div>
            <div>&ldquo;캐릭터 설정 도움이 필요해&rdquo;</div>
            <div>&ldquo;타이핑 습관 분석해줘&rdquo;</div>
          </div>
        </div>

        {/* 입력 영역 */}
        <div className="space-y-3">
          <textarea
            placeholder="질문을 입력하세요..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className={cn(
              'w-full min-h-[80px] p-3 border border-slate-300 rounded-lg',
              'resize-none focus:outline-none focus:ring-2 focus:ring-purple-500',
              'transition-all duration-200'
            )}
          />
          
          <Button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                처리중...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                질문하기
              </>
            )}
          </Button>
        </div>

        {/* 최근 질문 히스토리 (추후 구현) */}
        <div className="text-xs text-gray-500">
          <div className="border-t pt-3">
            최근 질문들이 여기에 표시됩니다.
          </div>
        </div>
      </div>
    </div>
  );
};
