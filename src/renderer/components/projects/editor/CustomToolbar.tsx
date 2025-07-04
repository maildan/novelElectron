'use client';

import React from 'react';
import { 
  Bold, 
  Italic, 
  Link, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  ImageIcon,
  Eye,
  Undo,
  Redo
} from 'lucide-react';
import { Logger } from '../../../../shared/logger';

// 🔥 프리컴파일된 스타일
const TOOLBAR_STYLES = {
  container: 'flex flex-wrap items-center gap-1 p-2 bg-white border-b border-gray-200',
  buttonGroup: 'flex items-center gap-0.5 px-1',
  separator: 'w-px h-6 bg-gray-300 mx-2',
  button: 'flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors duration-200 text-gray-700 hover:text-gray-900',
  buttonActive: 'flex items-center justify-center w-8 h-8 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200',
} as const;

interface CustomToolbarProps {
  editor?: any; // EasyMDE instance
  onAction?: (action: string) => void;
}

interface ToolbarButton {
  icon: React.ReactNode;
  action: string;
  title: string;
  shortcut?: string;
}

export function CustomToolbar({ editor, onAction }: CustomToolbarProps): React.JSX.Element {
  // 🔥 툴바 버튼 정의 (노션 스타일 순서)
  const toolbarButtons: ToolbarButton[] = [
    // 텍스트 포매팅
    { icon: <Bold size={16} />, action: 'bold', title: '굵게', shortcut: 'Cmd+B' },
    { icon: <Italic size={16} />, action: 'italic', title: '기울임', shortcut: 'Cmd+I' },
    { icon: <Link size={16} />, action: 'link', title: '링크', shortcut: 'Cmd+K' },
    
    // 헤딩
    { icon: <Heading1 size={16} />, action: 'heading-1', title: '제목 1', shortcut: 'Cmd+1' },
    { icon: <Heading2 size={16} />, action: 'heading-2', title: '제목 2', shortcut: 'Cmd+2' },
    { icon: <Heading3 size={16} />, action: 'heading-3', title: '제목 3', shortcut: 'Cmd+3' },
    
    // 리스트
    { icon: <List size={16} />, action: 'unordered-list', title: '글머리 기호', shortcut: 'Cmd+L' },
    { icon: <ListOrdered size={16} />, action: 'ordered-list', title: '번호 매기기', shortcut: 'Shift+Cmd+L' },
    
    // 기타
    { icon: <Quote size={16} />, action: 'quote', title: '인용', shortcut: "Cmd+'" },
    { icon: <Code size={16} />, action: 'code', title: '코드 블록', shortcut: 'Cmd+Alt+C' },
    { icon: <ImageIcon size={16} />, action: 'image', title: '이미지', shortcut: 'Cmd+Alt+I' },
    
    // 미리보기 & 실행취소
    { icon: <Eye size={16} />, action: 'preview', title: '미리보기', shortcut: 'Cmd+P' },
    { icon: <Undo size={16} />, action: 'undo', title: '실행취소', shortcut: 'Cmd+Z' },
    { icon: <Redo size={16} />, action: 'redo', title: '다시실행', shortcut: 'Cmd+Shift+Z' },
  ];

  // 🔥 버튼 클릭 핸들러
  const handleButtonClick = (action: string): void => {
    try {
      Logger.debug('CUSTOM_TOOLBAR', `Button clicked: ${action}`);
      
      if (!editor) {
        Logger.warn('CUSTOM_TOOLBAR', 'Editor instance not available');
        return;
      }

      // EasyMDE 액션 실행
      switch (action) {
        case 'bold':
          editor.toggleBold();
          break;
        case 'italic':
          editor.toggleItalic();
          break;
        case 'link':
          editor.drawLink();
          break;
        case 'heading-1':
          editor.toggleHeading1();
          break;
        case 'heading-2':
          editor.toggleHeading2();
          break;
        case 'heading-3':
          editor.toggleHeading3();
          break;
        case 'unordered-list':
          editor.toggleUnorderedList();
          break;
        case 'ordered-list':
          editor.toggleOrderedList();
          break;
        case 'quote':
          editor.toggleBlockquote();
          break;
        case 'code':
          editor.toggleCodeBlock();
          break;
        case 'image':
          editor.drawImage();
          break;
        case 'preview':
          editor.togglePreview();
          break;
        case 'undo':
          editor.undo();
          break;
        case 'redo':
          editor.redo();
          break;
        default:
          Logger.warn('CUSTOM_TOOLBAR', `Unknown action: ${action}`);
      }
      
      // 콜백 실행
      onAction?.(action);
      
      // 에디터 포커스 유지
      editor.codemirror?.focus();
      
    } catch (error) {
      Logger.error('CUSTOM_TOOLBAR', `Failed to execute action: ${action}`, error);
    }
  };

  // 🔥 구분선 위치 계산
  const shouldShowSeparator = (index: number): boolean => {
    return index === 2 || index === 5 || index === 7 || index === 10; // 그룹별 구분
  };

  return (
    <div className={TOOLBAR_STYLES.container}>
      {toolbarButtons.map((button, index) => (
        <React.Fragment key={`${button.action}-${index}`}>
          <button
            className={TOOLBAR_STYLES.button}
            onClick={() => handleButtonClick(button.action)}
            title={`${button.title}${button.shortcut ? ` (${button.shortcut})` : ''}`}
            type="button"
            aria-label={button.title}
          >
            {button.icon}
          </button>
          
          {shouldShowSeparator(index) && (
            <div className={TOOLBAR_STYLES.separator} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
