// 🔥 기가차드 앱 설정 섹션 - 최적화
'use client';

import React, { useCallback } from 'react';
import { Settings } from 'lucide-react';
import { SETTINGS_PAGE_STYLES } from '../../constants/styles';
import { SettingItem } from '../controls/SettingItem';
import { Toggle } from '../controls/Toggle';
import type { SettingsData, UpdateSettingFunction } from '../../types';

/**
 * 🔥 앱 설정 섹션 Props
 */
interface AppSettingsSectionProps {
  settings: SettingsData['app'];
  updateSetting: UpdateSettingFunction;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

/**
 * 🔥 앱 설정 섹션 컴포넌트
 */
export const AppSettingsSection = React.memo<AppSettingsSectionProps>(({ 
  settings, 
  updateSetting, 
  setTheme 
}) => {
  // 🔥 테마 변경 핸들러
  const handleThemeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const theme = event.target.value as 'light' | 'dark' | 'system';
    setTheme(theme);
    updateSetting('app', 'theme', theme);
  }, [updateSetting, setTheme]);

  // 🔥 언어 변경 핸들러
  const handleLanguageChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    updateSetting('app', 'language', event.target.value);
  }, [updateSetting]);

  // 🔥 글꼴 크기 변경 핸들러
  const handleFontSizeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(event.target.value, 10);
    if (size >= 10 && size <= 24) {
      updateSetting('app', 'fontSize', size);
    }
  }, [updateSetting]);

  // 🔥 글꼴 패밀리 변경 핸들러
  const handleFontFamilyChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    updateSetting('app', 'fontFamily', event.target.value);
  }, [updateSetting]);

  // 🔥 토글 핸들러들
  const handleAutoSaveToggle = useCallback((checked: boolean) => {
    updateSetting('app', 'autoSave', checked);
  }, [updateSetting]);

  const handleStartMinimizedToggle = useCallback((checked: boolean) => {
    updateSetting('app', 'startMinimized', checked);
  }, [updateSetting]);

  const handleMinimizeToTrayToggle = useCallback((checked: boolean) => {
    updateSetting('app', 'minimizeToTray', checked);
  }, [updateSetting]);

  return (
    <div className={SETTINGS_PAGE_STYLES.sectionCard}>
      <div className={SETTINGS_PAGE_STYLES.sectionHeader}>
        <Settings className={SETTINGS_PAGE_STYLES.sectionIcon} />
        <h2 className={SETTINGS_PAGE_STYLES.sectionTitle}>앱 설정</h2>
      </div>

      <div className={SETTINGS_PAGE_STYLES.settingItem}>
        <SettingItem
          title="테마"
          description="앱의 외관 테마를 선택하세요"
          control={
            <select
              value={settings.theme}
              onChange={handleThemeChange}
              className={SETTINGS_PAGE_STYLES.select}
            >
              <option value="system">시스템</option>
              <option value="light">라이트</option>
              <option value="dark">다크</option>
            </select>
          }
        />

        <SettingItem
          title="언어"
          description="앱에서 사용할 언어를 선택하세요"
          control={
            <select
              value={settings.language}
              onChange={handleLanguageChange}
              className={SETTINGS_PAGE_STYLES.select}
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          }
        />

        <SettingItem
          title="자동 저장"
          description="작업 내용을 자동으로 저장합니다"
          control={
            <Toggle
              checked={settings.autoSave}
              onChange={handleAutoSaveToggle}
            />
          }
        />

        <SettingItem
          title="최소화 상태로 시작"
          description="앱 시작 시 최소화된 상태로 실행합니다"
          control={
            <Toggle
              checked={settings.startMinimized}
              onChange={handleStartMinimizedToggle}
            />
          }
        />

        <SettingItem
          title="시스템 트레이로 최소화"
          description="창을 닫을 때 시스템 트레이로 최소화합니다"
          control={
            <Toggle
              checked={settings.minimizeToTray}
              onChange={handleMinimizeToTrayToggle}
            />
          }
        />

        <SettingItem
          title="글꼴 크기"
          description="앱에서 사용할 글꼴 크기를 설정하세요 (10-24px)"
          control={
            <input
              type="number"
              min="10"
              max="24"
              value={settings.fontSize}
              onChange={handleFontSizeChange}
              className={SETTINGS_PAGE_STYLES.numberInput}
            />
          }
        />

        <SettingItem
          title="글꼴 패밀리"
          description="앱에서 사용할 글꼴을 선택하세요"
          control={
            <select
              value={settings.fontFamily}
              onChange={handleFontFamilyChange}
              className={SETTINGS_PAGE_STYLES.select}
            >
              <option value="Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif">
                Pretendard (기본)
              </option>
              <option value="'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif">
                SF Pro Display
              </option>
              <option value="'Noto Sans KR', sans-serif">
                Noto Sans KR
              </option>
              <option value="'Malgun Gothic', sans-serif">
                맑은 고딕
              </option>
            </select>
          }
        />
      </div>
    </div>
  );
});

AppSettingsSection.displayName = 'AppSettingsSection';
