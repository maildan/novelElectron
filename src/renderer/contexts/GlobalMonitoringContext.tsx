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
  const [state, setState] = useState<MonitoringState>({
    isMonitoring: false,
    isAIOpen: false,
    startTime: null,
    sessionData: {
      wpm: 0,
      words: 0,
      time: 0,
    },
  });

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
