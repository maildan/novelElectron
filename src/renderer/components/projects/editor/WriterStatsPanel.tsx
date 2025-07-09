'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '../../ui/Button';
import {
  ChevronRight,
  Minus,
  Plus,
  Sparkles,
  Users,
  Map,
  MessageSquare as Speech,
  Loader2,
  TrendingUp,
  Clock,
  Target,
  BookOpen
} from 'lucide-react';
import { formatTime, calculateWriterStats, type WriterStats } from './WriterStats';
import { Logger } from '../../../../shared/logger';

interface WriterStatsPanelProps {
  showRightSidebar: boolean;
  toggleRightSidebar: () => void;
  writerStats: WriterStats;
  setWordGoal: (goal: number) => void;
  currentText?: string; // 🔥 현재 편집 중인 텍스트
  projectId?: string; // 🔥 현재 프로젝트 ID
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
  setWordGoal,
  currentText = '',
  projectId
}: WriterStatsPanelProps): React.ReactElement {
  
  // 🔥 AI 기능 상태 관리
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiResults, setAiResults] = useState<Record<string, string>>({});

  // 🔥 실제 세션 관리
  const [sessionStartTime] = useState<number>(() => Date.now());
  const [realTimeStats, setRealTimeStats] = useState<WriterStats | null>(null);
  const [lastWordCount, setLastWordCount] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🔥 실시간 통계 계산
  useEffect(() => {
    if (currentText) {
      const stats = calculateWriterStats(currentText, writerStats.wordGoal, sessionStartTime);
      setRealTimeStats(stats);
      
      // WPM 계산을 위한 단어 수 변경 추적
      if (stats.wordCount !== lastWordCount) {
        setLastWordCount(stats.wordCount);
      }
    }
  }, [currentText, writerStats.wordGoal, sessionStartTime, lastWordCount]);

  // 🔥 1초마다 세션 시간 업데이트
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (currentText) {
        const stats = calculateWriterStats(currentText, writerStats.wordGoal, sessionStartTime);
        setRealTimeStats(stats);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentText, writerStats.wordGoal, sessionStartTime]);

  // 🔥 실제 사용할 통계 데이터 (실시간 계산된 것 우선)
  const displayStats = realTimeStats || writerStats;

  // 🔥 AI 기능 핸들러들
  const handleAIImproveText = useCallback(async () => {
    if (!currentText || currentText.trim().length === 0) {
      Logger.warn('WRITER_STATS', 'No text to improve');
      return;
    }

    setAiLoading('improve');
    try {
      Logger.info('WRITER_STATS', 'Requesting text improvement');
      const result = await window.electronAPI.ai.improveText(currentText, projectId);
      
      if (result.success && result.data?.improvedText) {
        setAiResults(prev => ({ ...prev, improve: result.data!.improvedText }));
        Logger.info('WRITER_STATS', 'Text improvement completed');
      } else {
        Logger.error('WRITER_STATS', 'Text improvement failed', result.error);
      }
    } catch (error) {
      Logger.error('WRITER_STATS', 'Text improvement error', error);
    } finally {
      setAiLoading(null);
    }
  }, [currentText, projectId]);

  const handleAICharacterAnalysis = useCallback(async () => {
    if (!projectId) {
      Logger.warn('WRITER_STATS', 'No project ID for character analysis');
      return;
    }

    setAiLoading('character');
    try {
      Logger.info('WRITER_STATS', 'Requesting character analysis');
      const contextResult = await window.electronAPI.ai.getProjectContext(projectId);
      
      if (contextResult.success && contextResult.data) {
        const analysisPrompt = `등장인물 분석: ${contextResult.data!.characters?.join(', ')}`;
        const result = await window.electronAPI.ai.getWritingHelp(analysisPrompt, currentText);
        
        if (result.success && result.data?.response) {
          setAiResults(prev => ({ ...prev, character: result.data!.response }));
          Logger.info('WRITER_STATS', 'Character analysis completed');
        }
      }
    } catch (error) {
      Logger.error('WRITER_STATS', 'Character analysis error', error);
    } finally {
      setAiLoading(null);
    }
  }, [projectId, currentText]);

  const handleAIPlotCheck = useCallback(async () => {
    if (!currentText || currentText.trim().length === 0) {
      Logger.warn('WRITER_STATS', 'No text for plot analysis');
      return;
    }

    setAiLoading('plot');
    try {
      Logger.info('WRITER_STATS', 'Requesting plot analysis');
      const result = await window.electronAPI.ai.getWritingHelp('플롯 구조 분석', currentText);
      
      if (result.success && result.data?.response) {
        setAiResults(prev => ({ ...prev, plot: result.data!.response }));
        Logger.info('WRITER_STATS', 'Plot analysis completed');
      }
    } catch (error) {
      Logger.error('WRITER_STATS', 'Plot analysis error', error);
    } finally {
      setAiLoading(null);
    }
  }, [currentText]);

  const handleAIDialogueImprovement = useCallback(async () => {
    if (!currentText || currentText.trim().length === 0) {
      Logger.warn('WRITER_STATS', 'No text for dialogue improvement');
      return;
    }

    setAiLoading('dialogue');
    try {
      Logger.info('WRITER_STATS', 'Requesting dialogue improvement');
      const result = await window.electronAPI.ai.getWritingHelp('대화문 개선', currentText);
      
      if (result.success && result.data?.response) {
        setAiResults(prev => ({ ...prev, dialogue: result.data!.response }));
        Logger.info('WRITER_STATS', 'Dialogue improvement completed');
      }
    } catch (error) {
      Logger.error('WRITER_STATS', 'Dialogue improvement error', error);
    } finally {
      setAiLoading(null);
    }
  }, [currentText]);
  
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
                onClick={() => setWordGoal(Math.max(500, displayStats.wordGoal - 500))}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs mx-1">{displayStats.wordGoal.toLocaleString()}</span>
              <button 
                className={STATS_STYLES.iconButton} 
                onClick={() => setWordGoal(displayStats.wordGoal + 500)}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(100, displayStats.progress)}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{displayStats.wordCount.toLocaleString()} 단어</span>
            <span>{displayStats.progress}%</span>
          </div>
        </div>
        
        {/* 작성 통계 */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className={STATS_STYLES.statCard}>
            <span className={STATS_STYLES.statTitle}>단어 수</span>
            <div className={STATS_STYLES.statValue}>{displayStats.wordCount.toLocaleString()}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {displayStats.wordCount > lastWordCount ? '↗' : displayStats.wordCount < lastWordCount ? '↘' : '→'} 
              실시간
            </div>
          </div>
          
          <div className={STATS_STYLES.statCard}>
            <span className={STATS_STYLES.statTitle}>문자 수</span>
            <div className={STATS_STYLES.statValue}>{displayStats.charCount.toLocaleString()}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">공백 포함</div>
          </div>
          
          <div className={STATS_STYLES.statCard}>
            <span className={STATS_STYLES.statTitle}>단락 수</span>
            <div className={STATS_STYLES.statValue}>{displayStats.paragraphCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">구조 분석</div>
          </div>
          
          <div className={STATS_STYLES.statCard}>
            <span className={STATS_STYLES.statTitle}>읽기 시간</span>
            <div className={STATS_STYLES.statValue}>{displayStats.readingTime}분</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">200 WPM 기준</div>
          </div>
        </div>
        
        {/* 세션 통계 */}
        <div className={STATS_STYLES.statCard}>
          <span className={STATS_STYLES.statTitle}>현재 세션</span>
          <div className="flex justify-between items-center">
            <div>
              <div className={STATS_STYLES.statValue}>{formatTime(displayStats.sessionTime)}</div>
              <div className={STATS_STYLES.statSubtext}>글쓰기 시간</div>
            </div>
            <div className="text-right">
              <div className={STATS_STYLES.statValue}>
                {displayStats.wpm > 0 ? displayStats.wpm : 0}
              </div>
              <div className={STATS_STYLES.statSubtext}>WPM</div>
            </div>
          </div>
          {/* 🔥 WPM 성능 표시기 */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>타이핑 속도</span>
              <span>
                {displayStats.wpm < 30 ? '천천히' : 
                 displayStats.wpm < 60 ? '보통' : 
                 displayStats.wpm < 90 ? '빠름' : '매우 빠름'}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all duration-300 ${
                  displayStats.wpm < 30 ? 'bg-red-400' :
                  displayStats.wpm < 60 ? 'bg-yellow-400' :
                  displayStats.wpm < 90 ? 'bg-green-400' : 'bg-blue-400'
                }`}
                style={{ width: `${Math.min(100, (displayStats.wpm / 120) * 100)}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* AI 작가 도우미 */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">AI 작가 도우미</h3>
          
          <div className="space-y-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleAIImproveText}
              disabled={aiLoading === 'improve' || !currentText}
            >
              {aiLoading === 'improve' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-blue-500" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
              )}
              문장 개선 제안
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleAICharacterAnalysis}
              disabled={aiLoading === 'character' || !projectId}
            >
              {aiLoading === 'character' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-purple-500" />
              ) : (
                <Users className="w-4 h-4 mr-2 text-purple-500" />
              )}
              등장인물 성격 분석
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleAIPlotCheck}
              disabled={aiLoading === 'plot' || !currentText}
            >
              {aiLoading === 'plot' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-green-500" />
              ) : (
                <Map className="w-4 h-4 mr-2 text-green-500" />
              )}
              플롯 구조 확인
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleAIDialogueImprovement}
              disabled={aiLoading === 'dialogue' || !currentText}
            >
              {aiLoading === 'dialogue' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-orange-500" />
              ) : (
                <Speech className="w-4 h-4 mr-2 text-orange-500" />
              )}
              대화문 개선
            </Button>
          </div>
          
          {/* 🔥 AI 결과 표시 */}
          {Object.keys(aiResults).length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">AI 분석 결과</h4>
                <button 
                  onClick={() => setAiResults({})}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  모두 지우기
                </button>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {Object.entries(aiResults).map(([key, result]) => (
                  <div key={key} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {key === 'improve' && <Sparkles className="w-4 h-4 mr-2 text-blue-500" />}
                        {key === 'character' && <Users className="w-4 h-4 mr-2 text-purple-500" />}
                        {key === 'plot' && <Map className="w-4 h-4 mr-2 text-green-500" />}
                        {key === 'dialogue' && <Speech className="w-4 h-4 mr-2 text-orange-500" />}
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {key === 'improve' ? '문장 개선' :
                           key === 'character' ? '등장인물 분석' :
                           key === 'plot' ? '플롯 분석' :
                           key === 'dialogue' ? '대화문 개선' : key}
                        </span>
                      </div>
                      <button 
                        onClick={() => setAiResults(prev => {
                          const newResults = { ...prev };
                          delete newResults[key];
                          return newResults;
                        })}
                        className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                      {result}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
