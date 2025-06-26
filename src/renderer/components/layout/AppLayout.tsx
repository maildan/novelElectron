'use client';

import { useState } from 'react';
import { ActiveTab, NavItem } from '@shared/types';
import { AppHeader } from './AppHeader';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Fixed App Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <AppHeader 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          showMonitoring={true}
        />
      </div>
      
      {/* Mobile sidebar backdrop - 헤더 아래에 위치 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 top-14 bg-gray-900/50 backdrop-blur-sm z-35 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar with proper z-index */}
      <div className={`
        fixed top-14 bottom-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700 
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Navigation
          </h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-2">
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
                    className={`
                      w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg
                      transition-colors duration-200
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main content with proper margins */}
      <div className="pt-14 lg:pl-64">
        {/* Mobile menu button - z-index 수정 */}
        <div className="lg:hidden sticky top-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 z-20">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {navItems.find(item => item.id === activeTab)?.label || '대시보드'}
            </h2>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
