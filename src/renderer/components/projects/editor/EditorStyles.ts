// 🔥 작가용 에디터 스타일 정의

export const EDITOR_STYLES = {
  // 마크다운 에디터 커스텀 스타일
  customEditor: `
    .EasyMDEContainer {
      height: 100%;
    }
    .EasyMDEContainer .CodeMirror {
      height: calc(100vh - 200px);
      border: none;
      padding: 2rem 4rem;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 18px;
      line-height: 1.8;
      width: 100%;
      max-width: none;
      margin: 0;
      background: #ffffff;
    }
    .EasyMDEContainer .CodeMirror-focused .cm-header {
      color: #2563eb;
      font-weight: 600;
    }
    
    /* 🔥 노션 스타일 마크업 자동 숨기기 - 활성 라인이 아닐 때 */
    .EasyMDEContainer .CodeMirror-line:not(.CodeMirror-activeline) .cm-formatting-header {
      display: none !important;
    }
    .EasyMDEContainer .CodeMirror-line:not(.CodeMirror-activeline) .cm-formatting-list {
      display: none !important;
    }
    .EasyMDEContainer .CodeMirror-line:not(.CodeMirror-activeline) .cm-formatting-strong {
      display: none !important;
    }
    .EasyMDEContainer .CodeMirror-line:not(.CodeMirror-activeline) .cm-formatting-em {
      display: none !important;
    }
    .EasyMDEContainer .CodeMirror-line:not(.CodeMirror-activeline) .cm-formatting-link {
      display: none !important;
    }
    .EasyMDEContainer .CodeMirror-line:not(.CodeMirror-activeline) .cm-formatting-code {
      display: none !important;
    }
    .EasyMDEContainer .CodeMirror-line:not(.CodeMirror-activeline) .cm-formatting-quote {
      display: none !important;
    }
    
    /* 🔥 더 정확한 선택자 - div 컨테이너 기반 */
    div:not(.CodeMirror-activeline) > .CodeMirror-line span.cm-formatting {
      display: none !important;
    }
    
    /* 🔥 예외: 항상 보이게 할 요소들 */
    span.cm-formatting-task {
      display: inline !important;
    }
    .editor-toolbar {
      opacity: 1 !important;
      position: sticky;
      top: 0;
      z-index: 20;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      padding: 8px 16px;
      margin: 0;
      border-radius: 0;
    }
    .editor-toolbar a {
      color: #374151 !important;
      border: none !important;
      border-radius: 6px !important;
      padding: 8px 10px !important;
      margin: 0 2px !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      transition: all 0.2s ease !important;
      text-decoration: none !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-width: 32px !important;
      height: 32px !important;
    }
    
    /* 🔥 Lucide 아이콘 스타일링 */
    .editor-toolbar a .lucide {
      width: 16px !important;
      height: 16px !important;
      stroke-width: 2 !important;
    }
    
    /* 🔥 FontAwesome 아이콘 숨기기 */
    .editor-toolbar a i[class*="fa-"] {
      display: none !important;
    }
    .editor-toolbar a:hover {
      background: #f3f4f6 !important;
      color: #374151 !important;
    }
    .editor-toolbar a.active {
      background: #3b82f6 !important;
      color: white !important;
    }
    .editor-toolbar i.separator {
      border-left: 1px solid #e5e7eb !important;
      margin: 0 8px !important;
    }
    body.dark .editor-toolbar {
      background: #1f2937;
      border-color: #374151;
    }
    body.dark .editor-toolbar a {
      color: #9ca3af !important;
    }
    body.dark .editor-toolbar a:hover {
      background: #374151 !important;
      color: #f3f4f6 !important;
    }
    body.dark .editor-toolbar a.active {
      background: #3b82f6 !important;
      color: white !important;
    }
    body.dark .EasyMDEContainer .CodeMirror {
      color: #f3f4f6;
      background: #111827;
    }
    
    /* 🔥 다크 모드에서도 마크업 숨기기 */
    body.dark div:not(.CodeMirror-activeline) > .CodeMirror-line span.cm-formatting {
      display: none !important;
    }
    .editor-preview {
      background: white;
      padding: 3rem;
      max-width: 900px;
      margin: 0 auto;
    }
    body.dark .editor-preview {
      background: #111827;
      color: #f3f4f6;
    }
    .CodeMirror-cursor {
      border-left: 2px solid #3b82f6;
    }
    .cm-header-1 { font-size: 2em; font-weight: 700; }
    .cm-header-2 { font-size: 1.5em; font-weight: 600; }
    .cm-header-3 { font-size: 1.25em; font-weight: 600; }
  `,
} as const;
