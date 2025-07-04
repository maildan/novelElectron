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

// 🔥 작가 친화적 EasyMDE 설정 (FontAwesome 아이콘 + 한국어 최적화)
export const getEditorOptions = () => ({
  autofocus: true,
  spellChecker: false,
  placeholder: '이야기를 시작해보세요...',
  status: ['lines', 'words', 'cursor'],
  toolbar: false, // 🔥 기본 툴바 숨기기 (커스텀 Lucide 툴바 사용)
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
  // 🔥 한글 입력 최적화 설정 (2024-2025 최신 IME 지원)
  inputStyle: "contenteditable" as const, // 🔥 IME 지원 향상을 위해 contenteditable 사용
  nativeSpellcheck: true, // 🔥 IME와 함께 네이티브 스펠체크 활성화
  previewRender: (plainText: string) => {
    return `<div class="prose dark:prose-invert max-w-none">${plainText}</div>`;
  },
  renderingConfig: {
    singleLineBreaks: false,
    codeSyntaxHighlighting: true,
  },
  autoDownloadFontAwesome: false, // 🔥 FontAwesome 비활성화 (Lucide로 교체 예정)
  tabSize: 2,
  lineWrapping: true,
  styleSelectedText: false, // 🔥 성능 향상을 위해 비활성화
  parsingConfig: {
    allowAtxHeaderWithoutSpace: true,
  },
  lineNumbers: false,
  mode: {
    name: "markdown",
    highlightFormatting: false, // 🔥 노션 스타일을 위해 마크업 숨기기
  },
  // 🔥 한글 입력 최적화 설정 (IME 방해 요소 제거)
  configureMouse: () => ({ addNew: false }),
  indentWithTabs: false,
  smartIndent: false, // 🔥 스마트 인덴트 비활성화 (한글 입력 방해 방지)
  electricChars: false, // 🔥 자동 문자 교정 비활성화 (한글 조합 방해 방지)
  rtlMoveVisually: true,
  // 🔥 자동 마크다운 변환 완전 비활성화
  extraKeys: {
    // 기본 키만 유지, 자동 변환 제거
    "Ctrl-B": function(cm: any) {
      const text = cm.getSelection();
      cm.replaceSelection('**' + text + '**');
    },
    "Ctrl-I": function(cm: any) {
      const text = cm.getSelection();
      cm.replaceSelection('*' + text + '*');
    },
    "Ctrl-K": function(cm: any) {
      const text = cm.getSelection();
      cm.replaceSelection('[' + text + '](https://)');
    }
  }
});

// 🔥 포커스 모드용 설정
export const getFocusModeOptions = () => ({
  ...getEditorOptions(),
  toolbar: false,
  status: false,
});
