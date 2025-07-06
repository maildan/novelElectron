'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Focus from '@tiptap/extension-focus';
import Typography from '@tiptap/extension-typography';
import CharacterCount from '@tiptap/extension-character-count';
import Underline from '@tiptap/extension-underline';
import { Logger } from '../../../../shared/logger';
import { handleEditorKeyDown, bindShortcutsToEditor, ALL_SHORTCUTS } from './EditorShortcuts';

// 🔥 작가 친화적 TipTap 에디터 스타일
const EDITOR_STYLES = {
  container: 'w-full h-full flex flex-col',
  editor: 'flex-1 p-6 prose prose-slate max-w-none focus:outline-none',
  focused: 'prose-lg', // 포커스 모드에서 더 큰 글자
  placeholder: 'text-slate-400 pointer-events-none',
  bubble: 'flex gap-2 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg',
  bubbleButton: 'px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded transition-colors'
} as const;

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  isFocusMode: boolean;
}

export function MarkdownEditor({ content, onChange, isFocusMode }: MarkdownEditorProps): React.ReactElement {
  const [isReady, setIsReady] = useState(false);

  // 🔥 TipTap 에디터 초기화 (Notion 스타일 + 작가 친화적 설정)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // 🔥 작가 친화적 설정
        heading: {
          levels: [1, 2, 3, 4] // H1~H4만 사용
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-outside ml-6'
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-outside ml-6'
          }
        }
      }),
      
      // 🔥 언더라인 확장
      Underline,
      
      // 🔥 Placeholder 확장 (작가 친화적)
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            const level = node.attrs.level;
            switch (level) {
              case 1: return '제목을 입력하세요...';
              case 2: return '챕터 제목...';
              case 3: return '섹션 제목...';
              default: return '소제목...';
            }
          }
          return '이야기를 시작해보세요...';
        },
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
      
      // 🔥 Focus 확장 (포커스 모드)
      Focus.configure({
        className: 'has-focus',
        mode: 'all',
      }),
      
      // 🔥 Typography 확장 (작가 친화적 타이포그래피)
      Typography.configure({
        openDoubleQuote: '"',
        closeDoubleQuote: '"',
        openSingleQuote: "'",
        closeSingleQuote: "'",
        ellipsis: '...',
        emDash: '--',
      }),
      
      // 🔥 문자 수 카운트
      CharacterCount,
    ],
    
    content,
    
    // 🔥 에디터 설정
    editorProps: {
      attributes: {
        class: `${EDITOR_STYLES.editor} ${isFocusMode ? EDITOR_STYLES.focused : ''}`,
        'data-placeholder': '이야기를 시작해보세요...',
      },
      
      // 🔥 강화된 노션 스타일 키보드 핸들러
      handleKeyDown: (view, event) => {
        const { state, dispatch } = view;
        const { selection } = state;
        
        // 🔥 Space 키 마크다운 처리 최우선 (노션 스타일)
        if (event.key === ' ') {
          const { $from } = selection;
          const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);
          
          // # 처리 (제목)
          if (textBefore === '#') {
            event.preventDefault();
            const tr = state.tr.setBlockType($from.before(), $from.after(), state.schema.nodes.heading, { level: 1 });
            tr.delete($from.pos - 1, $from.pos); // # 문자 삭제
            dispatch(tr);
            return true;
          }
          
          // ## 처리
          if (textBefore === '##') {
            event.preventDefault();
            const tr = state.tr.setBlockType($from.before(), $from.after(), state.schema.nodes.heading, { level: 2 });
            tr.delete($from.pos - 2, $from.pos); // ## 문자 삭제
            dispatch(tr);
            return true;
          }
          
          // ### 처리
          if (textBefore === '###') {
            event.preventDefault();
            const tr = state.tr.setBlockType($from.before(), $from.after(), state.schema.nodes.heading, { level: 3 });
            tr.delete($from.pos - 3, $from.pos); // ### 문자 삭제
            dispatch(tr);
            return true;
          }
          
          // - 처리 (불릿 리스트)
          if (textBefore === '-') {
            event.preventDefault();
            const tr = state.tr.setBlockType($from.before(), $from.after(), state.schema.nodes.listItem);
            tr.delete($from.pos - 1, $from.pos); // - 문자 삭제
            const blockRange = $from.blockRange();
            if (blockRange) {
              const wrappedTr = tr.wrap(blockRange, [{ type: state.schema.nodes.bulletList }]);
              dispatch(wrappedTr || tr);
            } else {
              dispatch(tr);
            }
            return true;
          }
          
          // 1. 처리 (번호 리스트)
          if (/^\d+\.$/.test(textBefore)) {
            event.preventDefault();
            const tr = state.tr.setBlockType($from.before(), $from.after(), state.schema.nodes.listItem);
            tr.delete($from.pos - textBefore.length, $from.pos); // 번호 문자 삭제
            const blockRange = $from.blockRange();
            if (blockRange) {
              const wrappedTr = tr.wrap(blockRange, [{ type: state.schema.nodes.orderedList }]);
              dispatch(wrappedTr || tr);
            } else {
              dispatch(tr);
            }
            return true;
          }
        }
        
        // 🔥 마크다운 처리 후 단축키 시스템 처리
        if (handleEditorKeyDown(editor, event)) {
          return true;
        }
        
        return false;
      },
    },
    
    // 🔥 콘텐츠 변경 핸들러
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      onChange(newContent);
      Logger.debug('TIPTAP_EDITOR', 'Content updated', { 
        wordCount: editor.storage.characterCount?.words() || 0 
      });
    },
    
    // 🔥 에디터 준비 완료
    onCreate: ({ editor }) => {
      setIsReady(true);
      Logger.info('TIPTAP_EDITOR', 'Editor created successfully');
    },
    
    // 🔥 에디터 포커스
    onFocus: ({ editor }) => {
      Logger.debug('TIPTAP_EDITOR', 'Editor focused');
    },
    
    // 🔥 에디터 블러
    onBlur: ({ editor }) => {
      Logger.debug('TIPTAP_EDITOR', 'Editor blurred');
    },
  });

  // 🔥 외부 content 변경 시 에디터 업데이트
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  // 🔥 포커스 모드 변경 시 클래스 업데이트
  useEffect(() => {
    if (editor) {
      const editorElement = editor.view.dom as HTMLElement;
      editorElement.className = `${EDITOR_STYLES.editor} ${isFocusMode ? EDITOR_STYLES.focused : ''}`;
    }
  }, [isFocusMode, editor]);

  // 🔥 단축키 바인딩 및 저장 이벤트 리스너
  useEffect(() => {
    if (!editor) return;

    // 🔥 단축키 바인딩
    const unbindShortcuts = bindShortcutsToEditor(editor);
    
    // 🔥 저장 이벤트 리스너 (Ctrl+S)
    const handleSave = () => {
      const saveEvent = new CustomEvent('project:save');
      window.dispatchEvent(saveEvent);
      Logger.info('TIPTAP_EDITOR', 'Save event triggered from editor');
    };
    
    window.addEventListener('editor:save', handleSave);
    
    Logger.info('TIPTAP_EDITOR', 'Shortcuts and save event bound', {
      shortcutCount: ALL_SHORTCUTS.length
    });

    // 🔥 정리 함수
    return () => {
      unbindShortcuts();
      window.removeEventListener('editor:save', handleSave);
      Logger.debug('TIPTAP_EDITOR', 'Shortcuts and events unbound');
    };
  }, [editor]);

  // 🔥 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
        Logger.debug('TIPTAP_EDITOR', 'Editor destroyed');
      }
    };
  }, [editor]);

  // 🔥 로딩 중 표시
  if (!isReady) {
    return (
      <div className={EDITOR_STYLES.container}>
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-500 text-sm">에디터 준비 중...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={EDITOR_STYLES.container}>
      {/* 🔥 Bubble Menu (선택 시 나타나는 툴바) */}
      {editor && (
        <BubbleMenu editor={editor} className={EDITOR_STYLES.bubble}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${EDITOR_STYLES.bubbleButton} ${
              editor.isActive('bold') ? 'bg-blue-200 dark:bg-blue-800' : ''
            }`}
            title="볼드 (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${EDITOR_STYLES.bubbleButton} ${
              editor.isActive('italic') ? 'bg-blue-200 dark:bg-blue-800' : ''
            }`}
            title="이탤릭 (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`${EDITOR_STYLES.bubbleButton} ${
              editor.isActive('underline') ? 'bg-blue-200 dark:bg-blue-800' : ''
            }`}
            title="언더라인 (Ctrl+U)"
          >
            <u>U</u>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`${EDITOR_STYLES.bubbleButton} ${
              editor.isActive('strike') ? 'bg-blue-200 dark:bg-blue-800' : ''
            }`}
            title="취소선 (Ctrl+Shift+S)"
          >
            <s>S</s>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`${EDITOR_STYLES.bubbleButton} ${
              editor.isActive('code') ? 'bg-blue-200 dark:bg-blue-800' : ''
            }`}
            title="코드"
          >
            Code
          </button>
        </BubbleMenu>
      )}
      
      {/* 🔥 메인 에디터 */}
      <EditorContent editor={editor} />
    </div>
  );
}
