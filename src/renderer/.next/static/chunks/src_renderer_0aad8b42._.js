(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/renderer/components/ui/Card.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Card": (()=>Card)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수 - 작가 친화적 다크모드 완전 지원
const CARD_STYLES = {
    base: 'rounded-lg transition-all duration-200 ease-in-out',
    variants: {
        default: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-slate-900/20',
        elevated: 'bg-white dark:bg-slate-800 shadow-lg dark:shadow-slate-900/30 border-0',
        outlined: 'bg-transparent border-2 border-slate-300 dark:border-slate-600',
        writer: 'bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 backdrop-blur-sm'
    },
    padding: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    },
    hover: {
        default: 'hover:shadow-md dark:hover:shadow-slate-900/40 hover:border-slate-300 dark:hover:border-slate-600',
        elevated: 'hover:shadow-xl dark:hover:shadow-slate-900/50 hover:-translate-y-1',
        outlined: 'hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50',
        writer: 'hover:shadow-lg dark:hover:shadow-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/60'
    }
};
const Card = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ variant = 'default', padding = 'md', hoverable = false, className, children, onClick, role, 'aria-label': ariaLabel, ...props }, ref)=>{
    const cardClassName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(CARD_STYLES.base, CARD_STYLES.variants[variant], CARD_STYLES.padding[padding], hoverable && CARD_STYLES.hover[variant], onClick && 'cursor-pointer', className);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: cardClassName,
        onClick: onClick,
        role: role,
        "aria-label": ariaLabel,
        tabIndex: onClick ? 0 : undefined,
        onKeyDown: onClick ? (e)=>{
            // 키보드 접근성: 카드 자체가 포커스된 경우에만 동작
            if (e.defaultPrevented) return;
            if (e.currentTarget !== e.target) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
            }
        } : undefined,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/ui/Card.tsx",
        lineNumber: 63,
        columnNumber: 7
    }, this);
});
_c1 = Card;
Card.displayName = 'Card';
var _c, _c1;
__turbopack_context__.k.register(_c, "Card$forwardRef");
__turbopack_context__.k.register(_c1, "Card");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/ui/Avatar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Avatar": (()=>Avatar),
    "AvatarFallback": (()=>AvatarFallback),
    "AvatarImage": (()=>AvatarImage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.mjs [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const AVATAR_STYLES = {
    root: 'relative inline-flex items-center justify-center overflow-hidden rounded-full select-none',
    sizes: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg'
    },
    image: 'aspect-square h-full w-full object-cover',
    fallback: 'flex h-full w-full items-center justify-center bg-slate-100 text-slate-600 font-medium',
    icon: 'h-1/2 w-1/2 text-slate-400',
    status: {
        base: 'absolute bottom-0 right-0 rounded-full border-2 border-white',
        sizes: {
            sm: 'h-2 w-2',
            md: 'h-2.5 w-2.5',
            lg: 'h-3 w-3',
            xl: 'h-4 w-4'
        },
        variants: {
            online: 'bg-green-500',
            away: 'bg-yellow-500',
            busy: 'bg-red-500',
            offline: 'bg-slate-400'
        }
    }
};
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
const Avatar = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ size = 'md', src, alt, fallback, status, className, children, onClick, 'aria-label': ariaLabel, ...props }, ref)=>{
    _s();
    const [imageLoaded, setImageLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [imageError, setImageError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const avatarClassName = cn(AVATAR_STYLES.root, AVATAR_STYLES.sizes[size], onClick && 'cursor-pointer hover:opacity-80 transition-opacity', className);
    const handleClick = ()=>{
        if (!onClick) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('AVATAR', 'Avatar clicked', {
            size,
            hasImage: !!src
        });
        onClick();
    };
    const handleKeyDown = (event)=>{
        if (!onClick) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
        }
    };
    const showImage = src && !imageError && imageLoaded;
    const showFallback = !src || imageError || !imageLoaded;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: avatarClassName,
        onClick: onClick ? handleClick : undefined,
        onKeyDown: onClick ? handleKeyDown : undefined,
        role: onClick ? 'button' : undefined,
        tabIndex: onClick ? 0 : undefined,
        "aria-label": ariaLabel || alt,
        ...props,
        children: [
            src && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: src,
                alt: alt || '사용자 아바타',
                className: cn(AVATAR_STYLES.image, showImage ? 'opacity-100' : 'opacity-0'),
                onLoad: ()=>{
                    setImageLoaded(true);
                    setImageError(false);
                },
                onError: ()=>{
                    setImageError(true);
                    setImageLoaded(false);
                }
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/ui/Avatar.tsx",
                lineNumber: 121,
                columnNumber: 11
            }, this),
            showFallback && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: AVATAR_STYLES.fallback,
                children: children || fallback ? children || fallback : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                    className: AVATAR_STYLES.icon,
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/ui/Avatar.tsx",
                    lineNumber: 145,
                    columnNumber: 15
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/ui/Avatar.tsx",
                lineNumber: 141,
                columnNumber: 11
            }, this),
            status && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: cn(AVATAR_STYLES.status.base, AVATAR_STYLES.status.sizes[size], AVATAR_STYLES.status.variants[status]),
                "aria-label": `상태: ${status}`
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/ui/Avatar.tsx",
                lineNumber: 152,
                columnNumber: 11
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/ui/Avatar.tsx",
        lineNumber: 109,
        columnNumber: 7
    }, this);
}, "+xC0VhkjkKdKpElgCoBFbVEZSxs=")), "+xC0VhkjkKdKpElgCoBFbVEZSxs=");
_c1 = Avatar;
Avatar.displayName = 'Avatar';
const AvatarImage = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = ({ src, alt, className, onLoadingStatusChange, ...props }, ref)=>{
    const handleLoad = ()=>{
        onLoadingStatusChange?.(false);
    };
    const handleError = ()=>{
        onLoadingStatusChange?.(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
        ref: ref,
        src: src,
        alt: alt,
        className: cn(AVATAR_STYLES.image, className),
        onLoad: handleLoad,
        onError: handleError,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/ui/Avatar.tsx",
        lineNumber: 180,
        columnNumber: 7
    }, this);
});
_c3 = AvatarImage;
AvatarImage.displayName = 'AvatarImage';
const AvatarFallback = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = ({ className, children, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: cn(AVATAR_STYLES.fallback, className),
        ...props,
        children: children || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
            className: AVATAR_STYLES.icon,
            "aria-hidden": "true"
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/ui/Avatar.tsx",
            lineNumber: 203,
            columnNumber: 22
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/ui/Avatar.tsx",
        lineNumber: 198,
        columnNumber: 7
    }, this);
});
_c5 = AvatarFallback;
AvatarFallback.displayName = 'AvatarFallback';
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "Avatar$forwardRef");
__turbopack_context__.k.register(_c1, "Avatar");
__turbopack_context__.k.register(_c2, "AvatarImage$forwardRef");
__turbopack_context__.k.register(_c3, "AvatarImage");
__turbopack_context__.k.register(_c4, "AvatarFallback$forwardRef");
__turbopack_context__.k.register(_c5, "AvatarFallback");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/ui/Textarea.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Textarea": (()=>Textarea)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const TEXTAREA_STYLES = {
    base: 'flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-blue-400',
    sizes: {
        sm: 'min-h-[60px] text-xs',
        md: 'min-h-[80px] text-sm',
        lg: 'min-h-[120px] text-base'
    },
    variants: {
        default: 'border-slate-300 focus:ring-blue-500',
        error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
        success: 'border-green-300 focus:ring-green-500 focus:border-green-500'
    },
    resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize'
    }
};
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
const Textarea = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ className, size = 'md', variant = 'default', resize = 'vertical', autoResize = false, maxLength, showCount = false, label, error, helperText, required = false, disabled, value, onChange, onFocus, onBlur, ...props }, ref)=>{
    _s();
    const [focused, setFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [charCount, setCharCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 🔥 기가차드 규칙: ref 병합
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Textarea.useEffect": ()=>{
            if (ref && typeof ref === 'function') {
                ref(textareaRef.current);
            } else if (ref) {
                ref.current = textareaRef.current;
            }
        }
    }["Textarea.useEffect"], [
        ref
    ]);
    // 자동 리사이즈 처리
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Textarea.useEffect": ()=>{
            if (autoResize && textareaRef.current) {
                const textarea = textareaRef.current;
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
            }
        }
    }["Textarea.useEffect"], [
        value,
        autoResize
    ]);
    // 문자 수 업데이트
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Textarea.useEffect": ()=>{
            if (typeof value === 'string') {
                setCharCount(value.length);
            }
        }
    }["Textarea.useEffect"], [
        value
    ]);
    const textareaClassName = cn(TEXTAREA_STYLES.base, TEXTAREA_STYLES.sizes[size], TEXTAREA_STYLES.variants[error ? 'error' : variant], TEXTAREA_STYLES.resize[resize], autoResize && 'overflow-hidden', className);
    const handleChange = (event)=>{
        const newValue = event.target.value;
        // maxLength 체크
        if (maxLength && newValue.length > maxLength) {
            return;
        }
        setCharCount(newValue.length);
        if (onChange) {
            onChange(event);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('TEXTAREA', 'Value changed', {
                length: newValue.length,
                maxLength,
                autoResize
            });
        }
        // 자동 리사이즈
        if (autoResize && textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };
    const handleFocus = (event)=>{
        setFocused(true);
        onFocus?.(event);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('TEXTAREA', 'Focused');
    };
    const handleBlur = (event)=>{
        setFocused(false);
        onBlur?.(event);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('TEXTAREA', 'Blurred');
    };
    const labelId = label ? `textarea-label-${Math.random().toString(36).substr(2, 9)}` : undefined;
    const errorId = error ? `textarea-error-${Math.random().toString(36).substr(2, 9)}` : undefined;
    const helperId = helperText ? `textarea-helper-${Math.random().toString(36).substr(2, 9)}` : undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                id: labelId,
                htmlFor: props.id,
                className: "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2",
                children: [
                    label,
                    required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-red-500 ml-1",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/ui/Textarea.tsx",
                        lineNumber: 157,
                        columnNumber: 26
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/ui/Textarea.tsx",
                lineNumber: 151,
                columnNumber: 11
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        ref: textareaRef,
                        className: textareaClassName,
                        disabled: disabled,
                        value: value,
                        onChange: handleChange,
                        onFocus: handleFocus,
                        onBlur: handleBlur,
                        maxLength: maxLength,
                        "aria-labelledby": labelId,
                        "aria-describedby": cn(errorId && errorId, helperId && helperId) || undefined,
                        "aria-invalid": !!error,
                        "aria-required": required,
                        ...props
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/ui/Textarea.tsx",
                        lineNumber: 163,
                        columnNumber: 11
                    }, this),
                    (showCount || maxLength) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-2 right-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-1 rounded",
                        children: [
                            charCount,
                            maxLength && `/${maxLength}`
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/ui/Textarea.tsx",
                        lineNumber: 184,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/ui/Textarea.tsx",
                lineNumber: 162,
                columnNumber: 9
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: errorId,
                className: "mt-2 text-sm text-red-600 dark:text-red-400",
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/ui/Textarea.tsx",
                lineNumber: 192,
                columnNumber: 11
            }, this),
            helperText && !error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: helperId,
                className: "mt-2 text-sm text-slate-500 dark:text-slate-400",
                children: helperText
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/ui/Textarea.tsx",
                lineNumber: 203,
                columnNumber: 11
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/ui/Textarea.tsx",
        lineNumber: 148,
        columnNumber: 7
    }, this);
}, "Z933uNcC4alteb1LdSmieEFESKA=")), "Z933uNcC4alteb1LdSmieEFESKA=");
_c1 = Textarea;
Textarea.displayName = 'Textarea';
var _c, _c1;
__turbopack_context__.k.register(_c, "Textarea$forwardRef");
__turbopack_context__.k.register(_c1, "Textarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/ui/ProgressBar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ProgressBar": (()=>ProgressBar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const PROGRESS_STYLES = {
    container: 'w-full bg-gray-200 rounded-full overflow-hidden',
    bar: 'h-full transition-all duration-500 ease-out rounded-full',
    colors: {
        blue: 'bg-blue-600',
        green: 'bg-green-600',
        purple: 'bg-purple-600',
        orange: 'bg-orange-600',
        red: 'bg-red-600'
    },
    sizes: {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4'
    },
    animated: 'bg-gradient-to-r bg-[length:200%_100%] animate-shimmer',
    label: 'text-sm font-medium text-gray-700 mb-2'
};
function ProgressBar({ value, color = 'blue', size = 'md', showLabel = false, label, animated = false, className, 'aria-label': ariaLabel }) {
    // 🔥 기가차드 규칙: 입력값 검증
    const clampedValue = Math.max(0, Math.min(100, value));
    const containerClassName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(PROGRESS_STYLES.container, PROGRESS_STYLES.sizes[size], className);
    const barClassName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(PROGRESS_STYLES.bar, PROGRESS_STYLES.colors[color], animated && PROGRESS_STYLES.animated);
    const displayLabel = label || `${clampedValue}%`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: [
            showLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: PROGRESS_STYLES.label,
                        children: displayLabel
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/ui/ProgressBar.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-semibold text-gray-900",
                        children: [
                            clampedValue,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/ui/ProgressBar.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/ui/ProgressBar.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: containerClassName,
                role: "progressbar",
                "aria-valuenow": clampedValue,
                "aria-valuemin": 0,
                "aria-valuemax": 100,
                "aria-label": ariaLabel || `Progress: ${clampedValue}%`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: barClassName,
                    style: {
                        width: `${clampedValue}%`
                    },
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/ui/ProgressBar.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/ui/ProgressBar.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/ui/ProgressBar.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_c = ProgressBar;
var _c;
__turbopack_context__.k.register(_c, "ProgressBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/ui/KpiCard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "KpiCard": (()=>KpiCard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수 - 다크모드 완벽 지원
const KPI_STYLES = {
    container: 'p-6 transition-all duration-200',
    header: 'flex items-center justify-between mb-4',
    iconContainer: 'w-10 h-10 rounded-lg flex items-center justify-center',
    iconColors: {
        blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
        orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
        red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    },
    value: 'text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1',
    label: 'text-sm text-slate-600 dark:text-slate-400 mb-2',
    change: 'text-sm font-medium flex items-center gap-1',
    changeColors: {
        increase: 'text-green-600 dark:text-green-400',
        decrease: 'text-red-600 dark:text-red-400',
        neutral: 'text-slate-500 dark:text-slate-400'
    }
};
function KpiCard({ title, value, icon: Icon, change, color = 'blue', className, onClick }) {
    const isClickable = Boolean(onClick);
    const containerClassName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(KPI_STYLES.container, isClickable && 'cursor-pointer hover:shadow-md', className);
    const formatValue = (val)=>{
        if (typeof val === 'number') {
            return val.toLocaleString();
        }
        return val;
    };
    const formatChange = (changeValue)=>{
        const sign = changeValue > 0 ? '+' : '';
        return `${sign}${changeValue}%`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        variant: "default",
        padding: "sm",
        className: containerClassName,
        onClick: onClick,
        hoverable: isClickable,
        role: isClickable ? 'button' : undefined,
        "aria-label": isClickable ? `${title} 상세 보기` : undefined,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: KPI_STYLES.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(KPI_STYLES.iconContainer, KPI_STYLES.iconColors[color]),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            className: "w-5 h-5",
                            "aria-hidden": "true"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/ui/KpiCard.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/ui/KpiCard.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    change && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(KPI_STYLES.change, KPI_STYLES.changeColors[change.type]),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: formatChange(change.value)
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/ui/KpiCard.tsx",
                                lineNumber: 90,
                                columnNumber: 13
                            }, this),
                            change.period && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-slate-500 dark:text-slate-400",
                                children: [
                                    "(",
                                    change.period,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/ui/KpiCard.tsx",
                                lineNumber: 91,
                                columnNumber: 31
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/ui/KpiCard.tsx",
                        lineNumber: 89,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/ui/KpiCard.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: KPI_STYLES.value,
                "aria-label": `값: ${formatValue(value)}`,
                children: formatValue(value)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/ui/KpiCard.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: KPI_STYLES.label,
                children: title
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/ui/KpiCard.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/ui/KpiCard.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
_c = KpiCard;
var _c;
__turbopack_context__.k.register(_c, "KpiCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/ui/Toggle.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Toggle": (()=>Toggle)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const TOGGLE_STYLES = {
    container: 'relative inline-flex cursor-pointer items-center',
    track: 'h-6 w-11 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2',
    trackColors: {
        enabled: 'bg-blue-600 focus:ring-blue-500',
        disabled: 'bg-gray-200 focus:ring-gray-500'
    },
    thumb: 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition-transform duration-200 ease-in-out',
    thumbPositions: {
        enabled: 'translate-x-5',
        disabled: 'translate-x-0'
    },
    label: 'ml-3 text-sm font-medium text-gray-700',
    description: 'ml-3 text-sm text-gray-500'
};
function Toggle({ id, checked: controlledChecked, defaultChecked = false, disabled = false, label, description, className, onChange, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy }) {
    _s();
    const [internalChecked, setInternalChecked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultChecked);
    // 🔥 기가차드 규칙: controlled vs uncontrolled 패턴
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : internalChecked;
    const handleToggle = ()=>{
        if (disabled) return;
        const newValue = !checked;
        if (!isControlled) {
            setInternalChecked(newValue);
        }
        onChange?.(newValue);
    };
    const trackClassName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(TOGGLE_STYLES.track, checked ? TOGGLE_STYLES.trackColors.enabled : TOGGLE_STYLES.trackColors.disabled, disabled && 'opacity-50 cursor-not-allowed');
    const thumbClassName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(TOGGLE_STYLES.thumb, checked ? TOGGLE_STYLES.thumbPositions.enabled : TOGGLE_STYLES.thumbPositions.disabled);
    const containerClassName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(TOGGLE_STYLES.container, disabled && 'cursor-not-allowed', className);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: containerClassName,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                id: id,
                role: "switch",
                "aria-checked": checked,
                "aria-label": ariaLabel || label,
                "aria-describedby": ariaDescribedBy,
                disabled: disabled,
                className: trackClassName,
                onClick: handleToggle,
                onKeyDown: (e)=>{
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleToggle();
                    }
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: thumbClassName,
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/ui/Toggle.tsx",
                    lineNumber: 102,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/ui/Toggle.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            (label || description) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col",
                children: [
                    label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: id,
                        className: TOGGLE_STYLES.label,
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/ui/Toggle.tsx",
                        lineNumber: 108,
                        columnNumber: 13
                    }, this),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: TOGGLE_STYLES.description,
                        id: ariaDescribedBy,
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/ui/Toggle.tsx",
                        lineNumber: 113,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/ui/Toggle.tsx",
                lineNumber: 106,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/ui/Toggle.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_s(Toggle, "PNxWJPGqxGHnOH72tjOX5tlwnRE=");
_c = Toggle;
var _c;
__turbopack_context__.k.register(_c, "Toggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/ui/index.ts [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 기가차드 UI 컴포넌트 색인 파일
// Loop 프로젝트의 모든 UI 컴포넌트를 중앙에서 관리
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Tooltip.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$ProgressBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/ProgressBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$KpiCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/KpiCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Toggle.tsx [app-client] (ecmascript)");
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/ui/index.ts [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Tooltip.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$ProgressBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/ProgressBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$KpiCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/KpiCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Toggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/index.ts [app-client] (ecmascript) <locals>");
}}),
"[project]/src/renderer/components/dashboard/QuickStartCard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "QuickStartCard": (()=>QuickStartCard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.mjs [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.mjs [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
;
// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수 - 작가 친화적 다크모드
const QUICK_START_STYLES = {
    container: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm dark:shadow-slate-900/20',
    content: 'text-center py-8 px-6',
    title: 'text-xl font-bold text-slate-900 dark:text-slate-100 mb-2',
    description: 'text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto leading-relaxed',
    actionGrid: 'grid grid-cols-2 gap-3 max-w-sm mx-auto',
    actionButton: 'h-auto py-3 px-4 flex-col gap-2 text-sm hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md dark:hover:shadow-slate-900/30',
    icon: 'w-5 h-5',
    emptyState: 'text-slate-500 dark:text-slate-400 text-sm'
};
function QuickStartCard({ title = '첫 번째 Loop 프로젝트를 시작해보세요', description = '새 프로젝트를 만들거나 기존 프로젝트를 가져와서 타이핑 분석을 시작할 수 있습니다.', onCreateProject, onImportProject, onOpenSample, onViewDocs, showActions = true }) {
    const handleAction = (actionId, callback)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('QUICK_START', `Quick action triggered: ${actionId}`);
        callback?.();
    };
    const quickActions = [
        {
            id: 'create',
            label: '새 프로젝트',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"],
            variant: 'primary',
            onClick: ()=>handleAction('create', onCreateProject),
            ariaLabel: '새 프로젝트 만들기'
        },
        {
            id: 'import',
            label: '프로젝트 가져오기',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"],
            variant: 'secondary',
            onClick: ()=>handleAction('import', onImportProject),
            ariaLabel: '기존 프로젝트 가져오기'
        },
        {
            id: 'sample',
            label: '샘플 열기',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
            variant: 'outline',
            onClick: ()=>handleAction('sample', onOpenSample),
            ariaLabel: '샘플 프로젝트 열기'
        },
        {
            id: 'docs',
            label: '사용법 보기',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
            variant: 'outline',
            onClick: ()=>handleAction('docs', onViewDocs),
            ariaLabel: '사용 가이드 보기'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: QUICK_START_STYLES.container,
        role: "region",
        "aria-label": "빠른 시작",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: QUICK_START_STYLES.content,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: QUICK_START_STYLES.title,
                    children: title
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/dashboard/QuickStartCard.tsx",
                    lineNumber: 94,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: QUICK_START_STYLES.description,
                    children: description
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/dashboard/QuickStartCard.tsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, this),
                showActions ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: QUICK_START_STYLES.actionGrid,
                    children: quickActions.map((action)=>{
                        const Icon = action.icon;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: action.variant,
                            className: QUICK_START_STYLES.actionButton,
                            onClick: action.onClick,
                            "aria-label": action.ariaLabel,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    className: QUICK_START_STYLES.icon,
                                    "aria-hidden": "true"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/dashboard/QuickStartCard.tsx",
                                    lineNumber: 109,
                                    columnNumber: 19
                                }, this),
                                action.label
                            ]
                        }, action.id, true, {
                            fileName: "[project]/src/renderer/components/dashboard/QuickStartCard.tsx",
                            lineNumber: 102,
                            columnNumber: 17
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/dashboard/QuickStartCard.tsx",
                    lineNumber: 98,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: QUICK_START_STYLES.emptyState,
                    children: "아직 프로젝트가 없습니다."
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/dashboard/QuickStartCard.tsx",
                    lineNumber: 116,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/renderer/components/dashboard/QuickStartCard.tsx",
            lineNumber: 93,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/dashboard/QuickStartCard.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
_c = QuickStartCard;
var _c;
__turbopack_context__.k.register(_c, "QuickStartCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "MonitoringControlPanel": (()=>MonitoringControlPanel)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.mjs [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square.mjs [app-client] (ecmascript) <export default as Square>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/alert-circle.mjs [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/index.ts [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$contexts$2f$GlobalMonitoringContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/contexts/GlobalMonitoringContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// 🔥 작가 친화적 모니터링 패널 스타일 - 다크모드 완벽 지원
const MONITORING_STYLES = {
    container: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-sm',
    header: 'flex items-center justify-between mb-6',
    status: 'flex items-center gap-3',
    pulse: 'w-3 h-3 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse shadow-sm',
    title: 'text-xl font-medium text-slate-900 dark:text-slate-100 tracking-wide',
    time: 'font-mono text-xl font-medium text-slate-900 dark:text-slate-100 tracking-wider',
    stats: 'grid grid-cols-3 gap-8 text-center mb-8',
    statValue: 'text-3xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight',
    statLabel: 'text-slate-600 dark:text-slate-400 text-sm font-medium tracking-wide mt-1',
    controls: 'flex items-center gap-4',
    button: 'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 border',
    startButton: 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white shadow-sm hover:shadow-md',
    stopButton: 'bg-red-600 hover:bg-red-700 border-red-600 text-white shadow-sm hover:shadow-md',
    aiButton: 'bg-violet-600 hover:bg-violet-700 border-violet-600 text-white shadow-sm hover:shadow-md'
};
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
function MonitoringControlPanelComponent({ className }) {
    _s();
    const { state, startMonitoring, stopMonitoring, toggleAI } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$contexts$2f$GlobalMonitoringContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMonitoring"])();
    const { isMonitoring, isAIOpen, sessionData, startTime } = state;
    // 🔥 경과 시간 계산
    const elapsedTime = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useMemo({
        "MonitoringControlPanelComponent.useMemo[elapsedTime]": ()=>{
            if (!startTime || !isMonitoring) return 0;
            return Math.floor((Date.now() - startTime.getTime()) / 1000);
        }
    }["MonitoringControlPanelComponent.useMemo[elapsedTime]"], [
        startTime,
        isMonitoring
    ]);
    // 🔥 모니터링 시작 핸들러
    const handleStartMonitoring = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MonitoringControlPanelComponent.useCallback[handleStartMonitoring]": async ()=>{
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('MONITORING_CONTROL', 'Starting monitoring...');
                await startMonitoring();
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('MONITORING_CONTROL', 'Failed to start monitoring', error);
            // TODO: 에러 토스트 표시
            }
        }
    }["MonitoringControlPanelComponent.useCallback[handleStartMonitoring]"], [
        startMonitoring
    ]);
    // 🔥 모니터링 중지 핸들러
    const handleStopMonitoring = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MonitoringControlPanelComponent.useCallback[handleStopMonitoring]": async ()=>{
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('MONITORING_CONTROL', 'Stopping monitoring...');
                await stopMonitoring();
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('MONITORING_CONTROL', 'Failed to stop monitoring', error);
            // TODO: 에러 토스트 표시
            }
        }
    }["MonitoringControlPanelComponent.useCallback[handleStopMonitoring]"], [
        stopMonitoring
    ]);
    // 🔥 AI 토글 핸들러
    const handleToggleAI = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MonitoringControlPanelComponent.useCallback[handleToggleAI]": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('MONITORING_CONTROL', 'Toggling AI panel...');
            toggleAI();
        }
    }["MonitoringControlPanelComponent.useCallback[handleToggleAI]"], [
        toggleAI
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${MONITORING_STYLES.container} ${className || ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: MONITORING_STYLES.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: MONITORING_STYLES.status,
                        children: [
                            isMonitoring && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: MONITORING_STYLES.pulse
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                                lineNumber: 80,
                                columnNumber: 28
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: MONITORING_STYLES.title,
                                children: isMonitoring ? '모니터링 중' : '모니터링 대기'
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: MONITORING_STYLES.time,
                        children: formatTime(elapsedTime)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: MONITORING_STYLES.stats,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: MONITORING_STYLES.statValue,
                                children: sessionData.wpm
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: MONITORING_STYLES.statLabel,
                                children: "WPM"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: MONITORING_STYLES.statValue,
                                children: sessionData.words
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                                lineNumber: 97,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: MONITORING_STYLES.statLabel,
                                children: "단어"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: MONITORING_STYLES.statValue,
                                children: formatTime(sessionData.time)
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                                lineNumber: 101,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: MONITORING_STYLES.statLabel,
                                children: "시간"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: MONITORING_STYLES.controls,
                children: [
                    !isMonitoring ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: handleStartMonitoring,
                        className: `${MONITORING_STYLES.button} ${MONITORING_STYLES.startButton}`,
                        disabled: false,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this),
                            "모니터링 시작"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: handleStopMonitoring,
                        className: `${MONITORING_STYLES.button} ${MONITORING_STYLES.stopButton}`,
                        disabled: false,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                                lineNumber: 123,
                                columnNumber: 13
                            }, this),
                            "모니터링 중지"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: handleToggleAI,
                        className: `${MONITORING_STYLES.button} ${MONITORING_STYLES.aiButton}`,
                        disabled: false,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                                lineNumber: 133,
                                columnNumber: 11
                            }, this),
                            isAIOpen ? 'AI 닫기' : 'AI 열기'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_s(MonitoringControlPanelComponent, "bC5XlEU43RGM5sTAhIPRQ7eMLrg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$contexts$2f$GlobalMonitoringContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMonitoring"]
    ];
});
_c = MonitoringControlPanelComponent;
const MonitoringControlPanel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(MonitoringControlPanelComponent);
_c1 = MonitoringControlPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "MonitoringControlPanelComponent");
__turbopack_context__.k.register(_c1, "MonitoringControlPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/ui/Skeleton.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Skeleton": (()=>Skeleton),
    "skeletonAnimations": (()=>skeletonAnimations)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
// 🔥 프리컴파일된 스타일
const SKELETON_STYLES = {
    base: 'animate-pulse bg-slate-200 dark:bg-slate-700 rounded',
    shimmer: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent'
};
function SkeletonComponent({ className = '', width, height, variant = 'rectangle', shimmer = true }) {
    const baseClass = `${SKELETON_STYLES.base} ${shimmer ? SKELETON_STYLES.shimmer : ''}`;
    const variantClasses = {
        rectangle: '',
        circle: 'rounded-full',
        text: 'h-4'
    };
    const style = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${baseClass} ${variantClasses[variant]} ${className}`,
        style: style,
        "aria-hidden": "true"
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/ui/Skeleton.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_c = SkeletonComponent;
const Skeleton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(SkeletonComponent);
_c1 = Skeleton;
const skeletonAnimations = {
    shimmer: {
        '0%': {
            transform: 'translateX(-100%)'
        },
        '100%': {
            transform: 'translateX(100%)'
        }
    }
};
var _c, _c1;
__turbopack_context__.k.register(_c, "SkeletonComponent");
__turbopack_context__.k.register(_c1, "Skeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "DashboardSkeleton": (()=>DashboardSkeleton)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Skeleton.tsx [app-client] (ecmascript)");
'use client';
;
;
;
// 🔥 로딩 스켈레톤 컴포넌트들 - 성능 최적화
const KpiCardSkeleton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-4 w-20"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                        lineNumber: 10,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-5 w-5 rounded"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                        lineNumber: 11,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                lineNumber: 9,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                className: "h-8 w-16 mb-2"
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                lineNumber: 13,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                className: "h-3 w-24"
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                lineNumber: 14,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
        lineNumber: 8,
        columnNumber: 3
    }, this));
_c = KpiCardSkeleton;
KpiCardSkeleton.displayName = 'KpiCardSkeleton';
const ProjectCardSkeleton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-5 w-32"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                        lineNumber: 23,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-4 w-12"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                        lineNumber: 24,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                lineNumber: 22,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                className: "h-2 w-full mb-2"
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                lineNumber: 26,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-3 w-16"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                        lineNumber: 28,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-3 w-20"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                        lineNumber: 29,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                lineNumber: 27,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
        lineNumber: 21,
        columnNumber: 3
    }, this));
_c1 = ProjectCardSkeleton;
ProjectCardSkeleton.displayName = 'ProjectCardSkeleton';
const FileItemSkeleton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                className: "h-4 w-4 mr-3"
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                lineNumber: 38,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-4 w-32 mb-1"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                        lineNumber: 40,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-3 w-20"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                        lineNumber: 41,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                lineNumber: 39,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-right",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-3 w-16 mb-1"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                        lineNumber: 44,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-3 w-12"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                        lineNumber: 45,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                lineNumber: 43,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
        lineNumber: 37,
        columnNumber: 3
    }, this));
_c2 = FileItemSkeleton;
FileItemSkeleton.displayName = 'FileItemSkeleton';
function DashboardSkeletonComponent({ showKpi = true, showProjects = true, showRecentFiles = true }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            showKpi && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
                children: Array.from({
                    length: 4
                }).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KpiCardSkeleton, {}, index, false, {
                        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                        lineNumber: 69,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                children: [
                    showProjects && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                className: "h-6 w-32 mb-4"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                                lineNumber: 78,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: Array.from({
                                    length: 3
                                }).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProjectCardSkeleton, {}, index, false, {
                                        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                                        lineNumber: 81,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this),
                    showRecentFiles && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                className: "h-6 w-32 mb-4"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                                lineNumber: 90,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: Array.from({
                                    length: 3
                                }).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FileItemSkeleton, {}, index, false, {
                                        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                                        lineNumber: 93,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                                lineNumber: 91,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                        lineNumber: 89,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
_c3 = DashboardSkeletonComponent;
const DashboardSkeleton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(DashboardSkeletonComponent);
_c4 = DashboardSkeleton;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "KpiCardSkeleton");
__turbopack_context__.k.register(_c1, "ProjectCardSkeleton");
__turbopack_context__.k.register(_c2, "FileItemSkeleton");
__turbopack_context__.k.register(_c3, "DashboardSkeletonComponent");
__turbopack_context__.k.register(_c4, "DashboardSkeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/utils/electronCheck.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 Electron 환경 감지 유틸리티
/**
 * 현재 환경이 Electron인지 확인
 */ __turbopack_context__.s({
    "getBrowserFallbackMessage": (()=>getBrowserFallbackMessage),
    "isElectronEnvironment": (()=>isElectronEnvironment),
    "waitForElectronAPI": (()=>waitForElectronAPI)
});
function isElectronEnvironment() {
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    // User agent 체크
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('electron')) return true;
    // process 객체 체크 (Node.js 환경)
    if (typeof window.process === 'object' && window.process.type === 'renderer') {
        return true;
    }
    // electronAPI 존재 체크
    if (window.electronAPI) return true;
    return false;
}
function waitForElectronAPI(timeout = 5000) {
    return new Promise((resolve)=>{
        if (window.electronAPI) {
            resolve(true);
            return;
        }
        let attempts = 0;
        const maxAttempts = timeout / 100;
        const checkInterval = setInterval(()=>{
            attempts++;
            if (window.electronAPI) {
                clearInterval(checkInterval);
                resolve(true);
                return;
            }
            if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                resolve(false);
                return;
            }
        }, 100);
    });
}
function getBrowserFallbackMessage() {
    return `
🌐 브라우저 환경에서 접근 중입니다.
Electron 앱의 모든 기능을 사용하려면 다음 중 하나를 선택하세요:

1. Electron 앱 실행: pnpm dev
2. 브라우저 미리보기용 제한 모드로 계속 사용

현재 URL: ${window.location.href}
User Agent: ${navigator.userAgent}
`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/dashboard/DashboardMain.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "DashboardMain": (()=>DashboardMain)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// 이거 씀
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/target.mjs [app-client] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.mjs [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.mjs [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Folder$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder.mjs [app-client] (ecmascript) <export default as Folder>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-square.mjs [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/index.ts [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$ProgressBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/ProgressBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$KpiCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/KpiCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$dashboard$2f$QuickStartCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/dashboard/QuickStartCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$dashboard$2f$MonitoringControlPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/dashboard/MonitoringControlPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$dashboard$2f$DashboardSkeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/dashboard/DashboardSkeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$HydrationGuard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/HydrationGuard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$utils$2f$electronCheck$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/utils/electronCheck.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$contexts$2f$GlobalMonitoringContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/contexts/GlobalMonitoringContext.tsx [app-client] (ecmascript)");
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
// 🔥 작가 친화적 스타일 상수 - 미니멀하고 집중할 수 있는 디자인
const DASHBOARD_STYLES = {
    container: 'flex-1 flex flex-col min-h-screen',
    header: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 p-8',
    headerContent: 'max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6',
    headerTitle: 'text-3xl font-light text-slate-900 dark:text-slate-100 tracking-tight',
    headerSubtitle: 'text-slate-600 dark:text-slate-400 mt-2 text-lg leading-relaxed',
    headerActions: 'flex items-center gap-4',
    content: 'flex-1 overflow-y-auto p-8 max-w-6xl mx-auto w-full space-y-8',
    // 🔥 작가 친화적 모니터링 패널 - 차분한 색상
    monitoringPanel: 'bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black text-white p-8 rounded-2xl shadow-sm border border-slate-200/20',
    monitoringHeader: 'flex items-center justify-between mb-6',
    monitoringStatus: 'flex items-center gap-3',
    monitoringPulse: 'w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-sm',
    monitoringTitle: 'text-xl font-light tracking-wide',
    monitoringTime: 'font-mono text-xl font-light tracking-wider',
    monitoringStats: 'grid grid-cols-3 gap-8 text-center',
    statValue: 'text-3xl font-light tracking-tight',
    statLabel: 'text-slate-300 text-sm font-medium tracking-wide mt-1',
    // 🔥 작가 친화적 카드 디자인 - 최소한의 장식
    quickActions: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
    quickActionCard: 'bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 p-6 rounded-xl hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 group min-h-[140px] flex flex-col justify-between',
    quickActionIcon: 'w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors',
    quickActionTitle: 'font-medium text-slate-900 dark:text-slate-100 mt-3 mb-2 tracking-tight',
    quickActionDesc: 'text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3',
    quickActionStatus: 'text-xs font-medium text-slate-500 dark:text-slate-500',
    mainGrid: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
    projectList: 'space-y-4',
    projectItem: 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-lg',
    projectHeader: 'flex items-center justify-between mb-3',
    projectTitle: 'font-semibold text-slate-900 dark:text-slate-100',
    projectProgress: 'mb-2',
    projectStats: 'flex justify-between items-center',
    progressText: 'text-sm font-medium text-slate-700 dark:text-slate-300',
    progressGoal: 'text-xs text-slate-500 dark:text-slate-400',
    recentFiles: 'space-y-2',
    fileItem: 'flex items-center p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors',
    fileIcon: 'w-4 h-4 text-slate-600 dark:text-slate-400 mr-3 flex-shrink-0',
    fileInfo: 'flex-1 min-w-0',
    fileName: 'font-medium text-slate-900 dark:text-slate-100 text-sm truncate',
    fileProject: 'text-xs text-slate-500 dark:text-slate-400',
    fileMeta: 'text-right flex-shrink-0',
    fileTime: 'text-xs font-medium text-slate-700 dark:text-slate-300',
    fileStatus: 'text-xs text-green-600 dark:text-green-400'
};
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
function DashboardMain() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])(); // 🔥 Navigation 훅 추가
    // 🔥 글로벌 모니터링 상태 사용
    const { state, startMonitoring, stopMonitoring, toggleAI, updateSessionData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$contexts$2f$GlobalMonitoringContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMonitoring"])();
    const { isMonitoring, isAIOpen, sessionData } = state;
    // 🔥 기가차드 규칙: 실제 데이터 상태 관리 - 더미 데이터 제거
    const [monitoringData, setMonitoringData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        wpm: 0,
        words: 0,
        time: 0
    });
    const [projects, setProjects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [recentFiles, setRecentFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // 🔥 로딩 상태 최적화 - 개별 로딩 상태 관리
    const [loadingStates, setLoadingStates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        kpi: true,
        projects: true,
        recentFiles: true
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [kpiData, setKpiData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            title: '오늘 작성',
            value: '0',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"],
            color: 'blue',
            change: {
                value: 0,
                type: 'neutral',
                period: '단어'
            }
        },
        {
            title: '이번 주',
            value: '0',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"],
            color: 'green',
            change: {
                value: 0,
                type: 'neutral',
                period: '세션'
            }
        },
        {
            title: '평균 속도',
            value: '0 WPM',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
            color: 'purple',
            change: {
                value: 0,
                type: 'neutral',
                period: '어제 대비'
            }
        },
        {
            title: '활성 프로젝트',
            value: '0',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Folder$3e$__["Folder"],
            color: 'orange',
            change: {
                value: 0,
                type: 'neutral',
                period: '개'
            }
        }
    ]);
    // 🔥 대시보드 데이터 로딩 - 메모화로 성능 최적화
    const loadDashboardData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DashboardMain.useCallback[loadDashboardData]": async ()=>{
            try {
                // 🔐 환경 감지: 브라우저 환경에서는 Electron API 호출 금지
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$utils$2f$electronCheck$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isElectronEnvironment"])()) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('DASHBOARD', '🌐 Browser environment detected. Using fallback empty state.');
                    // 로딩 상태 해제 및 빈 상태로 표시
                    setLoadingStates({
                        kpi: false,
                        projects: false,
                        recentFiles: false
                    });
                    setProjects([]);
                    setRecentFiles([]);
                    return;
                }
                // 🔄 Electron API 로드 대기 (최대 3초)
                const apiReady = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$utils$2f$electronCheck$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waitForElectronAPI"])(3000);
                if (!apiReady) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('DASHBOARD', '❌ ElectronAPI not ready');
                    setLoadingStates({
                        kpi: false,
                        projects: false,
                        recentFiles: false
                    });
                    return;
                }
                // 🔥 기가차드 규칙: 타입 안전한 IPC 통신 - 병렬 처리
                const [dashboardStatsResult, projectsResult, recentSessionsResult] = await Promise.allSettled([
                    window.electronAPI.dashboard.getStats(),
                    window.electronAPI.projects.getAll(),
                    window.electronAPI.dashboard.getRecentSessions()
                ]);
                // 🔥 대시보드 통계 업데이트
                if (dashboardStatsResult.status === 'fulfilled' && dashboardStatsResult.value.success) {
                    const stats = dashboardStatsResult.value.data;
                    updateKpiData(stats);
                    setLoadingStates({
                        "DashboardMain.useCallback[loadDashboardData]": (prev)=>({
                                ...prev,
                                kpi: false
                            })
                    }["DashboardMain.useCallback[loadDashboardData]"]);
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('DASHBOARD', '✅ Dashboard stats loaded', stats);
                } else {
                    // 백엔드에서 데이터를 가져올 수 없는 경우 기본값 사용
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('DASHBOARD', '⚠️ Dashboard stats not available, using defaults');
                    setLoadingStates({
                        "DashboardMain.useCallback[loadDashboardData]": (prev)=>({
                                ...prev,
                                kpi: false
                            })
                    }["DashboardMain.useCallback[loadDashboardData]"]);
                }
                // 🔥 프로젝트 데이터 업데이트
                if (projectsResult.status === 'fulfilled' && projectsResult.value.success) {
                    const projectsData = projectsResult.value.data || [];
                    setProjects(projectsData.map({
                        "DashboardMain.useCallback[loadDashboardData]": (p)=>({
                                id: p.id || '',
                                title: p.title || '제목 없음',
                                status: p.status || 'draft',
                                progress: p.progress || 0,
                                goal: p.dueDate ? new Date(p.dueDate).toLocaleDateString() : '목표 미설정'
                            })
                    }["DashboardMain.useCallback[loadDashboardData]"]));
                    setLoadingStates({
                        "DashboardMain.useCallback[loadDashboardData]": (prev)=>({
                                ...prev,
                                projects: false
                            })
                    }["DashboardMain.useCallback[loadDashboardData]"]);
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('DASHBOARD', '✅ Projects loaded', {
                        count: projectsData.length
                    });
                } else {
                    // 프로젝트 데이터가 없는 경우
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('DASHBOARD', '⚠️ Projects not available, using empty state');
                    setProjects([]);
                    setLoadingStates({
                        "DashboardMain.useCallback[loadDashboardData]": (prev)=>({
                                ...prev,
                                projects: false
                            })
                    }["DashboardMain.useCallback[loadDashboardData]"]);
                }
                // 🔥 최근 세션 데이터를 파일 형태로 변환
                if (recentSessionsResult.status === 'fulfilled' && recentSessionsResult.value.success) {
                    const sessions = recentSessionsResult.value.data || [];
                    setRecentFiles(sessions.slice(0, 3).map({
                        "DashboardMain.useCallback[loadDashboardData]": (session, index)=>({
                                id: session.id || `session-${index}`,
                                name: `session-${new Date(session.startTime).toLocaleDateString()}.md`,
                                project: session.windowTitle || '알 수 없는 앱',
                                time: formatTimeAgo(session.endTime || session.startTime),
                                status: '완료'
                            })
                    }["DashboardMain.useCallback[loadDashboardData]"]));
                    setLoadingStates({
                        "DashboardMain.useCallback[loadDashboardData]": (prev)=>({
                                ...prev,
                                recentFiles: false
                            })
                    }["DashboardMain.useCallback[loadDashboardData]"]);
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('DASHBOARD', '✅ Recent sessions loaded', {
                        count: sessions.length
                    });
                } else {
                    // 세션 데이터가 없는 경우
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('DASHBOARD', '⚠️ Recent sessions not available, using empty state');
                    setRecentFiles([]);
                    setLoadingStates({
                        "DashboardMain.useCallback[loadDashboardData]": (prev)=>({
                                ...prev,
                                recentFiles: false
                            })
                    }["DashboardMain.useCallback[loadDashboardData]"]);
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('DASHBOARD', '❌ Failed to load dashboard data', error);
            }
        }
    }["DashboardMain.useCallback[loadDashboardData]"], []);
    // 🔥 대시보드 데이터 로딩 - 성능 최적화
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "DashboardMain.useEffect": ()=>{
            loadDashboardData();
            // 🔥 실시간 업데이트 (30초마다로 변경 - 성능 최적화)
            const interval = setInterval(loadDashboardData, 30000);
            return ({
                "DashboardMain.useEffect": ()=>clearInterval(interval)
            })["DashboardMain.useEffect"];
        }
    }["DashboardMain.useEffect"], [
        loadDashboardData
    ]);
    /**
   * 🔥 변화율 타입 결정 헬퍼 함수
   */ const getChangeType = (value)=>{
        if (value > 0) return 'increase';
        if (value < 0) return 'decrease';
        return 'neutral';
    };
    /**
   * 🔥 KPI 데이터 업데이트
   */ const updateKpiData = (stats)=>{
        setKpiData([
            {
                title: '오늘 작성',
                value: (stats?.todayWords || 0).toLocaleString(),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"],
                color: 'blue',
                change: {
                    value: Math.max(0, stats?.dailyGrowth || 0),
                    type: getChangeType(stats?.dailyGrowth || 0),
                    period: '%'
                }
            },
            {
                title: '이번 주',
                value: (stats?.weekWords || 0).toLocaleString(),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"],
                color: 'green',
                change: {
                    value: Math.max(0, stats?.weeklyGrowth || 0),
                    type: getChangeType(stats?.weeklyGrowth || 0),
                    period: '%'
                }
            },
            {
                title: '평균 속도',
                value: `${Math.round(stats?.avgWpm || 0)} WPM`,
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
                color: 'purple',
                change: {
                    value: Math.max(0, stats?.wpmImprovement || 0),
                    type: getChangeType(stats?.wpmImprovement || 0),
                    period: '%'
                }
            },
            {
                title: '활성 프로젝트',
                value: (stats?.activeProjects || 0).toString(),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Folder$3e$__["Folder"],
                color: 'orange',
                change: {
                    value: Math.max(0, stats?.projectGrowth || 0),
                    type: getChangeType(stats?.projectGrowth || 0),
                    period: '개'
                }
            }
        ]);
    };
    /**
   * 🔥 시간 경과 표시 헬퍼
   */ const formatTimeAgo = (dateString)=>{
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        if (diffMins < 1) return '방금 전';
        if (diffMins < 60) return `${diffMins}분 전`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}시간 전`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}일 전`;
    };
    const handleToggleMonitoring = async ()=>{
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('DASHBOARD', `Monitoring ${!isMonitoring ? 'start' : 'stop'} requested`);
            if (!isMonitoring) {
                // 모니터링 시작
                await startMonitoring();
            } else {
                // 모니터링 중지
                await stopMonitoring();
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('DASHBOARD', 'Error toggling monitoring', error);
        }
    };
    const handleAIToggle = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('DASHBOARD', `AI Panel ${!isAIOpen ? 'opened' : 'closed'}`);
        toggleAI();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: DASHBOARD_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: DASHBOARD_STYLES.header,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: DASHBOARD_STYLES.headerContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: DASHBOARD_STYLES.headerTitle,
                                    children: "대시보드"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                    lineNumber: 385,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: DASHBOARD_STYLES.headerSubtitle,
                                    children: "오늘의 창작을 시작하세요"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                    lineNumber: 386,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                            lineNumber: 384,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: DASHBOARD_STYLES.headerActions,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$HydrationGuard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HydrationGuard"], {
                                fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    className: "gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                            lineNumber: 395,
                                            columnNumber: 17
                                        }, void 0),
                                        "Loop AI"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                    lineNumber: 391,
                                    columnNumber: 15
                                }, void 0),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: handleAIToggle,
                                    variant: isAIOpen ? 'primary' : 'outline',
                                    className: "gap-2",
                                    "aria-pressed": isAIOpen,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                            lineNumber: 405,
                                            columnNumber: 17
                                        }, this),
                                        "Loop AI"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                    lineNumber: 399,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                lineNumber: 390,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                            lineNumber: 389,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                    lineNumber: 383,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                lineNumber: 382,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: DASHBOARD_STYLES.content,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$dashboard$2f$MonitoringControlPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MonitoringControlPanel"], {}, void 0, false, {
                        fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                        lineNumber: 416,
                        columnNumber: 9
                    }, this),
                    loadingStates.kpi ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$dashboard$2f$DashboardSkeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DashboardSkeleton"], {
                        showKpi: true,
                        showProjects: false,
                        showRecentFiles: false
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                        lineNumber: 420,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
                        children: kpiData.map((kpi, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$KpiCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KpiCard"], {
                                ...kpi
                            }, index, false, {
                                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                lineNumber: 424,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                        lineNumber: 422,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$dashboard$2f$QuickStartCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuickStartCard"], {
                        onCreateProject: async ()=>{
                            try {
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('DASHBOARD', '🚀 Creating new project from dashboard');
                                // 🔥 프로젝트 페이지로 이동하여 새 프로젝트 생성 플로우 시작
                                router.push('/projects?create=true');
                            } catch (error) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('DASHBOARD', 'Failed to navigate to project creation', error);
                            }
                        },
                        onImportProject: async ()=>{
                            try {
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('DASHBOARD', 'Importing project from quick start');
                                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$utils$2f$electronCheck$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isElectronEnvironment"])() || !window.electronAPI?.projects?.importFile) {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('DASHBOARD', '🌐 Cannot import project in browser environment');
                                    return;
                                }
                                const result = await window.electronAPI.projects.importFile();
                                if (result.success) {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('DASHBOARD', 'Project import initiated');
                                }
                            } catch (error) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('DASHBOARD', 'Failed to import project', error);
                            }
                        },
                        onOpenSample: async ()=>{
                            try {
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('DASHBOARD', 'Opening sample project');
                                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$utils$2f$electronCheck$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isElectronEnvironment"])() || !window.electronAPI?.projects?.createSample) {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('DASHBOARD', '🌐 Cannot open sample project in browser environment');
                                    return;
                                }
                                const result = await window.electronAPI.projects.createSample();
                                if (result.success) {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('DASHBOARD', 'Sample project opened');
                                    // 프로젝트 목록 새로고침
                                    loadDashboardData();
                                }
                            } catch (error) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('DASHBOARD', 'Failed to open sample project', error);
                            }
                        },
                        onViewDocs: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('DASHBOARD', 'View documentation');
                        // TODO: 문서 페이지로 이동 또는 외부 링크 열기
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                        lineNumber: 430,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: DASHBOARD_STYLES.mainGrid,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                                className: "w-5 h-5 text-blue-600 dark:text-blue-400"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                lineNumber: 483,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-slate-900 dark:text-slate-100",
                                                children: "활성 프로젝트"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                lineNumber: 484,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                        lineNumber: 482,
                                        columnNumber: 13
                                    }, this),
                                    loadingStates.projects ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$dashboard$2f$DashboardSkeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DashboardSkeleton"], {
                                        showKpi: false,
                                        showProjects: true,
                                        showRecentFiles: false
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                        lineNumber: 488,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: DASHBOARD_STYLES.projectList,
                                        children: projects.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center py-8 text-slate-500 dark:text-slate-400",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                                    className: "w-12 h-12 mx-auto mb-3 opacity-50"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                    lineNumber: 493,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: "아직 프로젝트가 없습니다"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                    lineNumber: 494,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: "새 프로젝트를 만들어보세요!"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                    lineNumber: 495,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                            lineNumber: 492,
                                            columnNumber: 19
                                        }, this) : projects.map((project)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `${DASHBOARD_STYLES.projectItem} ${project.status === 'active' ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' : ''}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: DASHBOARD_STYLES.projectHeader,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: DASHBOARD_STYLES.projectTitle,
                                                                children: project.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                                lineNumber: 508,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                variant: project.status === 'active' ? 'primary' : 'default',
                                                                size: "sm",
                                                                children: project.status === 'active' ? '진행중' : '초안'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                                lineNumber: 509,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                        lineNumber: 507,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: DASHBOARD_STYLES.projectProgress,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$ProgressBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProgressBar"], {
                                                            value: project.progress,
                                                            color: project.status === 'active' ? 'blue' : 'purple',
                                                            size: "md"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                            lineNumber: 517,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                        lineNumber: 516,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: DASHBOARD_STYLES.projectStats,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: DASHBOARD_STYLES.progressText,
                                                                children: [
                                                                    project.progress,
                                                                    "% 완료"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                                lineNumber: 524,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: DASHBOARD_STYLES.progressGoal,
                                                                children: [
                                                                    "목표: ",
                                                                    project.goal
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                                lineNumber: 527,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                        lineNumber: 523,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, project.id, true, {
                                                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                lineNumber: 499,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                        lineNumber: 490,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                lineNumber: 481,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                className: "w-5 h-5 text-green-600 dark:text-green-400"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                lineNumber: 541,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-slate-900 dark:text-slate-100",
                                                children: "최근 파일"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                lineNumber: 542,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                        lineNumber: 540,
                                        columnNumber: 13
                                    }, this),
                                    loadingStates.recentFiles ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$dashboard$2f$DashboardSkeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DashboardSkeleton"], {
                                        showKpi: false,
                                        showProjects: false,
                                        showRecentFiles: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                        lineNumber: 546,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: DASHBOARD_STYLES.recentFiles,
                                        children: recentFiles.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center py-8 text-slate-500 dark:text-slate-400",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                    className: "w-12 h-12 mx-auto mb-3 opacity-50"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                    lineNumber: 551,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: "최근 작업한 파일이 없습니다"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                    lineNumber: 552,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: "작업을 시작해보세요!"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                    lineNumber: 553,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                            lineNumber: 550,
                                            columnNumber: 19
                                        }, this) : recentFiles.map((file)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: DASHBOARD_STYLES.fileItem,
                                                role: "button",
                                                tabIndex: 0,
                                                onClick: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('DASHBOARD', 'File clicked', {
                                                        file: file.name
                                                    }),
                                                onKeyDown: (e)=>{
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('DASHBOARD', 'File selected', {
                                                            file: file.name
                                                        });
                                                    }
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                        className: DASHBOARD_STYLES.fileIcon
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                        lineNumber: 570,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: DASHBOARD_STYLES.fileInfo,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: DASHBOARD_STYLES.fileName,
                                                                children: file.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                                lineNumber: 572,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: DASHBOARD_STYLES.fileProject,
                                                                children: file.project
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                                lineNumber: 573,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                        lineNumber: 571,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: DASHBOARD_STYLES.fileMeta,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: DASHBOARD_STYLES.fileTime,
                                                                children: file.time
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                                lineNumber: 576,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: DASHBOARD_STYLES.fileStatus,
                                                                children: file.status
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                                lineNumber: 577,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                        lineNumber: 575,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, file.id, true, {
                                                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                                lineNumber: 557,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                        lineNumber: 548,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                                lineNumber: 539,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                        lineNumber: 479,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
                lineNumber: 414,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/dashboard/DashboardMain.tsx",
        lineNumber: 380,
        columnNumber: 5
    }, this);
}
_s(DashboardMain, "DS2uuWqaveAG5uukJZldUPHIUqs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$contexts$2f$GlobalMonitoringContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMonitoring"]
    ];
});
_c = DashboardMain;
var _c;
__turbopack_context__.k.register(_c, "DashboardMain");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/debug/EnvironmentDetector.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 환경 감지 및 디버깅 컴포넌트
__turbopack_context__.s({
    "EnvironmentDetector": (()=>EnvironmentDetector)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const EnvironmentDetector = ()=>{
    _s();
    const [envInfo, setEnvInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [testResults, setTestResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EnvironmentDetector.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) {
                "TURBOPACK unreachable";
            }
            const info = {
                userAgent: navigator.userAgent,
                isElectron: navigator.userAgent.toLowerCase().includes('electron'),
                hasElectronAPI: !!window.electronAPI,
                electronAPIKeys: window.electronAPI ? Object.keys(window.electronAPI) : [],
                currentUrl: window.location.href,
                nodeEnv: ("TURBOPACK compile-time value", "development") || 'unknown',
                isClient: true
            };
            setEnvInfo(info);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('ENV_DETECTOR', '🔍 Environment Information', info);
        }
    }["EnvironmentDetector.useEffect"], []);
    const runIPCTests = async ()=>{
        const results = [];
        try {
            if (!window.electronAPI) {
                results.push({
                    test: 'electronAPI_check',
                    success: false,
                    error: 'window.electronAPI is undefined'
                });
                setTestResults(results);
                return;
            }
            // Test 1: Basic IPC test
            try {
                const basicTest = await window.electronAPI.test.ipc();
                results.push({
                    test: 'basic_ipc',
                    success: true,
                    result: basicTest
                });
            } catch (error) {
                results.push({
                    test: 'basic_ipc',
                    success: false,
                    error: String(error)
                });
            }
            // Test 2: Detailed IPC test
            try {
                const detailedTest = await window.electronAPI.test.ipcDetailed();
                results.push({
                    test: 'detailed_ipc',
                    success: true,
                    result: detailedTest
                });
            } catch (error) {
                results.push({
                    test: 'detailed_ipc',
                    success: false,
                    error: String(error)
                });
            }
            // Test 3: Projects API test
            try {
                const projectsTest = await window.electronAPI.projects.getAll();
                results.push({
                    test: 'projects_api',
                    success: true,
                    result: projectsTest
                });
            } catch (error) {
                results.push({
                    test: 'projects_api',
                    success: false,
                    error: String(error)
                });
            }
        } catch (error) {
            results.push({
                test: 'general_error',
                success: false,
                error: String(error)
            });
        }
        setTestResults(results);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('ENV_DETECTOR', '🧪 IPC Test Results', results);
    };
    if (!envInfo) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 bg-gray-100 rounded",
            children: "Loading environment info..."
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
            lineNumber: 82,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 bg-yellow-50 border border-yellow-200 rounded-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-bold mb-4",
                children: "🔍 Environment Detector"
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "font-semibold mb-2",
                                children: "Environment Info:"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Is Electron:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                                lineNumber: 93,
                                                columnNumber: 16
                                            }, this),
                                            " ",
                                            envInfo.isElectron ? '✅ Yes' : '❌ No'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                        lineNumber: 93,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Has ElectronAPI:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                                lineNumber: 94,
                                                columnNumber: 16
                                            }, this),
                                            " ",
                                            envInfo.hasElectronAPI ? '✅ Yes' : '❌ No'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                        lineNumber: 94,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Current URL:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                                lineNumber: 95,
                                                columnNumber: 16
                                            }, this),
                                            " ",
                                            envInfo.currentUrl
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                        lineNumber: 95,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "NODE_ENV:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                                lineNumber: 96,
                                                columnNumber: 16
                                            }, this),
                                            " ",
                                            envInfo.nodeEnv
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                        lineNumber: 96,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "font-semibold mb-2",
                                children: "ElectronAPI Keys:"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                lineNumber: 101,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm",
                                children: envInfo.electronAPIKeys.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "list-disc list-inside",
                                    children: envInfo.electronAPIKeys.map((key)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: key
                                        }, key, false, {
                                            fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                            lineNumber: 106,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                    lineNumber: 104,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-red-600",
                                    children: "No keys available"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                    lineNumber: 110,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-semibold mb-2",
                        children: "User Agent:"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs bg-gray-100 p-2 rounded font-mono break-all",
                        children: envInfo.userAgent
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: runIPCTests,
                    className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",
                    disabled: !envInfo.hasElectronAPI,
                    children: "🧪 Run IPC Tests"
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                    lineNumber: 124,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this),
            testResults.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-semibold mb-2",
                        children: "Test Results:"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                        lineNumber: 135,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: testResults.map((result, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `p-3 rounded text-sm ${result.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-semibold",
                                        children: [
                                            result.success ? '✅' : '❌',
                                            " ",
                                            result.test
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                        lineNumber: 141,
                                        columnNumber: 17
                                    }, this),
                                    result.success ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                        className: "mt-1 text-xs",
                                        children: JSON.stringify(result.result, null, 2)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                        lineNumber: 145,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-red-700",
                                        children: result.error
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                        lineNumber: 147,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, index, true, {
                                fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                lineNumber: 138,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                lineNumber: 134,
                columnNumber: 9
            }, this),
            !envInfo.hasElectronAPI && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 p-4 bg-red-50 border border-red-200 rounded",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-semibold text-red-800 mb-2",
                        children: "❌ ElectronAPI Not Available"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                        lineNumber: 157,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-700 mb-3",
                        children: "You are running in a browser environment. To use all features, run the Electron app:"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                        lineNumber: 158,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-800 text-green-400 p-3 rounded font-mono text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "$ cd /Users/user/loop/loop"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                lineNumber: 162,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "$ pnpm dev"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                                lineNumber: 163,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                        lineNumber: 161,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
                lineNumber: 156,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/debug/EnvironmentDetector.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
};
_s(EnvironmentDetector, "/TX7MdyzIdRiv6VVirQF3PGd2e0=");
_c = EnvironmentDetector;
var _c;
__turbopack_context__.k.register(_c, "EnvironmentDetector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/debug/IPCTestComponent.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "IPCTestComponent": (()=>IPCTestComponent)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function IPCTestComponent() {
    _s();
    const [testResult, setTestResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [detailedResult, setDetailedResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const testBasicIPC = async ()=>{
        setIsLoading(true);
        try {
            if ("object" !== 'undefined' && window.electronAPI?.test?.ipc) {
                const result = await window.electronAPI.test.ipc();
                setTestResult(result);
                console.log('✅ Basic IPC test successful:', result);
            } else {
                setTestResult({
                    status: 'error',
                    timestamp: Date.now(),
                    error: 'electronAPI.test.ipc is not available'
                });
                console.error('❌ electronAPI.test.ipc is not available');
            }
        } catch (error) {
            const errorResult = {
                status: 'error',
                timestamp: Date.now(),
                error: error instanceof Error ? error.message : String(error)
            };
            setTestResult(errorResult);
            console.error('❌ Basic IPC test failed:', error);
        }
        setIsLoading(false);
    };
    const testDetailedIPC = async ()=>{
        setIsLoading(true);
        try {
            if ("object" !== 'undefined' && window.electronAPI?.test?.ipcDetailed) {
                const result = await window.electronAPI.test.ipcDetailed();
                setDetailedResult(result);
                console.log('✅ Detailed IPC test successful:', result);
            } else {
                setDetailedResult({
                    status: 'error',
                    timestamp: Date.now(),
                    error: 'electronAPI.test.ipcDetailed is not available'
                });
                console.error('❌ electronAPI.test.ipcDetailed is not available');
            }
        } catch (error) {
            const errorResult = {
                status: 'error',
                timestamp: Date.now(),
                error: error instanceof Error ? error.message : String(error)
            };
            setDetailedResult(errorResult);
            console.error('❌ Detailed IPC test failed:', error);
        }
        setIsLoading(false);
    };
    const testAIConnection = async ()=>{
        setIsLoading(true);
        try {
            if ("object" !== 'undefined' && window.electronAPI?.ai?.healthCheck) {
                const result = await window.electronAPI.ai.healthCheck();
                console.log('✅ AI health check result:', result);
            } else {
                console.error('❌ electronAPI.ai.healthCheck is not available');
            }
        } catch (error) {
            console.error('❌ AI health check failed:', error);
        }
        setIsLoading(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 bg-white rounded-lg shadow-lg space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-xl font-bold text-gray-800",
                children: "🔧 IPC 통신 테스트"
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/debug/IPCTestComponent.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: testBasicIPC,
                        disabled: isLoading,
                        className: "w-full",
                        children: isLoading ? '테스트 중...' : '기본 IPC 테스트'
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/debug/IPCTestComponent.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: testDetailedIPC,
                        disabled: isLoading,
                        className: "w-full",
                        children: isLoading ? '테스트 중...' : '상세 IPC 테스트'
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/debug/IPCTestComponent.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: testAIConnection,
                        disabled: isLoading,
                        className: "w-full",
                        children: isLoading ? '테스트 중...' : 'AI 연결 테스트'
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/debug/IPCTestComponent.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/debug/IPCTestComponent.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            testResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 p-3 bg-gray-100 rounded",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold text-gray-700",
                        children: "기본 IPC 결과:"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/debug/IPCTestComponent.tsx",
                        lineNumber: 125,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                        className: "text-sm text-gray-600 mt-1",
                        children: JSON.stringify(testResult, null, 2)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/debug/IPCTestComponent.tsx",
                        lineNumber: 126,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/debug/IPCTestComponent.tsx",
                lineNumber: 124,
                columnNumber: 9
            }, this),
            detailedResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 p-3 bg-gray-100 rounded",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold text-gray-700",
                        children: "상세 IPC 결과:"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/debug/IPCTestComponent.tsx",
                        lineNumber: 134,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                        className: "text-sm text-gray-600 mt-1",
                        children: JSON.stringify(detailedResult, null, 2)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/debug/IPCTestComponent.tsx",
                        lineNumber: 135,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/debug/IPCTestComponent.tsx",
                lineNumber: 133,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/debug/IPCTestComponent.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
_s(IPCTestComponent, "9a4bA/MiHvTUx0Ivw7x7epPz1Ww=");
_c = IPCTestComponent;
var _c;
__turbopack_context__.k.register(_c, "IPCTestComponent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/app/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>DashboardPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$dashboard$2f$DashboardMain$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/dashboard/DashboardMain.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$debug$2f$EnvironmentDetector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/debug/EnvironmentDetector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$debug$2f$IPCTestComponent$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/debug/IPCTestComponent.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
function DashboardPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$debug$2f$EnvironmentDetector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EnvironmentDetector"], {}, void 0, false, {
                        fileName: "[project]/src/renderer/app/page.tsx",
                        lineNumber: 13,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$debug$2f$IPCTestComponent$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IPCTestComponent"], {}, void 0, false, {
                        fileName: "[project]/src/renderer/app/page.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/page.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$dashboard$2f$DashboardMain$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DashboardMain"], {}, void 0, false, {
                fileName: "[project]/src/renderer/app/page.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/page.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_c = DashboardPage;
var _c;
__turbopack_context__.k.register(_c, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_renderer_0aad8b42._.js.map