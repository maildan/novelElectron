'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ProjectEditor } from '../../../components/projects/ProjectEditor';
import { Logger } from '../../../../shared/logger';

// 🔥 Next.js 15: 'use client'와 generateStaticParams 동시 사용 불가
// 동적 라우팅이므로 generateStaticParams 제거

export default function ProjectPage(): React.ReactElement {
  const params = useParams();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

  // 🔥 파라미터 검증
  if (!projectId) {
    Logger.error('PROJECT_PAGE', 'Missing project ID in route parameters');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">오류</h1>
          <p className="text-slate-600">프로젝트 ID가 없습니다.</p>
        </div>
      </div>
    );
  }

  Logger.debug('PROJECT_PAGE', 'Loading project page', { projectId });

  return <ProjectEditor projectId={projectId} />;
}
