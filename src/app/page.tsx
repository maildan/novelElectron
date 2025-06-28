'use client';

import { useState, useEffect } from 'react';

// 🔥 기가차드 프리컴파일된 스타일
const DASHBOARD_STYLES = {
  container: 'flex h-screen bg-gray-50',
  sidebar: 'w-64 bg-white border-r border-gray-200 flex flex-col',
  sidebarHeader: 'p-6 border-b border-gray-200',
  sidebarNav: 'flex-1 p-4',
  sidebarItem: 'flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 text-gray-700 hover:bg-gray-100 hover:text-blue-600 cursor-pointer',
  sidebarItemActive: 'flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 bg-blue-50 text-blue-600 border-r-2 border-blue-600',
  main: 'flex-1 flex flex-col',
  header: 'bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between',
  content: 'flex-1 p-6 overflow-auto',
  quickStartCard: 'bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm',
  quickStartTitle: 'text-xl font-bold text-gray-900 mb-2',
  quickStartText: 'text-gray-600 mb-4',
  quickStartButton: 'bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6',
  card: 'bg-white rounded-lg border border-gray-200 p-6 shadow-sm',
  cardTitle: 'text-lg font-semibold text-gray-900 mb-2',
  cardValue: 'text-3xl font-bold text-blue-600 mb-1',
  cardChange: 'text-sm text-green-600',
  statusIndicator: 'w-3 h-3 rounded-full',
  statusActive: 'bg-green-500',
  statusInactive: 'bg-red-500',
} as const;

// 🔥 사이드바 아이템 정의
const sidebarItems = [
  { id: 'dashboard', label: '대시보드', icon: '📊', href: '/', active: true },
  { id: 'analytics', label: '분석', icon: '📈', href: '/analytics', active: false },
  { id: 'projects', label: '프로젝트', icon: '📁', href: '/projects', active: false },
  { id: 'ai', label: 'Loop AI', icon: '✨', href: '/ai', active: false },
  { id: 'settings', label: '설정', icon: '⚙️', href: '/settings', active: false },
] as const;

interface DashboardState {
  isMonitoring: boolean;
  keystrokes: number;
  wpm: number;
  accuracy: number;
  sessions: number;
  currentApp: string;
  todayTime: string;
}

export default function Dashboard(): React.JSX.Element {
  const [state, setState] = useState<DashboardState>({
    isMonitoring: false,
    keystrokes: 0,
    wpm: 0,
    accuracy: 0,
    sessions: 0,
    currentApp: 'VSCode',
    todayTime: '2.5h',
  });

  // 🔥 Electron API 연결
  useEffect(() => {
    // API 사용 가능 확인
    if (typeof window !== 'undefined' && window.electronAPI) {
      console.log('🔥 Electron API 연결 성공!');
      
      // 초기 상태 로드
      loadInitialData();
    } else {
      console.warn('⚠️ Electron API 없음 - 개발 모드일 수 있습니다');
      
      // 개발 모드용 더미 데이터
      setState(prev => ({
        ...prev,
        keystrokes: 12543,
        wpm: 85,
        accuracy: 96,
        sessions: 23,
      }));
    }
  }, []);

  const loadInitialData = async (): Promise<void> => {
    try {
      // 키보드 상태 확인
      const statusResult = await window.electronAPI.keyboard.getStatus();
      if (statusResult.success) {
        setState(prev => ({ ...prev, isMonitoring: statusResult.data || false }));
      }

      // 통계 데이터 로드
      const statsResult = await window.electronAPI.database.getStats();
      if (statsResult.success && statsResult.data) {
        const data = statsResult.data;
        setState(prev => ({
          ...prev,
          keystrokes: data.totalKeystrokes || 0,
          wpm: 85, // 임시값
          accuracy: 96, // 임시값  
          sessions: 23, // 임시값
        }));
      }
    } catch (error) {
      console.error('❌ 초기 데이터 로드 실패:', error);
    }
  };

  const handleStartMonitoring = async (): Promise<void> => {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.keyboard.startMonitoring();
        if (result.success) {
          setState(prev => ({ ...prev, isMonitoring: true }));
          console.log('✅ 키보드 모니터링 시작');
        }
      } else {
        // 개발 모드용 시뮬레이션
        setState(prev => ({ ...prev, isMonitoring: true }));
        console.log('🔧 개발 모드: 모니터링 시뮬레이션 시작');
      }
    } catch (error) {
      console.error('❌ 모니터링 시작 실패:', error);
    }
  };

  const handleStopMonitoring = async (): Promise<void> => {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.keyboard.stopMonitoring();
        if (result.success) {
          setState(prev => ({ ...prev, isMonitoring: false }));
          console.log('🛑 키보드 모니터링 중지');
        }
      } else {
        // 개발 모드용 시뮬레이션
        setState(prev => ({ ...prev, isMonitoring: false }));
        console.log('🔧 개발 모드: 모니터링 시뮬레이션 중지');
      }
    } catch (error) {
      console.error('❌ 모니터링 중지 실패:', error);
    }
  };

  return (
    <div className={DASHBOARD_STYLES.container}>
      {/* 🔥 사이드바 */}
      <div className={DASHBOARD_STYLES.sidebar}>
        <div className={DASHBOARD_STYLES.sidebarHeader}>
          <h1 className="text-xl font-bold text-gray-900">Loop</h1>
          <p className="text-sm text-gray-600">Typing Analytics</p>
        </div>
        
        <nav className={DASHBOARD_STYLES.sidebarNav}>
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={item.active ? DASHBOARD_STYLES.sidebarItemActive : DASHBOARD_STYLES.sidebarItem}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
      </div>

      {/* 🔥 메인 컨텐츠 */}
      <div className={DASHBOARD_STYLES.main}>
        {/* 헤더 */}
        <div className={DASHBOARD_STYLES.header}>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">대시보드</h2>
            <p className="text-gray-600">실시간 타이핑 분석</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span 
                className={`${DASHBOARD_STYLES.statusIndicator} ${
                  state.isMonitoring ? DASHBOARD_STYLES.statusActive : DASHBOARD_STYLES.statusInactive
                }`}
              />
              <span className="text-sm text-gray-600">
                {state.isMonitoring ? '모니터링 중' : '모니터링 중지'}
              </span>
            </div>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className={DASHBOARD_STYLES.content}>
          {/* Quick Start Card */}
          <div className={DASHBOARD_STYLES.quickStartCard}>
            <h3 className={DASHBOARD_STYLES.quickStartTitle}>
              타이핑 모니터링 {state.isMonitoring ? '실행 중' : '시작하기'}
            </h3>
            <p className={DASHBOARD_STYLES.quickStartText}>
              {state.isMonitoring 
                ? '키보드 입력이 실시간으로 분석되고 있습니다.'
                : '키보드 모니터링을 시작하여 타이핑 패턴을 분석해보세요.'
              }
            </p>
            <button
              className={DASHBOARD_STYLES.quickStartButton}
              onClick={state.isMonitoring ? handleStopMonitoring : handleStartMonitoring}
            >
              {state.isMonitoring ? '모니터링 중지' : '모니터링 시작'}
            </button>
          </div>

          {/* 통계 카드들 */}
          <div className={DASHBOARD_STYLES.grid}>
            <div className={DASHBOARD_STYLES.card}>
              <h4 className={DASHBOARD_STYLES.cardTitle}>총 키 입력</h4>
              <div className={DASHBOARD_STYLES.cardValue}>
                {state.keystrokes.toLocaleString()}
              </div>
              <div className={DASHBOARD_STYLES.cardChange}>+12% 이번 주</div>
            </div>

            <div className={DASHBOARD_STYLES.card}>
              <h4 className={DASHBOARD_STYLES.cardTitle}>평균 WPM</h4>
              <div className={DASHBOARD_STYLES.cardValue}>
                {state.wpm}
              </div>
              <div className={DASHBOARD_STYLES.cardChange}>+5% 이번 주</div>
            </div>

            <div className={DASHBOARD_STYLES.card}>
              <h4 className={DASHBOARD_STYLES.cardTitle}>정확도</h4>
              <div className={DASHBOARD_STYLES.cardValue}>
                {state.accuracy}%
              </div>
              <div className={DASHBOARD_STYLES.cardChange}>+2% 이번 주</div>
            </div>

            <div className={DASHBOARD_STYLES.card}>
              <h4 className={DASHBOARD_STYLES.cardTitle}>총 세션</h4>
              <div className={DASHBOARD_STYLES.cardValue}>
                {state.sessions}
              </div>
              <div className={DASHBOARD_STYLES.cardChange}>+8 이번 주</div>
            </div>

            <div className={DASHBOARD_STYLES.card}>
              <h4 className={DASHBOARD_STYLES.cardTitle}>활성 앱</h4>
              <div className={DASHBOARD_STYLES.cardValue}>
                {state.currentApp}
              </div>
              <div className="text-sm text-gray-600">현재 감지된 앱</div>
            </div>

            <div className={DASHBOARD_STYLES.card}>
              <h4 className={DASHBOARD_STYLES.cardTitle}>오늘 시간</h4>
              <div className={DASHBOARD_STYLES.cardValue}>
                {state.todayTime}
              </div>
              <div className={DASHBOARD_STYLES.cardChange}>목표: 4h</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
