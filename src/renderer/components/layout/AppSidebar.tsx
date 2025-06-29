'use client';

import React, { useState } from 'react';
import { 
  Home, 
  FolderOpen, 
  BarChart3, 
  Sparkles, 
  Settings,
  ChevronLeft,
  ChevronRight,
  type LucideIcon 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { Badge } from '../ui/Badge';
import { Logger } from '../../../shared/logger';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const SIDEBAR_STYLES = {
  container: 'flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-300',
  collapsed: 'w-16',
  expanded: 'w-64',
  logoSection: 'h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-700 px-6',
  logoCollapsed: 'h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-700 px-3',
  logoText: 'text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
  logoIcon: 'w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm',
  profileSection: 'border-b border-slate-200 dark:border-slate-700 p-4',
  profileCollapsed: 'border-b border-slate-200 dark:border-slate-700 p-3 flex flex-col items-center gap-2',
  profileContent: 'flex items-center gap-3',
  profileInfo: 'flex-1',
  profileName: 'font-medium text-slate-900 dark:text-slate-100 text-sm',
  profileStatus: 'flex items-center gap-1 mt-0.5',
  statusDot: 'w-1.5 h-1.5 bg-green-500 rounded-full',
  statusText: 'text-xs text-slate-500 dark:text-slate-400',
  collapseButton: 'h-6 w-6 p-0 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300',
  navSection: 'flex-1 py-4',
  navList: 'space-y-1 px-3',
  navItem: 'flex items-center h-10 px-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-150 group cursor-pointer',
  navItemActive: 'flex items-center h-10 px-3 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg font-medium',
  navItemCollapsed: 'flex items-center justify-center h-10 w-10 mx-auto text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-150 cursor-pointer',
  navItemActiveCollapsed: 'flex items-center justify-center h-10 w-10 mx-auto bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg',
  icon: 'w-5 h-5 group-hover:scale-110 transition-transform duration-150 flex-shrink-0',
  iconCollapsed: 'w-5 h-5',
  text: 'ml-3 font-medium',
  badge: 'ml-auto',
  bottomSection: 'border-t border-slate-200 dark:border-slate-700 p-3',
} as const;

// 🔥 기가차드 규칙: 명시적 타입 정의
interface SidebarItem {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly href: string;
  readonly badge?: number;
  readonly ariaLabel?: string;
}

export interface AppSidebarProps {
  readonly activeRoute?: string;
  readonly onNavigate?: (href: string) => void;
  readonly collapsed?: boolean;
  readonly onToggleCollapse?: () => void;
}

// 🔥 기가차드 규칙: 상수 분리
const SIDEBAR_ITEMS: readonly SidebarItem[] = [
  { 
    id: 'dashboard', 
    label: '대시보드', 
    icon: Home, 
    href: '/',
    ariaLabel: '대시보드로 이동'
  },
  { 
    id: 'projects', 
    label: '프로젝트', 
    icon: FolderOpen, 
    href: '/projects',
    ariaLabel: '프로젝트 관리로 이동'
  },
  { 
    id: 'analytics', 
    label: '통계', 
    icon: BarChart3, 
    href: '/analytics',
    ariaLabel: '분석 및 통계로 이동'
  },
  { 
    id: 'ai', 
    label: 'Loop AI', 
    icon: Sparkles, 
    href: '/ai',
    badge: 2,
    ariaLabel: 'AI 도구로 이동'
  },
  { 
    id: 'settings', 
    label: '설정', 
    icon: Settings, 
    href: '/settings',
    ariaLabel: '설정으로 이동'
  },
] as const;

export function AppSidebar({ 
  activeRoute = '/',
  onNavigate,
  collapsed: controlledCollapsed,
  onToggleCollapse
}: AppSidebarProps): React.ReactElement {
  
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(false);
  const isControlled = controlledCollapsed !== undefined;
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const handleToggleCollapse = (): void => {
    if (isControlled) {
      onToggleCollapse?.();
    } else {
      setInternalCollapsed(!collapsed);
    }
    Logger.info('SIDEBAR', `Sidebar ${collapsed ? 'expanded' : 'collapsed'}`);
  };

  const handleNavigate = (item: SidebarItem): void => {
    Logger.info('SIDEBAR', `Navigation to ${item.label}`, { href: item.href });
    onNavigate?.(item.href);
  };

  const handleKeyDown = (event: React.KeyboardEvent, item: SidebarItem): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigate(item);
    }
  };

  const renderNavItem = (item: SidebarItem): React.ReactElement => {
    const isActive = activeRoute === item.href;
    const Icon = item.icon;
    
    const navItemContent = (
      <div
        className={
          collapsed
            ? isActive 
              ? SIDEBAR_STYLES.navItemActiveCollapsed
              : SIDEBAR_STYLES.navItemCollapsed
            : isActive 
              ? SIDEBAR_STYLES.navItemActive 
              : SIDEBAR_STYLES.navItem
        }
        role="button"
        tabIndex={0}
        onClick={() => handleNavigate(item)}
        onKeyDown={(e) => handleKeyDown(e, item)}
        aria-label={item.ariaLabel || item.label}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className={collapsed ? SIDEBAR_STYLES.iconCollapsed : SIDEBAR_STYLES.icon} />
        {!collapsed && (
          <>
            <span className={SIDEBAR_STYLES.text}>{item.label}</span>
            {item.badge && item.badge > 0 && (
              <Badge variant="danger" size="sm" className={SIDEBAR_STYLES.badge}>
                {item.badge > 9 ? '9+' : item.badge}
              </Badge>
            )}
          </>
        )}
      </div>
    );

    return collapsed ? (
      <Tooltip key={item.id} content={item.label} side="right">
        {navItemContent}
      </Tooltip>
    ) : (
      <div key={item.id}>
        {navItemContent}
      </div>
    );
  };

  return (
    <aside 
      className={`${SIDEBAR_STYLES.container} ${
        collapsed ? SIDEBAR_STYLES.collapsed : SIDEBAR_STYLES.expanded
      }`}
      aria-label="사이드바 네비게이션"
      role="navigation"
    >
      {/* 로고 */}
      <div className={collapsed ? SIDEBAR_STYLES.logoCollapsed : SIDEBAR_STYLES.logoSection}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className={SIDEBAR_STYLES.logoIcon}>L</div>
            <Button
              variant="ghost"
              size="sm"
              className={SIDEBAR_STYLES.collapseButton}
              onClick={handleToggleCollapse}
              aria-label="사이드바 확장"
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <h1 className={SIDEBAR_STYLES.logoText}>Loop</h1>
            <Button
              variant="ghost"
              size="sm"
              className={SIDEBAR_STYLES.collapseButton}
              onClick={handleToggleCollapse}
              aria-label="사이드바 축소"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {/* 네비게이션 */}
      <nav className={SIDEBAR_STYLES.navSection} aria-label="메인 메뉴">
        <div className={SIDEBAR_STYLES.navList}>
          {SIDEBAR_ITEMS.map(renderNavItem)}
        </div>
      </nav>

      {/* 사용자 프로필 */}
      <div className={collapsed ? SIDEBAR_STYLES.profileCollapsed : SIDEBAR_STYLES.profileSection}>
        {collapsed ? (
          <div 
            className="flex flex-col items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
            onClick={() => {
              Logger.info('SIDEBAR', 'User profile clicked (collapsed)');
              onNavigate?.('/settings'); // 설정 페이지로 이동
            }}
            role="button"
            tabIndex={0}
            aria-label="사용자 프로필"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              U
            </div>
            <div className={SIDEBAR_STYLES.statusDot} />
          </div>
        ) : (
          <div 
            className={`${SIDEBAR_STYLES.profileContent} cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors`}
            onClick={() => {
              Logger.info('SIDEBAR', 'User profile clicked');
              onNavigate?.('/settings'); // 설정 페이지로 이동
            }}
            role="button"
            tabIndex={0}
            aria-label="사용자 프로필"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
              U
            </div>
            <div className={SIDEBAR_STYLES.profileInfo}>
              <div className={SIDEBAR_STYLES.profileName}>Loop 사용자</div>
              <div className={SIDEBAR_STYLES.profileStatus}>
                <div className={SIDEBAR_STYLES.statusDot} />
                <span className={SIDEBAR_STYLES.statusText}>온라인</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
