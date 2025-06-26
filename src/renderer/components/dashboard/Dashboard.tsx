'use client';

import React, { ReactElement, useState } from 'react';
import { Logger } from '../../shared/logger';
import { MonitoringStatus } from './MonitoringStatus';
import { MonitoringState } from '../../shared/types';

const DASHBOARD_STYLES = {
  container: 'flex flex-col gap-6 p-6 bg-white dark:bg-slate-900 rounded-lg shadow-md min-h-[400px]',
  title: 'text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2',
  subtitle: 'text-base text-slate-600 dark:text-slate-300 mb-4',
};

export const Dashboard: React.FC = (): ReactElement => {
  const [monitoring, setMonitoring] = useState<MonitoringState>({ active: false });

  React.useEffect(() => {
    Logger.info('Dashboard', '대시보드 렌더링 완료');
    return () => {
      Logger.info('Dashboard', '대시보드 언마운트');
    };
  }, []);

  // TODO: 실제 IPC 연동 및 상태 관리로 확장

  return (
    <section className={DASHBOARD_STYLES.container} aria-label="대시보드 메인">
      <h1 className={DASHBOARD_STYLES.title}>Loop 대시보드</h1>
      <p className={DASHBOARD_STYLES.subtitle}>실시간 타이핑 분석, 프로젝트 현황, AI 통계 등 모든 정보를 한눈에 확인하세요.</p>
      <MonitoringStatus state={monitoring} />
      {/* TODO: 주요 통계, 프로젝트 요약, AI 분석 등 위젯 컴포넌트로 확장 */}
    </section>
  );
}; 