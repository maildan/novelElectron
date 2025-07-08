// 🔥 기가차드 Settings 타입 정의 - electron-store 호환
'use client';

/**
 * 🔥 설정 섹션 타입 (main/settings와 완전 호환)
 */
export type SettingSection = 'app' | 'keyboard' | 'ui' | 'performance';

/**
 * 🔥 설정 데이터 인터페이스 (main/settings/ElectronStoreSettingsManager와 동일)
 */
export interface SettingsData {
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

/**
 * 🔥 설정 섹션 메타데이터
 */
export interface SettingSectionMeta {
  id: SettingSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * 🔥 설정 필드 공통 Props
 */
export interface SettingFieldProps<T = unknown> {
  title: string;
  description: string;
  value: T;
  onChange: (value: T) => void;
}

/**
 * 🔥 토글 컴포넌트 Props
 */
export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/**
 * 🔥 설정 업데이트 함수 타입
 */
export type UpdateSettingFunction = <K extends keyof SettingsData, T extends keyof SettingsData[K]>(
  category: K,
  key: T,
  value: SettingsData[K][T]
) => Promise<void>;
