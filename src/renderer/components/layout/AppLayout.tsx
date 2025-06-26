/**
 * 🔥 AppLayout.tsx 전용 최종 버전 - 기가차드 30분 해결
 * 모든 조건부 className 제거, 프리컴파일된 스타일만 사용
 */

'use client';

import { useState, useEffect } from 'react';
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

  // 🔥 기가차드 반응형 감지
  useEffect(() => {
    Logger.debug('AppLayout screen size check started');
    
    const checkScreenSize = () => {
      const newIsDesktop = window.innerWidth >= 1024;
      setIsDesktop(newIsDesktop);
      Logger.debug(`AppLayout screen size changed: ${window.innerWidth}px, desktop: ${newIsDesktop}`);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
      Logger.debug('AppLayout cleanup resize listener');
    };
  }, []);

  // 🔥 데스크톱에서는 사이드바 상태 무관 (CSS lg:translate-x-0으로 처리)
  useEffect(() => {
    if (isDesktop) {
      Logger.debug('AppLayout desktop mode: sidebar handled by CSS');
    }
  }, [isDesktop]);

  Logger.debug('AppLayout EXIT: layout rendered');

  return (
    <div className={LAYOUT_STYLES.pageContainer}>
      {/* Fixed App Header */}
      <div className={LAYOUT_STYLES.headerFixed}>
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

      {/* Sidebar - 기가차드 조건부 로직 완전 제거 */}
      <div className={LAYOUT_STYLES.sidebar(sidebarOpen)}>
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

      {/* Main content with consistent padding */}
      <div className={LAYOUT_STYLES.mainContent}>
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
