'use client';

import React, { useState } from 'react';
import { Dashboard } from '../components/dashboard/Dashboard';
import { Statistics } from '../components/statistics/Statistics';
import { Projects } from '../components/projects/Projects';
import { AIAnalytics } from '../components/ai/AIAnalytics';
import { Settings } from '../components/settings/Settings';
import { AppLayout } from '../components/layout/AppLayout';
import { useLoopData } from '../hooks/useLoopData';
import { ActiveTab } from '@shared/types';

/**
 * 🔥 기가차드 메인 페이지
 * Loop Typing Analytics - Main Page
 */
export default function HomePage() {
  const loopData = useLoopData();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            logs={loopData.logs} 
            loading={loopData.loading}
            onTypingComplete={() => {}}
          />
        );
      case 'statistics':
        return (
          <Statistics 
            logs={loopData.logs} 
            loading={loopData.loading}
            onTypingComplete={() => {}}
          />
        );
      case 'projects':
        return (
          <Projects 
            logs={loopData.logs} 
            loading={loopData.loading}
            onTypingComplete={() => {}}
          />
        );
      case 'ai':
        return (
          <AIAnalytics 
            logs={loopData.logs} 
            loading={loopData.loading}
            onTypingComplete={() => {}}
          />
        );
      case 'settings':
        return (
          <Settings 
            logs={loopData.logs} 
            loading={loopData.loading}
            onTypingComplete={() => {}}
          />
        );
      default:
        return (
          <Dashboard 
            logs={loopData.logs} 
            loading={loopData.loading}
            onTypingComplete={() => {}}
          />
        );
    }
  };

  return (
    <AppLayout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </AppLayout>
  );
}
