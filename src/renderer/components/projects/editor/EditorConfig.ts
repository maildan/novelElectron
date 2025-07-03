// 🔥 EasyMDE 에디터 설정 모듈

// EasyMDE 타입 정의
interface EasyMDEEditor {
  codemirror: CodeMirrorEditor;
  value(): string;
  value(val: string): void;
  togglePreview(): void;
  toggleSideBySide(): void;
  toggleFullScreen(): void;
  isPreviewActive(): boolean;
  isSideBySideActive(): boolean;
  isFullscreenActive(): boolean;
}

interface CodeMirrorEditor {
  getCursor(): { line: number; ch: number };
  getLine(line: number): string;
  replaceRange(replacement: string, from: { line: number; ch: number }, to?: { line: number; ch: number }): void;
  setCursor(pos: { line: number; ch: number }): void;
  getSelection(): string;
  replaceSelection(replacement: string): void;
}

export interface EditorToolbarItem {
  name: string;
  action: (editor: EasyMDEEditor) => void;
  className: string;
  title: string;
}

// 🔥 작가 친화적 EasyMDE 설정 (Lucide 아이콘 사용)
export const getEditorOptions = () => ({
  autofocus: true,
  spellChecker: false,
  placeholder: '이야기를 시작해보세요...',
  status: ['lines', 'words', 'cursor'],
  toolbar: [
    {
      name: 'heading-1',
      action: function(editor: any) {
        const cm = editor.codemirror;
        const text = cm.getSelection();
        cm.replaceSelection('# ' + text);
      },
      className: 'lucide lucide-heading-1',
      title: '제목 1 (Ctrl+1)',
    },
    {
      name: 'heading-2', 
      action: function(editor: any) {
        const cm = editor.codemirror;
        const text = cm.getSelection();
        cm.replaceSelection('## ' + text);
      },
      className: 'lucide lucide-heading-2',
      title: '제목 2 (Ctrl+2)',
    },
    {
      name: 'heading-3',
      action: function(editor: any) {
        const cm = editor.codemirror;
        const text = cm.getSelection();
        cm.replaceSelection('### ' + text);
      },
      className: 'lucide lucide-heading-3',
      title: '제목 3 (Ctrl+3)',
    },
    '|',
    {
      name: 'bold',
      action: function(editor: any) {
        const cm = editor.codemirror;
        const text = cm.getSelection();
        cm.replaceSelection('**' + text + '**');
      },
      className: 'lucide lucide-bold',
      title: '굵게 (Ctrl+B)',
    },
    {
      name: 'italic',
      action: function(editor: any) {
        const cm = editor.codemirror;
        const text = cm.getSelection();
        cm.replaceSelection('*' + text + '*');
      },
      className: 'lucide lucide-italic',
      title: '기울임 (Ctrl+I)',
    },
    {
      name: 'strikethrough',
      action: function(editor: any) {
        const cm = editor.codemirror;
        const text = cm.getSelection();
        cm.replaceSelection('~~' + text + '~~');
      },
      className: 'lucide lucide-strikethrough',
      title: '취소선',
    },
    '|',
    {
      name: 'quote',
      action: function(editor: any) {
        const cm = editor.codemirror;
        const text = cm.getSelection();
        cm.replaceSelection('> ' + text);
      },
      className: 'lucide lucide-quote',
      title: '인용',
    },
    {
      name: 'unordered-list',
      action: function(editor: any) {
        const cm = editor.codemirror;
        const text = cm.getSelection();
        cm.replaceSelection('- ' + text);
      },
      className: 'lucide lucide-list',
      title: '목록',
    },
    {
      name: 'ordered-list',
      action: function(editor: any) {
        const cm = editor.codemirror;
        const text = cm.getSelection();
        cm.replaceSelection('1. ' + text);
      },
      className: 'lucide lucide-list-ordered',
      title: '번호 목록',
    },
    '|',
    {
      name: 'link',
      action: function(editor: any) {
        const cm = editor.codemirror;
        const text = cm.getSelection();
        cm.replaceSelection('[' + text + '](https://)');
      },
      className: 'lucide lucide-link',
      title: '링크',
    },
    {
      name: 'image',
      action: function(editor: any) {
        const cm = editor.codemirror;
        const text = cm.getSelection();
        cm.replaceSelection('![' + text + '](https://)');
      },
      className: 'lucide lucide-image',
      title: '이미지',
    },
    '|',
    'preview', 'side-by-side', 'fullscreen'
  ] as any,
  shortcuts: {
    "toggleBold": "Ctrl-B",
    "toggleItalic": "Ctrl-I", 
    "drawLink": "Ctrl-K",
    "toggleHeading1": "Ctrl-1",
    "toggleHeading2": "Ctrl-2",
    "toggleHeading3": "Ctrl-3",
    "cleanBlock": "Ctrl-E",
    "drawImage": "Ctrl-Alt-I",
    "toggleUnorderedList": "Ctrl-L",
    "toggleOrderedList": "Shift-Ctrl-L",
    "toggleBlockquote": "Ctrl-'",
    "toggleCodeBlock": "Ctrl-Alt-C",
    "togglePreview": "Ctrl-P",
    "toggleSideBySide": "F9",
    "toggleFullScreen": "F11"
  },
  previewRender: (plainText: string) => {
    return `<div class="prose dark:prose-invert max-w-none">${plainText}</div>`;
  },
  renderingConfig: {
    singleLineBreaks: false,
    codeSyntaxHighlighting: true,
  },
  autoDownloadFontAwesome: false, // 🔥 FontAwesome 비활성화
  tabSize: 4,
  lineWrapping: true,
  styleSelectedText: true,
  parsingConfig: {
    allowAtxHeaderWithoutSpace: true,
  },
  inputStyle: "textarea" as const,
  lineNumbers: false,
  mode: {
    name: "markdown",
    highlightFormatting: true,
  },
  // 🔥 노션 스타일 마크다운 자동 변환을 위한 키 이벤트 핸들러
  extraKeys: {
    "Enter": function(cm: any) {
      const cursor = cm.getCursor();
      const line = cm.getLine(cursor.line);
      
      // 리스트 아이템에서 Enter 시 다음 리스트 아이템 자동 생성
      if (line.match(/^[-\*\+]\s+/)) {
        const match = line.match(/^([-\*\+]\s+)/);
        if (match && line.trim() === match[1].trim()) {
          // 빈 리스트 아이템인 경우 리스트 종료
          cm.replaceRange("", { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
          cm.execCommand("newlineAndIndent");
        } else {
          // 새로운 리스트 아이템 생성
          cm.execCommand("newlineAndIndent");
          const newCursor = cm.getCursor();
          cm.replaceRange("- ", { line: newCursor.line, ch: 0 });
          cm.setCursor({ line: newCursor.line, ch: 2 });
        }
        return;
      }
      
      // 일반 Enter 동작
      cm.execCommand("newlineAndIndent");
    },
    "Space": function(cm: any) {
      const cursor = cm.getCursor();
      const line = cm.getLine(cursor.line);
      
      // # + 스페이스 → 헤딩 1
      if (line === "#" && cursor.ch === 1) {
        cm.replaceRange("# ", { line: cursor.line, ch: 0 }, { line: cursor.line, ch: 1 });
        cm.setCursor({ line: cursor.line, ch: 2 });
        return;
      }
      
      // ## + 스페이스 → 헤딩 2
      if (line === "##" && cursor.ch === 2) {
        cm.replaceRange("## ", { line: cursor.line, ch: 0 }, { line: cursor.line, ch: 2 });
        cm.setCursor({ line: cursor.line, ch: 3 });
        return;
      }
      
      // ### + 스페이스 → 헤딩 3
      if (line === "###" && cursor.ch === 3) {
        cm.replaceRange("### ", { line: cursor.line, ch: 0 }, { line: cursor.line, ch: 3 });
        cm.setCursor({ line: cursor.line, ch: 4 });
        return;
      }
      
      // - + 스페이스 → 불릿 리스트
      if (line === "-" && cursor.ch === 1) {
        cm.replaceRange("- ", { line: cursor.line, ch: 0 }, { line: cursor.line, ch: 1 });
        cm.setCursor({ line: cursor.line, ch: 2 });
        return;
      }
      
      // * + 스페이스 → 불릿 리스트
      if (line === "*" && cursor.ch === 1) {
        cm.replaceRange("* ", { line: cursor.line, ch: 0 }, { line: cursor.line, ch: 1 });
        cm.setCursor({ line: cursor.line, ch: 2 });
        return;
      }
      
      // 일반 스페이스 입력
      cm.replaceSelection(" ");
    }
  }
});

// 🔥 포커스 모드용 설정
export const getFocusModeOptions = () => ({
  ...getEditorOptions(),
  toolbar: false,
  status: false,
});
