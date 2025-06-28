'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// 🔥 기가차드 타이핑 훅 - 완전 타입 안전

export interface RealtimeStats {
  currentWPM: number;
  averageWPM: number;
  totalKeystrokes: number;
  sessionDuration: number;
  accuracy: number;
  charactersTyped: number;
  errorsCount: number;
  peakWPM?: number;
}

export interface KeyboardMonitoringState {
  isMonitoring: boolean;
  isConnected: boolean;
  lastUpdate: Date | null;
  error: string | null;
}

export interface UseKeyboardResult {
  // 상태
  monitoringState: KeyboardMonitoringState;
  realtimeStats: RealtimeStats | null;
  
  // 액션
  startMonitoring: () => Promise<boolean>;
  stopMonitoring: () => Promise<boolean>;
  refreshStats: () => Promise<void>;
  
  // 유틸리티
  isLoading: boolean;
}

// 🔥 기본값 정의 - 런타임 객체 생성 방지
const DEFAULT_REALTIME_STATS: RealtimeStats = {
  currentWPM: 0,
  averageWPM: 0,
  totalKeystrokes: 0,
  sessionDuration: 0,
  accuracy: 100,
  charactersTyped: 0,
  errorsCount: 0,
  peakWPM: 0,
} as const;

const DEFAULT_MONITORING_STATE: KeyboardMonitoringState = {
  isMonitoring: false,
  isConnected: false,
  lastUpdate: null,
  error: null,
} as const;

/**
 * 🔥 기가차드 키보드 모니터링 훅
 * 실시간 타이핑 통계 및 모니터링 상태 관리
 */
export function useKeyboard(): UseKeyboardResult {
  const [monitoringState, setMonitoringState] = useState<KeyboardMonitoringState>(DEFAULT_MONITORING_STATE);
  const [realtimeStats, setRealtimeStats] = useState<RealtimeStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Refs for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);

  /**
   * 실시간 통계 업데이트
   */
  const refreshStats = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) return;
    
    try {
      // Electron API 확인
      if (typeof window === 'undefined' || !window.electronAPI) {
        // 개발 모드 시뮬레이션
        const simulatedStats: RealtimeStats = {
          currentWPM: Math.floor(Math.random() * 40) + 60, // 60-100 WPM
          averageWPM: 65,
          totalKeystrokes: Math.floor(Math.random() * 1000) + 5000,
          sessionDuration: Date.now() % 3600000, // 0-1시간
          accuracy: Math.random() * 5 + 95, // 95-100%
          charactersTyped: Math.floor(Math.random() * 800) + 4000,
          errorsCount: Math.floor(Math.random() * 10),
          peakWPM: 89,
        };
        
        setRealtimeStats(simulatedStats);
        setMonitoringState(prev => ({
          ...prev,
          lastUpdate: new Date(),
          isConnected: true,
          error: null,
        }));
        return;
      }

      // 실제 Electron API 호출
      const response = await window.electronAPI.keyboard.getRealtimeStats();
      
      if (response.success && response.data) {
        setRealtimeStats(response.data);
        setMonitoringState(prev => ({
          ...prev,
          lastUpdate: new Date(),
          isConnected: true,
          error: null,
        }));
      } else {
        setMonitoringState(prev => ({
          ...prev,
          error: response.error || 'Failed to get stats',
          isConnected: false,
        }));
      }
    } catch (error) {
      console.error('Stats refresh error:', error);
      setMonitoringState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        isConnected: false,
      }));
    }
  }, []);

  /**
   * 키보드 모니터링 시작
   */
  const startMonitoring = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Electron API 확인
      if (typeof window === 'undefined' || !window.electronAPI) {
        // 개발 모드 시뮬레이션
        setMonitoringState(prev => ({
          ...prev,
          isMonitoring: true,
          isConnected: true,
          error: null,
        }));
        setIsLoading(false);
        return true;
      }

      const response = await window.electronAPI.keyboard.startMonitoring();
      
      if (response.success) {
        setMonitoringState(prev => ({
          ...prev,
          isMonitoring: true,
          isConnected: true,
          error: null,
        }));
        
        // 즉시 통계 업데이트
        await refreshStats();
        return true;
      } else {
        setMonitoringState(prev => ({
          ...prev,
          error: response.error || 'Failed to start monitoring',
        }));
        return false;
      }
    } catch (error) {
      console.error('Start monitoring error:', error);
      setMonitoringState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [refreshStats]);

  /**
   * 키보드 모니터링 중지
   */
  const stopMonitoring = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Electron API 확인
      if (typeof window === 'undefined' || !window.electronAPI) {
        // 개발 모드 시뮬레이션
        setMonitoringState(prev => ({
          ...prev,
          isMonitoring: false,
        }));
        setIsLoading(false);
        return true;
      }

      const response = await window.electronAPI.keyboard.stopMonitoring();
      
      if (response.success) {
        setMonitoringState(prev => ({
          ...prev,
          isMonitoring: false,
        }));
        return true;
      } else {
        setMonitoringState(prev => ({
          ...prev,
          error: response.error || 'Failed to stop monitoring',
        }));
        return false;
      }
    } catch (error) {
      console.error('Stop monitoring error:', error);
      setMonitoringState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 초기화 및 상태 확인
   */
  useEffect(() => {
    const initializeKeyboard = async (): Promise<void> => {
      try {
        // Electron API가 있다면 현재 상태 확인
        if (typeof window !== 'undefined' && window.electronAPI) {
          const statusResponse = await window.electronAPI.keyboard.getStatus();
          
          if (statusResponse.success && statusResponse.data) {
            setMonitoringState(prev => ({
              ...prev,
              isMonitoring: statusResponse.data?.isActive || false,
              isConnected: true,
            }));
          }
        } else {
          // 개발 모드에서는 연결된 것으로 표시
          setMonitoringState(prev => ({
            ...prev,
            isConnected: true,
          }));
        }
      } catch (error) {
        console.error('Keyboard initialization error:', error);
        setMonitoringState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Initialization failed',
        }));
      }
    };

    initializeKeyboard();
  }, []);

  /**
   * 실시간 통계 업데이트 인터벌
   */
  useEffect(() => {
    if (monitoringState.isMonitoring) {
      // 즉시 한 번 업데이트
      refreshStats();
      
      // 1초마다 업데이트
      intervalRef.current = setInterval(refreshStats, 1000);
    } else {
      // 모니터링 중지 시 인터벌 정리
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [monitoringState.isMonitoring, refreshStats]);

  /**
   * 컴포넌트 언마운트 시 정리
   */
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    monitoringState,
    realtimeStats,
    startMonitoring,
    stopMonitoring,
    refreshStats,
    isLoading,
  };
}
