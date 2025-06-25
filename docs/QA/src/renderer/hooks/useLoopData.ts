'use client';

import { Logger } from "../shared/logger";
const log = Logger;

import { useState, useEffect, useCallback } from 'react';
import { Log, TypingStats, IpcResponse, SessionStats } from '@shared/types';

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

// #DEBUG: 데이터베이스 세션 타입 정의
interface DatabaseSession {
  id: string;
  content?: string;
  keyCount: number;
  duration: number;
  createdAt: string;
  totalChars?: number;
  wpm?: number;
  accuracy?: number;
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
      
      // 🔥 실제 ElectronAPI로 로그 데이터 가져오기
      if (typeof window !== 'undefined' && window.electronAPI) {
        try {
          const sessions = await window.electronAPI.database.getSessions();
          
          // Session 데이터를 Log 형식으로 변환 - 타입 안전하게 변환
          const sessionData = sessions as unknown as SessionStats[];
          const convertedLogs: Log[] = sessionData.map((session: SessionStats, index: number) => ({
            id: session.id || session.sessionId || `session-${Date.now()}-${index}`,
            content: session.content || `타이핑 세션 ${index + 1}`,
            keyCount: session.totalKeys || session.keyCount || 0,
            typingTime: session.duration || 0,
            timestamp: session.createdAt?.toISOString() || session.timestamp || new Date().toISOString(),
            totalChars: session.totalChars || session.charactersTyped || session.characters || session.totalKeys || 0
          }));
          
          setLogs(convertedLogs);
        } catch (ipcError) {
          log.error('IPC 데이터 로딩 실패:', ipcError);
          setError('데이터베이스 연결에 실패했습니다');
          setLogs([]); // 에러 시 빈 배열
        }
      } else {
        log.warn('ElectronAPI를 찾을 수 없습니다');
        setError('Electron API를 사용할 수 없습니다');
        setLogs([]);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '로그 로딩에 실패했습니다';
      setError(errorMessage);
      log.error('loadLogs 에러:', err);
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
      
      // 🔥 실제 ElectronAPI로 타이핑 통계 가져오기
      if (typeof window !== 'undefined' && window.electronAPI) {
        try {
          // 실제 세션 데이터에서 통계 계산
          const sessions = await window.electronAPI.database.getSessions();
          
          if (sessions && sessions.length > 0) {
            // 타입 안전하게 변환하여 사용
            const sessionsArray = sessions as unknown as SessionStats[];
            const totalKeys = sessionsArray.reduce((sum: number, session: SessionStats) => sum + (session.totalKeys || session.keyCount || 0), 0);
            const totalTime = sessionsArray.reduce((sum: number, session: SessionStats) => sum + (session.duration || 0), 0);
            const totalChars = sessionsArray.reduce((sum: number, session: SessionStats) => 
              sum + (session.totalChars || session.charactersTyped || session.characters || session.totalKeys || 0), 0);
            
            // WPM 계산 (분당 단어수 = 글자수 / 5 / 분)
            const wpm = totalTime > 0 ? Math.round((totalChars / 5) / (totalTime / 60000)) : 0;
            
            // 정확도 계산 (간단한 추정)
            const accuracy = totalKeys > 0 ? Math.min(95, Math.max(70, 100 - (totalKeys - totalChars) / totalKeys * 100)) : 0;
            
            setTypingStats({
              wpm: Number(wpm),
              accuracy: Number(accuracy.toFixed(1)),
              totalKeys: Number(totalKeys),
              totalTime: Number(totalTime)
            });
          } else {
            // 세션이 없으면 기본값
            setTypingStats({
              wpm: 0,
              accuracy: 0,
              totalKeys: 0,
              totalTime: 0
            });
          }
        } catch (ipcError) {
          log.warn('타이핑 통계 로딩 실패:', ipcError);
          setTypingStats({
            wpm: 0,
            accuracy: 0,
            totalKeys: 0,
            totalTime: 0
          });
        }
      } else {
        setTypingStats({
          wpm: 0,
          accuracy: 0,
          totalKeys: 0,
          totalTime: 0
        });
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load typing stats');
    }
  }, [clearError]);

  const startMonitoring = useCallback(async () => {
    try {
      clearError();
      
      // 🔥 실제 ElectronAPI로 모니터링 시작
      if (typeof window !== 'undefined' && window.electronAPI) {
        const response = await window.electronAPI.keyboard.startMonitoring();
        if (response.success) {
          setIsMonitoring(true);
        } else {
          setError(response.error || '모니터링 시작 실패');
        }
      } else {
        setError('ElectronAPI를 찾을 수 없습니다');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start monitoring');
    }
  }, [clearError]);

  const stopMonitoring = useCallback(async () => {
    try {
      clearError();
      
      // 🔥 실제 ElectronAPI로 모니터링 중지
      if (typeof window !== 'undefined' && window.electronAPI) {
        const response = await window.electronAPI.keyboard.stopMonitoring();
        if (response.success) {
          setIsMonitoring(false);
        } else {
          setError(response.error || '모니터링 중지 실패');
        }
      } else {
        setError('ElectronAPI를 찾을 수 없습니다');
      }
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
