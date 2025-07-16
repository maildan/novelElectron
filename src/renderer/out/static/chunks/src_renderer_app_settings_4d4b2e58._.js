(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/renderer/app/settings/constants/styles.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ICON_SIZES": (()=>ICON_SIZES),
    "SETTINGS_PAGE_STYLES": (()=>SETTINGS_PAGE_STYLES),
    "SPACING": (()=>SPACING)
});
'use client';
const SETTINGS_PAGE_STYLES = {
    // 메인 컨테이너
    container: 'container mx-auto px-4 py-6 max-w-4xl space-y-6',
    pageTitle: 'text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6',
    // 네비게이션
    nav: 'flex flex-wrap gap-2 mb-6',
    navButton: 'px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
    navButtonActive: 'bg-blue-600 text-white shadow-md',
    navButtonInactive: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
    // 섹션
    section: 'space-y-6',
    sectionCard: 'bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6',
    sectionHeader: 'flex items-center gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700',
    sectionIcon: 'w-6 h-6 text-blue-600 flex-shrink-0',
    sectionTitle: 'text-xl font-semibold text-slate-900 dark:text-slate-100',
    sectionDescription: 'text-sm text-slate-600 dark:text-slate-400 mt-1',
    // 설정 항목
    settingItem: 'space-y-4',
    settingRow: 'flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0 min-h-[60px]',
    settingLabel: 'flex-1 pr-4',
    settingTitle: 'font-medium text-slate-900 dark:text-slate-100 text-base',
    settingDescription: 'text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md',
    settingControl: 'flex items-center gap-3 flex-shrink-0',
    // 입력 필드
    inputGroup: 'space-y-2',
    inputLabel: 'text-sm font-medium text-slate-700 dark:text-slate-300',
    textInput: 'w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors',
    numberInput: 'w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors',
    select: 'px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 min-w-[120px] transition-colors',
    // 체크박스 및 토글
    checkbox: 'w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 transition-colors',
    toggle: 'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer',
    toggleActive: 'bg-blue-600',
    toggleInactive: 'bg-slate-200 dark:bg-slate-600',
    toggleSwitch: 'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm',
    toggleSwitchActive: 'translate-x-6',
    toggleSwitchInactive: 'translate-x-1',
    toggleDisabled: 'opacity-50 cursor-not-allowed',
    // 액션 버튼
    actions: 'flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700',
    button: 'inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    primaryButton: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg focus:ring-blue-500',
    secondaryButton: 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 focus:ring-slate-500',
    dangerButton: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg focus:ring-red-500',
    // 로딩 상태
    loading: 'flex items-center justify-center h-64',
    loadingContent: 'text-center',
    spinner: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4',
    loadingText: 'text-slate-600 dark:text-slate-400',
    loadingContainer: 'flex items-center justify-center h-64',
    loadingSpinner: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4',
    // 에러 상태
    errorContainer: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4',
    errorText: 'text-red-800 dark:text-red-400 text-sm',
    // 성공 상태
    successContainer: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4',
    successText: 'text-green-800 dark:text-green-400 text-sm',
    // 유틸리티
    srOnly: 'sr-only',
    visuallyHidden: 'absolute w-px h-px p-0 -m-px overflow-hidden clip-[rect(0,0,0,0)] whitespace-nowrap border-0'
};
const ICON_SIZES = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
};
const SPACING = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-6'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/app/settings/hooks/useSettings.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useSettings": (()=>useSettings)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useSettings() {
    _s();
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // 🔥 중복 요청 방지를 위한 ref
    const loadingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const savingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    /**
   * 🔥 기본값 정의 (main/settings와 동일)
   */ const defaultSettings = {
        app: {
            theme: 'system',
            language: 'ko',
            autoSave: true,
            startMinimized: false,
            minimizeToTray: true,
            fontSize: 14,
            fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
        },
        keyboard: {
            enabled: true,
            language: 'korean',
            trackAllApps: false,
            sessionTimeout: 30
        },
        ui: {
            windowWidth: 1400,
            windowHeight: 900,
            sidebarCollapsed: false,
            focusMode: false,
            showLineNumbers: true,
            showWordCount: true
        },
        performance: {
            enableGPUAcceleration: true,
            maxCPUUsage: 80,
            maxMemoryUsage: 2048,
            enableHardwareAcceleration: true
        }
    };
    /**
   * 🔥 설정 로드 (중복 방지)
   */ const loadSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettings.useCallback[loadSettings]": async ()=>{
            if (loadingRef.current) return;
            try {
                loadingRef.current = true;
                setLoading(true);
                setError(null);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('USE_SETTINGS', 'Loading settings from main process');
                const result = await window.electronAPI.settings.get('all');
                if (result.success && result.data) {
                    setSettings(result.data);
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('USE_SETTINGS', 'Settings loaded successfully', result.data);
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('USE_SETTINGS', 'Failed to load settings, using defaults', result.error);
                    setSettings(defaultSettings);
                    setError('기본 설정을 사용합니다.');
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('USE_SETTINGS', 'Error loading settings', error);
                setSettings(defaultSettings);
                setError(error instanceof Error ? error.message : '설정 로드 중 오류가 발생했습니다.');
            } finally{
                setLoading(false);
                loadingRef.current = false;
            }
        }
    }["useSettings.useCallback[loadSettings]"], []);
    /**
   * 🔥 설정 업데이트 (타입 안전)
   */ const updateSetting = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettings.useCallback[updateSetting]": async (category, key, value)=>{
            if (!settings || savingRef.current) return;
            try {
                setSaving(true);
                savingRef.current = true;
                // 🔥 즉시 UI 업데이트 (낙관적 업데이트)
                setSettings({
                    "useSettings.useCallback[updateSetting]": (prev)=>{
                        if (!prev) return null;
                        return {
                            ...prev,
                            [category]: {
                                ...prev[category],
                                [key]: value
                            }
                        };
                    }
                }["useSettings.useCallback[updateSetting]"]);
                // 🔥 백엔드에 저장 (dot notation 사용)
                const keyPath = `${category}.${String(key)}`;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('USE_SETTINGS', `Updating setting: ${keyPath}`, {
                    value
                });
                const result = await window.electronAPI.settings.set(keyPath, value);
                if (result.success) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('USE_SETTINGS', `Setting updated successfully: ${keyPath}`, {
                        value
                    });
                    // 🔥 테마 설정의 경우 localStorage에도 즉시 저장 (백업)
                    if (category === 'app' && key === 'theme') {
                        try {
                            localStorage.setItem('loop-theme', value);
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('USE_SETTINGS', 'Theme also saved to localStorage', {
                                theme: value
                            });
                        } catch (error) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('USE_SETTINGS', 'Failed to save theme to localStorage', error);
                        }
                    }
                } else {
                    throw new Error(result.error || `Failed to save ${keyPath}`);
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('USE_SETTINGS', `Error updating setting: ${category}.${String(key)}`, error);
                // 🔥 에러 시 롤백
                await loadSettings();
                setError(`설정 저장 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
            } finally{
                setSaving(false);
                savingRef.current = false;
            }
        }
    }["useSettings.useCallback[updateSetting]"], [
        settings,
        loadSettings
    ]);
    /**
   * 🔥 모든 설정 저장
   */ const saveAllSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettings.useCallback[saveAllSettings]": async ()=>{
            if (!settings || savingRef.current) return;
            try {
                savingRef.current = true;
                setSaving(true);
                setError(null);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('USE_SETTINGS', 'Saving all settings...');
                // 🔥 각 카테고리별로 저장
                for (const [category, categoryData] of Object.entries(settings)){
                    const result = await window.electronAPI.settings.set(category, categoryData);
                    if (!result.success) {
                        throw new Error(`Failed to save ${category} settings: ${result.error}`);
                    }
                }
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('USE_SETTINGS', 'All settings saved successfully');
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('USE_SETTINGS', 'Failed to save all settings', error);
                setError(`전체 설정 저장 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
            } finally{
                setSaving(false);
                savingRef.current = false;
            }
        }
    }["useSettings.useCallback[saveAllSettings]"], [
        settings
    ]);
    /**
   * 🔥 설정 리셋
   */ const resetSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettings.useCallback[resetSettings]": async ()=>{
            if (savingRef.current) return;
            try {
                savingRef.current = true;
                setSaving(true);
                setError(null);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('USE_SETTINGS', 'Resetting all settings...');
                const result = await window.electronAPI.settings.reset();
                if (result.success) {
                    // 🔥 성공 시 기본값으로 설정하고 다시 로드
                    setSettings(defaultSettings);
                    await loadSettings();
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('USE_SETTINGS', 'Settings reset successfully');
                } else {
                    throw new Error(result.error || 'Failed to reset settings');
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('USE_SETTINGS', 'Failed to reset settings', error);
                setError(`설정 초기화 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
            } finally{
                setSaving(false);
                savingRef.current = false;
            }
        }
    }["useSettings.useCallback[resetSettings]"], [
        loadSettings
    ]);
    /**
   * 🔥 초기 설정 로드
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSettings.useEffect": ()=>{
            loadSettings();
        }
    }["useSettings.useEffect"], [
        loadSettings
    ]);
    /**
   * 🔥 에러 자동 클리어 (10초 후)
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSettings.useEffect": ()=>{
            if (error) {
                const timer = setTimeout({
                    "useSettings.useEffect.timer": ()=>{
                        setError(null);
                    }
                }["useSettings.useEffect.timer"], 10000);
                return ({
                    "useSettings.useEffect": ()=>clearTimeout(timer)
                })["useSettings.useEffect"];
            }
        }
    }["useSettings.useEffect"], [
        error
    ]);
    return {
        settings,
        loading,
        saving,
        error,
        updateSetting,
        saveAllSettings,
        resetSettings,
        setSettings
    };
}
_s(useSettings, "p03KuigTSOrrpUgxGjpprgiLJfY=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/app/settings/components/SettingsNavigation.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 기가차드 설정 네비게이션 컴포넌트 - 최적화
__turbopack_context__.s({
    "SettingsNavigation": (()=>SettingsNavigation)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$keyboard$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Keyboard$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/keyboard.mjs [app-client] (ecmascript) <export default as Keyboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/palette.mjs [app-client] (ecmascript) <export default as Palette>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/cpu.mjs [app-client] (ecmascript) <export default as Cpu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
/**
 * 🔥 설정 섹션 메타데이터
 */ const SETTING_SECTIONS = [
    {
        id: 'app',
        label: '앱 설정',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
    },
    {
        id: 'keyboard',
        label: '키보드',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$keyboard$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Keyboard$3e$__["Keyboard"]
    },
    {
        id: 'ui',
        label: 'UI/UX',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"]
    },
    {
        id: 'performance',
        label: '성능',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__["Cpu"]
    }
];
/**
 * 🔥 섹션 버튼 컴포넌트
 */ const SectionButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].memo(({ section, isActive, onClick })=>{
    const Icon = section.icon;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].navButton} ${isActive ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].navButtonActive : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].navButtonInactive}`,
        onClick: onClick,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                className: "w-4 h-4 mr-2 inline"
            }, void 0, false, {
                fileName: "[project]/src/renderer/app/settings/components/SettingsNavigation.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            section.label
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/components/SettingsNavigation.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
});
_c = SectionButton;
SectionButton.displayName = 'SectionButton';
const SettingsNavigation = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].memo(_c1 = _s(({ activeSection, onSectionChange })=>{
    _s();
    // 🔥 섹션 변경 핸들러 생성
    const createSectionHandler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SettingsNavigation.useCallback[createSectionHandler]": (sectionId)=>{
            return ({
                "SettingsNavigation.useCallback[createSectionHandler]": ()=>onSectionChange(sectionId)
            })["SettingsNavigation.useCallback[createSectionHandler]"];
        }
    }["SettingsNavigation.useCallback[createSectionHandler]"], [
        onSectionChange
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].nav,
        children: SETTING_SECTIONS.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionButton, {
                section: section,
                isActive: activeSection === section.id,
                onClick: createSectionHandler(section.id)
            }, section.id, false, {
                fileName: "[project]/src/renderer/app/settings/components/SettingsNavigation.tsx",
                lineNumber: 70,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/renderer/app/settings/components/SettingsNavigation.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}, "2/UHV2+mxtHcpYRDXbd8f/caKFs=")), "2/UHV2+mxtHcpYRDXbd8f/caKFs=");
_c2 = SettingsNavigation;
SettingsNavigation.displayName = 'SettingsNavigation';
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "SectionButton");
__turbopack_context__.k.register(_c1, "SettingsNavigation$React.memo");
__turbopack_context__.k.register(_c2, "SettingsNavigation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/app/settings/components/controls/SettingItem.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 기가차드 SettingItem 공통 컴포넌트 - 최적화
__turbopack_context__.s({
    "SettingItem": (()=>SettingItem)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-client] (ecmascript)");
'use client';
;
;
;
const SettingItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].memo(_c = ({ title, description, control })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingRow,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingLabel,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingTitle,
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/controls/SettingItem.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingDescription,
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/controls/SettingItem.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/controls/SettingItem.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingControl,
                children: control
            }, void 0, false, {
                fileName: "[project]/src/renderer/app/settings/components/controls/SettingItem.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/components/controls/SettingItem.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
});
_c1 = SettingItem;
SettingItem.displayName = 'SettingItem';
var _c, _c1;
__turbopack_context__.k.register(_c, "SettingItem$React.memo");
__turbopack_context__.k.register(_c1, "SettingItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/app/settings/components/controls/Toggle.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 기가차드 Toggle 컴포넌트 - 완전 최적화
__turbopack_context__.s({
    "Toggle": (()=>Toggle)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const Toggle = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].memo(_c = _s(({ checked, onChange, disabled = false })=>{
    _s();
    // 🔥 이벤트 핸들러 메모이제이션
    const handleToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Toggle.useCallback[handleToggle]": ()=>{
            if (!disabled) {
                onChange(!checked);
            }
        }
    }["Toggle.useCallback[handleToggle]"], [
        checked,
        onChange,
        disabled
    ]);
    // 🔥 키보드 이벤트 핸들러
    const handleKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Toggle.useCallback[handleKeyDown]": (event)=>{
            if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
                event.preventDefault();
                onChange(!checked);
            }
        }
    }["Toggle.useCallback[handleKeyDown]"], [
        checked,
        onChange,
        disabled
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        role: "switch",
        "aria-checked": checked,
        disabled: disabled,
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].toggle} ${checked ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].toggleActive : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].toggleInactive} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        onClick: handleToggle,
        onKeyDown: handleKeyDown,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].toggleSwitch} ${checked ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].toggleSwitchActive : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].toggleSwitchInactive}`
        }, void 0, false, {
            fileName: "[project]/src/renderer/app/settings/components/controls/Toggle.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/renderer/app/settings/components/controls/Toggle.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}, "difi79hOKaDiF1MGOg3cQ3nIO0g=")), "difi79hOKaDiF1MGOg3cQ3nIO0g=");
_c1 = Toggle;
Toggle.displayName = 'Toggle';
var _c, _c1;
__turbopack_context__.k.register(_c, "Toggle$React.memo");
__turbopack_context__.k.register(_c1, "Toggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 기가차드 앱 설정 섹션 - 최적화
__turbopack_context__.s({
    "AppSettingsSection": (()=>AppSettingsSection)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/SettingItem.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/Toggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/providers/ThemeProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
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
const AppSettingsSection = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].memo(_c = _s(({ settings, updateSetting, setTheme })=>{
    _s();
    const { theme: currentTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    // 🔥 로컬 테마 상태 (설정 UI 표시용)
    const [displayTheme, setDisplayTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(settings.theme);
    // 🔥 설정이 변경되면 로컬 상태 동기화
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppSettingsSection.useEffect": ()=>{
            setDisplayTheme(settings.theme);
        }
    }["AppSettingsSection.useEffect"], [
        settings.theme
    ]);
    // 🔥 ThemeProvider의 테마가 변경되면 동기화
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppSettingsSection.useEffect": ()=>{
            if (currentTheme !== displayTheme && currentTheme !== 'system') {
                setDisplayTheme(currentTheme);
            }
        }
    }["AppSettingsSection.useEffect"], [
        currentTheme,
        displayTheme
    ]);
    // 🔥 테마 변경 핸들러 (ThemeProvider + 설정 동시 업데이트)
    const handleThemeChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppSettingsSection.useCallback[handleThemeChange]": async (event)=>{
            const newTheme = event.target.value;
            try {
                // 1. 로컬 상태 즉시 업데이트 (UI 반응성)
                setDisplayTheme(newTheme);
                // 2. ThemeProvider 업데이트 (실제 테마 적용)
                setTheme(newTheme);
                // 3. 설정 저장 (백엔드 동기화)
                await updateSetting('app', 'theme', newTheme);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('APP_SETTINGS', 'Theme updated successfully', {
                    theme: newTheme,
                    source: 'settings_page'
                });
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('APP_SETTINGS', 'Failed to update theme', error);
                // 🔥 에러 시 원래 상태로 롤백
                setDisplayTheme(settings.theme);
            }
        }
    }["AppSettingsSection.useCallback[handleThemeChange]"], [
        updateSetting,
        setTheme,
        settings.theme
    ]);
    // 🔥 언어 변경 핸들러
    const handleLanguageChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppSettingsSection.useCallback[handleLanguageChange]": (event)=>{
            updateSetting('app', 'language', event.target.value);
        }
    }["AppSettingsSection.useCallback[handleLanguageChange]"], [
        updateSetting
    ]);
    // 🔥 글꼴 크기 변경 핸들러
    const handleFontSizeChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppSettingsSection.useCallback[handleFontSizeChange]": (event)=>{
            const size = parseInt(event.target.value, 10);
            if (size >= 10 && size <= 24) {
                updateSetting('app', 'fontSize', size);
            }
        }
    }["AppSettingsSection.useCallback[handleFontSizeChange]"], [
        updateSetting
    ]);
    // 🔥 글꼴 패밀리 변경 핸들러
    const handleFontFamilyChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppSettingsSection.useCallback[handleFontFamilyChange]": (event)=>{
            updateSetting('app', 'fontFamily', event.target.value);
        }
    }["AppSettingsSection.useCallback[handleFontFamilyChange]"], [
        updateSetting
    ]);
    // 🔥 토글 핸들러들
    const handleAutoSaveToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppSettingsSection.useCallback[handleAutoSaveToggle]": (checked)=>{
            updateSetting('app', 'autoSave', checked);
        }
    }["AppSettingsSection.useCallback[handleAutoSaveToggle]"], [
        updateSetting
    ]);
    const handleStartMinimizedToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppSettingsSection.useCallback[handleStartMinimizedToggle]": (checked)=>{
            updateSetting('app', 'startMinimized', checked);
        }
    }["AppSettingsSection.useCallback[handleStartMinimizedToggle]"], [
        updateSetting
    ]);
    const handleMinimizeToTrayToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppSettingsSection.useCallback[handleMinimizeToTrayToggle]": (checked)=>{
            updateSetting('app', 'minimizeToTray', checked);
        }
    }["AppSettingsSection.useCallback[handleMinimizeToTrayToggle]"], [
        updateSetting
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionCard,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionIcon
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionTitle,
                        children: "앱 설정"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingItem,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "테마",
                        description: "앱의 외관 테마를 선택하세요",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: displayTheme,
                            onChange: handleThemeChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].select,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "system",
                                    children: "시스템"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                    lineNumber: 121,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "light",
                                    children: "라이트"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                    lineNumber: 122,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "dark",
                                    children: "다크"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                    lineNumber: 123,
                                    columnNumber: 15
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                            lineNumber: 116,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "언어",
                        description: "앱에서 사용할 언어를 선택하세요",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: settings.language,
                            onChange: handleLanguageChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].select,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "ko",
                                    children: "한국어"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                    lineNumber: 137,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "en",
                                    children: "English"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                    lineNumber: 138,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "ja",
                                    children: "日本語"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                    lineNumber: 139,
                                    columnNumber: 15
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                            lineNumber: 132,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "자동 저장",
                        description: "작업 내용을 자동으로 저장합니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.autoSave,
                            onChange: handleAutoSaveToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                            lineNumber: 148,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "최소화 상태로 시작",
                        description: "앱 시작 시 최소화된 상태로 실행합니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.startMinimized,
                            onChange: handleStartMinimizedToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                            lineNumber: 159,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "시스템 트레이로 최소화",
                        description: "창을 닫을 때 시스템 트레이로 최소화합니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.minimizeToTray,
                            onChange: handleMinimizeToTrayToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                            lineNumber: 170,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "글꼴 크기",
                        description: "앱에서 사용할 글꼴 크기를 설정하세요 (10-24px)",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            min: "10",
                            max: "24",
                            value: settings.fontSize,
                            onChange: handleFontSizeChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].numberInput
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                            lineNumber: 181,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "글꼴 패밀리",
                        description: "앱에서 사용할 글꼴을 선택하세요",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: settings.fontFamily,
                            onChange: handleFontFamilyChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].select,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                                    children: "Pretendard (기본)"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                    lineNumber: 201,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                                    children: "SF Pro Display"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                    lineNumber: 204,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "'Noto Sans KR', sans-serif",
                                    children: "Noto Sans KR"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                    lineNumber: 207,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "'Malgun Gothic', sans-serif",
                                    children: "맑은 고딕"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                    lineNumber: 210,
                                    columnNumber: 15
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                            lineNumber: 196,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}, "bbjcVGfwle5a9LaYSAh/OWdZoXw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
})), "bbjcVGfwle5a9LaYSAh/OWdZoXw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c1 = AppSettingsSection;
AppSettingsSection.displayName = 'AppSettingsSection';
var _c, _c1;
__turbopack_context__.k.register(_c, "AppSettingsSection$React.memo");
__turbopack_context__.k.register(_c1, "AppSettingsSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 기가차드 키보드 설정 섹션 - 최적화
__turbopack_context__.s({
    "KeyboardSettingsSection": (()=>KeyboardSettingsSection)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$keyboard$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Keyboard$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/keyboard.mjs [app-client] (ecmascript) <export default as Keyboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/SettingItem.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/Toggle.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const KeyboardSettingsSection = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].memo(_c = _s(({ settings, updateSetting })=>{
    _s();
    // 🔥 키보드 활성화 토글 핸들러
    const handleEnabledToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "KeyboardSettingsSection.useCallback[handleEnabledToggle]": (checked)=>{
            updateSetting('keyboard', 'enabled', checked);
        }
    }["KeyboardSettingsSection.useCallback[handleEnabledToggle]"], [
        updateSetting
    ]);
    // 🔥 모든 앱 추적 토글 핸들러
    const handleTrackAllAppsToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "KeyboardSettingsSection.useCallback[handleTrackAllAppsToggle]": (checked)=>{
            updateSetting('keyboard', 'trackAllApps', checked);
        }
    }["KeyboardSettingsSection.useCallback[handleTrackAllAppsToggle]"], [
        updateSetting
    ]);
    // 🔥 언어 변경 핸들러
    const handleLanguageChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "KeyboardSettingsSection.useCallback[handleLanguageChange]": (event)=>{
            updateSetting('keyboard', 'language', event.target.value);
        }
    }["KeyboardSettingsSection.useCallback[handleLanguageChange]"], [
        updateSetting
    ]);
    // 🔥 세션 타임아웃 변경 핸들러
    const handleSessionTimeoutChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "KeyboardSettingsSection.useCallback[handleSessionTimeoutChange]": (event)=>{
            const timeout = parseInt(event.target.value, 10);
            if (timeout >= 5 && timeout <= 120) {
                updateSetting('keyboard', 'sessionTimeout', timeout);
            }
        }
    }["KeyboardSettingsSection.useCallback[handleSessionTimeoutChange]"], [
        updateSetting
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionCard,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$keyboard$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Keyboard$3e$__["Keyboard"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionIcon
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionTitle,
                        children: "키보드 설정"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingItem,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "키보드 모니터링 활성화",
                        description: "키보드 입력을 모니터링하여 타이핑 통계를 수집합니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.enabled,
                            onChange: handleEnabledToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                            lineNumber: 61,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "입력 언어",
                        description: "주로 사용하는 입력 언어를 선택하세요",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: settings.language,
                            onChange: handleLanguageChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].select,
                            disabled: !settings.enabled,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "korean",
                                    children: "한국어"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                                    lineNumber: 78,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "english",
                                    children: "English"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                                    lineNumber: 79,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "japanese",
                                    children: "日本語"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                                    lineNumber: 80,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "chinese",
                                    children: "中文"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                                    lineNumber: 81,
                                    columnNumber: 15
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                            lineNumber: 72,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "모든 앱 추적",
                        description: "모든 애플리케이션에서의 타이핑을 추적합니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.trackAllApps,
                            onChange: handleTrackAllAppsToggle,
                            disabled: !settings.enabled
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                            lineNumber: 90,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "세션 타임아웃",
                        description: "타이핑 세션이 종료되는 시간(분)을 설정하세요 (5-120분)",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            min: "5",
                            max: "120",
                            value: settings.sessionTimeout,
                            onChange: handleSessionTimeoutChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].numberInput,
                            disabled: !settings.enabled
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                            lineNumber: 102,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}, "vDhSjzXYiV7IJUD1v7WYUW/XFSc=")), "vDhSjzXYiV7IJUD1v7WYUW/XFSc=");
_c1 = KeyboardSettingsSection;
KeyboardSettingsSection.displayName = 'KeyboardSettingsSection';
var _c, _c1;
__turbopack_context__.k.register(_c, "KeyboardSettingsSection$React.memo");
__turbopack_context__.k.register(_c1, "KeyboardSettingsSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 기가차드 UI 설정 섹션 - 최적화
__turbopack_context__.s({
    "UISettingsSection": (()=>UISettingsSection)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/palette.mjs [app-client] (ecmascript) <export default as Palette>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/SettingItem.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/Toggle.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const UISettingsSection = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].memo(_c = _s(({ settings, updateSetting })=>{
    _s();
    // 🔥 창 너비 변경 핸들러
    const handleWindowWidthChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UISettingsSection.useCallback[handleWindowWidthChange]": (event)=>{
            const width = parseInt(event.target.value, 10);
            if (width >= 800 && width <= 2560) {
                updateSetting('ui', 'windowWidth', width);
            }
        }
    }["UISettingsSection.useCallback[handleWindowWidthChange]"], [
        updateSetting
    ]);
    // 🔥 창 높이 변경 핸들러
    const handleWindowHeightChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UISettingsSection.useCallback[handleWindowHeightChange]": (event)=>{
            const height = parseInt(event.target.value, 10);
            if (height >= 600 && height <= 1440) {
                updateSetting('ui', 'windowHeight', height);
            }
        }
    }["UISettingsSection.useCallback[handleWindowHeightChange]"], [
        updateSetting
    ]);
    // 🔥 토글 핸들러들
    const handleSidebarCollapsedToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UISettingsSection.useCallback[handleSidebarCollapsedToggle]": (checked)=>{
            updateSetting('ui', 'sidebarCollapsed', checked);
        }
    }["UISettingsSection.useCallback[handleSidebarCollapsedToggle]"], [
        updateSetting
    ]);
    const handleFocusModeToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UISettingsSection.useCallback[handleFocusModeToggle]": (checked)=>{
            updateSetting('ui', 'focusMode', checked);
        }
    }["UISettingsSection.useCallback[handleFocusModeToggle]"], [
        updateSetting
    ]);
    const handleShowLineNumbersToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UISettingsSection.useCallback[handleShowLineNumbersToggle]": (checked)=>{
            updateSetting('ui', 'showLineNumbers', checked);
        }
    }["UISettingsSection.useCallback[handleShowLineNumbersToggle]"], [
        updateSetting
    ]);
    const handleShowWordCountToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UISettingsSection.useCallback[handleShowWordCountToggle]": (checked)=>{
            updateSetting('ui', 'showWordCount', checked);
        }
    }["UISettingsSection.useCallback[handleShowWordCountToggle]"], [
        updateSetting
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionCard,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionIcon
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionTitle,
                        children: "UI/UX 설정"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingItem,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "창 너비",
                        description: "앱 창의 기본 너비를 설정하세요 (800-2560px)",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            min: "800",
                            max: "2560",
                            step: "50",
                            value: settings.windowWidth,
                            onChange: handleWindowWidthChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].numberInput
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                            lineNumber: 71,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "창 높이",
                        description: "앱 창의 기본 높이를 설정하세요 (600-1440px)",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            min: "600",
                            max: "1440",
                            step: "50",
                            value: settings.windowHeight,
                            onChange: handleWindowHeightChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].numberInput
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                            lineNumber: 87,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "사이드바 접기",
                        description: "앱 시작 시 사이드바를 접힌 상태로 표시합니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.sidebarCollapsed,
                            onChange: handleSidebarCollapsedToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                            lineNumber: 103,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "집중 모드",
                        description: "집중 모드에서는 불필요한 UI 요소를 숨깁니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.focusMode,
                            onChange: handleFocusModeToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                            lineNumber: 114,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "줄 번호 표시",
                        description: "에디터에서 줄 번호를 표시합니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.showLineNumbers,
                            onChange: handleShowLineNumbersToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                            lineNumber: 125,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "단어 수 표시",
                        description: "상태바에 단어 수를 표시합니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.showWordCount,
                            onChange: handleShowWordCountToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                            lineNumber: 136,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}, "jdGmKi7KhbfQZ8Zs1iIyJS5wrEE=")), "jdGmKi7KhbfQZ8Zs1iIyJS5wrEE=");
_c1 = UISettingsSection;
UISettingsSection.displayName = 'UISettingsSection';
var _c, _c1;
__turbopack_context__.k.register(_c, "UISettingsSection$React.memo");
__turbopack_context__.k.register(_c1, "UISettingsSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 기가차드 성능 설정 섹션 - 최적화
__turbopack_context__.s({
    "PerformanceSettingsSection": (()=>PerformanceSettingsSection)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/cpu.mjs [app-client] (ecmascript) <export default as Cpu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/SettingItem.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/Toggle.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const PerformanceSettingsSection = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].memo(_c = _s(({ settings, updateSetting })=>{
    _s();
    // 🔥 최대 CPU 사용률 변경 핸들러
    const handleMaxCPUUsageChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PerformanceSettingsSection.useCallback[handleMaxCPUUsageChange]": (event)=>{
            const usage = parseInt(event.target.value, 10);
            if (usage >= 20 && usage <= 100) {
                updateSetting('performance', 'maxCPUUsage', usage);
            }
        }
    }["PerformanceSettingsSection.useCallback[handleMaxCPUUsageChange]"], [
        updateSetting
    ]);
    // 🔥 최대 메모리 사용량 변경 핸들러
    const handleMaxMemoryUsageChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PerformanceSettingsSection.useCallback[handleMaxMemoryUsageChange]": (event)=>{
            const memory = parseInt(event.target.value, 10);
            if (memory >= 512 && memory <= 8192) {
                updateSetting('performance', 'maxMemoryUsage', memory);
            }
        }
    }["PerformanceSettingsSection.useCallback[handleMaxMemoryUsageChange]"], [
        updateSetting
    ]);
    // 🔥 토글 핸들러들
    const handleGPUAccelerationToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PerformanceSettingsSection.useCallback[handleGPUAccelerationToggle]": (checked)=>{
            updateSetting('performance', 'enableGPUAcceleration', checked);
        }
    }["PerformanceSettingsSection.useCallback[handleGPUAccelerationToggle]"], [
        updateSetting
    ]);
    const handleHardwareAccelerationToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PerformanceSettingsSection.useCallback[handleHardwareAccelerationToggle]": (checked)=>{
            updateSetting('performance', 'enableHardwareAcceleration', checked);
        }
    }["PerformanceSettingsSection.useCallback[handleHardwareAccelerationToggle]"], [
        updateSetting
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionCard,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__["Cpu"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionIcon
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionTitle,
                        children: "성능 설정"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingItem,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "GPU 가속 활성화",
                        description: "GPU를 사용하여 렌더링 성능을 향상시킵니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.enableGPUAcceleration,
                            onChange: handleGPUAccelerationToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                            lineNumber: 63,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "하드웨어 가속 활성화",
                        description: "하드웨어 가속을 사용하여 전반적인 성능을 향상시킵니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.enableHardwareAcceleration,
                            onChange: handleHardwareAccelerationToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                            lineNumber: 74,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "최대 CPU 사용률",
                        description: "앱이 사용할 수 있는 최대 CPU 사용률(%)을 설정하세요 (20-100%)",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            min: "20",
                            max: "100",
                            step: "5",
                            value: settings.maxCPUUsage,
                            onChange: handleMaxCPUUsageChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].numberInput
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                            lineNumber: 85,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "최대 메모리 사용량",
                        description: "앱이 사용할 수 있는 최대 메모리 사용량(MB)을 설정하세요 (512-8192MB)",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            min: "512",
                            max: "8192",
                            step: "256",
                            value: settings.maxMemoryUsage,
                            onChange: handleMaxMemoryUsageChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].numberInput
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                            lineNumber: 101,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}, "yHcMVJVYx/LMQPwhTCFu6giaSVI=")), "yHcMVJVYx/LMQPwhTCFu6giaSVI=");
_c1 = PerformanceSettingsSection;
PerformanceSettingsSection.displayName = 'PerformanceSettingsSection';
var _c, _c1;
__turbopack_context__.k.register(_c, "PerformanceSettingsSection$React.memo");
__turbopack_context__.k.register(_c1, "PerformanceSettingsSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/app/settings/components/SettingsActions.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 기가차드 설정 액션 버튼 컴포넌트 - 최적화
__turbopack_context__.s({
    "SettingsActions": (()=>SettingsActions)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/save.mjs [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.263.1_react@19.1.0/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const SettingsActions = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].memo(_c = _s(({ saving, onSave, onReset })=>{
    _s();
    // 🔥 저장 핸들러
    const handleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SettingsActions.useCallback[handleSave]": async ()=>{
            try {
                await onSave();
            } catch (error) {
                console.error('Failed to save settings:', error);
            }
        }
    }["SettingsActions.useCallback[handleSave]"], [
        onSave
    ]);
    // 🔥 리셋 핸들러 (확인 다이얼로그 포함)
    const handleReset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SettingsActions.useCallback[handleReset]": async ()=>{
            const confirmed = window.confirm('모든 설정을 기본값으로 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.');
            if (confirmed) {
                try {
                    await onReset();
                } catch (error) {
                    console.error('Failed to reset settings:', error);
                }
            }
        }
    }["SettingsActions.useCallback[handleReset]"], [
        onReset
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].actions,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].button} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].secondaryButton}`,
                onClick: handleReset,
                disabled: saving,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                        className: "w-4 h-4 mr-2"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/SettingsActions.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    "기본값으로 복원"
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/SettingsActions.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].button} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].primaryButton}`,
                onClick: handleSave,
                disabled: saving,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$263$2e$1_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                        className: "w-4 h-4 mr-2"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/SettingsActions.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    saving ? '저장 중...' : '모든 설정 저장'
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/SettingsActions.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/components/SettingsActions.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}, "VkTVZd4oHmSWDSh1gZE4N+gS94Y=")), "VkTVZd4oHmSWDSh1gZE4N+gS94Y=");
_c1 = SettingsActions;
SettingsActions.displayName = 'SettingsActions';
var _c, _c1;
__turbopack_context__.k.register(_c, "SettingsActions$React.memo");
__turbopack_context__.k.register(_c1, "SettingsActions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/app/settings/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 기가차드 Settings 페이지 - 완전 리팩토링 (756줄 → 80줄)
__turbopack_context__.s({
    "default": (()=>SettingsPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$hooks$2f$useSettings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/hooks/useSettings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$SettingsNavigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/SettingsNavigation.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$AppSettingsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$KeyboardSettingsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$UISettingsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$PerformanceSettingsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$SettingsActions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/SettingsActions.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/providers/ThemeProvider.tsx [app-client] (ecmascript)");
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
function SettingsPage() {
    _s();
    const { settings, loading, saving, updateSetting, saveAllSettings, resetSettings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$hooks$2f$useSettings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"])();
    const [activeSection, setActiveSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('app');
    const { setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    // 🔥 로딩 상태 처리
    if (loading || !settings) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].container,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].loading,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].loadingContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].spinner
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/page.tsx",
                            lineNumber: 30,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].loadingText,
                            children: "설정을 불러오는 중..."
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/page.tsx",
                            lineNumber: 31,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/app/settings/page.tsx",
                    lineNumber: 29,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/app/settings/page.tsx",
                lineNumber: 28,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/app/settings/page.tsx",
            lineNumber: 27,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].pageTitle,
                children: "설정"
            }, void 0, false, {
                fileName: "[project]/src/renderer/app/settings/page.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$SettingsNavigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsNavigation"], {
                activeSection: activeSection,
                onSectionChange: setActiveSection
            }, void 0, false, {
                fileName: "[project]/src/renderer/app/settings/page.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].section,
                children: [
                    activeSection === 'app' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$AppSettingsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppSettingsSection"], {
                        settings: settings.app,
                        updateSetting: updateSetting,
                        setTheme: setTheme
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/page.tsx",
                        lineNumber: 52,
                        columnNumber: 11
                    }, this),
                    activeSection === 'keyboard' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$KeyboardSettingsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KeyboardSettingsSection"], {
                        settings: settings.keyboard,
                        updateSetting: updateSetting
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/page.tsx",
                        lineNumber: 60,
                        columnNumber: 11
                    }, this),
                    activeSection === 'ui' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$UISettingsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UISettingsSection"], {
                        settings: settings.ui,
                        updateSetting: updateSetting
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/page.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this),
                    activeSection === 'performance' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$PerformanceSettingsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PerformanceSettingsSection"], {
                        settings: settings.performance,
                        updateSetting: updateSetting
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/page.tsx",
                        lineNumber: 74,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/page.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$27$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$SettingsActions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsActions"], {
                saving: saving,
                onSave: saveAllSettings,
                onReset: resetSettings
            }, void 0, false, {
                fileName: "[project]/src/renderer/app/settings/page.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/page.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_s(SettingsPage, "gycKiDJ0LOFV5dygZYt/2wND8Cg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$hooks$2f$useSettings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = SettingsPage;
var _c;
__turbopack_context__.k.register(_c, "SettingsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_renderer_app_settings_4d4b2e58._.js.map