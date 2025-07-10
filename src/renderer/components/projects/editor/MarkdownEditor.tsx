'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Focus from '@tiptap/extension-focus';
import Typography from '@tiptap/extension-typography';
import CharacterCount from '@tiptap/extension-character-count';
import Underline from '@tiptap/extension-underline';
import { SlashCommand, slashSuggestion } from './SlashCommands';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Link, Quote, Palette, MoreHorizontal } from 'lucide-react';
import { Logger } from '../../../../shared/logger';
import { handleEditorKeyDown, bindShortcutsToEditor, ALL_SHORTCUTS } from './EditorShortcuts';
import { TaskList, TaskItem, Callout, Toggle, Highlight } from './AdvancedNotionFeatures';
import './MarkdownEditor.css';

// 🔥 작가 친화적 TipTap 에디터 스타일
const EDITOR_STYLES = {
  container: 'w-full h-full flex flex-col',
  editor: 'flex-1 p-6 prose prose-slate max-w-none focus:outline-none',
  focused: 'prose-lg', // 포커스 모드에서 더 큰 글자
  placeholder: 'text-slate-400 pointer-events-none',
  bubble: 'flex flex-nowrap gap-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 overflow-visible whitespace-nowrap',
  bubbleButton: 'px-2 py-1 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded transition-colors flex items-center justify-center min-w-[30px]'
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
          if (node.type.name === 'callout') {
            return '콜아웃 내용을 입력하세요...';
          }
          if (node.type.name === 'toggle') {
            return '토글 내용을 입력하세요...';
          }
          return '/ 를 입력하여 명령어를 사용하거나 이야기를 시작해보세요...';
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
      
      // 🔥 노션 스타일 확장들
      TaskList,
      TaskItem,
      Callout,
      Toggle,
      Highlight,
      
      // 🔥 슬래시 명령어 확장
      SlashCommand.configure({
        suggestion: slashSuggestion,
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
      
      // 🔥 TipTap 공식 마크다운 처리 방식 (완전히 동기적 실행)
      handleKeyDown: (view, event) => {
        if (event.key === ' ') {
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;
          const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);
          
          // TipTap의 에디터 인스턴스에 직접 접근
          const editorInstance = (view as any).editor;
          if (!editorInstance) return false;
          
          // # 처리 (제목 1)
          if (textBefore === '#') {
            event.preventDefault();
            event.stopPropagation();
            
            // 텍스트 삭제 후 헤딩 적용을 체인으로 연결
            editorInstance
              .chain()
              .focus()
              .deleteRange({ from: $from.pos - 1, to: $from.pos })
              .setHeading({ level: 1 })
              .run();
              
            Logger.debug('TIPTAP_EDITOR', '✅ Markdown: H1 applied');
            return true;
          }
          
          // ## 처리 (제목 2)
          if (textBefore === '##') {
            event.preventDefault();
            event.stopPropagation();
            
            editorInstance
              .chain()
              .focus()
              .deleteRange({ from: $from.pos - 2, to: $from.pos })
              .setHeading({ level: 2 })
              .run();
              
            Logger.debug('TIPTAP_EDITOR', '✅ Markdown: H2 applied');
            return true;
          }
          
          // ### 처리 (제목 3)
          if (textBefore === '###') {
            event.preventDefault();
            event.stopPropagation();
            
            editorInstance
              .chain()
              .focus()
              .deleteRange({ from: $from.pos - 3, to: $from.pos })
              .setHeading({ level: 3 })
              .run();
              
            Logger.debug('TIPTAP_EDITOR', '✅ Markdown: H3 applied');
            return true;
          }
          
          // - 처리 (불릿 리스트)
          if (textBefore === '-') {
            event.preventDefault();
            event.stopPropagation();
            
            editorInstance
              .chain()
              .focus()
              .deleteRange({ from: $from.pos - 1, to: $from.pos })
              .toggleBulletList()
              .run();
              
            Logger.debug('TIPTAP_EDITOR', '✅ Markdown: Bullet list applied');
            return true;
          }
          
          // 1. 처리 (번호 리스트)
          if (/^\d+\.$/.test(textBefore)) {
            event.preventDefault();
            event.stopPropagation();
            
            editorInstance
              .chain()
              .focus()
              .deleteRange({ from: $from.pos - textBefore.length, to: $from.pos })
              .toggleOrderedList()
              .run();
              
            Logger.debug('TIPTAP_EDITOR', '✅ Markdown: Ordered list applied');
            return true;
          }
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

  // 🔥 ESC 키 핸들러 (집중모드 해제) 및 복사 이벤트 리스너
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isFocusMode) {
        // 집중모드 해제 이벤트 발생
        const exitFocusEvent = new CustomEvent('editor:exitFocus');
        window.dispatchEvent(exitFocusEvent);
        Logger.info('TIPTAP_EDITOR', 'ESC pressed - exiting focus mode');
      }
    };

    // 🔥 QA 가이드: 에디터 내용 복사 이벤트 리스너
    const handleCopyContent = (event: CustomEvent): void => {
      if (editor && event.detail && event.detail.callback) {
        const textContent = editor.getText();
        event.detail.callback(textContent);
        Logger.info('TIPTAP_EDITOR', 'Content copied via header button', { 
          length: textContent.length 
        });
      }
    };

    window.addEventListener('keydown', handleEscKey);
    window.addEventListener('project:copyContent', handleCopyContent as EventListener);
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
      window.removeEventListener('project:copyContent', handleCopyContent as EventListener);
    };
  }, [isFocusMode, editor]);

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
      {/* 🔥 Enhanced Bubble Menu (선택 시 나타나는 고급 툴바) */}
      {editor && (
        <BubbleMenu 
          editor={editor} 
          className={EDITOR_STYLES.bubble}
          shouldShow={({ editor, view, state, oldState, from, to }) => {
            // 텍스트가 선택되었을 때만 표시
            return from !== to;
          }}
        >
          {/* 기본 포맷팅 버튼들 */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${EDITOR_STYLES.bubbleButton} ${
              editor.isActive('bold') ? 'bg-blue-200 dark:bg-blue-800' : ''
            }`}
            title="볼드 (Ctrl+B)"
          >
            <Bold size={14} />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${EDITOR_STYLES.bubbleButton} ${
              editor.isActive('italic') ? 'bg-blue-200 dark:bg-blue-800' : ''
            }`}
            title="이탤릭 (Ctrl+I)"
          >
            <Italic size={14} />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`${EDITOR_STYLES.bubbleButton} ${
              editor.isActive('underline') ? 'bg-blue-200 dark:bg-blue-800' : ''
            }`}
            title="언더라인 (Ctrl+U)"
          >
            <UnderlineIcon size={14} />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`${EDITOR_STYLES.bubbleButton} ${
              editor.isActive('strike') ? 'bg-blue-200 dark:bg-blue-800' : ''
            }`}
            title="취소선 (Ctrl+Shift+S)"
          >
            <Strikethrough size={14} />
          </button>
          
          {/* 구분선 */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          
          {/* 고급 포맷팅 */}
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`${EDITOR_STYLES.bubbleButton} ${
              editor.isActive('code') ? 'bg-blue-200 dark:bg-blue-800' : ''
            }`}
            title="인라인 코드 (Ctrl+`)"
          >
            <Code size={14} />
          </button>
          
          {/* 구분선 */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          
          {/* 링크 버튼 */}
          <button
            onClick={() => {
              const url = window.prompt('링크 URL을 입력하세요:');
              if (url) {
                // 기본 링크 처리 (확장 없이)
                const selection = editor.view.state.selection;
                const { from, to } = selection;
                editor.chain().focus().insertContent(`<a href="${url}" target="_blank">${editor.view.state.doc.textBetween(from, to) || url}</a>`).run();
              }
            }}
            className={`${EDITOR_STYLES.bubbleButton} ${
              editor.isActive('link') ? 'bg-blue-200 dark:bg-blue-800' : ''
            }`}
            title="링크 추가"
          >
            <Link size={14} />
          </button>
          
          {/* 인용구 버튼 */}
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`${EDITOR_STYLES.bubbleButton} ${
              editor.isActive('blockquote') ? 'bg-blue-200 dark:bg-blue-800' : ''
            }`}
            title="인용구"
          >
            <Quote size={14} />
          </button>
          
          {/* 구분선 */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          
          {/* 추가 옵션 */}
          <button
            onClick={() => {
              // 헤딩 레벨 변경
              const level = window.prompt('헤딩 레벨 (1-3):');
              if (level && ['1', '2', '3'].includes(level)) {
                editor.chain().focus().setHeading({ level: parseInt(level) as 1 | 2 | 3 }).run();
              }
            }}
            className={EDITOR_STYLES.bubbleButton}
            title="헤딩 설정"
          >
            <MoreHorizontal size={14} />
          </button>
        </BubbleMenu>
      )}
      
      {/* 🔥 메인 에디터 */}
      <EditorContent editor={editor} />
    </div>
  );
}
