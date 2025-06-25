/**
 * 🔥 기가차드 앱 헤더 컴포넌트 - 실제 데이터 연동
 * Loop Typing Analytics - App Header with Real Data Integration
 */

'use client';

import { useEffect, useState } from 'react';
import { ActivityIcon, MenuIcon } from 'lucide-react';

interface AppHeaderProps {
  onMenuToggle?: () => void;
  showMonitoring?: boolean;
}

interface VersionInfo {
  app: string;
  electron: string;
  platform: string;
}

interface MonitoringStatus {
  isActive: boolean;
  message?: string;
}

export function AppHeader({ 
  onMenuToggle,
  showMonitoring = true 
}: AppHeaderProps) {
  
  const [isMounted, setIsMounted] = useState(false);
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringStatus, setMonitoringStatus] = useState<string>('정지됨');

  useEffect(() => {
    setIsMounted(true);
    
    // 실제 앱 버전 정보 가져오기
    const fetchVersionInfo = async () => {
      try {
        if (typeof window !== 'undefined' && window.electronAPI) {
          const [appVersion, platform] = await Promise.all([
            window.electronAPI.app.getVersion(),
            window.electronAPI.app.getPlatform()
          ]);
          
          setVersionInfo({
            app: appVersion,
            electron: process.versions?.electron || 'Unknown',
            platform: platform
          });
        }
      } catch (error) {
        console.error('버전 정보 로드 실패:', error);
      }
    };

    // 실제 모니터링 상태 확인
    const checkMonitoringStatus = async () => {
      try {
        if (typeof window !== 'undefined' && window.electronAPI) {
          const status = await window.electronAPI.keyboard.getMonitoringStatus();
          setIsMonitoring(status?.isActive || false);
          setMonitoringStatus(status?.isActive ? '모니터링 중' : '정지됨');
        }
      } catch (error) {
        console.error('모니터링 상태 확인 실패:', error);
        setIsMonitoring(false);
        setMonitoringStatus('오류');
      }
    };

    fetchVersionInfo();
    checkMonitoringStatus();

    // 실시간 모니터링 상태 업데이트 리스너
    const handleMonitoringUpdate = (status: MonitoringStatus) => {
      setIsMonitoring(status.isActive);
      setMonitoringStatus(status.isActive ? '모니터링 중' : '정지됨');
    };

    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.on?.('monitoring-status-changed', handleMonitoringUpdate);
    }

    return () => {
      if (typeof window !== 'undefined' && window.electronAPI) {
        window.electronAPI.removeAllListeners?.('monitoring-status-changed');
      }
    };
  }, []);

  const handleMonitoringToggle = async () => {
    try {
      if (typeof window !== 'undefined' && window.electronAPI) {
        const result = isMonitoring 
          ? await window.electronAPI.keyboard.stopMonitoring()
          : await window.electronAPI.keyboard.startMonitoring();
        
        if (result.success) {
          setIsMonitoring(!isMonitoring);
          setMonitoringStatus(!isMonitoring ? '모니터링 중' : '정지됨');
        }
      }
    } catch (error) {
      console.error('모니터링 토글 실패:', error);
    }
  };

  if (!isMounted) {
    return (
      <header className="h-14 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center border-b border-slate-700 shadow-lg">
        <div className="text-white font-semibold text-lg">
          Loop Typing Analytics
        </div>
      </header>
    );
  }

  return (
    <header className="h-14 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-between px-6 border-b border-slate-700 shadow-lg backdrop-blur-sm">
      {/* 왼쪽: 메뉴 + 로고 + 타이틀 */}
      <div className="flex items-center space-x-4">
        {/* 햄버거 메뉴 버튼 */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 text-white/80 hover:text-white"
          aria-label="메뉴 토글"
        >
          <MenuIcon size={20} />
        </button>
        
        {/* 앱 로고 */}
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">L</span>
        </div>
        
        {/* 앱 타이틀과 버전 정보 */}
        <div className="flex flex-col">
          <h1 className="text-white font-bold text-xl">Loop Typing Analytics</h1>
          {versionInfo && (
            <span className="text-blue-200 text-xs font-medium">
              v{versionInfo.app} • {versionInfo.platform}
            </span>
          )}
        </div>
      </div>

      {/* 오른쪽: 모니터링 상태 + 버튼 */}
      {showMonitoring && (
        <div className="flex items-center space-x-4">
          {/* 모니터링 상태 표시 */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-white/90 text-sm font-medium">{monitoringStatus}</span>
          </div>

          {/* 모니터링 토글 버튼 */}
          <button
            onClick={handleMonitoringToggle}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-md
              ${isMonitoring 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
              }
            `}
            aria-label={isMonitoring ? '모니터링 중지' : '모니터링 시작'}
          >
            <ActivityIcon size={16} />
            <span>{isMonitoring ? '중지' : '시작'}</span>
          </button>
        </div>
      )}
    </header>
  );
}
