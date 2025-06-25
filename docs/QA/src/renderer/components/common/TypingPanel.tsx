/**
 * 🔥 기가차드 타이핑 분석 패널
 * 실시간 타이핑 통계와 성능 분석을 제공하는 모듈화된 컴포넌트
 */

"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { Progress } from '@components/ui/Progress';
import { Activity, TrendingUp, Clock, Target, Zap, X } from 'lucide-react';

interface TypingStats {
  wpm: number;
  accuracy: number;
  keystrokes: number;
  time: number;
  errors: number;
}

interface TypingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentStats?: TypingStats;
  targetWpm?: number;
}

export function TypingPanel({ 
  isOpen, 
  onClose, 
  currentStats = { wpm: 0, accuracy: 0, keystrokes: 0, time: 0, errors: 0 },
  targetWpm = 100 
}: TypingPanelProps) {
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getWpmColor = (wpm: number) => {
    if (wpm >= targetWpm) return 'text-green-600';
    if (wpm >= targetWpm * 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-green-600';
    if (accuracy >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-4 w-80 z-50 animate-in slide-in-from-right-4">
      <Card className="glass-card">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white">실시간 분석</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="p-4 space-y-4">
          {/* WPM */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/80">WPM</span>
            </div>
            <div className="text-right">
              <div className={`text-xl font-bold ${getWpmColor(currentStats.wpm)}`}>
                {currentStats.wpm}
              </div>
              <div className="text-xs text-white/60">목표: {targetWpm}</div>
            </div>
          </div>

          {/* WPM Progress */}
          <Progress 
            value={(currentStats.wpm / targetWpm) * 100} 
            className="h-2"
          />

          {/* Accuracy */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-sm text-white/80">정확도</span>
            </div>
            <div className={`text-xl font-bold ${getAccuracyColor(currentStats.accuracy)}`}>
              {currentStats.accuracy}%
            </div>
          </div>

          {/* Session Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/80">세션 시간</span>
            </div>
            <div className="text-lg font-mono text-white">
              {formatTime(sessionTime)}
            </div>
          </div>

          {/* Keystrokes */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white/80">키 입력</span>
            </div>
            <div className="text-lg font-bold text-white">
              {currentStats.keystrokes.toLocaleString()}
            </div>
          </div>

          {/* Performance Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {currentStats.wpm >= targetWpm && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                목표 달성
              </Badge>
            )}
            {currentStats.accuracy >= 95 && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                정확성 우수
              </Badge>
            )}
            {currentStats.errors === 0 && currentStats.keystrokes > 0 && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                완벽
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              리셋
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              저장
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
