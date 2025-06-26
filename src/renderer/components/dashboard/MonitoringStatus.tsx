'use client';

import React, { ReactElement } from 'react';
import { MonitoringState } from '../../shared/types';
import { Logger } from '../../shared/logger';
import { SHARED_STYLES } from '../../shared/styles';

interface MonitoringStatusProps {
  state: MonitoringState;
}

export const MonitoringStatus: React.FC<MonitoringStatusProps> = ({ state }): ReactElement => {
  React.useEffect(() => {
    Logger.info('MonitoringStatus', `상태: ${state.active ? '활성' : '비활성'}`);
  }, [state.active]);

  return (
    <div className="flex items-center gap-2" aria-live="polite">
      <span className={state.active ? SHARED_STYLES.successText : SHARED_STYLES.errorText}>
        {state.active ? '모니터링 중' : '모니터링 꺼짐'}
      </span>
      {state.error && <span className={SHARED_STYLES.errorText}>({state.error})</span>}
    </div>
  );
}; 