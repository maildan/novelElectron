'use client';

import { useCallback, useRef, useEffect } from 'react';
import { Logger } from '../../../../shared/logger';

interface UseAutoSaveOptions {
  projectId: string;
  delay?: number; // 기본값: 1초
  onSave: () => Promise<void>;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

/**
 * 🔥 실시간 자동 저장 Hook - 저장 속도 최적화
 * 
 * 특징:
 * - Debounced 저장으로 불필요한 저장 방지
 * - 즉시 저장 기능 (Ctrl+S)
 * - 에러 처리 및 재시도 로직
 * - 저장 상태 추적
 */
export function useAutoSave({
  projectId,
  delay = 1000, // 1초 딜레이
  onSave,
  onSaveSuccess,
  onSaveError
}: UseAutoSaveOptions) {
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // 🔥 Debounced 저장
  const debouncedSave = useCallback(() => {
    // 기존 타이머 취소
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // 새 타이머 설정
    saveTimerRef.current = setTimeout(async () => {
      if (isLoadingRef.current) {
        Logger.debug('AUTO_SAVE', 'Save already in progress, skipping', { projectId });
        return;
      }

      try {
        isLoadingRef.current = true;
        const startTime = Date.now();
        
        Logger.debug('AUTO_SAVE', 'Starting debounced save', { projectId });
        
        await onSave();
        retryCountRef.current = 0; // 성공 시 재시도 카운터 리셋
        
        const duration = Date.now() - startTime;
        Logger.info('AUTO_SAVE', '✅ Debounced save completed', { 
          projectId, 
          duration: `${duration}ms` 
        });
        
        onSaveSuccess?.();
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        Logger.error('AUTO_SAVE', '❌ Debounced save failed', errorObj);
        
        // 재시도 로직
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          Logger.warn('AUTO_SAVE', `Retrying save (${retryCountRef.current}/${maxRetries})`, { projectId });
          
          // 재시도 딜레이 (1초, 2초, 4초로 점진적 증가)
          setTimeout(() => {
            debouncedSave();
          }, Math.pow(2, retryCountRef.current - 1) * 1000);
        } else {
          Logger.error('AUTO_SAVE', 'Max retries exceeded', { projectId });
          onSaveError?.(errorObj);
        }
      } finally {
        isLoadingRef.current = false;
        saveTimerRef.current = null;
      }
    }, delay);
  }, [projectId, delay, onSave, onSaveSuccess, onSaveError]);

  // 🔥 즉시 저장 (Ctrl+S용)
  const forceSave = useCallback(async () => {
    // 기존 debounced 저장 취소
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    if (isLoadingRef.current) {
      Logger.debug('AUTO_SAVE', 'Save already in progress, cannot force save', { projectId });
      return;
    }

    try {
      isLoadingRef.current = true;
      const startTime = Date.now();
      
      Logger.info('AUTO_SAVE', 'Starting force save', { projectId });
      
      await onSave();
      retryCountRef.current = 0;
      
      const duration = Date.now() - startTime;
      Logger.info('AUTO_SAVE', '✅ Force save completed', { 
        projectId, 
        duration: `${duration}ms` 
      });
      
      onSaveSuccess?.();
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      Logger.error('AUTO_SAVE', '❌ Force save failed', errorObj);
      onSaveError?.(errorObj);
    } finally {
      isLoadingRef.current = false;
    }
  }, [projectId, onSave, onSaveSuccess, onSaveError]);

  // 🔥 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  return {
    debouncedSave,
    forceSave,
    isLoading: isLoadingRef.current,
  };
}
