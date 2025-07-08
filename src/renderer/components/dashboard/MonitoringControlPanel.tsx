'use client';

import React, { memo, useCallback } from 'react';
import { Play, Pause, StopCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui';
import { useMonitoring } from '../../contexts/GlobalMonitoringContext';
import { Logger } from '../../../shared/logger';

// 🔥 프리컴파일된 스타일
const MONITORING_STYLES = {
  container: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg',
  header: 'flex items-center justify-between mb-4',
  status: 'flex items-center gap-2',
  pulse: 'w-2 h-2 bg-green-400 rounded-full animate-pulse',
  title: 'text-lg font-semibold',
  time: 'font-mono text-lg',
  stats: 'grid grid-cols-3 gap-6 text-center mb-6',
  statValue: 'text-2xl font-bold',
  statLabel: 'text-blue-200 text-sm',
  controls: 'flex items-center gap-3',
  button: 'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
  startButton: 'bg-green-600 hover:bg-green-700 text-white',
  stopButton: 'bg-red-600 hover:bg-red-700 text-white',
  aiButton: 'bg-purple-600 hover:bg-purple-700 text-white',
} as const;

interface MonitoringControlPanelProps {
  className?: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function MonitoringControlPanelComponent({ className }: MonitoringControlPanelProps): React.ReactElement {
  const { state, startMonitoring, stopMonitoring, toggleAI } = useMonitoring();
  const { isMonitoring, isAIOpen, sessionData, startTime } = state;

  // 🔥 경과 시간 계산
  const elapsedTime = React.useMemo(() => {
    if (!startTime || !isMonitoring) return 0;
    return Math.floor((Date.now() - startTime.getTime()) / 1000);
  }, [startTime, isMonitoring]);

  // 🔥 모니터링 시작 핸들러
  const handleStartMonitoring = useCallback(async (): Promise<void> => {
    try {
      Logger.info('MONITORING_CONTROL', 'Starting monitoring...');
      await startMonitoring();
    } catch (error) {
      Logger.error('MONITORING_CONTROL', 'Failed to start monitoring', error);
      // TODO: 에러 토스트 표시
    }
  }, [startMonitoring]);

  // 🔥 모니터링 중지 핸들러
  const handleStopMonitoring = useCallback(async (): Promise<void> => {
    try {
      Logger.info('MONITORING_CONTROL', 'Stopping monitoring...');
      await stopMonitoring();
    } catch (error) {
      Logger.error('MONITORING_CONTROL', 'Failed to stop monitoring', error);
      // TODO: 에러 토스트 표시
    }
  }, [stopMonitoring]);

  // 🔥 AI 토글 핸들러
  const handleToggleAI = useCallback((): void => {
    Logger.info('MONITORING_CONTROL', 'Toggling AI panel...');
    toggleAI();
  }, [toggleAI]);

  return (
    <div className={`${MONITORING_STYLES.container} ${className || ''}`}>
      {/* 헤더 */}
      <div className={MONITORING_STYLES.header}>
        <div className={MONITORING_STYLES.status}>
          {isMonitoring && <div className={MONITORING_STYLES.pulse} />}
          <span className={MONITORING_STYLES.title}>
            {isMonitoring ? '모니터링 중' : '모니터링 대기'}
          </span>
        </div>
        <div className={MONITORING_STYLES.time}>
          {formatTime(elapsedTime)}
        </div>
      </div>

      {/* 통계 */}
      <div className={MONITORING_STYLES.stats}>
        <div>
          <div className={MONITORING_STYLES.statValue}>{sessionData.wpm}</div>
          <div className={MONITORING_STYLES.statLabel}>WPM</div>
        </div>
        <div>
          <div className={MONITORING_STYLES.statValue}>{sessionData.words}</div>
          <div className={MONITORING_STYLES.statLabel}>단어</div>
        </div>
        <div>
          <div className={MONITORING_STYLES.statValue}>{formatTime(sessionData.time)}</div>
          <div className={MONITORING_STYLES.statLabel}>시간</div>
        </div>
      </div>

      {/* 컨트롤 버튼 */}
      <div className={MONITORING_STYLES.controls}>
        {!isMonitoring ? (
          <Button
            onClick={handleStartMonitoring}
            className={`${MONITORING_STYLES.button} ${MONITORING_STYLES.startButton}`}
            disabled={false}
          >
            <Play className="w-4 h-4" />
            모니터링 시작
          </Button>
        ) : (
          <Button
            onClick={handleStopMonitoring}
            className={`${MONITORING_STYLES.button} ${MONITORING_STYLES.stopButton}`}
            disabled={false}
          >
            <StopCircle className="w-4 h-4" />
            모니터링 중지
          </Button>
        )}

        <Button
          onClick={handleToggleAI}
          className={`${MONITORING_STYLES.button} ${MONITORING_STYLES.aiButton}`}
          disabled={false}
        >
          <AlertCircle className="w-4 h-4" />
          {isAIOpen ? 'AI 닫기' : 'AI 열기'}
        </Button>
      </div>
    </div>
  );
}

// 🔥 메모화로 성능 최적화
export const MonitoringControlPanel = memo(MonitoringControlPanelComponent);
