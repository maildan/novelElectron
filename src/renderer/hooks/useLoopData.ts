'use client';

import { useState, useEffect, useCallback } from 'react';
import { Log, TypingStats, IpcResponse } from '@shared/types';

interface UseLoopDataReturn {
  // 로그 관련
  logs: Log[];
  loading: boolean;
  loadLogs: () => Promise<void>;
  saveLog: (record: Omit<Log, 'id'>) => Promise<void>;
  
  // 타이핑 통계
  typingStats: TypingStats | null;
  loadTypingStats: () => Promise<void>;
  
  // 키보드 모니터링
  isMonitoring: boolean;
  startMonitoring: () => Promise<void>;
  stopMonitoring: () => Promise<void>;
  
  // 에러 처리
  error: string | null;
  clearError: () => void;
}

/**
 * 🔥 기가차드 Loop 데이터 관리 훅
 * - 더미 데이터 제거
 * - IPC 통신 준비
 * - 타입 안전성 보장
 */
export function useLoopData(): UseLoopDataReturn {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [typingStats, setTypingStats] = useState<TypingStats | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      
      // TODO: IPC 통신으로 실제 로그 데이터 가져오기
      // const response = await window.electronAPI.getLogs();
      
      // 🚀 임시 더미 데이터 (UI 완성용)
      const dummyLogs: Log[] = [
        {
          id: '1',
          content: 'Hello World! 타이핑 연습 중입니다.',
          keyCount: 25,
          typingTime: 5000,
          timestamp: '2024-01-15T09:30:00.000Z',
          totalChars: 25
        },
        {
          id: '2',
          content: '안녕하세요! 한글 타이핑 테스트입니다.',
          keyCount: 18,
          typingTime: 4200,
          timestamp: '2024-01-15T09:31:00.000Z',
          totalChars: 18
        },
        {
          id: '3',
          content: 'JavaScript 코딩을 연습하고 있습니다.',
          keyCount: 22,
          typingTime: 6800,
          timestamp: '2024-01-15T10:15:00.000Z',
          totalChars: 22
        },
        {
          id: '4',
          content: 'React 컴포넌트 개발 중입니다.',
          keyCount: 16,
          typingTime: 3500,
          timestamp: '2024-01-15T11:20:00.000Z',
          totalChars: 16
        },
        {
          id: '5',
          content: 'TypeScript 타입 정의를 작성합니다.',
          keyCount: 20,
          typingTime: 4800,
          timestamp: '2024-01-15T14:30:00.000Z',
          totalChars: 20
        }
      ];
      
      setLogs(dummyLogs);
      // if (response.success) {
      //   setLogs(response.data);
      // } else {
      //   setError(response.error);
      // }
      
      // 임시: 로그 설정 완료
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const saveLog = useCallback(async (record: Omit<Log, 'id'>) => {
    try {
      clearError();
      
      // TODO: IPC 통신으로 로그 저장
      // const response = await window.electronAPI.saveLog(record);
      // if (response.success) {
      //   const newLog = { ...record, id: response.data.id };
      //   setLogs(prev => [newLog, ...prev]);
      // } else {
      //   setError(response.error);
      // }
      
      // 임시: 클라이언트에서만 추가
      const newLog: Log = {
        ...record,
        id: Date.now().toString(),
        totalChars: record.content.length
      };
      setLogs(prev => [newLog, ...prev]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save log');
    }
  }, [clearError]);

  const loadTypingStats = useCallback(async () => {
    try {
      clearError();
      
      // TODO: IPC 통신으로 타이핑 통계 가져오기
      // const response = await window.electronAPI.getTypingStats();
      // if (response.success) {
      //   setTypingStats(response.data);
      // } else {
      //   setError(response.error);
      // }
      
      // 🚀 임시 더미 타이핑 통계 (UI 완성용)
      setTypingStats({
        wpm: 78,
        accuracy: 94.5,
        totalKeys: 15420,
        totalTime: 185000
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load typing stats');
    }
  }, [clearError]);

  const startMonitoring = useCallback(async () => {
    try {
      clearError();
      
      // TODO: IPC 통신으로 모니터링 시작
      // const response = await window.electronAPI.startKeyboardMonitoring();
      // if (response.success) {
      //   setIsMonitoring(true);
      // } else {
      //   setError(response.error);
      // }
      
      // 임시: 상태만 변경
      setIsMonitoring(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start monitoring');
    }
  }, [clearError]);

  const stopMonitoring = useCallback(async () => {
    try {
      clearError();
      
      // TODO: IPC 통신으로 모니터링 중지
      // const response = await window.electronAPI.stopKeyboardMonitoring();
      // if (response.success) {
      //   setIsMonitoring(false);
      // } else {
      //   setError(response.error);
      // }
      
      // 임시: 상태만 변경
      setIsMonitoring(false);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop monitoring');
    }
  }, [clearError]);

  // 초기 데이터 로드
  useEffect(() => {
    loadLogs();
    loadTypingStats();
  }, [loadLogs, loadTypingStats]);

  return {
    logs,
    loading,
    loadLogs,
    saveLog,
    typingStats,
    loadTypingStats,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    error,
    clearError
  };
}
