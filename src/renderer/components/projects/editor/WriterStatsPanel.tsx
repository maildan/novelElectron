'use client';

import React from 'react';
import { Button } from '../../ui/Button';
import {
  ChevronRight,
  Minus,
  Plus,
  Sparkles,
  Users,
  Map,
  MessageSquare as Speech
} from 'lucide-react';
import { formatTime, type WriterStats } from './WriterStats';

interface WriterStatsPanelProps {
  showRightSidebar: boolean;
  toggleRightSidebar: () => void;
  writerStats: WriterStats;
  setWordGoal: (goal: number) => void;
}

const STATS_STYLES = {
  rightSidebar: 'w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out',
  rightSidebarCollapsed: 'w-0 overflow-hidden transition-all duration-300 ease-in-out',
  rightSidebarHeader: 'flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800',
  rightSidebarTitle: 'text-lg font-semibold text-slate-900 dark:text-slate-100',
  iconButton: 'flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400',
  statCard: 'bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-3',
  statTitle: 'text-xs font-medium text-slate-600 dark:text-slate-400 mb-1',
  statValue: 'text-lg font-bold text-slate-900 dark:text-slate-100',
  statSubtext: 'text-xs text-slate-500 dark:text-slate-400',
} as const;

export function WriterStatsPanel({
  showRightSidebar,
  toggleRightSidebar,
  writerStats,
  setWordGoal
}: WriterStatsPanelProps): React.ReactElement {
  
  return (
    <div className={showRightSidebar ? STATS_STYLES.rightSidebar : STATS_STYLES.rightSidebarCollapsed}>
      <div className={STATS_STYLES.rightSidebarHeader}>
        <h2 className={STATS_STYLES.rightSidebarTitle}>작가 통계</h2>
        <button className={STATS_STYLES.iconButton} onClick={toggleRightSidebar}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-3 overflow-y-auto">
        {/* 단어 수 진행률 */}
        <div className={STATS_STYLES.statCard}>
          <div className="flex justify-between items-center mb-1">
            <span className={STATS_STYLES.statTitle}>단어 목표</span>
            <div className="flex items-center">
              <button 
                className={STATS_STYLES.iconButton} 
                onClick={() => setWordGoal(Math.max(500, writerStats.wordGoal - 500))}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs mx-1">{writerStats.wordGoal.toLocaleString()}</span>
              <button 
                className={STATS_STYLES.iconButton} 
                onClick={() => setWordGoal(writerStats.wordGoal + 500)}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" 
              style={{ width: `${writerStats.progress}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{writerStats.wordCount.toLocaleString()} 단어</span>
            <span>{writerStats.progress}%</span>
          </div>
        </div>
        
        {/* 작성 통계 */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className={STATS_STYLES.statCard}>
            <span className={STATS_STYLES.statTitle}>단어 수</span>
            <div className={STATS_STYLES.statValue}>{writerStats.wordCount.toLocaleString()}</div>
          </div>
          
          <div className={STATS_STYLES.statCard}>
            <span className={STATS_STYLES.statTitle}>문자 수</span>
            <div className={STATS_STYLES.statValue}>{writerStats.charCount.toLocaleString()}</div>
          </div>
          
          <div className={STATS_STYLES.statCard}>
            <span className={STATS_STYLES.statTitle}>단락 수</span>
            <div className={STATS_STYLES.statValue}>{writerStats.paragraphCount}</div>
          </div>
          
          <div className={STATS_STYLES.statCard}>
            <span className={STATS_STYLES.statTitle}>읽기 시간</span>
            <div className={STATS_STYLES.statValue}>{writerStats.readingTime}분</div>
          </div>
        </div>
        
        {/* 세션 통계 */}
        <div className={STATS_STYLES.statCard}>
          <span className={STATS_STYLES.statTitle}>현재 세션</span>
          <div className="flex justify-between items-center">
            <div>
              <div className={STATS_STYLES.statValue}>{formatTime(writerStats.sessionTime)}</div>
              <div className={STATS_STYLES.statSubtext}>글쓰기 시간</div>
            </div>
            <div className="text-right">
              <div className={STATS_STYLES.statValue}>{writerStats.wpm}</div>
              <div className={STATS_STYLES.statSubtext}>WPM</div>
            </div>
          </div>
        </div>
        
        {/* AI 작가 도우미 */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">AI 작가 도우미</h3>
          
          <div className="space-y-2">
            <Button size="sm" variant="outline" className="w-full justify-start">
              <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
              문장 개선 제안
            </Button>
            
            <Button size="sm" variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2 text-purple-500" />
              등장인물 성격 분석
            </Button>
            
            <Button size="sm" variant="outline" className="w-full justify-start">
              <Map className="w-4 h-4 mr-2 text-green-500" />
              플롯 구조 확인
            </Button>
            
            <Button size="sm" variant="outline" className="w-full justify-start">
              <Speech className="w-4 h-4 mr-2 text-orange-500" />
              대화문 개선
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
