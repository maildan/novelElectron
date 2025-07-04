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
    /* 🔥 한글 입력 최적화 */
    .EasyMDEContainer .CodeMirror-focused {
      outline: none;
    }
    
    .EasyMDEContainer .CodeMirror-focused .cm-header {
      color: #2563eb;
      font-weight: 600;
    }
    
    /* 🔥 노션 스타일: 마크업 완전 숨기기 (2024-2025 UX 트렌드) */
    .cm-formatting,
    .cm-formatting-header,
    .cm-formatting-list,
    .cm-formatting-strong,
    .cm-formatting-em,
    .cm-formatting-strikethrough,
    .cm-formatting-link,
    .cm-formatting-code,
    .cm-formatting-quote {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
    }
    
    /* 🔥 헤더 스타일 강화 (마크업 없이도 구분 가능) */
    .cm-header-1 { 
      font-size: 2em; 
      font-weight: 700; 
      color: #1f2937;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 0.25em;
      margin: 0.5em 0;
    }
    .cm-header-2 { 
      font-size: 1.5em; 
      font-weight: 600; 
      color: #374151;
      margin: 0.4em 0;
    }
    .cm-header-3 { 
      font-size: 1.25em; 
      font-weight: 600; 
      color: #4b5563;
      margin: 0.3em 0;
    }
    
    /* 🔥 리스트 스타일 개선 */
    .cm-variable-2,
    .cm-variable-3 {
      color: #374151;
      font-weight: normal;
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
