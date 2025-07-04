'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { EDITOR_STYLES } from './EditorStyles';
import { useEditor } from './EditorProvider';
import { CustomToolbar } from './CustomToolbar';
import { setupKoreanInputOptimization } from './MarkdownUtils'; // 🔥 한글 최적화 임포트
import { Logger } from '../../../../shared/logger';
import './NotionMarkdownEditor.css'; // 🔥 노션 스타일 CSS 임포트

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
  const editorInstanceRef = useRef<any>(null);

  // 🔥 에디터 인스턴스 저장 및 최적화 적용 (기가차드 수정: 무한루프 제거)
  const handleEditorReady = useCallback((editor: any) => {
    editorInstanceRef.current = editor;
    
    try {
      // 기본 에디터 초기화
      initializeEditor(editor);
      
      // 🔥 한글 입력 최적화 적용 (한 번만!)
      if (editor?.codemirror) {
        setupKoreanInputOptimization(editor.codemirror);
        Logger.info('MARKDOWN_EDITOR', 'Korean input optimization applied');
      }
      
    } catch (error) {
      Logger.error('MARKDOWN_EDITOR', 'Failed to initialize editor optimizations', error);
    }
  }, [initializeEditor]);

  // 🔥 툴바 액션 핸들러 (에디터 포커스 유지)
  const handleToolbarAction = (action: string) => {
    Logger.debug('MARKDOWN_EDITOR', `Toolbar action executed: ${action}`);
    
    // 툴바 액션 후 에디터 포커스 복원
    setTimeout(() => {
      if (editorInstanceRef.current?.codemirror) {
        editorInstanceRef.current.codemirror.focus();
      }
    }, 50);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 🔥 커스텀 툴바 (포커스 모드가 아닐 때만 표시) */}
      {!isFocusMode && (
        <CustomToolbar 
          editor={editorInstanceRef.current}
          onAction={handleToolbarAction}
        />
      )}
      
      <div className="flex-1 overflow-auto">
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
                  instanceReady: handleEditorReady
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
              instanceReady: handleEditorReady
            }}
          />
        )}
      </div>
    </div>
  );
}
