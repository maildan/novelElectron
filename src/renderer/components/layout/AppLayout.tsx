/**
 * 🔥 기가차드 DEEP DIVE AppLayout - 동적 오프셋 수술 완료 V2
 * 고정 패딩 박살내고 실시간 크기 계산으로 완전 정복
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { ActiveTab, NavItem } from '@shared/types';
import { AppHeader } from './AppHeader';
import { LAYOUT_STYLES, FLEX_PATTERNS, ICON_SIZES } from '../common/optimized-styles';
import { Logger } from '../../shared/logger';
import { 
  Home, 
  BarChart3, 
  FolderOpen, 
  Brain, 
  Settings,
  Menu,
  X
} from 'lucide-react';

interface AppLayoutProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  children: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: '대시보드', icon: 'Home' },
  { id: 'statistics', label: '통계', icon: 'BarChart3' },
  { id: 'projects', label: '프로젝트', icon: 'FolderOpen' },
  { id: 'ai', label: 'AI 분석', icon: 'Brain' },
  { id: 'settings', label: '설정', icon: 'Settings' },
];

const iconMap = {
  Home,
  BarChart3,
  FolderOpen,
  Brain,
  Settings,
};

export function AppLayout({ activeTab, onTabChange, children }: AppLayoutProps) {
  Logger.debug(`AppLayout ENTRY: ${activeTab}`);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  
  // #DEBUG: 동적 레이아웃 오프셋 계산 시스템
  const [layoutOffsets, setLayoutOffsets] = useState({
    headerHeight: 56,    // 기본값: 14 * 4px = 56px
    sidebarWidth: 256    // 기본값: 64 * 4px = 256px
  });
  
  const headerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // 🔥 기가차드 실시간 크기 측정 및 동적 오프셋 계산
  useEffect(() => {
    Logger.debug('AppLayout 동적 크기 측정 시작');
    
    const updateLayoutOffsets = () => {
      // 실제 헤더 높이 측정
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        Logger.debug(`Header height measured: ${headerHeight}px`);
        
        setLayoutOffsets(prev => ({
          ...prev,
          headerHeight: Math.max(headerHeight, 56) // 최소 56px 보장
        }));
      }
      
      // 실제 사이드바 너비 측정 (데스크톱에서만)
      if (sidebarRef.current && window.innerWidth >= 1024) {
        const sidebarWidth = sidebarRef.current.offsetWidth;
        Logger.debug(`Sidebar width measured: ${sidebarWidth}px`);
        
        setLayoutOffsets(prev => ({
          ...prev,
          sidebarWidth: Math.max(sidebarWidth, 256) // 최소 256px 보장
        }));
      }
    };

    const checkScreenSize = () => {
      const newIsDesktop = window.innerWidth >= 1024;
      setIsDesktop(newIsDesktop);
      Logger.debug(`AppLayout screen size changed: ${window.innerWidth}px, desktop: ${newIsDesktop}`);
      
      // 크기 변경 시 레이아웃 오프셋 재계산
      updateLayoutOffsets();
    };

    // 초기 측정
    updateLayoutOffsets();
    checkScreenSize();
    
    // ResizeObserver로 정확한 크기 변화 감지
    const resizeObserver = new ResizeObserver(() => {
      updateLayoutOffsets();
    });
    
    if (headerRef.current) resizeObserver.observe(headerRef.current);
    if (sidebarRef.current) resizeObserver.observe(sidebarRef.current);
    
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
      resizeObserver.disconnect();
      Logger.debug('AppLayout cleanup resize listener');
    };
  }, []);

  // 🔥 데스크톱에서는 사이드바 상태 무관 (CSS lg:translate-x-0으로 처리)
  useEffect(() => {
    if (isDesktop) {
      Logger.debug('AppLayout desktop mode: sidebar handled by CSS');
    }
  }, [isDesktop]);

  // #DEBUG: 동적 스타일 계산 + Z-Index 추가!
  const mainContentStyle: React.CSSProperties = {
    paddingTop: `${layoutOffsets.headerHeight}px`,
    paddingLeft: isDesktop ? `${layoutOffsets.sidebarWidth}px` : '0',
    minHeight: `calc(100vh - ${layoutOffsets.headerHeight}px)`,
    transition: 'padding 0.2s ease-in-out', // 부드러운 전환
    position: 'relative',  // Z-Index 활성화
    zIndex: 1,             // 헤더(z-50) 아래, 카드들 기본층
    backgroundColor: '#f8fafc' // 배경 보장
  };

  Logger.debug('AppLayout EXIT: layout rendered');

  return (
    <div className={LAYOUT_STYLES.pageContainer}>
      {/* Fixed App Header - ref 추가 */}
      <div ref={headerRef} className={LAYOUT_STYLES.headerFixed}>
        <AppHeader 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          showMonitoring={true}
        />
      </div>
      
      {/* Mobile sidebar backdrop - 모바일에서만 표시 */}
      {sidebarOpen && (
        <div 
          className={LAYOUT_STYLES.backdrop}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - ref 추가, 기가차드 조건부 로직 완전 제거 */}
      <div ref={sidebarRef} className={LAYOUT_STYLES.sidebar(sidebarOpen)}>
        <div className={LAYOUT_STYLES.sidebarHeader}>
          <div className={FLEX_PATTERNS.between}>
            <h1 className={LAYOUT_STYLES.sidebarHeaderTitle}>
              Navigation
            </h1>
            <button 
              onClick={() => setSidebarOpen(false)}
              className={LAYOUT_STYLES.sidebarCloseBtn}
            >
              <X className={ICON_SIZES.md} />
            </button>
          </div>
        </div>

        <nav className={LAYOUT_STYLES.sidebarNav}>
          <ul className={LAYOUT_STYLES.sidebarNavList}>
            {navItems.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onTabChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`${LAYOUT_STYLES.navButtonBase} ${
                      isActive ? LAYOUT_STYLES.navButtonActive : LAYOUT_STYLES.navButtonInactive
                    }`}
                  >
                    <Icon className={`${ICON_SIZES.md} mr-3`} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main content - 동적 스타일 적용 */}
      <div style={mainContentStyle}>
        {/* Mobile menu button */}
        <div className={LAYOUT_STYLES.mobileMenu}>
          <div className={FLEX_PATTERNS.between}>
            <button
              onClick={() => setSidebarOpen(true)}
              className={LAYOUT_STYLES.mobileMenuBtn}
            >
              <Menu className={ICON_SIZES.md} />
            </button>
            <h2 className={LAYOUT_STYLES.mobileMenuTitle}>
              {navItems.find(item => item.id === activeTab)?.label || '대시보드'}
            </h2>
          </div>
        </div>

        {/* Page content */}
        <main className={LAYOUT_STYLES.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
