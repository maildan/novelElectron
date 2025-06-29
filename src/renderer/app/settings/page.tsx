'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Keyboard,
  Monitor,
  Save,
  RotateCcw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Toggle } from '../../components/ui/Toggle';
import { Badge } from '../../components/ui/Badge';
import { Textarea } from '../../components/ui/Textarea';
import { Logger } from '../../../shared/logger';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const SETTINGS_PAGE_STYLES = {
  container: 'container mx-auto px-4 py-6 max-w-4xl space-y-6',
  pageTitle: 'text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6',
  nav: 'flex flex-wrap gap-2 mb-6',
  navButton: 'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
  navButtonActive: 'bg-blue-600 text-white',
  navButtonInactive: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
  section: 'space-y-6',
  sectionCard: 'p-6',
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
  actions: 'flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700',
  badge: 'ml-2',
} as const;

// 🔥 기가차드 규칙: 명시적 타입 정의
type SettingSection = 'profile' | 'notifications' | 'privacy' | 'appearance' | 'keyboard' | 'data';

interface SettingsData {
  readonly profile: {
    name: string;
    email: string;
    bio: string;
  };
  readonly notifications: {
    emailNotifications: boolean;
    desktopNotifications: boolean;
    soundEnabled: boolean;
    dailyReminders: boolean;
  };
  readonly privacy: {
    dataCollection: boolean;
    anonymousAnalytics: boolean;
    cloudSync: boolean;
  };
  readonly appearance: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    sidebarCollapsed: boolean;
  };
  readonly keyboard: {
    monitoringEnabled: boolean;
    excludePasswords: boolean;
    trackApplications: boolean;
    autoStartMonitoring: boolean;
  };
  readonly data: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    retentionPeriod: number;
  };
}

const INITIAL_SETTINGS: SettingsData = {
  profile: {
    name: 'Loop 사용자',
    email: 'writer@example.com',
    bio: 'Loop을 사용하여 더 나은 글쓰기를 추구하는 작가입니다.'
  },
  notifications: {
    emailNotifications: true,
    desktopNotifications: true,
    soundEnabled: false,
    dailyReminders: true
  },
  privacy: {
    dataCollection: true,
    anonymousAnalytics: true,
    cloudSync: false
  },
  appearance: {
    theme: 'system',
    fontSize: 'medium',
    sidebarCollapsed: false
  },
  keyboard: {
    monitoringEnabled: true,
    excludePasswords: true,
    trackApplications: false,
    autoStartMonitoring: true
  },
  data: {
    autoBackup: true,
    backupFrequency: 'weekly',
    retentionPeriod: 365
  }
};

const SETTING_SECTIONS: Array<{
  id: SettingSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'profile', label: '프로필', icon: User },
  { id: 'notifications', label: '알림', icon: Bell },
  { id: 'privacy', label: '개인정보', icon: Shield },
  { id: 'appearance', label: '외관', icon: Palette },
  { id: 'keyboard', label: '키보드', icon: Keyboard },
  { id: 'data', label: '데이터', icon: Database },
];

export default function SettingsPage(): React.ReactElement {
  const [activeSection, setActiveSection] = useState<SettingSection>('profile');
  const [settings, setSettings] = useState<SettingsData>(INITIAL_SETTINGS);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  React.useEffect(() => {
    Logger.info('SETTINGS_PAGE', 'Settings page loaded');
  }, []);

  const updateSetting = <T extends keyof SettingsData>(
    section: T,
    key: keyof SettingsData[T],
    value: SettingsData[T][keyof SettingsData[T]]
  ): void => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
    Logger.debug('SETTINGS_PAGE', `Setting updated: ${section}.${String(key)}`, { value });
  };

  const handleSave = async (): Promise<void> => {
    try {
      // TODO: 실제 구현 시 IPC 통신으로 설정 저장
      // await window.electronAPI.saveSettings(settings);
      
      setHasChanges(false);
      Logger.info('SETTINGS_PAGE', 'Settings saved successfully');
      alert('설정이 저장되었습니다.');
    } catch (error) {
      Logger.error('SETTINGS_PAGE', 'Failed to save settings', error);
      alert('설정 저장 중 오류가 발생했습니다.');
    }
  };

  const handleReset = (): void => {
    if (confirm('모든 설정을 기본값으로 초기화하시겠습니까?')) {
      setSettings(INITIAL_SETTINGS);
      setHasChanges(true);
      Logger.info('SETTINGS_PAGE', 'Settings reset to defaults');
    }
  };

  const renderProfileSection = (): React.ReactElement => (
    <div className={SETTINGS_PAGE_STYLES.settingItem}>
      <div className={SETTINGS_PAGE_STYLES.inputGroup}>
        <label className={SETTINGS_PAGE_STYLES.inputLabel}>이름</label>
        <Input
          type="text"
          value={settings.profile.name}
          onChange={(e) => updateSetting('profile', 'name', e.target.value)}
          placeholder="이름을 입력하세요"
        />
      </div>
      
      <div className={SETTINGS_PAGE_STYLES.inputGroup}>
        <label className={SETTINGS_PAGE_STYLES.inputLabel}>이메일</label>
        <Input
          type="email"
          value={settings.profile.email}
          onChange={(e) => updateSetting('profile', 'email', e.target.value)}
          placeholder="이메일을 입력하세요"
        />
      </div>

      <div className={SETTINGS_PAGE_STYLES.inputGroup}>
        <label className={SETTINGS_PAGE_STYLES.inputLabel}>소개</label>
        <Textarea
          value={settings.profile.bio}
          onChange={(e) => updateSetting('profile', 'bio', e.target.value)}
          placeholder="자신을 소개해보세요"
          rows={3}
        />
      </div>
    </div>
  );

  const renderNotificationsSection = (): React.ReactElement => (
    <div className={SETTINGS_PAGE_STYLES.settingItem}>
      <div className={SETTINGS_PAGE_STYLES.settingRow}>
        <div className={SETTINGS_PAGE_STYLES.settingLabel}>
          <div className={SETTINGS_PAGE_STYLES.settingTitle}>이메일 알림</div>
          <div className={SETTINGS_PAGE_STYLES.settingDescription}>
            중요한 업데이트와 요약을 이메일로 받습니다
          </div>
        </div>
        <div className={SETTINGS_PAGE_STYLES.settingControl}>
          <Toggle
            checked={settings.notifications.emailNotifications}
            onChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
            aria-label="이메일 알림 토글"
          />
        </div>
      </div>

      <div className={SETTINGS_PAGE_STYLES.settingRow}>
        <div className={SETTINGS_PAGE_STYLES.settingLabel}>
          <div className={SETTINGS_PAGE_STYLES.settingTitle}>데스크톱 알림</div>
          <div className={SETTINGS_PAGE_STYLES.settingDescription}>
            시스템 알림으로 실시간 업데이트를 받습니다
          </div>
        </div>
        <div className={SETTINGS_PAGE_STYLES.settingControl}>
          <Toggle
            checked={settings.notifications.desktopNotifications}
            onChange={(checked) => updateSetting('notifications', 'desktopNotifications', checked)}
            aria-label="데스크톱 알림 토글"
          />
        </div>
      </div>

      <div className={SETTINGS_PAGE_STYLES.settingRow}>
        <div className={SETTINGS_PAGE_STYLES.settingLabel}>
          <div className={SETTINGS_PAGE_STYLES.settingTitle}>사운드</div>
          <div className={SETTINGS_PAGE_STYLES.settingDescription}>
            알림 시 소리로 알려줍니다
          </div>
        </div>
        <div className={SETTINGS_PAGE_STYLES.settingControl}>
          <Toggle
            checked={settings.notifications.soundEnabled}
            onChange={(checked) => updateSetting('notifications', 'soundEnabled', checked)}
            aria-label="알림 사운드 토글"
          />
        </div>
      </div>

      <div className={SETTINGS_PAGE_STYLES.settingRow}>
        <div className={SETTINGS_PAGE_STYLES.settingLabel}>
          <div className={SETTINGS_PAGE_STYLES.settingTitle}>일일 리마인더</div>
          <div className={SETTINGS_PAGE_STYLES.settingDescription}>
            매일 글쓰기 목표를 상기시켜줍니다
          </div>
        </div>
        <div className={SETTINGS_PAGE_STYLES.settingControl}>
          <Toggle
            checked={settings.notifications.dailyReminders}
            onChange={(checked) => updateSetting('notifications', 'dailyReminders', checked)}
            aria-label="일일 리마인더 토글"
          />
          <Badge variant="primary" size="sm" className={SETTINGS_PAGE_STYLES.badge}>
            추천
          </Badge>
        </div>
      </div>
    </div>
  );

  const renderKeyboardSection = (): React.ReactElement => (
    <div className={SETTINGS_PAGE_STYLES.settingItem}>
      <div className={SETTINGS_PAGE_STYLES.settingRow}>
        <div className={SETTINGS_PAGE_STYLES.settingLabel}>
          <div className={SETTINGS_PAGE_STYLES.settingTitle}>키보드 모니터링</div>
          <div className={SETTINGS_PAGE_STYLES.settingDescription}>
            타이핑 분석을 위해 키보드 입력을 모니터링합니다
          </div>
        </div>
        <div className={SETTINGS_PAGE_STYLES.settingControl}>
          <Toggle
            checked={settings.keyboard.monitoringEnabled}
            onChange={(checked) => updateSetting('keyboard', 'monitoringEnabled', checked)}
            aria-label="키보드 모니터링 토글"
          />
        </div>
      </div>

      <div className={SETTINGS_PAGE_STYLES.settingRow}>
        <div className={SETTINGS_PAGE_STYLES.settingLabel}>
          <div className={SETTINGS_PAGE_STYLES.settingTitle}>비밀번호 필드 제외</div>
          <div className={SETTINGS_PAGE_STYLES.settingDescription}>
            보안을 위해 비밀번호 입력은 기록하지 않습니다
          </div>
        </div>
        <div className={SETTINGS_PAGE_STYLES.settingControl}>
          <Toggle
            checked={settings.keyboard.excludePasswords}
            onChange={(checked) => updateSetting('keyboard', 'excludePasswords', checked)}
            aria-label="비밀번호 필드 제외 토글"
          />
          <Badge variant="success" size="sm" className={SETTINGS_PAGE_STYLES.badge}>
            보안
          </Badge>
        </div>
      </div>

      <div className={SETTINGS_PAGE_STYLES.settingRow}>
        <div className={SETTINGS_PAGE_STYLES.settingLabel}>
          <div className={SETTINGS_PAGE_STYLES.settingTitle}>애플리케이션 추적</div>
          <div className={SETTINGS_PAGE_STYLES.settingDescription}>
            어떤 앱에서 타이핑했는지 기록합니다
          </div>
        </div>
        <div className={SETTINGS_PAGE_STYLES.settingControl}>
          <Toggle
            checked={settings.keyboard.trackApplications}
            onChange={(checked) => updateSetting('keyboard', 'trackApplications', checked)}
            aria-label="애플리케이션 추적 토글"
          />
        </div>
      </div>

      <div className={SETTINGS_PAGE_STYLES.settingRow}>
        <div className={SETTINGS_PAGE_STYLES.settingLabel}>
          <div className={SETTINGS_PAGE_STYLES.settingTitle}>자동 시작</div>
          <div className={SETTINGS_PAGE_STYLES.settingDescription}>
            Loop 시작 시 자동으로 모니터링을 시작합니다
          </div>
        </div>
        <div className={SETTINGS_PAGE_STYLES.settingControl}>
          <Toggle
            checked={settings.keyboard.autoStartMonitoring}
            onChange={(checked) => updateSetting('keyboard', 'autoStartMonitoring', checked)}
            aria-label="자동 시작 토글"
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = (): React.ReactElement => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'keyboard':
        return renderKeyboardSection();
      case 'privacy':
      case 'appearance':
      case 'data':
      default:
        return (
          <div className="text-center py-8">
            <Settings className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              이 섹션은 곧 구현될 예정입니다.
            </p>
          </div>
        );
    }
  };

  const getCurrentSectionInfo = () => {
    const section = SETTING_SECTIONS.find(s => s.id === activeSection);
    return section || SETTING_SECTIONS[0];
  };

  const sectionInfo = getCurrentSectionInfo();
  const SectionIcon = sectionInfo.icon;

  return (
    <div className={SETTINGS_PAGE_STYLES.container}>
      <h1 className={SETTINGS_PAGE_STYLES.pageTitle}>설정</h1>

      {/* 네비게이션 */}
      <nav className={SETTINGS_PAGE_STYLES.nav} role="tablist">
        {SETTING_SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`${SETTINGS_PAGE_STYLES.navButton} ${
              activeSection === section.id
                ? SETTINGS_PAGE_STYLES.navButtonActive
                : SETTINGS_PAGE_STYLES.navButtonInactive
            }`}
            onClick={() => setActiveSection(section.id)}
            role="tab"
            aria-selected={activeSection === section.id}
            aria-controls={`settings-${section.id}`}
          >
            {section.label}
          </button>
        ))}
      </nav>

      {/* 설정 섹션 */}
      <div className={SETTINGS_PAGE_STYLES.section}>
        <Card 
          className={SETTINGS_PAGE_STYLES.sectionCard}
          role="tabpanel"
        >
          <div className={SETTINGS_PAGE_STYLES.sectionHeader}>
            <SectionIcon className={SETTINGS_PAGE_STYLES.sectionIcon} />
            <h2 className={SETTINGS_PAGE_STYLES.sectionTitle}>
              {sectionInfo.label}
            </h2>
          </div>

          {renderCurrentSection()}

          {/* 액션 버튼 */}
          <div className={SETTINGS_PAGE_STYLES.actions}>
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              초기화
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              저장
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
