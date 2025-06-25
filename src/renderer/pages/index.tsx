'use client';

import React from 'react';
import { Dashboard } from '../components/dashboard/Dashboard';
import { useLoopData } from '../hooks/useLoopData';

/**
 * 🔥 기가차드 메인 페이지
 * Loop Typing Analytics - Main Page
 */
export default function HomePage() {
  const loopData = useLoopData();

  return (
    <main className="min-h-screen bg-slate-50">
      <Dashboard 
        logs={loopData.logs} 
        loading={loopData.loading}
        onTypingComplete={() => {}}
      />
    </main>
  );
}
