(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/renderer/components/projects/editor/MarkdownUtils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 한글 입력 최적화 마크다운 유틸리티
__turbopack_context__.s({
    "analyzeMarkdownText": (()=>analyzeMarkdownText),
    "setupKoreanInputOptimization": (()=>setupKoreanInputOptimization)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
const setupKoreanInputOptimization = (cm)=>{
    if (!cm) return;
    // 🔥 기본 IME 친화적 설정만 (커서 조작 X)
    cm.setOption('inputStyle', 'contenteditable');
    cm.setOption('lineWrapping', true);
    cm.setOption('styleSelectedText', false);
    cm.setOption('electricChars', false);
    cm.setOption('smartIndent', false);
    cm.setOption('autofocus', true);
    // 🔥 성능 최적화만
    cm.setOption('workTime', 200);
    cm.setOption('workDelay', 300);
    cm.setOption('pollInterval', 100);
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('MARKDOWN_UTILS', 'Korean IME optimization applied (cursor-safe version)');
};
const analyzeMarkdownText = (content)=>{
    if (!content) return {
        wordCount: 0,
        charCount: 0,
        paragraphCount: 0,
        headingCount: 0,
        listItemCount: 0
    };
    const lines = content.split('\n');
    return {
        wordCount: content.split(/\s+/).filter((word)=>word.length > 0).length,
        charCount: content.length,
        paragraphCount: content.split(/\n\s*\n/).filter((p)=>p.trim().length > 0).length,
        headingCount: lines.filter((line)=>line.match(/^#{1,6}\s/)).length,
        listItemCount: lines.filter((line)=>line.match(/^[\s]*[-*+]\s/)).length
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/editor/EditorConfig.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 EasyMDE 에디터 설정 모듈
// EasyMDE 타입 정의
__turbopack_context__.s({
    "getEditorOptions": (()=>getEditorOptions),
    "getFocusModeOptions": (()=>getFocusModeOptions)
});
const getEditorOptions = ()=>({
        autofocus: true,
        spellChecker: false,
        placeholder: '이야기를 시작해보세요...',
        status: [
            'lines',
            'words',
            'cursor'
        ],
        toolbar: false,
        shortcuts: {
            "toggleBold": "Cmd-B",
            "toggleItalic": "Cmd-I",
            "drawLink": "Cmd-K",
            "toggleHeading1": "Cmd-Alt-1",
            "toggleHeading2": "Cmd-Alt-2",
            "toggleHeading3": "Cmd-Alt-3",
            "cleanBlock": "Cmd-E",
            "drawImage": "Cmd-Alt-I",
            "toggleUnorderedList": "Cmd-Shift-8",
            "toggleOrderedList": "Cmd-Shift-7",
            "toggleBlockquote": "Cmd-Shift-9",
            "toggleCodeBlock": "Cmd-Alt-C",
            "togglePreview": "Cmd-P",
            "toggleSideBySide": "F9",
            "toggleFullScreen": "F11",
            "toggleDarkMode": "Cmd-D" // 🔥 다크모드 토글 단축키 추가
        },
        // 🔥 한글 입력 최적화 설정 (2024-2025 최신 IME 지원)
        inputStyle: "contenteditable",
        nativeSpellcheck: true,
        previewRender: (plainText)=>{
            return `<div class="prose dark:prose-invert max-w-none">${plainText}</div>`;
        },
        renderingConfig: {
            singleLineBreaks: false,
            codeSyntaxHighlighting: true
        },
        autoDownloadFontAwesome: false,
        tabSize: 2,
        lineWrapping: true,
        styleSelectedText: false,
        parsingConfig: {
            allowAtxHeaderWithoutSpace: true
        },
        lineNumbers: false,
        mode: {
            name: "markdown",
            highlightFormatting: false
        },
        // 🔥 한글 입력 최적화 설정 (IME 방해 요소 제거)
        configureMouse: ()=>({
                addNew: false
            }),
        indentWithTabs: false,
        smartIndent: false,
        electricChars: false,
        rtlMoveVisually: true,
        // 🔥 노션 스타일 커스텀 키 맵핑 (커서 위치 보존 강화)
        extraKeys: {
            // 🔥 노션 스타일 굵게 (Cmd+B) - 기가차드 수정: 포커스 조작 제거
            "Cmd-B": function(cm) {
                const cursor = cm.getCursor();
                const selection = cm.getSelection();
                if (selection) {
                    cm.replaceSelection(`**${selection}**`);
                } else {
                    cm.replaceSelection('****');
                    cm.setCursor({
                        line: cursor.line,
                        ch: cursor.ch + 2
                    });
                }
            },
            // 🔥 노션 스타일 기울임 (Cmd+I) - 기가차드 수정: 포커스 조작 제거
            "Cmd-I": function(cm) {
                const cursor = cm.getCursor();
                const selection = cm.getSelection();
                if (selection) {
                    cm.replaceSelection(`*${selection}*`);
                } else {
                    cm.replaceSelection('**');
                    cm.setCursor({
                        line: cursor.line,
                        ch: cursor.ch + 1
                    });
                }
            },
            // 🔥 노션 스타일 링크 (Cmd+K) - 기가차드 수정: 포커스 조작 제거
            "Cmd-K": function(cm) {
                const cursor = cm.getCursor();
                const selection = cm.getSelection();
                if (selection) {
                    cm.replaceSelection(`[${selection}]()`);
                    const newCursor = cm.getCursor();
                    cm.setCursor({
                        line: newCursor.line,
                        ch: newCursor.ch - 1
                    });
                } else {
                    cm.replaceSelection('[링크 텍스트]()');
                    cm.setSelection({
                        line: cursor.line,
                        ch: cursor.ch + 1
                    }, {
                        line: cursor.line,
                        ch: cursor.ch + 6
                    });
                }
            },
            // 🔥 기가차드 마크다운 변환: Space 키로 마크업 자동 변환
            "Space": function(cm) {
                const cursor = cm.getCursor();
                const line = cm.getLine(cursor.line);
                const lineStart = line.substring(0, cursor.ch);
                // 1. 헤딩 패턴 감지 (# 1-6개) - 정확한 마크다운 변환
                const headingMatch = lineStart.match(/^(#{1,6})$/);
                if (headingMatch) {
                    // 단순히 스페이스만 추가 (### -> ### )
                    cm.replaceSelection(' ');
                    return;
                }
                // 2. 리스트 패턴 감지 (- 또는 *)
                const listMatch = lineStart.match(/^([-*])$/);
                if (listMatch) {
                    cm.replaceSelection(' ');
                    return;
                }
                // 3. 번호 리스트 패턴 감지 (1. 2. 등)
                const numberedListMatch = lineStart.match(/^(\d+\.)$/);
                if (numberedListMatch) {
                    cm.replaceSelection(' ');
                    return;
                }
                // 4. 인용구 패턴 감지 (>)
                const quoteMatch = lineStart.match(/^(>)$/);
                if (quoteMatch) {
                    cm.replaceSelection(' ');
                    return;
                }
                // 기본 스페이스 입력
                cm.replaceSelection(' ');
            }
        }
    });
const getFocusModeOptions = ()=>({
        ...getEditorOptions(),
        toolbar: false,
        status: false
    });
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/editor/EditorProvider.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "EditorProvider": (()=>EditorProvider),
    "useEditor": (()=>useEditor)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$MarkdownUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/MarkdownUtils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/EditorConfig.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const EditorContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function useEditor() {
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within EditorProvider');
    }
    return context;
}
_s(useEditor, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function EditorProvider({ children }) {
    _s1();
    const editorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const initializeEditor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EditorProvider.useCallback[initializeEditor]": (editor)=>{
            if (!editor || !editor.codemirror) return;
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR', 'Initializing editor for Korean input optimization');
                // 🔥 한글 입력 최적화 설정
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$MarkdownUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setupKoreanInputOptimization"])(editor.codemirror);
                // 에디터 참조 저장
                editorRef.current = editor;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('EDITOR', 'Editor initialized with Korean input optimization');
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('EDITOR', 'Failed to initialize editor', error);
            }
        }
    }["EditorProvider.useCallback[initializeEditor]"], []);
    const contextValue = {
        editorRef,
        initializeEditor,
        getEditorOptions: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEditorOptions"],
        getFocusModeOptions: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFocusModeOptions"]
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditorContext.Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/projects/editor/EditorProvider.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s1(EditorProvider, "WinN+JNiYytqtwhurPOBQM5xEvo=");
_c = EditorProvider;
var _c;
__turbopack_context__.k.register(_c, "EditorProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/editor/EditorShortcuts.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 기가차드 노션 스타일 단축키 시스템
__turbopack_context__.s({
    "ALL_SHORTCUTS": (()=>ALL_SHORTCUTS),
    "HEADING_SHORTCUTS": (()=>HEADING_SHORTCUTS),
    "LIST_SHORTCUTS": (()=>LIST_SHORTCUTS),
    "SAVE_SHORTCUTS": (()=>SAVE_SHORTCUTS),
    "TEXT_FORMATTING_SHORTCUTS": (()=>TEXT_FORMATTING_SHORTCUTS),
    "bindShortcutsToEditor": (()=>bindShortcutsToEditor),
    "getShortcutHelp": (()=>getShortcutHelp),
    "handleEditorKeyDown": (()=>handleEditorKeyDown)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
'use client';
;
// 🔥 플랫폼별 modifier 키 감지
const isMac = "object" !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
const modifierKey = isMac ? 'metaKey' : 'ctrlKey';
const TEXT_FORMATTING_SHORTCUTS = [
    {
        key: 'b',
        modifier: true,
        action: (editor)=>{
            editor.chain().focus().toggleBold().run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Bold toggled');
            return true;
        },
        description: '볼드 토글'
    },
    {
        key: 'i',
        modifier: true,
        action: (editor)=>{
            editor.chain().focus().toggleItalic().run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Italic toggled');
            return true;
        },
        description: '이탤릭 토글'
    },
    {
        key: 'u',
        modifier: true,
        action: (editor)=>{
            editor.chain().focus().toggleUnderline().run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Underline toggled');
            return true;
        },
        description: '언더라인 토글'
    },
    {
        key: 's',
        modifier: true,
        shift: true,
        action: (editor)=>{
            editor.chain().focus().toggleStrike().run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Strikethrough toggled');
            return true;
        },
        description: '취소선 토글'
    },
    {
        key: 'k',
        modifier: true,
        action: (editor)=>{
            // 🔥 링크 생성 (추후 구현)
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Link shortcut triggered');
            return true;
        },
        description: '링크 생성'
    }
];
const HEADING_SHORTCUTS = [
    {
        key: '1',
        modifier: true,
        alt: true,
        action: (editor)=>{
            editor.chain().focus().toggleHeading({
                level: 1
            }).run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'H1 toggled');
            return true;
        },
        description: '제목 1'
    },
    {
        key: '2',
        modifier: true,
        alt: true,
        action: (editor)=>{
            editor.chain().focus().toggleHeading({
                level: 2
            }).run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'H2 toggled');
            return true;
        },
        description: '제목 2'
    },
    {
        key: '3',
        modifier: true,
        alt: true,
        action: (editor)=>{
            editor.chain().focus().toggleHeading({
                level: 3
            }).run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'H3 toggled');
            return true;
        },
        description: '제목 3'
    },
    {
        key: '0',
        modifier: true,
        alt: true,
        action: (editor)=>{
            editor.chain().focus().setParagraph().run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Paragraph set');
            return true;
        },
        description: '일반 텍스트'
    }
];
const LIST_SHORTCUTS = [
    {
        key: '8',
        modifier: true,
        shift: true,
        action: (editor)=>{
            editor.chain().focus().toggleBulletList().run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Bullet list toggled');
            return true;
        },
        description: '불릿 리스트'
    },
    {
        key: '7',
        modifier: true,
        shift: true,
        action: (editor)=>{
            editor.chain().focus().toggleOrderedList().run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Ordered list toggled');
            return true;
        },
        description: '번호 리스트'
    }
];
const SAVE_SHORTCUTS = [
    {
        key: 's',
        modifier: true,
        action: (editor)=>{
            // 🔥 저장 이벤트 발생 (커스텀 이벤트)
            const saveEvent = new CustomEvent('editor:save');
            window.dispatchEvent(saveEvent);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('EDITOR_SHORTCUTS', 'Save triggered');
            return true;
        },
        description: '저장'
    }
];
const ALL_SHORTCUTS = [
    ...TEXT_FORMATTING_SHORTCUTS,
    ...HEADING_SHORTCUTS,
    ...LIST_SHORTCUTS,
    ...SAVE_SHORTCUTS
];
function handleEditorKeyDown(editor, event) {
    if (!editor) return false;
    const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
    const isModifier = isMac ? metaKey : ctrlKey;
    // 🔥 Space 키는 마크다운 처리를 위해 완전 제외
    if (key === ' ') {
        return false;
    }
    // 🔥 마크다운 타이핑 방해 방지: modifier 키가 없는 단일 문자는 처리하지 않음
    if (!isModifier && !shiftKey && !altKey && key.length === 1) {
        return false;
    }
    // 🔥 단축키 매칭 및 실행
    for (const shortcut of ALL_SHORTCUTS){
        if (shortcut.key.toLowerCase() === key.toLowerCase() && Boolean(shortcut.modifier) === isModifier && Boolean(shortcut.shift) === shiftKey && Boolean(shortcut.alt) === altKey) {
            event.preventDefault();
            event.stopPropagation();
            try {
                const handled = shortcut.action(editor);
                if (handled) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', `Shortcut executed: ${shortcut.description}`, {
                        key: shortcut.key,
                        modifier: isModifier,
                        shift: shiftKey,
                        alt: altKey
                    });
                    return true;
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('EDITOR_SHORTCUTS', `Shortcut execution failed: ${shortcut.description}`, error);
            }
        }
    }
    return false;
}
function getShortcutHelp() {
    const isMacPlatform = isMac;
    const mod = isMacPlatform ? '⌘' : 'Ctrl';
    const alt = isMacPlatform ? '⌥' : 'Alt';
    return `
📝 **텍스트 포맷팅**
• ${mod}+B: 볼드
• ${mod}+I: 이탤릭  
• ${mod}+U: 언더라인
• ${mod}+Shift+S: 취소선
• ${mod}+K: 링크

📄 **헤딩**
• ${mod}+${alt}+1: 제목 1
• ${mod}+${alt}+2: 제목 2
• ${mod}+${alt}+3: 제목 3
• ${mod}+${alt}+0: 일반 텍스트

📋 **리스트**
• ${mod}+Shift+8: 불릿 리스트
• ${mod}+Shift+7: 번호 리스트

💾 **저장**
• ${mod}+S: 저장
`.trim();
}
function bindShortcutsToEditor(editor) {
    if (!editor) return ()=>{};
    // 🔥 전역 리스너 등록하지 않음 - TipTap 내부 handleKeyDown만 사용
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('EDITOR_SHORTCUTS', 'Shortcuts system initialized', {
        shortcutCount: ALL_SHORTCUTS.length,
        platform: isMac ? 'macOS' : 'Windows/Linux'
    });
    // 🔥 정리 함수 반환 (실제로는 아무것도 안 함)
    return ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Shortcuts system cleaned up');
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ShortcutHelp": (()=>ShortcutHelp)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$help$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/help-circle.mjs [app-client] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorShortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/EditorShortcuts.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// 🔥 단축키 도움말 스타일
const HELP_STYLES = {
    trigger: 'fixed bottom-4 right-4 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer',
    modal: 'fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50',
    panel: 'bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden',
    header: 'flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700',
    title: 'text-xl font-bold text-slate-900 dark:text-slate-100',
    closeButton: 'w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors',
    content: 'p-6 overflow-y-auto',
    helpText: 'prose prose-slate dark:prose-invert max-w-none text-sm'
};
function ShortcutHelp({ className = '' }) {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleToggle = ()=>{
        setIsOpen((prev)=>!prev);
    };
    const handleClose = ()=>{
        setIsOpen(false);
    };
    const handleBackdropClick = (event)=>{
        if (event.target === event.currentTarget) {
            handleClose();
        }
    };
    // 🔥 Escape 키로 닫기 및 F1 키로 열기
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "ShortcutHelp.useEffect": ()=>{
            const handleEscape = {
                "ShortcutHelp.useEffect.handleEscape": (event)=>{
                    if (event.key === 'Escape' && isOpen) {
                        handleClose();
                    }
                }
            }["ShortcutHelp.useEffect.handleEscape"];
            const handleHelpShortcut = {
                "ShortcutHelp.useEffect.handleHelpShortcut": ()=>{
                    setIsOpen({
                        "ShortcutHelp.useEffect.handleHelpShortcut": (prev)=>!prev
                    }["ShortcutHelp.useEffect.handleHelpShortcut"]);
                }
            }["ShortcutHelp.useEffect.handleHelpShortcut"];
            document.addEventListener('keydown', handleEscape);
            window.addEventListener('shortcut:help', handleHelpShortcut);
            return ({
                "ShortcutHelp.useEffect": ()=>{
                    document.removeEventListener('keydown', handleEscape);
                    window.removeEventListener('shortcut:help', handleHelpShortcut);
                }
            })["ShortcutHelp.useEffect"];
        }
    }["ShortcutHelp.useEffect"], [
        isOpen
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: `${HELP_STYLES.trigger} ${className}`,
                onClick: handleToggle,
                title: "단축키 도움말 (F1)",
                "aria-label": "단축키 도움말",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$help$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                    size: 24
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                    lineNumber: 70,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: HELP_STYLES.modal,
                onClick: handleBackdropClick,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: HELP_STYLES.panel,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: HELP_STYLES.header,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: HELP_STYLES.title,
                                    children: "키보드 단축키"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                    lineNumber: 79,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: HELP_STYLES.closeButton,
                                    onClick: handleClose,
                                    "aria-label": "닫기",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                        lineNumber: 85,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                    lineNumber: 80,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                            lineNumber: 78,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: HELP_STYLES.content,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: HELP_STYLES.helpText,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        dangerouslySetInnerHTML: {
                                            __html: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorShortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getShortcutHelp"])().replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                        lineNumber: 92,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-6 pt-4 border-t border-slate-200 dark:border-slate-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-bold text-slate-900 dark:text-slate-100 mb-2",
                                                children: "📖 마크다운 단축키"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                                lineNumber: 97,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                className: "bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded",
                                                                children: "# 스페이스"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                                                lineNumber: 99,
                                                                columnNumber: 26
                                                            }, this),
                                                            " → 제목 1"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                                        lineNumber: 99,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                className: "bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded",
                                                                children: "## 스페이스"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                                                lineNumber: 100,
                                                                columnNumber: 26
                                                            }, this),
                                                            " → 제목 2"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                                        lineNumber: 100,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                className: "bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded",
                                                                children: "### 스페이스"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                                                lineNumber: 101,
                                                                columnNumber: 26
                                                            }, this),
                                                            " → 제목 3"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                                        lineNumber: 101,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                className: "bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded",
                                                                children: "- 스페이스"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                                                lineNumber: 102,
                                                                columnNumber: 26
                                                            }, this),
                                                            " → 불릿 리스트"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                                        lineNumber: 102,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                className: "bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded",
                                                                children: "1. 스페이스"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                                                lineNumber: 103,
                                                                columnNumber: 26
                                                            }, this),
                                                            " → 번호 리스트"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                                        lineNumber: 103,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                                lineNumber: 98,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                        lineNumber: 96,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-blue-800 dark:text-blue-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "💡 팁:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                                    lineNumber: 109,
                                                    columnNumber: 21
                                                }, this),
                                                " 텍스트를 선택하고 단축키를 누르면 선택된 텍스트에 포맷이 적용됩니다."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                            lineNumber: 108,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                        lineNumber: 107,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                lineNumber: 91,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                            lineNumber: 90,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                    lineNumber: 76,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                lineNumber: 75,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(ShortcutHelp, "vl0Rt3/A8evyRPW1OQ1AhRk4UhU=");
_c = ShortcutHelp;
var _c;
__turbopack_context__.k.register(_c, "ShortcutHelp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/components/WriterSidebar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "WriterSidebar": (()=>WriterSidebar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/pen-line.mjs [app-client] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/users.mjs [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/book-open.mjs [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/circle.mjs [app-client] (ecmascript) <export default as Circle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$more$2d$horizontal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/more-horizontal.mjs [app-client] (ecmascript) <export default as MoreHorizontal>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// 🔥 기가차드 간소화된 사이드바 스타일
const SIDEBAR_STYLES = {
    // 기본 컨테이너 (스크롤바 문제 해결)
    container: 'flex flex-col bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 h-full',
    collapsed: 'w-12',
    expanded: 'w-64',
    // 🔥 얇은 스크롤바 적용 영역
    scrollArea: 'flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar',
    // 🔥 메뉴 섹션 간소화
    menuSection: 'p-3 space-y-1',
    menuItem: 'flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer rounded-md',
    menuItemActive: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    menuItemInactive: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
    // 🔥 섹션 헤더 간소화
    sectionHeader: 'text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-3',
    // 🔥 구조 아이템 간소화
    structureList: 'space-y-1 px-3',
    structureItem: 'flex items-center gap-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors',
    // 🔥 통계 영역 간소화
    statsSection: 'p-3 border-t border-gray-200 dark:border-gray-700',
    statItem: 'flex justify-between items-center py-1 text-sm',
    statLabel: 'text-gray-600 dark:text-gray-400',
    statValue: 'font-medium text-gray-900 dark:text-gray-100'
};
// 🔥 메뉴 아이템 정의 (핵심 기능만)
const MENU_ITEMS = [
    {
        id: 'write',
        label: '글쓰기',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"]
    },
    {
        id: 'structure',
        label: '구조',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"]
    },
    {
        id: 'characters',
        label: '인물',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"]
    },
    {
        id: 'notes',
        label: '메모',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"]
    }
];
function WriterSidebar({ currentView, onViewChange, structure, characters, stats, collapsed }) {
    _s();
    const [expandedSections, setExpandedSections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set([
        'structure'
    ]));
    const toggleSection = (sectionId)=>{
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId);
        } else {
            newExpanded.add(sectionId);
        }
        setExpandedSections(newExpanded);
    };
    // 🔥 축소 모드에서는 아이콘만 표시
    if (collapsed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `${SIDEBAR_STYLES.container} ${SIDEBAR_STYLES.collapsed}`,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: SIDEBAR_STYLES.menuSection,
                children: MENU_ITEMS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onViewChange(item.id),
                        className: `w-8 h-8 flex items-center justify-center rounded-md transition-colors ${currentView === item.id ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`,
                        title: item.label,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                            size: 16
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                            lineNumber: 101,
                            columnNumber: 15
                        }, this)
                    }, item.id, false, {
                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                        lineNumber: 91,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                lineNumber: 89,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
            lineNumber: 88,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${SIDEBAR_STYLES.container} ${SIDEBAR_STYLES.expanded}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: SIDEBAR_STYLES.menuSection,
                children: MENU_ITEMS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onViewChange(item.id),
                        className: `${SIDEBAR_STYLES.menuItem} ${currentView === item.id ? SIDEBAR_STYLES.menuItemActive : SIDEBAR_STYLES.menuItemInactive}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                size: 16
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                lineNumber: 121,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                lineNumber: 122,
                                columnNumber: 13
                            }, this)
                        ]
                    }, item.id, true, {
                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: SIDEBAR_STYLES.scrollArea,
                children: [
                    currentView === 'write' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: SIDEBAR_STYLES.sectionHeader,
                                        children: "프로젝트 구조"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                        lineNumber: 134,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: SIDEBAR_STYLES.structureList,
                                        children: structure.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: SIDEBAR_STYLES.structureItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"], {
                                                        size: 12,
                                                        className: "text-blue-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                        lineNumber: 138,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex-1",
                                                        children: `${index + 1}장: ${item.title}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-gray-400",
                                                        children: item.status
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                        lineNumber: 140,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, item.id, true, {
                                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                lineNumber: 137,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                        lineNumber: 135,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                lineNumber: 133,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: SIDEBAR_STYLES.statsSection,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: SIDEBAR_STYLES.sectionHeader,
                                        children: "글쓰기 통계"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                        lineNumber: 148,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: SIDEBAR_STYLES.statItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: SIDEBAR_STYLES.statLabel,
                                                        children: "단어"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                        lineNumber: 151,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: SIDEBAR_STYLES.statValue,
                                                        children: stats.wordCount
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                        lineNumber: 152,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                lineNumber: 150,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: SIDEBAR_STYLES.statItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: SIDEBAR_STYLES.statLabel,
                                                        children: "문자"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                        lineNumber: 155,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: SIDEBAR_STYLES.statValue,
                                                        children: stats.charCount
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                        lineNumber: 156,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                lineNumber: 154,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: SIDEBAR_STYLES.statItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: SIDEBAR_STYLES.statLabel,
                                                        children: "진행률"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                        lineNumber: 159,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: SIDEBAR_STYLES.statValue,
                                                        children: [
                                                            stats.progress,
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                        lineNumber: 160,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                lineNumber: 158,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                        lineNumber: 149,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                lineNumber: 147,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    currentView === 'structure' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: SIDEBAR_STYLES.sectionHeader,
                                        children: "구조 관리"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                        lineNumber: 171,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                            lineNumber: 173,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                        lineNumber: 172,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                lineNumber: 170,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: SIDEBAR_STYLES.structureList,
                                children: [
                                    structure.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `${SIDEBAR_STYLES.structureItem} justify-between`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"], {
                                                            size: 12,
                                                            className: "text-blue-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                            lineNumber: 180,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "flex-1",
                                                            children: `${index + 1}장: ${item.title}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                            lineNumber: 181,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                    lineNumber: 179,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-gray-400",
                                                            children: item.status
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                            lineNumber: 184,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$more$2d$horizontal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                                                size: 12
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                                lineNumber: 186,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                            lineNumber: 185,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                    lineNumber: 183,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, item.id, true, {
                                            fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                            lineNumber: 178,
                                            columnNumber: 17
                                        }, this)),
                                    structure.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center py-8 text-gray-500 dark:text-gray-400",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                size: 32,
                                                className: "mx-auto mb-2 opacity-50"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                lineNumber: 193,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm",
                                                children: "구조를 추가해보세요"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                lineNumber: 194,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                        lineNumber: 192,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                        lineNumber: 169,
                        columnNumber: 11
                    }, this),
                    currentView === 'characters' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: SIDEBAR_STYLES.sectionHeader,
                                        children: "인물 관리"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                        lineNumber: 205,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                            lineNumber: 207,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                        lineNumber: 206,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                lineNumber: 204,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    characters.map((character)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `${SIDEBAR_STYLES.structureItem} justify-between`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-medium",
                                                            children: character.name.charAt(0)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                            lineNumber: 214,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "font-medium text-sm",
                                                                    children: character.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                                    lineNumber: 218,
                                                                    columnNumber: 23
                                                                }, this),
                                                                character.role && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-xs text-gray-500 dark:text-gray-400",
                                                                    children: character.role
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                                    lineNumber: 220,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                            lineNumber: 217,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                    lineNumber: 213,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$more$2d$horizontal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                                        size: 12
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                        lineNumber: 225,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                    lineNumber: 224,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, character.id, true, {
                                            fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                            lineNumber: 212,
                                            columnNumber: 17
                                        }, this)),
                                    characters.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center py-8 text-gray-500 dark:text-gray-400",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                size: 32,
                                                className: "mx-auto mb-2 opacity-50"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                lineNumber: 231,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm",
                                                children: "인물을 추가해보세요"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                                lineNumber: 232,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                        lineNumber: 230,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                lineNumber: 210,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                        lineNumber: 203,
                        columnNumber: 11
                    }, this),
                    currentView === 'notes' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: SIDEBAR_STYLES.sectionHeader,
                                        children: "메모 관리"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                        lineNumber: 243,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                            lineNumber: 245,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                        lineNumber: 244,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                lineNumber: 242,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center py-8 text-gray-500 dark:text-gray-400",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                            size: 32,
                                            className: "mx-auto mb-2 opacity-50"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                            lineNumber: 251,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm",
                                            children: "메모를 추가해보세요"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                            lineNumber: 252,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                    lineNumber: 250,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                                lineNumber: 248,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                        lineNumber: 241,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/components/WriterSidebar.tsx",
        lineNumber: 110,
        columnNumber: 5
    }, this);
}
_s(WriterSidebar, "/MQVn9963j+7RIz4/Iz2my9t73U=");
_c = WriterSidebar;
var _c;
__turbopack_context__.k.register(_c, "WriterSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/components/ProjectHeader.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ProjectHeader": (()=>ProjectHeader)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/chevron-left.mjs [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/save.mjs [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/share-2.mjs [app-client] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/download.mjs [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/trash-2.mjs [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sidebar$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/panel-left.mjs [app-client] (ecmascript) <export default as Sidebar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/eye.mjs [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/eye-off.mjs [app-client] (ecmascript) <export default as EyeOff>");
'use client';
;
;
// 🔥 프리컴파일된 스타일 (기가차드 원칙)
const PROJECT_HEADER_STYLES = {
    header: 'flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200',
    headerLeft: 'flex items-center gap-3',
    headerCenter: 'flex-1 max-w-md mx-auto',
    headerRight: 'flex items-center gap-2',
    backButton: 'flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors',
    titleInput: 'border-none bg-transparent focus:outline-none focus:ring-0 text-lg font-medium w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100',
    iconButton: 'flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400',
    iconButtonActive: 'flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
};
function ProjectHeader({ title, onTitleChange, onBack, sidebarCollapsed, onToggleSidebar, isFocusMode, onToggleFocusMode, onSave, onShare, onDownload, onDelete }) {
    // 🔥 헤더 액션 정의 (모듈화된 방식) - 테마 토글 제거
    const headerActions = [
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"],
            label: '저장',
            onClick: onSave
        },
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"],
            label: '공유',
            onClick: onShare
        },
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"],
            label: '다운로드',
            onClick: onDownload
        },
        {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"],
            label: '삭제',
            onClick: onDelete
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: PROJECT_HEADER_STYLES.header,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: PROJECT_HEADER_STYLES.headerLeft,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: PROJECT_HEADER_STYLES.backButton,
                    onClick: onBack,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                            size: 16
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/components/ProjectHeader.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "프로젝트 목록"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/components/ProjectHeader.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/components/ProjectHeader.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/components/ProjectHeader.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: PROJECT_HEADER_STYLES.headerCenter,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    value: title,
                    onChange: (e)=>onTitleChange(e.target.value),
                    placeholder: "프로젝트 제목을 입력하세요",
                    className: PROJECT_HEADER_STYLES.titleInput
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/components/ProjectHeader.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/components/ProjectHeader.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: PROJECT_HEADER_STYLES.headerRight,
                children: [
                    headerActions.map((action, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: PROJECT_HEADER_STYLES.iconButton,
                            onClick: action.onClick,
                            title: action.label,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(action.icon, {
                                size: 16
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/components/ProjectHeader.tsx",
                                lineNumber: 112,
                                columnNumber: 13
                            }, this)
                        }, `action-${index}`, false, {
                            fileName: "[project]/src/renderer/components/projects/components/ProjectHeader.tsx",
                            lineNumber: 106,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/components/ProjectHeader.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: sidebarCollapsed ? PROJECT_HEADER_STYLES.iconButton : PROJECT_HEADER_STYLES.iconButtonActive,
                        onClick: onToggleSidebar,
                        title: "사이드바 토글",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sidebar$3e$__["Sidebar"], {
                            size: 16
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/components/ProjectHeader.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/components/ProjectHeader.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: isFocusMode ? PROJECT_HEADER_STYLES.iconButtonActive : PROJECT_HEADER_STYLES.iconButton,
                        onClick: onToggleFocusMode,
                        title: isFocusMode ? '포커스 모드 해제' : '포커스 모드',
                        children: isFocusMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                            size: 16
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/components/ProjectHeader.tsx",
                            lineNumber: 133,
                            columnNumber: 26
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                            size: 16
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/components/ProjectHeader.tsx",
                            lineNumber: 133,
                            columnNumber: 49
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/components/ProjectHeader.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/components/ProjectHeader.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/components/ProjectHeader.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_c = ProjectHeader;
var _c;
__turbopack_context__.k.register(_c, "ProjectHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ConfirmDeleteDialog": (()=>ConfirmDeleteDialog)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$triangle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/alert-triangle.mjs [app-client] (ecmascript) <export default as AlertTriangle>");
'use client';
;
;
// 🔥 프리컴파일된 스타일 (11원칙 준수)
const CONFIRM_DIALOG_STYLES = {
    overlay: 'fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50',
    dialog: 'bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden',
    header: 'flex items-center gap-3 p-6 border-b border-slate-200 dark:border-slate-700',
    icon: 'w-8 h-8 text-red-500 flex-shrink-0',
    headerText: 'flex-1',
    title: 'text-lg font-bold text-slate-900 dark:text-slate-100',
    message: 'text-sm text-slate-600 dark:text-slate-400 mt-1',
    closeButton: 'w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors',
    content: 'p-6',
    description: 'text-slate-700 dark:text-slate-300 leading-relaxed mb-4',
    projectName: 'font-semibold text-slate-900 dark:text-slate-100',
    warning: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-800 dark:text-red-200',
    footer: 'flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700',
    cancelButton: 'px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors',
    deleteButton: 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium'
};
function ConfirmDeleteDialog({ isOpen, projectTitle, onConfirm, onCancel }) {
    if (!isOpen) return null;
    const handleOverlayClick = (event)=>{
        if (event.target === event.currentTarget) {
            onCancel();
        }
    };
    const handleEscapeKey = (event)=>{
        if (event.key === 'Escape') {
            onCancel();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: CONFIRM_DIALOG_STYLES.overlay,
        onClick: handleOverlayClick,
        onKeyDown: handleEscapeKey,
        tabIndex: -1,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: CONFIRM_DIALOG_STYLES.dialog,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: CONFIRM_DIALOG_STYLES.header,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$triangle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                            className: CONFIRM_DIALOG_STYLES.icon
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CONFIRM_DIALOG_STYLES.headerText,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: CONFIRM_DIALOG_STYLES.title,
                                    children: "프로젝트 삭제"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: CONFIRM_DIALOG_STYLES.message,
                                    children: "이 작업은 되돌릴 수 없습니다"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx",
                                    lineNumber: 60,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: CONFIRM_DIALOG_STYLES.closeButton,
                            onClick: onCancel,
                            "aria-label": "닫기",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx",
                                lineNumber: 67,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: CONFIRM_DIALOG_STYLES.content,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: CONFIRM_DIALOG_STYLES.description,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: CONFIRM_DIALOG_STYLES.projectName,
                                    children: [
                                        "“",
                                        projectTitle,
                                        "”"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx",
                                    lineNumber: 74,
                                    columnNumber: 13
                                }, this),
                                " 프로젝트를 완전히 삭제하시겠습니까?"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CONFIRM_DIALOG_STYLES.warning,
                            children: [
                                "⚠️ ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "주의:"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx",
                                    lineNumber: 79,
                                    columnNumber: 16
                                }, this),
                                " 삭제된 프로젝트와 모든 데이터(캐릭터, 구조, 메모 등)는 복구할 수 없습니다."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: CONFIRM_DIALOG_STYLES.footer,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: CONFIRM_DIALOG_STYLES.cancelButton,
                            onClick: onCancel,
                            children: "취소"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: CONFIRM_DIALOG_STYLES.deleteButton,
                            onClick: onConfirm,
                            autoFocus: true,
                            children: "삭제하기"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx",
            lineNumber: 54,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_c = ConfirmDeleteDialog;
var _c;
__turbopack_context__.k.register(_c, "ConfirmDeleteDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/components/ShareDialog.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ShareDialog": (()=>ShareDialog)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/share-2.mjs [app-client] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/copy.mjs [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/download.mjs [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/mail.mjs [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// 🔥 프리컴파일된 스타일 (11원칙 준수)
const SHARE_DIALOG_STYLES = {
    overlay: 'fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50',
    dialog: 'bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden',
    header: 'flex items-center gap-3 p-6 border-b border-slate-200 dark:border-slate-700',
    icon: 'w-8 h-8 text-blue-500 flex-shrink-0',
    headerText: 'flex-1',
    title: 'text-lg font-bold text-slate-900 dark:text-slate-100',
    subtitle: 'text-sm text-slate-600 dark:text-slate-400 mt-1',
    closeButton: 'w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors',
    content: 'p-6 space-y-4',
    section: 'space-y-3',
    sectionTitle: 'text-sm font-medium text-slate-900 dark:text-slate-100',
    optionGrid: 'grid grid-cols-2 gap-3',
    option: 'flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer',
    optionIcon: 'w-5 h-5 text-slate-600 dark:text-slate-400',
    optionText: 'text-sm text-slate-700 dark:text-slate-300',
    urlSection: 'space-y-2',
    urlLabel: 'text-sm font-medium text-slate-900 dark:text-slate-100',
    urlContainer: 'flex items-center gap-2',
    urlInput: 'flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 font-mono',
    copyButton: 'px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2',
    copiedButton: 'px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-2',
    footer: 'p-6 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400'
};
function ShareDialog({ isOpen, projectTitle, projectId, onClose }) {
    _s();
    const [copiedUrl, setCopiedUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 🔥 임시 공유 URL (실제로는 서버에서 생성)
    const shareUrl = `https://loop-writer.app/shared/${projectId}`;
    const handleOverlayClick = (event)=>{
        if (event.target === event.currentTarget) {
            onClose();
        }
    };
    const handleEscapeKey = (event)=>{
        if (event.key === 'Escape') {
            onClose();
        }
    };
    const handleCopyUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShareDialog.useCallback[handleCopyUrl]": async ()=>{
            try {
                await navigator.clipboard.writeText(shareUrl);
                setCopiedUrl(true);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('SHARE_DIALOG', 'URL copied to clipboard');
                // 3초 후 상태 리셋
                setTimeout({
                    "ShareDialog.useCallback[handleCopyUrl]": ()=>setCopiedUrl(false)
                }["ShareDialog.useCallback[handleCopyUrl]"], 3000);
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('SHARE_DIALOG', 'Failed to copy URL', error);
            }
        }
    }["ShareDialog.useCallback[handleCopyUrl]"], [
        shareUrl
    ]);
    const handleExportText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShareDialog.useCallback[handleExportText]": ()=>{
            // 🔥 텍스트 파일로 내보내기 (실제 구현 필요)
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('SHARE_DIALOG', 'Export as text requested');
        // TODO: 실제 내보내기 구현
        }
    }["ShareDialog.useCallback[handleExportText]"], []);
    const handleExportPdf = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShareDialog.useCallback[handleExportPdf]": ()=>{
            // 🔥 PDF로 내보내기 (실제 구현 필요)
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('SHARE_DIALOG', 'Export as PDF requested');
        // TODO: 실제 PDF 내보내기 구현
        }
    }["ShareDialog.useCallback[handleExportPdf]"], []);
    const handleSendEmail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShareDialog.useCallback[handleSendEmail]": ()=>{
            // 🔥 이메일로 공유하기
            const subject = encodeURIComponent(`Loop 프로젝트: ${projectTitle}`);
            const body = encodeURIComponent(`안녕하세요,\n\n"${projectTitle}" 프로젝트를 공유합니다.\n\n${shareUrl}\n\nLoop Writer에서 확인해보세요!`);
            const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
            window.open(mailtoUrl, '_blank');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('SHARE_DIALOG', 'Email sharing opened');
        }
    }["ShareDialog.useCallback[handleSendEmail]"], [
        projectTitle,
        shareUrl
    ]);
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: SHARE_DIALOG_STYLES.overlay,
        onClick: handleOverlayClick,
        onKeyDown: handleEscapeKey,
        tabIndex: -1,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: SHARE_DIALOG_STYLES.dialog,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: SHARE_DIALOG_STYLES.header,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                            className: SHARE_DIALOG_STYLES.icon
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                            lineNumber: 105,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: SHARE_DIALOG_STYLES.headerText,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: SHARE_DIALOG_STYLES.title,
                                    children: "프로젝트 공유"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                                    lineNumber: 107,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: SHARE_DIALOG_STYLES.subtitle,
                                    children: [
                                        "“",
                                        projectTitle,
                                        "” 작품 공유하기"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                            lineNumber: 106,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: SHARE_DIALOG_STYLES.closeButton,
                            onClick: onClose,
                            "aria-label": "닫기",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                            lineNumber: 110,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                    lineNumber: 104,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: SHARE_DIALOG_STYLES.content,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: SHARE_DIALOG_STYLES.section,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: SHARE_DIALOG_STYLES.sectionTitle,
                                    children: "링크로 공유"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: SHARE_DIALOG_STYLES.urlContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: shareUrl,
                                            readOnly: true,
                                            className: SHARE_DIALOG_STYLES.urlInput
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                                            lineNumber: 125,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: copiedUrl ? SHARE_DIALOG_STYLES.copiedButton : SHARE_DIALOG_STYLES.copyButton,
                                            onClick: handleCopyUrl,
                                            disabled: copiedUrl,
                                            children: copiedUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                                                        lineNumber: 138,
                                                        columnNumber: 21
                                                    }, this),
                                                    "복사됨"
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                                                        lineNumber: 143,
                                                        columnNumber: 21
                                                    }, this),
                                                    "복사"
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                                            lineNumber: 131,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                                    lineNumber: 124,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                            lineNumber: 122,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: SHARE_DIALOG_STYLES.section,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: SHARE_DIALOG_STYLES.sectionTitle,
                                    children: "공유 방법"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                                    lineNumber: 153,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: SHARE_DIALOG_STYLES.optionGrid,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: SHARE_DIALOG_STYLES.option,
                                            onClick: handleSendEmail,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                    className: SHARE_DIALOG_STYLES.optionIcon
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                                                    lineNumber: 159,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: SHARE_DIALOG_STYLES.optionText,
                                                    children: "이메일"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                                                    lineNumber: 160,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                                            lineNumber: 155,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: SHARE_DIALOG_STYLES.option,
                                            onClick: handleExportText,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                    className: SHARE_DIALOG_STYLES.optionIcon
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: SHARE_DIALOG_STYLES.optionText,
                                                    children: "텍스트 파일"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                                                    lineNumber: 168,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                                            lineNumber: 163,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                    lineNumber: 120,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: SHARE_DIALOG_STYLES.footer,
                    children: "💡 공유된 프로젝트는 읽기 전용으로 제공됩니다. 원본 편집은 작성자만 가능합니다."
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
                    lineNumber: 175,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
            lineNumber: 102,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/projects/components/ShareDialog.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
_s(ShareDialog, "y/v4/stpkJcrO83rgoUekOrUxM4=");
_c = ShareDialog;
var _c;
__turbopack_context__.k.register(_c, "ShareDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "MarkdownEditor": (()=>MarkdownEditor)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$react$40$2$2e$24$2e$0_$40$tiptap$2b$core$40$2$2e$24$2e$0_$40$tiptap$2b$pm$40$2$2e$24$2e$0_$5f40$tiptap$2b$pm$40$2$2e$24$2e$0_react$2d$dom_8148597a37c121d1044607c036d63893$2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tiptap+react@2.24.0_@tiptap+core@2.24.0_@tiptap+pm@2.24.0__@tiptap+pm@2.24.0_react-dom_8148597a37c121d1044607c036d63893/node_modules/@tiptap/react/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$starter$2d$kit$40$2$2e$24$2e$0$2f$node_modules$2f40$tiptap$2f$starter$2d$kit$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tiptap+starter-kit@2.24.0/node_modules/@tiptap/starter-kit/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$extension$2d$placeholder$40$2$2e$24$2e$0_$40$tiptap$2b$core$40$2$2e$24$2e$0_$40$tiptap$2b$pm$40$2$2e$24$2e$0_$5f40$tiptap$2b$pm$40$2$2e$24$2e$0$2f$node_modules$2f40$tiptap$2f$extension$2d$placeholder$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tiptap+extension-placeholder@2.24.0_@tiptap+core@2.24.0_@tiptap+pm@2.24.0__@tiptap+pm@2.24.0/node_modules/@tiptap/extension-placeholder/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$extension$2d$focus$40$2$2e$24$2e$2_$40$tiptap$2b$core$40$2$2e$24$2e$0_$40$tiptap$2b$pm$40$2$2e$24$2e$0_$5f40$tiptap$2b$pm$40$2$2e$24$2e$0$2f$node_modules$2f40$tiptap$2f$extension$2d$focus$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tiptap+extension-focus@2.24.2_@tiptap+core@2.24.0_@tiptap+pm@2.24.0__@tiptap+pm@2.24.0/node_modules/@tiptap/extension-focus/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$extension$2d$typography$40$2$2e$24$2e$0_$40$tiptap$2b$core$40$2$2e$24$2e$0_$40$tiptap$2b$pm$40$2$2e$24$2e$0_$2f$node_modules$2f40$tiptap$2f$extension$2d$typography$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tiptap+extension-typography@2.24.0_@tiptap+core@2.24.0_@tiptap+pm@2.24.0_/node_modules/@tiptap/extension-typography/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$extension$2d$character$2d$count$40$2$2e$24$2e$2_$40$tiptap$2b$core$40$2$2e$24$2e$0_$40$tiptap$2b$pm$40$2$2e$24$2e$0_$5f40$tiptap$2b$pm$40$2$2e$24$2e$0$2f$node_modules$2f40$tiptap$2f$extension$2d$character$2d$count$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tiptap+extension-character-count@2.24.2_@tiptap+core@2.24.0_@tiptap+pm@2.24.0__@tiptap+pm@2.24.0/node_modules/@tiptap/extension-character-count/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$extension$2d$underline$40$2$2e$24$2e$0_$40$tiptap$2b$core$40$2$2e$24$2e$0_$40$tiptap$2b$pm$40$2$2e$24$2e$0_$2f$node_modules$2f40$tiptap$2f$extension$2d$underline$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tiptap+extension-underline@2.24.0_@tiptap+core@2.24.0_@tiptap+pm@2.24.0_/node_modules/@tiptap/extension-underline/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorShortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/EditorShortcuts.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
// 🔥 작가 친화적 TipTap 에디터 스타일
const EDITOR_STYLES = {
    container: 'w-full h-full flex flex-col',
    editor: 'flex-1 p-6 prose prose-slate max-w-none focus:outline-none',
    focused: 'prose-lg',
    placeholder: 'text-slate-400 pointer-events-none',
    bubble: 'flex gap-2 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg',
    bubbleButton: 'px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded transition-colors'
};
function MarkdownEditor({ content, onChange, isFocusMode }) {
    _s();
    const [isReady, setIsReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 🔥 TipTap 에디터 초기화 (Notion 스타일 + 작가 친화적 설정)
    const editor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$react$40$2$2e$24$2e$0_$40$tiptap$2b$core$40$2$2e$24$2e$0_$40$tiptap$2b$pm$40$2$2e$24$2e$0_$5f40$tiptap$2b$pm$40$2$2e$24$2e$0_react$2d$dom_8148597a37c121d1044607c036d63893$2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEditor"])({
        extensions: [
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$starter$2d$kit$40$2$2e$24$2e$0$2f$node_modules$2f40$tiptap$2f$starter$2d$kit$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].configure({
                // 🔥 작가 친화적 설정
                heading: {
                    levels: [
                        1,
                        2,
                        3,
                        4
                    ] // H1~H4만 사용
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$extension$2d$underline$40$2$2e$24$2e$0_$40$tiptap$2b$core$40$2$2e$24$2e$0_$40$tiptap$2b$pm$40$2$2e$24$2e$0_$2f$node_modules$2f40$tiptap$2f$extension$2d$underline$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
            // 🔥 Placeholder 확장 (작가 친화적)
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$extension$2d$placeholder$40$2$2e$24$2e$0_$40$tiptap$2b$core$40$2$2e$24$2e$0_$40$tiptap$2b$pm$40$2$2e$24$2e$0_$5f40$tiptap$2b$pm$40$2$2e$24$2e$0$2f$node_modules$2f40$tiptap$2f$extension$2d$placeholder$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].configure({
                placeholder: {
                    "MarkdownEditor.useEditor[editor]": ({ node })=>{
                        if (node.type.name === 'heading') {
                            const level = node.attrs.level;
                            switch(level){
                                case 1:
                                    return '제목을 입력하세요...';
                                case 2:
                                    return '챕터 제목...';
                                case 3:
                                    return '섹션 제목...';
                                default:
                                    return '소제목...';
                            }
                        }
                        return '이야기를 시작해보세요...';
                    }
                }["MarkdownEditor.useEditor[editor]"],
                showOnlyWhenEditable: true,
                showOnlyCurrent: false
            }),
            // 🔥 Focus 확장 (포커스 모드)
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$extension$2d$focus$40$2$2e$24$2e$2_$40$tiptap$2b$core$40$2$2e$24$2e$0_$40$tiptap$2b$pm$40$2$2e$24$2e$0_$5f40$tiptap$2b$pm$40$2$2e$24$2e$0$2f$node_modules$2f40$tiptap$2f$extension$2d$focus$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].configure({
                className: 'has-focus',
                mode: 'all'
            }),
            // 🔥 Typography 확장 (작가 친화적 타이포그래피)
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$extension$2d$typography$40$2$2e$24$2e$0_$40$tiptap$2b$core$40$2$2e$24$2e$0_$40$tiptap$2b$pm$40$2$2e$24$2e$0_$2f$node_modules$2f40$tiptap$2f$extension$2d$typography$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].configure({
                openDoubleQuote: '"',
                closeDoubleQuote: '"',
                openSingleQuote: "'",
                closeSingleQuote: "'",
                ellipsis: '...',
                emDash: '--'
            }),
            // 🔥 문자 수 카운트
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$extension$2d$character$2d$count$40$2$2e$24$2e$2_$40$tiptap$2b$core$40$2$2e$24$2e$0_$40$tiptap$2b$pm$40$2$2e$24$2e$0_$5f40$tiptap$2b$pm$40$2$2e$24$2e$0$2f$node_modules$2f40$tiptap$2f$extension$2d$character$2d$count$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
        ],
        content,
        // 🔥 에디터 설정
        editorProps: {
            attributes: {
                class: `${EDITOR_STYLES.editor} ${isFocusMode ? EDITOR_STYLES.focused : ''}`,
                'data-placeholder': '이야기를 시작해보세요...'
            },
            // 🔥 강화된 노션 스타일 키보드 핸들러
            handleKeyDown: {
                "MarkdownEditor.useEditor[editor]": (view, event)=>{
                    const { state, dispatch } = view;
                    const { selection } = state;
                    // 🔥 Space 키 마크다운 처리 최우선 (노션 스타일)
                    if (event.key === ' ') {
                        const { $from } = selection;
                        const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);
                        // # 처리 (제목 1)
                        if (textBefore === '#') {
                            event.preventDefault();
                            event.stopPropagation();
                            // heading 노드 타입이 있는지 확인
                            const headingType = state.schema.nodes.heading;
                            if (!headingType) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('TIPTAP_EDITOR', 'Heading node type not found');
                                return false;
                            }
                            const tr = state.tr.setBlockType($from.before(), $from.after(), headingType, {
                                level: 1
                            });
                            tr.delete($from.pos - 1, $from.pos); // # 문자 삭제
                            dispatch(tr);
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', '✅ Markdown: H1 applied');
                            return true;
                        }
                        // ## 처리 (제목 2)
                        if (textBefore === '##') {
                            event.preventDefault();
                            event.stopPropagation();
                            // heading 노드 타입이 있는지 확인
                            const headingType = state.schema.nodes.heading;
                            if (!headingType) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('TIPTAP_EDITOR', 'Heading node type not found');
                                return false;
                            }
                            const tr = state.tr.setBlockType($from.before(), $from.after(), headingType, {
                                level: 2
                            });
                            tr.delete($from.pos - 2, $from.pos); // ## 문자 삭제
                            dispatch(tr);
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', '✅ Markdown: H2 applied');
                            return true;
                        }
                        // ### 처리 (제목 3)
                        if (textBefore === '###') {
                            event.preventDefault();
                            event.stopPropagation();
                            // heading 노드 타입이 있는지 확인
                            const headingType = state.schema.nodes.heading;
                            if (!headingType) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('TIPTAP_EDITOR', 'Heading node type not found');
                                return false;
                            }
                            const tr = state.tr.setBlockType($from.before(), $from.after(), headingType, {
                                level: 3
                            });
                            tr.delete($from.pos - 3, $from.pos); // ### 문자 삭제
                            dispatch(tr);
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', '✅ Markdown: H3 applied');
                            return true;
                        }
                        // - 처리 (불릿 리스트)
                        if (textBefore === '-') {
                            event.preventDefault();
                            event.stopPropagation();
                            // listItem 및 bulletList 노드 타입 확인
                            const listItemType = state.schema.nodes.listItem;
                            const bulletListType = state.schema.nodes.bulletList;
                            if (!listItemType || !bulletListType) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('TIPTAP_EDITOR', 'List node types not found');
                                return false;
                            }
                            const tr = state.tr.setBlockType($from.before(), $from.after(), listItemType);
                            tr.delete($from.pos - 1, $from.pos); // - 문자 삭제
                            const blockRange = $from.blockRange();
                            if (blockRange) {
                                const wrappedTr = tr.wrap(blockRange, [
                                    {
                                        type: bulletListType
                                    }
                                ]);
                                dispatch(wrappedTr || tr);
                            } else {
                                dispatch(tr);
                            }
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', '✅ Markdown: Bullet list applied');
                            return true;
                        }
                        // 1. 처리 (번호 리스트)
                        if (/^\d+\.$/.test(textBefore)) {
                            event.preventDefault();
                            event.stopPropagation();
                            // listItem 및 orderedList 노드 타입 확인
                            const listItemType = state.schema.nodes.listItem;
                            const orderedListType = state.schema.nodes.orderedList;
                            if (!listItemType || !orderedListType) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('TIPTAP_EDITOR', 'List node types not found');
                                return false;
                            }
                            const tr = state.tr.setBlockType($from.before(), $from.after(), listItemType);
                            tr.delete($from.pos - textBefore.length, $from.pos); // 번호 문자 삭제
                            const blockRange = $from.blockRange();
                            if (blockRange) {
                                const wrappedTr = tr.wrap(blockRange, [
                                    {
                                        type: orderedListType
                                    }
                                ]);
                                dispatch(wrappedTr || tr);
                            } else {
                                dispatch(tr);
                            }
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', '✅ Markdown: Ordered list applied');
                            return true;
                        }
                    }
                    // 🔥 Space 외의 키는 단축키 시스템에서 처리
                    // 단, Ctrl/Cmd와 조합된 키만 단축키로 처리
                    const isShortcutKey = event.ctrlKey || event.metaKey || event.altKey || [
                        'F1',
                        'F2',
                        'F3',
                        'F4',
                        'F5',
                        'F6',
                        'F7',
                        'F8',
                        'F9',
                        'F10',
                        'F11',
                        'F12'
                    ].includes(event.key);
                    if (isShortcutKey && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorShortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleEditorKeyDown"])(editor, event)) {
                        return true;
                    }
                    return false;
                }
            }["MarkdownEditor.useEditor[editor]"]
        },
        // 🔥 콘텐츠 변경 핸들러
        onUpdate: {
            "MarkdownEditor.useEditor[editor]": ({ editor })=>{
                const newContent = editor.getHTML();
                onChange(newContent);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', 'Content updated', {
                    wordCount: editor.storage.characterCount?.words() || 0
                });
            }
        }["MarkdownEditor.useEditor[editor]"],
        // 🔥 에디터 준비 완료
        onCreate: {
            "MarkdownEditor.useEditor[editor]": ({ editor })=>{
                setIsReady(true);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'Editor created successfully');
            }
        }["MarkdownEditor.useEditor[editor]"],
        // 🔥 에디터 포커스
        onFocus: {
            "MarkdownEditor.useEditor[editor]": ({ editor })=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', 'Editor focused');
            }
        }["MarkdownEditor.useEditor[editor]"],
        // 🔥 에디터 블러
        onBlur: {
            "MarkdownEditor.useEditor[editor]": ({ editor })=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', 'Editor blurred');
            }
        }["MarkdownEditor.useEditor[editor]"]
    });
    // 🔥 외부 content 변경 시 에디터 업데이트
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MarkdownEditor.useEffect": ()=>{
            if (editor && content !== editor.getHTML()) {
                editor.commands.setContent(content, false);
            }
        }
    }["MarkdownEditor.useEffect"], [
        content,
        editor
    ]);
    // 🔥 포커스 모드 변경 시 클래스 업데이트
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MarkdownEditor.useEffect": ()=>{
            if (editor) {
                const editorElement = editor.view.dom;
                editorElement.className = `${EDITOR_STYLES.editor} ${isFocusMode ? EDITOR_STYLES.focused : ''}`;
            }
        }
    }["MarkdownEditor.useEffect"], [
        isFocusMode,
        editor
    ]);
    // 🔥 단축키 바인딩 및 저장 이벤트 리스너
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MarkdownEditor.useEffect": ()=>{
            if (!editor) return;
            // 🔥 단축키 바인딩
            const unbindShortcuts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorShortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bindShortcutsToEditor"])(editor);
            // 🔥 저장 이벤트 리스너 (Ctrl+S)
            const handleSave = {
                "MarkdownEditor.useEffect.handleSave": ()=>{
                    const saveEvent = new CustomEvent('project:save');
                    window.dispatchEvent(saveEvent);
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'Save event triggered from editor');
                }
            }["MarkdownEditor.useEffect.handleSave"];
            window.addEventListener('editor:save', handleSave);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'Shortcuts and save event bound', {
                shortcutCount: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorShortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ALL_SHORTCUTS"].length
            });
            // 🔥 정리 함수
            return ({
                "MarkdownEditor.useEffect": ()=>{
                    unbindShortcuts();
                    window.removeEventListener('editor:save', handleSave);
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', 'Shortcuts and events unbound');
                }
            })["MarkdownEditor.useEffect"];
        }
    }["MarkdownEditor.useEffect"], [
        editor
    ]);
    // 🔥 컴포넌트 언마운트 시 정리
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MarkdownEditor.useEffect": ()=>{
            return ({
                "MarkdownEditor.useEffect": ()=>{
                    if (editor) {
                        editor.destroy();
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', 'Editor destroyed');
                    }
                }
            })["MarkdownEditor.useEffect"];
        }
    }["MarkdownEditor.useEffect"], [
        editor
    ]);
    // 🔥 로딩 중 표시
    if (!isReady) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: EDITOR_STYLES.container,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center h-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 317,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-slate-500 text-sm",
                            children: "에디터 준비 중..."
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 318,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                    lineNumber: 316,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                lineNumber: 315,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
            lineNumber: 314,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: EDITOR_STYLES.container,
        children: [
            editor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$react$40$2$2e$24$2e$0_$40$tiptap$2b$core$40$2$2e$24$2e$0_$40$tiptap$2b$pm$40$2$2e$24$2e$0_$5f40$tiptap$2b$pm$40$2$2e$24$2e$0_react$2d$dom_8148597a37c121d1044607c036d63893$2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BubbleMenu"], {
                editor: editor,
                className: EDITOR_STYLES.bubble,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>editor.chain().focus().toggleBold().run(),
                        className: `${EDITOR_STYLES.bubbleButton} ${editor.isActive('bold') ? 'bg-blue-200 dark:bg-blue-800' : ''}`,
                        title: "볼드 (Ctrl+B)",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: "B"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 337,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 330,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>editor.chain().focus().toggleItalic().run(),
                        className: `${EDITOR_STYLES.bubbleButton} ${editor.isActive('italic') ? 'bg-blue-200 dark:bg-blue-800' : ''}`,
                        title: "이탤릭 (Ctrl+I)",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                            children: "I"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 346,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 339,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>editor.chain().focus().toggleUnderline().run(),
                        className: `${EDITOR_STYLES.bubbleButton} ${editor.isActive('underline') ? 'bg-blue-200 dark:bg-blue-800' : ''}`,
                        title: "언더라인 (Ctrl+U)",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("u", {
                            children: "U"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 355,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 348,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>editor.chain().focus().toggleStrike().run(),
                        className: `${EDITOR_STYLES.bubbleButton} ${editor.isActive('strike') ? 'bg-blue-200 dark:bg-blue-800' : ''}`,
                        title: "취소선 (Ctrl+Shift+S)",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("s", {
                            children: "S"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 364,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 357,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>editor.chain().focus().toggleCode().run(),
                        className: `${EDITOR_STYLES.bubbleButton} ${editor.isActive('code') ? 'bg-blue-200 dark:bg-blue-800' : ''}`,
                        title: "코드",
                        children: "Code"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 366,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                lineNumber: 329,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$react$40$2$2e$24$2e$0_$40$tiptap$2b$core$40$2$2e$24$2e$0_$40$tiptap$2b$pm$40$2$2e$24$2e$0_$5f40$tiptap$2b$pm$40$2$2e$24$2e$0_react$2d$dom_8148597a37c121d1044607c036d63893$2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["EditorContent"], {
                editor: editor
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                lineNumber: 379,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
        lineNumber: 326,
        columnNumber: 5
    }, this);
}
_s(MarkdownEditor, "UykglLooqlM7MJZ308Srynh9q3U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tiptap$2b$react$40$2$2e$24$2e$0_$40$tiptap$2b$core$40$2$2e$24$2e$0_$40$tiptap$2b$pm$40$2$2e$24$2e$0_$5f40$tiptap$2b$pm$40$2$2e$24$2e$0_react$2d$dom_8148597a37c121d1044607c036d63893$2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEditor"]
    ];
});
_c = MarkdownEditor;
var _c;
__turbopack_context__.k.register(_c, "MarkdownEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/views/WriteView.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "WriteView": (()=>WriteView)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$MarkdownEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx [app-client] (ecmascript)");
'use client';
;
;
// 🔥 프리컴파일된 스타일 (11원칙 준수)
const WRITE_STYLES = {
    container: 'flex-1 flex flex-col h-full bg-white dark:bg-gray-900',
    editorWrapper: 'flex-1 min-h-0 overflow-hidden'
};
function WriteView({ content, onChange, isFocusMode }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: WRITE_STYLES.container,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: WRITE_STYLES.editorWrapper,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$MarkdownEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarkdownEditor"], {
                content: content,
                onChange: onChange,
                isFocusMode: isFocusMode
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/WriteView.tsx",
                lineNumber: 22,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/projects/views/WriteView.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/projects/views/WriteView.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c = WriteView;
var _c;
__turbopack_context__.k.register(_c, "WriteView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/views/StructureView.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "StructureView": (()=>StructureView)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/hash.mjs [app-client] (ecmascript) <export default as Hash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/bookmark.mjs [app-client] (ecmascript) <export default as Bookmark>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
'use client';
;
;
// 🔥 차분하고 전문적인 구조 스타일 (11원칙 준수)
const STRUCTURE_STYLES = {
    container: 'flex-1 overflow-hidden bg-white dark:bg-gray-900',
    header: 'p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
    title: 'text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2',
    subtitle: 'text-gray-600 dark:text-gray-400',
    content: 'flex-1 overflow-y-auto p-6',
    // 구조 아이템
    structureList: 'space-y-2',
    structureItem: 'flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer',
    itemIcon: 'w-5 h-5 text-blue-600 dark:text-blue-400',
    itemContent: 'flex-1',
    itemTitle: 'font-medium text-gray-900 dark:text-gray-100',
    itemType: 'text-xs text-gray-500 dark:text-gray-400',
    // 추가 버튼
    addButton: 'flex items-center gap-2 w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors'
};
// 타입별 아이콘 매핑
const TYPE_ICONS = {
    chapter: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__["Hash"],
    scene: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
    note: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__["Bookmark"]
};
function StructureView({ structure, onStructureChange }) {
    const handleAddItem = ()=>{
        const newItem = {
            id: Date.now().toString(),
            projectId: structure[0]?.projectId || '',
            type: 'scene',
            title: '새 장면',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        onStructureChange([
            ...structure,
            newItem
        ]);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: STRUCTURE_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: STRUCTURE_STYLES.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: STRUCTURE_STYLES.title,
                        children: "스토리 구조"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: STRUCTURE_STYLES.subtitle,
                        children: "장, 장면, 메모를 관리하여 이야기의 흐름을 구성하세요"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: STRUCTURE_STYLES.content,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: STRUCTURE_STYLES.structureList,
                    children: [
                        structure.map((item)=>{
                            const IconComponent = TYPE_ICONS[item.type] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"];
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: STRUCTURE_STYLES.structureItem,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                                        className: STRUCTURE_STYLES.itemIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                        lineNumber: 73,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: STRUCTURE_STYLES.itemContent,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: STRUCTURE_STYLES.itemTitle,
                                                children: item.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                lineNumber: 75,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: STRUCTURE_STYLES.itemType,
                                                children: item.type === 'chapter' ? '장' : item.type === 'scene' ? '장면' : '메모'
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                lineNumber: 76,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                        lineNumber: 74,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, item.id, true, {
                                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                lineNumber: 72,
                                columnNumber: 15
                            }, this);
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleAddItem,
                            className: STRUCTURE_STYLES.addButton,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                    lineNumber: 90,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "새 항목 추가"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                    lineNumber: 91,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_c = StructureView;
var _c;
__turbopack_context__.k.register(_c, "StructureView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/views/CharactersView.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "CharactersView": (()=>CharactersView)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/pen-line.mjs [app-client] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/save.mjs [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// 🔥 차분하고 전문적인 작가 도구 스타일 (11원칙 준수)
const CHARACTERS_STYLES = {
    container: 'flex-1 overflow-hidden bg-white dark:bg-gray-900',
    // 🔥 깔끔한 헤더
    header: 'p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
    title: 'text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2',
    subtitle: 'text-gray-600 dark:text-gray-400',
    // 🔥 컨텐츠 영역
    content: 'flex-1 overflow-y-auto p-6',
    // 🔥 간단한 카드 그리드
    characterGrid: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4',
    // 🔥 미니멀 카드
    characterCard: 'group p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200',
    // 🔥 카드 내부 요소들
    characterHeader: 'flex items-start justify-between mb-3',
    characterInfo: 'flex-1',
    characterName: 'text-lg font-medium text-gray-900 dark:text-gray-100 mb-1',
    // 🔥 간단한 역할 배지
    characterRole: 'inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded',
    characterNotes: 'text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-3',
    // 🔥 간단한 추가 버튼
    addButton: 'group flex flex-col items-center justify-center gap-2 p-6 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer',
    addButtonIcon: 'w-5 h-5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors',
    addButtonText: 'text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors',
    // 🔥 편집 버튼
    editButton: 'p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors',
    saveButton: 'p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors',
    cancelButton: 'p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors',
    // 🔥 편집 인풋
    editInput: 'w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500',
    editTextarea: 'w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none'
};
function CharactersView({ projectId, characters, onCharactersChange }) {
    _s();
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editForm, setEditForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const handleAddCharacter = async ()=>{
        try {
            const newCharacter = {
                id: Date.now().toString(),
                projectId: characters[0]?.projectId || projectId,
                name: '새 인물',
                role: '역할 미정',
                notes: '인물에 대한 설명을 추가하세요.',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            // 🔥 실제 DB에 저장
            const result = await window.electronAPI.projects.upsertCharacter(newCharacter);
            if (result.success && result.data) {
                // 🔥 로컬 상태 업데이트
                onCharactersChange([
                    ...characters,
                    result.data
                ]);
                setEditingId(result.data.id);
                setEditForm(result.data);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('CHARACTERS_VIEW', 'New character saved to DB', {
                    id: result.data.id
                });
            } else {
                throw new Error(result.error || 'Failed to create character');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('CHARACTERS_VIEW', 'Failed to create character', error);
            alert('캐릭터 생성에 실패했습니다.');
        }
    };
    const handleEditStart = (character)=>{
        setEditingId(character.id);
        setEditForm(character);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('CHARACTERS_VIEW', 'Edit started', {
            id: character.id
        });
    };
    const handleEditSave = async ()=>{
        if (!editingId || !editForm) return;
        try {
            // 🔥 실제 DB에 저장
            const characterToSave = {
                ...editForm,
                id: editingId,
                updatedAt: new Date()
            };
            const result = await window.electronAPI.projects.upsertCharacter(characterToSave);
            if (result.success && result.data) {
                // 🔥 로컬 상태 업데이트
                const updatedCharacters = characters.map((char)=>char.id === editingId ? result.data : char);
                onCharactersChange(updatedCharacters);
                setEditingId(null);
                setEditForm({});
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('CHARACTERS_VIEW', 'Character saved to DB', {
                    id: editingId
                });
            } else {
                throw new Error(result.error || 'Failed to save character');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('CHARACTERS_VIEW', 'Failed to save character', error);
            // 사용자에게 에러 알림 (향후 toast 시스템 추가)
            alert('캐릭터 저장에 실패했습니다.');
        }
    };
    const handleEditCancel = ()=>{
        setEditingId(null);
        setEditForm({});
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('CHARACTERS_VIEW', 'Edit cancelled');
    };
    const handleDelete = (id)=>{
        const updatedCharacters = characters.filter((char)=>char.id !== id);
        onCharactersChange(updatedCharacters);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('CHARACTERS_VIEW', 'Character deleted', {
            id
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: CHARACTERS_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: CHARACTERS_STYLES.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: CHARACTERS_STYLES.title,
                        children: "등장인물"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: CHARACTERS_STYLES.subtitle,
                        children: "이야기의 등장인물들을 정리하고 관리하세요"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: CHARACTERS_STYLES.content,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: CHARACTERS_STYLES.characterGrid,
                    children: [
                        characters.map((character)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: CHARACTERS_STYLES.characterCard,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.characterHeader,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.characterInfo,
                                            children: editingId === character.id ? // 🔥 편집 모드
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: editForm.name || '',
                                                        onChange: (e)=>setEditForm((prev)=>({
                                                                    ...prev,
                                                                    name: e.target.value
                                                                })),
                                                        className: CHARACTERS_STYLES.editInput,
                                                        placeholder: "인물 이름"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                        lineNumber: 163,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: editForm.role || '',
                                                        onChange: (e)=>setEditForm((prev)=>({
                                                                    ...prev,
                                                                    role: e.target.value
                                                                })),
                                                        className: `${CHARACTERS_STYLES.editInput} mt-2`,
                                                        placeholder: "역할"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                        lineNumber: 170,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        value: editForm.notes || '',
                                                        onChange: (e)=>setEditForm((prev)=>({
                                                                    ...prev,
                                                                    notes: e.target.value
                                                                })),
                                                        className: `${CHARACTERS_STYLES.editTextarea} mt-2`,
                                                        placeholder: "인물 설명",
                                                        rows: 3
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                        lineNumber: 177,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true) : // 🔥 표시 모드
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: CHARACTERS_STYLES.characterName,
                                                        children: character.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                        lineNumber: 188,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: CHARACTERS_STYLES.characterRole,
                                                        children: character.role
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                        lineNumber: 189,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: CHARACTERS_STYLES.characterNotes,
                                                        children: character.notes
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                        lineNumber: 190,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 159,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-1",
                                            children: editingId === character.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handleEditSave,
                                                        className: CHARACTERS_STYLES.saveButton,
                                                        title: "저장",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                            size: 16
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 204,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                        lineNumber: 199,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handleEditCancel,
                                                        className: CHARACTERS_STYLES.cancelButton,
                                                        title: "취소",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                            size: 16
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 211,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                        lineNumber: 206,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleEditStart(character),
                                                className: CHARACTERS_STYLES.editButton,
                                                title: "편집",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 220,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                lineNumber: 215,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 196,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 158,
                                    columnNumber: 15
                                }, this)
                            }, character.id, false, {
                                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleAddCharacter,
                            className: CHARACTERS_STYLES.addButton,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: CHARACTERS_STYLES.addButtonIcon
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 233,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: CHARACTERS_STYLES.addButtonText,
                                    children: "새 인물 추가"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 234,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 229,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                    lineNumber: 155,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
        lineNumber: 144,
        columnNumber: 5
    }, this);
}
_s(CharactersView, "CBrneDUhQz8TfCmNcCh4OEf2c/k=");
_c = CharactersView;
var _c;
__turbopack_context__.k.register(_c, "CharactersView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/views/NotesView.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "NotesView": (()=>NotesView)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/pen-line.mjs [app-client] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/save.mjs [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/lightbulb.mjs [app-client] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/target.mjs [app-client] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/book-open.mjs [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// 🔥 차분하고 전문적인 노트 스타일 (11원칙 준수)
const NOTES_STYLES = {
    container: 'flex-1 overflow-hidden bg-white dark:bg-gray-900',
    // 🔥 깔끔한 헤더
    header: 'p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
    title: 'text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2',
    subtitle: 'text-gray-600 dark:text-gray-400',
    // 🔥 컨텐츠 영역
    content: 'flex-1 overflow-y-auto p-6',
    // 🔥 타입 필터
    typeButtons: 'flex gap-2 mb-6 flex-wrap',
    typeButton: 'flex items-center gap-2 px-3 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
    typeButtonActive: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700',
    // 🔥 간단한 노트 그리드
    notesGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    // 🔥 미니멀 노트 카드
    noteCard: 'group p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200',
    noteHeader: 'flex items-center gap-3 mb-3',
    noteIcon: 'w-5 h-5 text-blue-600 dark:text-blue-400',
    noteTitle: 'font-medium text-gray-900 dark:text-gray-100 flex-1',
    noteContent: 'text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap line-clamp-4',
    noteDate: 'text-xs text-gray-500 dark:text-gray-500 mt-3',
    // 🔥 간단한 추가 버튼
    addButton: 'group flex flex-col items-center justify-center gap-2 p-6 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer min-h-[150px]',
    addButtonIcon: 'w-6 h-6 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors',
    addButtonText: 'font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors',
    addButtonSubtext: 'text-sm text-gray-500 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors',
    // 🔥 편집 버튼
    editButton: 'p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors',
    saveButton: 'p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors',
    cancelButton: 'p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors',
    // 🔥 편집 인풋
    editInput: 'w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500',
    editTextarea: 'w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none'
};
// 기본 메모 데이터
const DEFAULT_NOTES = [
    {
        id: '1',
        projectId: '',
        title: '💡 핵심 아이디어',
        content: '• 주인공의 숨겨진 과거\n• 반전 포인트 3개\n• 감정적 클라이맥스',
        type: 'idea',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: '2',
        projectId: '',
        title: '🎯 스토리 목표',
        content: '독자가 느껴야 할 감정:\n- 긴장감\n- 경이로움\n- 카타르시스',
        type: 'goal',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: '3',
        projectId: '',
        title: '📝 참고 자료',
        content: '• 관련 영화: 인셉션, 매트릭스\n• 참고 소설: 1984\n• 연구 자료: 인공지능 윤리학',
        type: 'reference',
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
const NOTE_TYPES = [
    {
        id: 'idea',
        label: '아이디어',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"]
    },
    {
        id: 'goal',
        label: '목표',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"]
    },
    {
        id: 'reference',
        label: '참고',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"]
    }
];
function NotesView({ projectId, notes: propNotes, onNotesChange }) {
    _s();
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(propNotes || DEFAULT_NOTES.map({
        "NotesView.useState": (note)=>({
                ...note,
                projectId
            })
    }["NotesView.useState"]));
    const [selectedType, setSelectedType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editForm, setEditForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const handleAddNote = ()=>{
        const newNote = {
            id: Date.now().toString(),
            projectId,
            title: '새 메모',
            content: '여기에 메모를 작성하세요...',
            type: selectedType === 'all' ? 'idea' : selectedType,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const updatedNotes = [
            ...notes,
            newNote
        ];
        setNotes(updatedNotes);
        setEditingId(newNote.id);
        setEditForm(newNote);
        if (onNotesChange) {
            onNotesChange(updatedNotes);
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('NOTES_VIEW', 'New note added', {
            id: newNote.id
        });
    };
    const handleEditStart = (note)=>{
        setEditingId(note.id);
        setEditForm(note);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('NOTES_VIEW', 'Edit started', {
            id: note.id
        });
    };
    const handleEditSave = ()=>{
        if (!editingId || !editForm) return;
        const updatedNotes = notes.map((note)=>note.id === editingId ? {
                ...note,
                ...editForm,
                updatedAt: new Date()
            } : note);
        setNotes(updatedNotes);
        setEditingId(null);
        setEditForm({});
        if (onNotesChange) {
            onNotesChange(updatedNotes);
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('NOTES_VIEW', 'Note updated', {
            id: editingId
        });
    };
    const handleEditCancel = ()=>{
        setEditingId(null);
        setEditForm({});
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('NOTES_VIEW', 'Edit cancelled');
    };
    const getTypeIcon = (type)=>{
        const noteType = NOTE_TYPES.find((t)=>t.id === type);
        return noteType ? noteType.icon : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"];
    };
    const filteredNotes = selectedType === 'all' ? notes : notes.filter((note)=>note.type === selectedType);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: NOTES_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: NOTES_STYLES.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: NOTES_STYLES.title,
                        children: "작가 노트"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: NOTES_STYLES.subtitle,
                        children: "아이디어, 목표, 참고 자료를 체계적으로 정리하세요"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: NOTES_STYLES.content,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: NOTES_STYLES.typeButtons,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedType('all'),
                                className: `${NOTES_STYLES.typeButton} ${selectedType === 'all' ? NOTES_STYLES.typeButtonActive : ''}`,
                                children: "전체"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 182,
                                columnNumber: 11
                            }, this),
                            NOTE_TYPES.map((type)=>{
                                const IconComponent = type.icon;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedType(type.id),
                                    className: `${NOTES_STYLES.typeButton} ${selectedType === type.id ? NOTES_STYLES.typeButtonActive : ''}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                            lineNumber: 200,
                                            columnNumber: 17
                                        }, this),
                                        type.label
                                    ]
                                }, type.id, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                    lineNumber: 193,
                                    columnNumber: 15
                                }, this);
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                        lineNumber: 181,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: NOTES_STYLES.notesGrid,
                        children: [
                            filteredNotes.map((note)=>{
                                const IconComponent = getTypeIcon(note.type);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: NOTES_STYLES.noteCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: NOTES_STYLES.noteHeader,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                                                    className: NOTES_STYLES.noteIcon
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 19
                                                }, this),
                                                editingId === note.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: editForm.title || '',
                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                ...prev,
                                                                title: e.target.value
                                                            })),
                                                    className: NOTES_STYLES.editInput,
                                                    placeholder: "메모 제목"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                    lineNumber: 216,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: NOTES_STYLES.noteTitle,
                                                    children: note.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                    lineNumber: 224,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-1",
                                                    children: editingId === note.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: handleEditSave,
                                                                className: NOTES_STYLES.saveButton,
                                                                title: "저장",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                                    size: 16
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                                    lineNumber: 236,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                                lineNumber: 231,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: handleEditCancel,
                                                                className: NOTES_STYLES.cancelButton,
                                                                title: "취소",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                    size: 16
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                                    lineNumber: 243,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                                lineNumber: 238,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleEditStart(note),
                                                        className: NOTES_STYLES.editButton,
                                                        title: "편집",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                                            size: 16
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                            lineNumber: 252,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                        lineNumber: 247,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                    lineNumber: 228,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                            lineNumber: 213,
                                            columnNumber: 17
                                        }, this),
                                        editingId === note.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: editForm.content || '',
                                            onChange: (e)=>setEditForm((prev)=>({
                                                        ...prev,
                                                        content: e.target.value
                                                    })),
                                            className: NOTES_STYLES.editTextarea,
                                            placeholder: "메모 내용",
                                            rows: 6
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                            lineNumber: 259,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: NOTES_STYLES.noteContent,
                                            children: note.content
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                            lineNumber: 267,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: NOTES_STYLES.noteDate,
                                            children: note.updatedAt.toLocaleDateString()
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                            lineNumber: 270,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, note.id, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                    lineNumber: 212,
                                    columnNumber: 15
                                }, this);
                            }),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleAddNote,
                                className: NOTES_STYLES.addButton,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: NOTES_STYLES.addButtonIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 282,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: NOTES_STYLES.addButtonText,
                                        children: "새 메모 추가"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 283,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: NOTES_STYLES.addButtonSubtext,
                                        children: [
                                            selectedType === 'all' ? '아이디어를' : NOTE_TYPES.find((t)=>t.id === selectedType)?.label + '를',
                                            " 기록하세요"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 284,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 278,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                        lineNumber: 207,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                lineNumber: 179,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
        lineNumber: 169,
        columnNumber: 5
    }, this);
}
_s(NotesView, "R4mFk39nd14yd7KR97LVTEp6GCQ=");
_c = NotesView;
var _c;
__turbopack_context__.k.register(_c, "NotesView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/editor/WriterStats.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 작가 통계 계산 유틸리티
__turbopack_context__.s({
    "calculateWriterStats": (()=>calculateWriterStats),
    "formatLastSaved": (()=>formatLastSaved),
    "formatTime": (()=>formatTime),
    "getRecommendedWordGoal": (()=>getRecommendedWordGoal)
});
const calculateWriterStats = (content, wordGoal, sessionStartTime)=>{
    if (!content) {
        return {
            wordCount: 0,
            charCount: 0,
            paragraphCount: 0,
            readingTime: 0,
            wordGoal,
            progress: 0,
            sessionTime: 0,
            wpm: 0,
            headingCount: 0,
            listItemCount: 0
        };
    }
    const lines = content.split('\n');
    const wordCount = content.split(/\s+/).filter((word)=>word.length > 0).length;
    const charCount = content.length;
    const paragraphCount = content.split(/\n\s*\n/).filter((p)=>p.trim().length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // 분 단위 (200 WPM 기준)
    const progress = Math.min(100, Math.round(wordCount / wordGoal * 100));
    // 세션 시간 및 WPM 계산
    const sessionMinutes = Math.max(1, (Date.now() - sessionStartTime) / 1000 / 60);
    const wpm = Math.round(wordCount / sessionMinutes);
    const sessionTime = Math.floor(sessionMinutes);
    // 마크다운 요소 카운트
    const headingCount = lines.filter((line)=>line.match(/^#{1,6}\s/)).length;
    const listItemCount = lines.filter((line)=>line.match(/^[\s]*[-*+]\s/)).length;
    return {
        wordCount,
        charCount,
        paragraphCount,
        readingTime,
        wordGoal,
        progress,
        sessionTime,
        wpm,
        headingCount,
        listItemCount
    };
};
const formatTime = (minutes)=>{
    if (minutes < 60) return `${minutes}분`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}시간 ${mins ? `${mins}분` : ''}`;
};
const formatLastSaved = (lastSaved)=>{
    if (!lastSaved) return '저장되지 않음';
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전`;
};
const getRecommendedWordGoal = (averageWordsPerDay)=>{
    const base = Math.max(500, averageWordsPerDay);
    return [
        Math.round(base * 0.8),
        base,
        Math.round(base * 1.2),
        Math.round(base * 1.5),
        Math.round(base * 2.0)
    ];
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/hooks/useAutoSave.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useAutoSave": (()=>useAutoSave)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useAutoSave({ projectId, delay = 5000, onSave, onSaveSuccess, onSaveError }) {
    _s();
    const saveTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isLoadingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const retryCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastTypingTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0); // 🔥 마지막 타이핑 시간 추적
    const maxRetries = 3;
    // 🔥 노션 스타일 Debounced 저장 (타이핑 중단 후에만)
    const debouncedSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAutoSave.useCallback[debouncedSave]": ()=>{
            // 🔥 타이핑 시간 업데이트
            lastTypingTimeRef.current = Date.now();
            // 기존 타이머 취소
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
            // 새 타이머 설정 - 사용자가 타이핑을 멈춘 후에만 실행
            saveTimerRef.current = setTimeout({
                "useAutoSave.useCallback[debouncedSave]": async ()=>{
                    const timeSinceLastTyping = Date.now() - lastTypingTimeRef.current;
                    // 🔥 핵심: 마지막 타이핑 후 충분한 시간이 지났는지 확인
                    if (timeSinceLastTyping < delay * 0.9) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('AUTO_SAVE', 'Still typing, postponing save', {
                            projectId,
                            timeSinceLastTyping,
                            requiredDelay: delay
                        });
                        // 다시 스케줄링
                        debouncedSave();
                        return;
                    }
                    if (isLoadingRef.current) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('AUTO_SAVE', 'Save already in progress, skipping', {
                            projectId
                        });
                        return;
                    }
                    try {
                        isLoadingRef.current = true;
                        const startTime = Date.now();
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('AUTO_SAVE', '💾 Starting auto-save (typing stopped)', {
                            projectId,
                            timeSinceLastTyping
                        });
                        await onSave();
                        retryCountRef.current = 0; // 성공 시 재시도 카운터 리셋
                        const duration = Date.now() - startTime;
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('AUTO_SAVE', '✅ Auto-save completed', {
                            projectId,
                            duration: `${duration}ms`,
                            timeSinceLastTyping
                        });
                        onSaveSuccess?.();
                    } catch (error) {
                        const errorObj = error instanceof Error ? error : new Error(String(error));
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('AUTO_SAVE', '❌ Auto-save failed', errorObj);
                        // 재시도 로직
                        if (retryCountRef.current < maxRetries) {
                            retryCountRef.current++;
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('AUTO_SAVE', `Retrying save (${retryCountRef.current}/${maxRetries})`, {
                                projectId
                            });
                            // 재시도 딜레이 (2초, 4초, 8초로 점진적 증가)
                            setTimeout({
                                "useAutoSave.useCallback[debouncedSave]": ()=>{
                                    debouncedSave();
                                }
                            }["useAutoSave.useCallback[debouncedSave]"], Math.pow(2, retryCountRef.current) * 1000);
                        } else {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('AUTO_SAVE', 'Max retries exceeded', {
                                projectId
                            });
                            onSaveError?.(errorObj);
                        }
                    } finally{
                        isLoadingRef.current = false;
                        saveTimerRef.current = null;
                    }
                }
            }["useAutoSave.useCallback[debouncedSave]"], delay);
        }
    }["useAutoSave.useCallback[debouncedSave]"], [
        projectId,
        delay,
        onSave,
        onSaveSuccess,
        onSaveError
    ]);
    // 🔥 즉시 저장 (Ctrl+S용)
    const forceSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAutoSave.useCallback[forceSave]": async ()=>{
            // 기존 debounced 저장 취소
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
                saveTimerRef.current = null;
            }
            if (isLoadingRef.current) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('AUTO_SAVE', 'Save already in progress, cannot force save', {
                    projectId
                });
                return;
            }
            try {
                isLoadingRef.current = true;
                const startTime = Date.now();
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('AUTO_SAVE', 'Starting force save', {
                    projectId
                });
                await onSave();
                retryCountRef.current = 0;
                const duration = Date.now() - startTime;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('AUTO_SAVE', '✅ Force save completed', {
                    projectId,
                    duration: `${duration}ms`
                });
                onSaveSuccess?.();
            } catch (error) {
                const errorObj = error instanceof Error ? error : new Error(String(error));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('AUTO_SAVE', '❌ Force save failed', errorObj);
                onSaveError?.(errorObj);
            } finally{
                isLoadingRef.current = false;
            }
        }
    }["useAutoSave.useCallback[forceSave]"], [
        projectId,
        onSave,
        onSaveSuccess,
        onSaveError
    ]);
    // 🔥 컴포넌트 언마운트 시 정리
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAutoSave.useEffect": ()=>{
            return ({
                "useAutoSave.useEffect": ()=>{
                    if (saveTimerRef.current) {
                        clearTimeout(saveTimerRef.current);
                    }
                }
            })["useAutoSave.useEffect"];
        }
    }["useAutoSave.useEffect"], []);
    return {
        debouncedSave,
        forceSave,
        isLoading: isLoadingRef.current
    };
}
_s(useAutoSave, "ymrcmsaSX6lbDFp649yCD4Rm2D8=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/hooks/useProjectData.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useProjectData": (()=>useProjectData)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$WriterStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/WriterStats.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useAutoSave$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/hooks/useAutoSave.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function useProjectData(projectId) {
    _s();
    const sessionStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(Date.now());
    // 🔥 성능 최적화: 기본 날짜 메모이제이션 (new Date() 반복 생성 방지)
    const defaultDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useProjectData.useMemo[defaultDate]": ()=>new Date()
    }["useProjectData.useMemo[defaultDate]"], []);
    // 🔥 성능 최적화: 기본 데이터 메모이제이션 (중복 객체 생성 방지)
    const defaultCharacters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useProjectData.useMemo[defaultCharacters]": ()=>[
                {
                    id: '1',
                    projectId: projectId,
                    name: '주인공',
                    role: '주요 인물',
                    notes: '용감하고 정의로운 성격',
                    createdAt: defaultDate,
                    updatedAt: defaultDate
                },
                {
                    id: '2',
                    projectId: projectId,
                    name: '조력자',
                    role: '조력자',
                    notes: '지혜롭고 경험이 많음',
                    createdAt: defaultDate,
                    updatedAt: defaultDate
                },
                {
                    id: '3',
                    projectId: projectId,
                    name: '적대자',
                    role: '적대자',
                    notes: '야망이 크고 냉혹함',
                    createdAt: defaultDate,
                    updatedAt: defaultDate
                }
            ]
    }["useProjectData.useMemo[defaultCharacters]"], [
        projectId,
        defaultDate
    ]);
    const defaultNotes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useProjectData.useMemo[defaultNotes]": ()=>[
                {
                    id: '1',
                    projectId: projectId,
                    title: '첫 번째 메모',
                    content: '이야기의 핵심 아이디어를 여기에 적어보세요.',
                    tags: [
                        '아이디어'
                    ],
                    color: '#3b82f6',
                    isPinned: false,
                    createdAt: defaultDate,
                    updatedAt: defaultDate
                },
                {
                    id: '2',
                    projectId: projectId,
                    title: '설정 노트',
                    content: '세계관, 배경 설정에 대한 내용을 정리합니다.',
                    tags: [
                        '설정',
                        '세계관'
                    ],
                    color: '#10b981',
                    isPinned: true,
                    createdAt: defaultDate,
                    updatedAt: defaultDate
                }
            ]
    }["useProjectData.useMemo[defaultNotes]"], [
        projectId,
        defaultDate
    ]);
    const defaultStructure = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useProjectData.useMemo[defaultStructure]": ()=>[
                {
                    id: '1',
                    projectId: projectId,
                    type: 'chapter',
                    title: '1장: 시작',
                    isActive: true,
                    createdAt: defaultDate,
                    updatedAt: defaultDate
                },
                {
                    id: '2',
                    projectId: projectId,
                    type: 'scene',
                    title: '첫 번째 장면',
                    isActive: true,
                    createdAt: defaultDate,
                    updatedAt: defaultDate
                },
                {
                    id: '3',
                    projectId: projectId,
                    type: 'scene',
                    title: '두 번째 장면',
                    isActive: true,
                    createdAt: defaultDate,
                    updatedAt: defaultDate
                },
                {
                    id: '4',
                    projectId: projectId,
                    type: 'chapter',
                    title: '2장: 전개',
                    isActive: true,
                    createdAt: defaultDate,
                    updatedAt: defaultDate
                },
                {
                    id: '5',
                    projectId: projectId,
                    type: 'scene',
                    title: '세 번째 장면',
                    isActive: true,
                    createdAt: defaultDate,
                    updatedAt: defaultDate
                },
                {
                    id: '6',
                    projectId: projectId,
                    type: 'note',
                    title: '아이디어 메모',
                    isActive: true,
                    createdAt: defaultDate,
                    updatedAt: defaultDate
                }
            ]
    }["useProjectData.useMemo[defaultStructure]"], [
        projectId,
        defaultDate
    ]);
    // 🔥 로딩 및 에러 상태 추가
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // 🔥 기본 프로젝트 상태
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [content, setContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [lastSaved, setLastSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [saveStatus, setSaveStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('saved');
    // 🔥 ref로 최신 값 추적 (성능 최적화: useEffect 제거)
    const titleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])('');
    const contentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])('');
    // 🔥 최적화: setter에서 직접 ref 업데이트 (useEffect 불필요)
    const setTitleOptimized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[setTitleOptimized]": (newTitle)=>{
            titleRef.current = newTitle;
            setTitle(newTitle);
        }
    }["useProjectData.useCallback[setTitleOptimized]"], []);
    const setContentOptimized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[setContentOptimized]": (newContent)=>{
            contentRef.current = newContent;
            setContent(newContent);
        }
    }["useProjectData.useCallback[setContentOptimized]"], []);
    // 🔥 작가 데이터
    const [characters, setCharacters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [structure, setStructure] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // 🔥 notes 상태 추가
    const [writerStats, setWriterStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        wordCount: 0,
        charCount: 0,
        paragraphCount: 0,
        readingTime: 0,
        wordGoal: 1000,
        progress: 0,
        sessionTime: 0,
        wpm: 0
    });
    // 🔥 프로젝트 로드 (무한루프 방지)
    const loadProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[loadProject]": async ()=>{
            try {
                setIsLoading(true);
                setError(null);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Loading project', {
                    projectId
                });
                const result = await window.electronAPI.projects.getById(projectId);
                if (result.success && result.data) {
                    setTitle(result.data.title);
                    setContent(result.data.content);
                    setLastSaved(new Date(result.data.lastModified));
                    setSaveStatus('saved'); // 🔥 저장 상태 업데이트
                    // 🔥 실제 데이터 로드 - 캐릭터 데이터
                    try {
                        const charactersResult = await window.electronAPI.projects.getCharacters(projectId);
                        if (charactersResult.success && charactersResult.data) {
                            setCharacters(charactersResult.data);
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Characters loaded successfully', {
                                count: charactersResult.data.length
                            });
                        } else {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'No characters found, using defaults');
                            // 기본 캐릭터 데이터
                            setCharacters(defaultCharacters);
                        }
                    } catch (error) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'Failed to load characters, using defaults', error);
                        setCharacters(defaultCharacters);
                    }
                    // 🔥 실제 데이터 로드 - 구조 데이터
                    try {
                        const structureResult = await window.electronAPI.projects.getStructure(projectId);
                        if (structureResult.success && structureResult.data) {
                            setStructure(structureResult.data);
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Structure loaded successfully', {
                                count: structureResult.data.length
                            });
                        } else {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'No structure found, using defaults');
                            // 기본 구조 데이터
                            setStructure(defaultStructure);
                        }
                    } catch (error) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'Failed to load structure, using defaults', error);
                        setStructure(defaultStructure);
                    }
                    // 🔥 실제 데이터 로드 - 노트 데이터
                    try {
                        const notesResult = await window.electronAPI.projects.getNotes(projectId);
                        if (notesResult.success && notesResult.data) {
                            setNotes(notesResult.data);
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Notes loaded successfully', {
                                count: notesResult.data.length
                            });
                        } else {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'No notes found, using defaults');
                            // 기본 노트 데이터
                            setNotes(defaultNotes);
                        }
                    } catch (error) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'Failed to load notes, using defaults', error);
                        setNotes(defaultNotes);
                    }
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', 'Project loaded successfully');
                } else {
                    throw new Error(result.error || 'Failed to load project');
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Error loading project', error);
                setError(error instanceof Error ? error.message : 'Failed to load project');
                // 🔥 실패 시 로컬 백업 확인
                try {
                    const backup = localStorage.getItem(`project_backup_${projectId}`);
                    if (backup) {
                        const backupData = JSON.parse(backup);
                        setTitle(backupData.title || '');
                        setContent(backupData.content || '');
                        setSaveStatus('unsaved');
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', 'Loaded from local backup');
                    }
                } catch (storageError) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Failed to load backup', storageError);
                }
            } finally{
                setIsLoading(false); // 🔥 무조건 로딩 상태 해제
            }
        }
    }["useProjectData.useCallback[loadProject]"], [
        projectId
    ]);
    // 🔥 프로젝트 저장 함수 (ref로 무한루프 방지)
    const saveProjectInternal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[saveProjectInternal]": async ()=>{
            try {
                const currentTitle = titleRef.current;
                const currentContent = contentRef.current;
                if (!currentTitle.trim() && !currentContent.trim()) return;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Saving project to server', {
                    projectId
                });
                // 🔥 로컬 백업 먼저 저장 (즉시)
                try {
                    const backupData = {
                        title: currentTitle,
                        content: currentContent,
                        lastModified: new Date()
                    };
                    localStorage.setItem(`project_backup_${projectId}`, JSON.stringify(backupData));
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Local backup saved');
                } catch (storageError) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'Failed to save local backup', storageError);
                }
                // 🔥 즉시 서버 저장
                const result = await window.electronAPI.projects.update(projectId, {
                    title: currentTitle,
                    content: currentContent,
                    lastModified: new Date()
                });
                if (result.success) {
                    setLastSaved(new Date());
                    setSaveStatus('saved');
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', 'Project saved successfully to server');
                    // 성공 시 로컬 백업 제거
                    try {
                        localStorage.removeItem(`project_backup_${projectId}`);
                    } catch (e) {
                    // 무시
                    }
                } else {
                    throw new Error(result.error || 'Failed to save project');
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Error saving project', error);
                setSaveStatus('error');
                throw error;
            }
        }
    }["useProjectData.useCallback[saveProjectInternal]"], [
        projectId
    ]); // 🔥 projectId만 dependency로 설정
    // 🔥 노션 스타일 autoSave Hook 사용 - 타이핑 중단 후 저장
    const { debouncedSave, forceSave, isLoading: isSaving } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useAutoSave$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAutoSave"])({
        projectId,
        delay: 3000,
        onSave: saveProjectInternal,
        onSaveSuccess: {
            "useProjectData.useAutoSave": ()=>{
                setSaveStatus('saved');
                setLastSaved(new Date());
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', '✅ 자동 저장 완료', {
                    projectId
                });
            }
        }["useProjectData.useAutoSave"],
        onSaveError: {
            "useProjectData.useAutoSave": (error)=>{
                setSaveStatus('error');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', '❌ 자동 저장 실패', {
                    error: error.message,
                    projectId
                });
                // 에러 발생 시 로컬 백업 생성
                try {
                    localStorage.setItem(`project_backup_${projectId}`, JSON.stringify({
                        title,
                        content
                    }));
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', '📦 로컬 백업 저장됨', {
                        projectId
                    });
                } catch (backupError) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', '❌ 로컬 백업 실패', backupError);
                }
            }
        }["useProjectData.useAutoSave"]
    });
    // 🔥 호환성을 위한 saveProject 함수
    const saveProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[saveProject]": async ()=>{
            await forceSave();
        }
    }["useProjectData.useCallback[saveProject]"], [
        forceSave
    ]);
    // 🔥 비용이 큰 통계 계산을 메모이제이션 (Hook 규칙 준수)
    const memoizedStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useProjectData.useMemo[memoizedStats]": ()=>{
            if (!content) return writerStats;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$WriterStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateWriterStats"])(content, writerStats.wordGoal, sessionStartRef.current);
        }
    }["useProjectData.useMemo[memoizedStats]"], [
        content,
        writerStats.wordGoal,
        writerStats
    ]);
    // 🔥 작가 통계 업데이트 (메모이제이션된 값 사용)
    const updateWriterStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[updateWriterStats]": ()=>{
            setWriterStats(memoizedStats);
        }
    }["useProjectData.useCallback[updateWriterStats]"], [
        memoizedStats
    ]);
    const setWordGoal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[setWordGoal]": (goal)=>{
            setWriterStats({
                "useProjectData.useCallback[setWordGoal]": (prev)=>({
                        ...prev,
                        wordGoal: goal,
                        progress: Math.min(100, Math.round(prev.wordCount / goal * 100))
                    })
            }["useProjectData.useCallback[setWordGoal]"]);
        }
    }["useProjectData.useCallback[setWordGoal]"], []);
    // 🔥 프로젝트 초기 로드 (성능 최적화: loadProject를 useRef로 안전하게 관리)
    const loadProjectRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(loadProject);
    loadProjectRef.current = loadProject;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useProjectData.useEffect": ()=>{
            if (projectId) {
                loadProjectRef.current();
            }
        }
    }["useProjectData.useEffect"], [
        projectId
    ]); // 🔥 projectId만 dependency로 - 무한루프 완전 방지
    // 🔥 자동 저장 시스템 (성능 최적화: ref로 무한루프 방지)
    const debouncedSaveRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(debouncedSave);
    debouncedSaveRef.current = debouncedSave;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useProjectData.useEffect": ()=>{
            if (title.trim() || content.trim()) {
                setSaveStatus('unsaved');
                debouncedSaveRef.current(); // ref를 통해 안전하게 호출
            }
        }
    }["useProjectData.useEffect"], [
        title,
        content
    ]); // 🔥 debouncedSave dependency 완전 제거
    // 🔥 저장 중 상태 관리
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useProjectData.useEffect": ()=>{
            if (isSaving) {
                setSaveStatus('saving');
            }
        }
    }["useProjectData.useEffect"], [
        isSaving
    ]);
    // 🔥 통계 업데이트 (기가차드 수정: interval 제거로 커서 리셋 완전 해결)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useProjectData.useEffect": ()=>{
            updateWriterStats();
        // 🔥 30초 interval 완전 제거 - 커서 리셋 원인 제거
        // 세션 시간은 사용자가 통계를 볼 때만 계산하도록 변경
        }
    }["useProjectData.useEffect"], []); // 🔥 dependency 완전 제거 - useEffect 지옥 해결
    // 🔥 캐릭터 저장 함수
    const saveCharacters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[saveCharacters]": async (charactersToSave)=>{
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Saving characters', {
                    count: charactersToSave.length
                });
                // 🔥 실제 API 호출
                const result = await window.electronAPI.projects.updateCharacters(projectId, charactersToSave);
                if (result.success) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', 'Characters saved successfully');
                } else {
                    throw new Error(result.error || 'Failed to save characters');
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Error saving characters', error);
                throw error;
            }
        }
    }["useProjectData.useCallback[saveCharacters]"], [
        projectId
    ]);
    // 🔥 메모 저장 함수
    const saveNotes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[saveNotes]": async (notesToSave)=>{
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Saving notes', {
                    count: notesToSave.length
                });
                // 🔥 실제 API 호출
                const result = await window.electronAPI.projects.updateNotes(projectId, notesToSave);
                if (result.success) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', 'Notes saved successfully');
                } else {
                    throw new Error(result.error || 'Failed to save notes');
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Error saving notes', error);
                throw error;
            }
        }
    }["useProjectData.useCallback[saveNotes]"], [
        projectId
    ]);
    // 🔥 캐릭터 변경 핸들러 (자동 저장 포함)
    const handleCharactersChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[handleCharactersChange]": async (newCharacters)=>{
            setCharacters(newCharacters);
            try {
                await saveCharacters(newCharacters);
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Failed to save characters automatically', error);
            // 사용자에게 에러 표시할 수 있음
            }
        }
    }["useProjectData.useCallback[handleCharactersChange]"], [
        saveCharacters
    ]);
    // 🔥 메모 변경 핸들러 (자동 저장 포함)  
    const handleNotesChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[handleNotesChange]": async (newNotes)=>{
            setNotes(newNotes);
            try {
                await saveNotes(newNotes);
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Failed to save notes automatically', error);
            // 사용자에게 에러 표시할 수 있음
            }
        }
    }["useProjectData.useCallback[handleNotesChange]"], [
        saveNotes
    ]);
    return {
        // 🔥 로딩 및 에러 상태
        isLoading,
        error,
        // 🔥 기본 프로젝트 데이터 (성능 최적화된 setter)
        title,
        setTitle: setTitleOptimized,
        content,
        setContent: setContentOptimized,
        lastSaved,
        saveStatus,
        // 🔥 작가 데이터
        characters,
        setCharacters,
        structure,
        setStructure,
        notes,
        setNotes,
        writerStats,
        // 🔥 액션 함수들
        loadProject,
        saveProject,
        forceSave,
        updateWriterStats,
        setWordGoal
    };
}
_s(useProjectData, "1jlZDDd2kZMC4GRRMRYOU2nGBi8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useAutoSave$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAutoSave"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/hooks/useUIState.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useUIState": (()=>useUIState)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/providers/ThemeProvider.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function useUIState() {
    _s();
    // 🔥 테마 관리를 ThemeProvider로 위임
    const { resolvedTheme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    // 🔥 UI 상태 (테마 제외)
    const [showLeftSidebar, setShowLeftSidebar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showRightSidebar, setShowRightSidebar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showHeader, setShowHeader] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isFocusMode, setIsFocusMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 🔥 핸들러 함수들
    const toggleLeftSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUIState.useCallback[toggleLeftSidebar]": ()=>{
            setShowLeftSidebar({
                "useUIState.useCallback[toggleLeftSidebar]": (prev)=>!prev
            }["useUIState.useCallback[toggleLeftSidebar]"]);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('UI_STATE', 'Left sidebar toggled');
        }
    }["useUIState.useCallback[toggleLeftSidebar]"], []);
    const toggleRightSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUIState.useCallback[toggleRightSidebar]": ()=>{
            setShowRightSidebar({
                "useUIState.useCallback[toggleRightSidebar]": (prev)=>!prev
            }["useUIState.useCallback[toggleRightSidebar]"]);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('UI_STATE', 'Right sidebar toggled');
        }
    }["useUIState.useCallback[toggleRightSidebar]"], []);
    const toggleDarkMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUIState.useCallback[toggleDarkMode]": ()=>{
            toggleTheme(); // ThemeProvider의 토글 사용
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('UI_STATE', 'Dark mode toggled via ThemeProvider');
        }
    }["useUIState.useCallback[toggleDarkMode]"], [
        toggleTheme
    ]);
    const toggleFocusMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUIState.useCallback[toggleFocusMode]": ()=>{
            setIsFocusMode({
                "useUIState.useCallback[toggleFocusMode]": (prev)=>{
                    const newValue = !prev;
                    if (newValue) {
                        setShowLeftSidebar(false);
                        setShowRightSidebar(false);
                    }
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('UI_STATE', `Focus mode ${newValue ? 'enabled' : 'disabled'}`);
                    return newValue;
                }
            }["useUIState.useCallback[toggleFocusMode]"]);
        }
    }["useUIState.useCallback[toggleFocusMode]"], []);
    return {
        showLeftSidebar,
        showRightSidebar,
        showHeader,
        isDarkMode: resolvedTheme === 'dark',
        isFocusMode,
        toggleLeftSidebar,
        toggleRightSidebar,
        toggleDarkMode,
        toggleFocusMode,
        setShowHeader
    };
}
_s(useUIState, "iDq1zUEYv1oeR2DnzwMUemb5lWs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/ProjectEditor.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ProjectEditor": (()=>ProjectEditor)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/EditorProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$ShortcutHelp$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$WriterSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/WriterSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ProjectHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/ProjectHeader.tsx [app-client] (ecmascript)"); // 🔥 새로운 모듈화된 헤더
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ConfirmDeleteDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ShareDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/ShareDialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$WriteView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/WriteView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$StructureView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/StructureView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$CharactersView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/CharactersView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$NotesView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/NotesView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
// 🔥 실제 hooks import (기가차드 수정)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useProjectData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/hooks/useProjectData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useUIState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/hooks/useUIState.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
// 🔥 기가차드 UI 문제점 해결된 스타일
const WRITER_EDITOR_STYLES = {
    // 전체 레이아웃
    container: 'h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200',
    // 헤더 (🔥 nav 중첩 문제 해결)
    header: 'flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700',
    headerLeft: 'flex items-center gap-3',
    headerCenter: 'flex-1 max-w-md mx-auto',
    headerRight: 'flex items-center gap-2',
    // 메인 레이아웃
    main: 'flex flex-1 overflow-hidden',
    // 🔥 에디터 영역 수정 (한줄 문제, 스크롤 제한 해결)
    editorContainer: 'flex-1 flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-200',
    editorContent: 'flex-1 min-h-0 overflow-hidden',
    // UI 컨트롤
    iconButton: 'flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400',
    iconButtonActive: 'flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    titleInput: 'border-none bg-transparent focus:outline-none focus:ring-0 text-lg font-medium w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100',
    // 🔥 백 버튼 개선 (중첩 문제 해결)
    backButton: 'flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'
};
const ProjectEditor = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function ProjectEditor({ projectId }) {
    _s();
    console.log('🔥 ProjectEditor render started', {
        projectId
    }); // 🔥 디버그 로그
    // 🔥 커스텀 hooks 사용
    const { isLoading, error, ...projectData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useProjectData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectData"])(projectId);
    const uiState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useUIState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIState"])();
    const [currentView, setCurrentView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('write'); // 🔥 실제 뷰 상태 관리
    const [collapsed, setCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showDeleteDialog, setShowDeleteDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showShareDialog, setShowShareDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const editorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isEditorReady, setIsEditorReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // 🔥 에디터 준비 상태 추가
    // 🔥 에디터 준비 완료 핸들러 (fallback 에디터용)
    const handleEditorReady = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleEditorReady]": (editor)=>{
            if (editor) {
                editorRef.current = editor;
            }
            setIsEditorReady(true); // 🔥 에디터 준비 완료 표시
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Editor ready (fallback mode)');
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleEditorReady]"], []);
    const handleBack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleBack]": ()=>window.history.back()
    }["ProjectEditor.ProjectEditor.useCallback[handleBack]"], []);
    const handleToggleSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleToggleSidebar]": ()=>setCollapsed({
                "ProjectEditor.ProjectEditor.useCallback[handleToggleSidebar]": (prev)=>!prev
            }["ProjectEditor.ProjectEditor.useCallback[handleToggleSidebar]"])
    }["ProjectEditor.ProjectEditor.useCallback[handleToggleSidebar]"], []);
    // 🔥 공유 기능 핸들러
    const handleShare = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleShare]": ()=>{
            setShowShareDialog(true);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Share dialog opened');
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleShare]"], []);
    // 🔥 삭제 기능 핸들러
    const handleDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleDelete]": ()=>{
            setShowDeleteDialog(true);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Delete confirmation dialog opened');
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleDelete]"], []);
    // 🔥 삭제 확인 핸들러
    const handleConfirmDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleConfirmDelete]": async ()=>{
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Deleting project', {
                    projectId
                });
                const result = await window.electronAPI.projects.delete(projectId);
                if (result.success) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Project deleted successfully');
                    setShowDeleteDialog(false);
                    // 🔥 삭제 후 대시보드로 이동
                    window.history.back();
                } else {
                    throw new Error(result.error || 'Failed to delete project');
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_EDITOR', 'Failed to delete project', error);
            // TODO: 에러 토스트 표시
            }
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleConfirmDelete]"], [
        projectId
    ]);
    const handleDownload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleDownload]": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Download action')
    }["ProjectEditor.ProjectEditor.useCallback[handleDownload]"], []);
    // 🔥 뷰 변경 핸들러 (실제 구현)
    const handleViewChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleViewChange]": (view)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'View changed:', view);
            setCurrentView(view);
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleViewChange]"], []);
    const handleToolbarAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleToolbarAction]": (action)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Toolbar action:', action)
    }["ProjectEditor.ProjectEditor.useCallback[handleToolbarAction]"], []);
    // 🔥 작가 친화적 키보드 단축키 핸들러
    const handleKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleKeyDown]": (event)=>{
            const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
            const modKey = ctrlKey || metaKey; // Windows: Ctrl, Mac: Cmd
            // 🔥 기본 저장 단축키 (Ctrl+S / Cmd+S)
            if (modKey && key === 's') {
                event.preventDefault();
                projectData.forceSave();
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Save shortcut triggered');
                return;
            }
            // 🔥 포커스 모드 토글 (Ctrl+F / Cmd+F)
            if (modKey && key === 'f') {
                event.preventDefault();
                uiState.toggleFocusMode();
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Focus mode shortcut triggered');
                return;
            }
            // 🔥 사이드바 토글 (Ctrl+B / Cmd+B)
            if (modKey && key === 'b') {
                event.preventDefault();
                setCollapsed({
                    "ProjectEditor.ProjectEditor.useCallback[handleKeyDown]": (prev)=>!prev
                }["ProjectEditor.ProjectEditor.useCallback[handleKeyDown]"]);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Sidebar shortcut triggered');
                return;
            }
            // 🔥 다크모드 토글 (Ctrl+D / Cmd+D)
            if (modKey && key === 'd') {
                event.preventDefault();
                uiState.toggleDarkMode();
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Dark mode shortcut triggered');
                return;
            }
            // 🔥 뒤로가기 (Esc)
            if (key === 'Escape') {
                handleBack();
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Back shortcut triggered');
                return;
            }
            // 🔥 단축키 도움말 (F1)
            if (key === 'F1') {
                event.preventDefault();
                const helpEvent = new CustomEvent('shortcut:help');
                window.dispatchEvent(helpEvent);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Help shortcut triggered');
                return;
            }
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleKeyDown]"], [
        projectData.forceSave,
        uiState.toggleFocusMode,
        uiState.toggleDarkMode,
        handleBack
    ]);
    // 🔥 키보드 이벤트 리스너 등록
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectEditor.ProjectEditor.useEffect": ()=>{
            window.addEventListener('keydown', handleKeyDown);
            return ({
                "ProjectEditor.ProjectEditor.useEffect": ()=>window.removeEventListener('keydown', handleKeyDown)
            })["ProjectEditor.ProjectEditor.useEffect"];
        }
    }["ProjectEditor.ProjectEditor.useEffect"], [
        handleKeyDown
    ]);
    // 🔥 에디터 저장 이벤트 리스너 (Ctrl+S에서 발생)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectEditor.ProjectEditor.useEffect": ()=>{
            const handleProjectSave = {
                "ProjectEditor.ProjectEditor.useEffect.handleProjectSave": ()=>{
                    projectData.forceSave();
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Project save triggered from editor');
                }
            }["ProjectEditor.ProjectEditor.useEffect.handleProjectSave"];
            window.addEventListener('project:save', handleProjectSave);
            return ({
                "ProjectEditor.ProjectEditor.useEffect": ()=>window.removeEventListener('project:save', handleProjectSave)
            })["ProjectEditor.ProjectEditor.useEffect"];
        }
    }["ProjectEditor.ProjectEditor.useEffect"], [
        projectData.forceSave
    ]);
    // 🔥 데이터 로딩 상태를 기준으로 로딩 화면 표시 (무한 로딩 문제 해결)
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-screen flex items-center justify-center bg-white dark:bg-gray-900",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                        lineNumber: 195,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 dark:text-gray-400",
                        children: "프로젝트를 불러오는 중..."
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                        lineNumber: 196,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                lineNumber: 194,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
            lineNumber: 193,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-screen flex items-center justify-center text-red-500",
            children: [
                "오류: ",
                error
            ]
        }, void 0, true, {
            fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
            lineNumber: 203,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EditorProvider"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: WRITER_EDITOR_STYLES.container,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ProjectHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProjectHeader"], {
                        title: projectData.title,
                        onTitleChange: projectData.setTitle,
                        onBack: handleBack,
                        sidebarCollapsed: collapsed,
                        onToggleSidebar: handleToggleSidebar,
                        isFocusMode: uiState.isFocusMode,
                        onToggleFocusMode: uiState.toggleFocusMode,
                        onSave: projectData.forceSave,
                        onShare: handleShare,
                        onDownload: handleDownload,
                        onDelete: handleDelete
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                        lineNumber: 210,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: WRITER_EDITOR_STYLES.main,
                        children: [
                            !collapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$WriterSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WriterSidebar"], {
                                currentView: currentView,
                                onViewChange: handleViewChange,
                                structure: projectData.structure,
                                characters: projectData.characters,
                                stats: projectData.writerStats,
                                collapsed: false
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                                lineNumber: 228,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: WRITER_EDITOR_STYLES.editorContainer,
                                children: [
                                    currentView === 'write' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$WriteView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WriteView"], {
                                        content: projectData.content,
                                        onChange: projectData.setContent,
                                        isFocusMode: uiState.isFocusMode
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                                        lineNumber: 241,
                                        columnNumber: 15
                                    }, this),
                                    currentView === 'structure' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$StructureView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StructureView"], {
                                        structure: projectData.structure,
                                        onStructureChange: projectData.setStructure
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                                        lineNumber: 248,
                                        columnNumber: 15
                                    }, this),
                                    currentView === 'characters' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$CharactersView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CharactersView"], {
                                        projectId: projectId,
                                        characters: projectData.characters,
                                        onCharactersChange: projectData.setCharacters
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                                        lineNumber: 254,
                                        columnNumber: 15
                                    }, this),
                                    currentView === 'notes' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$NotesView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotesView"], {
                                        projectId: projectId,
                                        notes: projectData.notes || [],
                                        onNotesChange: projectData.setNotes
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                                        lineNumber: 261,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                                lineNumber: 239,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                lineNumber: 208,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$ShortcutHelp$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShortcutHelp"], {}, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                lineNumber: 272,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ConfirmDeleteDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConfirmDeleteDialog"], {
                isOpen: showDeleteDialog,
                projectTitle: projectData.title,
                onConfirm: handleConfirmDelete,
                onCancel: ()=>setShowDeleteDialog(false)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                lineNumber: 275,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ShareDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShareDialog"], {
                isOpen: showShareDialog,
                projectTitle: projectData.title,
                projectId: projectId,
                onClose: ()=>setShowShareDialog(false)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                lineNumber: 283,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
        lineNumber: 207,
        columnNumber: 5
    }, this);
}, "QgkwpB4WBvbxjHJPnubNLs9pbDc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useProjectData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useUIState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIState"]
    ];
})), "QgkwpB4WBvbxjHJPnubNLs9pbDc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useProjectData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useUIState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIState"]
    ];
});
_c1 = ProjectEditor;
var _c, _c1;
__turbopack_context__.k.register(_c, "ProjectEditor$memo");
__turbopack_context__.k.register(_c1, "ProjectEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/app/projects/[id]/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ProjectPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$ProjectEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/ProjectEditor.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function ProjectPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
    // 🔥 파라미터 검증
    if (!projectId) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_PAGE', 'Missing project ID in route parameters');
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-red-600 mb-4",
                        children: "오류"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/projects/[id]/page.tsx",
                        lineNumber: 21,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-600",
                        children: "프로젝트 ID가 없습니다."
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/projects/[id]/page.tsx",
                        lineNumber: 22,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/projects/[id]/page.tsx",
                lineNumber: 20,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/app/projects/[id]/page.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, this);
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_PAGE', 'Loading project page', {
        projectId
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$ProjectEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProjectEditor"], {
        projectId: projectId
    }, void 0, false, {
        fileName: "[project]/src/renderer/app/projects/[id]/page.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, this);
}
_s(ProjectPage, "+jVsTcECDRo3yq2d7EQxlN9Ixog=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = ProjectPage;
var _c;
__turbopack_context__.k.register(_c, "ProjectPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_renderer_ca486783._.js.map