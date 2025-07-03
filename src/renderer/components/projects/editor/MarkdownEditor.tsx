'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { EDITOR_STYLES } from './EditorStyles';
import { useEditor } from './EditorProvider';

// 🔥 Ulysses/Scrivener 스타일 마크다운 에디터
const EasyMDEEditor = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-slate-800/5 h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-blue-600 animate-spin mb-4"></div>
        <span className="text-slate-500 font-medium">글쓰기 환경 준비 중...</span>
      </div>
    </div>
  )
});

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  isFocusMode: boolean;
}

export function MarkdownEditor({ content, onChange, isFocusMode }: MarkdownEditorProps): React.ReactElement {
  const { initializeEditor, getEditorOptions, getFocusModeOptions } = useEditor();

  return (
    <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900">
      <style jsx global>{`
        ${EDITOR_STYLES.customEditor}
      `}</style>
      
      {isFocusMode ? (
        // 몰입 모드 에디터
        <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 h-full">
          <div className="prose prose-slate dark:prose-invert max-w-none focus:outline-none px-16 py-12">
            <EasyMDEEditor
              value={content}
              onChange={onChange}
              options={getFocusModeOptions()}
              events={{
                instanceReady: initializeEditor
              }}
            />
          </div>
        </div>
      ) : (
        // 일반 모드 에디터
        <EasyMDEEditor
          value={content}
          onChange={onChange}
          options={getEditorOptions()}
          events={{
            instanceReady: initializeEditor
          }}
        />
      )}
    </div>
  );
}
