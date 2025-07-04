'use client';

import React from 'react';
import { 
  Bold, 
  Italic, 
  Strikethrough,
  Heading1,
  Heading2, 
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link,
  ImageIcon,
  Eye,
  Columns,
  Maximize,
  Code
} from 'lucide-react';
import { Logger } from '../../../../shared/logger';

// 🔥 EasyMDE 에디터 타입 정의
interface EasyMDEEditor {
  codemirror: any;
  value(): string;
  value(val: string): void;
  togglePreview(): void;
  toggleSideBySide(): void;
  toggleFullScreen(): void;
}

interface EditorToolbarProps {
  editor: EasyMDEEditor | null;
}

// 🔥 프리컴파일된 스타일 (기가차드 원칙)
const TOOLBAR_STYLES = {
  container: 'flex items-center gap-1 p-2 bg-white border-b border-gray-200 sticky top-0 z-20',
  button: 'p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center min-w-[36px] min-h-[36px]',
  buttonActive: 'p-2 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center min-w-[36px] min-h-[36px]',
  separator: 'w-px h-6 bg-gray-300 mx-2',
  darkContainer: 'dark:bg-gray-800 dark:border-gray-700',
  darkButton: 'dark:hover:bg-gray-700 dark:text-gray-300',
  darkButtonActive: 'dark:bg-blue-900 dark:text-blue-400'
} as const;

// 🔥 툴바 액션들 (EasyMDE 호환)
const toolbarActions = {
  bold: (editor: EasyMDEEditor) => {
    const cm = editor.codemirror;
    const text = cm.getSelection();
    cm.replaceSelection(`**${text}**`);
    cm.focus();
  },
  
  italic: (editor: EasyMDEEditor) => {
    const cm = editor.codemirror;
    const text = cm.getSelection();
    cm.replaceSelection(`*${text}*`);
    cm.focus();
  },
  
  strikethrough: (editor: EasyMDEEditor) => {
    const cm = editor.codemirror;
    const text = cm.getSelection();
    cm.replaceSelection(`~~${text}~~`);
    cm.focus();
  },
  
  heading1: (editor: EasyMDEEditor) => {
    const cm = editor.codemirror;
    const cursor = cm.getCursor();
    const line = cm.getLine(cursor.line);
    const newText = line.startsWith('# ') ? line.slice(2) : `# ${line}`;
    cm.replaceRange(newText, { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
    cm.focus();
  },
  
  heading2: (editor: EasyMDEEditor) => {
    const cm = editor.codemirror;
    const cursor = cm.getCursor();
    const line = cm.getLine(cursor.line);
    const newText = line.startsWith('## ') ? line.slice(3) : `## ${line}`;
    cm.replaceRange(newText, { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
    cm.focus();
  },
  
  heading3: (editor: EasyMDEEditor) => {
    const cm = editor.codemirror;
    const cursor = cm.getCursor();
    const line = cm.getLine(cursor.line);
    const newText = line.startsWith('### ') ? line.slice(4) : `### ${line}`;
    cm.replaceRange(newText, { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
    cm.focus();
  },
  
  quote: (editor: EasyMDEEditor) => {
    const cm = editor.codemirror;
    const text = cm.getSelection();
    if (text) {
      cm.replaceSelection(`> ${text}`);
    } else {
      const cursor = cm.getCursor();
      const line = cm.getLine(cursor.line);
      const newText = line.startsWith('> ') ? line.slice(2) : `> ${line}`;
      cm.replaceRange(newText, { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
    }
    cm.focus();
  },
  
  unorderedList: (editor: EasyMDEEditor) => {
    const cm = editor.codemirror;
    const cursor = cm.getCursor();
    const line = cm.getLine(cursor.line);
    const newText = line.startsWith('- ') ? line.slice(2) : `- ${line}`;
    cm.replaceRange(newText, { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
    cm.focus();
  },
  
  orderedList: (editor: EasyMDEEditor) => {
    const cm = editor.codemirror;
    const cursor = cm.getCursor();
    const line = cm.getLine(cursor.line);
    const newText = line.match(/^\d+\. /) ? line.replace(/^\d+\. /, '') : `1. ${line}`;
    cm.replaceRange(newText, { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
    cm.focus();
  },
  
  link: (editor: EasyMDEEditor) => {
    const cm = editor.codemirror;
    const text = cm.getSelection();
    cm.replaceSelection(`[${text || '링크 텍스트'}](https://)`);
    cm.focus();
  },
  
  image: (editor: EasyMDEEditor) => {
    const cm = editor.codemirror;
    const text = cm.getSelection();
    cm.replaceSelection(`![${text || '이미지 설명'}](이미지_URL)`);
    cm.focus();
  },
  
  code: (editor: EasyMDEEditor) => {
    const cm = editor.codemirror;
    const text = cm.getSelection();
    if (text.includes('\n')) {
      cm.replaceSelection(`\`\`\`\n${text}\n\`\`\``);
    } else {
      cm.replaceSelection(`\`${text}\``);
    }
    cm.focus();
  },
  
  preview: (editor: EasyMDEEditor) => {
    editor.togglePreview();
  },
  
  sideBySide: (editor: EasyMDEEditor) => {
    editor.toggleSideBySide();
  },
  
  fullscreen: (editor: EasyMDEEditor) => {
    editor.toggleFullScreen();
  }
};

export function EditorToolbar({ editor }: EditorToolbarProps): React.ReactElement {
  const handleAction = (actionName: string) => {
    if (!editor) return;
    
    try {
      const action = toolbarActions[actionName as keyof typeof toolbarActions];
      if (action) {
        action(editor);
        Logger.debug('EDITOR_TOOLBAR', `Action executed: ${actionName}`);
      }
    } catch (error) {
      Logger.error('EDITOR_TOOLBAR', `Failed to execute action: ${actionName}`, error);
    }
  };

  return (
    <div className={`${TOOLBAR_STYLES.container} ${TOOLBAR_STYLES.darkContainer}`}>
      {/* 텍스트 스타일링 */}
      <button
        onClick={() => handleAction('bold')}
        className={`${TOOLBAR_STYLES.button} ${TOOLBAR_STYLES.darkButton}`}
        title="굵게 (Ctrl+B)"
        aria-label="굵게"
      >
        <Bold size={16} />
      </button>
      
      <button
        onClick={() => handleAction('italic')}
        className={`${TOOLBAR_STYLES.button} ${TOOLBAR_STYLES.darkButton}`}
        title="기울임 (Ctrl+I)"
        aria-label="기울임"
      >
        <Italic size={16} />
      </button>
      
      <button
        onClick={() => handleAction('strikethrough')}
        className={`${TOOLBAR_STYLES.button} ${TOOLBAR_STYLES.darkButton}`}
        title="취소선"
        aria-label="취소선"
      >
        <Strikethrough size={16} />
      </button>
      
      <div className={TOOLBAR_STYLES.separator} />
      
      {/* 제목 */}
      <button
        onClick={() => handleAction('heading1')}
        className={`${TOOLBAR_STYLES.button} ${TOOLBAR_STYLES.darkButton}`}
        title="제목 1"
        aria-label="제목 1"
      >
        <Heading1 size={16} />
      </button>
      
      <button
        onClick={() => handleAction('heading2')}
        className={`${TOOLBAR_STYLES.button} ${TOOLBAR_STYLES.darkButton}`}
        title="제목 2"
        aria-label="제목 2"
      >
        <Heading2 size={16} />
      </button>
      
      <button
        onClick={() => handleAction('heading3')}
        className={`${TOOLBAR_STYLES.button} ${TOOLBAR_STYLES.darkButton}`}
        title="제목 3"
        aria-label="제목 3"
      >
        <Heading3 size={16} />
      </button>
      
      <div className={TOOLBAR_STYLES.separator} />
      
      {/* 블록 요소 */}
      <button
        onClick={() => handleAction('quote')}
        className={`${TOOLBAR_STYLES.button} ${TOOLBAR_STYLES.darkButton}`}
        title="인용"
        aria-label="인용"
      >
        <Quote size={16} />
      </button>
      
      <button
        onClick={() => handleAction('unorderedList')}
        className={`${TOOLBAR_STYLES.button} ${TOOLBAR_STYLES.darkButton}`}
        title="글머리 기호 목록"
        aria-label="글머리 기호 목록"
      >
        <List size={16} />
      </button>
      
      <button
        onClick={() => handleAction('orderedList')}
        className={`${TOOLBAR_STYLES.button} ${TOOLBAR_STYLES.darkButton}`}
        title="번호 목록"
        aria-label="번호 목록"
      >
        <ListOrdered size={16} />
      </button>
      
      <button
        onClick={() => handleAction('code')}
        className={`${TOOLBAR_STYLES.button} ${TOOLBAR_STYLES.darkButton}`}
        title="코드"
        aria-label="코드"
      >
        <Code size={16} />
      </button>
      
      <div className={TOOLBAR_STYLES.separator} />
      
      {/* 미디어 */}
      <button
        onClick={() => handleAction('link')}
        className={`${TOOLBAR_STYLES.button} ${TOOLBAR_STYLES.darkButton}`}
        title="링크 (Ctrl+K)"
        aria-label="링크"
      >
        <Link size={16} />
      </button>
      
      <button
        onClick={() => handleAction('image')}
        className={`${TOOLBAR_STYLES.button} ${TOOLBAR_STYLES.darkButton}`}
        title="이미지"
        aria-label="이미지"
      >
        <ImageIcon size={16} />
      </button>
      
      <div className={TOOLBAR_STYLES.separator} />
      
      {/* 뷰 모드 */}
      <button
        onClick={() => handleAction('preview')}
        className={`${TOOLBAR_STYLES.button} ${TOOLBAR_STYLES.darkButton}`}
        title="미리보기 (Ctrl+P)"
        aria-label="미리보기"
      >
        <Eye size={16} />
      </button>
      
      <button
        onClick={() => handleAction('sideBySide')}
        className={`${TOOLBAR_STYLES.button} ${TOOLBAR_STYLES.darkButton}`}
        title="나란히 보기 (F9)"
        aria-label="나란히 보기"
      >
        <Columns size={16} />
      </button>
      
      <button
        onClick={() => handleAction('fullscreen')}
        className={`${TOOLBAR_STYLES.button} ${TOOLBAR_STYLES.darkButton}`}
        title="전체화면 (F11)"
        aria-label="전체화면"
      >
        <Maximize size={16} />
      </button>
    </div>
  );
}
