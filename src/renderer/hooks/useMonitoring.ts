'use client';

import { useContext } from 'react';
import { MonitoringContext, type MonitoringContextType } from '../contexts/GlobalMonitoringContext';

/**
 * 🔥 기가차드 모니터링 훅
 * GlobalMonitoringContext를 사용하기 위한 커스텀 훅
 */
export function useMonitoring(): MonitoringContextType {
  const context = useContext(MonitoringContext);
  
  if (!context) {
    throw new Error('useMonitoring must be used within a MonitoringProvider');
  }
  
  return context;
}

export default useMonitoring;
