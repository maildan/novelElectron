'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Monitor, Settings, Palette, Keyboard, Cpu, 
  Save, RotateCcw, Download, Upload
} from 'lucide-react';
import { Logger } from '../../../shared/logger';
import { useTheme } from '../../providers/ThemeProvider';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const SETTINGS_PAGE_STYLES = {
  container: 'container mx-auto px-4 py-6 max-w-4xl space-y-6',
  pageTitle: 'text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6',
  nav: 'flex flex-wrap gap-2 mb-6',
  navButton: 'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
  navButtonActive: 'bg-blue-600 text-white',
  navButtonInactive: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
  section: 'space-y-6',
  sectionCard: 'bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6',
  sectionHeader: 'flex items-center gap-3 mb-4',
  sectionIcon: 'w-6 h-6 text-blue-600',
  sectionTitle: 'text-xl font-semibold text-slate-900 dark:text-slate-100',
  settingItem: 'space-y-4',
  settingRow: 'flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0',
  settingLabel: 'flex-1',
  settingTitle: 'font-medium text-slate-900 dark:text-slate-100',
  settingDescription: 'text-sm text-slate-600 dark:text-slate-400 mt-1',
  settingControl: 'flex items-center gap-3',
  inputGroup: 'space-y-2',
  inputLabel: 'text-sm font-medium text-slate-700 dark:text-slate-300',
  textInput: 'w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100',
  numberInput: 'w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100',
  select: 'px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100',
  checkbox: 'w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-slate-700 dark:border-slate-600',
  toggle: 'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  toggleActive: 'bg-blue-600',
  toggleInactive: 'bg-slate-200 dark:bg-slate-600',
  toggleSwitch: 'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
  toggleSwitchActive: 'translate-x-6',
  toggleSwitchInactive: 'translate-x-1',
  actions: 'flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700',
  button: 'px-4 py-2 rounded-lg font-medium transition-colors',
  primaryButton: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondaryButton: 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300',
} as const;

// 🔥 BE 스키마와 일치하는 타입 정의
type SettingSection = 'app' | 'keyboard' | 'ui' | 'performance';

interface SettingsData {
  readonly app: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    autoSave: boolean;
    startMinimized: boolean;
    minimizeToTray: boolean;
    fontSize: number;
    fontFamily: string;
  };
  readonly keyboard: {
    enabled: boolean;
    language: string;
    trackAllApps: boolean;
    sessionTimeout: number;
  };
  readonly ui: {
    windowWidth: number;
    windowHeight: number;
    sidebarCollapsed: boolean;
    focusMode: boolean;
    showLineNumbers: boolean;
    showWordCount: boolean;
  };
  readonly performance: {
    enableGPUAcceleration: boolean;
    maxCPUUsage: number;
    maxMemoryUsage: number;
    enableHardwareAcceleration: boolean;
  };
}

const SETTING_SECTIONS: Array<{
  id: SettingSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'app', label: '앱 설정', icon: Settings },
  { id: 'keyboard', label: '키보드', icon: Keyboard },
  { id: 'ui', label: 'UI/UX', icon: Palette },
  { id: 'performance', label: '성능', icon: Cpu },
];

// 🔥 토글 컴포넌트
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps): React.ReactElement {
  return (
    <button
      type="button"
      className={`${SETTINGS_PAGE_STYLES.toggle} ${
        checked ? SETTINGS_PAGE_STYLES.toggleActive : SETTINGS_PAGE_STYLES.toggleInactive
      }`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`${SETTINGS_PAGE_STYLES.toggleSwitch} ${
          checked ? SETTINGS_PAGE_STYLES.toggleSwitchActive : SETTINGS_PAGE_STYLES.toggleSwitchInactive
        }`}
      />
    </button>
  );
}

export default function SettingsPage(): React.ReactElement {
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<SettingSection>('app');
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // 🔥 설정 로드
  useEffect(() => {
    const loadSettings = async (): Promise<void> => {
      try {
        setLoading(true);
        
        const result = await window.electronAPI.settings.get('all');
        if (result.success && result.data) {
          setSettings(result.data as SettingsData);
          Logger.info('SETTINGS_PAGE', 'Settings loaded from backend', result.data);
        } else {
          Logger.warn('SETTINGS_PAGE', 'Failed to load settings, using defaults');
          // 기본값 사용
          setSettings({
            app: {
              theme: 'system',
              language: 'ko',
              autoSave: true,
              startMinimized: false,
              minimizeToTray: true,
              fontSize: 14,
              fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
            },
            keyboard: {
              enabled: true,
              language: 'korean',
              trackAllApps: false,
              sessionTimeout: 30,
            },
            ui: {
              windowWidth: 1400,
              windowHeight: 900,
              sidebarCollapsed: false,
              focusMode: false,
              showLineNumbers: true,
              showWordCount: true,
            },
            performance: {
              enableGPUAcceleration: true,
              maxCPUUsage: 80,
              maxMemoryUsage: 2048,
              enableHardwareAcceleration: true,
            },
          });
        }
      } catch (error) {
        Logger.error('SETTINGS_PAGE', 'Error loading settings', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // 🔥 설정 업데이트 함수
  const updateSetting = useCallback(async <K extends keyof SettingsData, T extends keyof SettingsData[K]>(
    category: K,
    key: T,
    value: SettingsData[K][T]
  ): Promise<void> => {
    if (!settings) return;

    try {
      // 즉시 UI 업데이트
      const newSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          [key]: value,
        },
      };
      setSettings(newSettings);

      // 🔥 테마 변경 시 ThemeProvider도 업데이트
      if (category === 'app' && key === 'theme') {
        setTheme(value as 'light' | 'dark' | 'system');
      }

      // 백엔드에 저장
      const result = await window.electronAPI.settings.set(`${category}.${String(key)}`, value);
      if (result.success) {
        Logger.info('SETTINGS_PAGE', `Setting updated: ${category}.${String(key)}`, { value });
      } else {
        Logger.error('SETTINGS_PAGE', `Failed to save setting: ${category}.${String(key)}`, result.error);
      }
    } catch (error) {
      Logger.error('SETTINGS_PAGE', `Error updating setting: ${category}.${String(key)}`, error);
    }
  }, [settings, setTheme]);

  // 🔥 설정 저장
  const saveAllSettings = useCallback(async (): Promise<void> => {
    if (!settings) return;

    try {
      setSaving(true);
      
      // 모든 카테고리 저장
      for (const [category, categoryData] of Object.entries(settings)) {
        const result = await window.electronAPI.settings.set(category, categoryData);
        if (!result.success) {
          throw new Error(`Failed to save ${category} settings: ${result.error}`);
        }
      }
      
      Logger.info('SETTINGS_PAGE', 'All settings saved successfully');
    } catch (error) {
      Logger.error('SETTINGS_PAGE', 'Failed to save settings', error);
    } finally {
      setSaving(false);
    }
  }, [settings]);

  // 🔥 설정 리셋
  const resetSettings = useCallback(async (): Promise<void> => {
    try {
      const result = await window.electronAPI.settings.reset();
      if (result.success) {
        window.location.reload(); // 페이지 새로고침으로 기본값 로드
        Logger.info('SETTINGS_PAGE', 'Settings reset to defaults');
      } else {
        Logger.error('SETTINGS_PAGE', 'Failed to reset settings', result.error);
      }
    } catch (error) {
      Logger.error('SETTINGS_PAGE', 'Error resetting settings', error);
    }
  }, []);

  // 🔥 로딩 상태 처리
  if (loading || !settings) {
    return (
      <div className={SETTINGS_PAGE_STYLES.container}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-slate-600">설정을 로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={SETTINGS_PAGE_STYLES.container}>
      {/* 페이지 제목 */}
      <h1 className={SETTINGS_PAGE_STYLES.pageTitle}>설정</h1>

      {/* 네비게이션 */}
      <nav className={SETTINGS_PAGE_STYLES.nav}>
        {SETTING_SECTIONS.map((section) => (
          <button
            key={section.id}
            className={`${SETTINGS_PAGE_STYLES.navButton} ${
              activeSection === section.id
                ? SETTINGS_PAGE_STYLES.navButtonActive
                : SETTINGS_PAGE_STYLES.navButtonInactive
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            <section.icon className="w-4 h-4 mr-2 inline" />
            {section.label}
          </button>
        ))}
      </nav>

      {/* 섹션 컨텐츠 */}
      <div className={SETTINGS_PAGE_STYLES.section}>
        {/* 앱 설정 */}
        {activeSection === 'app' && (
          <div className={SETTINGS_PAGE_STYLES.sectionCard}>
            <div className={SETTINGS_PAGE_STYLES.sectionHeader}>
              <Settings className={SETTINGS_PAGE_STYLES.sectionIcon} />
              <h2 className={SETTINGS_PAGE_STYLES.sectionTitle}>앱 설정</h2>
            </div>
            
            <div className={SETTINGS_PAGE_STYLES.settingItem}>
              {/* 테마 설정 */}
              <div className={SETTINGS_PAGE_STYLES.settingRow}>
                <div className={SETTINGS_PAGE_STYLES.settingLabel}>
                  <div className={SETTINGS_PAGE_STYLES.settingTitle}>테마</div>
                  <div className={SETTINGS_PAGE_STYLES.settingDescription}>
                    앱의 외관 테마를 선택하세요
                  </div>
                </div>
                <div className={SETTINGS_PAGE_STYLES.settingControl}>
                  <select
                    className={SETTINGS_PAGE_STYLES.select}
                    value={settings?.app?.theme || 'system'}
                    onChange={(e) => updateSetting('app', 'theme', e.target.value as 'light' | 'dark' | 'system')}
                  >
                    <option value="system">시스템 설정 따름</option>
                    <option value="light">라이트 모드</option>
                    <option value="dark">다크 모드</option>
                  </select>
                </div>
              </div>

              {/* 언어 설정 */}
              <div className={SETTINGS_PAGE_STYLES.settingRow}>
                <div className={SETTINGS_PAGE_STYLES.settingLabel}>
                  <div className={SETTINGS_PAGE_STYLES.settingTitle}>언어</div>
                  <div className={SETTINGS_PAGE_STYLES.settingDescription}>
                    앱에서 사용할 언어를 선택하세요
                  </div>
                </div>
                <div className={SETTINGS_PAGE_STYLES.settingControl}>
                  <select
                    className={SETTINGS_PAGE_STYLES.select}
                    value={settings?.app?.language || 'ko'}
                    onChange={(e) => updateSetting('app', 'language', e.target.value)}
                  >
                    <option value="ko">한국어</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              {/* 자동 저장 */}
              <div className={SETTINGS_PAGE_STYLES.settingRow}>
                <div className={SETTINGS_PAGE_STYLES.settingLabel}>
                  <div className={SETTINGS_PAGE_STYLES.settingTitle}>자동 저장</div>
                  <div className={SETTINGS_PAGE_STYLES.settingDescription}>
                    문서를 자동으로 저장합니다
                  </div>
                </div>
                <div className={SETTINGS_PAGE_STYLES.settingControl}>
                  <input
                    type="checkbox"
                    className={SETTINGS_PAGE_STYLES.checkbox}
                    checked={settings?.app?.autoSave || false}
                    onChange={(e) => updateSetting('app', 'autoSave', e.target.checked)}
                  />
                </div>
              </div>

              {/* 트레이 최소화 */}
              <div className={SETTINGS_PAGE_STYLES.settingRow}>
                <div className={SETTINGS_PAGE_STYLES.settingLabel}>
                  <div className={SETTINGS_PAGE_STYLES.settingTitle}>시스템 트레이로 최소화</div>
                  <div className={SETTINGS_PAGE_STYLES.settingDescription}>
                    창을 닫을 때 시스템 트레이로 최소화합니다
                  </div>
                </div>
                <div className={SETTINGS_PAGE_STYLES.settingControl}>
                  <input
                    type="checkbox"
                    className={SETTINGS_PAGE_STYLES.checkbox}
                    checked={settings?.app?.minimizeToTray || true}
                    onChange={(e) => updateSetting('app', 'minimizeToTray', e.target.checked)}
                  />
                </div>
              </div>

              {/* 폰트 크기 */}
              <div className={SETTINGS_PAGE_STYLES.settingRow}>
                <div className={SETTINGS_PAGE_STYLES.settingLabel}>
                  <div className={SETTINGS_PAGE_STYLES.settingTitle}>폰트 크기</div>
                  <div className={SETTINGS_PAGE_STYLES.settingDescription}>
                    에디터 폰트 크기를 설정하세요 (10-24px)
                  </div>
                </div>
                <div className={SETTINGS_PAGE_STYLES.settingControl}>
                  <input
                    type="number"
                    min="10"
                    max="24"
                    className={SETTINGS_PAGE_STYLES.numberInput}
                    value={settings?.app?.fontSize || 14}
                    onChange={(e) => updateSetting('app', 'fontSize', parseInt(e.target.value))}
                  />
                  <span className="text-sm text-slate-500">px</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 키보드 설정 */}
        {activeSection === 'keyboard' && (
          <div className={SETTINGS_PAGE_STYLES.sectionCard}>
            <div className={SETTINGS_PAGE_STYLES.sectionHeader}>
              <Keyboard className={SETTINGS_PAGE_STYLES.sectionIcon} />
              <h2 className={SETTINGS_PAGE_STYLES.sectionTitle}>키보드 모니터링</h2>
            </div>
            
            <div className={SETTINGS_PAGE_STYLES.settingItem}>
              {/* 키보드 모니터링 활성화 */}
              <div className={SETTINGS_PAGE_STYLES.settingRow}>
                <div className={SETTINGS_PAGE_STYLES.settingLabel}>
                  <div className={SETTINGS_PAGE_STYLES.settingTitle}>키보드 모니터링 활성화</div>
                  <div className={SETTINGS_PAGE_STYLES.settingDescription}>
                    타이핑 통계를 위한 키보드 모니터링을 활성화합니다
                  </div>
                </div>
                <div className={SETTINGS_PAGE_STYLES.settingControl}>
                  <Toggle
                    checked={settings.keyboard.enabled}
                    onChange={(checked) => updateSetting('keyboard', 'enabled', checked)}
                  />
                </div>
              </div>

              {/* 언어 설정 */}
              <div className={SETTINGS_PAGE_STYLES.settingRow}>
                <div className={SETTINGS_PAGE_STYLES.settingLabel}>
                  <div className={SETTINGS_PAGE_STYLES.settingTitle}>키보드 언어</div>
                  <div className={SETTINGS_PAGE_STYLES.settingDescription}>
                    키보드 입력 분석에 사용할 언어입니다
                  </div>
                </div>
                <div className={SETTINGS_PAGE_STYLES.settingControl}>
                  <select
                    className={SETTINGS_PAGE_STYLES.select}
                    value={settings?.keyboard?.language || 'korean'}
                    onChange={(e) => updateSetting('keyboard', 'language', e.target.value)}
                  >
                    <option value="korean">한국어</option>
                    <option value="english">English</option>
                    <option value="auto">자동 감지</option>
                  </select>
                </div>
              </div>

              {/* 모든 앱 추적 */}
              <div className={SETTINGS_PAGE_STYLES.settingRow}>
                <div className={SETTINGS_PAGE_STYLES.settingLabel}>
                  <div className={SETTINGS_PAGE_STYLES.settingTitle}>모든 앱 추적</div>
                  <div className={SETTINGS_PAGE_STYLES.settingDescription}>
                    Loop 외의 다른 앱에서도 타이핑을 추적합니다
                  </div>
                </div>
                <div className={SETTINGS_PAGE_STYLES.settingControl}>
                  <Toggle
                    checked={settings.keyboard.trackAllApps}
                    onChange={(checked) => updateSetting('keyboard', 'trackAllApps', checked)}
                  />
                </div>
              </div>

              {/* 세션 타임아웃 */}
              <div className={SETTINGS_PAGE_STYLES.settingRow}>
                <div className={SETTINGS_PAGE_STYLES.settingLabel}>
                  <div className={SETTINGS_PAGE_STYLES.settingTitle}>세션 타임아웃</div>
                  <div className={SETTINGS_PAGE_STYLES.settingDescription}>
                    타이핑 세션이 종료되는 시간 (분)
                  </div>
                </div>
                <div className={SETTINGS_PAGE_STYLES.settingControl}>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    className={SETTINGS_PAGE_STYLES.numberInput}
                    value={settings?.keyboard?.sessionTimeout || 30}
                    onChange={(e) => updateSetting('keyboard', 'sessionTimeout', parseInt(e.target.value))}
                  />
                  <span className="text-sm text-slate-500">분</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* UI 설정 */}
        {activeSection === 'ui' && (
          <div className={SETTINGS_PAGE_STYLES.sectionCard}>
            <div className={SETTINGS_PAGE_STYLES.sectionHeader}>
              <Palette className={SETTINGS_PAGE_STYLES.sectionIcon} />
              <h2 className={SETTINGS_PAGE_STYLES.sectionTitle}>UI/UX 설정</h2>
            </div>
            
            <div className={SETTINGS_PAGE_STYLES.settingItem}>
              {/* 사이드바 축소 */}
              <div className={SETTINGS_PAGE_STYLES.settingRow}>
                <div className={SETTINGS_PAGE_STYLES.settingLabel}>
                  <div className={SETTINGS_PAGE_STYLES.settingTitle}>사이드바 숨김</div>
                  <div className={SETTINGS_PAGE_STYLES.settingDescription}>
                    앱 시작 시 사이드바를 숨긴 상태로 시작합니다
                  </div>
                </div>
                <div className={SETTINGS_PAGE_STYLES.settingControl}>
                  <Toggle
                    checked={settings?.ui?.sidebarCollapsed || false}
                    onChange={(checked) => updateSetting('ui', 'sidebarCollapsed', checked)}
                  />
                </div>
              </div>

              {/* 집중 모드 */}
              <div className={SETTINGS_PAGE_STYLES.settingRow}>
                <div className={SETTINGS_PAGE_STYLES.settingLabel}>
                  <div className={SETTINGS_PAGE_STYLES.settingTitle}>집중 모드</div>
                  <div className={SETTINGS_PAGE_STYLES.settingDescription}>
                    글쓰기에 집중할 수 있도록 UI 요소를 숨깁니다
                  </div>
                </div>
                <div className={SETTINGS_PAGE_STYLES.settingControl}>
                  <Toggle
                    checked={settings?.ui?.focusMode || false}
                    onChange={(checked) => updateSetting('ui', 'focusMode', checked)}
                  />
                </div>
              </div>

              {/* 줄 번호 표시 */}
              <div className={SETTINGS_PAGE_STYLES.settingRow}>
                <div className={SETTINGS_PAGE_STYLES.settingLabel}>
                  <div className={SETTINGS_PAGE_STYLES.settingTitle}>줄 번호 표시</div>
                  <div className={SETTINGS_PAGE_STYLES.settingDescription}>
                    에디터에서 줄 번호를 표시합니다
                  </div>
                </div>
                <div className={SETTINGS_PAGE_STYLES.settingControl}>
                  <Toggle
                    checked={settings?.ui?.showLineNumbers || true}
                    onChange={(checked) => updateSetting('ui', 'showLineNumbers', checked)}
                  />
                </div>
              </div>

              {/* 단어 수 표시 */}
              <div className={SETTINGS_PAGE_STYLES.settingRow}>
                <div className={SETTINGS_PAGE_STYLES.settingLabel}>
                  <div className={SETTINGS_PAGE_STYLES.settingTitle}>단어 수 표시</div>
                  <div className={SETTINGS_PAGE_STYLES.settingDescription}>
                    에디터 하단에 단어 수를 표시합니다
                  </div>
                </div>
                <div className={SETTINGS_PAGE_STYLES.settingControl}>
                  <Toggle
                    checked={settings?.ui?.showWordCount || true}
                    onChange={(checked) => updateSetting('ui', 'showWordCount', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 성능 설정 */}
        {activeSection === 'performance' && (
          <div className={SETTINGS_PAGE_STYLES.sectionCard}>
            <div className={SETTINGS_PAGE_STYLES.sectionHeader}>
              <Cpu className={SETTINGS_PAGE_STYLES.sectionIcon} />
              <h2 className={SETTINGS_PAGE_STYLES.sectionTitle}>성능 설정</h2>
            </div>
            
            <div className={SETTINGS_PAGE_STYLES.settingItem}>
              {/* GPU 가속 */}
              <div className={SETTINGS_PAGE_STYLES.settingRow}>
                <div className={SETTINGS_PAGE_STYLES.settingLabel}>
                  <div className={SETTINGS_PAGE_STYLES.settingTitle}>GPU 가속</div>
                  <div className={SETTINGS_PAGE_STYLES.settingDescription}>
                    그래픽 처리를 위한 GPU 가속을 활성화합니다
                  </div>
                </div>
                <div className={SETTINGS_PAGE_STYLES.settingControl}>
                  <Toggle
                    checked={settings?.performance?.enableGPUAcceleration || true}
                    onChange={(checked) => updateSetting('performance', 'enableGPUAcceleration', checked)}
                  />
                </div>
              </div>

              {/* 하드웨어 가속 */}
              <div className={SETTINGS_PAGE_STYLES.settingRow}>
                <div className={SETTINGS_PAGE_STYLES.settingLabel}>
                  <div className={SETTINGS_PAGE_STYLES.settingTitle}>하드웨어 가속</div>
                  <div className={SETTINGS_PAGE_STYLES.settingDescription}>
                    전체적인 성능 향상을 위한 하드웨어 가속을 활성화합니다
                  </div>
                </div>
                <div className={SETTINGS_PAGE_STYLES.settingControl}>
                  <Toggle
                    checked={settings?.performance?.enableHardwareAcceleration || true}
                    onChange={(checked) => updateSetting('performance', 'enableHardwareAcceleration', checked)}
                  />
                </div>
              </div>

              {/* 최대 CPU 사용률 */}
              <div className={SETTINGS_PAGE_STYLES.settingRow}>
                <div className={SETTINGS_PAGE_STYLES.settingLabel}>
                  <div className={SETTINGS_PAGE_STYLES.settingTitle}>최대 CPU 사용률</div>
                  <div className={SETTINGS_PAGE_STYLES.settingDescription}>
                    앱이 사용할 수 있는 최대 CPU 사용률을 제한합니다
                  </div>
                </div>
                <div className={SETTINGS_PAGE_STYLES.settingControl}>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    step="5"
                    className={SETTINGS_PAGE_STYLES.numberInput}
                    value={settings?.performance?.maxCPUUsage || 80}
                    onChange={(e) => updateSetting('performance', 'maxCPUUsage', parseInt(e.target.value))}
                  />
                  <span className="text-sm text-slate-500">%</span>
                </div>
              </div>

              {/* 최대 메모리 사용량 */}
              <div className={SETTINGS_PAGE_STYLES.settingRow}>
                <div className={SETTINGS_PAGE_STYLES.settingLabel}>
                  <div className={SETTINGS_PAGE_STYLES.settingTitle}>최대 메모리 사용량</div>
                  <div className={SETTINGS_PAGE_STYLES.settingDescription}>
                    앱이 사용할 수 있는 최대 메모리 사용량을 제한합니다
                  </div>
                </div>
                <div className={SETTINGS_PAGE_STYLES.settingControl}>
                  <input
                    type="number"
                    min="100"
                    max="4000"
                    step="100"
                    className={SETTINGS_PAGE_STYLES.numberInput}
                    value={settings?.performance?.maxMemoryUsage || 1000}
                    onChange={(e) => updateSetting('performance', 'maxMemoryUsage', parseInt(e.target.value))}
                  />
                  <span className="text-sm text-slate-500">MB</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className={SETTINGS_PAGE_STYLES.actions}>
        <button
          className={`${SETTINGS_PAGE_STYLES.button} ${SETTINGS_PAGE_STYLES.secondaryButton}`}
          onClick={resetSettings}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          기본값으로 복원
        </button>
        <button
          className={`${SETTINGS_PAGE_STYLES.button} ${SETTINGS_PAGE_STYLES.primaryButton}`}
          onClick={saveAllSettings}
          disabled={saving}
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? '저장 중...' : '모든 설정 저장'}
        </button>
      </div>
    </div>
  );
}
