/**
 * 🔥 기가차드 공통 Hook 모듈
 * Loop Typing Analytics - Common Hooks Module
 */

import { useState, useCallback } from 'react';
import logger from './logger';

// #DEBUG: 로딩 상태 관리 Hook
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  
  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);
  const toggleLoading = useCallback(() => setIsLoading(prev => !prev), []);
  
  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    setIsLoading,
  };
};

// #DEBUG: 비동기 작업 관리 Hook
export const useAsync = <T = any, E = Error>() => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);
  const { isLoading, startLoading, stopLoading } = useLoading();
  
  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    try {
      startLoading();
      setError(null);
      const result = await asyncFunction();
      setData(result);
      return result;
    } catch (err) {
      const error = err as E;
      setError(error);
      logger.error('Async operation failed', error);
      throw error;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);
  
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    stopLoading();
  }, [stopLoading]);
  
  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  };
};

// #DEBUG: 상태 토글 Hook
export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);
  
  const toggle = useCallback(() => setState(prev => !prev), []);
  const setTrue = useCallback(() => setState(true), []);
  const setFalse = useCallback(() => setState(false), []);
  
  return {
    state,
    toggle,
    setTrue,
    setFalse,
    setState,
  };
};

// #DEBUG: 로컬 스토리지 Hook
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      logger.error(`Error reading localStorage key "${key}"`, error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      logger.error(`Error setting localStorage key "${key}"`, error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setValue] as const;
};

// #DEBUG: 디바운스 Hook
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useState(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  });
  
  return debouncedValue;
};
