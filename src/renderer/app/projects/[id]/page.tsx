'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ProjectEditor } from '../../../components/projects/ProjectEditor';
import { Logger } from '../../../../shared/logger';

// 🔥 Next.js 15: 'use client'와 generateStaticParams 동시 사용 불가
// 동적 라우팅이므로 클라이언트 컴포넌트로 설정

export default function ProjectPage(): React.ReactElement {
  const params = useParams();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

  // 🔥 엄격한 로깅 - 파라미터 정보 완전 출력
  Logger.info('PROJECT_PAGE', '🔍 PROJECT PAGE ACCESSED', { 
    params, 
    projectId, 
    paramsType: typeof params,
    paramsKeys: Object.keys(params || {}),
    paramsId: params?.id,
    paramsIdType: typeof params?.id,
    paramsIdIsArray: Array.isArray(params?.id),
    url: typeof window !== 'undefined' ? window.location.href : 'N/A',
    pathname: typeof window !== 'undefined' ? window.location.pathname : 'N/A'
  });

  // 🔥 추가 검증 로깅
  if (params) {
    Logger.info('PROJECT_PAGE', '🔍 DETAILED PARAMS ANALYSIS', {
      'params.id': params.id,
      'params.id === undefined': params.id === undefined,
      'params.id === null': params.id === null,
      'params.id === ""': params.id === '',
      'Boolean(params.id)': Boolean(params.id),
      'String(params.id)': String(params.id),
    });
  }

  // 🔥 파라미터 검증
  if (!projectId) {
    Logger.error('PROJECT_PAGE', '❌ MISSING PROJECT ID - SHOWING ERROR INSTEAD OF REDIRECTING', { 
      params, 
      url: typeof window !== 'undefined' ? window.location.href : 'N/A' 
    });
    
    // 🔥 리다이렉트 대신 에러 정보 화면 표시 (디버깅용)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
          <h1 className="text-2xl font-bold text-red-600 mb-4">🚨 디버깅 정보</h1>
          <p className="text-slate-600 mb-4">프로젝트 ID가 없습니다.</p>
          <div className="text-left bg-gray-100 p-4 rounded text-sm font-mono">
            <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
            <p><strong>Pathname:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}</p>
            <p><strong>Params:</strong> {JSON.stringify(params, null, 2)}</p>
            <p><strong>ProjectId:</strong> {String(projectId)}</p>
          </div>
          <button 
            onClick={() => window.location.href = '/projects'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            프로젝트 목록으로 이동
          </button>
        </div>
      </div>
    );
  }

  Logger.info('PROJECT_PAGE', '✅ PROJECT ID FOUND - LOADING PROJECT EDITOR', { projectId });

  return <ProjectEditor projectId={projectId} />;
}
