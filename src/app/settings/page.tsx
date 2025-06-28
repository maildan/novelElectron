'use client';

import { useState, useEffect } from 'react';

// 🔥 기가차드 프리컴파일된 스타일
const SETTINGS_STYLES = {
  container: 'flex h-screen bg-gray-50',
  sidebar: 'w-64 bg-white border-r border-gray-200 flex flex-col',
  sidebarHeader: 'p-6 border-b border-gray-200',
  sidebarNav: 'flex-1 p-4',
  sidebarItem: 'flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 text-gray-700 hover:bg-gray-100 hover:text-blue-600 cursor-pointer',
  sidebarItemActive: 'flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 bg-blue-50 text-blue-600 border-r-2 border-blue-600',
  main: 'flex-1 flex flex-col',
  header: 'bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between',
  content: 'flex-1 p-6 overflow-auto',
  settingsSection: 'bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm',
  sectionTitle: 'text-lg font-semibold text-gray-900 mb-4',
  settingItem: 'flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0',
  settingInfo: 'flex-1',
  settingLabel: 'text-sm font-medium text-gray-900 mb-1',
  settingDescription: 'text-sm text-gray-600',
  toggle: 'relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  toggleActive: 'bg-blue-600',
  toggleButton: 'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
  toggleButtonActive: 'translate-x-6',
  slider: 'w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer',
  select: 'px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-32',
  input: 'px-3 py-2 border border-gray-300 rounded-lg text-sm',
  saveButton: 'bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors',
  resetButton: 'bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors mr-3',
} as const;

// 🔥 사이드바 아이템 정의
const sidebarItems = [
  { id: 'dashboard', label: '대시보드', icon: '📊', href: '/', active: false },
  { id: 'analytics', label: '분석', icon: '📈', href: '/analytics', active: false },
  { id: 'projects', label: '프로젝트', icon: '📁', href: '/projects', active: false },
  { id: 'ai', label: 'Loop AI', icon: '✨', href: '/ai', active: false },
  { id: 'settings', label: '설정', icon: '⚙️', href: '/settings', active: true },
] as const;

interface AppSettings {
  keyboard: {
    enableMonitoring: boolean;
    language: string;
    enableIME: boolean;
    enableGlobalShortcuts: boolean;
    enableAppDetection: boolean;
  };
  notifications: {
    enableNotifications: boolean;
    notificationInterval: number;
    enableSounds: boolean;
  };
  privacy: {
    enableAnalytics: boolean;
    enableCrashReports: boolean;
    dataRetentionDays: number;
  };
  appearance: {
    theme: string;
    language: string;
    showDetailedStats: boolean;
  };
  system: {
    autoLaunch: boolean;
    startMinimized: boolean;
    closeToTray: boolean;
    enableDevTools: boolean;
  };
}

export default function Settings(): React.JSX.Element {
  const [settings, setSettings] = useState<AppSettings>({
    keyboard: {
      enableMonitoring: true,
      language: 'korean',
      enableIME: true,
      enableGlobalShortcuts: false,
      enableAppDetection: true,
    },
    notifications: {
      enableNotifications: true,
      notificationInterval: 60,
      enableSounds: false,
    },
    privacy: {
      enableAnalytics: true,
      enableCrashReports: true,
      dataRetentionDays: 30,
    },
    appearance: {
      theme: 'system',
      language: 'ko',
      showDetailedStats: true,
    },
    system: {
      autoLaunch: false,
      startMinimized: false,
      closeToTray: true,
      enableDevTools: false,
    },
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    // API 사용 가능 확인
    if (typeof window !== 'undefined' && window.electronAPI) {
      console.log('🔥 Settings Electron API 연결 성공!');
      // 실제 설정 데이터 로드
      loadSettings();
    } else {
      console.warn('⚠️ Electron API 없음 - 기본 설정 사용');
    }
  }, []);

  const loadSettings = async (): Promise<void> => {
    try {
      // 실제 설정 로드 로직
      const settingsResult = await window.electronAPI.settings.getAll();
      if (settingsResult.success && settingsResult.data) {
        // 설정 데이터 처리
        console.log('⚙️ 설정 로드 완료');
      }
    } catch (error) {
      console.error('❌ 설정 로드 실패:', error);
    }
  };

  const handleSettingChange = <K extends keyof AppSettings, V extends keyof AppSettings[K]>(
    category: K,
    key: V,
    value: AppSettings[K][V]
  ): void => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = async (): Promise<void> => {
    try {
      if (window.electronAPI) {
        // 실제 설정 저장
        const result = await window.electronAPI.settings.setCategory('app', settings);
        if (result.success) {
          setHasUnsavedChanges(false);
          console.log('✅ 설정 저장 완료');
        }
      } else {
        // 개발 모드용 시뮬레이션
        setHasUnsavedChanges(false);
        console.log('🔧 개발 모드: 설정 저장 시뮬레이션');
      }
    } catch (error) {
      console.error('❌ 설정 저장 실패:', error);
    }
  };

  const handleResetSettings = (): void => {
    if (confirm('설정을 기본값으로 초기화하시겠습니까?')) {
      // 기본 설정으로 리셋
      setSettings({
        keyboard: {
          enableMonitoring: true,
          language: 'korean',
          enableIME: true,
          enableGlobalShortcuts: false,
          enableAppDetection: true,
        },
        notifications: {
          enableNotifications: true,
          notificationInterval: 60,
          enableSounds: false,
        },
        privacy: {
          enableAnalytics: true,
          enableCrashReports: true,
          dataRetentionDays: 30,
        },
        appearance: {
          theme: 'system',
          language: 'ko',
          showDetailedStats: true,
        },
        system: {
          autoLaunch: false,
          startMinimized: false,
          closeToTray: true,
          enableDevTools: false,
        },
      });
      setHasUnsavedChanges(true);
    }
  };

  const ToggleSwitch = ({ 
    checked, 
    onChange 
  }: { 
    checked: boolean; 
    onChange: (checked: boolean) => void; 
  }): React.JSX.Element => (
    <button
      className={`${SETTINGS_STYLES.toggle} ${checked ? SETTINGS_STYLES.toggleActive : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`${SETTINGS_STYLES.toggleButton} ${checked ? SETTINGS_STYLES.toggleButtonActive : ''}`}
      />
    </button>
  );

  return (
    <div className={SETTINGS_STYLES.container}>
      {/* 🔥 사이드바 */}
      <div className={SETTINGS_STYLES.sidebar}>
        <div className={SETTINGS_STYLES.sidebarHeader}>
          <h1 className="text-xl font-bold text-gray-900">Loop</h1>
          <p className="text-sm text-gray-600">Typing Analytics</p>
        </div>
        
        <nav className={SETTINGS_STYLES.sidebarNav}>
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={item.active ? SETTINGS_STYLES.sidebarItemActive : SETTINGS_STYLES.sidebarItem}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
      </div>

      {/* 🔥 메인 컨텐츠 */}
      <div className={SETTINGS_STYLES.main}>
        {/* 헤더 */}
        <div className={SETTINGS_STYLES.header}>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">설정</h2>
            <p className="text-gray-600">애플리케이션 환경설정</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {hasUnsavedChanges && (
              <span className="text-sm text-orange-600">⚠️ 저장되지 않은 변경사항</span>
            )}
            <button
              className={SETTINGS_STYLES.resetButton}
              onClick={handleResetSettings}
            >
              초기화
            </button>
            <button
              className={SETTINGS_STYLES.saveButton}
              onClick={handleSaveSettings}
              disabled={!hasUnsavedChanges}
            >
              저장
            </button>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className={SETTINGS_STYLES.content}>
          {/* 키보드 설정 */}
          <div className={SETTINGS_STYLES.settingsSection}>
            <h3 className={SETTINGS_STYLES.sectionTitle}>⌨️ 키보드 설정</h3>
            
            <div className={SETTINGS_STYLES.settingItem}>
              <div className={SETTINGS_STYLES.settingInfo}>
                <div className={SETTINGS_STYLES.settingLabel}>키보드 모니터링</div>
                <div className={SETTINGS_STYLES.settingDescription}>글로벌 키보드 입력 감지</div>
              </div>
              <ToggleSwitch
                checked={settings.keyboard.enableMonitoring}
                onChange={(checked) => handleSettingChange('keyboard', 'enableMonitoring', checked)}
              />
            </div>

            <div className={SETTINGS_STYLES.settingItem}>
              <div className={SETTINGS_STYLES.settingInfo}>
                <div className={SETTINGS_STYLES.settingLabel}>언어</div>
                <div className={SETTINGS_STYLES.settingDescription}>키보드 입력 언어 설정</div>
              </div>
              <select
                className={SETTINGS_STYLES.select}
                value={settings.keyboard.language}
                onChange={(e) => handleSettingChange('keyboard', 'language', e.target.value)}
              >
                <option value="korean">한국어</option>
                <option value="english">English</option>
                <option value="japanese">日本語</option>
                <option value="chinese">中文</option>
              </select>
            </div>

            <div className={SETTINGS_STYLES.settingItem}>
              <div className={SETTINGS_STYLES.settingInfo}>
                <div className={SETTINGS_STYLES.settingLabel}>IME 지원</div>
                <div className={SETTINGS_STYLES.settingDescription}>한글 입력기 조합 지원</div>
              </div>
              <ToggleSwitch
                checked={settings.keyboard.enableIME}
                onChange={(checked) => handleSettingChange('keyboard', 'enableIME', checked)}
              />
            </div>

            <div className={SETTINGS_STYLES.settingItem}>
              <div className={SETTINGS_STYLES.settingInfo}>
                <div className={SETTINGS_STYLES.settingLabel}>앱 감지</div>
                <div className={SETTINGS_STYLES.settingDescription}>활성 애플리케이션 자동 감지</div>
              </div>
              <ToggleSwitch
                checked={settings.keyboard.enableAppDetection}
                onChange={(checked) => handleSettingChange('keyboard', 'enableAppDetection', checked)}
              />
            </div>
          </div>

          {/* 알림 설정 */}
          <div className={SETTINGS_STYLES.settingsSection}>
            <h3 className={SETTINGS_STYLES.sectionTitle}>🔔 알림 설정</h3>
            
            <div className={SETTINGS_STYLES.settingItem}>
              <div className={SETTINGS_STYLES.settingInfo}>
                <div className={SETTINGS_STYLES.settingLabel}>알림 활성화</div>
                <div className={SETTINGS_STYLES.settingDescription}>데스크톱 알림 표시</div>
              </div>
              <ToggleSwitch
                checked={settings.notifications.enableNotifications}
                onChange={(checked) => handleSettingChange('notifications', 'enableNotifications', checked)}
              />
            </div>

            <div className={SETTINGS_STYLES.settingItem}>
              <div className={SETTINGS_STYLES.settingInfo}>
                <div className={SETTINGS_STYLES.settingLabel}>알림 간격</div>
                <div className={SETTINGS_STYLES.settingDescription}>통계 알림 주기 (분)</div>
              </div>
              <input
                type="number"
                min="5"
                max="240"
                className={SETTINGS_STYLES.input}
                value={settings.notifications.notificationInterval}
                onChange={(e) => handleSettingChange('notifications', 'notificationInterval', parseInt(e.target.value))}
              />
            </div>

            <div className={SETTINGS_STYLES.settingItem}>
              <div className={SETTINGS_STYLES.settingInfo}>
                <div className={SETTINGS_STYLES.settingLabel}>알림음</div>
                <div className={SETTINGS_STYLES.settingDescription}>알림 시 소리 재생</div>
              </div>
              <ToggleSwitch
                checked={settings.notifications.enableSounds}
                onChange={(checked) => handleSettingChange('notifications', 'enableSounds', checked)}
              />
            </div>
          </div>

          {/* 개인정보 설정 */}
          <div className={SETTINGS_STYLES.settingsSection}>
            <h3 className={SETTINGS_STYLES.sectionTitle}>🔒 개인정보 설정</h3>
            
            <div className={SETTINGS_STYLES.settingItem}>
              <div className={SETTINGS_STYLES.settingInfo}>
                <div className={SETTINGS_STYLES.settingLabel}>데이터 분석</div>
                <div className={SETTINGS_STYLES.settingDescription}>익명 사용 통계 수집</div>
              </div>
              <ToggleSwitch
                checked={settings.privacy.enableAnalytics}
                onChange={(checked) => handleSettingChange('privacy', 'enableAnalytics', checked)}
              />
            </div>

            <div className={SETTINGS_STYLES.settingItem}>
              <div className={SETTINGS_STYLES.settingInfo}>
                <div className={SETTINGS_STYLES.settingLabel}>데이터 보관 기간</div>
                <div className={SETTINGS_STYLES.settingDescription}>타이핑 데이터 자동 삭제 기간 (일)</div>
              </div>
              <select
                className={SETTINGS_STYLES.select}
                value={settings.privacy.dataRetentionDays}
                onChange={(e) => handleSettingChange('privacy', 'dataRetentionDays', parseInt(e.target.value))}
              >
                <option value={7}>7일</option>
                <option value={30}>30일</option>
                <option value={90}>90일</option>
                <option value={365}>1년</option>
                <option value={-1}>영구 보관</option>
              </select>
            </div>
          </div>

          {/* 시스템 설정 */}
          <div className={SETTINGS_STYLES.settingsSection}>
            <h3 className={SETTINGS_STYLES.sectionTitle}>💻 시스템 설정</h3>
            
            <div className={SETTINGS_STYLES.settingItem}>
              <div className={SETTINGS_STYLES.settingInfo}>
                <div className={SETTINGS_STYLES.settingLabel}>시스템 시작 시 자동 실행</div>
                <div className={SETTINGS_STYLES.settingDescription}>컴퓨터 부팅 시 Loop 자동 시작</div>
              </div>
              <ToggleSwitch
                checked={settings.system.autoLaunch}
                onChange={(checked) => handleSettingChange('system', 'autoLaunch', checked)}
              />
            </div>

            <div className={SETTINGS_STYLES.settingItem}>
              <div className={SETTINGS_STYLES.settingInfo}>
                <div className={SETTINGS_STYLES.settingLabel}>시작 시 최소화</div>
                <div className={SETTINGS_STYLES.settingDescription}>앱 시작 시 트레이로 최소화</div>
              </div>
              <ToggleSwitch
                checked={settings.system.startMinimized}
                onChange={(checked) => handleSettingChange('system', 'startMinimized', checked)}
              />
            </div>

            <div className={SETTINGS_STYLES.settingItem}>
              <div className={SETTINGS_STYLES.settingInfo}>
                <div className={SETTINGS_STYLES.settingLabel}>트레이로 닫기</div>
                <div className={SETTINGS_STYLES.settingDescription}>X 버튼 클릭 시 트레이로 최소화</div>
              </div>
              <ToggleSwitch
                checked={settings.system.closeToTray}
                onChange={(checked) => handleSettingChange('system', 'closeToTray', checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
