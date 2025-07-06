'use client';

import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useEditor } from './EditorProvider';
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
  const { initializeEditor, getEditorOptions } = useEditor();
  const editorInstanceRef = useRef<any>(null);
  const isInitializedRef = useRef(false); // 🔥 중복 초기화 방지
  const contentRef = useRef<string>(content); // 🔥 content를 ref로 추적
  const [, forceUpdate] = useState({}); // 🔥 강제 re-render를 위한 상태

  // 🔥 기가차드 핵심 수정: EasyMDE options 완전 고정 (재초기화 방지)
  const editorOptions = useMemo(() => {
    return {
      ...getEditorOptions(),
      autofocus: false, // 🔥 자동 포커스 비활성화로 커서 문제 방지
    };
  }, []); // 🔥 dependency 없음 = 절대 재생성되지 않음

  // 🔥 onChange 핸들러 최적화 (무한루프 방지)
  const handleChange = useCallback((value: string) => {
    // 내용이 실제로 변경되었을 때만 처리
    if (value !== contentRef.current) {
      contentRef.current = value;
      onChange(value);
    }
  }, [onChange]);

  // 🔥 에디터 인스턴스 저장 및 최적화 적용 (기가차드 수정: 한 번만 실행)
  const handleEditorReady = useCallback((editor: any) => {
    if (isInitializedRef.current) return; // 🔥 중복 실행 방지
    
    editorInstanceRef.current = editor;
    
    try {
      // 기본 에디터 초기화
      initializeEditor(editor);
      
      // 🔥 한글 입력 최적화 적용 (한 번만!)
      if (editor?.codemirror) {
        setupKoreanInputOptimization(editor.codemirror);
        Logger.info('MARKDOWN_EDITOR', 'Korean input optimization applied');
      }
      
      isInitializedRef.current = true; // 🔥 초기화 완료 표시
      
      // 🔥 에디터 준비 완료 후 상태 업데이트 강제 (툴바 연동을 위해)
      setTimeout(() => {
        // 부모 컴포넌트 re-render를 유도하여 툴바가 에디터 인스턴스를 받도록 함
        if (editorInstanceRef.current) {
          Logger.debug('MARKDOWN_EDITOR', 'Editor instance ready for toolbar');
        }
      }, 100);
      
    } catch (error) {
      Logger.error('MARKDOWN_EDITOR', 'Failed to initialize editor optimizations', error);
    }
  }, [initializeEditor]); // 🔥 필요한 dependency만 추가

  // 🔥 컴포넌트 정리 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      if (editorInstanceRef.current) {
        try {
          // EasyMDE 인스턴스 정리
          if (typeof editorInstanceRef.current.cleanup === 'function') {
            editorInstanceRef.current.cleanup();
          }
          editorInstanceRef.current = null;
          isInitializedRef.current = false;
          Logger.debug('MARKDOWN_EDITOR', 'Editor instance cleaned up');
        } catch (error) {
          Logger.warn('MARKDOWN_EDITOR', 'Error during cleanup', error);
        }
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="flex-1 overflow-auto">
        {/* 🔥 기가차드 핵심 수정: defaultValue로 초기 커서 문제 해결 */}
        <div className={isFocusMode ? 'focus-mode-editor' : 'normal-mode-editor'}>
          <EasyMDEEditor
            key={content ? 'with-content' : 'empty'} // 🔥 content 유무로 key 설정
            defaultValue={content} // 🔥 defaultValue 사용으로 초기 커서 문제 해결
            onChange={handleChange} // 🔥 최적화된 onChange만
            options={editorOptions} // 🔥 useMemo로 고정된 options
            events={{
              instanceReady: handleEditorReady
            }}
          />
        </div>
      </div>
    </div>
  );
}
