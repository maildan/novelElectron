'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Logger } from '../../shared/logger';

// 🔥 기가차드 규칙: 명시적 타입 정의
export interface MonitoringState {
  isMonitoring: boolean;
  isAIOpen: boolean;
  startTime: Date | null;
  sessionData: {
    wpm: number;
    words: number;
    time: number;
  };
}

export interface MonitoringContextType {
  state: MonitoringState;
  startMonitoring: () => Promise<void>;
  stopMonitoring: () => Promise<void>;
  toggleAI: () => void;
  updateSessionData: (data: Partial<MonitoringState['sessionData']>) => void;
}

// 🔥 컨텍스트 생성
export const MonitoringContext = createContext<MonitoringContextType | undefined>(undefined);

// 🔥 프로바이더 컴포넌트
export function MonitoringProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  // 🔥 하이드레이션 안전한 초기 상태 - localStorage에서 읽은 값으로 바로 초기화
  const getInitialState = (): MonitoringState => {
    if (typeof window === 'undefined') {
      // 서버사이드에서는 기본값
      return {
        isMonitoring: false,
        isAIOpen: false,
        startTime: null,
        sessionData: { wpm: 0, words: 0, time: 0 },
      };
    }
    
    // 클라이언트사이드에서는 localStorage에서 읽기
    try {
      const savedState = localStorage.getItem('monitoring-state');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        return {
          isMonitoring: parsed.isMonitoring || false,
          isAIOpen: parsed.isAIOpen || false,
          startTime: parsed.startTime ? new Date(parsed.startTime) : null,
          sessionData: {
            wpm: parsed.sessionData?.wpm || 0,
            words: parsed.sessionData?.words || 0,
            time: parsed.sessionData?.time || 0,
          },
        };
      }
    } catch (error) {
      Logger.error('MONITORING_CONTEXT', 'Failed to load state from localStorage', error);
    }
    
    return {
      isMonitoring: false,
      isAIOpen: false,
      startTime: null,
      sessionData: { wpm: 0, words: 0, time: 0 },
    };
  };

  const [state, setState] = useState<MonitoringState>(getInitialState);
  const [isClientMounted, setIsClientMounted] = useState<boolean>(false);

  // 🔥 클라이언트 마운트 확인만
  React.useEffect(() => {
    setIsClientMounted(true);
  }, []);

  // 🔥 상태 변경 시 localStorage에 저장 (클라이언트 마운트 후에만)
  React.useEffect(() => {
    if (isClientMounted && typeof window !== 'undefined') {
      try {
        localStorage.setItem('monitoring-state', JSON.stringify(state));
        Logger.debug('MONITORING_CONTEXT', 'State saved to localStorage', state);
      } catch (error) {
        Logger.error('MONITORING_CONTEXT', 'Failed to save state to localStorage', error);
      }
    }
  }, [state, isClientMounted]);

  const startMonitoring = useCallback(async (): Promise<void> => {
    try {
      Logger.info('MONITORING_CONTEXT', 'Starting monitoring');
      
      const result = await window.electronAPI.keyboard.startMonitoring();
      if (result.success) {
        setState(prev => ({
          ...prev,
          isMonitoring: true,
          startTime: new Date(),
        }));
        Logger.info('MONITORING_CONTEXT', 'Monitoring started successfully');
      } else {
        Logger.error('MONITORING_CONTEXT', 'Failed to start monitoring', result.error);
        throw new Error(result.error || 'Failed to start monitoring');
      }
    } catch (error) {
      Logger.error('MONITORING_CONTEXT', 'Error starting monitoring', error);
      throw error;
    }
  }, []);

  const stopMonitoring = useCallback(async (): Promise<void> => {
    try {
      Logger.info('MONITORING_CONTEXT', 'Stopping monitoring');
      
      const result = await window.electronAPI.keyboard.stopMonitoring();
      if (result.success) {
        setState(prev => ({
          ...prev,
          isMonitoring: false,
          startTime: null,
        }));
        Logger.info('MONITORING_CONTEXT', 'Monitoring stopped successfully');
      } else {
        Logger.error('MONITORING_CONTEXT', 'Failed to stop monitoring', result.error);
        throw new Error(result.error || 'Failed to stop monitoring');
      }
    } catch (error) {
      Logger.error('MONITORING_CONTEXT', 'Error stopping monitoring', error);
      throw error;
    }
  }, []);

  const toggleAI = useCallback((): void => {
    setState(prev => ({
      ...prev,
      isAIOpen: !prev.isAIOpen,
    }));
    Logger.info('MONITORING_CONTEXT', `AI Panel toggled to: ${!state.isAIOpen}`);
  }, [state.isAIOpen]);

  const updateSessionData = useCallback((data: Partial<MonitoringState['sessionData']>): void => {
    setState(prev => ({
      ...prev,
      sessionData: {
        ...prev.sessionData,
        ...data,
      },
    }));
  }, []);

  const contextValue: MonitoringContextType = {
    state,
    startMonitoring,
    stopMonitoring,
    toggleAI,
    updateSessionData,
  };

  return (
    <MonitoringContext.Provider value={contextValue}>
      {children}
    </MonitoringContext.Provider>
  );
}

// 🔥 커스텀 훅
export function useMonitoring(): MonitoringContextType {
  const context = useContext(MonitoringContext);
  if (context === undefined) {
    throw new Error('useMonitoring must be used within a MonitoringProvider');
  }
  return context;
}
