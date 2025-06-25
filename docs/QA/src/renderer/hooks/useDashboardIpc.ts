import { Logger } from "../shared/logger";
const log = Logger;'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ElectronAPI } from '@/preload';

export interface IpcResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export function useDashboardIpc() {
  const [isMonitoringActive, setIsMonitoringActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // IPC 호출 헬퍼
  const invokeIpc = useCallback(async <T = unknown>(
    channel: string, 
    ...args: unknown[]
  ): Promise<IpcResponse<T>> => {
    try {
      if (typeof window !== 'undefined' && window.electronAPI) {
        return await window.electronAPI.invoke(channel, ...args);
      } else {
        // 웹 환경에서는 mock 데이터 반환
        log.warn(`IPC call to ${channel} - running in web mode`);
        return { success: false, message: 'IPC not available in web mode' };
      }
    } catch (error) {
      log.error(`IPC call failed: ${channel}`, error);
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }, []);

  // 키보드 모니터링 시작
  const startMonitoring = useCallback(async () => {
    setLoading(true);
    try {
      const result = await invokeIpc('dashboard:start-monitoring');
      if (result.success) {
        setIsMonitoringActive(true);
        log.info('🔥 키보드 모니터링 시작됨');
      } else {
        log.error('모니터링 시작 실패:', result.message);
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, [invokeIpc]);

  // 키보드 모니터링 중지
  const stopMonitoring = useCallback(async () => {
    setLoading(true);
    try {
      const result = await invokeIpc('dashboard:stop-monitoring');
      if (result.success) {
        setIsMonitoringActive(false);
        log.info('🛑 키보드 모니터링 중지됨');
      } else {
        log.error('모니터링 중지 실패:', result.message);
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, [invokeIpc]);

  // 최근 로그 가져오기
  const getRecentLogs = useCallback(async (limit = 10) => {
    setLoading(true);
    try {
      const result = await invokeIpc('dashboard:get-recent-logs', limit);
      return result;
    } finally {
      setLoading(false);
    }
  }, [invokeIpc]);

  // 통계 데이터 가져오기
  const getStats = useCallback(async () => {
    setLoading(true);
    try {
      const result = await invokeIpc('dashboard:get-stats');
      return result;
    } finally {
      setLoading(false);
    }
  }, [invokeIpc]);

  // 타이핑 로그 저장
  const saveTypingLog = useCallback(async (logData: {
    content: string;
    keyCount: number;
    typingTime: number;
    wpm?: number;
    accuracy?: number;
  }) => {
    setLoading(true);
    try {
      const result = await invokeIpc('dashboard:save-typing-log', logData);
      if (result.success) {
        log.info('✅ 타이핑 로그 저장됨:', result.data);
      } else {
        log.error('타이핑 로그 저장 실패:', result.message);
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, [invokeIpc]);

  return {
    // 상태
    isMonitoringActive,
    loading,
    
    // 메서드
    startMonitoring,
    stopMonitoring,
    getRecentLogs,
    getStats,
    saveTypingLog,
  };
}
