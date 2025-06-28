'use client';

import { useState, useEffect, useCallback } from 'react';

// 🔥 기가차드 실시간 통계 타입 정의 (백엔드 TypingStats 기반)
export interface RealtimeTypingStats {
  currentWPM: number;
  averageWPM: number;
  peakWPM: number;
  totalKeystrokes: number;
  accuracy: number;
  sessionDuration: number;
  isMonitoring: boolean;
}

export interface KeyboardState {
  isMonitoring: boolean;
  currentApp: string;
  lastActivity: Date | null;
}

// 🔥 초기 상태
const INITIAL_STATS: RealtimeTypingStats = {
  currentWPM: 0,
  averageWPM: 0,
  peakWPM: 0,
  totalKeystrokes: 0,
  accuracy: 0,
  sessionDuration: 0,
  isMonitoring: false,
};

const INITIAL_KEYBOARD_STATE: KeyboardState = {
  isMonitoring: false,
  currentApp: '',
  lastActivity: null,
};

/**
 * 🔥 기가차드 실시간 타이핑 통계 Hook
 * 백엔드 UnifiedHandler와 직접 연동
 */
export function useKeyboardStats(): {
  stats: RealtimeTypingStats;
  keyboardState: KeyboardState;
  startMonitoring: () => Promise<boolean>;
  stopMonitoring: () => Promise<boolean>;
  refreshStats: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
} {
  const [stats, setStats] = useState<RealtimeTypingStats>(INITIAL_STATS);
  const [keyboardState, setKeyboardState] = useState<KeyboardState>(INITIAL_KEYBOARD_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔥 백엔드에서 실시간 통계 가져오기
  const refreshStats = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined' || !window.electronAPI) {
      console.warn('⚠️ Electron API 없음');
      return;
    }

    try {
      setError(null);

      // 정의된 API 구조 사용
      const statusResult = await window.electronAPI.keyboard.getStatus();
      const statsResult = await window.electronAPI.database.getStats();
      
      if (statusResult.success && statsResult.success && statsResult.data) {
        setStats((prev: RealtimeTypingStats) => ({
          ...prev,
          currentWPM: statsResult.data?.wpm || 0,
          averageWPM: statsResult.data?.wpm || 0,
          peakWPM: statsResult.data?.wpm || 0,
          totalKeystrokes: statsResult.data?.totalKeystrokes || 0,
          accuracy: statsResult.data?.accuracy || 0,
          sessionDuration: statsResult.data?.sessionDuration || 0,
          isMonitoring: statusResult.data || false,
        }));

        setKeyboardState(prev => ({
          ...prev,
          isMonitoring: statusResult.data || false,
          currentApp: 'Unknown', // TODO: 윈도우 정보 API 추가 필요
          lastActivity: new Date(),
        }));
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error('❌ 통계 로드 실패:', err);
    }
  }, []);

  // 🔥 키보드 모니터링 시작
  const startMonitoring = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !window.electronAPI) {
      console.warn('⚠️ Electron API 없음');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await window.electronAPI.invoke('keyboard:start-monitoring');
      
      if (result.success || result === true) {
        await refreshStats();
        console.log('✅ 키보드 모니터링 시작');
        return true;
      } else {
        setError(result.error || '모니터링 시작 실패');
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error('❌ 모니터링 시작 실패:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [refreshStats]);

  // 🔥 키보드 모니터링 중지
  const stopMonitoring = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !window.electronAPI) {
      console.warn('⚠️ Electron API 없음');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await window.electronAPI.invoke('keyboard:stop-monitoring');
      
      if (result.success || result === true) {
        await refreshStats();
        console.log('🛑 키보드 모니터링 중지');
        return true;
      } else {
        setError(result.error || '모니터링 중지 실패');
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error('❌ 모니터링 중지 실패:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [refreshStats]);

  // 🔥 초기 데이터 로드
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // 🔥 실시간 업데이트 (5초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      if (keyboardState.isMonitoring) {
        refreshStats();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [keyboardState.isMonitoring, refreshStats]);

  return {
    stats,
    keyboardState,
    startMonitoring,
    stopMonitoring,
    refreshStats,
    isLoading,
    error,
  };
}
