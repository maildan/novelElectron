'use client';

import React from 'react';
import { DashboardMain } from '../components/dashboard/DashboardMain';
import { EnvironmentDetector } from '../components/debug/EnvironmentDetector';
import { IPCTestComponent } from '../components/debug/IPCTestComponent';

export default function DashboardPage(): React.ReactElement {
  return (
    <div className="min-h-screen">
      {/* 🔧 개발/디버깅용 환경 감지 & IPC 테스트 컴포넌트 */}
      <div className="p-4 space-y-4">
        <EnvironmentDetector />
        <IPCTestComponent />
      </div>
      <DashboardMain />
    </div>
  );
}
