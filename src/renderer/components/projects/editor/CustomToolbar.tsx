'use client';

import React, { useMemo, useState } from 'react';
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
  Redo,
  Palette, // 🔥 색상 기능 추가
  Upload,   // 🔥 업로드 기능 추가
  Moon,     // 🔥 다크모드 아이콘
  Sun       // 🔥 라이트모드 아이콘
} from 'lucide-react';
import { Logger } from '../../../../shared/logger';

// 🔥 OS 감지 함수
const getOS = (): 'mac' | 'windows' | 'linux' => {
  if (typeof window === 'undefined') return 'mac';
  const platform = window.navigator.platform.toLowerCase();
  if (platform.includes('mac')) return 'mac';
  if (platform.includes('win')) return 'windows';
  return 'linux';
};

// 🔥 OS별 단축키 표시
const getShortcutText = (macShortcut: string): string => {
  const os = getOS();
  const cmdKey = os === 'mac' ? '⌘' : 'Ctrl';
  const shiftKey = os === 'mac' ? '⇧' : 'Shift';
  const altKey = os === 'mac' ? '⌥' : 'Alt';
  
  return macShortcut
    .replace(/Cmd/g, cmdKey)
    .replace(/Shift/g, shiftKey)
    .replace(/Alt/g, altKey);
};

// 🔥 프리컴파일된 스타일
const TOOLBAR_STYLES = {
  container: 'flex flex-wrap items-center gap-1 p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200',
  buttonGroup: 'flex items-center gap-0.5 px-1',
  separator: 'w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2',
  button: 'flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100',
  buttonActive: 'flex items-center justify-center w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800',
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
  // 🔥 다크모드 상태 관리
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // 🔥 다크모드 토글 핸들러
  const toggleDarkMode = (): void => {
    setIsDarkMode(!isDarkMode);
    
    // DOM에 다크모드 클래스 토글
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', !isDarkMode);
      
      // 에디터 테마도 변경
      if (editor?.codemirror) {
        const theme = !isDarkMode ? 'dark' : 'default';
        editor.codemirror.setOption('theme', theme);
      }
    }
    
    Logger.info('CUSTOM_TOOLBAR', `Dark mode ${!isDarkMode ? 'enabled' : 'disabled'}`);
  };
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
    
    // 🔥 새로운 기능들
    { icon: <Palette size={16} />, action: 'color', title: '텍스트 색상', shortcut: 'Cmd+Shift+C' },
    { icon: <ImageIcon size={16} />, action: 'image', title: '이미지', shortcut: 'Cmd+Alt+I' },
    { icon: <Upload size={16} />, action: 'upload', title: '파일 업로드', shortcut: 'Cmd+U' },
    
    // 미리보기 & 실행취소
    { icon: <Eye size={16} />, action: 'preview', title: '미리보기', shortcut: 'Cmd+P' },
    { icon: <Undo size={16} />, action: 'undo', title: '실행취소', shortcut: 'Cmd+Z' },
    { icon: <Redo size={16} />, action: 'redo', title: '다시실행', shortcut: 'Cmd+Shift+Z' },
    
    // 🔥 다크모드 토글
    { 
      icon: isDarkMode ? <Sun size={16} /> : <Moon size={16} />, 
      action: 'dark-mode', 
      title: isDarkMode ? '라이트모드' : '다크모드', 
      shortcut: 'Cmd+D' 
    },
  ];

  // 🔥 색상 선택 핸들러
  const handleColorPicker = (): void => {
    try {
      if (!editor) return;
      
      // 기본 색상 팔레트
      const colors = [
        '#000000', '#ff0000', '#00ff00', '#0000ff', 
        '#ffff00', '#ff00ff', '#00ffff', '#ffa500',
        '#800080', '#008000', '#800000', '#008080'
      ];
      
      // 간단한 색상 선택 (실제로는 색상 피커 모달을 구현해야 함)
      const selectedColor = colors[Math.floor(Math.random() * colors.length)];
      const selection = editor.codemirror.getSelection();
      
      if (selection) {
        // 선택된 텍스트를 HTML span으로 감싸기
        editor.codemirror.replaceSelection(`<span style="color: ${selectedColor}">${selection}</span>`);
      } else {
        // 선택된 텍스트가 없으면 색상 태그만 삽입
        editor.codemirror.replaceSelection(`<span style="color: ${selectedColor}">텍스트</span>`);
      }
      
      Logger.info('CUSTOM_TOOLBAR', `Color applied: ${selectedColor}`);
    } catch (error) {
      Logger.error('CUSTOM_TOOLBAR', 'Failed to apply color', error);
    }
  };

  // 🔥 파일 업로드 핸들러
  const handleFileUpload = (): void => {
    try {
      // 파일 선택 input 생성
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,*';
      
      input.onchange = (event: any) => {
        const file = event.target.files?.[0];
        if (file && editor) {
          // 임시로 파일명으로 마크다운 링크 생성
          const fileName = file.name;
          const markdownLink = `![${fileName}](./uploads/${fileName})`;
          editor.codemirror.replaceSelection(markdownLink);
          
          Logger.info('CUSTOM_TOOLBAR', `File uploaded: ${fileName}`);
          // TODO: 실제 파일 업로드 로직 구현 필요
        }
      };
      
      input.click();
    } catch (error) {
      Logger.error('CUSTOM_TOOLBAR', 'Failed to handle file upload', error);
    }
  };
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
        case 'color':
          handleColorPicker();
          break;
        case 'image':
          editor.drawImage();
          break;
        case 'upload':
          handleFileUpload();
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
        case 'dark-mode':
          toggleDarkMode();
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
    return index === 2 || index === 5 || index === 7 || index === 9 || index === 12 || index === 15; // 그룹별 구분 업데이트
  };

  return (
    <div className={TOOLBAR_STYLES.container}>
      {toolbarButtons.map((button, index) => (
        <React.Fragment key={`${button.action}-${index}`}>
          <button
            className={TOOLBAR_STYLES.button}
            onClick={() => handleButtonClick(button.action)}
            title={`${button.title}${button.shortcut ? ` (${getShortcutText(button.shortcut)})` : ''}`}
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
